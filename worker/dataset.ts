/**
 * The whole Cowboy Counter archive, loaded from D1 and indexed in memory.
 *
 * The data is frozen (the competition is over and nothing writes to D1 after the
 * one-time import) and small (about 1,300 rows), so each isolate loads it once
 * with a single D1 batch and builds every response from memory.
 */

export interface PhotoRow {
  photo_id: number;
  url: string;
  app: string;
  created_at: string;
}

export interface AltPhotoRow {
  alt_photo_id: number;
  photo_id: number;
  url: string | null;
  blur: number;
  metadata: string;
}

export interface CowboyRow {
  cowboy_id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  nickname: string | null;
  is_public: number;
  photo_id: number | null;
}

export interface CowboyPhotoRow {
  cowboy_id: number;
  photo_id: number;
  score_date: string;
  points: number;
  cowboys_only: number;
  tags: string;
}

export interface CharterVersionRow {
  cowboy_charter_version_id: number;
  created_at: string;
}

export interface CharterAssentRow {
  cowboy_charter_assent_id: number;
  cowboy_charter_version_id: number;
  cowboy_id: number;
  created_at: string;
}

export interface Tables {
  photos: PhotoRow[];
  altPhotos: AltPhotoRow[];
  cowboys: CowboyRow[];
  cowboyPhotos: CowboyPhotoRow[];
  charterVersions: CharterVersionRow[];
  charterAssents: CharterAssentRow[];
}

/** A cowboy_photos row with its tags parsed. */
export interface ScoredPhoto extends Omit<CowboyPhotoRow, 'tags'> {
  tags: string[];
}

function groupBy<T, K>(rows: T[], key: (row: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>();
  for (const row of rows) {
    const k = key(row);
    const group = map.get(k);
    if (group) group.push(row);
    else map.set(k, [row]);
  }
  return map;
}

/** Postgres MAX() over text: the greatest non-null value, or null. */
function maxUrl(rows: AltPhotoRow[] | undefined): string | null {
  let max: string | null = null;
  for (const { url } of rows ?? []) {
    if (url !== null && (max === null || url > max)) max = url;
  }
  return max;
}

export class Dataset {
  readonly cowboys: CowboyRow[];
  readonly photos: Map<number, PhotoRow>;
  /** Every cowboy_photos row, in insertion order. */
  readonly scoredPhotos: ScoredPhoto[];
  readonly scoredPhotosByPhoto: Map<number, ScoredPhoto[]>;
  readonly scoredPhotosByCowboy: Map<number, ScoredPhoto[]>;
  readonly cowboysById: Map<number, CowboyRow>;
  /** Unblurred (resized) alt photos, keyed by photo_id. */
  readonly smallAltPhotos: Map<number, AltPhotoRow[]>;
  private readonly blurredAltPhotos: Map<number, AltPhotoRow[]>;
  readonly charterVersions: CharterVersionRow[];
  readonly charterAssents: CharterAssentRow[];

  constructor(tables: Tables) {
    this.cowboys = tables.cowboys;
    this.cowboysById = new Map(tables.cowboys.map((c) => [c.cowboy_id, c]));
    this.photos = new Map(tables.photos.map((p) => [p.photo_id, p]));
    this.scoredPhotos = tables.cowboyPhotos.map((row) => ({
      ...row,
      tags: JSON.parse(row.tags) as string[],
    }));
    this.scoredPhotosByPhoto = groupBy(this.scoredPhotos, (row) => row.photo_id);
    this.scoredPhotosByCowboy = groupBy(this.scoredPhotos, (row) => row.cowboy_id);
    this.smallAltPhotos = groupBy(
      tables.altPhotos.filter((a) => a.blur === 0),
      (a) => a.photo_id,
    );
    this.blurredAltPhotos = groupBy(
      tables.altPhotos.filter((a) => a.blur > 0),
      (a) => a.photo_id,
    );
    this.charterVersions = tables.charterVersions;
    this.charterAssents = tables.charterAssents;
  }

  smallUrl(photo_id: number): string | null {
    return maxUrl(this.smallAltPhotos.get(photo_id));
  }

  blurUrl(photo_id: number): string | null {
    return maxUrl(this.blurredAltPhotos.get(photo_id));
  }

  /**
   * A photo is public when every cowboy in it has a public profile and it was not
   * marked cowboys-only.
   */
  isPhotoPublic(photo_id: number): boolean {
    const rows = this.scoredPhotosByPhoto.get(photo_id) ?? [];
    return rows.every(
      (row) => !row.cowboys_only && Boolean(this.cowboysById.get(row.cowboy_id)?.is_public),
    );
  }

  /**
   * The URL to show for a scored photo: the resized version (falling back to the
   * original) when the viewer may see it, otherwise the blurred version.
   * Replaces the cs_get_cowboy_photo_url() Postgres function.
   */
  displayUrl(photo_id: number, publicOnly: boolean): string | null {
    if (this.isPhotoPublic(photo_id) || !publicOnly) {
      return this.smallUrl(photo_id) ?? this.photos.get(photo_id)?.url ?? null;
    }
    return this.blurUrl(photo_id);
  }
}

export async function loadTables(db: D1Database): Promise<Tables> {
  const [photos, altPhotos, cowboys, cowboyPhotos, charterVersions, charterAssents] =
    await db.batch([
      db.prepare('SELECT photo_id, url, app, created_at FROM photos'),
      db.prepare('SELECT alt_photo_id, photo_id, url, blur, metadata FROM alt_photos ORDER BY alt_photo_id'),
      db.prepare(
        'SELECT cowboy_id, user_id, first_name, last_name, nickname, is_public, photo_id FROM cowboys ORDER BY cowboy_id',
      ),
      db.prepare(
        'SELECT cowboy_id, photo_id, score_date, points, cowboys_only, tags FROM cowboy_photos ORDER BY rowid',
      ),
      db.prepare(
        'SELECT cowboy_charter_version_id, created_at FROM cowboy_charter_versions ORDER BY cowboy_charter_version_id',
      ),
      db.prepare(
        'SELECT cowboy_charter_assent_id, cowboy_charter_version_id, cowboy_id, created_at FROM cowboy_charter_assents ORDER BY cowboy_charter_assent_id',
      ),
    ]);
  return {
    photos: photos.results as unknown as PhotoRow[],
    altPhotos: altPhotos.results as unknown as AltPhotoRow[],
    cowboys: cowboys.results as unknown as CowboyRow[],
    cowboyPhotos: cowboyPhotos.results as unknown as CowboyPhotoRow[],
    charterVersions: charterVersions.results as unknown as CharterVersionRow[],
    charterAssents: charterAssents.results as unknown as CharterAssentRow[],
  };
}

/**
 * Per-isolate cache. Safe only because the data never changes after import; a
 * re-import is picked up as isolates recycle (or immediately on the next deploy).
 */
const cache = new WeakMap<D1Database, Promise<Dataset>>();

export function getDataset(db: D1Database): Promise<Dataset> {
  let dataset = cache.get(db);
  if (!dataset) {
    dataset = loadTables(db).then((tables) => {
      // Don't cache an archive that hasn't been imported yet (for example, right
      // after the first deploy), or the isolate would keep serving it empty.
      if (!tables.cowboys.length) cache.delete(db);
      return new Dataset(tables);
    });
    // Don't cache a failed load.
    dataset.catch(() => cache.delete(db));
    cache.set(db, dataset);
  }
  return dataset;
}
