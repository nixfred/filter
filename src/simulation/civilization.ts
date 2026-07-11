// Civilization record helpers (docs/DATA_MODEL.md 2.2).
import type { Civilization, CivState } from './types';

/** Year the civilization first entered the given state, or null. */
export function stateEntryYear(civ: Civilization, state: CivState): number | null {
  for (const entry of civ.stateHistory) {
    if (entry.state === state) return entry.atYear;
  }
  return null;
}

/** The terminal history entry (quiet, transformed, extinct), or null. */
export function terminalEntry(civ: Civilization): { state: CivState; atYear: number } | null {
  for (const entry of civ.stateHistory) {
    if (entry.state === 'quiet' || entry.state === 'transformed' || entry.state === 'extinct') {
      return entry;
    }
  }
  return null;
}
