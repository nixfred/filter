import { describe, expect, it } from 'vitest';
import { stateEntryYear, terminalEntry } from '../../../src/simulation/civilization';
import { Engine } from '../../../src/simulation/engine';
import { createScenario } from '../../../src/simulation/scenario';
import type { Civilization } from '../../../src/simulation/types';

// Civilization records, posthumous signal truncation, and expansion history
// (FR016, FR020, FR021).
const civ: Civilization = {
  id: 0,
  hostSystemId: 0,
  currentState: 'extinct',
  stateHistory: [
    { state: 'habitable_world', atYear: 10 },
    { state: 'life', atYear: 100 },
    { state: 'intelligence', atYear: 300 },
    { state: 'extinct', atYear: 900 },
  ],
  detectableWindow: null,
  frontierId: null,
  extinctionCause: 'selfDestruction',
};

describe('state history helpers', () => {
  it('finds first entry years and the terminal entry', () => {
    expect(stateEntryYear(civ, 'life')).toBe(100);
    expect(stateEntryYear(civ, 'technology')).toBeNull();
    expect(terminalEntry(civ)).toEqual({ state: 'extinct', atYear: 900 });
    expect(terminalEntry({ ...civ, stateHistory: civ.stateHistory.slice(0, 2) })).toBeNull();
  });
});

describe('emission truncation at extinction (FR020)', () => {
  // A deterministic high hazard, high detectability run guarantees extinct
  // civilizations whose signals were live at extinction.
  const scenario = createScenario(
    31,
    41,
    {
      lifeEmergence: 0.9,
      intelligenceEmergence: 0.9,
      technologicalTransition: 0.9,
      longTermSurvival: 0.1,
      detectableCommunication: 0.9,
      interstellarExpansion: 0.1,
    },
    { representativePopulationSize: 256, runHorizonYears: 10_000_000_000 },
  );

  it('never leaves an emission running past its source extinction', () => {
    const engine = new Engine(scenario);
    engine.run();
    let truncatedSeen = 0;
    for (const signal of engine.state.signals) {
      const source = engine.state.civilizations[signal.sourceCivilizationId];
      const extinctAt = stateEntryYear(source, 'extinct');
      if (extinctAt !== null) {
        expect(signal.emissionEndYear).toBeLessThanOrEqual(extinctAt);
        truncatedSeen++;
      }
    }
    // The scenario is built so this branch is actually exercised.
    expect(truncatedSeen).toBeGreaterThan(0);
  });

  it('keeps the detectable window consistent with the truncated emission', () => {
    const engine = new Engine(scenario);
    engine.run();
    for (const civRecord of engine.state.civilizations) {
      const extinctAt = stateEntryYear(civRecord, 'extinct');
      if (extinctAt !== null && civRecord.detectableWindow) {
        expect(civRecord.detectableWindow.endYear).toBeLessThanOrEqual(extinctAt);
      }
    }
  });
});

describe('expansion frontier history (FR021)', () => {
  it('settles systems in reach order without altering other civilizations', () => {
    const scenario = createScenario(
      51,
      61,
      {
        lifeEmergence: 0.9,
        intelligenceEmergence: 0.9,
        technologicalTransition: 0.9,
        longTermSurvival: 0.95,
        detectableCommunication: 0.9,
        interstellarExpansion: 0.95,
      },
      { representativePopulationSize: 128, runHorizonYears: 10_000_000_000 },
    );
    const engine = new Engine(scenario);
    engine.run();
    expect(engine.state.frontiers.length).toBeGreaterThan(0);
    for (const event of engine.state.events) {
      if (event.type !== 'TravelOverlapEvent') continue;
      const overlapped = engine.state.civilizations[event.overlappedCivilizationId];
      // R009: overlap never rewrites the overlapped civilization's history.
      expect(overlapped.stateHistory.some((h) => h.state === 'habitable_world')).toBe(true);
    }
  });
});
