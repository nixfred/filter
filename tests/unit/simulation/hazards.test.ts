import { describe, expect, it } from 'vitest';
import { drawExtinctionCause, TRANSFORMED_AFTER_YEARS } from '../../../src/simulation/hazards';
import {
  HAZARD_STATE_MULTIPLIER,
  meanSurvivalYears,
  SURVIVAL_HAZARD_SPLIT,
} from '../../../src/simulation/probability';
import { DEFAULT_CONTROLS } from '../../../src/simulation/scenario';

// Extinction and survival hazards (docs/simulation_model.md 3.2, 2.2).
describe('extinction cause attribution', () => {
  it('splits causes at the documented weight boundary', () => {
    expect(drawExtinctionCause(0)).toBe('selfDestruction');
    expect(drawExtinctionCause(SURVIVAL_HAZARD_SPLIT.selfDestructionWeight - 1e-9)).toBe(
      'selfDestruction',
    );
    expect(drawExtinctionCause(SURVIVAL_HAZARD_SPLIT.selfDestructionWeight)).toBe('externalHazard');
    expect(drawExtinctionCause(0.999)).toBe('externalHazard');
  });
});

describe('meanSurvivalYears', () => {
  it('spans 100 years at control 0 to 100 million years at control 1', () => {
    expect(meanSurvivalYears({ ...DEFAULT_CONTROLS, longTermSurvival: 0 })).toBe(100);
    expect(meanSurvivalYears({ ...DEFAULT_CONTROLS, longTermSurvival: 1 })).toBe(100_000_000);
  });

  it('is monotonic in the survival control', () => {
    let previous = 0;
    for (let s = 0; s <= 1.0001; s += 0.1) {
      const mean = meanSurvivalYears({ ...DEFAULT_CONTROLS, longTermSurvival: Math.min(s, 1) });
      expect(mean).toBeGreaterThan(previous);
      previous = mean;
    }
  });
});

describe('hazard constants', () => {
  it('halves the interstellar hazard and keeps the transformed threshold', () => {
    expect(HAZARD_STATE_MULTIPLIER.technology).toBe(1);
    expect(HAZARD_STATE_MULTIPLIER.detectable).toBe(1);
    expect(HAZARD_STATE_MULTIPLIER.interstellar).toBe(0.5);
    expect(TRANSFORMED_AFTER_YEARS).toBe(5_000_000);
  });
});
