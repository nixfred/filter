import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AboutPanel } from '../../../src/components/AboutPanel/AboutPanel';
import { SIMULATION_MODEL_VERSION } from '../../../src/simulation/model_version';

// About panel version surface and clear control (OPS009, FR013, DATA002).
describe('AboutPanel', () => {
  it('shows the deployed version identifiers (OPS009)', () => {
    render(
      <AboutPanel
        build={{ appVersion: '1.2.3', commit: 'abcdef1234567890' }}
        reducedMotion={false}
        lowPowerMode={false}
        onToggleReducedMotion={() => {}}
        onToggleLowPower={() => {}}
        onClearData={() => {}}
        onClose={() => {}}
      />,
    );
    expect(screen.getByTestId('about-app-version')).toHaveTextContent('1.2.3');
    expect(screen.getByTestId('about-model-version')).toHaveTextContent(
      String(SIMULATION_MODEL_VERSION),
    );
    expect(screen.getByTestId('about-commit')).toHaveTextContent('abcdef123456');
  });

  it('falls back to local markers with no build metadata', () => {
    render(
      <AboutPanel
        build={null}
        reducedMotion={false}
        lowPowerMode={false}
        onToggleReducedMotion={() => {}}
        onToggleLowPower={() => {}}
        onClearData={() => {}}
        onClose={() => {}}
      />,
    );
    expect(screen.getByTestId('about-app-version')).toHaveTextContent('development');
    expect(screen.getByTestId('about-commit')).toHaveTextContent('local');
  });

  it('wires the clear local data control (FR013)', () => {
    const onClearData = vi.fn();
    render(
      <AboutPanel
        build={null}
        reducedMotion={false}
        lowPowerMode={false}
        onToggleReducedMotion={() => {}}
        onToggleLowPower={() => {}}
        onClearData={onClearData}
        onClose={() => {}}
      />,
    );
    screen.getByTestId('clear-data').click();
    expect(onClearData).toHaveBeenCalledOnce();
  });
});
