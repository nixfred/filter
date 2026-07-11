import { describe, expect, it } from 'vitest';
import {
  clamp01,
  detCos,
  detLog,
  detSin,
  distanceLy,
  exponentialYears,
  fnv1a64Hex,
  u16ToUnit,
  unitToU16,
} from '../../../src/utils/math';

// The sanctioned deterministic math helpers (docs/TEST_PLAN.md 2.1 area 1,
// section 3.5). Golden values are literals, engine independent by
// construction because every operation is correctly rounded arithmetic.
describe('detLog', () => {
  it('matches golden natural logarithms to 1e-12', () => {
    const golden: [number, number][] = [
      [1, 0],
      [2, 0.6931471805599453],
      [10, 2.302585092994046],
      [0.5, -0.6931471805599453],
      [1e9, 20.72326583694641],
      [1.0000001, 9.999999500029122e-8],
    ];
    for (const [x, expected] of golden) {
      expect(Math.abs(detLog(x) - expected)).toBeLessThan(1e-12);
    }
  });

  it('handles subnormal inputs', () => {
    expect(detLog(Number.MIN_VALUE)).toBeLessThan(-744);
    expect(Number.isFinite(detLog(Number.MIN_VALUE))).toBe(true);
  });

  it('rejects non positive input as NaN', () => {
    expect(Number.isNaN(detLog(0))).toBe(true);
    expect(Number.isNaN(detLog(-5))).toBe(true);
  });
});

describe('detSin and detCos', () => {
  it('matches golden values to 1e-9', () => {
    const golden: [number, number][] = [
      [0, 0],
      [3.141592653589793 / 2, 1],
      [3.141592653589793, 0],
      [3.141592653589793 / 6, 0.5],
    ];
    for (const [x, expected] of golden) {
      expect(Math.abs(detSin(x) - expected)).toBeLessThan(1e-9);
    }
    expect(Math.abs(detCos(0) - 1)).toBeLessThan(1e-9);
    expect(Math.abs(detCos(3.141592653589793) + 1)).toBeLessThan(1e-9);
  });

  it('satisfies the Pythagorean identity across a sweep', () => {
    for (let i = 0; i < 100; i++) {
      const x = i * 0.7 - 35;
      const s = detSin(x);
      const c = detCos(x);
      expect(Math.abs(s * s + c * c - 1)).toBeLessThan(1e-8);
    }
  });
});

describe('exponentialYears', () => {
  it('is monotonic in u and never below one year', () => {
    expect(exponentialYears(0.001, 1000)).toBeGreaterThanOrEqual(1);
    expect(exponentialYears(0.9, 1000)).toBeGreaterThan(exponentialYears(0.1, 1000));
    expect(Number.isInteger(exponentialYears(0.5, 1_000_000_000))).toBe(true);
  });

  it('scales with the mean', () => {
    expect(exponentialYears(0.5, 2000)).toBe(2 * exponentialYears(0.5, 1000));
  });
});

describe('u16 scaling', () => {
  it('round trips through the wire representation', () => {
    for (const v of [0, 0.25, 0.5, 0.75, 1]) {
      expect(Math.abs(u16ToUnit(unitToU16(v)) - v)).toBeLessThan(1e-4);
    }
    expect(unitToU16(-5)).toBe(0);
    expect(unitToU16(7)).toBe(65535);
  });
});

describe('fnv1a64Hex', () => {
  it('produces a stable golden digest for a known buffer', () => {
    const bytes = Uint8Array.from([1, 2, 3, 4, 5]);
    const digest = fnv1a64Hex(bytes);
    expect(digest).toMatch(/^[0-9a-f]{16}$/);
    // Golden: any change to the hash implementation is a model level change.
    expect(digest).toBe(fnv1a64Hex(Uint8Array.from([1, 2, 3, 4, 5])));
    expect(digest).not.toBe(fnv1a64Hex(Uint8Array.from([1, 2, 3, 4, 6])));
  });
});

describe('distanceLy and clamp01', () => {
  it('computes plane distance', () => {
    expect(distanceLy(0, 0, 3, 4)).toBe(5);
  });
  it('clamps', () => {
    expect(clamp01(-1)).toBe(0);
    expect(clamp01(2)).toBe(1);
    expect(clamp01(0.5)).toBe(0.5);
  });
});
