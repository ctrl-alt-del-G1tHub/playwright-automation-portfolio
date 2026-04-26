import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe('Homepage', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('has correct page title', async () => {
    const title = await homePage.getTitle();
    expect(title).toContain('Restful Booker');
  });

  test('displays hotel name', async () => {
    await expect(homePage.hotelName).toBeVisible();
  });

  test('lists at least one room', async () => {
    const count = await homePage.getRoomCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('each room card has a book button', async ({ page }) => {
    const bookButtons = page.locator('.openBooking');
    const count = await bookButtons.count();
    expect(count).toBeGreaterThanOrEqual(1);
    for (let i = 0; i < count; i++) {
      await expect(bookButtons.nth(i)).toBeVisible();
    }
  });

  test('contact section is present', async ({ page }) => {
    await homePage.scrollToContact();
    await expect(page.locator('#contact')).toBeVisible();
  });
});
