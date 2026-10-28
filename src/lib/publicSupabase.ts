// Shared public configuration and read-only content access. No admin/session code.
import { isServerCredential } from './browserKey';
const projectUrl = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/\/$/, '');
export const publicProjectUrl = projectUrl;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() || import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
const placeholder = (value?: string) => !value || /your-project|replace_with|example\.supabase/i.test(value);
export const supabaseConfigurationError = (() => {
  if (!projectUrl && !publishableKey) return null;
  if (!projectUrl || !publishableKey) return 'Both VITE_SUPABASE_URL and a Supabase publishable key are required.';
  if (isServerCredential(publishableKey)) return 'A server credential cannot be used as a browser publishable key.';
  try {
    const url = new URL(projectUrl);
    if (url.username || url.password || url.search || url.hash || url.pathname !== '/' || placeholder(projectUrl) || placeholder(publishableKey) || (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)))) return 'Supabase settings still contain placeholders or an invalid project URL.';
  } catch { return 'Supabase settings still contain placeholders or an invalid project URL.'; }
  return null;
})();
export const isSupabaseConfigured = Boolean(projectUrl && publishableKey && !supabaseConfigurationError);
export interface PublishedContentDocument { payload: unknown; updatedAt: string }
export async function loadPublishedContent(signal?: AbortSignal): Promise<PublishedContentDocument | null> {
  if (!isSupabaseConfigured) return null;
  const response = await fetch(`${projectUrl}/rest/v1/site_content?id=eq.portfolio&select=payload,updated_at`, {
    headers: { apikey: publishableKey! }, signal: signal ?? AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error('Could not load published content.');
  const rows: unknown = await response.json();
  if (!Array.isArray(rows)) throw new Error('Invalid published document.');
  if (!rows.length) return null;
  const row = rows[0] as Record<string, unknown>;
  if (typeof row.updated_at !== 'string' || !Number.isFinite(Date.parse(row.updated_at))) throw new Error('Published content returned an invalid document.');
  return { payload: row.payload, updatedAt: row.updated_at };
}
