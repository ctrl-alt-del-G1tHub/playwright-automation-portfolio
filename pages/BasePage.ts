import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async navigate(path = '/') {
    await this.page.goto(path);
  }

  async getTitle() {
    return this.page.title();
  }
}
