/**
 * Cowboy sign-in.
 *
 * Cowboys sign in with their existing Pool Scores username and password (the
 * bcrypt hashes are exported into `cowboy_logins`). A successful login sets an
 * HttpOnly cookie holding a short HS256 token, so later requests are verified
 * with a cheap HMAC check instead of bcrypt.
 */
import bcrypt from 'bcryptjs';
import type { Context } from 'hono';
import { Hono } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { sign, verify } from 'hono/jwt';
import { getDataset } from './dataset';

export const SESSION_COOKIE = 'cc_session';
const SESSION_DAYS = 180;

/**
 * A cost-10 hash of a random string nobody knows, checked when the username
 * doesn't exist so that every attempt takes the same time.
 */
const DUMMY_HASH = '$2b$10$UgYey1Ueqv055CyXz4isI.SF5hQ95mdu//haAFiKpETTNZGbZ4DE.';

/** The signed-in cowboy, as returned by the session endpoints. */
export interface Viewer {
  cowboy_id: number;
  user_id: number;
  username: string;
  nickname: string | null;
  first_name: string;
}

interface SessionClaims {
  sub: number; // cowboy_id
  username: string;
  iat: number;
  exp: number;
}

type AuthEnv = { Bindings: Env };

async function toViewer(db: D1Database, cowboy_id: number, username: string): Promise<Viewer | null> {
  const cowboy = (await getDataset(db)).cowboysById.get(cowboy_id);
  if (!cowboy) return null;
  return {
    cowboy_id,
    user_id: cowboy.user_id,
    username,
    nickname: cowboy.nickname,
    first_name: cowboy.first_name,
  };
}

/** The cowboy signed in on this request, or null for the public view. */
export async function getViewer<E extends AuthEnv>(c: Context<E>): Promise<Viewer | null> {
  const token = getCookie(c, SESSION_COOKIE);
  if (!token || !c.env.SESSION_SECRET) return null;
  try {
    const claims = (await verify(token, c.env.SESSION_SECRET, 'HS256')) as unknown as SessionClaims;
    return await toViewer(c.env.DB, claims.sub, claims.username);
  } catch {
    // Expired, tampered with, or signed with an old secret.
    return null;
  }
}

function setSessionCookie(c: Context, token: string) {
  setCookie(c, SESSION_COOKIE, token, {
    path: '/api',
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

const error = (message: string) => ({ error: { message } });

export const auth = new Hono<AuthEnv>();

auth.use('*', async (c, next) => {
  await next();
  c.header('Cache-Control', 'no-store');
});

auth.get('/session', async (c) => c.json({ user: await getViewer(c) }));

auth.post('/login', async (c) => {
  if (!c.req.header('Content-Type')?.startsWith('application/json')) {
    return c.json(error('Expected a JSON body.'), 415);
  }
  const body = await c.req.json<{ username?: unknown; password?: unknown }>().catch(() => null);
  const username = typeof body?.username === 'string' ? body.username.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  if (!username || !password || username.length > 64 || password.length > 256) {
    return c.json(error('Enter your username and password.'), 400);
  }

  const ip = c.req.header('CF-Connecting-IP') ?? 'unknown';
  const [byIp, byUser] = await Promise.all([
    c.env.LOGIN_RATE_LIMITER.limit({ key: `ip:${ip}` }),
    c.env.LOGIN_RATE_LIMITER.limit({ key: `user:${username.toLowerCase()}` }),
  ]);
  if (!byIp.success || !byUser.success) {
    return c.json(error('Too many sign-in attempts. Try again in a minute.'), 429);
  }

  if (!c.env.SESSION_SECRET) {
    console.error(JSON.stringify({ message: 'SESSION_SECRET is not set; sign-in is disabled.' }));
    return c.json(error('Sign-in is unavailable.'), 503);
  }

  const login = await c.env.DB.prepare(
    'SELECT cowboy_id, username, password_hash FROM cowboy_logins WHERE username = ?',
  )
    .bind(username)
    .first<{ cowboy_id: number; username: string; password_hash: string }>();
  const passwordMatches = await bcrypt.compare(password, login?.password_hash ?? DUMMY_HASH);
  const viewer = login && passwordMatches ? await toViewer(c.env.DB, login.cowboy_id, login.username) : null;
  if (!viewer) {
    return c.json(error('Incorrect username or password.'), 401);
  }

  const now = Math.floor(Date.now() / 1000);
  const claims: SessionClaims = {
    sub: viewer.cowboy_id,
    username: viewer.username,
    iat: now,
    exp: now + SESSION_DAYS * 24 * 60 * 60,
  };
  setSessionCookie(c, await sign({ ...claims }, c.env.SESSION_SECRET, 'HS256'));
  return c.json({ user: viewer });
});

auth.post('/logout', (c) => {
  deleteCookie(c, SESSION_COOKIE, { path: '/api', secure: true });
  return c.json({ user: null });
});
