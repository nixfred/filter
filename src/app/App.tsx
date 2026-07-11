// The application state machine (INTERACTION_SPEC section 1): opening,
// configuration, simulation, outcome. Global keyboard map per
// docs/ACCESSIBILITY.md 1.2 (the canonical source). Live region per its
// section 3, throttled through utils/accessibility.
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { COPY } from '../content/copy';
import { PRESETS, type Preset } from '../content/presets';
import { ControlPanel } from '../components/ControlPanel/ControlPanel';
import { EventLedger } from '../components/EventLedger/EventLedger';
import { GalaxyViewport } from '../components/GalaxyViewport/GalaxyViewport';
import { ScenarioPresets } from '../components/ScenarioPresets/ScenarioPresets';
import { ShareDialog } from '../components/ShareDialog/ShareDialog';
import { SilenceReport } from '../components/SilenceReport/SilenceReport';
import { SimulationControls } from '../components/SimulationControls/SimulationControls';
import { StatusBar } from '../components/StatusBar/StatusBar';
import { usePreferences, useSimulation, useStores } from './providers';
import {
  createScenario,
  resolveEffectiveParameters,
  DEFAULT_CONTROLS,
} from '../simulation/scenario';
import { SIMULATION_MODEL_VERSION } from '../simulation/model_version';
import { decodeScenario, encodeScenario } from '../simulation/serialization';
import type { MainControls } from '../simulation/types';
import { scenarioFromSearch } from '../state/url_state';
import { createAnnouncer } from '../utils/accessibility';
import { formatYears } from '../utils/format';
import type { SpeedStep } from '../state/simulation_store';

// Education and About content lazy load so they never weigh on the initial
// bundle (NFR003).
const EducationDrawer = lazy(() =>
  import('../components/EducationDrawer/EducationDrawer').then((m) => ({
    default: m.EducationDrawer,
  })),
);
const AboutPanel = lazy(() =>
  import('../components/AboutPanel/AboutPanel').then((m) => ({ default: m.AboutPanel })),
);

interface BuildInfo {
  appVersion: string;
  commit: string;
}

type AppScreen = 'opening' | 'config' | 'sim';

const SPEED_ORDER: SpeedStep[] = ['pause', '1x', '10x', '100x', '1000x', 'max'];

function randomSeed(): number {
  // Seed creation is interface scope, outside the deterministic core, so
  // engine randomness is permitted here (the seed itself IS the entropy).
  return Math.floor(Math.random() * 4294967296) >>> 0;
}

export function App() {
  const { simulation, ui } = useStores();
  const sim = useSimulation();
  const preferences = usePreferences();
  // Startup precedence: a shared link opens in a ready configuration state
  // (packet Q70), otherwise the last scenario restores from localStorage
  // (FR014), otherwise defaults.
  const startup = useMemo(() => {
    const shared = scenarioFromSearch(globalThis.location?.search ?? '');
    if (shared) return { scenario: shared, from: 'share' as const };
    const last = ui.loadLastScenario();
    if (last) {
      const decoded = decodeScenario(last.encoded);
      if (decoded) return { scenario: decoded, from: 'storage' as const };
    }
    return { scenario: null, from: 'defaults' as const };
  }, [ui]);
  const [screen, setScreen] = useState<AppScreen>(startup.scenario ? 'config' : 'opening');
  const [controls, setControls] = useState<MainControls>(() =>
    startup.scenario ? { ...startup.scenario.controls } : { ...DEFAULT_CONTROLS },
  );
  // FR008: a shared link reproduces the identical run, so its seed pair is
  // held and used by the next Start rather than drawing a fresh seed. A
  // restored scenario draws a fresh seed (a new visit, not the same run).
  const [pendingSeed, setPendingSeed] = useState<{ a: number; b: number } | null>(
    startup.from === 'share' && startup.scenario
      ? { a: startup.scenario.seedA, b: startup.scenario.seedB }
      : null,
  );
  const [presetName, setPresetName] = useState<string | null>(null);
  const [presetsOpen, setPresetsOpen] = useState(false);
  const [ledgerOpen, setLedgerOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [educationOpen, setEducationOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [reportDismissed, setReportDismissed] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [build, setBuild] = useState<BuildInfo | null>(null);
  const announcer = useMemo(() => createAnnouncer(setAnnouncement), []);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Deployment metadata for the About panel (OPS009). Absent in development.
  useEffect(() => {
    let cancelled = false;
    fetch('/build.json')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && data && typeof data.commit === 'string') {
          setBuild({ appVersion: String(data.appVersion), commit: data.commit });
        }
      })
      .catch(() => {
        // No build metadata in development; the panel shows local markers.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist the last scenario for restoration on the next visit (FR014,
  // DATA002) whenever a run begins or completes.
  useEffect(() => {
    if (sim.scenario && (sim.phase === 'running' || sim.phase === 'complete')) {
      ui.saveLastScenario(encodeScenario(sim.scenario), sim.displayYear);
    }
  }, [sim.scenario, sim.phase, sim.displayYear, ui]);

  function clearLocalData() {
    ui.clearLocalData();
    simulation.reset();
    setControls({ ...DEFAULT_CONTROLS });
    setPresetName(null);
    setPendingSeed(null);
    setAboutOpen(false);
    setScreen('opening');
    announcer.immediate('Local data cleared.');
  }

  // Progress announcements at a fixed real time cadence (ACC002).
  useEffect(() => {
    if (sim.phase === 'running' && progressTimer.current === null) {
      progressTimer.current = setInterval(() => {
        const state = simulation.getState();
        if (state.phase !== 'running') return;
        announcer.progress(
          `${formatYears(state.displayYear)} elapsed. ${state.revealedEvents.length} events so far.`,
        );
      }, 10_000);
    }
    if (sim.phase !== 'running' && progressTimer.current !== null) {
      clearInterval(progressTimer.current);
      progressTimer.current = null;
    }
  }, [sim.phase, announcer, simulation]);

  function startRun(withControls: MainControls) {
    const seedA = pendingSeed ? pendingSeed.a : randomSeed();
    const seedB = pendingSeed ? pendingSeed.b : randomSeed();
    setPendingSeed(null);
    const scenario = createScenario(seedA, seedB, withControls);
    simulation.start(scenario);
    setScreen('sim');
    setReportDismissed(false);
    announcer.immediate('Run started.');
  }

  function choosePreset(preset: Preset) {
    setControls({ ...preset.controls });
    setPresetName(preset.name);
    setPresetsOpen(false);
    setScreen('config');
  }

  function pauseResume() {
    if (sim.phase === 'running') {
      simulation.pause();
      announcer.immediate('Paused.');
    } else if (sim.phase === 'paused') {
      simulation.resume();
      announcer.immediate('Resumed.');
    }
  }

  function setSpeed(step: SpeedStep) {
    simulation.setSpeed(step);
    announcer.immediate(`Speed ${step}.`);
  }

  function stepSpeed(direction: 1 | -1) {
    const index = SPEED_ORDER.indexOf(sim.speed);
    const next = SPEED_ORDER[Math.min(SPEED_ORDER.length - 1, Math.max(0, index + direction))];
    if (next !== sim.speed) setSpeed(next);
  }

  // Global keyboard map (docs/ACCESSIBILITY.md 1.2).
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return;
      }
      if (screen !== 'sim') {
        if (event.key === 'p' || event.key === 'P') setPresetsOpen(true);
        if (event.key === 'Escape') setPresetsOpen(false);
        return;
      }
      switch (event.key) {
        case ' ':
          event.preventDefault();
          pauseResume();
          break;
        case 'r':
          simulation.reset();
          setScreen('config');
          announcer.immediate('Reset.');
          break;
        case 'R':
          simulation.replay();
          announcer.immediate('Replaying the same seed.');
          break;
        case 'n':
        case 'N':
          simulation.randomizeSeed(randomSeed(), randomSeed());
          announcer.immediate('New seed.');
          break;
        case '[':
          stepSpeed(-1);
          break;
        case ']':
          stepSpeed(1);
          break;
        case 'e':
        case 'E':
          setLedgerOpen((open) => !open);
          break;
        case 's':
        case 'S':
          setShareOpen((open) => !open);
          break;
        case 'l':
        case 'L':
          ui.setPreference('labelsVisible', !preferences.labelsVisible);
          announcer.immediate(preferences.labelsVisible ? 'Labels hidden.' : 'Labels shown.');
          break;
        case 'Escape':
          setShareOpen(false);
          setLedgerOpen(false);
          break;
        default:
          break;
      }
    }
    globalThis.addEventListener('keydown', onKey);
    return () => globalThis.removeEventListener('keydown', onKey);
  });

  const effective = sim.scenario ? resolveEffectiveParameters(sim.scenario) : null;
  const shareUrl = sim.scenario
    ? simulation.shareUrl(globalThis.location?.origin ?? 'https://filter.nixfred.com')
    : null;
  const reportVisible = sim.phase === 'complete' && !reportDismissed && sim.metrics;

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to galaxy controls
      </a>
      <div aria-live="polite" role="status" className="visually-hidden" data-testid="live-region">
        {announcement}
      </div>

      {screen === 'opening' ? (
        <main id="main" className="opening">
          <h1 className="opening-title">{COPY.title}</h1>
          <p className="opening-line">{COPY.supportingLine}</p>
          <div className="opening-actions">
            <button
              type="button"
              className="button-primary"
              data-testid="create-galaxy"
              onClick={() => setScreen('config')}
            >
              {COPY.createGalaxy}
            </button>
            <button
              type="button"
              className="button-outline"
              data-testid="run-preset"
              onClick={() => setPresetsOpen(true)}
            >
              {COPY.runPreset}
            </button>
          </div>
          <p className="opening-tone">{COPY.toneLine}</p>
        </main>
      ) : null}

      {screen === 'config' ? (
        <main id="main" className="config-layout">
          <ControlPanel
            controls={controls}
            presetName={presetName}
            onChange={(next) => {
              setControls(next);
              setPresetName(null);
            }}
            onStart={() => startRun(controls)}
          />
          <div className="config-canvas" aria-hidden="true" />
        </main>
      ) : null}

      {screen === 'sim' ? (
        <main id="main" className="sim-layout">
          <StatusBar
            displayYear={sim.displayYear}
            civilizationCount={sim.civilizationCount}
            labelsVisible={preferences.labelsVisible}
            reportAvailable={sim.phase === 'complete'}
            onToggleLedger={() => setLedgerOpen(!ledgerOpen)}
            onToggleLabels={() => ui.setPreference('labelsVisible', !preferences.labelsVisible)}
            onShare={() => setShareOpen(true)}
            onViewReport={() => setReportDismissed(false)}
          />
          <GalaxyViewport
            feed={{
              systems: sim.systems,
              events: sim.revealedEvents,
              displayYear: sim.displayYear,
              expansionSpeedFractionC: effective?.expansionEffectiveSpeedFractionC ?? 0.03,
            }}
            reducedMotion={preferences.reducedMotion}
            lowPowerMode={preferences.lowPowerMode}
          />
          <SimulationControls
            phase={
              sim.phase === 'paused' ? 'paused' : sim.phase === 'complete' ? 'complete' : 'running'
            }
            speed={sim.speed}
            onPauseResume={pauseResume}
            onSpeed={setSpeed}
            onReset={() => {
              simulation.reset();
              setScreen('config');
            }}
            onReplay={() => {
              setReportDismissed(false);
              simulation.replay();
            }}
            onRandomize={() => {
              setReportDismissed(false);
              simulation.randomizeSeed(randomSeed(), randomSeed());
            }}
          />
          {ledgerOpen ? (
            <EventLedger events={sim.revealedEvents} onClose={() => setLedgerOpen(false)} />
          ) : null}
          {reportVisible && sim.metrics ? (
            <SilenceReport
              metrics={sim.metrics}
              headline={sim.headline ?? ''}
              onReplay={() => {
                setReportDismissed(true);
                simulation.replay();
              }}
              onNewGalaxy={() => {
                simulation.reset();
                setControls({ ...DEFAULT_CONTROLS });
                setPresetName(null);
                setScreen('config');
              }}
              onShare={() => setShareOpen(true)}
              onClose={() => setReportDismissed(true)}
            />
          ) : null}
        </main>
      ) : null}

      {presetsOpen ? (
        <ScenarioPresets onSelect={choosePreset} onClose={() => setPresetsOpen(false)} />
      ) : null}
      {shareOpen && shareUrl ? (
        <ShareDialog
          url={shareUrl}
          onClose={() => setShareOpen(false)}
          onCopied={() => announcer.immediate('Scenario link copied.')}
        />
      ) : null}
      <Suspense fallback={null}>
        {educationOpen ? <EducationDrawer onClose={() => setEducationOpen(false)} /> : null}
        {aboutOpen ? (
          <AboutPanel
            build={build}
            onClearData={clearLocalData}
            onClose={() => setAboutOpen(false)}
          />
        ) : null}
      </Suspense>

      <footer className="app-footer">
        <span>{COPY.footer.credit}</span>
        <a href="https://nixfred.com">{COPY.footer.site}</a>
        <a href="https://github.com/nixfred/filter">{COPY.footer.repo}</a>
        <button
          type="button"
          className="footer-link"
          data-testid="open-education"
          onClick={() => setEducationOpen(true)}
        >
          Field guide
        </button>
        <button
          type="button"
          className="footer-link"
          data-testid="open-about"
          onClick={() => setAboutOpen(true)}
        >
          About
        </button>
        <span data-testid="model-version">model v{SIMULATION_MODEL_VERSION}</span>
      </footer>
    </div>
  );
}

export { PRESETS };
