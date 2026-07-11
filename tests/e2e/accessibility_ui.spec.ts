import { test, expect } from '@playwright/test';

// G5 accessibility surfaces: the keyboard help sheet and the in application
// motion and power toggles (ACC001, ACC003, NFR002).
test('the question mark key opens the keyboard help (ACC001)', async ({ page }) => {
  await page.goto('/');
  // Wait for the app to mount so the global keydown listener is attached
  // before pressing the shortcut (the listener is set in a React effect).
  await expect(page.getByTestId('create-galaxy')).toBeVisible();
  await page.keyboard.press('?');
  await expect(page.getByRole('heading', { name: 'Keyboard shortcuts' })).toBeVisible();
  await expect(page.getByText('Start, pause, or resume')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('heading', { name: 'Keyboard shortcuts' })).not.toBeVisible();
});

test('the About panel exposes reduced motion and low power toggles (ACC003, NFR002)', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByTestId('open-about').click();
  const motion = page.getByTestId('toggle-reduced-motion');
  const power = page.getByTestId('toggle-low-power');
  await expect(motion).not.toBeChecked();
  await motion.check();
  await expect(motion).toBeChecked();
  await power.check();
  await expect(power).toBeChecked();
  // The preference persists across a reload (DATA002).
  await page.reload();
  await page.getByTestId('open-about').click();
  await expect(page.getByTestId('toggle-reduced-motion')).toBeChecked();
});
