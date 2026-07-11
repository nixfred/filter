import { describe, expect, it } from 'vitest';
import { SIMULATION_MODEL_VERSION } from '../../../src/simulation/model_version';

// R015: the simulation model version is independent of the application release and
// travels inside every share URL and digest file. It must be a positive integer.
describe('SIMULATION_MODEL_VERSION', () => {
  it('is a positive integer', () => {
    expect(Number.isInteger(SIMULATION_MODEL_VERSION)).toBe(true);
    expect(SIMULATION_MODEL_VERSION).toBeGreaterThanOrEqual(1);
  });
});
