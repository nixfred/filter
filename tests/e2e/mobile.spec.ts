import { test, expect } from '@playwright/test';

// Mobile layout (FR031): the core interaction is usable at a mobile viewport.
// This spec verifies layout, touch target size, and that a run starts and
// renders, without waiting for a full 2048 system run to complete, which is a
// compute cost that belongs on the desktop projects (the simulation behavior
// is engine identical and covered there). It runs on the mobile-chrome and
// mobile-safari projects.
test('the core path is usable at a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByTestId('create-galaxy')).toBeVisible();
  await page.getByTestId('create-galaxy').click();
  // The six controls stack into the mobile layout.
  await expect(page.getByRole('slider').first()).toBeVisible();
  await page.getByRole('button', { name: 'Start' }).click();
  // The galaxy canvas mounts and the transport bar is present.
  await expect(page.getByTestId('galaxy-viewport')).toBeVisible();
  await expect(page.getByTestId('pause-resume')).toBeVisible();
  // Touch targets meet the minimum height.
  const box = await page.getByTestId('pause-resume').boundingBox();
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(40);
  // The run advances: the simulated time is no longer at the origin.
  await page.getByTestId('speed-1000x').click();
  await expect
    .poll(async () => (await page.getByTestId('sim-time').textContent()) ?? '', { timeout: 15_000 })
    .not.toBe('0 years');
});
