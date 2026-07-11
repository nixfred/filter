// The hidden blend (ruling R018): how the six main controls map to each
// transition's eligibility probability, mean waiting time, and hazard rate
// (docs/simulation_model.md sections 2.2 and 3, docs/DATA_MODEL.md 1.1).
//
// Every constant below is a documented modeling choice, not an empirical
// claim (docs/scientific_assumptions.md section 4). The advanced panel
// discloses these formulas per ruling R018.
import type { MainControls, TransitionId } from './types';
import { clamp01 } from '../utils/math';

export interface ProgressionParams {
  /** Probability the transition is ever eligible for a given system. */
  eligibility: number;
  /** Mean of the exponential waiting time, in years. */
  meanWaitYears: number;
}

/**
 * Progression transition parameters (docs/simulation_model.md 3.1).
 * habitabilityWeight applies only to candidate_to_habitable (DATA_MODEL 2.1).
 */
export function progressionParams(
  transition: TransitionId,
  c: MainControls,
  habitabilityWeight: number,
): ProgressionParams {
  switch (transition) {
    case 'candidate_to_habitable':
      // Background rate with a minor secondary blend from lifeEmergence.
      return {
        eligibility: clamp01((0.3 + 0.1 * c.lifeEmergence) * habitabilityWeight),
        meanWaitYears: 1_500_000_000,
      };
    case 'habitable_to_life':
      return { eligibility: clamp01(c.lifeEmergence), meanWaitYears: 800_000_000 };
    case 'life_to_complex':
      // Background rate with a minor secondary blend from intelligenceEmergence,
      // which also shortens the mean wait (DATA_MODEL 1.1 secondary blend).
      return {
        eligibility: clamp01(0.5 + 0.15 * c.intelligenceEmergence),
        meanWaitYears: Math.round(2_000_000_000 - 500_000_000 * c.intelligenceEmergence),
      };
    case 'complex_to_intelligence':
      return { eligibility: clamp01(c.intelligenceEmergence), meanWaitYears: 500_000_000 };
    case 'intelligence_to_technology':
      return { eligibility: clamp01(c.technologicalTransition), meanWaitYears: 2_000_000 };
    case 'technology_to_detectable':
      // The same control also sets onset delay and window duration below.
      return { eligibility: clamp01(c.detectableCommunication), meanWaitYears: 5_000 };
    case 'detectable_to_interstellar':
      return { eligibility: clamp01(c.interstellarExpansion), meanWaitYears: 20_000 };
  }
}

/**
 * Detectable window duration mean, in years (docs/simulation_model.md
 * section 5): louder cultures broadcast longer. 1,000 years at control 0
 * up to 5,000,000 years at control 1. The upper end represents the
 * optimistic beacon building assumption; without it, no parameter setting
 * can ever produce temporal overlap across galactic distances, and the
 * packet's occasional contact presets would be unreachable. Extinction
 * truncates an active emission (the engine enforces this), so the realized
 * window is min(drawn duration, survival).
 */
export function detectableWindowMeanYears(c: MainControls): number {
  return Math.round(1_000 + 4_999_000 * clamp01(c.detectableCommunication));
}

/**
 * Extinction hazard (docs/simulation_model.md 3.2): a constant hazard whose
 * mean survival time scales exponentially with longTermSurvival, from 100
 * years at 0 to 100 million years at 1 (10^(2 + 6 * control)). Computed with
 * integer powers of ten, no Math.pow.
 */
export function meanSurvivalYears(c: MainControls): number {
  const exponent = 2 + 6 * clamp01(c.longTermSurvival);
  const whole = Math.floor(exponent);
  const frac = exponent - whole;
  // 10^exponent approximated deterministically: exact integer power of ten for
  // the whole part, linear interpolation across the final decade for the
  // fractional part. Monotonic, arithmetic only, documented simplification.
  let base = 1;
  for (let i = 0; i < whole; i++) base *= 10;
  return Math.round(base + base * 9 * frac);
}

/** Per state hazard multipliers (docs/simulation_model.md 3.2). */
export const HAZARD_STATE_MULTIPLIER: Record<'technology' | 'detectable' | 'interstellar', number> =
  {
    technology: 1,
    detectable: 1,
    interstellar: 0.5,
  };

/**
 * The soft transformed threshold: an interstellar civilization that persists
 * this long transitions to transformed (docs/simulation_model.md 2.2).
 */
export const TRANSFORMED_AFTER_YEARS = 5_000_000;

/**
 * Survival hazard split among causes (docs/DATA_MODEL.md 1.2 default,
 * recorded as speculative in docs/scientific_assumptions.md).
 */
export const SURVIVAL_HAZARD_SPLIT = {
  selfDestructionWeight: 0.6,
  externalHazardWeight: 0.4,
};

/**
 * Signal strength falloff (docs/simulation_model.md section 5): effective
 * strength at distance d is strength / (1 + d / HALF_STRENGTH_DISTANCE_LY),
 * a documented monotonic falloff evaluated with plain arithmetic.
 */
export const HALF_STRENGTH_DISTANCE_LY = 10_000;

export function effectiveStrengthAt(strength: number, distanceLy: number): number {
  return strength / (1 + distanceLy / HALF_STRENGTH_DISTANCE_LY);
}
