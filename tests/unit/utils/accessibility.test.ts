import { describe, expect, it } from 'vitest';
import {
  createAnnouncer,
  PROGRESS_ANNOUNCEMENT_INTERVAL_MS,
} from '../../../src/utils/accessibility';

// Live region throttle (ACC002, docs/ACCESSIBILITY.md 3.3, 3.4): the progress
// rate is capped in real time so 1000x speed announces no more than 1x.
describe('announcer', () => {
  it('passes immediate announcements through unconditionally', () => {
    const seen: string[] = [];
    const announcer = createAnnouncer(
      (m) => seen.push(m),
      () => 0,
    );
    announcer.immediate('Paused.');
    announcer.immediate('Resumed.');
    expect(seen).toEqual(['Paused.', 'Resumed.']);
  });

  it('rate caps progress announcements regardless of call frequency', () => {
    let clock = 0;
    const seen: string[] = [];
    const announcer = createAnnouncer(
      (m) => seen.push(m),
      () => clock,
    );
    // First fires; the next within the interval is coalesced away.
    expect(announcer.progress('a')).toBe(true);
    clock += 1000;
    expect(announcer.progress('b')).toBe(false);
    clock += PROGRESS_ANNOUNCEMENT_INTERVAL_MS;
    expect(announcer.progress('c')).toBe(true);
    expect(seen).toEqual(['a', 'c']);
  });

  it('produces the same announcement count at 1x and 1000x call rates', () => {
    function countOverWindow(callsPerWindow: number): number {
      let clock = 0;
      let announced = 0;
      const announcer = createAnnouncer(
        () => announced++,
        () => clock,
      );
      const totalMs = PROGRESS_ANNOUNCEMENT_INTERVAL_MS * 5;
      const stepMs = totalMs / callsPerWindow;
      for (let i = 0; i < callsPerWindow; i++) {
        announcer.progress('x');
        clock += stepMs;
      }
      return announced;
    }
    // Ten times as many calls, same real time span: same announcement count.
    expect(countOverWindow(50)).toBe(countOverWindow(500));
  });
});
