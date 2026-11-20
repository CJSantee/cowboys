-- Cowboy Counter schema (read-only archive).
--
-- Data is loaded once from the original Postgres database by
-- `apps/api/scripts/export-cowboys-d1.ts` in the pool-scores repo. Keep the
-- column lists here in sync with that script.

-- Only the photos Cowboy Counter shows: cowboy photos plus cowboy profile photos.
CREATE TABLE photos (
  photo_id INTEGER PRIMARY KEY,
  url TEXT NOT NULL,
  app TEXT NOT NULL,
  created_at TEXT NOT NULL -- ISO 8601, UTC
);

-- Resized (blur = 0) and blurred (blur > 0) versions of a photo.
CREATE TABLE alt_photos (
  alt_photo_id INTEGER PRIMARY KEY,
  photo_id INTEGER NOT NULL REFERENCES photos (photo_id),
  url TEXT,
  blur INTEGER NOT NULL DEFAULT 0,
  metadata TEXT NOT NULL DEFAULT '{}' -- JSON object
);

CREATE INDEX alt_photos_photo_id_idx ON alt_photos (photo_id);

CREATE TABLE cowboys (
  cowboy_id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  nickname TEXT,
  is_public INTEGER NOT NULL DEFAULT 0, -- boolean
  photo_id INTEGER REFERENCES photos (photo_id)
);

-- One row per cowboy per scored photo. Rows are read in rowid (insertion) order.
CREATE TABLE cowboy_photos (
  cowboy_id INTEGER NOT NULL REFERENCES cowboys (cowboy_id),
  photo_id INTEGER NOT NULL REFERENCES photos (photo_id),
  score_date TEXT NOT NULL, -- YYYY-MM-DD
  points INTEGER NOT NULL DEFAULT 1,
  cowboys_only INTEGER NOT NULL DEFAULT 0, -- boolean
  tags TEXT NOT NULL DEFAULT '[]' -- JSON array of strings
);

CREATE INDEX cowboy_photos_cowboy_id_idx ON cowboy_photos (cowboy_id);
CREATE INDEX cowboy_photos_photo_id_idx ON cowboy_photos (photo_id);

CREATE TABLE cowboy_charter_versions (
  cowboy_charter_version_id INTEGER PRIMARY KEY,
  created_at TEXT NOT NULL
);

CREATE TABLE cowboy_charter_assents (
  cowboy_charter_assent_id INTEGER PRIMARY KEY,
  cowboy_charter_version_id INTEGER NOT NULL REFERENCES cowboy_charter_versions (cowboy_charter_version_id),
  cowboy_id INTEGER NOT NULL REFERENCES cowboys (cowboy_id),
  created_at TEXT NOT NULL
);
