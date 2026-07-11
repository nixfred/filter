// The Silence Report (FR009, BR004, INTERACTION_SPEC 1.4): headline first,
// fifteen metrics in three groups, actions row.
import { useEffect, useRef } from 'react';
import { COPY } from '../../content/copy';
import type { RunMetrics } from '../../simulation/types';
import { formatCount, formatLightYears, formatYears } from '../../utils/format';

const GROUPS: { title: string; keys: (keyof typeof COPY.metricLabels)[] }[] = [
  {
    title: COPY.report.funnel,
    keys: [
      'candidateWorldCount',
      'independentLifeOriginCount',
      'intelligentSpeciesCount',
      'technologicalCivilizationCount',
      'detectableCivilizationCount',
      'disappearedCivilizationCount',
    ],
  },
  {
    title: COPY.report.overlap,
    keys: [
      'peakSimultaneousActiveCount',
      'signalOverlapCount',
      'travelOverlapCount',
      'confirmedContactCount',
    ],
  },
  {
    title: COPY.report.records,
    keys: [
      'closestNearMissDistanceLy',
      'closestNearMissTimeYears',
      'longestLivedCivilizationYears',
      'medianTechnologicalLifetimeYears',
      'mostRestrictiveTransitionId',
    ],
  },
];

function metricValue(metrics: RunMetrics, key: keyof typeof COPY.metricLabels): string {
  const value = metrics[key];
  switch (key) {
    case 'closestNearMissDistanceLy':
      return formatLightYears(value as number);
    case 'closestNearMissTimeYears':
    case 'longestLivedCivilizationYears':
    case 'medianTechnologicalLifetimeYears':
      return (value as number) > 0 ? formatYears(value as number) : 'none recorded';
    case 'mostRestrictiveTransitionId':
      return COPY.transitionNames[value as keyof typeof COPY.transitionNames];
    default:
      return formatCount(value as number);
  }
}

interface Props {
  metrics: RunMetrics;
  headline: string;
  onReplay(): void;
  onNewGalaxy(): void;
  onShare(): void;
  onClose(): void;
}

export function SilenceReport(props: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, []);
  return (
    <aside className="drawer report" aria-labelledby="report-heading" data-testid="silence-report">
      <h2 id="report-heading" tabIndex={-1} ref={headingRef}>
        {COPY.report.heading}
      </h2>
      <p className="report-headline" data-testid="report-headline">
        {props.headline}
      </p>
      {GROUPS.map((group) => (
        <section key={group.title} className="report-group">
          <h3>{group.title}</h3>
          <dl>
            {group.keys.map((key) => (
              <div className="metric-row" key={key}>
                <dt>{COPY.metricLabels[key]}</dt>
                <dd data-testid={`metric-${key}`}>{metricValue(props.metrics, key)}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
      <div className="report-actions">
        <button type="button" onClick={props.onReplay}>
          {COPY.report.replay}
        </button>
        <button type="button" onClick={props.onNewGalaxy}>
          {COPY.report.newGalaxy}
        </button>
        <button type="button" onClick={props.onShare}>
          {COPY.report.share}
        </button>
        <button type="button" data-testid="close-report" onClick={props.onClose}>
          {COPY.report.close}
        </button>
      </div>
    </aside>
  );
}
