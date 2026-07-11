import { SIMULATION_MODEL_VERSION } from '../simulation/model_version';

// Opening state shell (UX004). The galaxy canvas, controls, and run flow land at G3
// per docs/EXECUTION_PLAN.md. This shell establishes the layout root, the title
// treatment, and the version surface consumed by tests and the About panel (OPS009).
export function App() {
  return (
    <main className="opening">
      <h1 className="opening-title">THE GREAT FILTER</h1>
      <p className="opening-line">
        Build a galaxy. Seed the stars. See who survives long enough to be heard.
      </p>
      <p className="opening-tone">
        Most civilizations miss each other by a few million years. Cosmically speaking, terrible
        calendar management.
      </p>
      <footer className="opening-footer">
        <span data-testid="model-version">model v{SIMULATION_MODEL_VERSION}</span>
      </footer>
    </main>
  );
}
