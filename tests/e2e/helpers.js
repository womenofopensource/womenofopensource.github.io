const { expect } = require('@playwright/test');

// The theme hides page content behind a `loading` overlay and reveals it (removing the
// class) once the hero image has loaded. Wait for that so assertions don't race the
// reveal animation. `classList.contains('loading')` is an exact token match, so it
// correctly ignores the always-present `ajax-loading` class.
async function waitForReady(page) {
  await page.waitForFunction(() => !document.body.classList.contains('loading'));
}

// Navigate using the primary menu the way a user on this viewport would: on mobile/tablet
// the menu is behind a hamburger toggle, on desktop the links are always visible.
async function navigateViaMenu(page, linkText) {
  const toggle = page.locator('.js-menu-toggle');
  if (await toggle.isVisible()) {
    await toggle.click();
    await expect(page.locator('body')).toHaveClass(/menu--open/);
  }
  await page.locator('.menu__list__item__link', { hasText: linkText }).click();
}

// The "Showing N speaker(s)" label must always equal the number of cards actually
// on screen — this is the invariant the directory promises the user.
async function expectCountMatchesVisible(page) {
  const label = await page.locator('#speaker-count').textContent();
  const visible = await page.locator('.speaker-card:visible').count();
  expect(Number(label), 'count label should match visible cards').toBe(visible);
  return visible;
}

module.exports = { navigateViaMenu, expectCountMatchesVisible, waitForReady };
