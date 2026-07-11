import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from '../../../src/app/App';
import { SIMULATION_MODEL_VERSION } from '../../../src/simulation/model_version';

// UX004 opening state shell and OPS009 version surface.
describe('App opening shell', () => {
  it('renders the title treatment', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('THE GREAT FILTER');
  });

  it('renders the supporting line', () => {
    render(<App />);
    expect(
      screen.getByText('Build a galaxy. Seed the stars. See who survives long enough to be heard.'),
    ).toBeInTheDocument();
  });

  it('surfaces the simulation model version', () => {
    render(<App />);
    expect(screen.getByTestId('model-version')).toHaveTextContent(
      `model v${SIMULATION_MODEL_VERSION}`,
    );
  });
});
