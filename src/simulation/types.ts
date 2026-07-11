// Domain types for the simulation core (docs/DATA_MODEL.md sections 1 and 2).
// Pure types only: excluded from coverage per docs/TEST_PLAN.md section 4.

export type CivState =
  | 'candidate_system'
  | 'habitable_world'
  | 'life'
  | 'complex_life'
  | 'intelligence'
  | 'technology'
  | 'detectable'
  | 'interstellar'
  | 'quiet'
  | 'transformed'
  | 'extinct';

export type TransitionId =
  | 'candidate_to_habitable'
  | 'habitable_to_life'
  | 'life_to_complex'
  | 'complex_to_intelligence'
  | 'intelligence_to_technology'
  | 'technology_to_detectable'
  | 'detectable_to_interstellar';

export type ExtinctionCause = 'selfDestruction' | 'externalHazard' | 'none';

/** The six main controls, floats 0..1 (docs/DATA_MODEL.md 1.1, ruling R008). */
export interface MainControls {
  lifeEmergence: number;
  intelligenceEmergence: number;
  technologicalTransition: number;
  longTermSurvival: number;
  detectableCommunication: number;
  interstellarExpansion: number;
}

/** Advanced overrides (docs/DATA_MODEL.md 1.2). Unset fields derive from the blend. */
export interface AdvancedParams {
  runHorizonYears?: number;
  representativePopulationSize?: number;
  detectionRecognitionThreshold?: number;
  expansionEffectiveSpeedFractionC?: number;
  expansionLaunchDelayYears?: number;
  expansionSettlementDelayYears?: number;
}

export interface Scenario {
  schemaVersion: number;
  simulationModelVersion: number;
  seedA: number;
  seedB: number;
  controls: MainControls;
  advanced: AdvancedParams;
}

/** Scenario with every blend resolved to effective numbers (digest hashes THIS). */
export interface EffectiveParameters {
  runHorizonYears: number;
  representativePopulationSize: number;
  detectionRecognitionThreshold: number;
  expansionEffectiveSpeedFractionC: number;
  expansionLaunchDelayYears: number;
  expansionSettlementDelayYears: number;
}

export interface Position {
  radiusLy: number;
  angleRadians: number;
  armIndex: number;
  heightOffsetLy: number;
  /** Cartesian cache, computed once at generation via deterministic trig. */
  xLy: number;
  yLy: number;
}

export interface StarSystem {
  id: number;
  position: Position;
  habitabilityWeight: number;
}

export interface Civilization {
  id: number;
  hostSystemId: number;
  currentState: CivState;
  stateHistory: { state: CivState; atYear: number }[];
  detectableWindow: { startYear: number; endYear: number } | null;
  frontierId: number | null;
  extinctionCause: ExtinctionCause | null;
}

export interface Signal {
  id: number;
  sourceCivilizationId: number;
  originPosition: Position;
  emissionStartYear: number;
  emissionEndYear: number;
  strength: number;
}

export interface ExpansionFrontier {
  id: number;
  sourceCivilizationId: number;
  originYear: number;
  effectiveSpeedFractionC: number;
  launchDelayYears: number;
  settlementDelayYears: number;
  settledSystemIds: number[];
}

/** Event log entries (docs/DATA_MODEL.md 2.5). */
export type SimulationEvent = { id: number; atYear: number; causeEventId: number | null } & (
  | { type: 'StateTransition'; civilizationId: number; fromState: CivState; toState: CivState }
  | { type: 'SignalEmissionStart'; signalId: number }
  | { type: 'SignalEmissionEnd'; signalId: number }
  | { type: 'DetectionEvent'; signalId: number; receivingCivilizationId: number }
  | {
      type: 'ContactEvent';
      signalId: number;
      sourceCivilizationId: number;
      receivingCivilizationId: number;
    }
  | {
      type: 'TravelOverlapEvent';
      frontierId: number;
      sourceCivilizationId: number;
      overlappedCivilizationId: number;
    }
  | { type: 'ExpansionLaunch'; frontierId: number; systemId: number }
  | { type: 'ExpansionSettlement'; frontierId: number; systemId: number }
  | { type: 'ExtinctionEvent'; civilizationId: number; cause: ExtinctionCause }
  | { type: 'RunMilestone'; label: string }
);

/** The fifteen Silence Report metrics plus the headline (docs/DATA_MODEL.md 2.6). */
export interface RunMetrics {
  candidateWorldCount: number;
  independentLifeOriginCount: number;
  intelligentSpeciesCount: number;
  technologicalCivilizationCount: number;
  detectableCivilizationCount: number;
  disappearedCivilizationCount: number;
  peakSimultaneousActiveCount: number;
  signalOverlapCount: number;
  travelOverlapCount: number;
  confirmedContactCount: number;
  closestNearMissDistanceLy: number;
  closestNearMissTimeYears: number;
  longestLivedCivilizationYears: number;
  medianTechnologicalLifetimeYears: number;
  mostRestrictiveTransitionId: TransitionId | 'none';
  headline: string;
}

export interface RunResult {
  scenario: Scenario;
  effective: EffectiveParameters;
  systems: StarSystem[];
  civilizations: Civilization[];
  signals: Signal[];
  frontiers: ExpansionFrontier[];
  events: SimulationEvent[];
  metrics: RunMetrics;
  digest: string;
}
