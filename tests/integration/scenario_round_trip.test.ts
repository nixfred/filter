import { describe, expect, it } from 'vitest';
import { Engine } from '../../src/simulation/engine';
import { computeMetrics } from '../../src/simulation/metrics';
import { computeDigest, decodeScenario, encodeScenario } from '../../src/simulation/serialization';
import { createScenario } from '../../src/simulation/scenario';

// The share loop (FR008, DATA001, docs/TEST_PLAN.md 2.4): a scenario encoded
// to a URL, decoded by a different visitor, reproduces the identical modeled
// history, proven by digest equality.
describe('scenario round trip', () => {
  it('an encoded and decoded scenario reproduces the identical digest', () => {
    const original = createScenario(
      777,
      888,
      { detectableCommunication: 0.8, longTermSurvival: 0.6 },
      { representativePopulationSize: 128, runHorizonYears: 2_000_000_000 },
    );
    const decoded = decodeScenario(encodeScenario(original));
    expect(decoded).not.toBeNull();

    const runA = new Engine(original);
    runA.run();
    const runB = new Engine(decoded as NonNullable<typeof decoded>);
    runB.run();

    const digestA = computeDigest(runA.state, computeMetrics(runA.state));
    const digestB = computeDigest(runB.state, computeMetrics(runB.state));
    expect(digestA).toBe(digestB);
  });

  it('an explicit override equal to the derived default digests identically', () => {
    // docs/DATA_MODEL.md section 3: digests hash resolved parameters.
    const base = createScenario(11, 22, undefined, {
      representativePopulationSize: 128,
      runHorizonYears: 1_000_000_000,
    });
    const explicit = createScenario(11, 22, undefined, {
      representativePopulationSize: 128,
      runHorizonYears: 1_000_000_000,
      // The derived default for interstellarExpansion 0.3 (docs/scenario.ts).
      expansionEffectiveSpeedFractionC: 0.01 + 0.09 * 0.3,
    });
    const runA = new Engine(base);
    runA.run();
    const runB = new Engine(explicit);
    runB.run();
    expect(computeDigest(runA.state, computeMetrics(runA.state))).toBe(
      computeDigest(runB.state, computeMetrics(runB.state)),
    );
  });
});
