// Deterministic seeded randomness (FR017, docs/ARCHITECTURE.md 6.1).
// sfc32: pure 32 bit integer arithmetic, no engine randomness anywhere.
// The four state words derive from the scenario's uint32 seed pair through a
// splitmix32 expansion, so every distinct pair yields a well mixed state.

export interface Rng {
  /** Next uint32. */
  nextU32(): number;
  /** Uniform float in (0, 1), derived from one uint32 draw. */
  nextUnit(): number;
}

function splitmix32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x9e3779b9) | 0;
    let z = s;
    z = Math.imul(z ^ (z >>> 16), 0x21f0aaad);
    z = Math.imul(z ^ (z >>> 15), 0x735a2d97);
    return (z ^ (z >>> 15)) >>> 0;
  };
}

export function createRng(seedA: number, seedB: number): Rng {
  const mix = splitmix32((seedA ^ Math.imul(seedB, 0x9e3779b1)) | 0);
  let a = mix() | 0;
  let b = (mix() ^ seedA) | 0;
  let c = (mix() ^ seedB) | 0;
  let d = mix() | 0;
  // Warm up so weak seed pairs decorrelate before the first real draw.
  const next = (): number => {
    const t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    return t >>> 0;
  };
  for (let i = 0; i < 12; i++) next();
  return {
    nextU32: next,
    // (u + 0.5) / 2^32 stays strictly inside (0, 1) so logarithm draws are safe.
    nextUnit: () => (next() + 0.5) / 4294967296,
  };
}
