import type { D1Migration } from 'cloudflare:test';

declare global {
  namespace Cloudflare {
    interface Env {
      TEST_MIGRATIONS: D1Migration[];
    }
  }
}

declare module 'cloudflare:workers' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- Cloudflare's documented pattern
  interface ProvidedEnv extends Env {}
}
