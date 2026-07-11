import { describe, expect, it } from 'vitest';
import { Engine } from '../../../src/simulation/engine';
import { computeMetrics } from '../../../src/simulation/metrics';
import {
  computeDigest,
  decodeScenario,
  encodeScenario,
} from '../../../src/simulation/serialization';
import { createScenario } from '../../../src/simulation/scenario';

// Advanced overrides flow through the share URL and reproduce the identical
// run (FR003, FR008, DATA001).
describe('advanced overrides round trip', () => {
  it('encodes, decodes, and reproduces an advanced scenario digest', () => {
    const original = createScenario(31, 41, undefined, {
      runHorizonYears: 5_000_000_000,
      representativePopulationSize: 512,
      detectionRecognitionThreshold: 0.25,
      expansionEffectiveSpeedFractionC: 0.08,
      expansionLaunchDelayYears: 3000,
      expansionSettlementDelayYears: 1500,
    });
    const decoded = decodeScenario(encodeScenario(original));
    expect(decoded).not.toBeNull();
    expect(decoded?.advanced.runHorizonYears).toBe(5_000_000_000);
    expect(decoded?.advanced.representativePopulationSize).toBe(512);

    const a = new Engine(original);
    a.run();
    const b = new Engine(decoded as NonNullable<typeof decoded>);
    b.run();
    expect(computeDigest(a.state, computeMetrics(a.state))).toBe(
      computeDigest(b.state, computeMetrics(b.state)),
    );
  });

  it('a shorter run horizon produces an earlier run end', () => {
    const short = createScenario(7, 8, undefined, {
      runHorizonYears: 1_000_000_000,
      representativePopulationSize: 256,
    });
    const long = createScenario(7, 8, undefined, {
      runHorizonYears: 10_000_000_000,
      representativePopulationSize: 256,
    });
    const s = new Engine(short);
    s.run();
    const l = new Engine(long);
    l.run();
    const sEnd = s.state.events[s.state.events.length - 1].atYear;
    const lEnd = l.state.events[l.state.events.length - 1].atYear;
    expect(sEnd).toBeLessThanOrEqual(1_000_000_000);
    expect(lEnd).toBeGreaterThanOrEqual(sEnd);
  });
});
