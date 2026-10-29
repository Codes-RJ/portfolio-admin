import { act, render, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { SessionExpiredError, SUPABASE_SESSION_STORAGE_KEY, type SupabaseSession } from '@/lib/supabase';

const mocks = vi.hoisted(() => ({ stored: null as SupabaseSession | null, refresh: vi.fn(), store: vi.fn(), signOut: vi.fn() }));
vi.mock('@/lib/supabase', async original => ({
  ...await original<typeof import('@/lib/supabase')>(), isSupabaseConfigured: true,
  getStoredSupabaseSession: () => mocks.stored,
  refreshSupabaseSession: mocks.refresh,
  storeSupabaseSession: mocks.store,
  signOutFromSupabase: mocks.signOut,
}));
let auth: ReturnType<typeof useAuth>;
function Probe() { const current = useAuth(); useEffect(() => { auth = current; }); return <output>{current.session?.email || 'signed out'}</output>; }
const candidate: SupabaseSession = { mode: 'supabase', accessToken: 'old', refreshToken: 'refresh-old',
  expiresAt: Date.now() + 3_600_000, email: 'admin@example.com', userId: 'admin', isAdmin: true };

beforeEach(() => {
  vi.clearAllMocks(); mocks.stored = candidate;
  mocks.store.mockImplementation(session => { mocks.stored = session; });
  mocks.signOut.mockImplementation(async () => { mocks.stored = null; });
});
afterEach(() => vi.restoreAllMocks());

it('preserves the active session after a transient refresh failure', async () => {
  mocks.refresh.mockRejectedValueOnce(new Error('temporarily offline'));
  render(<AuthProvider><Probe /></AuthProvider>);
  await waitFor(() => expect(auth.loading).toBe(false));
  expect(auth.session).toEqual(candidate);
  expect(mocks.store).not.toHaveBeenCalledWith(null);
});

it.each(['expired', 'role removed'])('clears a session when refresh reports %s', async reason => {
  if (reason === 'expired') mocks.refresh.mockRejectedValueOnce(new SessionExpiredError('Expired'));
  else mocks.refresh.mockResolvedValueOnce({ ...candidate, isAdmin: false });
  render(<AuthProvider><Probe /></AuthProvider>);
  await waitFor(() => expect(auth.loading).toBe(false));
  expect(auth.session).toBeNull();
  expect(mocks.store).toHaveBeenCalledWith(null);
});

it.each(['logout', 'storage cleared', 'session removed'])('does not revive a session after %s during refresh', async change => {
  let resolve!: (session: SupabaseSession) => void;
  mocks.refresh.mockImplementationOnce(() => new Promise<SupabaseSession>(done => { resolve = done; }));
  render(<AuthProvider><Probe /></AuthProvider>);
  await waitFor(() => expect(mocks.refresh).toHaveBeenCalledOnce());
  await act(async () => {
    if (change === 'logout') await auth.signOut();
    else {
      mocks.stored = null;
      window.dispatchEvent(new StorageEvent('storage', { key: change === 'storage cleared' ? null : SUPABASE_SESSION_STORAGE_KEY }));
    }
    resolve({ ...candidate, accessToken: 'rotated' });
  });
  await waitFor(() => expect(auth.loading).toBe(false));
  expect(auth.session).toBeNull();
  expect(mocks.store).not.toHaveBeenCalledWith(expect.objectContaining({ accessToken: 'rotated' }));
});
