import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ACC005 automated accessibility scan (docs/ACCESSIBILITY.md section 7).
// At G1 this covers the opening state; the full core flow scans (configuration,
// simulation, report, drawers) join at G3 through G5 as those states exist.
test('opening state has no axe violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
