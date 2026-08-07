// The speakers directory search + filters have regressed more than once. These tests
// drive them the way a user would and assert the promised outcomes. They are written to
// be content-independent (they read the real speaker data on the page rather than
// hard-coding names or counts), so they keep working as speakers are added or removed.

const { test, expect } = require('./fixtures');
const { expectCountMatchesVisible, waitForReady } = require('./helpers');

test.beforeEach(async ({ page }) => {
  await page.goto('/speakers/');
  await waitForReady(page);
  await expect(page.locator('.speaker-card').first()).toBeVisible();
});

test('lists speakers and the "Showing N" count matches what is on screen', async ({ page }) => {
  const total = await page.locator('.speaker-card').count();
  expect(total).toBeGreaterThan(0);
  const shown = await expectCountMatchesVisible(page);
  expect(shown).toBe(total);
});

test('search narrows the list and shows an empty state for no matches', async ({ page }) => {
  const total = await page.locator('.speaker-card').count();

  // No match → zero cards + the empty-state message.
  await page.fill('#speaker-search', 'zzzz-definitely-no-such-match');
  await expect(page.locator('#no-results')).toBeVisible();
  await expect(page.locator('.speaker-card:visible')).toHaveCount(0);
  await expectCountMatchesVisible(page);

  // Clearing the box brings everyone back.
  await page.fill('#speaker-search', '');
  await expect(page.locator('.speaker-card:visible')).toHaveCount(total);
  await expect(page.locator('#no-results')).toBeHidden();
});

test('search matches a real speaker by name', async ({ page }) => {
  const name = await page.locator('.speaker-card').first().getAttribute('data-name');
  expect(name && name.length, 'first card should expose a data-name').toBeTruthy();

  await page.fill('#speaker-search', name);

  await expect(page.locator(`.speaker-card[data-name="${name}"]`)).toBeVisible();
  await expect(page.locator('#no-results')).toBeHidden();
  const shown = await expectCountMatchesVisible(page);
  expect(shown).toBeGreaterThanOrEqual(1);
});

test('the expertise dropdown filters to speakers with that expertise', async ({ page }) => {
  // Opening the combobox reveals the dropdown.
  await page.locator('#expertise-search').click();
  await expect(page.locator('#expertise-dropdown')).toHaveClass(/active/);

  const tags = page.locator('#expertise-tags .filter-tag');
  const tagCount = await tags.count();
  expect(tagCount, 'expected expertise filter options to exist').toBeGreaterThan(0);

  const value = await tags.first().getAttribute('data-value');
  await tags.first().click();

  // The combobox reflects one active selection.
  await expect(page.locator('#expertise-search')).toHaveValue('1 selected');

  // Every visible card must actually carry the chosen expertise value.
  const shown = await expectCountMatchesVisible(page);
  expect(shown).toBeGreaterThan(0);
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const visibleCards = page.locator('.speaker-card:visible');
  for (let i = 0; i < shown; i++) {
    await expect(visibleCards.nth(i)).toHaveAttribute('data-expertise', new RegExp(escaped));
  }
});

test('"Clear Filters" resets the search box and selections', async ({ page }) => {
  const total = await page.locator('.speaker-card').count();

  await page.fill('#speaker-search', 'a');
  await page.locator('#expertise-search').click();
  await page.locator('#expertise-tags .filter-tag').first().click();
  await expect(page.locator('#expertise-search')).toHaveValue('1 selected');

  // Dismiss the (still-open, multi-select) dropdown by clicking outside it — this also
  // exercises the click-away-to-close behaviour, and on mobile the open panel would
  // otherwise overlay the Clear Filters button.
  await page.locator('h1').click();
  await expect(page.locator('#expertise-dropdown')).not.toHaveClass(/active/);

  await page.locator('#reset-filters').click();

  await expect(page.locator('#speaker-search')).toHaveValue('');
  await expect(page.locator('#expertise-search')).toHaveValue('');
  await expect(page.locator('.speaker-card:visible')).toHaveCount(total);
  await expect(page.locator('#no-results')).toBeHidden();
});
