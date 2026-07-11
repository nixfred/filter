// The simulation store (docs/ARCHITECTURE.md 2.6): owns the worker, the
// protocol conversation, playback pacing (docs/simulation_model.md 8.4), and
// the interface facing run state. The only module besides url_state permitted
// to import simulation code on the main thread side.
import type { RunMetrics, Scenario, SimulationEvent } from '../simulation/types';
import type { WorkerInMessage, WorkerOutMessage } from '../simulation/worker_host';
import { encodeScenario } from '../simulation/serialization';

export type SpeedStep = 'pause' | '1x' | '10x' | '100x' | '1000x' | 'max';

/**
 * Playback pacing at 1x, simulated years per real second. Chosen so a
 * default ten billion year run plays in about 100 seconds (packet Q20 range,
 * documented assumption in INTERACTION_SPEC section 2).
 */
export const SIM_YEARS_PER_REAL_SECOND_1X = 100_000_000;

const SPEED_MULTIPLIER: Record<Exclude<SpeedStep, 'pause' | 'max'>, number> = {
  '1x': 1,
  '10x': 10,
  '100x': 100,
  '1000x': 1000,
};

export type RunPhase = 'idle' | 'initializing' | 'running' | 'paused' | 'complete' | 'error';

export interface SimulationStoreState {
  phase: RunPhase;
  scenario: Scenario | null;
  speed: SpeedStep;
  /** The simulated year playback has revealed so far. */
  displayYear: number;
  /** Events revealed to the interface so far, in order. */
  revealedEvents: SimulationEvent[];
  metrics: RunMetrics | null;
  digest: string | null;
  headline: string | null;
  errorMessage: string | null;
  civilizationCount: number;
}

type Listener = () => void;

const initialState: SimulationStoreState = {
  phase: 'idle',
  scenario: null,
  speed: '1x',
  displayYear: 0,
  revealedEvents: [],
  metrics: null,
  digest: null,
  headline: null,
  errorMessage: null,
  civilizationCount: 0,
};

export interface WorkerLike {
  postMessage(message: WorkerInMessage): void;
  addEventListener(type: 'message', handler: (event: MessageEvent) => void): void;
  terminate(): void;
}

/**
 * Store implementation. A factory rather than a singleton so tests inject a
 * fake worker; the app creates one instance in providers.tsx.
 */
export function createSimulationStore(createWorker: () => WorkerLike) {
  let state: SimulationStoreState = { ...initialState };
  const listeners = new Set<Listener>();
  let worker: WorkerLike | null = null;
  /** Batches buffered ahead of playback, in order. */
  let pendingEvents: SimulationEvent[] = [];
  let runComplete: { metrics: RunMetrics; digest: string; headline: string } | null = null;
  let pacingTimer: ReturnType<typeof setInterval> | null = null;
  let lastTick = 0;

  function emit() {
    for (const listener of listeners) listener();
  }

  function set(partial: Partial<SimulationStoreState>) {
    state = { ...state, ...partial };
    emit();
  }

  function ensureWorker(): WorkerLike {
    if (worker) return worker;
    worker = createWorker();
    worker.addEventListener('message', (event) => {
      handleWorkerMessage(event.data as WorkerOutMessage);
    });
    return worker;
  }

  function handleWorkerMessage(message: WorkerOutMessage) {
    switch (message.type) {
      case 'SNAPSHOT':
        set({ civilizationCount: message.civilizationCount });
        break;
      case 'EVENT_BATCH':
        pendingEvents = pendingEvents.concat(message.events);
        // Ack immediately: local buffering bounds worker readahead while the
        // pacing loop controls what the interface reveals.
        worker?.postMessage({ type: 'ACK_BATCH', batchId: message.batchId });
        break;
      case 'RUN_COMPLETE':
        runComplete = message;
        // At max speed the report appears as soon as the run finishes;
        // at paced speeds it appears when playback catches up.
        if (state.speed === 'max') revealEverything();
        break;
      case 'ERROR':
        set({ phase: 'error', errorMessage: message.message });
        stopPacing();
        break;
      default:
        break;
    }
  }

  function revealEverything() {
    const remaining = pendingEvents;
    pendingEvents = [];
    stopPacing();
    if (runComplete) {
      set({
        phase: 'complete',
        revealedEvents: state.revealedEvents.concat(remaining),
        displayYear: remaining.length ? remaining[remaining.length - 1].atYear : state.displayYear,
        metrics: runComplete.metrics,
        digest: runComplete.digest,
        headline: runComplete.headline,
      });
    }
  }

  function tick() {
    const now = Date.now();
    const dtSeconds = (now - lastTick) / 1000;
    lastTick = now;
    if (state.phase !== 'running') return;
    if (state.speed === 'pause') return;
    if (state.speed === 'max') {
      if (runComplete) revealEverything();
      return;
    }
    const advance = SIM_YEARS_PER_REAL_SECOND_1X * SPEED_MULTIPLIER[state.speed] * dtSeconds;
    const targetYear = state.displayYear + advance;
    const reveal: SimulationEvent[] = [];
    while (pendingEvents.length > 0 && pendingEvents[0].atYear <= targetYear) {
      reveal.push(pendingEvents.shift() as SimulationEvent);
    }
    if (runComplete && pendingEvents.length === 0) {
      set({
        phase: 'complete',
        revealedEvents: state.revealedEvents.concat(reveal),
        displayYear: targetYear,
        metrics: runComplete.metrics,
        digest: runComplete.digest,
        headline: runComplete.headline,
      });
      stopPacing();
      return;
    }
    set({
      displayYear: targetYear,
      revealedEvents: reveal.length ? state.revealedEvents.concat(reveal) : state.revealedEvents,
    });
  }

  function startPacing() {
    if (pacingTimer !== null) return;
    lastTick = Date.now();
    pacingTimer = setInterval(tick, 100);
  }

  function stopPacing() {
    if (pacingTimer !== null) {
      clearInterval(pacingTimer);
      pacingTimer = null;
    }
  }

  return {
    subscribe(listener: Listener): () => void {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getState(): SimulationStoreState {
      return state;
    },
    /** Load a scenario and begin playback (INTERACTION_SPEC 1.2.4). */
    start(scenario: Scenario) {
      const w = ensureWorker();
      pendingEvents = [];
      runComplete = null;
      set({
        ...initialState,
        scenario,
        phase: 'running',
        speed: state.speed === 'pause' ? '1x' : state.speed,
      });
      w.postMessage({ type: 'INIT', scenario, modelVersion: scenario.simulationModelVersion });
      w.postMessage({ type: 'START' });
      startPacing();
    },
    pause() {
      if (state.phase !== 'running') return;
      set({ phase: 'paused' });
    },
    resume() {
      if (state.phase !== 'paused') return;
      lastTick = Date.now();
      set({ phase: 'running' });
    },
    setSpeed(speed: SpeedStep) {
      set({ speed });
      if (speed === 'max' && runComplete) revealEverything();
    },
    /** Return to configuration, discarding progress (capability 5). */
    reset() {
      worker?.postMessage({ type: 'RESET' });
      pendingEvents = [];
      runComplete = null;
      stopPacing();
      set({
        ...initialState,
        scenario: state.scenario,
        speed: state.speed,
        phase: 'idle',
      });
    },
    /** Replay from year zero, identical seed (capability 6, R010). */
    replay() {
      if (!state.scenario) return;
      this.start(state.scenario);
    },
    /** New seed, same parameters (capability 7). */
    randomizeSeed(seedA: number, seedB: number) {
      if (!state.scenario) return;
      this.start({ ...state.scenario, seedA: seedA >>> 0, seedB: seedB >>> 0 });
    },
    shareUrl(origin: string): string | null {
      if (!state.scenario) return null;
      return origin + '/?s=' + encodeScenario(state.scenario);
    },
    terminate() {
      stopPacing();
      worker?.postMessage({ type: 'TERMINATE' });
      worker?.terminate();
      worker = null;
    },
  };
}

export type SimulationStore = ReturnType<typeof createSimulationStore>;
