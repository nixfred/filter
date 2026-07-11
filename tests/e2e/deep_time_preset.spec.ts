import { test, expect } from '@playwright/test';

// The Deep Time preset showcases the advanced settings (Fred's request): it
// carries advanced overrides, so picking it lands in configuration with the
// advanced panel already open and populated (FR003, FR010).
test('Deep Time preset opens the advanced panel pre-populated', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('run-preset').click();
  await page.getByTestId('preset-deep-time').click();
  await expect(page.getByText('Preset: Deep Time')).toBeVisible();
  // Advanced controls are visible without clicking the toggle.
  await expect(page.getByTestId('advanced-controls')).toBeVisible();
  // The 50 billion year horizon is selected and expansion speed is high.
  await expect(page.getByTestId('horizon-50B')).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByText('50 percent of light speed')).toBeVisible();
  // The override badge reflects the preset's advanced fields.
  await expect(page.getByTestId('advanced-toggle')).toContainText('6');
});
