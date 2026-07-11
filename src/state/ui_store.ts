// Interface preferences with localStorage persistence (DATA002, FR013,
// FR014, docs/DATA_MODEL.md section 5). No cookies, ever (F004).
export const PREFERENCES_KEY = 'filter.preferences.v1';
export const LAST_SCENARIO_KEY = 'filter.lastScenario.v1';

export interface Preferences {
  reducedMotion: boolean;
  lowPowerMode: boolean;
  labelsVisible: boolean;
  lastAdvancedPanelOpen: boolean;
}

const DEFAULT_PREFERENCES: Preferences = {
  reducedMotion: false,
  lowPowerMode: false,
  labelsVisible: true,
  lastAdvancedPanelOpen: false,
};

type Listener = () => void;

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function createUiStore(storage: StorageLike) {
  let preferences = loadPreferences(storage);
  const listeners = new Set<Listener>();

  function emit() {
    for (const listener of listeners) listener();
  }

  return {
    subscribe(listener: Listener): () => void {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getPreferences(): Preferences {
      return preferences;
    },
    setPreference<K extends keyof Preferences>(key: K, value: Preferences[K]) {
      preferences = { ...preferences, [key]: value };
      try {
        storage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
      } catch {
        // Storage full or blocked: preferences stay session local (DATA002
        // permits this, the visible control still works for the session).
      }
      emit();
    },
    saveLastScenario(encoded: string, atYear: number) {
      try {
        storage.setItem(LAST_SCENARIO_KEY, JSON.stringify({ encoded, atYear }));
      } catch {
        // Same policy as above.
      }
    },
    loadLastScenario(): { encoded: string; atYear: number } | null {
      try {
        const raw = storage.getItem(LAST_SCENARIO_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as { encoded?: unknown; atYear?: unknown };
        if (typeof parsed.encoded !== 'string' || typeof parsed.atYear !== 'number') return null;
        return { encoded: parsed.encoded, atYear: parsed.atYear };
      } catch {
        return null;
      }
    },
    /** The visible clear local data control (FR013): both keys, one action. */
    clearLocalData() {
      try {
        storage.removeItem(PREFERENCES_KEY);
        storage.removeItem(LAST_SCENARIO_KEY);
      } catch {
        // Nothing further to do; the in memory reset below still applies.
      }
      preferences = { ...DEFAULT_PREFERENCES };
      emit();
    },
  };
}

function loadPreferences(storage: StorageLike): Preferences {
  try {
    const raw = storage.getItem(PREFERENCES_KEY);
    if (!raw) return { ...DEFAULT_PREFERENCES };
    const parsed = JSON.parse(raw) as Partial<Preferences>;
    return {
      reducedMotion: parsed.reducedMotion === true,
      lowPowerMode: parsed.lowPowerMode === true,
      labelsVisible: parsed.labelsVisible !== false,
      lastAdvancedPanelOpen: parsed.lastAdvancedPanelOpen === true,
    };
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

export type UiStore = ReturnType<typeof createUiStore>;
