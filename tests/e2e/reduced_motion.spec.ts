import { test, expect } from '@playwright/test';

// Reduced motion operation (FR029, ACC003): the run remains fully usable and
// the story is carried by discrete states and the ledger, not animation.
test.use({ contextOptions: { reducedMotion: 'reduce' } });

test('a full run works under prefers-reduced-motion', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('create-galaxy').click();
  await page.getByRole('button', { name: 'Start' }).click();
  await expect(page.getByTestId('galaxy-viewport')).toBeVisible();
  await page.getByTestId('speed-max').click();
  await expect(page.getByTestId('silence-report')).toBeVisible({ timeout: 30_000 });
  await expect(page.getByTestId('report-headline')).not.toBeEmpty();
  // The ledger provides the time stamped account (FR029).
  await page.getByTestId('close-report').click();
  await page.getByTestId('toggle-ledger').click();
  await expect(page.getByTestId('ledger-list')).toBeVisible();
});
