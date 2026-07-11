// Live region announcement throttle (ACC002, docs/ACCESSIBILITY.md 3.3, 3.4).
// Immediate announcements pass through; progress announcements are rate
// capped in real time so 1000x speed produces the same steady rate as 1x.
export const PROGRESS_ANNOUNCEMENT_INTERVAL_MS = 10_000;
export const PROGRESS_ANNOUNCEMENT_MINIMUM_GAP_MS = 5_000;

export interface AnnouncementSink {
  (message: string): void;
}

export function createAnnouncer(sink: AnnouncementSink, now: () => number = Date.now) {
  let lastProgressAt = -Infinity;
  return {
    /** Direct result of a visitor action: always announced (3.3 rule 1). */
    immediate(message: string) {
      sink(message);
    },
    /**
     * Simulation progress: at most one per interval, hard minimum gap,
     * independent of simulation speed (3.4 rate cap). Returns whether the
     * message was announced or coalesced away.
     */
    progress(message: string): boolean {
      const t = now();
      if (t - lastProgressAt < PROGRESS_ANNOUNCEMENT_MINIMUM_GAP_MS) return false;
      if (t - lastProgressAt < PROGRESS_ANNOUNCEMENT_INTERVAL_MS) return false;
      lastProgressAt = t;
      sink(message);
      return true;
    },
  };
}
