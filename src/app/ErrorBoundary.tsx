// Top level error boundary (FR030, docs/ARCHITECTURE.md section 7): the
// error state is designed, never a blank page, and the scenario survives.
import { Component, type ReactNode } from 'react';
import { COPY } from '../content/copy';

interface Props {
  children: ReactNode;
}

interface State {
  failed: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  override render() {
    if (this.state.failed) {
      return (
        <main className="opening" role="alert">
          <h1 className="opening-title">THE GREAT FILTER</h1>
          <p className="opening-line">{COPY.degraded.error}</p>
          <button
            type="button"
            className="button-primary"
            onClick={() => globalThis.location.reload()}
          >
            Reload
          </button>
        </main>
      );
    }
    return this.props.children;
  }
}
