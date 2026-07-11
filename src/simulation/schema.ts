// Scenario validation: clamp or reject deterministically (FR026, SEC002).
// Hostile, malformed, or oversized input never partially trusted: the same
// input always yields the same clamped scenario or the same rejection.
import { SIMULATION_MODEL_VERSION } from './model_version';
import { DEFAULT_CONTROLS, MAX_REPRESENTATIVE_POPULATION, SCHEMA_VERSION } from './scenario';
import type { AdvancedParams, MainControls, Scenario } from './types';
import { clamp, clamp01 } from '../utils/math';

export type ValidationResult = { ok: true; scenario: Scenario } | { ok: false; reason: string };

const CONTROL_KEYS: (keyof MainControls)[] = [
  'lifeEmergence',
  'intelligenceEmergence',
  'technologicalTransition',
  'longTermSurvival',
  'detectableCommunication',
  'interstellarExpansion',
];

function asFiniteNumber(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

/**
 * Validate an untrusted scenario shaped value. Numeric fields clamp into
 * range; structurally missing or non numeric required fields reject.
 */
export function validateScenario(input: unknown): ValidationResult {
  if (typeof input !== 'object' || input === null) {
    return { ok: false, reason: 'scenario_not_object' };
  }
  const raw = input as Record<string, unknown>;

  const schemaVersion = asFiniteNumber(raw.schemaVersion);
  if (schemaVersion === null || schemaVersion !== SCHEMA_VERSION) {
    return { ok: false, reason: 'unsupported_schema_version' };
  }
  const modelVersion = asFiniteNumber(raw.simulationModelVersion);
  if (modelVersion === null || modelVersion !== SIMULATION_MODEL_VERSION) {
    return { ok: false, reason: 'model_version_mismatch' };
  }
  const seedA = asFiniteNumber(raw.seedA);
  const seedB = asFiniteNumber(raw.seedB);
  if (seedA === null || seedB === null) {
    return { ok: false, reason: 'seed_missing' };
  }

  const rawControls = (raw.controls ?? {}) as Record<string, unknown>;
  const controls = {} as MainControls;
  for (const key of CONTROL_KEYS) {
    const v = asFiniteNumber(rawControls[key]);
    if (v === null) return { ok: false, reason: `control_invalid_${key}` };
    controls[key] = clamp01(v);
  }

  const rawAdvanced = (raw.advanced ?? {}) as Record<string, unknown>;
  const advanced: AdvancedParams = {};
  const horizon = asFiniteNumber(rawAdvanced.runHorizonYears);
  if (horizon !== null) {
    advanced.runHorizonYears = clamp(Math.round(horizon), 1_000_000, 100_000_000_000);
  }
  const pop = asFiniteNumber(rawAdvanced.representativePopulationSize);
  if (pop !== null) {
    advanced.representativePopulationSize = clamp(
      Math.round(pop),
      64,
      MAX_REPRESENTATIVE_POPULATION,
    );
  }
  const threshold = asFiniteNumber(rawAdvanced.detectionRecognitionThreshold);
  if (threshold !== null) advanced.detectionRecognitionThreshold = clamp01(threshold);
  const speed = asFiniteNumber(rawAdvanced.expansionEffectiveSpeedFractionC);
  if (speed !== null) {
    advanced.expansionEffectiveSpeedFractionC = clamp(speed, 0.001, 0.999);
  }
  const launch = asFiniteNumber(rawAdvanced.expansionLaunchDelayYears);
  if (launch !== null) {
    advanced.expansionLaunchDelayYears = clamp(Math.round(launch), 0, 1_000_000);
  }
  const settle = asFiniteNumber(rawAdvanced.expansionSettlementDelayYears);
  if (settle !== null) {
    advanced.expansionSettlementDelayYears = clamp(Math.round(settle), 0, 1_000_000);
  }

  return {
    ok: true,
    scenario: {
      schemaVersion: SCHEMA_VERSION,
      simulationModelVersion: SIMULATION_MODEL_VERSION,
      seedA: seedA >>> 0,
      seedB: seedB >>> 0,
      controls: { ...DEFAULT_CONTROLS, ...controls },
      advanced,
    },
  };
}
