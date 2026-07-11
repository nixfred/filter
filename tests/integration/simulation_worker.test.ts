import '@vitest/web-worker';
import { describe, expect, it } from 'vitest';
import { Engine } from '../../src/simulation/engine';
import { computeMetrics } from '../../src/simulation/metrics';
import { computeDigest } from '../../src/simulation/serialization';
import { createScenario } from '../../src/simulation/scenario';
import { createWorkerHost, type WorkerOutMessage } from '../../src/simulation/worker_host';
import { SIMULATION_MODEL_VERSION } from '../../src/simulation/model_version';

// Worker boundary preserves determinism, protocol shape, and backpressure
// (FR017, FR018, docs/ARCHITECTURE.md section 3, docs/TEST_PLAN.md 2.4).
const SCENARIO = createScenario(
  2024,
  4202,
  {},
  {
    representativePopulationSize: 128,
    runHorizonYears: 2_000_000_000,
  },
);

function directDigest(): string {
  const engine = new Engine(SCENARIO);
  engine.run();
  const metrics = computeMetrics(engine.state);
  return computeDigest(engine.state, metrics);
}

describe('worker host protocol', () => {
  it('produces the same digest across the worker boundary as in thread', () => {
    const messages: WorkerOutMessage[] = [];
    const handle = createWorkerHost((m) => {
      messages.push(m);
      if (m.type === 'EVENT_BATCH') handle({ type: 'ACK_BATCH', batchId: m.batchId });
    });
    handle({ type: 'INIT', scenario: SCENARIO, modelVersion: SIMULATION_MODEL_VERSION });
    handle({ type: 'START' });
    const complete = messages.find((m) => m.type === 'RUN_COMPLETE');
    expect(complete).toBeDefined();
    if (complete && complete.type === 'RUN_COMPLETE') {
      expect(complete.digest).toBe(directDigest());
      expect(complete.headline.length).toBeGreaterThan(0);
      expect(complete.metrics.candidateWorldCount).toBe(128);
    }
  });

  it('sends only the contracted message kinds, in a valid order', () => {
    const messages: WorkerOutMessage[] = [];
    const handle = createWorkerHost((m) => {
      messages.push(m);
      if (m.type === 'EVENT_BATCH') handle({ type: 'ACK_BATCH', batchId: m.batchId });
    });
    handle({ type: 'INIT', scenario: SCENARIO, modelVersion: SIMULATION_MODEL_VERSION });
    handle({ type: 'START' });
    const kinds = new Set(messages.map((m) => m.type));
    for (const kind of kinds) {
      expect([
        'READY',
        'SNAPSHOT',
        'EVENT_BATCH',
        'METRICS_UPDATE',
        'RUN_COMPLETE',
        'PROGRESS',
        'ERROR',
      ]).toContain(kind);
    }
    expect(messages[0].type).toBe('SNAPSHOT');
    expect(messages[messages.length - 1].type).toBe('RUN_COMPLETE');
    // Event batches arrive in order with strictly increasing ids.
    const batchIds = messages
      .filter((m) => m.type === 'EVENT_BATCH')
      .map((m) => (m as { batchId: number }).batchId);
    for (let i = 1; i < batchIds.length; i++) {
      expect(batchIds[i]).toBe(batchIds[i - 1] + 1);
    }
  });

  it('honors backpressure: never more than two unacknowledged batches', () => {
    // A high activity scenario guarantees far more than two batches exist.
    const busy = createScenario(
      9,
      9,
      {
        lifeEmergence: 0.95,
        intelligenceEmergence: 0.9,
        technologicalTransition: 0.9,
        longTermSurvival: 0.9,
        detectableCommunication: 0.95,
        interstellarExpansion: 0.9,
      },
      { representativePopulationSize: 256, runHorizonYears: 10_000_000_000 },
    );
    let batches = 0;
    let sawComplete = false;
    const handle = createWorkerHost((m) => {
      if (m.type === 'EVENT_BATCH') batches++;
      if (m.type === 'RUN_COMPLETE') sawComplete = true;
    });
    handle({ type: 'INIT', scenario: busy, modelVersion: SIMULATION_MODEL_VERSION });
    handle({ type: 'START' });
    // No ACKs sent: delivery must stall at the in flight cap of two, and the
    // run must not complete past the cap.
    expect(batches).toBe(2);
    expect(sawComplete).toBe(false);
    // Acking releases exactly one more batch per ACK.
    handle({ type: 'ACK_BATCH', batchId: 0 });
    expect(batches).toBe(3);
  });

  it('rejects an invalid scenario with a recoverable ERROR', () => {
    const messages: WorkerOutMessage[] = [];
    const handle = createWorkerHost((m) => messages.push(m));
    handle({
      type: 'INIT',
      scenario: { bogus: true } as never,
      modelVersion: SIMULATION_MODEL_VERSION,
    });
    const error = messages.find((m) => m.type === 'ERROR');
    expect(error).toBeDefined();
    if (error && error.type === 'ERROR') {
      expect(error.recoverable).toBe(true);
    }
  });

  it('REPLAY_SAME_SEED reproduces the identical digest', () => {
    const digests: string[] = [];
    const handle = createWorkerHost((m) => {
      if (m.type === 'EVENT_BATCH') handle({ type: 'ACK_BATCH', batchId: m.batchId });
      if (m.type === 'RUN_COMPLETE') digests.push(m.digest);
    });
    handle({ type: 'INIT', scenario: SCENARIO, modelVersion: SIMULATION_MODEL_VERSION });
    handle({ type: 'START' });
    handle({ type: 'REPLAY_SAME_SEED' });
    expect(digests).toHaveLength(2);
    expect(digests[0]).toBe(digests[1]);
  });
});

describe('real worker boundary (via the @vitest/web-worker shim)', () => {
  it('completes a run through an actual Worker instance', async () => {
    const worker = new Worker(
      new URL('../../src/simulation/simulation.worker.ts', import.meta.url),
      { type: 'module' },
    );
    const digest = await new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('worker run timed out')), 30_000);
      worker.onmessage = (event: MessageEvent<WorkerOutMessage>) => {
        const m = event.data;
        if (m.type === 'EVENT_BATCH') {
          worker.postMessage({ type: 'ACK_BATCH', batchId: m.batchId });
        }
        if (m.type === 'RUN_COMPLETE') {
          clearTimeout(timer);
          resolve(m.digest);
        }
        if (m.type === 'ERROR') {
          clearTimeout(timer);
          reject(new Error(m.message));
        }
      };
      // Messages queue at the worker regardless of READY timing, so INIT and
      // START are posted immediately (the shim may deliver READY before this
      // handler attaches; a real browser queues it through the event loop).
      worker.postMessage({
        type: 'INIT',
        scenario: SCENARIO,
        modelVersion: SIMULATION_MODEL_VERSION,
      });
      worker.postMessage({ type: 'START' });
    });
    worker.terminate();
    expect(digest).toBe(directDigest());
  });
});
