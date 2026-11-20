/**
 * Compares the Worker's responses with the original Pool Scores API.
 *
 * 1. In pool-scores (apps/api), export the seed and the golden responses:
 *      npm run db:export-cowboys -- <seed.sql> --golden <dir>
 * 2. Load the seed into the local D1:
 *      npm run db:migrate:local
 *      npx wrangler d1 execute cowboy-counter --local --file=<seed.sql>
 * 3. Run: npm run parity -- <dir>
 *
 * Both views are checked: `public` (logged out) and `cowboy` (logged in), so the
 * cowboy view is verified even while the Worker serves everyone the public view.
 *
 * Differences that don't change behaviour are ignored: numbers Postgres returned as
 * strings (COUNT/SUM), JSON key order, the order of lists Postgres never guaranteed,
 * and null or duplicate alt_photos entries produced by the original LEFT JOINs.
 */
import fs from 'node:fs';
import path from 'node:path';
import { getPlatformProxy } from 'wrangler';
import { Dataset, loadTables } from '../worker/dataset';
import {
  LLYWD_ACTIVITIES,
  getCharter,
  getCowboy,
  getCowboys,
  getLeaderboard,
  getPhotos,
  getTimeline,
  getWrapped,
} from '../worker/cowboys';

interface GoldenResponse {
  path: string;
  view: 'public' | 'cowboy' | 'any';
  body: unknown;
}

/** Lists whose order the original queries didn't define (GROUP BY without ORDER BY). */
const UNORDERED_KEYS = new Set<string>(['timeline', 'horses', 'drinks', ...LLYWD_ACTIVITIES]);

function normalize(value: unknown, key = ''): unknown {
  if (typeof value === 'string' && /^-?\d+$/.test(value)) return Number(value);
  if (Array.isArray(value)) {
    let items = value.map((item) => normalize(item));
    if (key === 'alt_photos') {
      const seen = new Set<unknown>();
      items = items.filter((alt) => {
        const id = (alt as { alt_photo_id: unknown }).alt_photo_id;
        if (id === null || seen.has(id)) return false;
        seen.add(id);
        return true;
      });
    }
    if (UNORDERED_KEYS.has(key) || key === 'alt_photos') {
      items.sort((a, b) => stableStringify(a).localeCompare(stableStringify(b)));
    }
    return items;
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, normalize(v, k)]),
    );
  }
  return value;
}

function stableStringify(value: unknown): string {
  return JSON.stringify(normalize(value));
}

/** The first path at which two normalized values differ, or null. */
function firstDiff(expected: unknown, actual: unknown, at = '$'): string | null {
  if (Array.isArray(expected) && Array.isArray(actual)) {
    if (expected.length !== actual.length) {
      return `${at}: length ${expected.length} (expected) vs ${actual.length} (worker)`;
    }
    for (let i = 0; i < expected.length; i++) {
      const diff = firstDiff(expected[i], actual[i], `${at}[${i}]`);
      if (diff) return diff;
    }
    return null;
  }
  if (expected && actual && typeof expected === 'object' && typeof actual === 'object') {
    const keys = new Set([...Object.keys(expected), ...Object.keys(actual)]);
    for (const k of keys) {
      const diff = firstDiff(
        (expected as Record<string, unknown>)[k],
        (actual as Record<string, unknown>)[k],
        `${at}.${k}`,
      );
      if (diff) return diff;
    }
    return null;
  }
  return Object.is(expected, actual)
    ? null
    : `${at}: ${JSON.stringify(expected)} (expected) vs ${JSON.stringify(actual)} (worker)`;
}

function workerBody(data: Dataset, route: string, publicOnly: boolean): unknown {
  switch (route) {
    case '/cowboys':
      return { cowboys: getCowboys(data, publicOnly) };
    case '/cowboys/photos':
      return { photos: getPhotos(data, publicOnly) };
    case '/cowboys/leaderboard':
      return { leaderboard: getLeaderboard(data), timeline: getTimeline(data) };
    case '/cowboys/charter': {
      const charter = getCharter(data);
      return charter ? { charter } : null;
    }
    case '/cowboys/wrapped':
      return { wrapped: getWrapped(data, publicOnly) };
    default: {
      const cowboy = getCowboy(data, route.replace('/cowboys/', ''), publicOnly);
      return cowboy ? { cowboy } : null;
    }
  }
}

async function main() {
  const dir = process.argv[2];
  if (!dir) throw new Error('Usage: npm run parity -- <golden dir>');
  const golden: GoldenResponse[] = JSON.parse(
    fs.readFileSync(path.resolve(dir, 'golden.json'), 'utf8'),
  );

  const proxy = await getPlatformProxy<Env>();
  try {
    const data = new Dataset(await loadTables(proxy.env.DB));
    let failures = 0;
    for (const { path: route, view, body } of golden) {
      const actual = workerBody(data, route, view === 'public');
      const diff = firstDiff(normalize(body), normalize(actual));
      console.log(`${diff ? 'FAIL' : 'ok  '} ${view.padEnd(6)} ${route}${diff ? `\n     ${diff}` : ''}`);
      if (diff) failures++;
    }
    console.log(`\n${golden.length - failures}/${golden.length} responses match.`);
    process.exitCode = failures ? 1 : 0;
  } finally {
    await proxy.dispose();
  }
}

main();
