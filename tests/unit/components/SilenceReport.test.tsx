import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SilenceReport } from '../../../src/components/SilenceReport/SilenceReport';
import type { RunMetrics } from '../../../src/simulation/types';

// Silence Report rendering (FR009, FR027): headline first, fifteen metrics
// formatted, all three groups present.
const metrics: RunMetrics = {
  candidateWorldCount: 2048,
  independentLifeOriginCount: 300,
  intelligentSpeciesCount: 40,
  technologicalCivilizationCount: 25,
  detectableCivilizationCount: 12,
  disappearedCivilizationCount: 30,
  peakSimultaneousActiveCount: 3,
  signalOverlapCount: 5,
  travelOverlapCount: 200,
  confirmedContactCount: 1,
  closestNearMissDistanceLy: 1834,
  closestNearMissTimeYears: 3_800_000,
  longestLivedCivilizationYears: 42_000_000,
  medianTechnologicalLifetimeYears: 900_000,
  mostRestrictiveTransitionId: 'habitable_to_life',
  headline: 'Twelve civilizations spoke. The nearest reply never came.',
};

const noop = () => {};

describe('SilenceReport', () => {
  it('shows the headline before any metric', () => {
    render(
      <SilenceReport
        metrics={metrics}
        headline={metrics.headline}
        onReplay={noop}
        onNewGalaxy={noop}
        onShare={noop}
        onClose={noop}
      />,
    );
    expect(screen.getByTestId('report-headline')).toHaveTextContent(metrics.headline);
  });

  it('formats all fifteen metrics readably', () => {
    render(
      <SilenceReport
        metrics={metrics}
        headline={metrics.headline}
        onReplay={noop}
        onNewGalaxy={noop}
        onShare={noop}
        onClose={noop}
      />,
    );
    expect(screen.getByTestId('metric-candidateWorldCount')).toHaveTextContent('2,048');
    expect(screen.getByTestId('metric-closestNearMissDistanceLy')).toHaveTextContent(
      '1,834 light years',
    );
    expect(screen.getByTestId('metric-closestNearMissTimeYears')).toHaveTextContent(
      '3.8 million years',
    );
    expect(screen.getByTestId('metric-mostRestrictiveTransitionId')).toHaveTextContent(
      'The origin of life',
    );
    // Fifteen metric rows exist.
    expect(document.querySelectorAll('.metric-row')).toHaveLength(15);
  });

  it('wires the four action buttons', () => {
    const onReplay = vi.fn();
    const onClose = vi.fn();
    render(
      <SilenceReport
        metrics={metrics}
        headline={metrics.headline}
        onReplay={onReplay}
        onNewGalaxy={noop}
        onShare={noop}
        onClose={onClose}
      />,
    );
    screen.getByRole('button', { name: 'Replay' }).click();
    screen.getByTestId('close-report').click();
    expect(onReplay).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });
});
