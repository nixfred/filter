import { test, expect } from '@playwright/test';

// G4 features: education drawer, About panel, persistence, clear data
// (FR012, FR013, FR014, DATA002, OPS009).
test('the field guide opens and explains the model (FR012, BR003)', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('open-education').click();
  await expect(page.getByRole('heading', { name: 'Field guide' })).toBeVisible();
  await page.getByTestId('education-assumptions').click();
  await expect(page.getByText('This is a model, not a measurement.')).toBeVisible();
});

test('the About panel shows version identifiers (OPS009)', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('open-about').click();
  await expect(page.getByTestId('about-model-version')).toHaveText('1');
  await expect(page.getByTestId('about-commit')).not.toBeEmpty();
});

test('the last scenario restores on the next visit, and clearing removes it (FR14, FR13)', async ({
  page,
}) => {
  await page.goto('/');
  // Choose a preset so the restored controls are recognizable.
  await page.getByTestId('run-preset').click();
  await page.getByTestId('preset-optimists-milky-way').click();
  await page.getByRole('button', { name: 'Start' }).click();
  await page.getByTestId('speed-max').click();
  await expect(page.getByTestId('silence-report')).toBeVisible({ timeout: 45_000 });

  // A fresh visit restores directly into the configuration state (FR014).
  await page.goto('/');
  await expect(page.getByRole('slider').first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();

  // Clearing local data returns to the opening state (FR013, DATA002).
  await page.getByTestId('open-about').click();
  await page.getByTestId('clear-data').click();
  await expect(page.getByTestId('create-galaxy')).toBeVisible();
  // And the next visit no longer restores.
  await page.goto('/');
  await expect(page.getByTestId('create-galaxy')).toBeVisible();
});
