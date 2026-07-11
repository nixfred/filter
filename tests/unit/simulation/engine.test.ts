import { describe, expect, it } from 'vitest';
import { Engine } from '../../../src/simulation/engine';
import { createScenario } from '../../../src/simulation/scenario';

// Engine run lifecycle and event scheduling (FR025, docs/simulation_model.md
// sections 4 and 8).
const scenario = createScenario(71, 81, undefined, {
  representativePopulationSize: 128,
  runHorizonYears: 2_000_000_000,
});

describe('Engine', () => {
  it('completes with run_start and run_end milestones framing the log', () => {
    const engine = new Engine(scenario);
    engine.run();
    expect(engine.isComplete).toBe(true);
    const first = engine.state.events[0];
    const last = engine.state.events[engine.state.events.length - 1];
    expect(first.type).toBe('RunMilestone');
    expect(last.type).toBe('RunMilestone');
    if (first.type === 'RunMilestone') expect(first.label).toBe('run_start');
    if (last.type === 'RunMilestone') expect(last.label).toBe('run_end');
  });

  it('never logs an event beyond the run horizon', () => {
    const engine = new Engine(scenario);
    engine.run();
    for (const event of engine.state.events) {
      expect(event.atYear).toBeLessThanOrEqual(2_000_000_000);
    }
  });

  it('logs events with monotonically non decreasing years and unique ids', () => {
    const engine = new Engine(scenario);
    engine.run();
    const ids = new Set<number>();
    let previousYear = 0;
    for (const event of engine.state.events) {
      expect(ids.has(event.id)).toBe(false);
      ids.add(event.id);
      expect(event.atYear).toBeGreaterThanOrEqual(previousYear);
      previousYear = event.atYear;
    }
  });

  it('supports sliced processing that matches a single full run', () => {
    const whole = new Engine(scenario);
    whole.run();
    const sliced = new Engine(scenario);
    while (!sliced.isComplete) sliced.run(97);
    expect(sliced.state.events).toEqual(whole.state.events);
  });

  it('keeps every civilization history starting at habitable_world', () => {
    const engine = new Engine(scenario);
    engine.run();
    for (const civ of engine.state.civilizations) {
      expect(civ.stateHistory[0].state).toBe('habitable_world');
    }
  });
});
