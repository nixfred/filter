// Worker protocol host (docs/ARCHITECTURE.md section 3). Pure message
// handling, bound to the real Worker global by simulation.worker.ts, and
// drivable directly in integration tests. Backpressure: at most two
// unacknowledged EVENT_BATCH messages in flight (section 3.3).
import { Engine } from './engine';
import { computeMetrics } from './metrics';
import { computeDigest } from './serialization';
import { validateScenario } from './schema';
import type { RunMetrics, Scenario, SimulationEvent } from './types';

export type WorkerInMessage =
  | { type: 'INIT'; scenario: Scenario; modelVersion: number }
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'SET_SPEED'; speed: string }
  | { type: 'RESET' }
  | { type: 'REPLAY_SAME_SEED' }
  | { type: 'RANDOMIZE_SEED'; seedA: number; seedB: number }
  | { type: 'ACK_BATCH'; batchId: number }
  | { type: 'REQUEST_SNAPSHOT' }
  | { type: 'TERMINATE' };

export type WorkerOutMessage =
  | { type: 'READY' }
  | {
      type: 'SNAPSHOT';
      time: number;
      civilizationCount: number;
      signalCount: number;
      frontierCount: number;
      /** Static positions for the render layer, sent once per INIT. */
      systems: { id: number; xLy: number; yLy: number }[];
    }
  | { type: 'EVENT_BATCH'; batchId: number; events: SimulationEvent[]; time: number }
  | { type: 'METRICS_UPDATE'; time: number; metrics: Partial<RunMetrics> }
  | { type: 'RUN_COMPLETE'; metrics: RunMetrics; digest: string; headline: string }
  | { type: 'PROGRESS'; fractionComplete: number }
  | { type: 'ERROR'; code: string; message: string; recoverable: boolean };

const EVENTS_PER_SLICE = 512;
const MAX_IN_FLIGHT = 2;

export function createWorkerHost(post: (message: WorkerOutMessage) => void) {
  let engine: Engine | null = null;
  let scenario: Scenario | null = null;
  let running = false;
  let terminated = false;
  let nextBatchId = 0;
  let lowestUnacked = 0;
  let completePosted = false;

  function snapshot(): void {
    if (!engine) return;
    post({
      type: 'SNAPSHOT',
      time: engine.year,
      civilizationCount: engine.state.civilizations.length,
      signalCount: engine.state.signals.length,
      frontierCount: engine.state.frontiers.length,
      systems: engine.state.systems.map((s) => ({
        id: s.id,
        xLy: s.position.xLy,
        yLy: s.position.yLy,
      })),
    });
  }

  function pump(): void {
    if (!engine || !running || terminated) return;
    while (running && !engine.isComplete && nextBatchId - lowestUnacked < MAX_IN_FLIGHT) {
      const events = engine.run(EVENTS_PER_SLICE);
      if (events.length > 0) {
        post({ type: 'EVENT_BATCH', batchId: nextBatchId++, events, time: engine.year });
      }
      if (engine.isComplete) break;
    }
    if (engine.isComplete && !completePosted) {
      completePosted = true;
      const metrics = computeMetrics(engine.state);
      const digest = computeDigest(engine.state, metrics);
      post({ type: 'RUN_COMPLETE', metrics, digest, headline: metrics.headline });
      running = false;
    }
  }

  function initEngine(s: Scenario): void {
    engine = new Engine(s);
    nextBatchId = 0;
    lowestUnacked = 0;
    completePosted = false;
    snapshot();
  }

  return function handle(message: WorkerInMessage): void {
    if (terminated) return;
    switch (message.type) {
      case 'INIT': {
        const result = validateScenario(message.scenario);
        if (!result.ok) {
          post({
            type: 'ERROR',
            code: 'invalid_scenario',
            message: result.reason,
            recoverable: true,
          });
          return;
        }
        scenario = result.scenario;
        running = false;
        initEngine(scenario);
        break;
      }
      case 'START':
      case 'RESUME':
        if (!engine) {
          post({
            type: 'ERROR',
            code: 'not_initialized',
            message: 'INIT first',
            recoverable: true,
          });
          return;
        }
        running = true;
        pump();
        break;
      case 'PAUSE':
        running = false;
        break;
      case 'SET_SPEED':
        // Pacing is a main thread playback concern (docs/simulation_model.md
        // 8.4); the worker only honors backpressure, so nothing to do here.
        break;
      case 'RESET':
        if (scenario) {
          running = false;
          initEngine(scenario);
        }
        break;
      case 'REPLAY_SAME_SEED':
        if (scenario) {
          initEngine(scenario);
          running = true;
          pump();
        }
        break;
      case 'RANDOMIZE_SEED':
        if (scenario) {
          scenario = {
            ...scenario,
            seedA: message.seedA >>> 0,
            seedB: message.seedB >>> 0,
          };
          running = false;
          initEngine(scenario);
        }
        break;
      case 'ACK_BATCH':
        if (message.batchId >= lowestUnacked) lowestUnacked = message.batchId + 1;
        pump();
        break;
      case 'REQUEST_SNAPSHOT':
        snapshot();
        break;
      case 'TERMINATE':
        terminated = true;
        engine = null;
        break;
    }
  };
}
