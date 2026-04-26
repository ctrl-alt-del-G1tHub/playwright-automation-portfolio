import { test, expect } from '@playwright/test';
import { getAuthToken, createRoom, deleteRoom, createBooking, deleteBooking } from '../../utils/api-helpers';

const BASE = 'https://automationintesting.online';

test.describe('Bookings API', () => {
  let token: string;
  let testRoomId: number;
  const createdBookingIds: number[] = [];

  test.beforeAll(async ({ request }) => {
    token = await getAuthToken(request);

    // Create a dedicated room for booking tests
    const room = await createRoom(request, token, {
      roomName: `BookingTestRoom-${Date.now()}`,
      type: 'Double',
      accessible: false,
      roomPrice: 100,
      image: 'https://www.mwtestconsultancy.co.uk/img/room1.jpg',
    });
    testRoomId = room.roomid;
  });

  test.afterAll(async ({ request }) => {
    for (const id of createdBookingIds) {
      await deleteBooking(request, token, id).catch(() => undefined);
    }
    await deleteRoom(request, token, testRoomId).catch(() => undefined);
  });

  test('GET /booking/ returns a list of bookings', async ({ request }) => {
    const res = await request.get(`${BASE}/booking/`, {
      headers: { Cookie: `token=${token}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json() as { bookings: unknown[] };
    expect(body).toHaveProperty('bookings');
    expect(Array.isArray(body.bookings)).toBe(true);
  });

  test('POST /booking/ creates a booking for a valid room', async ({ request }) => {
    const payload = {
      roomid: testRoomId,
      firstname: 'Alice',
      lastname:  'Playwright',
      depositpaid: false,
      bookingdates: {
        checkin:  '2025-12-01',
        checkout: '2025-12-05',
      },
      email: 'alice@example.com',
      phone: '07700900456',
    };

    const booking = await createBooking(request, payload);
    createdBookingIds.push(booking.bookingid);

    expect(booking).toHaveProperty('bookingid');
    expect(booking.booking).toMatchObject({
      firstname: 'Alice',
      lastname: 'Playwright',
    });
  });

  test('POST /booking/ rejects overlapping dates for same room', async ({ request }) => {
    const payload = {
      roomid: testRoomId,
      firstname: 'Bob',
      lastname:  'Tester',
      depositpaid: false,
      bookingdates: { checkin: '2025-12-01', checkout: '2025-12-05' },
      email: 'bob@example.com',
      phone: '07700900789',
    };

    // First booking
    const first = await createBooking(request, payload);
    createdBookingIds.push(first.bookingid);

    // Overlapping second booking
    const res = await request.post(`${BASE}/booking/`, { data: payload });
    expect(res.status()).toBe(409);
  });

  test('booking response schema has required fields', async ({ request }) => {
    const payload = {
      roomid: testRoomId,
      firstname: 'Charlie',
      lastname:  'Schema',
      depositpaid: true,
      bookingdates: { checkin: '2025-11-10', checkout: '2025-11-12' },
      email: 'charlie@example.com',
      phone: '07700900001',
    };

    const booking = await createBooking(request, payload);
    createdBookingIds.push(booking.bookingid);

    expect(booking).toHaveProperty('bookingid');
    expect(booking).toHaveProperty('booking');
    const b = booking.booking as Record<string, unknown>;
    for (const field of ['roomid', 'firstname', 'lastname', 'depositpaid', 'bookingdates']) {
      expect(b).toHaveProperty(field);
    }
  });

  test('DELETE /booking/:id removes the booking', async ({ request }) => {
    const payload = {
      roomid: testRoomId,
      firstname: 'Delete',
      lastname:  'Me',
      depositpaid: false,
      bookingdates: { checkin: '2025-10-01', checkout: '2025-10-03' },
      email: 'delete@example.com',
      phone: '07700900002',
    };

    const booking = await createBooking(request, payload);

    const deleteRes = await request.delete(`${BASE}/booking/${booking.bookingid}`, {
      headers: { Cookie: `token=${token}` },
    });
    expect(deleteRes.status()).toBe(202);
  });
});
