import { test, expect } from '@playwright/test';

// G1 scaffold smoke: the built application serves, titles correctly, and shows the
// opening state (BR001 partial, UX004 seed). The six canonical journey specs replace
// the load assertions here at G3 (docs/TEST_PLAN.md 2.3); this spec then narrows to
// build integrity only.
test('scaffold serves the opening state', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('The Great Filter');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('THE GREAT FILTER');
  await expect(page.getByTestId('model-version')).toBeVisible();
});
