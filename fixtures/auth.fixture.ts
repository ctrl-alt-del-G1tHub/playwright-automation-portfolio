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
    await page.waitForURL('**/#/admin/rooms', { timeout: 10_000 });
    await use(new AdminRoomsPage(page));
  },

  /** Admin messages page — already authenticated */
  adminMessages: async ({ page }, use) => {
    const loginPage = new AdminLoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsAdmin();
    await page.waitForURL('**/#/admin/rooms', { timeout: 10_000 });
    await page.goto('/#/admin/messages');
    await page.waitForLoadState('networkidle');
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
