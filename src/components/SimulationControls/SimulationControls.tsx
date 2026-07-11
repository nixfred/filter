// Transport bar (FR004, FR024, INTERACTION_SPEC 1.3): playback controls in
// one group, run ending controls visually distinct in another.
import type { SpeedStep } from '../../state/simulation_store';

const SPEED_STEPS: { step: SpeedStep; label: string }[] = [
  { step: 'pause', label: 'Pause' },
  { step: '1x', label: '1x' },
  { step: '10x', label: '10x' },
  { step: '100x', label: '100x' },
  { step: '1000x', label: '1000x' },
  { step: 'max', label: 'Max' },
];

interface Props {
  phase: 'running' | 'paused' | 'complete';
  speed: SpeedStep;
  onPauseResume(): void;
  onSpeed(step: SpeedStep): void;
  onReset(): void;
  onReplay(): void;
  onRandomize(): void;
}

export function SimulationControls(props: Props) {
  return (
    <div className="transport" role="toolbar" aria-label="Run controls">
      <div className="transport-playback">
        <button
          type="button"
          data-testid="pause-resume"
          onClick={props.onPauseResume}
          disabled={props.phase === 'complete'}
        >
          {props.phase === 'paused' ? 'Resume' : 'Pause'}
        </button>
        <div className="speed-steps" role="radiogroup" aria-label="Simulation speed">
          {SPEED_STEPS.map(({ step, label }) => (
            <button
              key={step}
              type="button"
              role="radio"
              aria-checked={props.speed === step}
              data-testid={`speed-${step}`}
              className={props.speed === step ? 'speed-active' : ''}
              onClick={() => props.onSpeed(step)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="transport-run">
        <button type="button" data-testid="reset" onClick={props.onReset}>
          Reset
        </button>
        <button type="button" data-testid="replay" onClick={props.onReplay}>
          Replay seed
        </button>
        <button type="button" data-testid="randomize" onClick={props.onRandomize}>
          New seed
        </button>
      </div>
    </div>
  );
}
