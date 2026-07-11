// The event ledger (FR006, INTERACTION_SPEC 8.2): a non modal drawer showing
// important events by default. Reduced motion visitors read the run here.
import { COPY } from '../../content/copy';
import type { SimulationEvent } from '../../simulation/types';
import { formatYears } from '../../utils/format';

const IMPORTANT: SimulationEvent['type'][] = [
  'StateTransition',
  'ContactEvent',
  'TravelOverlapEvent',
  'ExtinctionEvent',
  'RunMilestone',
];

function describe(event: SimulationEvent): string | null {
  switch (event.type) {
    case 'StateTransition':
      return `Civilization ${event.civilizationId} entered ${event.toState.replace(/_/g, ' ')}`;
    case 'ContactEvent':
      return `Contact: civilization ${event.receivingCivilizationId} heard civilization ${event.sourceCivilizationId}`;
    case 'TravelOverlapEvent':
      return `A frontier reached the home of civilization ${event.overlappedCivilizationId}`;
    case 'ExtinctionEvent':
      return `Civilization ${event.civilizationId} went dark`;
    case 'RunMilestone':
      return event.label === 'run_start' ? 'The galaxy formed' : 'The run ended';
    default:
      return null;
  }
}

interface Props {
  events: SimulationEvent[];
  onClose(): void;
}

export function EventLedger({ events, onClose }: Props) {
  const rows = events.filter((e) => IMPORTANT.includes(e.type)).slice(-200);
  return (
    <aside className="drawer ledger" aria-label="Event ledger">
      <div className="drawer-head">
        <h2>Event ledger</h2>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
      {rows.length === 0 ? (
        <p className="ledger-empty">{COPY.degraded.emptyLedger}</p>
      ) : (
        <ol className="ledger-list" data-testid="ledger-list">
          {rows.map((event) => {
            const text = describe(event);
            if (!text) return null;
            return (
              <li key={event.id}>
                <span className="ledger-year">{formatYears(event.atYear)}</span> {text}
              </li>
            );
          })}
        </ol>
      )}
    </aside>
  );
}
