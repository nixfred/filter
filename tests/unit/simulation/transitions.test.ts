import { describe, expect, it } from 'vitest';
import {
  HAZARD_STATES,
  RECOGNITION_CAPABLE,
  TERMINAL_STATES,
  TRANSITION_FROM,
  TRANSITION_INDEX,
  TRANSITION_ORDER,
  TRANSITION_TO,
} from '../../../src/simulation/transitions';

// State machine topology (FR016, docs/simulation_model.md 2.1, 2.2).
describe('transition table', () => {
  it('chains each transition to the next origin state', () => {
    for (let i = 1; i < TRANSITION_ORDER.length; i++) {
      expect(TRANSITION_TO[TRANSITION_ORDER[i - 1]]).toBe(TRANSITION_FROM[TRANSITION_ORDER[i]]);
    }
  });

  it('starts at candidate_system and ends at interstellar', () => {
    expect(TRANSITION_FROM[TRANSITION_ORDER[0]]).toBe('candidate_system');
    expect(TRANSITION_TO[TRANSITION_ORDER[TRANSITION_ORDER.length - 1]]).toBe('interstellar');
  });

  it('indexes transitions in chain order for deterministic tie breaks', () => {
    TRANSITION_ORDER.forEach((t, i) => expect(TRANSITION_INDEX[t]).toBe(i));
  });

  it('defines the hazard, recognition, and terminal state sets per the model', () => {
    expect([...HAZARD_STATES].sort()).toEqual(['detectable', 'interstellar', 'technology']);
    expect([...RECOGNITION_CAPABLE].sort()).toEqual(['detectable', 'interstellar', 'technology']);
    expect([...TERMINAL_STATES].sort()).toEqual(['extinct', 'quiet', 'transformed']);
  });
});
