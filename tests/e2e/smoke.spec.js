// Smoke tests: every key page must serve successfully, render a heading, and run its
// JavaScript without throwing. Runs on desktop, tablet and mobile.

const { test, expect } = require('./fixtures');

const PAGES = [
  '/',
  '/about/',
  '/speakers/',
  '/news/',
  '/contact/',
  '/application/',
  '/code-of-conduct/',
  '/partners/',
  '/thanks/',
];

for (const path of PAGES) {
  test(`${path} loads, renders a heading, and throws no JS errors`, async ({ page }) => {
    const jsErrors = [];
    page.on('pageerror', (err) => jsErrors.push(err.message));

    const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(response, `no response for ${path}`).not.toBeNull();
    expect(response.status(), `HTTP status for ${path}`).toBeLessThan(400);

    const heading = page.locator('h1').first();
    await expect(heading, `${path} should show a top-level heading`).toBeVisible();
    await expect(heading).not.toHaveText('');

    await expect(page).toHaveTitle(/.+/);

    // Give the theme's on-load JS a moment to run, then assert nothing threw.
    await page.waitForTimeout(300);
    expect(jsErrors, `uncaught JS errors on ${path}`).toEqual([]);
  });
}
