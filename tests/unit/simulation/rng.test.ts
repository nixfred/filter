import { describe, expect, it } from 'vitest';
import { createRng } from '../../../src/simulation/rng';

// Random generator reproducibility (docs/TEST_PLAN.md 2.1 area 1, FR017).
describe('createRng', () => {
  it('reproduces the identical stream for the same seed pair', () => {
    const a = createRng(12345, 67890);
    const b = createRng(12345, 67890);
    for (let i = 0; i < 1000; i++) {
      expect(a.nextU32()).toBe(b.nextU32());
    }
  });

  it('produces different streams for different seeds', () => {
    const a = createRng(1, 2);
    const b = createRng(1, 3);
    const drawsA = Array.from({ length: 8 }, () => a.nextU32());
    const drawsB = Array.from({ length: 8 }, () => b.nextU32());
    expect(drawsA).not.toEqual(drawsB);
  });

  it('keeps nextUnit strictly inside (0, 1)', () => {
    const rng = createRng(0, 0);
    for (let i = 0; i < 10000; i++) {
      const u = rng.nextUnit();
      expect(u).toBeGreaterThan(0);
      expect(u).toBeLessThan(1);
    }
  });

  it('spreads values across the unit interval', () => {
    const rng = createRng(42, 42);
    let low = 0;
    for (let i = 0; i < 10000; i++) {
      if (rng.nextUnit() < 0.5) low++;
    }
    expect(low).toBeGreaterThan(4500);
    expect(low).toBeLessThan(5500);
  });
});
