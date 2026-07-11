import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { Engine } from '../../../src/simulation/engine';
import { computeMetrics } from '../../../src/simulation/metrics';
import {
  computeDigest,
  encodeScenario,
  MAX_SHARE_URL_LENGTH,
} from '../../../src/simulation/serialization';
import { validateScenario } from '../../../src/simulation/schema';
import { createScenario } from '../../../src/simulation/scenario';
import { systemDistanceLy } from '../../../src/simulation/light_cone';
import type { Scenario } from '../../../src/simulation/types';

// The eight invariants (packet 03 section 17, docs/TEST_PLAN.md 2.2), each a
// fast-check property over seeds and clamped parameter ranges. The property
// seed is committed, never random per run (NFR010).
fc.configureGlobal({ seed: 424242, numRuns: 20, endOnFailure: true });

const controlArb = fc.double({ min: 0, max: 1, noNaN: true });

const scenarioArb: fc.Arbitrary<Scenario> = fc
  .record({
    seedA: fc.integer({ min: 0, max: 0xffffffff }),
    seedB: fc.integer({ min: 0, max: 0xffffffff }),
    lifeEmergence: controlArb,
    intelligenceEmergence: controlArb,
    technologicalTransition: controlArb,
    longTermSurvival: controlArb,
    detectableCommunication: controlArb,
    interstellarExpansion: controlArb,
  })
  .map((r) =>
    createScenario(
      r.seedA,
      r.seedB,
      {
        lifeEmergence: r.lifeEmergence,
        intelligenceEmergence: r.intelligenceEmergence,
        technologicalTransition: r.technologicalTransition,
        longTermSurvival: r.longTermSurvival,
        detectableCommunication: r.detectableCommunication,
        interstellarExpansion: r.interstellarExpansion,
      },
      // Small population and horizon keep property runs fast while
      // exercising every mechanism.
      { representativePopulationSize: 64, runHorizonYears: 1_000_000_000 },
    ),
  );

function completedRun(scenario: Scenario) {
  const engine = new Engine(scenario);
  engine.run();
  return engine.state;
}

describe('simulation invariants', () => {
  it('1. no event occurs before its cause', () => {
    fc.assert(
      fc.property(scenarioArb, (scenario) => {
        const state = completedRun(scenario);
        const byId = new Map(state.events.map((e) => [e.id, e]));
        for (const event of state.events) {
          if (event.causeEventId === null) continue;
          const cause = byId.get(event.causeEventId);
          expect(cause).toBeDefined();
          expect(event.atYear).toBeGreaterThanOrEqual((cause as { atYear: number }).atYear);
        }
      }),
    );
  });

  it('2. no civilization appears before its host world is eligible', () => {
    fc.assert(
      fc.property(scenarioArb, (scenario) => {
        const state = completedRun(scenario);
        for (const civ of state.civilizations) {
          const habitable = civ.stateHistory.find((h) => h.state === 'habitable_world');
          const life = civ.stateHistory.find((h) => h.state === 'life');
          expect(habitable).toBeDefined();
          if (life && habitable) {
            expect(life.atYear).toBeGreaterThanOrEqual(habitable.atYear);
          }
        }
      }),
    );
  });

  it('3. no signal arrives faster than the causal speed', () => {
    fc.assert(
      fc.property(scenarioArb, (scenario) => {
        const state = completedRun(scenario);
        for (const event of state.events) {
          if (event.type !== 'DetectionEvent') continue;
          const signal = state.signals[event.signalId];
          const receiver = state.civilizations[event.receivingCivilizationId];
          const d = systemDistanceLy(
            signal.originPosition,
            state.systems[receiver.hostSystemId].position,
          );
          expect(event.atYear).toBeGreaterThanOrEqual(signal.emissionStartYear + Math.round(d) - 1);
        }
      }),
    );
  });

  it('4. no travel front exceeds its configured speed', () => {
    fc.assert(
      fc.property(scenarioArb, (scenario) => {
        const state = completedRun(scenario);
        for (const event of state.events) {
          if (event.type !== 'ExpansionSettlement') continue;
          const frontier = state.frontiers[event.frontierId];
          const source = state.civilizations[frontier.sourceCivilizationId];
          const home = state.systems[source.hostSystemId];
          const target = state.systems[event.systemId];
          const d = systemDistanceLy(home.position, target.position);
          const earliest =
            frontier.originYear +
            frontier.launchDelayYears +
            Math.round(d / frontier.effectiveSpeedFractionC) +
            frontier.settlementDelayYears;
          expect(event.atYear).toBeGreaterThanOrEqual(earliest - 1);
        }
      }),
    );
  });

  it('5. extinct civilizations never start a new emission, in transit signals persist', () => {
    fc.assert(
      fc.property(scenarioArb, (scenario) => {
        const state = completedRun(scenario);
        for (const event of state.events) {
          if (event.type !== 'SignalEmissionStart') continue;
          const signal = state.signals[event.signalId];
          const source = state.civilizations[signal.sourceCivilizationId];
          const extinct = source.stateHistory.find((h) => h.state === 'extinct');
          if (extinct) {
            expect(event.atYear).toBeLessThanOrEqual(extinct.atYear);
          }
        }
      }),
    );
  });

  it('6. aggregate counts remain internally consistent', () => {
    fc.assert(
      fc.property(scenarioArb, (scenario) => {
        const state = completedRun(scenario);
        const m = computeMetrics(state);
        expect(m.detectableCivilizationCount).toBeLessThanOrEqual(m.technologicalCivilizationCount);
        expect(m.technologicalCivilizationCount).toBeLessThanOrEqual(m.intelligentSpeciesCount);
        expect(m.intelligentSpeciesCount).toBeLessThanOrEqual(m.independentLifeOriginCount);
        expect(m.independentLifeOriginCount).toBeLessThanOrEqual(m.candidateWorldCount);
        expect(m.disappearedCivilizationCount).toBeLessThanOrEqual(state.civilizations.length);
        expect(m.confirmedContactCount).toBeLessThanOrEqual(m.signalOverlapCount);
      }),
    );
  });

  it('7. the same seed and parameters produce the same final digest', () => {
    fc.assert(
      fc.property(scenarioArb, (scenario) => {
        const a = completedRun(scenario);
        const b = completedRun(scenario);
        expect(computeDigest(a, computeMetrics(a))).toBe(computeDigest(b, computeMetrics(b)));
      }),
      { numRuns: 8 },
    );
  });

  it('8. invalid inputs are rejected or clamped deterministically', () => {
    fc.assert(
      fc.property(fc.anything(), (junk) => {
        const first = validateScenario(junk);
        const second = validateScenario(junk);
        expect(first).toEqual(second);
      }),
      { numRuns: 200 },
    );
  });

  it('share URL length budget holds for any valid scenario (DATA001)', () => {
    fc.assert(
      fc.property(scenarioArb, (scenario) => {
        expect(encodeScenario(scenario).length).toBeLessThanOrEqual(MAX_SHARE_URL_LENGTH);
      }),
      { numRuns: 200 },
    );
  });
});
