import { describe, expect, it } from 'vitest';
import { formatCount, formatLightYears, formatYears } from '../../../src/utils/format';

// Report and ledger formatting (FR009, UX003): readable strings, never a
// dash character.
describe('formatYears', () => {
  it('scales units and trims trailing zeros', () => {
    expect(formatYears(1)).toBe('1 year');
    expect(formatYears(500)).toBe('500 years');
    expect(formatYears(3_200)).toBe('3.2 thousand years');
    expect(formatYears(2_000_000)).toBe('2 million years');
    expect(formatYears(3_800_000)).toBe('3.8 million years');
    expect(formatYears(2_100_000_000)).toBe('2.1 billion years');
  });

  it('never emits an em or en dash', () => {
    for (const n of [0, 1, 999, 1234, 5_600_000, 9_900_000_000]) {
      expect(formatYears(n)).not.toMatch(/[\u2012-\u2015\u2212]/);
    }
  });
});

describe('formatLightYears and formatCount', () => {
  it('formats distances with a floor for none', () => {
    expect(formatLightYears(0)).toBe('none recorded');
    expect(formatLightYears(12_345)).toBe('12,345 light years');
  });

  it('groups large counts', () => {
    expect(formatCount(2048)).toBe('2,048');
    expect(formatCount(12000)).toBe('12,000');
  });
});
