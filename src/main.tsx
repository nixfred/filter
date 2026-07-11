import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { ErrorBoundary } from './app/ErrorBoundary';
import { createDefaultStores, StoresProvider } from './app/providers';
import { Engine } from './simulation/engine';
import { computeMetrics } from './simulation/metrics';
import { computeDigest } from './simulation/serialization';
import { validateScenario } from './simulation/schema';
import './styles/fonts.css';
import './styles/reset.css';
import './styles/tokens.css';
import './styles/global.css';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element missing');
}

const stores = createDefaultStores();

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>
      <StoresProvider stores={stores}>
        <App />
      </StoresProvider>
    </ErrorBoundary>
  </StrictMode>,
);

// Cross engine determinism harness (FR017, docs/TEST_PLAN.md 3.6): the
// browser_smoke Playwright spec feeds committed fixture scenarios through
// this hook in Chromium, Firefox, and WebKit and compares digests against
// tests/fixtures/simulation_digests/. Runs the real engine in page.
declare global {
  interface Window {
    __runFixtureDigest: (rawScenario: unknown) => string;
  }
}

window.__runFixtureDigest = (rawScenario: unknown): string => {
  const result = validateScenario(rawScenario);
  if (!result.ok) throw new Error('fixture invalid: ' + result.reason);
  const engine = new Engine(result.scenario);
  engine.run();
  return computeDigest(engine.state, computeMetrics(engine.state));
};
