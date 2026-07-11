import { test, expect } from '@playwright/test';

// Start over returns to the opening screen (Fred's launch feedback).
test('Start over returns to the opening screen from a run', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('create-galaxy').click();
  await page.getByRole('button', { name: 'Start' }).click();
  await expect(page.getByTestId('galaxy-viewport')).toBeVisible();
  await page.getByTestId('start-over').click();
  await expect(page.getByTestId('create-galaxy')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('THE GREAT FILTER');
});
