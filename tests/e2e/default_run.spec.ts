import { test, expect } from '@playwright/test';

// Create and run a default galaxy through to the Silence Report (FR004,
// FR009, FR024, BR002: the whole core path without reading an essay).
test('a default run completes and produces the Silence Report', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('create-galaxy').click();
  await page.getByRole('button', { name: 'Start' }).click();
  // The simulation state is live: status bar, transport, canvas.
  await expect(page.getByTestId('galaxy-viewport')).toBeVisible();
  await expect(page.getByTestId('pause-resume')).toBeVisible();
  // Pause and resume (capabilities 2 and 3).
  await page.getByTestId('pause-resume').click();
  await expect(page.getByTestId('pause-resume')).toHaveText('Resume');
  await page.getByTestId('pause-resume').click();
  await expect(page.getByTestId('pause-resume')).toHaveText('Pause');
  // Change speed (capability 4), then jump to the end at maximum.
  await page.getByTestId('speed-1000x').click();
  await page.getByTestId('speed-max').click();
  // The Silence Report appears with a headline and the fifteen metrics.
  const report = page.getByTestId('silence-report');
  await expect(report).toBeVisible({ timeout: 30_000 });
  await expect(page.getByTestId('report-headline')).not.toBeEmpty();
  await expect(page.getByTestId('metric-candidateWorldCount')).toHaveText('2,048');
  await expect(page.getByTestId('metric-mostRestrictiveTransitionId')).not.toBeEmpty();
  // Closing the report returns to the canvas with a way back in.
  await page.getByTestId('close-report').click();
  await expect(report).not.toBeVisible();
  await page.getByTestId('view-report').click();
  await expect(report).toBeVisible();
});

test('the event ledger opens and fills during a run (FR006)', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('create-galaxy').click();
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByTestId('speed-max').click();
  await expect(page.getByTestId('silence-report')).toBeVisible({ timeout: 30_000 });
  await page.getByTestId('toggle-ledger').click();
  await expect(page.getByTestId('ledger-list')).toBeVisible();
  const rows = page.getByTestId('ledger-list').locator('li');
  expect(await rows.count()).toBeGreaterThan(0);
});
