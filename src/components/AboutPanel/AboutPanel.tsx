// About and privacy panel (OPS009, DATA002, FR013, R016): version identifiers
// tied to the deployed commit, privacy posture, and the clear local data
// control.
import { useEffect, useRef } from 'react';
import { SIMULATION_MODEL_VERSION } from '../../simulation/model_version';

interface BuildInfo {
  appVersion: string;
  commit: string;
}

interface Props {
  build: BuildInfo | null;
  reducedMotion: boolean;
  lowPowerMode: boolean;
  onToggleReducedMotion(): void;
  onToggleLowPower(): void;
  onClearData(): void;
  onClose(): void;
}

export function AboutPanel({
  build,
  reducedMotion,
  lowPowerMode,
  onToggleReducedMotion,
  onToggleLowPower,
  onClearData,
  onClose,
}: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <aside className="drawer about" aria-labelledby="about-heading">
      <div className="drawer-head">
        <h2 id="about-heading" tabIndex={-1} ref={headingRef}>
          About and privacy
        </h2>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
      <p className="about-line">
        The Great Filter is a NixFred LABS project. It is free, keeps no account, and collects no
        personal data beyond privacy respecting analytics.
      </p>
      <dl className="about-versions">
        <div className="metric-row">
          <dt>Application version</dt>
          <dd data-testid="about-app-version">{build?.appVersion ?? 'development'}</dd>
        </div>
        <div className="metric-row">
          <dt>Simulation model version</dt>
          <dd data-testid="about-model-version">{SIMULATION_MODEL_VERSION}</dd>
        </div>
        <div className="metric-row">
          <dt>Deployed commit</dt>
          <dd data-testid="about-commit">{build?.commit?.slice(0, 12) ?? 'local'}</dd>
        </div>
      </dl>
      <div className="about-toggles">
        <label className="toggle-row">
          <input
            type="checkbox"
            data-testid="toggle-reduced-motion"
            checked={reducedMotion}
            onChange={onToggleReducedMotion}
          />
          Reduced motion. Replace animation with discrete state changes.
        </label>
        <label className="toggle-row">
          <input
            type="checkbox"
            data-testid="toggle-low-power"
            checked={lowPowerMode}
            onChange={onToggleLowPower}
          />
          Low power mode. Fewer visual stars and effects. The model is identical.
        </label>
      </div>
      <p className="about-line">
        Your preferences and last scenario live only in this browser. Clearing them removes both and
        returns to the opening state.
      </p>
      <button
        type="button"
        className="button-outline"
        data-testid="clear-data"
        onClick={onClearData}
      >
        Clear local data
      </button>
    </aside>
  );
}
