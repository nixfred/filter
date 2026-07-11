import { describe, expect, it } from 'vitest';
import { Engine } from '../../../src/simulation/engine';
import { computeMetrics, generateHeadline } from '../../../src/simulation/metrics';
import { createScenario } from '../../../src/simulation/scenario';
import type { RunMetrics } from '../../../src/simulation/types';

// The fifteen metrics and the headline (FR009, FR027, BR004).
describe('computeMetrics', () => {
  const engine = new Engine(
    createScenario(91, 92, undefined, {
      representativePopulationSize: 128,
      runHorizonYears: 2_000_000_000,
    }),
  );
  engine.run();
  const m = computeMetrics(engine.state);

  it('fills every one of the fifteen fields plus the headline', () => {
    expect(m.candidateWorldCount).toBe(128);
    for (const value of Object.values(m)) {
      expect(value).not.toBeUndefined();
      expect(value).not.toBeNull();
    }
    expect(m.headline.length).toBeGreaterThan(10);
  });

  it('keeps the funnel ordered', () => {
    expect(m.detectableCivilizationCount).toBeLessThanOrEqual(m.technologicalCivilizationCount);
    expect(m.technologicalCivilizationCount).toBeLessThanOrEqual(m.intelligentSpeciesCount);
    expect(m.intelligentSpeciesCount).toBeLessThanOrEqual(m.independentLifeOriginCount);
  });

  it('attributes a most restrictive transition when anything progressed', () => {
    expect(m.mostRestrictiveTransitionId).not.toBe('none');
  });
});

describe('generateHeadline branches (UX003, no dashes ever)', () => {
  const base: RunMetrics = {
    candidateWorldCount: 2048,
    independentLifeOriginCount: 0,
    intelligentSpeciesCount: 0,
    technologicalCivilizationCount: 0,
    detectableCivilizationCount: 0,
    disappearedCivilizationCount: 0,
    peakSimultaneousActiveCount: 0,
    signalOverlapCount: 0,
    travelOverlapCount: 0,
    confirmedContactCount: 0,
    closestNearMissDistanceLy: 0,
    closestNearMissTimeYears: 0,
    longestLivedCivilizationYears: 0,
    medianTechnologicalLifetimeYears: 0,
    mostRestrictiveTransitionId: 'none',
    headline: '',
  };

  const cases: [string, Partial<RunMetrics>, string][] = [
    ['single contact', { confirmedContactCount: 1, detectableCivilizationCount: 5 }, 'once'],
    [
      'multiple contacts',
      { confirmedContactCount: 3, detectableCivilizationCount: 9 },
      'conversation',
    ],
    [
      'near miss in time',
      { detectableCivilizationCount: 12, closestNearMissTimeYears: 3_800_000 },
      'missed each other by 3.8 million years',
    ],
    ['lone speaker', { detectableCivilizationCount: 1 }, 'No one else was listening'],
    [
      'silent technology',
      { technologicalCivilizationCount: 4 },
      'made a sound the stars could carry',
    ],
    ['intelligence only', { intelligentSpeciesCount: 2 }, 'Technology never followed'],
    ['empty galaxy', {}, 'ever looked up'],
  ];

  for (const [name, overrides, expected] of cases) {
    it(`writes the ${name} headline`, () => {
      const headline = generateHeadline({ ...base, ...overrides });
      expect(headline).toContain(expected);
      expect(headline).not.toMatch(/[\u2013\u2014]/);
    });
  }

  it('formats large counts and long times readably', () => {
    const headline = generateHeadline({
      ...base,
      detectableCivilizationCount: 12_000,
      closestNearMissTimeYears: 2_100_000_000,
    });
    expect(headline).toContain('12 thousand civilizations spoke');
    expect(headline).toContain('2.1 billion years');
  });
});
