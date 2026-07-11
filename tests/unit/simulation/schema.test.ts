import { describe, expect, it } from 'vitest';
import { validateScenario } from '../../../src/simulation/schema';
import { createScenario } from '../../../src/simulation/scenario';
import { SIMULATION_MODEL_VERSION } from '../../../src/simulation/model_version';

// Scenario validation: clamp or reject deterministically (FR026, SEC002,
// docs/TEST_PLAN.md 2.1 area 12).
describe('validateScenario', () => {
  it('accepts a well formed scenario unchanged', () => {
    const scenario = createScenario(1, 2, { lifeEmergence: 0.7 });
    const result = validateScenario(scenario);
    expect(result.ok).toBe(true);
    if (result.ok) {
      // createScenario snaps controls to the uint16 wire grid so a run and its
      // shared reproduction are identical (FR008), so the value is 0.7 within
      // wire precision, not exactly 0.7.
      expect(result.scenario.controls.lifeEmergence).toBeCloseTo(0.7, 4);
      expect(result.scenario.seedA).toBe(1);
    }
  });

  it('clamps out of range control values deterministically', () => {
    const scenario = createScenario(1, 2);
    (scenario.controls as { lifeEmergence: number }).lifeEmergence = 9.5;
    const first = validateScenario(scenario);
    const second = validateScenario(scenario);
    expect(first.ok).toBe(true);
    if (first.ok && second.ok) {
      expect(first.scenario.controls.lifeEmergence).toBe(1);
      expect(second.scenario.controls.lifeEmergence).toBe(1);
    }
  });

  it('clamps oversized advanced values instead of trusting them', () => {
    const scenario = createScenario(1, 2, {}, { representativePopulationSize: 10_000_000 });
    const result = validateScenario(scenario);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.scenario.advanced.representativePopulationSize).toBeLessThanOrEqual(8192);
    }
  });

  it('rejects the same malformed input the same way every time', () => {
    const bad = { schemaVersion: 1, simulationModelVersion: SIMULATION_MODEL_VERSION };
    const first = validateScenario(bad);
    const second = validateScenario(bad);
    expect(first).toEqual(second);
    expect(first.ok).toBe(false);
  });

  it('rejects non object, wrong schema, and wrong model version inputs', () => {
    expect(validateScenario(null).ok).toBe(false);
    expect(validateScenario('text').ok).toBe(false);
    expect(validateScenario({ ...createScenario(1, 2), schemaVersion: 99 }).ok).toBe(false);
    expect(validateScenario({ ...createScenario(1, 2), simulationModelVersion: 999 }).ok).toBe(
      false,
    );
  });

  it('rejects non numeric control values', () => {
    const scenario = createScenario(1, 2) as unknown as Record<string, unknown>;
    (scenario.controls as Record<string, unknown>).lifeEmergence = 'high';
    expect(validateScenario(scenario).ok).toBe(false);
  });
});
