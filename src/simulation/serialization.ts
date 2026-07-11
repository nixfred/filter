// Share URL codec and run digest (DATA001, FR008, FR017,
// docs/DATA_MODEL.md sections 3 and 4). The only module permitted to turn a
// Scenario into the compact share encoding.
import { SIMULATION_MODEL_VERSION } from './model_version';
import { SCHEMA_VERSION, DEFAULT_CONTROLS } from './scenario';
import { validateScenario } from './schema';
import type { EffectiveParameters, RunMetrics, Scenario, SimulationEvent } from './types';
import type { EngineRunState } from './engine';
import { fnv1a64Hex, u16ToUnit, unitToU16 } from '../utils/math';

/**
 * Maximum encoded share URL length in characters, the single source constant
 * asserted by tests (docs/DATA_MODEL.md section 4, docs/TEST_PLAN.md 2.2.1).
 * The v1 payload is 27 bytes fixed plus at most 18 advanced override bytes,
 * so 128 leaves generous headroom for the origin and path.
 */
export const MAX_SHARE_URL_LENGTH = 128;

const CONTROL_ORDER = [
  'lifeEmergence',
  'intelligenceEmergence',
  'technologicalTransition',
  'longTermSurvival',
  'detectableCommunication',
  'interstellarExpansion',
] as const;

// Advanced flag bits, fixed order (docs/DATA_MODEL.md 1.2 and section 4).
const FLAG_HORIZON = 1;
const FLAG_POPULATION = 2;
const FLAG_THRESHOLD = 4;
const FLAG_SPEED = 8;
const FLAG_LAUNCH = 16;
const FLAG_SETTLE = 32;

function base64urlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlDecode(text: string): Uint8Array | null {
  if (!/^[A-Za-z0-9_-]+$/.test(text)) return null;
  const padded = text.replace(/-/g, '+').replace(/_/g, '/');
  try {
    const binary = atob(padded + '=='.slice(0, (4 - (padded.length % 4)) % 4));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    return null;
  }
}

function checksum(bytes: Uint8Array, length: number): number {
  let sum = 0;
  for (let i = 0; i < length; i++) sum = (sum + bytes[i] * (i + 1)) & 0xff;
  return sum;
}

/** Encode a scenario into the compact share string (schema version 1). */
export function encodeScenario(scenario: Scenario): string {
  const a = scenario.advanced;
  let flags = 0;
  if (a.runHorizonYears !== undefined) flags |= FLAG_HORIZON;
  if (a.representativePopulationSize !== undefined) flags |= FLAG_POPULATION;
  if (a.detectionRecognitionThreshold !== undefined) flags |= FLAG_THRESHOLD;
  if (a.expansionEffectiveSpeedFractionC !== undefined) flags |= FLAG_SPEED;
  if (a.expansionLaunchDelayYears !== undefined) flags |= FLAG_LAUNCH;
  if (a.expansionSettlementDelayYears !== undefined) flags |= FLAG_SETTLE;

  const buffer = new ArrayBuffer(64);
  const view = new DataView(buffer);
  let offset = 0;
  view.setUint8(offset, SCHEMA_VERSION);
  offset += 1;
  view.setUint32(offset, scenario.simulationModelVersion, true);
  offset += 4;
  view.setUint32(offset, scenario.seedA, true);
  offset += 4;
  view.setUint32(offset, scenario.seedB, true);
  offset += 4;
  for (const key of CONTROL_ORDER) {
    view.setUint16(offset, unitToU16(scenario.controls[key]), true);
    offset += 2;
  }
  view.setUint8(offset, flags);
  offset += 1;
  if (flags & FLAG_HORIZON) {
    // Encoded in millennia so ten billion years fits uint32, a documented
    // refinement of the DATA_MODEL custom uint32 note.
    view.setUint32(offset, Math.round((a.runHorizonYears as number) / 1000), true);
    offset += 4;
  }
  if (flags & FLAG_POPULATION) {
    view.setUint32(offset, a.representativePopulationSize as number, true);
    offset += 4;
  }
  if (flags & FLAG_THRESHOLD) {
    view.setUint16(offset, unitToU16(a.detectionRecognitionThreshold as number), true);
    offset += 2;
  }
  if (flags & FLAG_SPEED) {
    view.setUint16(offset, unitToU16(a.expansionEffectiveSpeedFractionC as number), true);
    offset += 2;
  }
  if (flags & FLAG_LAUNCH) {
    view.setUint32(offset, a.expansionLaunchDelayYears as number, true);
    offset += 4;
  }
  if (flags & FLAG_SETTLE) {
    view.setUint32(offset, a.expansionSettlementDelayYears as number, true);
    offset += 4;
  }
  const bytes = new Uint8Array(buffer, 0, offset + 1);
  bytes[offset] = checksum(bytes, offset);
  return base64urlEncode(bytes);
}

/**
 * Decode an untrusted share string. Fails closed on any corruption,
 * truncation, unknown schema version, or model version mismatch (SEC002,
 * docs/DATA_MODEL.md section 4 migration policy).
 */
export function decodeScenario(encoded: string): Scenario | null {
  if (encoded.length === 0 || encoded.length > MAX_SHARE_URL_LENGTH) return null;
  const bytes = base64urlDecode(encoded);
  if (!bytes || bytes.length < 27) return null;
  if (checksum(bytes, bytes.length - 1) !== bytes[bytes.length - 1]) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const schemaVersion = view.getUint8(0);
  // Version 1 is the only decoder today; newer versions fail closed, older
  // versions gain documented upgrade functions here when they exist.
  if (schemaVersion !== 1) return null;
  let offset = 1;
  const simulationModelVersion = view.getUint32(offset, true);
  offset += 4;
  const seedA = view.getUint32(offset, true);
  offset += 4;
  const seedB = view.getUint32(offset, true);
  offset += 4;
  const controls = { ...DEFAULT_CONTROLS };
  for (const key of CONTROL_ORDER) {
    controls[key] = u16ToUnit(view.getUint16(offset, true));
    offset += 2;
  }
  const flags = view.getUint8(offset);
  offset += 1;
  const advanced: Scenario['advanced'] = {};
  try {
    if (flags & FLAG_HORIZON) {
      advanced.runHorizonYears = view.getUint32(offset, true) * 1000;
      offset += 4;
    }
    if (flags & FLAG_POPULATION) {
      advanced.representativePopulationSize = view.getUint32(offset, true);
      offset += 4;
    }
    if (flags & FLAG_THRESHOLD) {
      advanced.detectionRecognitionThreshold = u16ToUnit(view.getUint16(offset, true));
      offset += 2;
    }
    if (flags & FLAG_SPEED) {
      advanced.expansionEffectiveSpeedFractionC = u16ToUnit(view.getUint16(offset, true));
      offset += 2;
    }
    if (flags & FLAG_LAUNCH) {
      advanced.expansionLaunchDelayYears = view.getUint32(offset, true);
      offset += 4;
    }
    if (flags & FLAG_SETTLE) {
      advanced.expansionSettlementDelayYears = view.getUint32(offset, true);
      offset += 4;
    }
  } catch {
    return null;
  }
  if (offset !== bytes.length - 1) return null;
  const result = validateScenario({
    schemaVersion,
    simulationModelVersion,
    seedA,
    seedB,
    controls,
    advanced,
  });
  if (!result.ok) return null;
  if (result.scenario.simulationModelVersion !== SIMULATION_MODEL_VERSION) return null;
  return result.scenario;
}

/**
 * The run digest (docs/DATA_MODEL.md section 3): canonical fixed point byte
 * buffer over scenario, resolved parameters, terminal states, the full
 * ordered event log, and the metrics, reduced with FNV-1a.
 */
export function computeDigest(state: EngineRunState, metrics: RunMetrics): string {
  const chunks: number[] = [];
  const pushU32 = (v: number) => {
    const x = v >>> 0;
    chunks.push(x & 0xff, (x >>> 8) & 0xff, (x >>> 16) & 0xff, (x >>> 24) & 0xff);
  };
  const pushU53 = (v: number) => {
    // Years and counts exceed 32 bits: write as two 32 bit halves.
    const lo = v % 4294967296;
    const hi = Math.floor(v / 4294967296);
    pushU32(lo);
    pushU32(hi);
  };
  const pushText = (s: string) => {
    pushU32(s.length);
    for (let i = 0; i < s.length; i++) pushU32(s.charCodeAt(i));
  };

  const s = state.scenario;
  pushU32(s.schemaVersion);
  pushU32(s.simulationModelVersion);
  pushU32(s.seedA);
  pushU32(s.seedB);
  for (const key of CONTROL_ORDER) pushU32(unitToU16(s.controls[key]));
  const e: EffectiveParameters = state.effective;
  pushU53(e.runHorizonYears);
  pushU32(e.representativePopulationSize);
  pushU32(unitToU16(e.detectionRecognitionThreshold));
  pushU32(unitToU16(e.expansionEffectiveSpeedFractionC));
  pushU32(e.expansionLaunchDelayYears);
  pushU32(e.expansionSettlementDelayYears);

  // Terminal state of every civilization, in id order.
  pushU32(state.civilizations.length);
  for (const civ of state.civilizations) {
    pushU32(civ.id);
    pushText(civ.currentState);
    pushU53(civ.stateHistory[civ.stateHistory.length - 1].atYear);
  }

  // Full ordered event log, in processing order.
  pushU32(state.events.length);
  for (const event of state.events) {
    pushU32(event.id);
    pushU53(event.atYear);
    pushU32(event.causeEventId === null ? 0xffffffff : event.causeEventId);
    pushText(event.type);
    pushEventPayload(event, pushU32);
  }

  // Metrics, fixed field order.
  pushU32(metrics.candidateWorldCount);
  pushU32(metrics.independentLifeOriginCount);
  pushU32(metrics.intelligentSpeciesCount);
  pushU32(metrics.technologicalCivilizationCount);
  pushU32(metrics.detectableCivilizationCount);
  pushU32(metrics.disappearedCivilizationCount);
  pushU32(metrics.peakSimultaneousActiveCount);
  pushU32(metrics.signalOverlapCount);
  pushU32(metrics.travelOverlapCount);
  pushU32(metrics.confirmedContactCount);
  pushU53(metrics.closestNearMissDistanceLy);
  pushU53(metrics.closestNearMissTimeYears);
  pushU53(metrics.longestLivedCivilizationYears);
  pushU53(metrics.medianTechnologicalLifetimeYears);
  pushText(metrics.mostRestrictiveTransitionId);
  pushText(metrics.headline);

  return fnv1a64Hex(Uint8Array.from(chunks));
}

function pushEventPayload(event: SimulationEvent, pushU32: (v: number) => void): void {
  switch (event.type) {
    case 'StateTransition':
      pushU32(event.civilizationId);
      break;
    case 'SignalEmissionStart':
    case 'SignalEmissionEnd':
      pushU32(event.signalId);
      break;
    case 'DetectionEvent':
      pushU32(event.signalId);
      pushU32(event.receivingCivilizationId);
      break;
    case 'ContactEvent':
      pushU32(event.signalId);
      pushU32(event.sourceCivilizationId);
      pushU32(event.receivingCivilizationId);
      break;
    case 'TravelOverlapEvent':
      pushU32(event.frontierId);
      pushU32(event.sourceCivilizationId);
      pushU32(event.overlappedCivilizationId);
      break;
    case 'ExpansionLaunch':
    case 'ExpansionSettlement':
      pushU32(event.frontierId);
      pushU32(event.systemId);
      break;
    case 'ExtinctionEvent':
      pushU32(event.civilizationId);
      break;
    case 'RunMilestone':
      break;
  }
}
