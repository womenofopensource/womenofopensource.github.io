// Playwright end-to-end tests for the Women of Open Source site.
//
// Tests run against the built static site (docs/_site) served locally, and exercise
// real user journeys across three layouts — desktop, tablet and mobile — because
// several past regressions were layout-specific (mobile menu, external links that
// only broke on mobile, the speakers search/filter widget).
//
// Build the site first (`cd docs && bundle exec jekyll build`); the webServer below
// then serves docs/_site. In CI the built site is downloaded from the build job.

const { defineConfig, devices } = require('@playwright/test');

const PORT = 4000;
const baseURL = `http://127.0.0.1:${PORT}`;

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: { timeout: 7_000 },
  fullyParallel: true,
  // Fail the build if a test.only was committed by mistake.
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }], ['list']]
    : [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
  },

  // The same specs run against each layout. Tests that are layout-specific
  // (e.g. the hamburger menu) adapt at runtime based on what is actually visible.
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 900 } },
    },
    {
      name: 'tablet',
      use: { ...devices['Desktop Chrome'], viewport: { width: 820, height: 1180 }, hasTouch: true },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'] },
    },
  ],

  webServer: {
    command: `npx http-server docs/_site -p ${PORT} -a 127.0.0.1 -c-1 --silent`,
    url: baseURL,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
