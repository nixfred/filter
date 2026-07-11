// Shared drawable state model consumed by both adapter implementations
// (docs/ARCHITECTURE.md 2.5: the renderer receives snapshots and typed event
// batches, never simulation internals). Pure logic, unit testable.
import type { CivState, SimulationEvent } from '../simulation/types';

export interface RenderSystem {
  id: number;
  xLy: number;
  yLy: number;
}

export interface RenderCivilization {
  id: number;
  systemId: number;
  state: CivState;
}

export interface RenderSignal {
  id: number;
  systemId: number;
  startYear: number;
  endYear: number;
  strength: number;
}

export interface RenderFrontier {
  id: number;
  systemId: number;
  launchYear: number;
}

export class RenderModel {
  readonly systems = new Map<number, RenderSystem>();
  readonly civilizations = new Map<number, RenderCivilization>();
  readonly signals = new Map<number, RenderSignal>();
  readonly frontiers = new Map<number, RenderFrontier>();
  /** Effective sub light expansion speed, from the scenario (FR021). */
  expansionSpeedFractionC = 0.03;

  loadSystems(systems: RenderSystem[]): void {
    this.systems.clear();
    this.civilizations.clear();
    this.signals.clear();
    this.frontiers.clear();
    for (const s of systems) this.systems.set(s.id, s);
  }

  applyEvent(event: SimulationEvent): void {
    switch (event.type) {
      case 'StateTransition':
        this.civilizations.set(event.civilizationId, {
          id: event.civilizationId,
          systemId: event.hostSystemId,
          state: event.toState,
        });
        break;
      case 'SignalEmissionStart':
        this.signals.set(event.signalId, {
          id: event.signalId,
          systemId: event.systemId,
          startYear: event.atYear,
          endYear: event.emissionEndYear,
          strength: event.strength,
        });
        break;
      case 'SignalEmissionEnd': {
        const signal = this.signals.get(event.signalId);
        // Truncation (extinction) shortens the shell's emitting era.
        if (signal && event.atYear < signal.endYear) {
          this.signals.set(event.signalId, { ...signal, endYear: event.atYear });
        }
        break;
      }
      case 'ExpansionLaunch':
        this.frontiers.set(event.frontierId, {
          id: event.frontierId,
          systemId: event.systemId,
          launchYear: event.atYear,
        });
        break;
      default:
        break;
    }
  }

  /**
   * A signal shell at nowYear: inner and outer radii in light years, or null
   * once the trailing edge has left the map's practical extent.
   */
  signalShellAt(signal: RenderSignal, nowYear: number): { inner: number; outer: number } | null {
    if (nowYear < signal.startYear) return null;
    const outer = nowYear - signal.startYear;
    const inner = Math.max(0, nowYear - signal.endYear);
    if (inner > 200_000) return null;
    return { inner, outer };
  }

  frontierRadiusAt(frontier: RenderFrontier, nowYear: number): number {
    if (nowYear < frontier.launchYear) return 0;
    return (nowYear - frontier.launchYear) * this.expansionSpeedFractionC;
  }
}
