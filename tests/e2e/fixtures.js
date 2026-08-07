// Shared test fixture used by the "our own behaviour" specs.
//
// It keeps tests deterministic and off the wider internet by allowing only what the site
// genuinely needs at runtime and blocking the rest:
//   - allowed: same-origin requests, and jQuery from Google's CDN (the theme is entirely
//     non-functional without jQuery — no jQuery means the loading overlay never clears);
//   - blocked: hCaptcha, Font Awesome and web fonts — none affect the behaviour under
//     test, and the hCaptcha widget is domain-locked to production anyway.
//
// The external-links spec does NOT use this fixture (it manages its own routing).

const base = require('@playwright/test');

function isAllowed(url) {
  return (
    url.startsWith('http://127.0.0.1') ||
    url.startsWith('http://localhost') ||
    url.startsWith('data:') ||
    url.startsWith('blob:') ||
    url.includes('ajax.googleapis.com') // jQuery — required for the theme to run
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
