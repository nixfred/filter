// Store wiring into React context (docs/ARCHITECTURE.md 2.1). Components
// consume stores through these hooks and never import simulation or renderer
// modules directly.
import { createContext, useContext, useSyncExternalStore, type ReactNode } from 'react';
import {
  createSimulationStore,
  type SimulationStore,
  type SimulationStoreState,
} from '../state/simulation_store';
import { createUiStore, type Preferences, type UiStore } from '../state/ui_store';

interface Stores {
  simulation: SimulationStore;
  ui: UiStore;
}

const StoresContext = createContext<Stores | null>(null);

function createRealWorker() {
  return new Worker(new URL('../simulation/simulation.worker.ts', import.meta.url), {
    type: 'module',
  });
}

const memoryStorage = () => {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
  };
};

export function createDefaultStores(): Stores {
  let storage;
  try {
    storage = globalThis.localStorage ?? memoryStorage();
  } catch {
    // Storage access can throw under strict privacy modes: run session local.
    storage = memoryStorage();
  }
  return {
    simulation: createSimulationStore(createRealWorker),
    ui: createUiStore(storage),
  };
}

export function StoresProvider({ stores, children }: { stores: Stores; children: ReactNode }) {
  return <StoresContext.Provider value={stores}>{children}</StoresContext.Provider>;
}

export function useStores(): Stores {
  const stores = useContext(StoresContext);
  if (!stores) throw new Error('StoresProvider missing');
  return stores;
}

export function useSimulation(): SimulationStoreState {
  const { simulation } = useStores();
  return useSyncExternalStore(simulation.subscribe, simulation.getState, simulation.getState);
}

export function usePreferences(): Preferences {
  const { ui } = useStores();
  return useSyncExternalStore(ui.subscribe, ui.getPreferences, ui.getPreferences);
}
