// Preset picker (FR010, INTERACTION_SPEC 1.1.1): a modal dialog listing the
// eight packet presets; selection lands in the configuration state.
import { useEffect, useRef } from 'react';
import { PRESETS, type Preset } from '../../content/presets';

interface Props {
  onSelect(preset: Preset): void;
  onClose(): void;
}

export function ScenarioPresets({ onSelect, onClose }: Props) {
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
    <div className="dialog-scrim" role="dialog" aria-modal="true" aria-labelledby="presets-heading">
      <div className="dialog preset-picker">
        <h2 id="presets-heading" tabIndex={-1} ref={headingRef}>
          Run a preset
        </h2>
        <ul className="preset-list">
          {PRESETS.map((preset) => (
            <li key={preset.id}>
              <button
                type="button"
                className="preset-card"
                data-testid={`preset-${preset.id}`}
                onClick={() => onSelect(preset)}
              >
                <span className="preset-name">{preset.name}</span>
                <span className="preset-description">{preset.description}</span>
              </button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
