import { test, expect } from '@playwright/test';

// Mobile layout (FR031): the core interaction remains usable at a mobile
// viewport. The mobile-safari and mobile-chrome projects run every spec;
// this one asserts the layout specifics hold on ANY project at a mobile
// viewport size.
test('the core path works at a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByTestId('create-galaxy')).toBeVisible();
  await page.getByTestId('create-galaxy').click();
  await expect(page.getByRole('slider').first()).toBeVisible();
  await page.getByRole('button', { name: 'Start' }).click();
  await expect(page.getByTestId('galaxy-viewport')).toBeVisible();
  await page.getByTestId('speed-max').click();
  await expect(page.getByTestId('silence-report')).toBeVisible({ timeout: 30_000 });
  // Touch targets: the primary transport buttons meet the 40px floor.
  const box = await page.getByTestId('pause-resume').boundingBox();
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(40);
});
