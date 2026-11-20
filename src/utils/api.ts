/** Error thrown for a non-2xx response from the Cowboy Counter API. */
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  // Same-origin requests send the session cookie automatically.
  const response = await fetch(`/api${path}`, init);
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(body?.error?.message ?? `Request failed (${response.status})`, response.status);
  }
  return body as T;
}

/** GET a JSON resource from this site's Worker API (`/api/...`). */
export function getJson<T>(path: string): Promise<T> {
  return request<T>(path);
}

/** POST a JSON body to this site's Worker API (`/api/...`). */
export function postJson<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  });
}
