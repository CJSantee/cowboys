import path from 'node:path';
import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    cloudflareTest(async () => ({
      wrangler: { configPath: './wrangler.jsonc' },
      miniflare: {
        // Test-only binding so the setup file can apply the D1 migrations.
        bindings: {
          TEST_MIGRATIONS: await readD1Migrations(path.join(__dirname, 'migrations')),
          SESSION_SECRET: 'test-session-secret',
        },
      },
    })),
  ],
  test: {
    include: ['test/**/*.test.ts'],
    setupFiles: ['./test/setup.ts'],
  },
});
