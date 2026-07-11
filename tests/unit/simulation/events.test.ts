import { describe, expect, it } from 'vitest';
import { DeterministicQueue } from '../../../src/simulation/events';

// Event ordering (FR025, docs/simulation_model.md section 4): scheduled year
// first, then the fixed secondary keys, never insertion order.
describe('DeterministicQueue', () => {
  it('orders by year regardless of insertion order', () => {
    const q = new DeterministicQueue<string>();
    q.push(30, 0, 0, 'c');
    q.push(10, 0, 0, 'a');
    q.push(20, 0, 0, 'b');
    expect([q.pop()?.payload, q.pop()?.payload, q.pop()?.payload]).toEqual(['a', 'b', 'c']);
  });

  it('breaks year ties by the primary then secondary key', () => {
    const q = new DeterministicQueue<string>();
    q.push(5, 2, 0, 'systemTwo');
    q.push(5, 1, 9, 'systemOneLateKind');
    q.push(5, 1, 3, 'systemOneEarlyKind');
    expect(q.pop()?.payload).toBe('systemOneEarlyKind');
    expect(q.pop()?.payload).toBe('systemOneLateKind');
    expect(q.pop()?.payload).toBe('systemTwo');
  });

  it('falls back to insertion sequence as the final total order', () => {
    const q = new DeterministicQueue<string>();
    q.push(5, 1, 1, 'first');
    q.push(5, 1, 1, 'second');
    expect(q.pop()?.payload).toBe('first');
    expect(q.pop()?.payload).toBe('second');
  });

  it('drains to undefined and tracks size', () => {
    const q = new DeterministicQueue<number>();
    expect(q.size).toBe(0);
    q.push(1, 0, 0, 42);
    expect(q.size).toBe(1);
    expect(q.pop()?.payload).toBe(42);
    expect(q.pop()).toBeUndefined();
  });
});
