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
import { ContactFlash } from '../components/ContactFlash/ContactFlash';
import { HeroGalaxy } from '../components/HeroGalaxy/HeroGalaxy';
import { usePreferences, useSimulation, useStores } from './providers';
import {
  createScenario,
  resolveEffectiveParameters,
  DEFAULT_CONTROLS,
} from '../simulation/scenario';
import { SIMULATION_MODEL_VERSION } from '../simulation/model_version';
import { decodeScenario, encodeScenario } from '../simulation/serialization';
import type { AdvancedParams, MainControls } from '../simulation/types';
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
const KeyboardHelp = lazy(() =>
  import('../components/KeyboardHelp/KeyboardHelp').then((m) => ({ default: m.KeyboardHelp })),
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
  const [advanced, setAdvanced] = useState<AdvancedParams>(() =>
    startup.scenario ? { ...startup.scenario.advanced } : {},
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
  const [helpOpen, setHelpOpen] = useState(false);
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

  // Start over: return all the way to the opening screen, discarding the run
  // and its configuration (distinct from Reset, which keeps the parameters).
  function startOver() {
    simulation.reset();
    setControls({ ...DEFAULT_CONTROLS });
    setAdvanced({});
    setPresetName(null);
    setPendingSeed(null);
    setReportDismissed(false);
    setLedgerOpen(false);
    setShareOpen(false);
    setScreen('opening');
    announcer.immediate('Started over.');
  }

  // Count of confirmed contacts revealed so far, for the celebration and the
  // live region (BR004). Contact is the rarest, most consequential event.
  const revealedContacts = sim.revealedEvents.reduce(
    (count, event) => (event.type === 'ContactEvent' ? count + 1 : count),
    0,
  );
  const lastAnnouncedContacts = useRef(0);
  useEffect(() => {
    if (revealedContacts > lastAnnouncedContacts.current) {
      lastAnnouncedContacts.current = revealedContacts;
      announcer.immediate('Contact. Two civilizations found each other.');
    }
    if (revealedContacts < lastAnnouncedContacts.current) {
      lastAnnouncedContacts.current = revealedContacts;
    }
  }, [revealedContacts, announcer]);

  function clearLocalData() {
    ui.clearLocalData();
    simulation.reset();
    setControls({ ...DEFAULT_CONTROLS });
    setAdvanced({});
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
    const scenario = createScenario(seedA, seedB, withControls, advanced);
    simulation.start(scenario);
    setScreen('sim');
    setReportDismissed(false);
    announcer.immediate('Run started.');
  }

  function choosePreset(preset: Preset) {
    setControls({ ...preset.controls });
    setAdvanced(preset.advanced ? { ...preset.advanced } : {});
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
      // The keyboard help is reachable from every screen (ACCESSIBILITY 1.1).
      // Accept both the question mark key and Shift plus slash, since some
      // browsers and layouts report the physical key rather than the glyph.
      if (event.key === '?' || (event.key === '/' && event.shiftKey)) {
        setHelpOpen(true);
        return;
      }
      if (screen !== 'sim') {
        if (event.key === 'p' || event.key === 'P') setPresetsOpen(true);
        if (event.key === 'Escape') {
          setPresetsOpen(false);
          setHelpOpen(false);
        }
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

  // Honor the OS reduced motion setting even when the explicit preference is
  // off (ACC003): either source enables reduced motion.
  const osReducedMotion =
    typeof globalThis.matchMedia === 'function' &&
    globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reducedMotion = preferences.reducedMotion || osReducedMotion;

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
        <main id="main" className="opening-hero">
          <HeroGalaxy reducedMotion={reducedMotion} />
          <div className="opening-scrim" aria-hidden="true" />
          <div className="opening-content">
            <p className="opening-eyebrow anim-in" style={{ animationDelay: '0.05s' }}>
              {COPY.eyebrow}
            </p>
            <h1 className="opening-title anim-in" style={{ animationDelay: '0.15s' }}>
              {COPY.title}
            </h1>
            <p className="opening-line anim-in" style={{ animationDelay: '0.3s' }}>
              {COPY.supportingLine}
            </p>
            <p className="opening-explainer anim-in" style={{ animationDelay: '0.45s' }}>
              {COPY.explainer}
            </p>
            <p
              className="opening-explainer opening-explainer-2 anim-in"
              style={{ animationDelay: '0.6s' }}
            >
              {COPY.explainerTwo}
            </p>
            <ol className="opening-steps">
              {COPY.steps.map((step, index) => (
                <li
                  key={step.n}
                  className="opening-step anim-in"
                  style={{ animationDelay: `${0.75 + index * 0.12}s` }}
                >
                  <span className="opening-step-n">{step.n}</span>
                  <span className="opening-step-title">{step.title}</span>
                  <span className="opening-step-body">{step.body}</span>
                </li>
              ))}
            </ol>
            <div
              className="opening-actions anim-in"
              style={{ animationDelay: `${0.75 + COPY.steps.length * 0.12 + 0.1}s` }}
            >
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
            <p
              className="opening-tone anim-in"
              style={{ animationDelay: `${0.75 + COPY.steps.length * 0.12 + 0.25}s` }}
            >
              {COPY.toneLine}
            </p>
          </div>
        </main>
      ) : null}

      {screen === 'config' ? (
        <main id="main" className="config-layout">
          <ControlPanel
            controls={controls}
            advanced={advanced}
            presetName={presetName}
            onChange={(next) => {
              setControls(next);
              setPresetName(null);
            }}
            onAdvancedChange={setAdvanced}
            onStart={() => startRun(controls)}
          />
          <div className="config-canvas" aria-hidden="true">
            <HeroGalaxy reducedMotion={reducedMotion} />
            <p className="config-canvas-hint">Your galaxy, waiting to run.</p>
          </div>
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
            onStartOver={startOver}
          />
          <ContactFlash contactCount={revealedContacts} reducedMotion={reducedMotion} />
          <GalaxyViewport
            feed={{
              systems: sim.systems,
              events: sim.revealedEvents,
              displayYear: sim.displayYear,
              expansionSpeedFractionC: effective?.expansionEffectiveSpeedFractionC ?? 0.03,
            }}
            reducedMotion={reducedMotion}
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
                setAdvanced({});
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
            reducedMotion={preferences.reducedMotion}
            lowPowerMode={preferences.lowPowerMode}
            onToggleReducedMotion={() =>
              ui.setPreference('reducedMotion', !preferences.reducedMotion)
            }
            onToggleLowPower={() => ui.setPreference('lowPowerMode', !preferences.lowPowerMode)}
            onClearData={clearLocalData}
            onClose={() => setAboutOpen(false)}
          />
        ) : null}
        {helpOpen ? <KeyboardHelp onClose={() => setHelpOpen(false)} /> : null}
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
