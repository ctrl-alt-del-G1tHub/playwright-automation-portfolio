import { APIRequestContext } from '@playwright/test';

const BASE = 'https://automationintesting.online';

export async function getAuthToken(request: APIRequestContext): Promise<string> {
  const res = await request.post(`${BASE}/auth/login`, {
    data: { username: 'admin', password: 'password' },
  });
  const body = await res.json() as { token: string };
  return body.token;
}

export async function createRoom(
  request: APIRequestContext,
  token: string,
  data: object
): Promise<{ roomid: number } & Record<string, unknown>> {
  const res = await request.post(`${BASE}/room/`, {
    data,
    headers: { Cookie: `token=${token}` },
  });
  return res.json();
}

export async function deleteRoom(
  request: APIRequestContext,
  token: string,
  roomId: number
): Promise<void> {
  await request.delete(`${BASE}/room/${roomId}`, {
    headers: { Cookie: `token=${token}` },
  });
}

export async function createBooking(
  request: APIRequestContext,
  data: object
): Promise<{ bookingid: number } & Record<string, unknown>> {
  const res = await request.post(`${BASE}/booking/`, { data });
  return res.json();
}

export async function deleteBooking(
  request: APIRequestContext,
  token: string,
  bookingId: number
): Promise<void> {
  await request.delete(`${BASE}/booking/${bookingId}`, {
    headers: { Cookie: `token=${token}` },
  });
}
