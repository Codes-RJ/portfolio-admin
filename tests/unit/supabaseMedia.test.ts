import { afterEach, beforeEach, expect, it, vi } from 'vitest';
beforeEach(() => {
  vi.resetModules(); vi.useFakeTimers();
  vi.stubEnv('VITE_SUPABASE_URL', 'https://media-test.supabase.co');
  vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', 'publishable-test-key');
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

it.each(['cancel', 'timeout'])('aborts a stalled Storage request on %s and clears its timer', async mode => {
  const { uploadPublicMedia } = await import('@/lib/supabase');
  vi.stubGlobal('fetch', vi.fn((_url, init: RequestInit) => new Promise((_resolve, reject) => {
    init.signal!.addEventListener('abort', () => reject(init.signal!.reason), { once: true });
  })));
  const controller = new AbortController();
  const operation = uploadPublicMedia(new Blob(['image'], { type: 'image/webp' }), 'image.webp', 'token', controller.signal);
  const assertion = expect(operation).rejects.toHaveProperty('name', mode === 'cancel' ? 'AbortError' : 'TimeoutError');
  if (mode === 'cancel') controller.abort();
  else await vi.advanceTimersByTimeAsync(30_000);
  await assertion;
  expect(vi.getTimerCount()).toBe(0);
});

it('only deletes reviewed candidates that remain eligible and never new candidates', async () => {
  const { cleanupUnusedMedia } = await import('@/lib/supabase');
  const fetch = vi.fn()
    .mockResolvedValueOnce(new Response(JSON.stringify([{ name: 'reviewed.webp' }, { name: 'new-candidate.webp' }]), { status: 200 }))
    .mockResolvedValueOnce(new Response('{}', { status: 200 }));
  vi.stubGlobal('fetch', fetch);
  await expect(cleanupUnusedMedia('token', ['reviewed.webp', 'now-used.webp'])).resolves.toBe(1);
  expect(fetch).toHaveBeenCalledTimes(2);
  expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual({ prefixes: ['reviewed.webp'] });
});

it('refuses malformed media review responses before any deletion', async () => {
  const { cleanupUnusedMedia } = await import('@/lib/supabase');
  const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify([{ name: '../outside' }]), { status: 200 }));
  vi.stubGlobal('fetch', fetch);
  await expect(cleanupUnusedMedia('token', ['../outside'])).rejects.toThrow('invalid file list');
  expect(fetch).toHaveBeenCalledTimes(1);
});
