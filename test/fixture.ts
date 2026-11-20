/**
 * Synthetic archive covering each visibility rule:
 *
 * - alice (1): public profile. bob (2): private profile. cara (3): no photos.
 * - Photo 1: alice only, public, tagged horse.
 * - Photo 2: alice + bob, private because bob is private, has a blurred version, tagged drink.
 * - Photo 3: bob only, private, no blurred version (hidden from the public photo list).
 * - Photo 4: alice only but cowboys-only, has a blurred version, tagged llywd + bull.
 * - Photo 100 is alice's profile photo from another app; 101 is bob's.
 * - alice signs in as "Alice" / alice-password, bob as "bobby" / bob-password.
 */
const S3 = 'https://cowboy-counter-images.s3.us-east-1.amazonaws.com';
export const url = (name: string) => `${S3}/${name}.jpeg`;

export const FIXTURE_SQL = [
  `INSERT INTO photos (photo_id, url, app, created_at) VALUES
    (1, '${url('p1')}', 'cowboys', '2025-02-01T12:00:00.000000Z'),
    (2, '${url('p2')}', 'cowboys', '2025-02-03T12:00:00.000000Z'),
    (3, '${url('p3')}', 'cowboys', '2025-02-02T12:00:00.000000Z'),
    (4, '${url('p4')}', 'cowboys', '2025-02-05T12:00:00.000000Z'),
    (100, '${url('p100')}', 'breakpoint', '2025-01-01T12:00:00.000000Z'),
    (101, '${url('p101')}', 'cowboys', '2025-01-01T12:00:00.000000Z')`,
  `INSERT INTO alt_photos (alt_photo_id, photo_id, url, blur, metadata) VALUES
    (1, 1, '${url('s1')}', 0, '{"quality": 25}'),
    (2, 2, '${url('s2')}', 0, '{"blur": 0, "quality": 25}'),
    (3, 2, '${url('b2')}', 50, '{"blur": 50, "quality": 25}'),
    (4, 3, '${url('s3')}', 0, '{"quality": 25}'),
    (5, 4, '${url('s4')}', 0, '{"quality": 25}'),
    (6, 4, '${url('b4')}', 50, '{"blur": 50, "quality": 25}'),
    (7, 100, '${url('s100')}', 0, '{"quality": 25}'),
    (8, 101, '${url('s101')}', 0, '{"quality": 25}'),
    (9, 101, '${url('b101')}', 50, '{"blur": 50, "quality": 25}')`,
  `INSERT INTO cowboys (cowboy_id, user_id, first_name, last_name, nickname, is_public, photo_id) VALUES
    (1, 10, 'Alice', 'Anders', 'alice', 1, 100),
    (2, 20, 'Bob', 'Brown', 'bob', 0, 101),
    (3, 30, 'Cara', 'Cole', 'cara', 1, NULL)`,
  // Passwords: alice-password, bob-password (cost-4 hashes keep tests fast).
  `INSERT INTO cowboy_logins (cowboy_id, username, password_hash) VALUES
    (1, 'Alice', '$2b$04$P4Oc5nvKosUG5HAnynJw0OA27jH2WiPEn6PNVOz.M1zoK3WD14Poi'),
    (2, 'bobby', '$2b$04$4kf4G06ZdLheMX1gA.Ga4O5eAh3klF5pOQMPt0dc4cBUkO8bjErXa')`,
  `INSERT INTO cowboy_photos (cowboy_id, photo_id, score_date, points, cowboys_only, tags) VALUES
    (1, 1, '2025-02-01', 1, 0, '["horse"]'),
    (1, 2, '2025-02-03', 1, 0, '["drink"]'),
    (2, 2, '2025-02-03', 1, 0, '["drink"]'),
    (2, 3, '2025-02-02', 1, 0, '[]'),
    (1, 4, '2025-02-05', 3, 1, '["llywd", "bull"]')`,
  `INSERT INTO cowboy_charter_versions (cowboy_charter_version_id, created_at) VALUES
    (1, '2025-02-22T00:00:00.000000Z'),
    (2, '2025-08-13T00:00:00.000000Z')`,
  `INSERT INTO cowboy_charter_assents (cowboy_charter_assent_id, cowboy_charter_version_id, cowboy_id, created_at) VALUES
    (1, 1, 1, '2025-02-22T00:00:00.000000Z'),
    (2, 1, 2, '2025-02-22T00:00:00.000000Z'),
    (3, 2, 1, '2025-08-13T00:00:00.000000Z')`,
];
