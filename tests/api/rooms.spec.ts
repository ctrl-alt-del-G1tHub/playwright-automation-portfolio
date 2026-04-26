import { test, expect } from '@playwright/test';
import { getAuthToken, createRoom, deleteRoom } from '../../utils/api-helpers';

const BASE = 'https://automationintesting.online';

test.describe('Rooms API', () => {
  let token: string;
  const createdRoomIds: number[] = [];

  test.beforeAll(async ({ request }) => {
    token = await getAuthToken(request);
  });

  test.afterAll(async ({ request }) => {
    for (const id of createdRoomIds) {
      await deleteRoom(request, token, id).catch(() => undefined);
    }
  });

  test('GET /room/ returns 200 with a list of rooms', async ({ request }) => {
    const res = await request.get(`${BASE}/room/`);
    expect(res.status()).toBe(200);
    const body = await res.json() as { rooms: unknown[] };
    expect(body).toHaveProperty('rooms');
    expect(Array.isArray(body.rooms)).toBe(true);
    expect(body.rooms.length).toBeGreaterThanOrEqual(1);
  });

  test('GET /room/:id returns a single room', async ({ request }) => {
    // Get the list first to find a valid ID
    const listRes = await request.get(`${BASE}/room/`);
    const { rooms } = await listRes.json() as { rooms: Array<{ roomid: number }> };
    const roomId = rooms[0].roomid;

    const res = await request.get(`${BASE}/room/${roomId}`);
    expect(res.status()).toBe(200);
    const room = await res.json() as { roomid: number; roomName: string };
    expect(room.roomid).toBe(roomId);
    expect(room).toHaveProperty('roomName');
  });

  test('POST /room/ creates a new room (auth required)', async ({ request }) => {
    const payload = {
      roomName: `API-${Date.now()}`,
      type: 'Double',
      accessible: false,
      roomPrice: 120,
      features: ['WiFi', 'TV'],
      description: 'Created by Playwright API test',
      image: 'https://www.mwtestconsultancy.co.uk/img/room1.jpg',
    };

    const room = await createRoom(request, token, payload);
    createdRoomIds.push(room.roomid);

    expect(room).toHaveProperty('roomid');
    expect(room.roomName).toBe(payload.roomName);
  });

  test('POST /room/ without auth returns 403', async ({ request }) => {
    const res = await request.post(`${BASE}/room/`, {
      data: { roomName: 'Unauthorized', type: 'Single', accessible: false, roomPrice: 50 },
    });
    expect(res.status()).toBe(403);
  });

  test('DELETE /room/:id removes the room', async ({ request }) => {
    const room = await createRoom(request, token, {
      roomName: `Del-${Date.now()}`,
      type: 'Single',
      accessible: false,
      roomPrice: 60,
      image: 'https://www.mwtestconsultancy.co.uk/img/room1.jpg',
    });

    const deleteRes = await request.delete(`${BASE}/room/${room.roomid}`, {
      headers: { Cookie: `token=${token}` },
    });
    expect(deleteRes.status()).toBe(202);

    const getRes = await request.get(`${BASE}/room/${room.roomid}`);
    expect(getRes.status()).toBe(404);
  });

  test('room response schema has required fields', async ({ request }) => {
    const listRes = await request.get(`${BASE}/room/`);
    const { rooms } = await listRes.json() as { rooms: Array<Record<string, unknown>> };
    const room = rooms[0];

    const requiredFields = ['roomid', 'roomName', 'type', 'accessible', 'roomPrice'];
    for (const field of requiredFields) {
      expect(room).toHaveProperty(field);
    }
  });
});
