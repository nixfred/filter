// The event driven simulation engine (docs/simulation_model.md sections 2
// through 8, FR016 through FR027). One deterministic queue, RNG draws in
// strict queue order, no wall clock, no engine transcendentals.
import { DeterministicQueue } from './events';
import { generateGalaxy } from './galaxy';
import { evaluatePairing, isSelfSignal } from './contact';
import { createRng, type Rng } from './rng';
import { stateEntryYear } from './civilization';
import { drawExtinctionCause, TRANSFORMED_AFTER_YEARS } from './hazards';
import {
  detectableWindowMeanYears,
  HAZARD_STATE_MULTIPLIER,
  meanSurvivalYears,
  progressionParams,
} from './probability';
import { resolveEffectiveParameters } from './scenario';
import {
  HAZARD_STATES,
  RECOGNITION_CAPABLE,
  TERMINAL_STATES,
  TRANSITION_FROM,
  TRANSITION_INDEX,
  TRANSITION_ORDER,
  TRANSITION_TO,
} from './transitions';
import type {
  Civilization,
  CivState,
  EffectiveParameters,
  ExpansionFrontier,
  ExtinctionCause,
  Scenario,
  Signal,
  SimulationEvent,
  StarSystem,
  TransitionId,
} from './types';
import { exponentialYears } from '../utils/math';
import { systemDistanceLy } from './light_cone';

/** Omit distributed over the event union, so each variant keeps its payload. */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
type EventBody = DistributiveOmit<SimulationEvent, 'id' | 'atYear' | 'causeEventId'>;

type Pending =
  | { kind: 'transition'; systemId: number; transition: TransitionId }
  | { kind: 'hazard'; civId: number; gen: number; state: CivState }
  | { kind: 'quiet'; civId: number; gen: number }
  | { kind: 'transformed'; civId: number; gen: number }
  | { kind: 'emission_end'; signalId: number }
  | { kind: 'detection'; signalId: number; civId: number; contactEligible: boolean }
  | { kind: 'launch'; frontierId: number }
  | { kind: 'reach'; frontierId: number; systemId: number }
  | { kind: 'settle_done'; frontierId: number; systemId: number };

const KIND_INDEX: Record<Pending['kind'], number> = {
  transition: 0,
  hazard: 1,
  quiet: 2,
  transformed: 3,
  emission_end: 4,
  detection: 5,
  launch: 6,
  reach: 7,
  settle_done: 8,
};

export interface EngineRunState {
  scenario: Scenario;
  effective: EffectiveParameters;
  systems: StarSystem[];
  civilizations: Civilization[];
  signals: Signal[];
  frontiers: ExpansionFrontier[];
  events: SimulationEvent[];
  signalOverlapCount: number;
}

export class Engine {
  readonly state: EngineRunState;
  private readonly rng: Rng;
  private readonly queue = new DeterministicQueue<Pending>();
  private eventIdCounter = 0;
  private currentYear = 0;
  private readonly civBySystem = new Map<number, number>();
  /** Hazard and soft terminal generation guard per civilization. */
  private readonly civGen: number[] = [];
  private readonly pairSeen = new Set<string>();
  private complete = false;

  constructor(scenario: Scenario) {
    const effective = resolveEffectiveParameters(scenario);
    this.rng = createRng(scenario.seedA, scenario.seedB);
    const systems = generateGalaxy(this.rng, effective.representativePopulationSize);
    this.state = {
      scenario,
      effective,
      systems,
      civilizations: [],
      signals: [],
      frontiers: [],
      events: [],
      signalOverlapCount: 0,
    };
    this.log({ type: 'RunMilestone', label: 'run_start' }, 0, null);
    // Seed the queue in system id order (docs/simulation_model.md section 4).
    for (const system of systems) {
      this.scheduleProgression(system.id, 'candidate_to_habitable', 0);
    }
  }

  get year(): number {
    return this.currentYear;
  }

  get isComplete(): boolean {
    return this.complete;
  }

  /**
   * Process events until the horizon or the queue empties. maxEvents lets the
   * worker process in slices for batching; Infinity runs to completion.
   */
  run(maxEvents: number = Infinity): SimulationEvent[] {
    const startIndex = this.state.events.length;
    let processed = 0;
    while (processed < maxEvents) {
      const item = this.queue.pop();
      if (!item) {
        this.finish(this.currentYear);
        break;
      }
      if (item.atYear > this.state.effective.runHorizonYears) {
        this.finish(this.state.effective.runHorizonYears);
        break;
      }
      this.currentYear = item.atYear;
      this.apply(item.payload, item.atYear);
      processed++;
    }
    return this.state.events.slice(startIndex);
  }

  private finish(atYear: number): void {
    if (!this.complete) {
      this.complete = true;
      this.currentYear = atYear;
      this.log({ type: 'RunMilestone', label: 'run_end' }, atYear, 0);
    }
  }

  private log(event: EventBody, atYear: number, causeEventId: number | null): number {
    const id = this.eventIdCounter++;
    this.state.events.push({ ...event, id, atYear, causeEventId } as SimulationEvent);
    return id;
  }

  private schedule(atYear: number, tieA: number, payload: Pending): void {
    const tieB =
      KIND_INDEX[payload.kind] * 16 +
      (payload.kind === 'transition' ? TRANSITION_INDEX[payload.transition] : 0);
    this.queue.push(atYear, tieA, tieB, payload);
  }

  /** Eligibility and waiting time scheduling (docs/simulation_model.md 3.1). */
  private scheduleProgression(systemId: number, transition: TransitionId, fromYear: number): void {
    const system = this.state.systems[systemId];
    const params = progressionParams(
      transition,
      this.state.scenario.controls,
      system.habitabilityWeight,
    );
    const eligible = this.rng.nextUnit() < params.eligibility;
    if (!eligible) return;
    const wait = exponentialYears(this.rng.nextUnit(), params.meanWaitYears);
    this.schedule(fromYear + wait, systemId, { kind: 'transition', systemId, transition });
  }

  /** Continuous hazard scheduling (docs/simulation_model.md 3.2). */
  private scheduleHazard(civ: Civilization, state: CivState, fromYear: number): void {
    if (!HAZARD_STATES.has(state)) return;
    const mult = HAZARD_STATE_MULTIPLIER[state as 'technology' | 'detectable' | 'interstellar'];
    const mean = Math.round(meanSurvivalYears(this.state.scenario.controls) / mult);
    const wait = exponentialYears(this.rng.nextUnit(), mean);
    this.schedule(fromYear + wait, this.state.systems[civ.hostSystemId].id, {
      kind: 'hazard',
      civId: civ.id,
      gen: this.civGen[civ.id],
      state,
    });
  }

  private apply(p: Pending, atYear: number): void {
    switch (p.kind) {
      case 'transition':
        this.applyTransition(p.systemId, p.transition, atYear);
        break;
      case 'hazard':
        this.applyHazard(p.civId, p.gen, atYear);
        break;
      case 'quiet':
        this.applySoftTerminal(p.civId, p.gen, 'quiet', atYear);
        break;
      case 'transformed':
        this.applySoftTerminal(p.civId, p.gen, 'transformed', atYear);
        break;
      case 'emission_end': {
        // Skip when extinction already truncated and logged the end.
        if (this.state.signals[p.signalId].emissionEndYear >= atYear) {
          this.log({ type: 'SignalEmissionEnd', signalId: p.signalId }, atYear, null);
        }
        break;
      }
      case 'detection':
        this.applyDetection(p.signalId, p.civId, p.contactEligible, atYear);
        break;
      case 'launch':
        this.applyLaunch(p.frontierId, atYear);
        break;
      case 'reach':
        this.applyReach(p.frontierId, p.systemId, atYear);
        break;
      case 'settle_done':
        this.applySettlementDone(p.frontierId, p.systemId, atYear);
        break;
    }
  }

  private applyTransition(systemId: number, transition: TransitionId, atYear: number): void {
    const fromState = TRANSITION_FROM[transition];
    const toState = TRANSITION_TO[transition];
    let civ: Civilization | undefined;

    if (transition === 'candidate_to_habitable') {
      // Civilization record exists once a system becomes habitable
      // (docs/simulation_model.md section 2).
      civ = {
        id: this.state.civilizations.length,
        hostSystemId: systemId,
        currentState: 'habitable_world',
        stateHistory: [{ state: 'habitable_world', atYear }],
        detectableWindow: null,
        frontierId: null,
        extinctionCause: null,
      };
      this.state.civilizations.push(civ);
      this.civBySystem.set(systemId, civ.id);
      this.civGen[civ.id] = 0;
    } else {
      const civId = this.civBySystem.get(systemId);
      if (civId === undefined) return;
      civ = this.state.civilizations[civId];
      // A stale progression event for a civilization that already left the
      // origin state (extinct, quiet, transformed) is dropped.
      if (civ.currentState !== fromState) return;
      civ.currentState = toState;
      civ.stateHistory.push({ state: toState, atYear });
      this.civGen[civ.id]++;
    }

    const eventId = this.log(
      {
        type: 'StateTransition',
        civilizationId: civ.id,
        fromState,
        toState,
        hostSystemId: systemId,
      },
      atYear,
      null,
    );

    // Schedule the next progression step in the chain.
    const nextIndex = TRANSITION_ORDER.indexOf(transition) + 1;
    if (nextIndex < TRANSITION_ORDER.length) {
      this.scheduleProgression(systemId, TRANSITION_ORDER[nextIndex], atYear);
    }

    // State entry effects.
    if (toState === 'technology') {
      this.scheduleHazard(civ, 'technology', atYear);
      this.pairNewReceiver(civ, atYear);
      void eventId;
    } else if (toState === 'detectable') {
      this.scheduleHazard(civ, 'detectable', atYear);
      this.openDetectableWindow(civ, atYear, eventId);
    } else if (toState === 'interstellar') {
      this.scheduleHazard(civ, 'interstellar', atYear);
      this.createFrontier(civ, atYear, eventId);
      this.schedule(atYear + TRANSFORMED_AFTER_YEARS, systemId, {
        kind: 'transformed',
        civId: civ.id,
        gen: this.civGen[civ.id],
      });
    }
  }

  private openDetectableWindow(civ: Civilization, atYear: number, causeEventId: number): void {
    const durationMean = detectableWindowMeanYears(this.state.scenario.controls);
    const duration = exponentialYears(this.rng.nextUnit(), durationMean);
    const strength = 0.3 + 0.7 * this.rng.nextUnit();
    const signal: Signal = {
      id: this.state.signals.length,
      sourceCivilizationId: civ.id,
      originPosition: this.state.systems[civ.hostSystemId].position,
      emissionStartYear: atYear,
      emissionEndYear: atYear + duration,
      strength,
    };
    this.state.signals.push(signal);
    civ.detectableWindow = { startYear: atYear, endYear: signal.emissionEndYear };
    this.log(
      {
        type: 'SignalEmissionStart',
        signalId: signal.id,
        systemId: civ.hostSystemId,
        emissionEndYear: signal.emissionEndYear,
        strength: signal.strength,
      },
      atYear,
      causeEventId,
    );
    this.schedule(signal.emissionEndYear, civ.hostSystemId, {
      kind: 'emission_end',
      signalId: signal.id,
    });
    // Window close without interstellar or extinction: quiet
    // (docs/simulation_model.md 2.2 derived transitions).
    this.schedule(signal.emissionEndYear, civ.hostSystemId, {
      kind: 'quiet',
      civId: civ.id,
      gen: this.civGen[civ.id],
    });
    // Pair this new signal against every recognition capable receiver, in
    // civilization id order (docs/simulation_model.md section 4 determinism).
    for (const receiver of this.state.civilizations) {
      if (isSelfSignal(signal, receiver)) continue;
      if (!RECOGNITION_CAPABLE.has(receiver.currentState)) continue;
      const capableFrom = stateEntryYear(receiver, 'technology');
      if (capableFrom === null) continue;
      this.schedulePairing(signal, receiver, capableFrom);
    }
  }

  /** A civilization just became recognition capable: pair existing signals. */
  private pairNewReceiver(civ: Civilization, atYear: number): void {
    for (const signal of this.state.signals) {
      if (isSelfSignal(signal, civ)) continue;
      this.schedulePairing(signal, civ, atYear);
    }
  }

  private schedulePairing(signal: Signal, receiver: Civilization, capableFromYear: number): void {
    const key = signal.id + ':' + receiver.id;
    if (this.pairSeen.has(key)) return;
    const receiverPos = this.state.systems[receiver.hostSystemId].position;
    const pairing = evaluatePairing(
      signal,
      receiverPos,
      capableFromYear,
      this.state.effective.detectionRecognitionThreshold,
    );
    if (!pairing.overlaps) return;
    this.pairSeen.add(key);
    this.schedule(pairing.detectionYear, receiver.hostSystemId, {
      kind: 'detection',
      signalId: signal.id,
      civId: receiver.id,
      contactEligible: pairing.contactEligible,
    });
  }

  private applyDetection(
    signalId: number,
    civId: number,
    contactEligible: boolean,
    atYear: number,
  ): void {
    const receiver = this.state.civilizations[civId];
    // Recognition requires a capable, living receiver at arrival
    // (docs/simulation_model.md section 5 requirement 1).
    if (!RECOGNITION_CAPABLE.has(receiver.currentState)) return;
    // Extinction may have truncated the emission after this detection was
    // scheduled: revalidate the arrival against the current window.
    const signalRecord = this.state.signals[signalId];
    const receiverPos = this.state.systems[receiver.hostSystemId].position;
    const travel = Math.round(systemDistanceLy(signalRecord.originPosition, receiverPos));
    if (atYear > signalRecord.emissionEndYear + travel) return;
    this.state.signalOverlapCount++;
    const detectionId = this.log(
      { type: 'DetectionEvent', signalId, receivingCivilizationId: civId },
      atYear,
      null,
    );
    if (contactEligible) {
      const signal = this.state.signals[signalId];
      this.log(
        {
          type: 'ContactEvent',
          signalId,
          sourceCivilizationId: signal.sourceCivilizationId,
          receivingCivilizationId: civId,
        },
        atYear,
        detectionId,
      );
    }
  }

  private applyHazard(civId: number, gen: number, atYear: number): void {
    const civ = this.state.civilizations[civId];
    // A hazard drawn for an earlier state is cancelled by the generation guard
    // (docs/simulation_model.md 3.2 rescheduling rule).
    if (this.civGen[civId] !== gen) return;
    if (TERMINAL_STATES.has(civ.currentState)) return;
    const cause: ExtinctionCause = drawExtinctionCause(this.rng.nextUnit());
    civ.currentState = 'extinct';
    civ.stateHistory.push({ state: 'extinct', atYear });
    civ.extinctionCause = cause;
    this.civGen[civId]++;
    this.truncateActiveEmission(civ, atYear);
    this.log({ type: 'ExtinctionEvent', civilizationId: civId, cause }, atYear, null);
    this.log(
      {
        type: 'StateTransition',
        civilizationId: civId,
        fromState: civ.stateHistory[civ.stateHistory.length - 2].state,
        toState: 'extinct',
        hostSystemId: civ.hostSystemId,
      },
      atYear,
      null,
    );
  }

  /**
   * Extinction ends an active emission at the extinction year: an extinct
   * civilization never emits, though signals already in transit persist
   * (FR020, docs/simulation_model.md section 5 posthumous persistence).
   */
  private truncateActiveEmission(civ: Civilization, atYear: number): void {
    for (const signal of this.state.signals) {
      if (signal.sourceCivilizationId !== civ.id) continue;
      if (signal.emissionEndYear > atYear && signal.emissionStartYear <= atYear) {
        signal.emissionEndYear = atYear;
        if (civ.detectableWindow && civ.detectableWindow.endYear > atYear) {
          civ.detectableWindow = { ...civ.detectableWindow, endYear: atYear };
        }
        this.log({ type: 'SignalEmissionEnd', signalId: signal.id }, atYear, null);
      }
    }
  }

  private applySoftTerminal(
    civId: number,
    gen: number,
    to: 'quiet' | 'transformed',
    atYear: number,
  ): void {
    const civ = this.state.civilizations[civId];
    if (this.civGen[civId] !== gen) return;
    if (TERMINAL_STATES.has(civ.currentState)) return;
    // quiet only applies from technology or detectable; a civilization that
    // reached interstellar before its window closed keeps transmitting scale.
    if (to === 'quiet' && civ.currentState !== 'technology' && civ.currentState !== 'detectable') {
      return;
    }
    if (to === 'transformed' && civ.currentState !== 'interstellar') return;
    const fromState = civ.currentState;
    civ.currentState = to;
    civ.stateHistory.push({ state: to, atYear });
    this.civGen[civId]++;
    this.log(
      {
        type: 'StateTransition',
        civilizationId: civId,
        fromState,
        toState: to,
        hostSystemId: civ.hostSystemId,
      },
      atYear,
      null,
    );
  }

  private createFrontier(civ: Civilization, atYear: number, causeEventId: number): void {
    const e = this.state.effective;
    const frontier: ExpansionFrontier = {
      id: this.state.frontiers.length,
      sourceCivilizationId: civ.id,
      originYear: atYear,
      effectiveSpeedFractionC: e.expansionEffectiveSpeedFractionC,
      launchDelayYears: e.expansionLaunchDelayYears,
      settlementDelayYears: e.expansionSettlementDelayYears,
      settledSystemIds: [],
    };
    this.state.frontiers.push(frontier);
    civ.frontierId = frontier.id;
    this.schedule(atYear + frontier.launchDelayYears, civ.hostSystemId, {
      kind: 'launch',
      frontierId: frontier.id,
    });
    void causeEventId;
  }

  private applyLaunch(frontierId: number, atYear: number): void {
    const frontier = this.state.frontiers[frontierId];
    const source = this.state.civilizations[frontier.sourceCivilizationId];
    // Extinction before launch cancels the frontier: a documented
    // deterministic choice recorded alongside R009 in the model doc.
    if (source.currentState === 'extinct') return;
    const home = this.state.systems[source.hostSystemId];
    this.log({ type: 'ExpansionLaunch', frontierId, systemId: home.id }, atYear, null);
    // Schedule reach for every other system whose reach year fits the horizon,
    // in system id order for determinism.
    for (const system of this.state.systems) {
      if (system.id === home.id) continue;
      const d = systemDistanceLy(home.position, system.position);
      const reachYear = atYear + Math.round(d / frontier.effectiveSpeedFractionC);
      if (reachYear > this.state.effective.runHorizonYears) continue;
      this.schedule(reachYear, system.id, {
        kind: 'reach',
        frontierId,
        systemId: system.id,
      });
    }
  }

  /** The frontier reaches a system (docs/simulation_model.md section 6). */
  private applyReach(frontierId: number, systemId: number, atYear: number): void {
    const frontier = this.state.frontiers[frontierId];
    const source = this.state.civilizations[frontier.sourceCivilizationId];
    // The frontier freezes at its source's extinction year: reaches after
    // extinction are skipped (documented deterministic choice beside R009).
    if (source.currentState === 'extinct') {
      const extinctAt = stateEntryYear(source, 'extinct');
      if (extinctAt !== null && atYear > extinctAt) return;
    }
    const overlappedCivId = this.civBySystem.get(systemId);
    if (overlappedCivId !== undefined && overlappedCivId !== source.id) {
      // Overlap against a system hosting an independent civilization record;
      // no state of the overlapped civilization changes (R009, R019).
      this.log(
        {
          type: 'TravelOverlapEvent',
          frontierId,
          sourceCivilizationId: source.id,
          overlappedCivilizationId: overlappedCivId,
        },
        atYear,
        null,
      );
    }
    this.schedule(atYear + frontier.settlementDelayYears, systemId, {
      kind: 'settle_done',
      frontierId,
      systemId,
    });
  }

  /** Settlement completes settlementDelayYears after reach. */
  private applySettlementDone(frontierId: number, systemId: number, atYear: number): void {
    const frontier = this.state.frontiers[frontierId];
    frontier.settledSystemIds.push(systemId);
    this.log({ type: 'ExpansionSettlement', frontierId, systemId }, atYear, null);
  }
}
