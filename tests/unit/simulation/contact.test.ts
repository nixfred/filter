import { describe, expect, it } from 'vitest';
import { evaluatePairing, isSelfSignal } from '../../../src/simulation/contact';
import type { Civilization, Position, Signal } from '../../../src/simulation/types';

// Contact detection (FR022, ruling R019, docs/simulation_model.md 10).
function positionAt(xLy: number, yLy: number): Position {
  return { radiusLy: 0, angleRadians: 0, armIndex: 0, heightOffsetLy: 0, xLy, yLy };
}

const signal: Signal = {
  id: 3,
  sourceCivilizationId: 9,
  originPosition: positionAt(0, 0),
  emissionStartYear: 0,
  emissionEndYear: 10_000,
  strength: 0.9,
};

describe('evaluatePairing', () => {
  it('finds overlap when the arrival window meets the capable window', () => {
    // Receiver 1000 ly away, capable from year 500: front arrives 1000..11000.
    const p = evaluatePairing(signal, positionAt(1000, 0), 500, 0.1);
    expect(p.overlaps).toBe(true);
    expect(p.detectionYear).toBe(1000);
    expect(p.contactEligible).toBe(true);
  });

  it('starts detection at capability when the front is already sweeping', () => {
    const p = evaluatePairing(signal, positionAt(1000, 0), 5000, 0.1);
    expect(p.overlaps).toBe(true);
    expect(p.detectionYear).toBe(5000);
  });

  it('simultaneous existence alone is never contact: a late listener misses', () => {
    // Front passed the receiver at years 1000..11000; capable only from 20000.
    const p = evaluatePairing(signal, positionAt(1000, 0), 20_000, 0.1);
    expect(p.overlaps).toBe(false);
  });

  it('gates contact on the strength threshold but still records overlap', () => {
    // Far receiver: overlap timing works, strength falls below threshold.
    const p = evaluatePairing(signal, positionAt(60_000, 0), 0, 0.5);
    expect(p.overlaps).toBe(true);
    expect(p.contactEligible).toBe(false);
  });
});

describe('isSelfSignal', () => {
  it('never lets a civilization detect itself', () => {
    const receiver = { id: 9 } as Civilization;
    const other = { id: 4 } as Civilization;
    expect(isSelfSignal(signal, receiver)).toBe(true);
    expect(isSelfSignal(signal, other)).toBe(false);
  });
});
