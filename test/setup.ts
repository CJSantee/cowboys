import { applyD1Migrations } from 'cloudflare:test';
import { env } from 'cloudflare:workers';
import { FIXTURE_SQL } from './fixture';

// Storage is isolated per test file, so every file starts from this fixture.
await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
await env.DB.batch(FIXTURE_SQL.map((sql) => env.DB.prepare(sql)));
