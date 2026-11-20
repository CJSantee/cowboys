import { exports } from 'cloudflare:workers';
import { describe, expect, it } from 'vitest';
import { url } from './fixture';
import type { getPhotos, getWrapped } from '../worker/cowboys';

async function get<T = Record<string, unknown>>(path: string) {
  const response = await exports.default.fetch(`https://cowboycounter.test/api${path}`);
  return { response, body: (await response.json()) as T };
}

describe('GET /api/cowboys', () => {
  it('lists cowboys with photos by points, blurring private profile photos', async () => {
    const { response, body } = await get('/cowboys');
    expect(response.status).toBe(200);
    expect(body.cowboys).toEqual([
      {
        cowboy_id: 1,
        user_id: 10,
        first_name: 'Alice',
        last_name: 'Anders',
        nickname: 'alice',
        photo_url: url('s100'),
        is_public: true,
        num_photos: 3,
        points: 5,
      },
      {
        cowboy_id: 2,
        user_id: 20,
        first_name: 'Bob',
        last_name: 'Brown',
        nickname: 'bob',
        photo_url: url('b101'),
        is_public: false,
        num_photos: 2,
        points: 2,
      },
    ]);
  });

  it('is publicly cacheable', async () => {
    const { response } = await get('/cowboys');
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600');
    expect(response.headers.get('Vary')).toBe('Cookie');
  });
});

describe('GET /api/cowboys/photos', () => {
  it('blurs private photos and hides private photos without a blurred version', async () => {
    const { body } = await get<{ photos: ReturnType<typeof getPhotos> }>('/cowboys/photos');
    expect(body.photos.map((p) => [p.photo_id, p.photo_url, p.is_public])).toEqual([
      [4, url('b4'), false], // cowboys-only
      [2, url('b2'), false], // includes private bob
      [1, url('s1'), true],
    ]);
    expect(body.photos[1]).toEqual({
      photo_id: 2,
      photo_url: url('b2'),
      cowboys: [
        { cowboy_id: 1, nickname: 'alice', points: 1 },
        { cowboy_id: 2, nickname: 'bob', points: 1 },
      ],
      score_date: '2025-02-03',
      is_public: false,
    });
  });
});

describe('GET /api/cowboys/:identifier', () => {
  it('finds a cowboy by nickname or id with only their public photos', async () => {
    const byNickname = await get('/cowboys/alice');
    const byId = await get('/cowboys/1');
    expect(byId.body).toEqual(byNickname.body);
    expect(byNickname.body.cowboy).toEqual({
      cowboy_id: 1,
      first_name: 'Alice',
      last_name: 'Anders',
      nickname: 'alice',
      points: 5, // still counts private photos
      is_public: true,
      photos: [
        {
          photo_id: 1,
          photo_url: url('p1'),
          score_date: '2025-02-01',
          points: 1,
          alt_photos: [{ alt_photo_id: 1, url: url('s1'), metadata: { quality: 25 } }],
        },
      ],
    });
  });

  it.each(['bob', 'cara', 'nobody', '999'])('returns 404 for %s', async (identifier) => {
    const { response, body } = await get(`/cowboys/${identifier}`);
    expect(response.status).toBe(404);
    expect(body).toEqual({ error: { message: 'Cowboy not found.' } });
  });
});

describe('GET /api/cowboys/leaderboard', () => {
  it('returns points and running totals from each cowboy’s first scored date', async () => {
    const { body } = await get('/cowboys/leaderboard');
    expect(body.leaderboard).toEqual([
      { cowboy_id: 1, nickname: 'alice', points: 5 },
      { cowboy_id: 2, nickname: 'bob', points: 2 },
    ]);
    expect(body.timeline).toEqual([
      {
        cowboy_id: 1,
        nickname: 'alice',
        points: [
          { score_date: 'Feb 01', total_points: 1 },
          { score_date: 'Feb 02', total_points: 1 },
          { score_date: 'Feb 03', total_points: 2 },
          { score_date: 'Feb 05', total_points: 5 },
        ],
      },
      {
        cowboy_id: 2,
        nickname: 'bob',
        points: [
          { score_date: 'Feb 02', total_points: 1 },
          { score_date: 'Feb 03', total_points: 2 },
          { score_date: 'Feb 05', total_points: 2 },
        ],
      },
    ]);
  });
});

describe('GET /api/cowboys/charter', () => {
  it('returns the latest charter version and its signers', async () => {
    const { body } = await get('/cowboys/charter');
    expect(body.charter).toEqual({
      cowboy_charter_version_id: 2,
      cowboys: [{ cowboy_id: 1, user_id: 10, name: 'Alice Anders' }],
    });
  });
});

describe('GET /api/cowboys/wrapped', () => {
  it('groups tagged photos and builds the season heatmap', async () => {
    const { body } = await get<{ wrapped: ReturnType<typeof getWrapped> }>('/cowboys/wrapped');
    const { horses, drinks, llywd, score_days, states } = body.wrapped;
    expect(horses).toEqual([
      { photo_url: url('s1'), score_date: '2025-02-01', cowboys: [{ cowboy_id: 1, nickname: 'alice' }] },
    ]);
    expect(drinks).toEqual([
      {
        photo_url: url('b2'),
        score_date: '2025-02-03',
        cowboys: [
          { cowboy_id: 1, nickname: 'alice' },
          { cowboy_id: 2, nickname: 'bob' },
        ],
      },
    ]);
    expect(llywd).toEqual({
      bull: [{ photo_url: url('b4'), score_date: '2025-02-05', cowboys: [{ cowboy_id: 1, nickname: 'alice' }] }],
    });
    // 2025-01-12 (a Sunday) through 2026-01-12, inclusive.
    expect(score_days).toHaveLength(366);
    expect(score_days[0]).toEqual({ score_date: '2025-01-12', num_cowboys: 0, week: 'Jan 12 - Jan 18' });
    expect(score_days.find((d) => d.score_date === '2025-02-03')).toEqual({
      score_date: '2025-02-03',
      num_cowboys: 2,
      week: 'Feb 02 - Feb 08',
    });
    expect(states).toHaveLength(11);
  });
});

describe('unknown routes', () => {
  it('returns a JSON 404', async () => {
    const { response, body } = await get('/nope');
    expect(response.status).toBe(404);
    expect(body).toEqual({ error: { message: 'Not found.' } });
  });
});
