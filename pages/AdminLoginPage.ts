import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminLoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginBtn: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginBtn      = page.locator('#doLogin');
    this.errorMessage  = page.locator('.alert-danger');
  }

  async goto() {
    await this.page.goto('/admin');
    await this.page.waitForLoadState('networkidle');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginBtn.click();
  }

  async loginAsAdmin() {
    await this.login('admin', 'password');
  }

  async assertLoginError() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5_000 });
  }
}
