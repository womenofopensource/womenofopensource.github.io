// The partners page shows the current partners, or — while there are none — a
// "become our first partner" call to action. This test asserts whichever state the
// site is in, so it keeps passing once a real partner is added.

const { test, expect } = require('./fixtures');

test('partners page shows partners, or a "become our first partner" CTA', async ({ page }) => {
  await page.goto('/partners/');
  await expect(page.locator('h1')).toBeVisible();

  // The two states are mutually exclusive — assert the active one AND the absence of the
  // other, so a regression that renders both (or leaves stale markup) is caught.
  const cards = page.locator('.partner-card');
  const cta = page.locator('.partners-empty a.button');

  if ((await cards.count()) > 0) {
    await expect(cards.first()).toBeVisible();
    await expect(cta).toHaveCount(0);
  } else {
    await expect(cta).toBeVisible();
    await expect(cta).toHaveText(/become our first partner/i);
    await expect(cta).toHaveAttribute('href', /\/contact\/$/);
    await expect(cards).toHaveCount(0);
  }
});
