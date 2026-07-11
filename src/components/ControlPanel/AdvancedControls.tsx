// Advanced parameter controls (FR003, docs/DATA_MODEL.md section 1.2). Every
// field the scenario schema supports is exposed here. Unset fields derive
// from the six main controls; touching a control sets an explicit override.
// The scenario schema clamps every value, so nothing here can produce an
// invalid run (SEC002).
import type { AdvancedParams } from '../../simulation/types';
import {
  DEFAULT_DETECTION_RECOGNITION_THRESHOLD,
  DEFAULT_EXPANSION_LAUNCH_DELAY_YEARS,
  DEFAULT_EXPANSION_SETTLEMENT_DELAY_YEARS,
  DEFAULT_REPRESENTATIVE_POPULATION,
  DEFAULT_RUN_HORIZON_YEARS,
  MAX_REPRESENTATIVE_POPULATION,
} from '../../simulation/scenario';
import { formatYears } from '../../utils/format';

interface Props {
  advanced: AdvancedParams;
  interstellarExpansion: number;
  onChange(advanced: AdvancedParams): void;
}

const HORIZONS: { label: string; years: number }[] = [
  { label: '1B', years: 1_000_000_000 },
  { label: '5B', years: 5_000_000_000 },
  { label: '10B', years: 10_000_000_000 },
  { label: '50B', years: 50_000_000_000 },
];

export function AdvancedControls({ advanced, interstellarExpansion, onChange }: Props) {
  const set = <K extends keyof AdvancedParams>(key: K, value: AdvancedParams[K]) =>
    onChange({ ...advanced, [key]: value });

  const horizon = advanced.runHorizonYears ?? DEFAULT_RUN_HORIZON_YEARS;
  const population = advanced.representativePopulationSize ?? DEFAULT_REPRESENTATIVE_POPULATION;
  const threshold =
    advanced.detectionRecognitionThreshold ?? DEFAULT_DETECTION_RECOGNITION_THRESHOLD;
  const derivedSpeed = 0.01 + 0.09 * interstellarExpansion;
  const speed = advanced.expansionEffectiveSpeedFractionC ?? derivedSpeed;
  const launchDelay = advanced.expansionLaunchDelayYears ?? DEFAULT_EXPANSION_LAUNCH_DELAY_YEARS;
  const settleDelay =
    advanced.expansionSettlementDelayYears ?? DEFAULT_EXPANSION_SETTLEMENT_DELAY_YEARS;

  return (
    <div className="advanced-controls" data-testid="advanced-controls">
      <div className="adv-control">
        <div className="adv-head">
          <span className="adv-label">Run horizon</span>
          <span className="adv-value">{formatYears(horizon)}</span>
        </div>
        <div className="adv-segment" role="radiogroup" aria-label="Run horizon">
          {HORIZONS.map((h) => (
            <button
              key={h.years}
              type="button"
              role="radio"
              aria-checked={horizon === h.years}
              className={horizon === h.years ? 'adv-seg-active' : ''}
              data-testid={`horizon-${h.label}`}
              onClick={() => set('runHorizonYears', h.years)}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>

      <AdvSlider
        id="adv-population"
        label="Simulated systems"
        value={population}
        min={256}
        max={MAX_REPRESENTATIVE_POPULATION}
        step={256}
        display={`${population.toLocaleString('en-US')} stars`}
        onChange={(v) => set('representativePopulationSize', v)}
      />

      <AdvSlider
        id="adv-threshold"
        label="Detection threshold"
        value={Math.round(threshold * 100)}
        min={1}
        max={100}
        step={1}
        display={`${Math.round(threshold * 100)} percent signal needed`}
        onChange={(v) => set('detectionRecognitionThreshold', v / 100)}
      />

      <AdvSlider
        id="adv-speed"
        label="Expansion speed"
        value={Math.round(speed * 100)}
        min={1}
        max={99}
        step={1}
        display={`${Math.round(speed * 100)} percent of light speed`}
        onChange={(v) => set('expansionEffectiveSpeedFractionC', v / 100)}
      />

      <AdvSlider
        id="adv-launch"
        label="Expansion launch delay"
        value={launchDelay}
        min={0}
        max={1_000_000}
        step={1000}
        display={formatYears(launchDelay)}
        onChange={(v) => set('expansionLaunchDelayYears', v)}
      />

      <AdvSlider
        id="adv-settle"
        label="Settlement delay"
        value={settleDelay}
        min={0}
        max={500_000}
        step={500}
        display={formatYears(settleDelay)}
        onChange={(v) => set('expansionSettlementDelayYears', v)}
      />

      <button
        type="button"
        className="detail-toggle adv-reset"
        data-testid="advanced-reset"
        onClick={() => onChange({})}
      >
        Reset advanced to defaults
      </button>
    </div>
  );
}

interface SliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange(value: number): void;
}

function AdvSlider({ id, label, value, min, max, step, display, onChange }: SliderProps) {
  return (
    <div className="adv-control">
      <div className="adv-head">
        <label className="adv-label" htmlFor={id}>
          {label}
        </label>
        <span className="adv-value">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={display}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}
