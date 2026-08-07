// The theme swaps pages client-side (AJAX) rather than doing full reloads, and re-runs
// its per-page JS afterwards. That mechanism has broken twice before (it strips inline
// <script> tags, which is why hCaptcha and the speaker filters had to move into
// personal.js). These tests guard that journey across all three layouts.

const { test, expect } = require('./fixtures');
const { navigateViaMenu } = require('./helpers');

test('navigating Home → Speakers happens without a full page reload', async ({ page }) => {
  await page.goto('/');
  // This marker is wiped by any full document reload; it survives an AJAX swap.
  await page.evaluate(() => { window.__noFullReload = true; });

  await navigateViaMenu(page, 'Speakers');

  await expect(page).toHaveURL(/\/speakers\/$/);
  await expect(page.locator('#speakers-grid')).toBeVisible();

  const survived = await page.evaluate(() => window.__noFullReload === true);
  expect(survived, 'expected a client-side AJAX navigation, not a full reload').toBe(true);
});

test('speaker filters are re-initialised after AJAX navigation', async ({ page }) => {
  await page.goto('/');
  await navigateViaMenu(page, 'Speakers');
  await expect(page.locator('#speakers-grid')).toBeVisible();

  const total = await page.locator('.speaker-card').count();
  expect(total, 'expected the directory to list speakers').toBeGreaterThan(0);

  // If initSpeakersDirectory() had not re-run after the AJAX swap, typing would do
  // nothing and every card would stay visible. This is the exact regression we hit before.
  await page.fill('#speaker-search', 'zzzz-no-such-speaker-xyz');
  await expect(page.locator('#no-results')).toBeVisible();
  await expect(page.locator('.speaker-card:visible')).toHaveCount(0);
});
