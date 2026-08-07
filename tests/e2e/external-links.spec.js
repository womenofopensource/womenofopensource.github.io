// Regression guard for the mobile bug where external links did nothing when tapped.
//
// Cause: the theme's delegated click handler called event.preventDefault() then
// window.open(), which mobile browsers block as a popup. The fix lets cross-origin
// links be handled natively, and marks them target="_blank" + a safe rel on load.
//
// NOTE ON METHOD: headless Chromium does not reproduce a real phone's popup blocker, so
// simply asserting "a new tab opened" would pass even with the old code. Instead we
// SIMULATE the mobile condition by disabling window.open, then assert the link still
// opens. With the old code (preventDefault + window.open) nothing would happen and this
// test would fail — which is exactly what we want a regression test to do.

const { test, expect } = require('./fixtures');

const EXTERNAL = 'a[href^="http"]:not([href*="127.0.0.1"]):not([href*="localhost"]):not([href*="womenofopensource.org"])';

test('external links are marked to open in a new tab with a safe rel', async ({ page }) => {
  await page.goto('/application/'); // has a plain Markdown external link (the Google Form)

  const externals = page.locator(EXTERNAL);
  const count = await externals.count();
  expect(count, 'expected at least one external link on the page').toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const link = externals.nth(i);
    await expect(link).toHaveAttribute('target', '_blank');
    const rel = (await link.getAttribute('rel')) || '';
    expect(rel, 'external links need rel=noopener').toContain('noopener');
    expect(rel, 'external links need rel=noreferrer').toContain('noreferrer');
  }
});

test('an external link still opens when the browser blocks window.open (as mobile does)', async ({ page, context }) => {
  // Simulate a mobile browser refusing programmatic popups.
  await page.addInitScript(() => { window.open = () => null; });

  await page.goto('/application/');

  const link = page.locator(EXTERNAL).first();
  await expect(link).toBeVisible();
  const href = await link.getAttribute('href');
  const expectedHost = new URL(href).host;

  // Stub just the link's destination so the new tab resolves instantly and offline.
  const hostPattern = new RegExp(`^https?://${expectedHost.replace(/[.]/g, '\\.')}(/|$)`);
  await context.route(hostPattern, (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>stub</title>ok' })
  );

  const popupPromise = context.waitForEvent('page', { timeout: 7000 });
  await link.click();

  // With the old code the click was swallowed and no page ever opened → this rejects.
  const popup = await popupPromise;
  await popup.waitForLoadState('domcontentloaded').catch(() => {});
  expect(popup.url()).toContain(expectedHost);
  await popup.close();
});
