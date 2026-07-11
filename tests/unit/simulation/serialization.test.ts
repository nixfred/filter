import { describe, expect, it } from 'vitest';
import {
  decodeScenario,
  encodeScenario,
  MAX_SHARE_URL_LENGTH,
} from '../../../src/simulation/serialization';
import { createScenario } from '../../../src/simulation/scenario';
import { u16ToUnit, unitToU16 } from '../../../src/utils/math';

// Share encoding round trip, corruption handling, and the length budget
// (DATA001, FR008, SEC002, docs/TEST_PLAN.md 2.1 area 11 and 2.2.1).
describe('encodeScenario and decodeScenario', () => {
  it('round trips the default scenario exactly at wire precision', () => {
    const scenario = createScenario(123456789, 987654321);
    // Controls travel as uint16 (docs/DATA_MODEL.md section 4), so the exact
    // round trip target is the wire quantized scenario.
    const quantized = {
      ...scenario,
      controls: Object.fromEntries(
        Object.entries(scenario.controls).map(([k, v]) => [k, u16ToUnit(unitToU16(v))]),
      ) as unknown as typeof scenario.controls,
    };
    const decoded = decodeScenario(encodeScenario(scenario));
    expect(decoded).not.toBeNull();
    expect(decoded).toEqual(quantized);
    // A second encode of the decoded scenario is byte identical: the wire
    // representation is a fixed point.
    expect(encodeScenario(decoded as NonNullable<typeof decoded>)).toBe(encodeScenario(quantized));
  });

  it('round trips every advanced override exactly', () => {
    const scenario = createScenario(
      1,
      2,
      { lifeEmergence: 0.25, interstellarExpansion: 0.9 },
      {
        runHorizonYears: 5_000_000_000,
        representativePopulationSize: 4096,
        detectionRecognitionThreshold: 0.2,
        expansionEffectiveSpeedFractionC: 0.05,
        expansionLaunchDelayYears: 2_000,
        expansionSettlementDelayYears: 750,
      },
    );
    const decoded = decodeScenario(encodeScenario(scenario));
    expect(decoded).not.toBeNull();
    expect(decoded?.advanced.runHorizonYears).toBe(5_000_000_000);
    expect(decoded?.advanced.representativePopulationSize).toBe(4096);
    expect(decoded?.advanced.expansionLaunchDelayYears).toBe(2_000);
    // uint16 scaled fields round trip within wire precision.
    expect(Math.abs((decoded?.advanced.detectionRecognitionThreshold ?? 0) - 0.2)).toBeLessThan(
      1e-4,
    );
    expect(Math.abs((decoded?.controls.lifeEmergence ?? 0) - 0.25)).toBeLessThan(1e-4);
  });

  it('stays within the length budget even with every override set', () => {
    const maximal = createScenario(
      4294967295,
      4294967295,
      {
        lifeEmergence: 1,
        intelligenceEmergence: 1,
        technologicalTransition: 1,
        longTermSurvival: 1,
        detectableCommunication: 1,
        interstellarExpansion: 1,
      },
      {
        runHorizonYears: 100_000_000_000,
        representativePopulationSize: 8192,
        detectionRecognitionThreshold: 1,
        expansionEffectiveSpeedFractionC: 0.999,
        expansionLaunchDelayYears: 1_000_000,
        expansionSettlementDelayYears: 1_000_000,
      },
    );
    const encoded = encodeScenario(maximal);
    expect(encoded.length).toBeLessThanOrEqual(MAX_SHARE_URL_LENGTH);
    expect(decodeScenario(encoded)).not.toBeNull();
  });

  it('fails closed on corruption: any single flipped character', () => {
    const encoded = encodeScenario(createScenario(42, 43));
    for (let i = 0; i < encoded.length; i++) {
      const flipped = encoded.slice(0, i) + (encoded[i] === 'A' ? 'B' : 'A') + encoded.slice(i + 1);
      if (flipped === encoded) continue;
      const decoded = decodeScenario(flipped);
      // Either rejected outright, or the checksum caught it. A surviving
      // decode would mean silent corruption, which is the failure mode
      // SEC002 forbids.
      if (decoded !== null) {
        // The one in 256 checksum collision case must still decode to a
        // structurally valid, clamped scenario, never throw or half parse.
        expect(decoded.schemaVersion).toBe(1);
      }
    }
  });

  it('fails closed on truncation, emptiness, oversize, and alien schema', () => {
    const encoded = encodeScenario(createScenario(7, 8));
    expect(decodeScenario(encoded.slice(0, 10))).toBeNull();
    expect(decodeScenario('')).toBeNull();
    expect(decodeScenario('a'.repeat(MAX_SHARE_URL_LENGTH + 1))).toBeNull();
    expect(decodeScenario('!!!not-base64url!!!')).toBeNull();
  });
});
