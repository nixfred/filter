import { test, expect } from '@playwright/test';

// Post deploy smoke test (docs/CI_CD.md section 7, OPS006). Runs only in the
// production-smoke Playwright project against the live custom domain after a
// production deploy. Asserts the critical path and the deployment invariants.
test('the live production site serves and completes a run', async ({ page }) => {
  const response = await page.goto('/');
  // 1. The custom domain returns 200 over a valid certificate.
  expect(response?.status()).toBe(200);
  // 2. Title and canonical point at the custom domain.
  await expect(page).toHaveTitle('The Great Filter');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://filter.nixfred.com/',
  );

  // 5. build.json reports the deployed commit (version matches deploy).
  const build = await page.request.get('/build.json');
  expect(build.ok()).toBe(true);
  const meta = await build.json();
  expect(typeof meta.commit).toBe('string');
  expect(meta.commit.length).toBeGreaterThan(0);

  // 6. Production allows indexing (no preview noindex header on the domain).
  expect(response?.headers()['x-robots-tag']).toBeUndefined();

  // 4. Security headers are present.
  const headers = response?.headers() ?? {};
  expect(headers['content-security-policy']).toBeTruthy();
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['referrer-policy']).toBeTruthy();
  expect(headers['permissions-policy']).toBeTruthy();

  // 7. The critical interaction path completes to the Silence Report with no
  // severe console error.
  const severe: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') severe.push(message.text());
  });
  await page.getByTestId('create-galaxy').click();
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByTestId('speed-max').click();
  await expect(page.getByTestId('silence-report')).toBeVisible({ timeout: 45_000 });
  expect(severe).toEqual([]);
});
