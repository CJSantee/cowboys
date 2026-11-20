import { exports } from 'cloudflare:workers';
import { sign } from 'hono/jwt';
import { describe, expect, it } from 'vitest';
import { url } from './fixture';
import type { getCowboys, getPhotos } from '../worker/cowboys';

const BASE = 'https://cowboycounter.test/api';
let nextIp = 1;

/** Each login comes from its own IP so the per-IP rate limit doesn't interfere. */
function login(username: string, password: string, ip = `203.0.113.${nextIp++}`) {
  return exports.default.fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': ip },
    body: JSON.stringify({ username, password }),
  });
}

/** The `name=value` part of the session cookie a response sets. */
function sessionCookie(response: Response) {
  return response.headers.get('Set-Cookie')?.split(';')[0] ?? '';
}

async function get<T>(path: string, cookie?: string) {
  const response = await exports.default.fetch(`${BASE}${path}`, {
    headers: cookie ? { Cookie: cookie } : {},
  });
  return { response, body: (await response.json()) as T };
}

const ALICE = { cowboy_id: 1, user_id: 10, username: 'Alice', nickname: 'alice', first_name: 'Alice' };

describe('POST /api/auth/login', () => {
  it('signs in with the Pool Scores username (any case) and password', async () => {
    const response = await login('alice', 'alice-password');
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ user: ALICE });
    expect(response.headers.get('Cache-Control')).toBe('no-store');

    const cookie = response.headers.get('Set-Cookie') ?? '';
    expect(cookie).toMatch(/^cc_session=[\w-]+\.[\w-]+\.[\w-]+;/);
    expect(cookie).toContain('HttpOnly');
    expect(cookie).toContain('Secure');
    expect(cookie).toContain('SameSite=Lax');
    expect(cookie).toContain('Path=/api');
  });

  it.each([
    ['a wrong password', 'alice', 'wrong-password'],
    ['an unknown username', 'nobody', 'alice-password'],
  ])('rejects %s with the same response', async (_case, username, password) => {
    const response = await login(username, password);
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: { message: 'Incorrect username or password.' } });
    expect(response.headers.get('Set-Cookie')).toBeNull();
  });

  it('requires a JSON body with both fields', async () => {
    const form = await exports.default.fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'username=alice&password=alice-password',
    });
    expect(form.status).toBe(415);
    expect((await login('alice', '')).status).toBe(400);
  });

  it('rate limits repeated attempts on one username', async () => {
    const statuses = [];
    for (let i = 0; i < 11; i++) statuses.push((await login('bobby', 'guess')).status);
    expect(statuses.slice(0, 10)).toEqual(Array(10).fill(401));
    expect(statuses[10]).toBe(429);
    // The limit applies even to the right password until the window passes.
    expect((await login('bobby', 'bob-password')).status).toBe(429);
  });
});

describe('session', () => {
  it('reports the signed-in cowboy', async () => {
    const cookie = sessionCookie(await login('ALICE', 'alice-password'));
    expect((await get('/auth/session', cookie)).body).toEqual({ user: ALICE });
    expect((await get('/auth/session')).body).toEqual({ user: null });
  });

  it('shows the cowboy view to a signed-in cowboy', async () => {
    const cookie = sessionCookie(await login('alice', 'alice-password'));

    const photos = await get<{ photos: ReturnType<typeof getPhotos> }>('/cowboys/photos', cookie);
    expect(photos.body.photos.map((p) => [p.photo_id, p.photo_url])).toEqual([
      [4, url('s4')],
      [2, url('s2')],
      [3, url('s3')],
      [1, url('s1')],
    ]);
    expect(photos.response.headers.get('Cache-Control')).toBe('private, no-store');
    expect(photos.response.headers.get('Vary')).toBe('Cookie');

    const cowboys = await get<{ cowboys: ReturnType<typeof getCowboys> }>('/cowboys', cookie);
    expect(cowboys.body.cowboys.find((c) => c.nickname === 'bob')?.photo_url).toBe(url('s101'));
    expect(cowboys.response.headers.get('Cache-Control')).toBe('private, no-store');

    expect((await get('/cowboys/bob', cookie)).response.status).toBe(200);
  });

  it('ignores a tampered session cookie', async () => {
    const cookie = sessionCookie(await login('alice', 'alice-password'));
    const [header, , signature] = cookie.replace('cc_session=', '').split('.');
    const forgedPayload = btoa(JSON.stringify({ sub: 2, username: 'bobby', iat: 0, exp: 9999999999 }))
      .replace(/=+$/, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
    const forged = `cc_session=${header}.${forgedPayload}.${signature}`;
    expect((await get('/auth/session', forged)).body).toEqual({ user: null });
    expect((await get('/cowboys/bob', forged)).response.status).toBe(404);
  });

  it('ignores an expired session', async () => {
    const now = Math.floor(Date.now() / 1000);
    const token = await sign(
      { sub: 1, username: 'Alice', iat: now - 100, exp: now - 10 },
      'test-session-secret',
      'HS256',
    );
    expect((await get('/auth/session', `cc_session=${token}`)).body).toEqual({ user: null });
  });

  it('signs out by clearing the cookie', async () => {
    const response = await exports.default.fetch(`${BASE}/auth/logout`, { method: 'POST' });
    expect(await response.json()).toEqual({ user: null });
    expect(response.headers.get('Set-Cookie')).toMatch(/^cc_session=;.*Max-Age=0/);
  });
});
