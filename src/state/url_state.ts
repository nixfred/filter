// Share URL handling (FR008, DATA001, SEC002, docs/DATA_MODEL.md section 4).
// Hostile or malformed links fail closed: treated as absent, never guessed.
import { decodeScenario, encodeScenario } from '../simulation/serialization';
import type { Scenario } from '../simulation/types';

export const SHARE_PARAM = 's';

/** Read a scenario from a location search string, or null. */
export function scenarioFromSearch(search: string): Scenario | null {
  try {
    const params = new URLSearchParams(search);
    const encoded = params.get(SHARE_PARAM);
    if (!encoded) return null;
    return decodeScenario(encoded);
  } catch {
    return null;
  }
}

/** Build the canonical share URL for a scenario. */
export function shareUrlFor(origin: string, scenario: Scenario): string {
  return origin + '/?' + SHARE_PARAM + '=' + encodeScenario(scenario);
}
