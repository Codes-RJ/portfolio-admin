import { afterEach, beforeEach, expect, it, vi } from 'vitest';

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv('VITE_SUPABASE_URL', 'https://project.supabase.co');
  vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', 'sb_publishable_test');
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
const candidate = { mode: 'supabase' as const, isAdmin: true, userId: 'admin', email: 'ada@example.com', accessToken: 'old', refreshToken: 'refresh-old', expiresAt: 0 };

it('preserves a session during transient outages and identifies definitive expiry', async () => {
  const lib = await import('@/lib/supabase');
  lib.storeSupabaseSession(candidate);
  vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(new Response('{}', { status: 503 })).mockResolvedValueOnce(new Response('{}', { status: 401 })));
  await expect(lib.refreshSupabaseSession(candidate)).rejects.not.toBeInstanceOf(lib.SessionExpiredError);
  expect(lib.getStoredSupabaseSession()?.accessToken).toBe('old');
  await expect(lib.refreshSupabaseSession(candidate)).rejects.toBeInstanceOf(lib.SessionExpiredError);
});

it('uses an already rotated token from another tab without rotating the old token again', async () => {
  const lib = await import('@/lib/supabase');
  lib.storeSupabaseSession({ ...candidate, accessToken: 'new', refreshToken: 'refresh-new', expiresAt: Date.now() + 3_600_000 });
  const fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
  expect((await lib.refreshSupabaseSession(candidate)).accessToken).toBe('new');
  expect(fetchMock).not.toHaveBeenCalled();
});

it('does not resurrect a stored session after sign-out during refresh', async () => {
  const lib = await import('@/lib/supabase');
  lib.storeSupabaseSession(candidate);
  vi.stubGlobal('fetch', vi.fn().mockImplementation(async () => {
    lib.storeSupabaseSession(null);
    return new Response(JSON.stringify({ access_token: 'new', refresh_token: 'new-refresh', expires_in: 3600, user: { id: 'admin', email: 'ada@example.com', app_metadata: { role: 'admin' } } }));
  }));
  await lib.refreshSupabaseSession(candidate);
  expect(lib.getStoredSupabaseSession()).toBeNull();
});

it('serializes concurrent tabs under Web Locks and reuses the rotated token', async () => {
  let queue = Promise.resolve();
  vi.stubGlobal('navigator', { locks: { request: (_name: string, optionsOrCallback: unknown, maybeCallback?: unknown) => {
    const callback = (typeof optionsOrCallback === 'function' ? optionsOrCallback : maybeCallback) as () => Promise<unknown>;
    const next = queue.then(callback); queue = next.then(() => undefined); return next;
  } } });
  const lib = await import('@/lib/supabase'); lib.storeSupabaseSession(candidate);
  const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ access_token: 'new', refresh_token: 'new-refresh', expires_in: 3600, user: { id: 'admin', email: 'ada@example.com', app_metadata: { role: 'admin' } } })));
  vi.stubGlobal('fetch', fetchMock);
  const sessions = await Promise.all([lib.refreshSupabaseSession(candidate), lib.refreshSupabaseSession(candidate)]);
  expect(sessions.map(session => session.accessToken)).toEqual(['new', 'new']);
  expect(fetchMock).toHaveBeenCalledOnce();
});

it('rejects corrupt stored claims and continues in memory when storage is blocked', async () => {
  const lib = await import('@/lib/supabase');
  localStorage.setItem(lib.SUPABASE_SESSION_STORAGE_KEY, JSON.stringify({ ...candidate, expiresAt: 'never', isAdmin: 'yes' }));
  expect(lib.getStoredSupabaseSession()).toBeNull();
  const blocked = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new DOMException('Blocked', 'SecurityError'); });
  expect(lib.getStoredSupabaseSession()).toBeNull(); blocked.mockRestore();
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ access_token: 'new', refresh_token: 'new-refresh', expires_in: 3600, user: { id: 'admin', email: 'ada@example.com', app_metadata: { role: 'user' } } }))));
  expect((await lib.refreshSupabaseSession(candidate)).isAdmin).toBe(false);
});
