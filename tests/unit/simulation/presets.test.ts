import { describe, expect, it } from 'vitest';
import { PRESETS, presetById } from '../../../src/content/presets';
import { createScenario } from '../../../src/simulation/scenario';
import { Engine } from '../../../src/simulation/engine';
import { computeMetrics } from '../../../src/simulation/metrics';

// Preset outcome character across a committed seed batch (FR010, R022,
// docs/TEST_PLAN.md 2.2.1). Each preset must produce its documented
// character, and the cross preset ordering must hold. Bands are set
// conservatively wider than the measured behavior so seed variation cannot
// flake, and are flagged for calibration alongside PENDING P004. The batch is
// fixed and committed, so the test is deterministic (NFR010).
const PRESET_SEED_BATCH_SIZE = 24;

// Conservative per preset acceptance bounds (P004 calibration candidates).
const SILENT_GALAXY_MAX_CONTACT_FRACTION = 0.05;
const SILENT_GALAXY_MAX_AVG_DETECTABLE = 0.5;
const CROWDED_BRIEFLY_MIN_AVG_TECH = 6;
const CROWDED_BRIEFLY_MAX_MEDIAN_TECH_LIFETIME = 100_000;
const LOUD_BUT_LONELY_MIN_AVG_DETECTABLE = 1;
const LOUD_BUT_LONELY_MAX_CONTACT_FRACTION = 0.3;
const RARE_EARTH_MAX_AVG_TECH = 2;
const PATIENT_STARS_MIN_MEDIAN_TECH_LIFETIME = 1_000_000;
const PATIENT_STARS_MAX_INTERSTELLAR_FRACTION = 0.3;
const EXPANSION_WINS_MIN_INTERSTELLAR_FRACTION = 0.5;
const OPTIMIST_MIN_CONTACT_FRACTION = 0.2;

interface PresetStats {
  contactFraction: number;
  avgDetectable: number;
  avgTech: number;
  interstellarFraction: number;
  avgMedianTechLifetime: number;
}

function measure(presetId: string): PresetStats {
  const preset = presetById(presetId);
  if (!preset) throw new Error(`unknown preset ${presetId}`);
  let contact = 0;
  let detectable = 0;
  let tech = 0;
  let interstellar = 0;
  let medianLife = 0;
  for (let s = 0; s < PRESET_SEED_BATCH_SIZE; s++) {
    // Include the preset's advanced overrides (for example expansion speed and
    // delays), but cap population and horizon to test friendly values so the
    // batch stays fast and deterministic; the character under test is the
    // preset definition, not the run size.
    const scenario = createScenario(1000 + s * 7, 2000 + s * 13, preset.controls, {
      ...(preset.advanced ?? {}),
      representativePopulationSize: 256,
      runHorizonYears: 10_000_000_000,
    });
    const engine = new Engine(scenario);
    engine.run();
    const m = computeMetrics(engine.state);
    if (m.confirmedContactCount > 0) contact += 1;
    detectable += m.detectableCivilizationCount;
    tech += m.technologicalCivilizationCount;
    medianLife += m.medianTechnologicalLifetimeYears;
    if (engine.state.frontiers.length > 0) interstellar += 1;
  }
  return {
    contactFraction: contact / PRESET_SEED_BATCH_SIZE,
    avgDetectable: detectable / PRESET_SEED_BATCH_SIZE,
    avgTech: tech / PRESET_SEED_BATCH_SIZE,
    interstellarFraction: interstellar / PRESET_SEED_BATCH_SIZE,
    avgMedianTechLifetime: medianLife / PRESET_SEED_BATCH_SIZE,
  };
}

describe('preset outcome character (FR010)', () => {
  const stats = new Map<string, PresetStats>();
  for (const preset of PRESETS) stats.set(preset.id, measure(preset.id));

  it('has the eight packet presets plus the advanced showcase', () => {
    expect(PRESETS).toHaveLength(9);
    expect(PRESETS.filter((p) => p.advanced).map((p) => p.id)).toEqual(['deep-time']);
  });

  it('Deep Time showcases fast expansion, reaching interstellar in most runs', () => {
    const s = stats.get('deep-time')!;
    expect(s.interstellarFraction).toBeGreaterThanOrEqual(0.5);
  });

  it('The Silent Galaxy is effectively silent', () => {
    const s = stats.get('silent-galaxy')!;
    expect(s.contactFraction).toBeLessThanOrEqual(SILENT_GALAXY_MAX_CONTACT_FRACTION);
    expect(s.avgDetectable).toBeLessThanOrEqual(SILENT_GALAXY_MAX_AVG_DETECTABLE);
  });

  it('Crowded, Briefly makes many civilizations that die young', () => {
    const s = stats.get('crowded-briefly')!;
    expect(s.avgTech).toBeGreaterThanOrEqual(CROWDED_BRIEFLY_MIN_AVG_TECH);
    expect(s.avgMedianTechLifetime).toBeLessThanOrEqual(CROWDED_BRIEFLY_MAX_MEDIAN_TECH_LIFETIME);
  });

  it('Loud but Lonely transmits but rarely connects', () => {
    const s = stats.get('loud-but-lonely')!;
    expect(s.avgDetectable).toBeGreaterThanOrEqual(LOUD_BUT_LONELY_MIN_AVG_DETECTABLE);
    expect(s.contactFraction).toBeLessThanOrEqual(LOUD_BUT_LONELY_MAX_CONTACT_FRACTION);
  });

  it('Rare Earth filters almost everything before technology', () => {
    const s = stats.get('rare-earth')!;
    expect(s.avgTech).toBeLessThanOrEqual(RARE_EARTH_MAX_AVG_TECH);
  });

  it('Patient Stars produces long lived, non expanding civilizations', () => {
    const s = stats.get('patient-stars')!;
    expect(s.avgMedianTechLifetime).toBeGreaterThanOrEqual(PATIENT_STARS_MIN_MEDIAN_TECH_LIFETIME);
    expect(s.interstellarFraction).toBeLessThanOrEqual(PATIENT_STARS_MAX_INTERSTELLAR_FRACTION);
  });

  it('Expansion Wins reaches interstellar in most runs', () => {
    const s = stats.get('expansion-wins')!;
    expect(s.interstellarFraction).toBeGreaterThanOrEqual(EXPANSION_WINS_MIN_INTERSTELLAR_FRACTION);
  });

  it("Optimist's Milky Way is the most favorable to contact", () => {
    const s = stats.get('optimists-milky-way')!;
    expect(s.contactFraction).toBeGreaterThanOrEqual(OPTIMIST_MIN_CONTACT_FRACTION);
  });

  it('holds the cross preset ordering regardless of exact calibration', () => {
    const silent = stats.get('silent-galaxy')!;
    const optimist = stats.get('optimists-milky-way')!;
    const crowded = stats.get('crowded-briefly')!;
    const patient = stats.get('patient-stars')!;
    const expansion = stats.get('expansion-wins')!;
    const rare = stats.get('rare-earth')!;
    // The Silent Galaxy never beats the Optimist on contact or detectability.
    expect(silent.contactFraction).toBeLessThanOrEqual(optimist.contactFraction);
    expect(silent.avgDetectable).toBeLessThan(optimist.avgDetectable);
    // Crowded lifetimes are far shorter than Patient Stars lifetimes.
    expect(crowded.avgMedianTechLifetime).toBeLessThan(patient.avgMedianTechLifetime);
    // Expansion Wins expands more than Patient Stars.
    expect(expansion.interstellarFraction).toBeGreaterThan(patient.interstellarFraction);
    // Rare Earth reaches technology far less than the Optimist.
    expect(rare.avgTech).toBeLessThan(optimist.avgTech);
  });
});
