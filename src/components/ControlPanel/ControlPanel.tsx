// The six control configuration panel (FR001, FR002, FR003, R008,
// INTERACTION_SPEC 1.2). Sliders are 21 stop logarithmic style controls with
// rung labels rather than raw numbers.
import { useState } from 'react';
import { COPY } from '../../content/copy';
import type { MainControls } from '../../simulation/types';

const CONTROL_ORDER: (keyof MainControls)[] = [
  'lifeEmergence',
  'intelligenceEmergence',
  'technologicalTransition',
  'longTermSurvival',
  'detectableCommunication',
  'interstellarExpansion',
];

const STOPS = 21;

function rungFor(value: number): string {
  const index = Math.min(COPY.rungs.length - 1, Math.floor(value * COPY.rungs.length));
  return COPY.rungs[index];
}

interface Props {
  controls: MainControls;
  presetName: string | null;
  onChange(controls: MainControls): void;
  onStart(): void;
}

export function ControlPanel({ controls, presetName, onChange, onStart }: Props) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState<string | null>(null);

  return (
    <section className="control-rail" aria-label="Galaxy controls">
      {presetName ? <p className="preset-label">Preset: {presetName}</p> : null}
      {CONTROL_ORDER.map((key) => {
        const copy = COPY.controls[key];
        const value = controls[key];
        return (
          <div className="control" key={key}>
            <div className="control-head">
              <label className="control-label" htmlFor={`control-${key}`}>
                {copy.label}
              </label>
              <span className="control-value" data-testid={`value-${key}`}>
                {rungFor(value)}
              </span>
            </div>
            <p className="control-explanation">{copy.explanation}</p>
            <input
              id={`control-${key}`}
              type="range"
              min={0}
              max={STOPS - 1}
              step={1}
              value={Math.round(value * (STOPS - 1))}
              aria-valuetext={rungFor(value)}
              onChange={(event) =>
                onChange({ ...controls, [key]: Number(event.target.value) / (STOPS - 1) })
              }
            />
            <div className="control-range">
              <span>{COPY.rungs[0]}</span>
              <span>{COPY.rungs[COPY.rungs.length - 1]}</span>
            </div>
            <p className="control-effect">
              {copy.effect}{' '}
              <button
                type="button"
                className="detail-toggle"
                aria-expanded={detailOpen === key}
                onClick={() => setDetailOpen(detailOpen === key ? null : key)}
              >
                Mathematical detail
              </button>
            </p>
            {detailOpen === key ? (
              <p className="control-detail">
                This control blends an eligibility probability with waiting time or hazard rate
                parameters, documented in the simulation model. Current setting:{' '}
                {(value * 100).toFixed(0)} on a 0 to 100 scale.
              </p>
            ) : null}
          </div>
        );
      })}
      <div className="control-advanced">
        <button
          type="button"
          aria-expanded={advancedOpen}
          onClick={() => setAdvancedOpen(!advancedOpen)}
        >
          Advanced settings
        </button>
        {advancedOpen ? (
          <p className="control-detail">
            Advanced overrides (run horizon, population, detection threshold, expansion timing)
            arrive in a later phase. Every value currently derives from the six controls above.
          </p>
        ) : null}
      </div>
      <button type="button" className="button-primary start-button" onClick={onStart}>
        {COPY.start}
      </button>
    </section>
  );
}
