import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export type RoomType = 'Single' | 'Double' | 'Twin' | 'Family' | 'Suite';

export interface RoomData {
  name: string;
  type: RoomType;
  accessible: boolean;
  price: number;
  features?: {
    wifi?: boolean;
    tv?: boolean;
    radio?: boolean;
    refreshments?: boolean;
    safe?: boolean;
    views?: boolean;
  };
}

export class AdminRoomsPage extends BasePage {
  readonly roomNameInput: Locator;
  readonly roomTypeSelect: Locator;
  readonly accessibleSelect: Locator;
  readonly priceInput: Locator;
  readonly createRoomBtn: Locator;
  readonly roomRows: Locator;

  constructor(page: Page) {
    super(page);
    this.roomNameInput    = page.locator('#roomName');
    this.roomTypeSelect   = page.locator('#type');
    this.accessibleSelect = page.locator('#accessible');
    this.priceInput       = page.locator('#roomPrice');
    this.createRoomBtn    = page.locator('#createRoom');
    this.roomRows         = page.locator('.roomrow');
  }

  async goto() {
    await this.page.goto('/#/admin/rooms');
    await this.page.waitForLoadState('networkidle');
  }

  async createRoom(data: RoomData) {
    await this.roomNameInput.fill(data.name);
    await this.roomTypeSelect.selectOption(data.type);
    await this.accessibleSelect.selectOption(data.accessible ? 'true' : 'false');
    await this.priceInput.fill(String(data.price));

    if (data.features) {
      if (data.features.wifi)        await this.page.locator('#wifiCheckbox').check();
      if (data.features.tv)          await this.page.locator('#tvCheckbox').check();
      if (data.features.radio)       await this.page.locator('#radioCheckbox').check();
      if (data.features.refreshments) await this.page.locator('#refreshCheckbox').check();
      if (data.features.safe)        await this.page.locator('#safeCheckbox').check();
      if (data.features.views)       await this.page.locator('#viewsCheckbox').check();
    }

    await this.createRoomBtn.click();
  }

  async deleteRoom(roomName: string) {
    const row = this.roomRows.filter({ hasText: roomName });
    await row.locator('.roomDelete').click();
  }

  async getRoomCount() {
    return this.roomRows.count();
  }

  async assertRoomExists(roomName: string) {
    await expect(this.roomRows.filter({ hasText: roomName })).toBeVisible();
  }

  async assertRoomNotExists(roomName: string) {
    await expect(this.roomRows.filter({ hasText: roomName })).not.toBeVisible();
  }
}
