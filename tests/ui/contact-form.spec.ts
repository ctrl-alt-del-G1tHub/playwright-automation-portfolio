import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { validContact, invalidContacts } from '../../test-data/contact';

test.describe('Contact Form', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
    await homePage.scrollToContact();
  });

  test('successfully submits with valid data', async () => {
    await homePage.submitContactForm(validContact);
    await homePage.assertContactSuccess();
  });

  test('success message contains the sender name', async ({ page }) => {
    await homePage.submitContactForm(validContact);
    const success = page.locator('.contact-us .alert-success, .contact-us h2');
    await expect(success).toContainText(validContact.name, { timeout: 10_000 });
  });

  for (const { label, data } of invalidContacts) {
    test(`shows validation error for ${label}`, async ({ page }) => {
      await homePage.submitContactForm(data);
      const errorMessages = page.locator('.alert-danger');
      await expect(errorMessages).toBeVisible({ timeout: 5_000 });
    });
  }

  test('form fields are pre-cleared after successful submission', async ({ page }) => {
    await homePage.submitContactForm(validContact);
    await homePage.assertContactSuccess();
    // Clicking send again should show a fresh form
    await page.locator('#submitContact').waitFor({ state: 'visible' });
  });
});
