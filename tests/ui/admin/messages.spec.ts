import { test, expect } from '../../../fixtures/auth.fixture';
import { HomePage } from '../../../pages/HomePage';
import { validContact } from '../../../test-data/contact';

test.describe('Admin — Message Inbox', () => {
  /**
   * Seeds a contact message via the public form before checking the inbox.
   */
  async function seedMessage(page: import('@playwright/test').Page, subject: string) {
    const home = new HomePage(page);
    await home.goto();
    await home.scrollToContact();
    await home.submitContactForm({ ...validContact, subject });
    await home.assertContactSuccess();
  }

  test('admin inbox is visible and shows messages', async ({ adminMessages }) => {
    await expect(adminMessages.messageRows.first()).toBeVisible({ timeout: 10_000 });
  });

  test('message submitted via contact form appears in admin inbox', async ({ page, adminMessages }) => {
    const uniqueSubject = `Portfolio test ${Date.now()}`;
    await seedMessage(page, uniqueSubject);

    await adminMessages.goto();
    await adminMessages.assertMessageExists(uniqueSubject);
  });

  test('clicking a message opens its detail view', async ({ page, adminMessages }) => {
    // Use whichever message is already in the inbox
    const firstMessage = adminMessages.messageRows.first();
    await firstMessage.click();
    await expect(page.locator('.modal, .message-detail')).toBeVisible({ timeout: 5_000 });
  });
});
