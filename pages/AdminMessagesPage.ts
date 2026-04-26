import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminMessagesPage extends BasePage {
  readonly messageRows: Locator;
  readonly unreadBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.messageRows  = page.locator('.message');
    this.unreadBadge  = page.locator('.notification');
  }

  async goto() {
    await this.page.goto('/#/admin/messages');
    await this.page.waitForLoadState('networkidle');
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
    await row.locator('.fa-times').click();
  }
}
