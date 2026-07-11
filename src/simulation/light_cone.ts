// Light travel and detection geometry (FR019, FR020,
// docs/simulation_model.md section 5). The causal speed is exactly one light
// year per year by construction, so distance in light years IS travel time in
// years, with no unit conversion that could drift.
import type { Position, Signal } from './types';
import { effectiveStrengthAt } from './probability';
import { distanceLy } from '../utils/math';

export function systemDistanceLy(a: Position, b: Position): number {
  return distanceLy(a.xLy, a.yLy, b.xLy, b.yLy);
}

/**
 * The window of abstract years during which a signal's front sweeps a
 * receiver at distance d: [emissionStartYear + d, emissionEndYear + d].
 * Years are integers; the distance is rounded once, here, so every caller
 * sees the same integer arrival window.
 */
export function arrivalWindow(
  signal: Signal,
  receiverPosition: Position,
): { startYear: number; endYear: number; distanceLy: number } {
  const d = systemDistanceLy(signal.originPosition, receiverPosition);
  const travel = Math.round(d);
  return {
    startYear: signal.emissionStartYear + travel,
    endYear: signal.emissionEndYear + travel,
    distanceLy: d,
  };
}

/**
 * Strength gate (docs/simulation_model.md section 5 requirement 3): greater
 * distance requires greater strength to register.
 */
export function meetsRecognitionThreshold(
  signal: Signal,
  distance: number,
  threshold: number,
): boolean {
  return effectiveStrengthAt(signal.strength, distance) >= threshold;
}
