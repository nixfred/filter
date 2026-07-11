import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect } from '@playwright/test';

// Cross engine determinism (FR017, FR033, docs/TEST_PLAN.md 3.6): every
// committed fixture digest is recomputed inside the real browser engine and
// must equal the committed value. The browser_smoke job runs this spec in
// Chromium, Firefox, and WebKit, proving bit identity across engines.
const SCENARIO_DIR = 'tests/fixtures/scenarios';
const DIGEST_DIR = 'tests/fixtures/simulation_digests';

const fixtures = readdirSync(SCENARIO_DIR)
  .filter((f) => f.endsWith('.json'))
  .sort();

for (const fixture of fixtures) {
  const stem = fixture.replace(/\.json$/, '');
  test(`fixture ${stem} digests identically in this engine`, async ({ page }) => {
    const scenario = JSON.parse(readFileSync(join(SCENARIO_DIR, fixture), 'utf8'));
    const committed = JSON.parse(readFileSync(join(DIGEST_DIR, `${stem}.json`), 'utf8'));
    await page.goto('/');
    const digest = await page.evaluate(
      (s) =>
        (window as unknown as { __runFixtureDigest(v: unknown): string }).__runFixtureDigest(s),
      scenario,
    );
    expect(digest).toBe(committed.digest);
  });
}
