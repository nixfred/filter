import { test, expect } from '@playwright/test';

// First visit onboarding (FR011, UX004, INTERACTION_SPEC 1.1): the opening
// state appears, is skippable, and offers direct access to the simulation.
test('opening state offers both entry paths', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('The Great Filter');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('THE GREAT FILTER');
  await expect(page.getByTestId('create-galaxy')).toBeVisible();
  await expect(page.getByTestId('run-preset')).toBeVisible();
  // Skippable: one action leads straight to the configuration state.
  await page.getByTestId('create-galaxy').click();
  await expect(page.getByRole('slider').first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();
});

test('preset path lands in configuration with the preset applied', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('run-preset').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByTestId('preset-loud-but-lonely').click();
  await expect(page.getByText('Preset: Loud but Lonely')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();
});

test('footer carries identity, links, and version (REL007, OPS009)', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'nixfred.com' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Source' })).toBeVisible();
  await expect(page.getByTestId('model-version')).toContainText('model v');
});
