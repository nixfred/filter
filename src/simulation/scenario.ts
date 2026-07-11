// Scenario construction and effective parameter resolution
// (docs/DATA_MODEL.md sections 1.1 and 1.2, ruling R018 hidden blend).
import { SIMULATION_MODEL_VERSION } from './model_version';
import type { AdvancedParams, EffectiveParameters, MainControls, Scenario } from './types';
import { clamp, clamp01 } from '../utils/math';

export const SCHEMA_VERSION = 1;

/** Documented architecture level defaults (docs/DATA_MODEL.md 1.1). */
export const DEFAULT_CONTROLS: MainControls = {
  lifeEmergence: 0.5,
  intelligenceEmergence: 0.4,
  technologicalTransition: 0.5,
  longTermSurvival: 0.5,
  detectableCommunication: 0.5,
  interstellarExpansion: 0.3,
};

export const DEFAULT_RUN_HORIZON_YEARS = 10_000_000_000;

/** Bounded for worker performance (docs/DATA_MODEL.md 1.2, FR023). */
export const DEFAULT_REPRESENTATIVE_POPULATION = 2048;
export const MAX_REPRESENTATIVE_POPULATION = 8192;

/** Default recognition threshold (docs/simulation_model.md section 5). */
export const DEFAULT_DETECTION_RECOGNITION_THRESHOLD = 0.1;

export const DEFAULT_EXPANSION_LAUNCH_DELAY_YEARS = 1_000;
export const DEFAULT_EXPANSION_SETTLEMENT_DELAY_YEARS = 500;

export function createScenario(
  seedA: number,
  seedB: number,
  controls: Partial<MainControls> = {},
  advanced: AdvancedParams = {},
): Scenario {
  return {
    schemaVersion: SCHEMA_VERSION,
    simulationModelVersion: SIMULATION_MODEL_VERSION,
    seedA: seedA >>> 0,
    seedB: seedB >>> 0,
    controls: { ...DEFAULT_CONTROLS, ...controls },
    advanced: { ...advanced },
  };
}

/**
 * Resolve every advanced field to its effective value, deriving unset fields
 * from the six main controls' hidden blend (ruling R018). The digest hashes
 * these resolved values, so an explicit override equal to the derived default
 * produces the same digest as no override (docs/DATA_MODEL.md section 3).
 */
export function resolveEffectiveParameters(scenario: Scenario): EffectiveParameters {
  const c = scenario.controls;
  const a = scenario.advanced;
  return {
    runHorizonYears: clamp(
      Math.round(a.runHorizonYears ?? DEFAULT_RUN_HORIZON_YEARS),
      1_000_000,
      100_000_000_000,
    ),
    representativePopulationSize: clamp(
      Math.round(a.representativePopulationSize ?? DEFAULT_REPRESENTATIVE_POPULATION),
      64,
      MAX_REPRESENTATIVE_POPULATION,
    ),
    detectionRecognitionThreshold: clamp01(
      a.detectionRecognitionThreshold ?? DEFAULT_DETECTION_RECOGNITION_THRESHOLD,
    ),
    // Blend: interstellarExpansion also sets the default effective speed
    // (docs/DATA_MODEL.md 1.1): 0.01c at control 0 up to 0.10c at control 1.
    expansionEffectiveSpeedFractionC: clamp(
      a.expansionEffectiveSpeedFractionC ?? 0.01 + 0.09 * clamp01(c.interstellarExpansion),
      0.001,
      0.999,
    ),
    expansionLaunchDelayYears: clamp(
      Math.round(a.expansionLaunchDelayYears ?? DEFAULT_EXPANSION_LAUNCH_DELAY_YEARS),
      0,
      1_000_000,
    ),
    expansionSettlementDelayYears: clamp(
      Math.round(a.expansionSettlementDelayYears ?? DEFAULT_EXPANSION_SETTLEMENT_DELAY_YEARS),
      0,
      1_000_000,
    ),
  };
}
