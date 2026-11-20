import { env } from 'cloudflare:workers';
import { beforeAll, describe, expect, it } from 'vitest';
import { Dataset, loadTables } from '../worker/dataset';
import { getCowboy, getCowboys, getPhotos, getWrapped, monDD } from '../worker/cowboys';
import { url } from './fixture';

// Unit tests of the response builders; test/auth.test.ts covers the cowboy view over HTTP.
let data: Dataset;
beforeAll(async () => {
  data = new Dataset(await loadTables(env.DB));
});

describe('cowboy view', () => {
  it('shows every photo unblurred', () => {
    expect(getPhotos(data, false).map((p) => [p.photo_id, p.photo_url])).toEqual([
      [4, url('s4')],
      [2, url('s2')],
      [3, url('s3')],
      [1, url('s1')],
    ]);
  });

  it('shows private profile photos', () => {
    expect(getCowboys(data, false).find((c) => c.nickname === 'bob')?.photo_url).toBe(url('s101'));
  });

  it('shows a private cowboy’s page with all their photos', () => {
    const bob = getCowboy(data, 'bob', false);
    expect(bob?.photos.map((p) => p.photo_id)).toEqual([2, 3]);
    expect(bob?.points).toBe(2);
  });

  it('unblurs Wrapped photos', () => {
    expect(getWrapped(data, false).drinks?.[0].photo_url).toBe(url('s2'));
  });
});

describe('Wrapped heatmap', () => {
  it('stops at today while the season is in progress', () => {
    const { score_days } = getWrapped(data, true, new Date('2025-01-14T18:00:00Z'));
    expect(score_days.map((d) => d.score_date)).toEqual(['2025-01-12', '2025-01-13', '2025-01-14']);
  });
});

describe('monDD', () => {
  it('formats like Postgres TO_CHAR(date, ‘Mon DD’)', () => {
    expect(monDD('2025-01-05')).toBe('Jan 05');
    expect(monDD('2025-12-31')).toBe('Dec 31');
  });
});
