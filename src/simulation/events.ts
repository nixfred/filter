// Deterministic priority queue for event driven scheduling (FR025,
// docs/simulation_model.md section 4). Ordered by scheduled year, ties broken
// by a fixed secondary key (entity id, then transition or event kind index),
// never by insertion order.

export interface ScheduledItem<T> {
  atYear: number;
  /** Deterministic tie break: lower first. */
  tieA: number;
  tieB: number;
  /** Monotonic sequence as the final total order guarantee. */
  seq: number;
  payload: T;
}

export class DeterministicQueue<T> {
  private heap: ScheduledItem<T>[] = [];
  private seqCounter = 0;

  get size(): number {
    return this.heap.length;
  }

  push(atYear: number, tieA: number, tieB: number, payload: T): void {
    const item: ScheduledItem<T> = { atYear, tieA, tieB, seq: this.seqCounter++, payload };
    const h = this.heap;
    h.push(item);
    let i = h.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (compare(h[i], h[parent]) < 0) {
        [h[i], h[parent]] = [h[parent], h[i]];
        i = parent;
      } else break;
    }
  }

  pop(): ScheduledItem<T> | undefined {
    const h = this.heap;
    if (h.length === 0) return undefined;
    const top = h[0];
    const last = h.pop() as ScheduledItem<T>;
    if (h.length > 0) {
      h[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let smallest = i;
        if (l < h.length && compare(h[l], h[smallest]) < 0) smallest = l;
        if (r < h.length && compare(h[r], h[smallest]) < 0) smallest = r;
        if (smallest === i) break;
        [h[i], h[smallest]] = [h[smallest], h[i]];
        i = smallest;
      }
    }
    return top;
  }
}

function compare<T>(a: ScheduledItem<T>, b: ScheduledItem<T>): number {
  if (a.atYear !== b.atYear) return a.atYear - b.atYear;
  if (a.tieA !== b.tieA) return a.tieA - b.tieA;
  if (a.tieB !== b.tieB) return a.tieB - b.tieB;
  return a.seq - b.seq;
}
