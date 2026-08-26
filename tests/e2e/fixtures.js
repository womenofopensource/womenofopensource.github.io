// Shared test fixture used by all specs.
//
// It keeps tests deterministic and off the wider internet by allowing only what the site
// genuinely needs at runtime and blocking the rest:
//   - allowed: same-origin requests, and jQuery from Google's CDN (the theme is entirely
//     non-functional without jQuery — no jQuery means the loading overlay never clears);
//   - blocked: hCaptcha, Font Awesome and web fonts — none affect the behaviour under
//     test, and the hCaptcha widget is domain-locked to production anyway.
//
// The external-links spec uses this fixture too (it needs jQuery to load) and layers on its
// own route for the one off-site link it clicks, so that navigation resolves offline.

const base = require('@playwright/test');

function isAllowed(url) {
  if (url.startsWith('data:') || url.startsWith('blob:')) return true;
  let hostname;
  try {
    hostname = new URL(url).hostname;
  } catch {
    return false;
  }
  // Match on the exact hostname (not a substring), so lookalikes such as
  // ajax.googleapis.com.evil.com are not allowed through.
  return (
    hostname === '127.0.0.1' ||
    hostname === 'localhost' ||
    hostname === 'ajax.googleapis.com' // jQuery — required for the theme to run
  );
}

const test = base.test.extend({
  blockThirdParty: [
    async ({ context }, use) => {
      await context.route('**/*', (route) =>
        isAllowed(route.request().url()) ? route.continue() : route.abort()
      );
      await use();
    },
    { auto: true },
  ],
});

module.exports = { test, expect: base.expect };
