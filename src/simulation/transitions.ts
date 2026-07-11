// Transition table (docs/simulation_model.md 2.2): topology and ordering.
import type { CivState, TransitionId } from './types';

/** Progression chain order, also the deterministic tie break order. */
export const TRANSITION_ORDER: TransitionId[] = [
  'candidate_to_habitable',
  'habitable_to_life',
  'life_to_complex',
  'complex_to_intelligence',
  'intelligence_to_technology',
  'technology_to_detectable',
  'detectable_to_interstellar',
];

export const TRANSITION_FROM: Record<TransitionId, CivState> = {
  candidate_to_habitable: 'candidate_system',
  habitable_to_life: 'habitable_world',
  life_to_complex: 'life',
  complex_to_intelligence: 'complex_life',
  intelligence_to_technology: 'intelligence',
  technology_to_detectable: 'technology',
  detectable_to_interstellar: 'detectable',
};

export const TRANSITION_TO: Record<TransitionId, CivState> = {
  candidate_to_habitable: 'habitable_world',
  habitable_to_life: 'life',
  life_to_complex: 'complex_life',
  complex_to_intelligence: 'intelligence',
  intelligence_to_technology: 'technology',
  technology_to_detectable: 'detectable',
  detectable_to_interstellar: 'interstellar',
};

/** Numeric index per transition for deterministic queue tie breaking. */
export const TRANSITION_INDEX: Record<TransitionId, number> = Object.fromEntries(
  TRANSITION_ORDER.map((t, i) => [t, i]),
) as Record<TransitionId, number>;

/** States in which a civilization can recognize a signal (R019, section 10). */
export const RECOGNITION_CAPABLE: ReadonlySet<CivState> = new Set([
  'technology',
  'detectable',
  'interstellar',
]);

/** States subject to the continuous extinction hazard (section 3.2). */
export const HAZARD_STATES: ReadonlySet<CivState> = new Set([
  'technology',
  'detectable',
  'interstellar',
]);

export const TERMINAL_STATES: ReadonlySet<CivState> = new Set(['quiet', 'transformed', 'extinct']);
