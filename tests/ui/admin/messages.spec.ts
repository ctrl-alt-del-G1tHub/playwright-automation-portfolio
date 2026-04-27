import { test, expect } from '../../../fixtures/auth.fixture';
import { HomePage } from '../../../pages/HomePage';
import { validContact } from '../../../test-data/contact';

test.describe('Admin — Message Inbox', () => {
  /**
   * Seeds a contact message via the public form in a fresh (unauthenticated) context,
   * avoiding auth-redirect issues on some browsers.
   */
  async function seedMessage(browser: import('@playwright/test').Browser, subject: string) {
    const ctx = await browser.newContext();
    try {
      const freshPage = await ctx.newPage();
      const home = new HomePage(freshPage);
      await home.goto();
      await home.scrollToContact();
      await home.submitContactForm({ ...validContact, subject });
      await home.assertContactSuccess();
    } finally {
      await ctx.close();
    }
  }

  test('admin inbox is visible and shows messages', async ({ adminMessages }) => {
    await expect(adminMessages.messageRows.first()).toBeVisible({ timeout: 10_000 });
  });

  test('message submitted via contact form appears in admin inbox', async ({ browser, adminMessages }) => {
    const uniqueSubject = `Portfolio test ${Date.now()}`;
    await seedMessage(browser, uniqueSubject);

    await adminMessages.goto();
    await adminMessages.assertMessageExists(uniqueSubject);
  });

  test('clicking a message opens its detail view', async ({ page, adminMessages }) => {
    // Use whichever message is already in the inbox
    const firstMessage = adminMessages.messageRows.first();
    await firstMessage.click();
    await expect(page.getByRole('button', { name: 'Close' })).toBeVisible({ timeout: 5_000 });
  });
});
