// Top status bar (INTERACTION_SPEC 1.3 items 10 to 12): simulated time,
// aggregate counts, ledger and label toggles, share, and the report
// affordance once a run completes.
import { COPY } from '../../content/copy';
import { formatYears } from '../../utils/format';

interface Props {
  displayYear: number;
  civilizationCount: number;
  labelsVisible: boolean;
  reportAvailable: boolean;
  onToggleLedger(): void;
  onToggleLabels(): void;
  onShare(): void;
  onViewReport(): void;
  onStartOver(): void;
}

export function StatusBar(props: Props) {
  return (
    <div className="status-bar">
      <span className="status-time" data-testid="sim-time" aria-hidden="true">
        {formatYears(props.displayYear)}
      </span>
      <div className="status-actions">
        <button
          type="button"
          className="button-startover"
          data-testid="start-over"
          onClick={props.onStartOver}
        >
          Start over
        </button>
        <button type="button" data-testid="toggle-ledger" onClick={props.onToggleLedger}>
          Ledger
        </button>
        <button
          type="button"
          data-testid="toggle-labels"
          aria-pressed={props.labelsVisible}
          onClick={props.onToggleLabels}
        >
          Labels
        </button>
        <button type="button" data-testid="share" onClick={props.onShare}>
          {COPY.report.share}
        </button>
        {props.reportAvailable ? (
          <button type="button" data-testid="view-report" onClick={props.onViewReport}>
            {COPY.report.viewReport}
          </button>
        ) : null}
      </div>
    </div>
  );
}
