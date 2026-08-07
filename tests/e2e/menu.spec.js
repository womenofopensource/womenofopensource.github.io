// Primary navigation. On narrow layouts the menu is behind a hamburger toggle; on wide
// layouts the links are always visible. The test adapts to whichever mode this viewport
// is actually in, and asserts the behaviour a user would expect in that mode.

const { test, expect } = require('./fixtures');

test('the primary menu works for this layout', async ({ page }) => {
  await page.goto('/');

  const toggle = page.locator('.js-menu-toggle');
  const firstLink = page.locator('.menu__list__item__link').first();

  if (await toggle.isVisible()) {
    // Hamburger mode (mobile/tablet).
    await expect(page.locator('body')).not.toHaveClass(/menu--open/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.click();
    await expect(page.locator('body')).toHaveClass(/menu--open/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(firstLink).toBeVisible();

    // Toggling again closes it.
    await toggle.click();
    await expect(page.locator('body')).not.toHaveClass(/menu--open/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  } else {
    // Inline mode (desktop): links are always available, no toggle needed.
    await expect(firstLink).toBeVisible();
  }
});

test('choosing a menu item on mobile navigates and closes the menu', async ({ page }) => {
  await page.goto('/');

  const toggle = page.locator('.js-menu-toggle');
  test.skip(!(await toggle.isVisible()), 'no hamburger menu at this viewport');

  await toggle.click();
  await expect(page.locator('body')).toHaveClass(/menu--open/);

  await page.locator('.menu__list__item__link', { hasText: 'About' }).click();

  await expect(page).toHaveURL(/\/about\/$/);
  await expect(page.locator('body')).not.toHaveClass(/menu--open/);
});
