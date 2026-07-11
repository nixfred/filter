import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createSimulationStore,
  SIM_YEARS_PER_REAL_SECOND_1X,
  type WorkerLike,
} from '../../../src/state/simulation_store';
import { createWorkerHost, type WorkerInMessage } from '../../../src/simulation/worker_host';
import { createScenario } from '../../../src/simulation/scenario';

// The store drives the REAL protocol host (docs/ARCHITECTURE.md section 3),
// so these tests exercise the exact conversation the app will have.
function fakeWorker(): WorkerLike {
  let listener: ((event: MessageEvent) => void) | null = null;
  const handle = createWorkerHost((message) => {
    listener?.({ data: message } as MessageEvent);
  });
  return {
    postMessage(message: WorkerInMessage) {
      handle(message);
    },
    addEventListener(_type, handler) {
      listener = handler;
    },
    terminate() {
      listener = null;
    },
  };
}

const SCENARIO = createScenario(2025, 5202, undefined, {
  representativePopulationSize: 128,
  runHorizonYears: 2_000_000_000,
});

describe('simulation store', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts a run and completes at max speed with digest and headline', () => {
    const store = createSimulationStore(fakeWorker);
    store.start(SCENARIO);
    expect(store.getState().phase).toBe('running');
    store.setSpeed('max');
    vi.advanceTimersByTime(500);
    const s = store.getState();
    expect(s.phase).toBe('complete');
    expect(s.digest).toMatch(/^[0-9a-f]{16}$/);
    expect(s.headline?.length).toBeGreaterThan(0);
    expect(s.metrics?.candidateWorldCount).toBe(128);
    expect(s.revealedEvents.length).toBeGreaterThan(0);
  });

  it('paces event revelation by speed, never revealing the future', () => {
    const store = createSimulationStore(fakeWorker);
    store.start(SCENARIO);
    store.setSpeed('1x');
    vi.advanceTimersByTime(1000);
    const s = store.getState();
    // One second at 1x reveals at most the pacing budget of simulated years.
    expect(s.displayYear).toBeLessThanOrEqual(SIM_YEARS_PER_REAL_SECOND_1X * 1.5);
    for (const event of s.revealedEvents) {
      expect(event.atYear).toBeLessThanOrEqual(s.displayYear);
    }
    expect(s.phase).toBe('running');
  });

  it('pause freezes revelation, resume continues', () => {
    const store = createSimulationStore(fakeWorker);
    store.start(SCENARIO);
    // 10x advances one twentieth of the two billion year horizon per tick,
    // so the run is reliably still in flight when pause lands.
    store.setSpeed('10x');
    vi.advanceTimersByTime(300);
    store.pause();
    const frozen = store.getState().displayYear;
    vi.advanceTimersByTime(1000);
    expect(store.getState().displayYear).toBe(frozen);
    store.resume();
    vi.advanceTimersByTime(300);
    expect(store.getState().displayYear).toBeGreaterThan(frozen);
  });

  it('replay reproduces the identical digest (FR017 through the store)', () => {
    const store = createSimulationStore(fakeWorker);
    store.start(SCENARIO);
    store.setSpeed('max');
    vi.advanceTimersByTime(500);
    const first = store.getState().digest;
    store.replay();
    store.setSpeed('max');
    vi.advanceTimersByTime(500);
    expect(store.getState().digest).toBe(first);
  });

  it('reset returns to idle keeping the scenario for the configuration state', () => {
    const store = createSimulationStore(fakeWorker);
    store.start(SCENARIO);
    store.reset();
    const s = store.getState();
    expect(s.phase).toBe('idle');
    expect(s.scenario).toEqual(SCENARIO);
    expect(s.revealedEvents).toHaveLength(0);
  });

  it('builds the canonical share URL (FR008)', () => {
    const store = createSimulationStore(fakeWorker);
    store.start(SCENARIO);
    const url = store.shareUrl('https://filter.nixfred.com');
    expect(url).toMatch(/^https:\/\/filter\.nixfred\.com\/\?s=[A-Za-z0-9_-]+$/);
  });
});
