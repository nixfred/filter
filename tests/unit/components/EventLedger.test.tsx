import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EventLedger } from '../../../src/components/EventLedger/EventLedger';
import type { SimulationEvent } from '../../../src/simulation/types';

// Event ledger (FR006): important events described in plain language, empty
// state when nothing has happened.
const events: SimulationEvent[] = [
  { id: 0, atYear: 0, causeEventId: null, type: 'RunMilestone', label: 'run_start' },
  {
    id: 1,
    atYear: 2_000_000,
    causeEventId: null,
    type: 'StateTransition',
    civilizationId: 4,
    fromState: 'technology',
    toState: 'detectable',
    hostSystemId: 9,
  },
  {
    id: 2,
    atYear: 3_500_000,
    causeEventId: null,
    type: 'ContactEvent',
    signalId: 1,
    sourceCivilizationId: 4,
    receivingCivilizationId: 7,
  },
];

describe('EventLedger', () => {
  it('renders important events in plain language', () => {
    render(<EventLedger events={events} onClose={() => {}} />);
    const list = screen.getByTestId('ledger-list');
    expect(list).toHaveTextContent('The galaxy formed');
    expect(list).toHaveTextContent('entered detectable');
    expect(list).toHaveTextContent('Contact: civilization 7 heard civilization 4');
  });

  it('shows an empty state when nothing has happened', () => {
    render(<EventLedger events={[]} onClose={() => {}} />);
    expect(
      screen.getByText('Nothing has happened yet. Cosmic patience is a virtue.'),
    ).toBeInTheDocument();
  });
});
