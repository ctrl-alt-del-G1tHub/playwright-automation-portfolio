import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly hotelName: Locator;
  readonly roomCards: Locator;
  readonly contactForm: {
    name: Locator;
    email: Locator;
    phone: Locator;
    subject: Locator;
    description: Locator;
    submitBtn: Locator;
    successMessage: Locator;
  };

  constructor(page: Page) {
    super(page);
    this.hotelName = page.locator('.navbar-brand');
    this.roomCards = page.locator('.room-card');

    this.contactForm = {
      name:           page.locator('#name'),
      email:          page.locator('#email'),
      phone:          page.locator('#phone'),
      subject:        page.locator('#subject'),
      description:    page.locator('#description'),
      submitBtn:      page.getByRole('button', { name: 'Submit' }),
      successMessage: page.getByRole('heading', { name: /Thanks for getting in touch/ }),
    };
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async getRoomCount() {
    return this.roomCards.count();
  }

  async getRoomNames(): Promise<string[]> {
    return this.roomCards.locator('img').evaluateAll(
      (imgs: HTMLImageElement[]) => imgs.map(img => img.alt)
    );
  }

  async submitContactForm(data: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    description: string;
  }) {
    await this.contactForm.name.fill(data.name);
    await this.contactForm.email.fill(data.email);
    await this.contactForm.phone.fill(data.phone);
    await this.contactForm.subject.fill(data.subject);
    await this.contactForm.description.fill(data.description);
    await this.contactForm.submitBtn.click();
  }

  async assertContactSuccess() {
    await expect(this.contactForm.successMessage).toBeVisible({ timeout: 10_000 });
  }

  async scrollToContact() {
    await this.page.locator('#contact').scrollIntoViewIfNeeded();
  }
}
