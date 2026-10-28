import type { ContactMessage } from '../data/initialData';
export { isSupabaseConfigured, supabaseConfigurationError, loadPublishedContent } from './publicSupabase';
export type { PublishedContentDocument } from './publicSupabase';
export { dataUrlToBlob } from './dataUrl';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/\/$/, '');
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() || import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
export const SUPABASE_SESSION_STORAGE_KEY = 'rohanos_supabase_admin_session';
const CONTENT_ROW_ID = 'portfolio';
const MEDIA_BUCKET = 'portfolio-media';

export interface SupabaseSession {
  mode: 'supabase';
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  email: string;
  userId: string;
  isAdmin: boolean;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: {
    id: string;
    email?: string;
    app_metadata?: Record<string, unknown>;
  };
}

const requireConfig = () => {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Supabase is not configured.');
  return { url: SUPABASE_URL, key: SUPABASE_KEY };
};

const jsonHeaders = (accessToken?: string, extra: HeadersInit = {}): HeadersInit => {
  const { key } = requireConfig();
  return {
    apikey: key,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...extra,
  };
};

const request = async (path: string, init: RequestInit = {}, accessToken?: string) => {
  const { url } = requireConfig();
  return fetch(`${url}${path}`, {
    ...init,
    signal: init.signal ?? AbortSignal.timeout(15_000),
    headers: jsonHeaders(accessToken, init.headers),
  });
};

export class SessionExpiredError extends Error {}

const toSession = (auth: AuthResponse): SupabaseSession => ({
  mode: 'supabase',
  accessToken: auth.access_token,
  refreshToken: auth.refresh_token,
  expiresAt: Date.now() + auth.expires_in * 1_000,
  email: auth.user.email || '',
  userId: auth.user.id,
  isAdmin: auth.user.app_metadata?.role === 'admin',
});

export const getStoredSupabaseSession = (): SupabaseSession | null => {
  try {
    const raw = localStorage.getItem(SUPABASE_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const session: unknown = JSON.parse(raw);
    if (!session || typeof session !== 'object') return null;
    const candidate = session as Partial<SupabaseSession>;
    if (candidate.mode !== 'supabase' || !candidate.accessToken || !candidate.refreshToken || !candidate.email || !candidate.userId) return null;
    if (![candidate.accessToken, candidate.refreshToken, candidate.email, candidate.userId].every(value => typeof value === 'string')
      || typeof candidate.isAdmin !== 'boolean' || typeof candidate.expiresAt !== 'number' || !Number.isFinite(candidate.expiresAt) || candidate.expiresAt < 0) return null;
    return candidate as SupabaseSession;
  } catch {
    return null;
  }
};

export const storeSupabaseSession = (session: SupabaseSession | null) => {
  try {
    if (session) localStorage.setItem(SUPABASE_SESSION_STORAGE_KEY, JSON.stringify(session));
    else localStorage.removeItem(SUPABASE_SESSION_STORAGE_KEY);
  } catch {
    // The active in-memory session remains usable when browser storage is blocked.
  }
};

export const signInWithSupabase = async (email: string, password: string): Promise<SupabaseSession> => {
  const response = await request('/auth/v1/token?grant_type=password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error('Incorrect email or password.');
  return toSession(await response.json() as AuthResponse);
};

export const refreshSupabaseSession = async (session: SupabaseSession): Promise<SupabaseSession> => {
  const refresh = async () => {
  const latest = getStoredSupabaseSession();
  if (latest && latest.accessToken !== session.accessToken && latest.expiresAt > Date.now() + 60_000) return latest;
  const response = await request('/auth/v1/token?grant_type=refresh_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: latest?.refreshToken ?? session.refreshToken }),
  });
  if (!response.ok) {
    if ([400, 401, 403].includes(response.status)) throw new SessionExpiredError('Session expired. Please sign in again.');
    throw new Error('Authentication is temporarily unavailable.');
  }
  const refreshed = toSession(await response.json() as AuthResponse);
  // Write under the cross-tab lock before another tab rotates the same token.
  const current = getStoredSupabaseSession();
  if (current && current.accessToken === (latest ?? session).accessToken && current.refreshToken === (latest ?? session).refreshToken) storeSupabaseSession(refreshed);
    return refreshed;
  };

  if (navigator.locks) {
    try {
      const signal = typeof AbortSignal?.timeout === 'function' ? AbortSignal.timeout(8000) : undefined;
      return await (signal ? navigator.locks.request('rohanos-auth-refresh', { signal }, refresh) : navigator.locks.request('rohanos-auth-refresh', refresh));
    } catch (lockError) {
      if ((lockError as Error)?.name === 'AbortError') {
        return refresh();
      }
      throw lockError;
    }
  }
  return refresh();
};

export const signOutFromSupabase = async (accessToken: string) => {
  try {
    await request('/auth/v1/logout', { method: 'POST' }, accessToken);
  } finally {
    storeSupabaseSession(null);
  }
};

export class PublishedContentConflictError extends Error {
  constructor() {
    super('Published content changed in another session. Reload before saving again.');
    this.name = 'PublishedContentConflictError';
  }
}

export const initializePublishedContent = async (
  payload: Record<string, unknown>,
  accessToken: string,
): Promise<string> => {
  const response = await request('/rest/v1/site_content?select=updated_at', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({ id: CONTENT_ROW_ID, payload }),
  }, accessToken);
  if (response.status === 409) throw new PublishedContentConflictError();
  if (!response.ok) throw new Error('Could not initialize content in Supabase.');
  const rows = await response.json() as Array<{ updated_at?: unknown }>;
  if (rows.length !== 1 || typeof rows[0].updated_at !== 'string') throw new Error('Supabase returned an invalid initialization response.');
  return rows[0].updated_at;
};

export const savePublishedContent = async (
  payload: Record<string, unknown>,
  accessToken: string,
  expectedUpdatedAt: string,
): Promise<string> => {
  const response = await request(
    `/rest/v1/site_content?id=eq.${CONTENT_ROW_ID}&updated_at=eq.${encodeURIComponent(expectedUpdatedAt)}&select=updated_at`,
    {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({ payload }),
  }, accessToken);
  if (!response.ok) throw new Error('Could not save content to Supabase.');
  const rows = await response.json() as Array<{ updated_at?: unknown }>;
  if (rows.length === 0) throw new PublishedContentConflictError();
  if (rows.length !== 1 || typeof rows[0].updated_at !== 'string') {
    throw new Error('Supabase returned an invalid save response.');
  }
  return rows[0].updated_at;
};

const fromDatabaseMessage = (message: Record<string, unknown>): ContactMessage => ({
  id: String(message.id),
  name: String(message.name || ''),
  email: String(message.email || ''),
  subject: String(message.subject || ''),
  service: String(message.service || ''),
  message: String(message.message || ''),
  createdAt: typeof message.created_at === 'string' ? message.created_at : undefined,
  status: message.status === 'read' || message.status === 'replied' ? message.status : 'unread',
});

export const CONTACT_MESSAGES_PAGE_SIZE = 50;

export interface ContactMessageCursor {
  createdAt: string;
  id: string;
}

export const loadContactMessages = async (
  accessToken: string,
  cursor?: ContactMessageCursor,
  limit = CONTACT_MESSAGES_PAGE_SIZE,
): Promise<ContactMessage[]> => {
  const params = new URLSearchParams({
    select: '*',
    order: 'created_at.desc,id.desc',
    limit: String(limit),
  });
  if (cursor) {
    params.set('or', `(created_at.lt.${cursor.createdAt},and(created_at.eq.${cursor.createdAt},id.lt.${cursor.id}))`);
  }
  const response = await request(
    `/rest/v1/contact_messages?${params.toString()}`,
    {},
    accessToken,
  );
  if (!response.ok) throw new Error('Could not load contact messages.');
  return (await response.json() as Record<string, unknown>[]).map(fromDatabaseMessage);
};

export const loadAllContactMessages = async (accessToken: string): Promise<ContactMessage[]> => {
  const messages: ContactMessage[] = [];
  let cursor: ContactMessageCursor | undefined;
  while (true) {
    const page = await loadContactMessages(accessToken, cursor);
    messages.push(...page);
    if (page.length < CONTACT_MESSAGES_PAGE_SIZE) return messages;
    const last = page[page.length - 1];
    if (!last.createdAt || last.id === cursor?.id) throw new Error('Inbox export cursor is invalid. No incomplete backup was created.');
    cursor = { createdAt: last.createdAt, id: last.id };
  }
};

export const restorePortfolioBackup = async (payload: Record<string, unknown>, messages: ContactMessage[], expectedVersion: string | null, accessToken: string): Promise<string> => {
  const response = await request('/rest/v1/rpc/restore_portfolio_backup', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content_payload: payload, inbox_messages: messages.map((message) => ({
      id: message.id, name: message.name, email: message.email, subject: message.subject,
      service: message.service, message: message.message, status: message.status,
      created_at: message.createdAt || message.timestamp || new Date().toISOString(),
    })), expected_version: expectedVersion }),
  }, accessToken);
  if (!response.ok) throw new Error('Hosted restore failed. No data was restored. Check the database migration and refresh before retrying.');
  const version: unknown = await response.json();
  if (typeof version !== 'string') throw new Error('Invalid restore response.');
  return version;
};

export interface PortfolioRevision {
  revisionId: number;
  replacedAt: string;
}

export const listPortfolioRevisions = async (accessToken: string): Promise<PortfolioRevision[]> => {
  try {
    const response = await request('/rest/v1/rpc/list_portfolio_revisions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    }, accessToken);
    if (!response.ok) return [];
    const rows = await response.json() as Array<{ revision_id: number; replaced_at: string }>;
    if (!Array.isArray(rows)) return [];
    return rows.map(r => ({ revisionId: Number(r.revision_id), replacedAt: String(r.replaced_at) }));
  } catch {
    return [];
  }
};

export const restorePortfolioRevision = async (revisionId: number, accessToken: string): Promise<boolean> => {
  const response = await request('/rest/v1/rpc/restore_portfolio_revision', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ target_revision_id: revisionId }),
  }, accessToken);
  if (!response.ok) throw new Error('Could not restore revision. Apply the revisions RPC migration first.');
  return Boolean(await response.json());
};

export const listUnusedMedia = async (accessToken: string): Promise<string[]> => {
  const response = await request('/rest/v1/rpc/portfolio_media_cleanup_candidates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }, accessToken);
  if (!response.ok) throw new Error('Could not inspect unused media. Apply the updated migration.');
  const rows: unknown = await response.json();
  if (!Array.isArray(rows) || rows.some(row => !row || typeof row.name !== 'string' || !row.name || row.name.startsWith('/') || row.name.split('/').includes('..'))) {
    throw new Error('The media review returned an invalid file list. Nothing was deleted.');
  }
  return [...new Set(rows.map(row => row.name as string))];
};

/** Delete only files explicitly reviewed and still eligible at execution time. */
export const cleanupUnusedMedia = async (accessToken: string, reviewedNames: string[]): Promise<number> => {
  if (!reviewedNames.length) return 0;
  const eligible = new Set(await listUnusedMedia(accessToken));
  const names = [...new Set(reviewedNames)].filter(name => eligible.has(name));
  for (let index = 0; index < names.length; index += 100) {
    if (index > 0) {
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    const removed = await request(`/storage/v1/object/${MEDIA_BUCKET}`, {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prefixes: names.slice(index, index + 100) }),
    }, accessToken);
    if (!removed.ok) throw new Error('Media cleanup did not complete. Retry to remove the remaining files.');
  }
  return names.length;
};

const requireAffectedMessage = async (response: Response, failureMessage: string) => {
  if (!response.ok) throw new Error(failureMessage);
  const rows = await response.json() as Array<{ id?: unknown }>;
  if (rows.length !== 1) throw new Error(failureMessage);
};

export const updateContactMessageStatus = async (
  id: string,
  status: ContactMessage['status'],
  accessToken: string,
) => {
  const response = await request(`/rest/v1/contact_messages?id=eq.${encodeURIComponent(id)}&select=id`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({ status }),
  }, accessToken);
  await requireAffectedMessage(response, 'Could not update the contact message.');
};

export const markAllContactMessagesAsRead = async (accessToken: string) => {
  const response = await request('/rest/v1/contact_messages?status=eq.unread', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ status: 'read' }),
  }, accessToken);
  if (!response.ok) throw new Error('Could not mark contact messages as read.');
};

export const deleteContactMessage = async (id: string, accessToken: string) => {
  const response = await request(`/rest/v1/contact_messages?id=eq.${encodeURIComponent(id)}&select=id`, {
    method: 'DELETE',
    headers: { Prefer: 'return=representation' },
  }, accessToken);
  await requireAffectedMessage(response, 'Could not delete the contact message.');
};

const extensionFor = (name: string, contentType: string) => {
  const supplied = name.split('.').pop()?.toLowerCase();
  if (supplied && /^[a-z0-9]{1,10}$/.test(supplied)) return supplied;
  return contentType === 'application/pdf' ? 'pdf' : contentType === 'image/png' ? 'png' : contentType === 'image/webp' ? 'webp' : 'jpg';
};

export const uploadPublicMedia = async (file: Blob, fileName: string, accessToken: string, signal?: AbortSignal): Promise<string> => {
  const { url } = requireConfig();
  const contentType = file.type || 'application/octet-stream';
  const path = `uploads/${crypto.randomUUID()}.${extensionFor(fileName, contentType)}`;
  const controller = new AbortController();
  const abort = () => controller.abort(signal?.reason);
  if (signal?.aborted) throw signal.reason;
  signal?.addEventListener('abort', abort, { once: true });
  const timeout = setTimeout(() => controller.abort(new DOMException('Upload timed out', 'TimeoutError')), 30_000);
  try {
  const response = await fetch(`${url}/storage/v1/object/${MEDIA_BUCKET}/${path}`, {
    method: 'POST',
    headers: jsonHeaders(accessToken, { 'Content-Type': contentType, 'x-upsert': 'false' }),
    body: file,
    signal: controller.signal,
  });
  if (!response.ok) throw new Error('Could not upload media to Supabase Storage.');
  return `${url}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
  }
};

