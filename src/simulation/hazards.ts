// Extinction and survival hazards (docs/simulation_model.md 3.2, 2.2).
// The hazard rate mathematics live in probability.ts; this module owns the
// cause attribution draw and re-exports the hazard constants for consumers.
import { SURVIVAL_HAZARD_SPLIT, TRANSFORMED_AFTER_YEARS } from './probability';
import type { ExtinctionCause } from './types';

export { TRANSFORMED_AFTER_YEARS };

/**
 * Attribute an extinction to a cause using one uniform draw and the
 * documented survival hazard split (docs/DATA_MODEL.md 1.2 default,
 * recorded as speculative in docs/scientific_assumptions.md).
 */
export function drawExtinctionCause(u: number): ExtinctionCause {
  return u < SURVIVAL_HAZARD_SPLIT.selfDestructionWeight ? 'selfDestruction' : 'externalHazard';
}
