// Keyboard shortcuts help sheet (ACC001, docs/ACCESSIBILITY.md 1.1 rule 5):
// opened with the question mark key, lists the global and canvas map.
import { useEffect, useRef } from 'react';

const GLOBAL_KEYS: [string, string][] = [
  ['Space', 'Start, pause, or resume'],
  ['R', 'Reset the run'],
  ['Shift plus R', 'Replay the same seed'],
  ['N', 'Randomize the seed'],
  ['[  and  ]', 'Slower and faster'],
  ['E', 'Event ledger'],
  ['S', 'Share dialog'],
  ['L', 'Show or hide labels'],
  ['P', 'Presets'],
  ['Question mark', 'This help'],
  ['Escape', 'Close the topmost overlay'],
];

const CANVAS_KEYS: [string, string][] = [
  ['Arrow keys', 'Move the civilization selection'],
  ['Enter', 'Inspect the selected civilization'],
  ['Shift plus Arrow keys', 'Pan the camera'],
  ['Plus and minus', 'Zoom in and out'],
  ['Home', 'Reset the camera framing'],
];

interface Props {
  onClose(): void;
}

export function KeyboardHelp({ onClose }: Props) {
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
    <div
      className="dialog-scrim"
      role="dialog"
      aria-modal="true"
      aria-labelledby="keyboard-help-heading"
    >
      <div className="dialog keyboard-help">
        <h2 id="keyboard-help-heading" tabIndex={-1} ref={headingRef}>
          Keyboard shortcuts
        </h2>
        <h3>Anywhere</h3>
        <dl className="keymap">
          {GLOBAL_KEYS.map(([key, action]) => (
            <div className="metric-row" key={key}>
              <dt>{action}</dt>
              <dd>{key}</dd>
            </div>
          ))}
        </dl>
        <h3>On the galaxy map</h3>
        <dl className="keymap">
          {CANVAS_KEYS.map(([key, action]) => (
            <div className="metric-row" key={key}>
              <dt>{action}</dt>
              <dd>{key}</dd>
            </div>
          ))}
        </dl>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
