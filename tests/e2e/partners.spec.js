// The partners page shows the current partners, or — while there are none — a
// "become our first partner" call to action. This test asserts whichever state the
// site is in, so it keeps passing once a real partner is added.

const { test, expect } = require('./fixtures');

test('partners page shows partners, or a "become our first partner" CTA', async ({ page }) => {
  await page.goto('/partners/');
  await expect(page.locator('h1')).toBeVisible();

  const cards = page.locator('.partner-card');
  if ((await cards.count()) > 0) {
    await expect(cards.first()).toBeVisible();
  } else {
    // Empty state: a prominent CTA button inviting the first partner, linking to contact.
    const cta = page.locator('.partners-empty a.button');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveText(/become our first partner/i);
    await expect(cta).toHaveAttribute('href', /\/contact\/$/);
  }
});
