import { test, expect } from '@playwright/test';
import { AdminLoginPage } from '../../../pages/AdminLoginPage';

test.describe('Admin Login', () => {
  let loginPage: AdminLoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new AdminLoginPage(page);
    await loginPage.goto();
  });

  test('login form is visible', async ({ page }) => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginBtn).toBeVisible();
  });

  test('successful login redirects to admin panel', async ({ page }) => {
    await loginPage.loginAsAdmin();
    await expect(page).toHaveURL(/\/admin/, { timeout: 10_000 });
  });

  test('wrong password shows error', async () => {
    await loginPage.login('admin', 'wrongpassword');
    await loginPage.assertLoginError();
  });

  test('empty credentials shows error', async () => {
    await loginPage.login('', '');
    await loginPage.assertLoginError();
  });

  test('unknown username shows error', async () => {
    await loginPage.login('notauser', 'password');
    await loginPage.assertLoginError();
  });
});
