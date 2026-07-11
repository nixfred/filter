import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { AdvancedControls } from '../../../src/components/ControlPanel/AdvancedControls';

// Advanced parameter controls (FR003, docs/DATA_MODEL.md 1.2): every control
// sets an explicit override; reset clears them all.
describe('AdvancedControls', () => {
  it('shows derived defaults when nothing is overridden', () => {
    render(<AdvancedControls advanced={{}} interstellarExpansion={0.3} onChange={() => {}} />);
    // Default run horizon 10B is selected.
    expect(screen.getByTestId('horizon-10B')).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText('2,048 stars')).toBeInTheDocument();
    // Derived expansion speed at interstellar 0.3: 0.01 + 0.09*0.3 = 0.037 -> 4 percent.
    expect(screen.getByText('4 percent of light speed')).toBeInTheDocument();
  });

  it('sets an override when a control changes', () => {
    const onChange = vi.fn();
    render(<AdvancedControls advanced={{}} interstellarExpansion={0.3} onChange={onChange} />);
    fireEvent.click(screen.getByTestId('horizon-1B'));
    expect(onChange).toHaveBeenCalledWith({ runHorizonYears: 1_000_000_000 });
  });

  it('reflects existing overrides', () => {
    render(
      <AdvancedControls
        advanced={{ runHorizonYears: 50_000_000_000, representativePopulationSize: 4096 }}
        interstellarExpansion={0.3}
        onChange={() => {}}
      />,
    );
    expect(screen.getByTestId('horizon-50B')).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText('4,096 stars')).toBeInTheDocument();
  });

  it('reset clears all overrides', () => {
    const onChange = vi.fn();
    render(
      <AdvancedControls
        advanced={{ runHorizonYears: 1_000_000_000 }}
        interstellarExpansion={0.3}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByTestId('advanced-reset'));
    expect(onChange).toHaveBeenCalledWith({});
  });
});
