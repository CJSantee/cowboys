import { env } from 'cloudflare:workers';
import { expect, it } from 'vitest';
import { getDataset } from '../worker/dataset';
import { FIXTURE_SQL } from './fixture';

const TABLES = [
  'cowboy_charter_assents',
  'cowboy_charter_versions',
  'cowboy_photos',
  'cowboy_logins',
  'cowboys',
  'alt_photos',
  'photos',
];

it('does not cache an archive that has not been imported yet', async () => {
  await env.DB.batch(TABLES.map((table) => env.DB.prepare(`DELETE FROM ${table}`)));
  expect((await getDataset(env.DB)).cowboys).toHaveLength(0);

  await env.DB.batch(FIXTURE_SQL.map((sql) => env.DB.prepare(sql)));
  expect((await getDataset(env.DB)).cowboys).toHaveLength(3);
});

it('caches an imported archive', async () => {
  const first = await getDataset(env.DB);
  expect(await getDataset(env.DB)).toBe(first);
});
