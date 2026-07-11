import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { Engine } from '../../../src/simulation/engine';
import { computeMetrics } from '../../../src/simulation/metrics';
import { computeDigest } from '../../../src/simulation/serialization';
import { validateScenario } from '../../../src/simulation/schema';
import { SIMULATION_MODEL_VERSION } from '../../../src/simulation/model_version';

// Committed fixture digests (FR017, FR033, docs/TEST_PLAN.md 3.1 to 3.4).
// Regeneration procedure (requires a simulation model version bump in the
// same commit, ruling R015): REGEN_DIGESTS=1 npm run test:simulation
const HERE = dirname(fileURLToPath(import.meta.url));
const SCENARIO_DIR = join(HERE, '../../fixtures/scenarios');
const DIGEST_DIR = join(HERE, '../../fixtures/simulation_digests');

function runScenarioFile(name: string): { digest: string } {
  const raw = JSON.parse(readFileSync(join(SCENARIO_DIR, name), 'utf8'));
  const result = validateScenario(raw);
  if (!result.ok) throw new Error(`fixture ${name} invalid: ${result.reason}`);
  const engine = new Engine(result.scenario);
  engine.run();
  const metrics = computeMetrics(engine.state);
  return { digest: computeDigest(engine.state, metrics) };
}

describe('determinism fixtures', () => {
  const fixtures = readdirSync(SCENARIO_DIR)
    .filter((f: string) => f.endsWith('.json'))
    .sort();

  it('has at least the committed fixture set', () => {
    expect(fixtures.length).toBeGreaterThanOrEqual(5);
  });

  for (const fixture of fixtures) {
    const stem = fixture.replace(/\.json$/, '');
    it(`reproduces the committed digest for ${stem}`, () => {
      const { digest } = runScenarioFile(fixture);
      const digestPath = join(DIGEST_DIR, `${stem}.json`);
      if (process.env.REGEN_DIGESTS === '1') {
        writeFileSync(
          digestPath,
          JSON.stringify({ modelVersion: SIMULATION_MODEL_VERSION, digest }, null, 2) + '\n',
        );
        return;
      }
      const committed = JSON.parse(readFileSync(digestPath, 'utf8'));
      // A model change without fixture regeneration fails loudly (R015).
      expect(committed.modelVersion).toBe(SIMULATION_MODEL_VERSION);
      expect(digest).toBe(committed.digest);
    });
  }

  it('produces byte identical digests across two independent runs', () => {
    const first = runScenarioFile(fixtures[0]);
    const second = runScenarioFile(fixtures[0]);
    expect(first.digest).toBe(second.digest);
  });
});
