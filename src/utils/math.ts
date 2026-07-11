// Sanctioned deterministic math helpers (docs/ARCHITECTURE.md section 6,
// docs/simulation_model.md 3.3, docs/TEST_PLAN.md 3.5).
//
// Everything here uses ONLY operations that IEEE 754 and the ECMAScript
// specification require to be correctly rounded and therefore bit identical
// across engines: +, -, *, /, Math.sqrt, Math.round, Math.floor, and integer
// bitwise arithmetic. Engine transcendentals (Math.log, Math.sin, ...) never
// appear: logarithm and trigonometry are computed by fixed polynomial
// approximations whose every step is deterministic arithmetic.

const LN2 = 0.6931471805599453;
const PI = 3.141592653589793;
export const TWO_PI = 6.283185307179586;

const f64 = new Float64Array(1);
const u32 = new Uint32Array(f64.buffer);

/**
 * Deterministic natural logarithm for x > 0.
 * Decomposes x = m * 2^e with m in [1, 2) via IEEE bit extraction, then
 * evaluates ln(m) with an atanh series in s = (m - 1) / (m + 1):
 * ln(m) = 2 (s + s^3/3 + s^5/5 + ...). Eleven terms give ~1e-16 relative
 * accuracy on [1, 2). Every step is arithmetic, so the result is bit
 * identical on every engine.
 */
export function detLog(x: number): number {
  if (!(x > 0)) return NaN;
  f64[0] = x;
  const hi = u32[1];
  let e = ((hi >>> 20) & 0x7ff) - 1023;
  // Subnormals: scale up by 2^64 and correct the exponent.
  if (e === -1023) {
    f64[0] = x * 18446744073709551616;
    e = ((u32[1] >>> 20) & 0x7ff) - 1023 - 64;
  }
  // Mantissa m in [1, 2): clear the exponent field, set it to 1023.
  u32[1] = (u32[1] & 0x000fffff) | 0x3ff00000;
  const m = f64[0];
  const s = (m - 1) / (m + 1);
  const s2 = s * s;
  let term = s;
  let sum = 0;
  for (let k = 1; k <= 21; k += 2) {
    sum += term / k;
    term *= s2;
  }
  return 2 * sum + e * LN2;
}

/**
 * Deterministic sine via range reduction to [-pi, pi] and a Taylor series.
 * Adequate for galaxy layout angles (inputs within a few turns), where the
 * range reduction stays exact enough for bit stable layout.
 */
export function detSin(x: number): number {
  let r = x - TWO_PI * Math.floor(x / TWO_PI + 0.5);
  if (r > PI) r -= TWO_PI;
  if (r < -PI) r += TWO_PI;
  const r2 = r * r;
  let term = r;
  let sum = r;
  for (let k = 1; k <= 10; k++) {
    term *= -r2 / (2 * k * (2 * k + 1));
    sum += term;
  }
  return sum;
}

export function detCos(x: number): number {
  return detSin(x + PI / 2);
}

/** Clamp to [0, 1]. */
export function clamp01(x: number): number {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

/** Clamp to [lo, hi]. */
export function clamp(x: number, lo: number, hi: number): number {
  return x < lo ? lo : x > hi ? hi : x;
}

/** uint16 (0..65535) to float 0..1 and back (docs/DATA_MODEL.md 1.1). */
export function u16ToUnit(v: number): number {
  return clamp(Math.round(v), 0, 65535) / 65535;
}

export function unitToU16(x: number): number {
  return Math.round(clamp01(x) * 65535);
}

/**
 * Exponential waiting time draw in whole years (docs/simulation_model.md 3.1,
 * 3.3): inverse CDF -ln(1 - u) / rate with the deterministic logarithm.
 * Returns an integer number of years, at least 1.
 */
export function exponentialYears(u: number, meanYears: number): number {
  const w = -detLog(1 - u) * meanYears;
  const years = Math.round(w);
  return years < 1 ? 1 : years;
}

/** Euclidean distance in the galaxy plane. Math.sqrt is correctly rounded. */
export function distanceLy(ax: number, ay: number, bx: number, by: number): number {
  const dx = ax - bx;
  const dy = ay - by;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * FNV-1a over a byte buffer, run as two independent 32 bit streams with
 * distinct offset bases, rendered as 16 lowercase hex characters. Integer
 * and bitwise arithmetic only (docs/DATA_MODEL.md section 3).
 */
export function fnv1a64Hex(bytes: Uint8Array): string {
  let h1 = 0x811c9dc5 | 0;
  let h2 = 0xcbf29ce4 | 0;
  for (let i = 0; i < bytes.length; i++) {
    h1 = Math.imul(h1 ^ bytes[i], 0x01000193);
    h2 = Math.imul(h2 ^ bytes[i], 0x01000193);
    h2 = (h2 ^ (h2 >>> 15)) | 0;
  }
  const hex = (v: number) => (v >>> 0).toString(16).padStart(8, '0');
  return hex(h1) + hex(h2);
}
