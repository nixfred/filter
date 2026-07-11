import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { App } from '../../../src/app/App';
import { StoresProvider } from '../../../src/app/providers';
import { createSimulationStore, type WorkerLike } from '../../../src/state/simulation_store';
import { createUiStore } from '../../../src/state/ui_store';
import { createWorkerHost, type WorkerInMessage } from '../../../src/simulation/worker_host';
import { SIMULATION_MODEL_VERSION } from '../../../src/simulation/model_version';

// Opening and configuration states (UX004, INTERACTION_SPEC 1.1, 1.2) plus
// the OPS009 version surface, rendered against real stores with a real
// protocol host behind a fake worker boundary.
function fakeWorker(): WorkerLike {
  let listener: ((event: MessageEvent) => void) | null = null;
  const handle = createWorkerHost((message) => listener?.({ data: message } as MessageEvent));
  return {
    postMessage: (m: WorkerInMessage) => handle(m),
    addEventListener: (_t, h) => {
      listener = h;
    },
    terminate: () => {
      listener = null;
    },
  };
}

function renderApp() {
  const map = new Map<string, string>();
  const stores = {
    simulation: createSimulationStore(fakeWorker),
    ui: createUiStore({
      getItem: (k: string) => map.get(k) ?? null,
      setItem: (k: string, v: string) => void map.set(k, v),
      removeItem: (k: string) => void map.delete(k),
    }),
  };
  return render(
    <StoresProvider stores={stores}>
      <App />
    </StoresProvider>,
  );
}

describe('App opening state', () => {
  it('renders the title treatment and both primary actions', () => {
    renderApp();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('THE GREAT FILTER');
    expect(screen.getByTestId('create-galaxy')).toBeInTheDocument();
    expect(screen.getByTestId('run-preset')).toBeInTheDocument();
  });

  it('surfaces the simulation model version in the footer (OPS009)', () => {
    renderApp();
    expect(screen.getByTestId('model-version')).toHaveTextContent(
      `model v${SIMULATION_MODEL_VERSION}`,
    );
  });

  it('links nixfred.com and the repository (REL007)', () => {
    renderApp();
    expect(screen.getByRole('link', { name: 'nixfred.com' })).toHaveAttribute(
      'href',
      'https://nixfred.com',
    );
    expect(screen.getByRole('link', { name: 'Source' })).toHaveAttribute(
      'href',
      'https://github.com/nixfred/filter',
    );
  });
});

describe('configuration state', () => {
  it('CREATE A GALAXY reveals the six controls and Start', () => {
    renderApp();
    fireEvent.click(screen.getByTestId('create-galaxy'));
    expect(screen.getAllByRole('slider')).toHaveLength(6);
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
  });

  it('RUN A PRESET opens the picker with all eight presets', () => {
    renderApp();
    fireEvent.click(screen.getByTestId('run-preset'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(8);
    fireEvent.click(screen.getByTestId('preset-silent-galaxy'));
    // Selection lands in configuration with the preset label shown.
    expect(screen.getByText('Preset: The Silent Galaxy')).toBeInTheDocument();
    expect(screen.getAllByRole('slider')).toHaveLength(6);
  });
});
