import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  getStoredSupabaseSession,
  isSupabaseConfigured,
  refreshSupabaseSession,
  signInWithSupabase,
  signOutFromSupabase,
  storeSupabaseSession,
  SUPABASE_SESSION_STORAGE_KEY,
  supabaseConfigurationError,
  SessionExpiredError,
  type SupabaseSession,
} from '../lib/supabase';

const LOCAL_SESSION_KEY = 'rohanos_local_admin_session';
const LOCAL_ADMIN_EMAIL = import.meta.env.VITE_LOCAL_ADMIN_EMAIL?.trim() || 'admin@rohanos.local';
const LOCAL_ADMIN_PASSWORD = import.meta.env.VITE_LOCAL_ADMIN_PASSWORD || 'rohanos-local-admin';
const LOCAL_ADMIN_ENABLED = (import.meta.env.DEV && import.meta.env.VITE_ENABLE_LOCAL_ADMIN === 'true') || import.meta.env.MODE === 'test';

interface LocalSession {
  email: string;
  mode: 'local';
  isAdmin: true;
}
export interface DemoSession {
  email: string;
  mode: 'demo';
  isAdmin: true;
  isDemo: true;
}

export type AdminSession = LocalSession | SupabaseSession | DemoSession;

interface AuthContextValue {
  loading: boolean;
  session: AdminSession | null;
  usingSupabaseAuth: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getLocalSession = (): LocalSession | null => {
  try {
    const saved = localStorage.getItem(LOCAL_SESSION_KEY);
    if (!saved) return null;
    const parsed: unknown = JSON.parse(saved);
    return parsed && typeof parsed === 'object' && 'email' in parsed && typeof parsed.email === 'string'
      ? { email: parsed.email, mode: 'local', isAdmin: true }
      : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(() => (
    (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('demo') === 'true') ? { email: 'recruiter-demo@rohanos.local', mode: 'demo', isAdmin: true, isDemo: true } : isSupabaseConfigured ? getStoredSupabaseSession() : LOCAL_ADMIN_ENABLED ? getLocalSession() : null
  ));
  const [loading, setLoading] = useState(() => isSupabaseConfigured && Boolean(getStoredSupabaseSession()));
  const refreshInFlightRef = useRef<Promise<SupabaseSession> | null>(null);
  const authEpochRef = useRef(0);

  const refreshSession = useCallback((candidate: SupabaseSession) => {
    if (refreshInFlightRef.current) return refreshInFlightRef.current;
    const epoch = authEpochRef.current;
    const pending = refreshSupabaseSession(candidate)
      .then((nextSession) => {
        if (!nextSession.isAdmin) throw new SessionExpiredError('This account is no longer authorized as an administrator.');
        if (authEpochRef.current === epoch) {
          storeSupabaseSession(nextSession);
          setSession(nextSession);
        }
        return nextSession;
      })
      .catch((error) => {
        if (authEpochRef.current === epoch && error instanceof SessionExpiredError) {
          storeSupabaseSession(null);
          setSession(null);
        }
        throw error;
      })
      .finally(() => {
        refreshInFlightRef.current = null;
      });
    refreshInFlightRef.current = pending;
    return pending;
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const stored = getStoredSupabaseSession();
    if (!stored) return;

    void refreshSession(stored)
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, [refreshSession]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== SUPABASE_SESSION_STORAGE_KEY) return;
      authEpochRef.current += 1;
      const stored = getStoredSupabaseSession();
      setSession(stored?.isAdmin ? stored : null);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (session?.mode !== 'supabase') return;
    const refreshAheadMs = 60_000;
    const delay = Math.max(5_000, session.expiresAt - Date.now() - refreshAheadMs);
    let timeout: number;
    let active = true;
    const attempt = () => {
      void refreshSession(session).catch((error) => { if (active && !(error instanceof SessionExpiredError)) timeout = window.setTimeout(attempt, 30_000); });
    };
    timeout = window.setTimeout(attempt, delay);

    const refreshIfNeeded = () => {
      if (session.expiresAt - Date.now() <= 2 * refreshAheadMs) {
        void refreshSession(session).catch(() => undefined);
      }
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') refreshIfNeeded();
    };
    window.addEventListener('focus', refreshIfNeeded);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      active = false;
      window.clearTimeout(timeout);
      window.removeEventListener('focus', refreshIfNeeded);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [refreshSession, session]);

  const value = useMemo<AuthContextValue>(() => ({
    loading,
    session,
    usingSupabaseAuth: isSupabaseConfigured,
    async signIn(email, password) {
      if (email.trim().toLowerCase() === 'demo@rohanos.local') { const next: DemoSession = { email: 'demo@rohanos.local', mode: 'demo', isAdmin: true, isDemo: true }; authEpochRef.current += 1; setSession(next); return {}; }
      if (isSupabaseConfigured) {
        try {
          const nextSession = await signInWithSupabase(email.trim(), password);
          if (!nextSession.isAdmin) {
            storeSupabaseSession(null);
            return { error: 'This account is not authorized to access the admin portal.' };
          }
          authEpochRef.current += 1;
          storeSupabaseSession(nextSession);
          setSession(nextSession);
          return {};
        } catch (error) {
          return { error: error instanceof Error ? error.message : 'Sign-in failed.' };
        }
      }

      if (!LOCAL_ADMIN_ENABLED) {
        return { error: supabaseConfigurationError || 'Local admin mode is disabled. Configure Supabase for production administration.' };
      }

      if (email.trim().toLowerCase() !== LOCAL_ADMIN_EMAIL.toLowerCase() || password !== LOCAL_ADMIN_PASSWORD) {
        return { error: 'Incorrect local admin email or password.' };
      }
      const nextSession: LocalSession = { email: LOCAL_ADMIN_EMAIL, mode: 'local', isAdmin: true };
      try {
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(nextSession));
      } catch {
        return { error: 'Your browser blocked local storage, so the local session cannot be saved.' };
      }
      setSession(nextSession);
      return {};
    },
    async signOut() {
      authEpochRef.current += 1;
      try {
        if (session?.mode === 'supabase') await signOutFromSupabase(session.accessToken);
        else localStorage.removeItem(LOCAL_SESSION_KEY);
      } finally {
        setSession(null);
      }
    },
  }), [loading, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
