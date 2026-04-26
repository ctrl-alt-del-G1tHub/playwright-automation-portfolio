import { test, expect } from '../../../fixtures/auth.fixture';
import { singleRoom, suiteRoom } from '../../../test-data/rooms';

test.describe('Admin — Room Management', () => {
  test('rooms list loads with at least one room', async ({ adminRooms }) => {
    const count = await adminRooms.getRoomCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('create a single room and verify it appears', async ({ adminRooms }) => {
    const uniqueName = `101-${Date.now()}`;
    await adminRooms.createRoom({ ...singleRoom, name: uniqueName });
    await adminRooms.assertRoomExists(uniqueName);
  });

  test('create a suite with all features', async ({ adminRooms }) => {
    const uniqueName = `Suite-${Date.now()}`;
    await adminRooms.createRoom({ ...suiteRoom, name: uniqueName });
    await adminRooms.assertRoomExists(uniqueName);
  });

  test('delete a room removes it from the list', async ({ adminRooms }) => {
    const uniqueName = `DeleteMe-${Date.now()}`;
    await adminRooms.createRoom({ ...singleRoom, name: uniqueName });
    await adminRooms.assertRoomExists(uniqueName);

    await adminRooms.deleteRoom(uniqueName);
    await adminRooms.assertRoomNotExists(uniqueName);
  });

  test('creating room without a price shows validation error', async ({ page, adminRooms }) => {
    await adminRooms.roomNameInput.fill('NoPriceRoom');
    await adminRooms.roomTypeSelect.selectOption('Single');
    await adminRooms.accessibleSelect.selectOption('false');
    // intentionally leave price empty
    await adminRooms.createRoomBtn.click();
    await expect(page.locator('.alert-danger')).toBeVisible({ timeout: 5_000 });
  });
});
