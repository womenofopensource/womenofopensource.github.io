// The contact page must present a usable form with its fields and the hCaptcha
// container. We don't drive a real hCaptcha submission here — the widget is domain-locked
// to production and loads from a third party — so this checks the structure the user
// interacts with, on every layout. (The full end-to-end submission has been verified
// manually against Formspree.)

const { test, expect } = require('./fixtures');

test('contact page shows a complete form with the captcha container', async ({ page }) => {
  await page.goto('/contact/');

  const form = page.locator('#contact-form');
  await expect(form).toBeVisible();

  await expect(page.locator('#contact-name')).toBeVisible();
  await expect(page.locator('#contact-email')).toBeVisible();
  await expect(page.locator('#contact-message')).toBeVisible();

  // Required fields are actually marked required.
  await expect(page.locator('#contact-email')).toHaveAttribute('required', '');
  await expect(page.locator('#contact-message')).toHaveAttribute('required', '');

  // The hCaptcha mount point exists (whether or not the third-party script loads).
  await expect(page.locator('.h-captcha')).toHaveCount(1);

  await expect(page.locator('#contact-form input[type="submit"]')).toBeVisible();
});
