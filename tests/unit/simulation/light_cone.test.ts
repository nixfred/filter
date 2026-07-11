import { describe, expect, it } from 'vitest';
import {
  arrivalWindow,
  meetsRecognitionThreshold,
  systemDistanceLy,
} from '../../../src/simulation/light_cone';
import type { Position, Signal } from '../../../src/simulation/types';

// Light travel calculations (FR019, docs/simulation_model.md section 5).
function positionAt(xLy: number, yLy: number): Position {
  return { radiusLy: 0, angleRadians: 0, armIndex: 0, heightOffsetLy: 0, xLy, yLy };
}

const signal: Signal = {
  id: 0,
  sourceCivilizationId: 0,
  originPosition: positionAt(0, 0),
  emissionStartYear: 1000,
  emissionEndYear: 6000,
  strength: 0.8,
};

describe('arrivalWindow', () => {
  it('shifts the emission window by light travel time at one ly per year', () => {
    const window = arrivalWindow(signal, positionAt(3000, 4000));
    expect(window.distanceLy).toBe(5000);
    expect(window.startYear).toBe(1000 + 5000);
    expect(window.endYear).toBe(6000 + 5000);
  });

  it('gives a zero distance receiver the emission window itself', () => {
    const window = arrivalWindow(signal, positionAt(0, 0));
    expect(window.startYear).toBe(1000);
    expect(window.endYear).toBe(6000);
  });
});

describe('meetsRecognitionThreshold', () => {
  it('weakens with distance monotonically', () => {
    expect(meetsRecognitionThreshold(signal, 0, 0.5)).toBe(true);
    // strength 0.8 halves at the documented half strength distance.
    expect(meetsRecognitionThreshold(signal, 10_000, 0.41)).toBe(false);
    expect(meetsRecognitionThreshold(signal, 10_000, 0.4)).toBe(true);
    expect(meetsRecognitionThreshold(signal, 1_000_000, 0.05)).toBe(false);
  });
});

describe('systemDistanceLy', () => {
  it('uses the cached Cartesian coordinates', () => {
    expect(systemDistanceLy(positionAt(0, 0), positionAt(0, 7))).toBe(7);
  });
});
