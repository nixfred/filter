import { test, expect } from '@playwright/test';

// Share and reopen a scenario (FR008, DATA001): the link reproduces the
// identical modeled history. Two independent visits through the same shared
// URL must produce the same headline and the same metrics.
test('a shared scenario reproduces the identical run', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('create-galaxy').click();
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByTestId('speed-max').click();
  await expect(page.getByTestId('silence-report')).toBeVisible({ timeout: 30_000 });
  await page.getByTestId('close-report').click();
  await page.getByTestId('share').click();
  const url = await page.getByTestId('share-url').inputValue();
  expect(url).toMatch(/\?s=[A-Za-z0-9_-]+$/);
  const shared = new URL(url);
  const target = shared.pathname + shared.search;

  async function runShared(): Promise<{ headline: string; contacts: string; detectable: string }> {
    await page.goto(target);
    // The shared link opens ready in configuration (packet Q70 default),
    // carrying the encoded seed so Start reproduces the exact run (FR008).
    await page.getByRole('button', { name: 'Start' }).click();
    await page.getByTestId('speed-max').click();
    await expect(page.getByTestId('silence-report')).toBeVisible({ timeout: 30_000 });
    return {
      headline: (await page.getByTestId('report-headline').textContent()) ?? '',
      contacts: (await page.getByTestId('metric-confirmedContactCount').textContent()) ?? '',
      detectable:
        (await page.getByTestId('metric-detectableCivilizationCount').textContent()) ?? '',
    };
  }

  const first = await runShared();
  const second = await runShared();
  expect(first.headline.length).toBeGreaterThan(0);
  expect(second).toEqual(first);
});
