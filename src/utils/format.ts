// Display formatting for the report, ledger, and status bar (FR009, UX003).
// No em or en dash may ever appear in a generated string.
export function formatYears(years: number): string {
  if (years >= 1_000_000_000) {
    return trimmed(years / 1_000_000_000) + ' billion years';
  }
  if (years >= 1_000_000) {
    return trimmed(years / 1_000_000) + ' million years';
  }
  if (years >= 1_000) {
    return trimmed(years / 1_000) + ' thousand years';
  }
  return String(Math.round(years)) + (Math.round(years) === 1 ? ' year' : ' years');
}

export function formatLightYears(ly: number): string {
  if (ly <= 0) return 'none recorded';
  return Math.round(ly).toLocaleString('en-US') + ' light years';
}

export function formatCount(n: number): string {
  return n.toLocaleString('en-US');
}

function trimmed(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return rounded % 1 === 0 ? String(rounded) : rounded.toFixed(1);
}
