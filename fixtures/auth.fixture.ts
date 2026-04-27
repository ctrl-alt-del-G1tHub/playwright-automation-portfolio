import { test as base, request } from '@playwright/test';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { AdminRoomsPage } from '../pages/AdminRoomsPage';
import { AdminMessagesPage } from '../pages/AdminMessagesPage';

/** Extends the base test with pre-logged-in admin fixtures. */
export const test = base.extend<{
  adminLogin: AdminLoginPage;
  adminRooms: AdminRoomsPage;
  adminMessages: AdminMessagesPage;
  authToken: string;
}>({
  /** Page object for the admin login screen */
  adminLogin: async ({ page }, use) => {
    await use(new AdminLoginPage(page));
  },

  /** Admin rooms page — already authenticated */
  adminRooms: async ({ page }, use) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsAdmin();
    await page.waitForURL('**/admin/rooms', { timeout: 10_000 });
    await page.locator('div.row').filter({ has: page.locator('.roomDelete') }).first().waitFor({ state: 'visible', timeout: 15_000 });
    await use(new AdminRoomsPage(page));
  },

  /** Admin messages page — already authenticated */
  adminMessages: async ({ page, browserName }, use) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsAdmin();
    await page.waitForURL('**/admin/rooms', { timeout: 10_000 });

    if (browserName === 'webkit') {
      // WebKit loses auth state on direct SPA navigation; use nav link click instead
      const toggler = page.locator('.navbar-toggler');
      if (await toggler.isVisible()) {
        await toggler.click();
      }
      const messagesLink = page.getByRole('link', { name: /Messages/ });
      await messagesLink.waitFor({ state: 'visible', timeout: 10_000 });
      await messagesLink.click();
    } else {
      // Chromium (desktop + mobile) handles direct SPA navigation fine
      await page.goto('/admin/message');
    }

    await page.waitForURL('**/admin/message', { timeout: 10_000 });
    await use(new AdminMessagesPage(page));
  },

  /** Raw auth token for use in API tests */
  authToken: async ({}, use) => {
    const ctx = await request.newContext({ baseURL: 'https://automationintesting.online' });
    const response = await ctx.post('/auth/login', {
      data: { username: 'admin', password: 'password' },
    });
    const body = await response.json() as { token: string };
    await ctx.dispose();
    await use(body.token);
  },
});

export { expect } from '@playwright/test';
