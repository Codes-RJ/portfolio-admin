/** Reject server credentials without logging or echoing their values. */
export function isServerCredential(value: string): boolean {
  if (/^(?:sb_secret_|sbp_|re_[A-Za-z0-9_]{24,})/.test(value)) return true;
  const parts = value.split('.');
  if (parts.length !== 3) return false;
  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload?.role === 'service_role';
  } catch { return false; }
}

export function assertBrowserEnvironment(environment: Record<string, string | undefined>): void {
  for (const [name, value] of Object.entries(environment)) {
    if (name.startsWith('VITE_') && value && isServerCredential(value.trim())) throw new Error(`Server credentials are forbidden in browser environment variable ${name}. Use the publishable key and rotate any credential previously exposed.`);
  }
}
