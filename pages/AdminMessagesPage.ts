import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminMessagesPage extends BasePage {
  readonly messageRows: Locator;
  readonly unreadBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.messageRows  = page.locator('div.row.detail');
    this.unreadBadge  = page.locator('.notification');
  }

  async goto() {
    // Try direct navigation (works on Chromium; WebKit may redirect to login)
    await this.page.goto('/admin/message');
    await this.page.waitForLoadState('networkidle');

    // If redirected away (WebKit auth issue), fall back to SPA nav via rooms
    if (!this.page.url().includes('/admin/message')) {
      await this.page.goto('/admin/rooms');
      await this.page.waitForLoadState('networkidle');
      const toggler = this.page.locator('.navbar-toggler');
      if (await toggler.isVisible()) {
        await toggler.click();
      }
      const messagesLink = this.page.getByRole('link', { name: /Messages/ });
      await messagesLink.waitFor({ state: 'visible', timeout: 10_000 });
      await messagesLink.click();
      await this.page.waitForURL('**/admin/message', { timeout: 10_000 });
    }
  }

  async openMessage(subject: string) {
    await this.messageRows.filter({ hasText: subject }).click();
  }

  async getMessageCount() {
    return this.messageRows.count();
  }

  async assertMessageExists(subject: string) {
    await expect(this.messageRows.filter({ hasText: subject })).toBeVisible({ timeout: 10_000 });
  }

  async deleteMessage(subject: string) {
    const row = this.messageRows.filter({ hasText: subject });
    await row.locator('.roomDelete').click();
  }
}
