import { describe, expect, it } from 'vitest';
import {
  createUiStore,
  LAST_SCENARIO_KEY,
  PREFERENCES_KEY,
  type StorageLike,
} from '../../../src/state/ui_store';

// Preference persistence and the clear control (DATA002, FR013, FR014).
function fakeStorage(seed: Record<string, string> = {}): StorageLike & {
  dump(): Record<string, string>;
} {
  const map = new Map(Object.entries(seed));
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
    dump: () => Object.fromEntries(map),
  };
}

describe('ui store', () => {
  it('starts with documented defaults', () => {
    const store = createUiStore(fakeStorage());
    expect(store.getPreferences()).toEqual({
      reducedMotion: false,
      lowPowerMode: false,
      labelsVisible: true,
      lastAdvancedPanelOpen: false,
    });
  });

  it('persists preference changes under the versioned key', () => {
    const storage = fakeStorage();
    const store = createUiStore(storage);
    store.setPreference('reducedMotion', true);
    expect(JSON.parse(storage.dump()[PREFERENCES_KEY]).reducedMotion).toBe(true);
  });

  it('survives corrupted stored preferences by falling back to defaults', () => {
    const store = createUiStore(fakeStorage({ [PREFERENCES_KEY]: '{not json' }));
    expect(store.getPreferences().labelsVisible).toBe(true);
  });

  it('round trips the last scenario and rejects malformed records', () => {
    const storage = fakeStorage();
    const store = createUiStore(storage);
    store.saveLastScenario('AQIDBA', 12345);
    expect(store.loadLastScenario()).toEqual({ encoded: 'AQIDBA', atYear: 12345 });
    storage.setItem(LAST_SCENARIO_KEY, JSON.stringify({ encoded: 7 }));
    expect(store.loadLastScenario()).toBeNull();
  });

  it('clear local data removes both keys in one action (FR013)', () => {
    const storage = fakeStorage();
    const store = createUiStore(storage);
    store.setPreference('lowPowerMode', true);
    store.saveLastScenario('AQIDBA', 1);
    store.clearLocalData();
    expect(storage.dump()).toEqual({});
    expect(store.getPreferences().lowPowerMode).toBe(false);
  });
});
