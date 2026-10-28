/** Resolve public-page actions across the independent Studio and portfolio origins. */
export function portfolioPageUrl(path = '/', configured = import.meta.env.VITE_SITE_URL, development = import.meta.env.DEV): string | null {
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) return null;
  if (configured?.trim()) {
    try {
      const url = new URL(configured.trim());
      if (url.protocol === 'https:' && !url.username && !url.password && !/your-domain|example\.com/i.test(url.hostname)) {
        return new URL(path, url.origin).href;
      }
    } catch { /* An invalid canonical origin must not produce a broken or unsafe link. */ }
  }
  return development ? `/preview${path}` : null;
}
