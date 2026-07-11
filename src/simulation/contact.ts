// Contact pairing (ruling R019, FR022, docs/simulation_model.md sections 5
// and 10). Pure geometry and timing evaluation; the engine owns scheduling.
import type { Civilization, Position, Signal } from './types';
import { arrivalWindow, meetsRecognitionThreshold } from './light_cone';

export interface PairingResult {
  /** The signal's front sweeps the receiver while it could listen. */
  overlaps: boolean;
  /** Year the detection would fire, when overlapping. */
  detectionYear: number;
  /** True when the strength gate also passes, making contact possible. */
  contactEligible: boolean;
  distanceLy: number;
}

/**
 * Evaluate one signal against one receiver whose recognition capable life
 * began at capableFromYear (technology entry) at the given position.
 * Simultaneous existence alone is never contact: only the arrival window
 * matters (FR022).
 */
export function evaluatePairing(
  signal: Signal,
  receiverPosition: Position,
  capableFromYear: number,
  recognitionThreshold: number,
): PairingResult {
  const window = arrivalWindow(signal, receiverPosition);
  const detectionYear = window.startYear > capableFromYear ? window.startYear : capableFromYear;
  const overlaps = detectionYear <= window.endYear;
  return {
    overlaps,
    detectionYear,
    contactEligible:
      overlaps && meetsRecognitionThreshold(signal, window.distanceLy, recognitionThreshold),
    distanceLy: window.distanceLy,
  };
}

/** A receiver never detects its own civilization's signal. */
export function isSelfSignal(signal: Signal, receiver: Civilization): boolean {
  return signal.sourceCivilizationId === receiver.id;
}
