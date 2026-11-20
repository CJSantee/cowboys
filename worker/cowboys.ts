/**
 * Response builders for the read-only Cowboy Counter API.
 *
 * Each function ports one of the original Postgres queries from the Pool Scores
 * API (`apps/api/db/cowboys/*.sql`) and keeps its output shape. `publicOnly` is
 * true unless the viewer is a cowboy (see ./viewer.ts).
 */
import { Dataset, ScoredPhoto } from './dataset';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Postgres TO_CHAR(date, 'Mon DD') for a YYYY-MM-DD string. */
export function monDD(date: string): string {
  const [, month, day] = date.split('-');
  return `${MONTHS[Number(month) - 1]} ${day}`;
}

function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function dayOfWeek(date: string): number {
  return new Date(`${date}T00:00:00Z`).getUTCDay(); // 0 = Sunday
}

function sum(rows: { points: number }[]): number {
  return rows.reduce((total, row) => total + row.points, 0);
}

/** Cowboys with at least one scored photo (the original queries INNER JOIN cowboy_photos). */
function scoringCowboys(data: Dataset) {
  return data.cowboys.filter((c) => data.scoredPhotosByCowboy.has(c.cowboy_id));
}

function byPointsDesc<T extends { cowboy_id: number; points: number }>(a: T, b: T) {
  return b.points - a.points || a.cowboy_id - b.cowboy_id;
}

/** get_cowboys.sql */
export function getCowboys(data: Dataset, publicOnly: boolean) {
  return scoringCowboys(data)
    .map((c) => {
      const scored = data.scoredPhotosByCowboy.get(c.cowboy_id)!;
      const profile = c.photo_id === null ? undefined : data.photos.get(c.photo_id);
      let photo_url: string | null = null;
      if (profile) {
        photo_url =
          c.is_public || !publicOnly
            ? (data.smallUrl(profile.photo_id) ?? profile.url)
            : data.blurUrl(profile.photo_id);
      }
      return {
        cowboy_id: c.cowboy_id,
        user_id: c.user_id,
        first_name: c.first_name,
        last_name: c.last_name,
        nickname: c.nickname,
        photo_url,
        is_public: Boolean(c.is_public),
        num_photos: scored.length,
        points: sum(scored),
      };
    })
    .sort(byPointsDesc);
}

/** get_photos.sql */
export function getPhotos(data: Dataset, publicOnly: boolean) {
  const photos = [...data.scoredPhotosByPhoto.entries()]
    .map(([photo_id, rows]) => ({ photo: data.photos.get(photo_id)!, rows }))
    .filter(({ photo }) => photo.app === 'cowboys')
    .map(({ photo, rows }) => {
      const is_public = data.isPhotoPublic(photo.photo_id);
      return {
        photo,
        blurUrl: data.blurUrl(photo.photo_id),
        result: {
          photo_id: photo.photo_id,
          photo_url: data.displayUrl(photo.photo_id, publicOnly),
          cowboys: rows.map((row) => ({
            cowboy_id: row.cowboy_id,
            nickname: data.cowboysById.get(row.cowboy_id)!.nickname,
            points: row.points,
          })),
          score_date: rows.reduce((max, row) => (row.score_date > max ? row.score_date : max), ''),
          is_public,
        },
      };
    })
    .filter(({ result, blurUrl }) => !publicOnly || result.is_public || blurUrl !== null);

  photos.sort(
    (a, b) =>
      b.result.score_date.localeCompare(a.result.score_date) ||
      b.photo.created_at.localeCompare(a.photo.created_at) ||
      b.photo.photo_id - a.photo.photo_id,
  );
  return photos.map(({ result }) => result);
}

/**
 * get_cowboy.sql. Looks a cowboy up by id or nickname. Returns null when the
 * cowboy doesn't exist or has no photos the viewer may see.
 */
export function getCowboy(data: Dataset, identifier: string, publicOnly: boolean) {
  const cowboy = data.cowboys.find(
    (c) => String(c.cowboy_id) === identifier || c.nickname === identifier,
  );
  if (!cowboy) return null;
  const scored = data.scoredPhotosByCowboy.get(cowboy.cowboy_id);
  if (!scored) return null;

  const photos = scored
    .map((row) => ({ row, photo: data.photos.get(row.photo_id)! }))
    .filter(({ row }) => !publicOnly || data.isPhotoPublic(row.photo_id))
    .sort(
      (a, b) =>
        b.row.score_date.localeCompare(a.row.score_date) ||
        b.photo.created_at.localeCompare(a.photo.created_at) ||
        b.photo.photo_id - a.photo.photo_id,
    )
    .map(({ row, photo }) => ({
      photo_id: photo.photo_id,
      photo_url: photo.url,
      score_date: row.score_date,
      points: row.points,
      alt_photos: (data.smallAltPhotos.get(photo.photo_id) ?? []).map((alt) => ({
        alt_photo_id: alt.alt_photo_id,
        url: alt.url,
        metadata: JSON.parse(alt.metadata) as Record<string, unknown>,
      })),
    }));
  if (!photos.length) return null;

  return {
    cowboy_id: cowboy.cowboy_id,
    first_name: cowboy.first_name,
    last_name: cowboy.last_name,
    nickname: cowboy.nickname,
    // Includes points from photos the viewer can't see.
    points: sum(scored),
    is_public: Boolean(cowboy.is_public),
    photos,
  };
}

/** get_leaderboard.sql */
export function getLeaderboard(data: Dataset) {
  return scoringCowboys(data)
    .map((c) => ({
      cowboy_id: c.cowboy_id,
      nickname: c.nickname,
      points: sum(data.scoredPhotosByCowboy.get(c.cowboy_id)!),
    }))
    .sort(byPointsDesc);
}

/**
 * get_timeline.sql: each cowboy's running point total on every date anything was
 * scored, starting from their first scored date.
 */
export function getTimeline(data: Dataset) {
  const scoreDates = [...new Set(data.scoredPhotos.map((row) => row.score_date))].sort();
  return scoringCowboys(data).map((c) => {
    const rows = data.scoredPhotosByCowboy.get(c.cowboy_id)!;
    const firstDate = rows.reduce((min, row) => (row.score_date < min ? row.score_date : min), '9999');
    return {
      cowboy_id: c.cowboy_id,
      nickname: c.nickname,
      points: scoreDates
        .filter((date) => date >= firstDate)
        .map((date) => ({
          score_date: monDD(date),
          total_points: sum(rows.filter((row) => row.score_date <= date)),
        })),
    };
  });
}

/** get_charter_assents.sql: the latest charter version and who has signed it. */
export function getCharter(data: Dataset) {
  const latest = data.charterVersions.reduce<(typeof data.charterVersions)[number] | null>(
    (best, v) => (best === null || v.created_at > best.created_at ? v : best),
    null,
  );
  if (!latest) return null;
  return {
    cowboy_charter_version_id: latest.cowboy_charter_version_id,
    cowboys: data.charterAssents
      .filter((a) => a.cowboy_charter_version_id === latest.cowboy_charter_version_id)
      .map((a) => {
        const c = data.cowboysById.get(a.cowboy_id)!;
        return { cowboy_id: c.cowboy_id, user_id: c.user_id, name: `${c.first_name} ${c.last_name}` };
      }),
  };
}

const STATES = [
  { state: 'TN', name: 'Tennessee', latitude: 36.161144, longitude: -86.777978 },
  { state: 'SC', name: 'South Carolina', latitude: 34.675491, longitude: -82.834943 },
  { state: 'OH', name: 'Ohio', latitude: 39.110145, longitude: -84.511878 },
  { state: 'CO', name: 'Colorado', latitude: 38.83913, longitude: -105.053847 },
  { state: 'ME', name: 'Maine', latitude: 44.637636, longitude: -68.652769 },
  { state: 'KY', name: 'Kentucky', latitude: 37.978429, longitude: -84.512504 },
  { state: 'NC', name: 'North Carolina', latitude: 35.508538, longitude: -82.651996 },
  { state: 'CA', name: 'California', latitude: 34.561996, longitude: -118.455149 },
  { state: 'TX', name: 'Texas', latitude: 29.718324, longitude: -95.354612 },
  { state: 'AZ', name: 'Arizona', latitude: 33.436715, longitude: -112.197747 },
  { state: 'VA', name: 'Virginia', latitude: 38.891205, longitude: -77.088907 },
];

export const LLYWD_ACTIVITIES = ['skydiving', 'bull', 'eagle', 'rockies', 'love', 'speak'] as const;

/** The competition year the Wrapped heatmap covers. Starts on a Sunday. */
const WRAPPED_START = '2025-01-12';
const WRAPPED_END = '2026-01-12';

/**
 * Groups tagged rows by (photo_id, score_date), plus any extra key, into Wrapped
 * photo entries. Groups are ordered by score_date, then photo_id.
 */
function wrappedPhotos(
  data: Dataset,
  rows: ScoredPhoto[],
  publicOnly: boolean,
  extraKey: (row: ScoredPhoto) => string = () => '',
) {
  const groups = new Map<string, ScoredPhoto[]>();
  for (const row of rows) {
    const key = `${row.photo_id}|${row.score_date}|${extraKey(row)}`;
    const group = groups.get(key);
    if (group) group.push(row);
    else groups.set(key, [row]);
  }
  return [...groups.values()]
    .sort((a, b) => a[0].score_date.localeCompare(b[0].score_date) || a[0].photo_id - b[0].photo_id)
    .map((group) => ({
      photo_url: data.displayUrl(group[0].photo_id, publicOnly),
      score_date: group[0].score_date,
      cowboys: group.map((row) => ({
        cowboy_id: row.cowboy_id,
        nickname: data.cowboysById.get(row.cowboy_id)!.nickname,
      })),
      tags: group[0].tags,
    }));
}

/** get_wrapped.sql: the 2025 season recap. */
export function getWrapped(data: Dataset, publicOnly: boolean, today = new Date()) {
  const tagged = (tag: string) => data.scoredPhotos.filter((row) => row.tags.includes(tag));
  const withoutTags = ({ photo_url, score_date, cowboys }: ReturnType<typeof wrappedPhotos>[number]) => ({
    photo_url,
    score_date,
    cowboys,
  });

  // In Postgres, jsonb_agg over zero rows is NULL rather than [].
  const orNull = <T>(list: T[]) => (list.length ? list : null);

  const horses = wrappedPhotos(data, tagged('horse'), publicOnly).map(withoutTags);
  const drinks = wrappedPhotos(data, tagged('drink'), publicOnly).map(withoutTags);

  const llywdRows = data.scoredPhotos.filter((row) =>
    row.tags.some((tag) => (LLYWD_ACTIVITIES as readonly string[]).includes(tag)),
  );
  const llywd: Record<string, ReturnType<typeof withoutTags>[]> = {};
  for (const photo of wrappedPhotos(data, llywdRows, publicOnly, (row) => JSON.stringify(row.tags))) {
    for (const tag of photo.tags) {
      if ((LLYWD_ACTIVITIES as readonly string[]).includes(tag)) {
        (llywd[tag] ??= []).push(withoutTags(photo));
      }
    }
  }

  // Number of distinct cowboys who scored on each day of the season.
  const cowboysPerDay = new Map<string, Set<number>>();
  for (const row of data.scoredPhotos) {
    let set = cowboysPerDay.get(row.score_date);
    if (!set) cowboysPerDay.set(row.score_date, (set = new Set()));
    set.add(row.cowboy_id);
  }
  const todayIso = today.toISOString().slice(0, 10);
  const end = todayIso < WRAPPED_END ? todayIso : WRAPPED_END;
  const score_days = [];
  for (let date = WRAPPED_START; date <= end; date = addDays(date, 1)) {
    const weekStart = addDays(date, -dayOfWeek(date)); // Sunday
    const weekEnd = addDays(weekStart, 6); // Saturday
    score_days.push({
      score_date: date,
      num_cowboys: cowboysPerDay.get(date)?.size ?? 0,
      week: `${monDD(weekStart)} - ${monDD(weekEnd)}`,
    });
  }

  return {
    horses: orNull(horses),
    drinks: orNull(drinks),
    llywd: Object.keys(llywd).length ? llywd : null,
    score_days,
    states: STATES,
  };
}
