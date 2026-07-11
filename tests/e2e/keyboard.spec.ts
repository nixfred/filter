import { test, expect } from '@playwright/test';

// Keyboard only operation of the core path (ACC001, docs/ACCESSIBILITY.md
// 1.2). Focus is placed with element focus rather than simulated Tab because
// WebKit and Safari only include links and some controls in the Tab order
// when the operating system full keyboard access setting is on; element
// focusability plus the global shortcut map is the browser agnostic proof of
// operability.
test('the complete core path operates with keyboard only', async ({ page }) => {
  await page.goto('/');
  // The skip link is the first focusable element (ACCESSIBILITY 1.1 rule 4).
  const skip = page.locator('.skip-link');
  await skip.focus();
  await expect(skip).toBeFocused();
  // Enter the configuration state from the keyboard.
  await page.getByTestId('create-galaxy').focus();
  await page.keyboard.press('Enter');
  // Sliders are keyboard operable (ACCESSIBILITY 1.4).
  const firstSlider = page.getByRole('slider').first();
  await firstSlider.focus();
  const before = await firstSlider.inputValue();
  await page.keyboard.press('ArrowRight');
  await expect(firstSlider).not.toHaveValue(before);
  // Begin the run from the keyboard.
  await page.getByRole('button', { name: 'Start' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('galaxy-viewport')).toBeVisible();
  // Global shortcut map (ACCESSIBILITY 1.2): Space toggles pause and resume.
  await page.keyboard.press(' ');
  await expect(page.getByTestId('pause-resume')).toHaveText('Resume');
  await page.keyboard.press(' ');
  await expect(page.getByTestId('pause-resume')).toHaveText('Pause');
  // Bracket steps speed, E toggles the ledger, S the share dialog.
  await page.keyboard.press(']');
  await page.keyboard.press('e');
  await expect(page.getByRole('heading', { name: 'Event ledger' })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.keyboard.press('s');
  await expect(page.getByTestId('share-url')).toBeVisible();
  await page.keyboard.press('Escape');
  // The live region announces actions (ACC002).
  await expect(page.getByTestId('live-region')).not.toBeEmpty();
});
