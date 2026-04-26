import { test, expect } from '@playwright/test';

const BASE = 'https://automationintesting.online';

test.describe('Auth API', () => {
  test('POST /auth/login returns 200 with valid credentials', async ({ request }) => {
    const res = await request.post(`${BASE}/auth/login`, {
      data: { username: 'admin', password: 'password' },
    });
    expect(res.status()).toBe(200);
    const body = await res.json() as { token: string };
    expect(body).toHaveProperty('token');
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
  });

  test('POST /auth/login returns 403 with wrong password', async ({ request }) => {
    const res = await request.post(`${BASE}/auth/login`, {
      data: { username: 'admin', password: 'wrongpassword' },
    });
    expect(res.status()).toBe(403);
  });

  test('POST /auth/login returns 403 with unknown username', async ({ request }) => {
    const res = await request.post(`${BASE}/auth/login`, {
      data: { username: 'nobody', password: 'password' },
    });
    expect(res.status()).toBe(403);
  });

  test('POST /auth/validate accepts a valid token', async ({ request }) => {
    // First get a token
    const loginRes = await request.post(`${BASE}/auth/login`, {
      data: { username: 'admin', password: 'password' },
    });
    const { token } = await loginRes.json() as { token: string };

    const res = await request.post(`${BASE}/auth/validate`, {
      data: { token },
    });
    expect(res.status()).toBe(200);
  });

  test('POST /auth/validate rejects a garbage token', async ({ request }) => {
    const res = await request.post(`${BASE}/auth/validate`, {
      data: { token: 'not-a-real-token' },
    });
    expect(res.status()).toBe(403);
  });
});
