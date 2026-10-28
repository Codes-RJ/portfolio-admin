/**
 * Browser-only abuse friction. These values are deliberately not treated as
 * security controls: a visitor can clear local storage. Server-side RLS,
 * authentication, and rate limits protect real data.
 */
const CONTACT_THROTTLE_KEY = 'rohanos_contact_throttle_v2';
const CONTACT_WINDOW_MS = 5 * 60 * 1000;
const CONTACT_MAX_SUBMISSIONS = 3;

function readTimestamps(): number[] {
  try {
    const raw = localStorage.getItem(CONTACT_THROTTLE_KEY);
    const values: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(values)) return [];
    const now = Date.now();
    return values.filter((value): value is number => typeof value === 'number' && now - value < CONTACT_WINDOW_MS);
  } catch {
    return [];
  }
}

export function checkContactFormThrottling(): { allowed: boolean; waitSeconds: number } {
  const timestamps = readTimestamps();
  if (timestamps.length < CONTACT_MAX_SUBMISSIONS) return { allowed: true, waitSeconds: 0 };
  return {
    allowed: false,
    waitSeconds: Math.max(1, Math.ceil((timestamps[0] + CONTACT_WINDOW_MS - Date.now()) / 1000)),
  };
}

export function recordContactFormSubmission(): void {
  try {
    localStorage.setItem(CONTACT_THROTTLE_KEY, JSON.stringify([...readTimestamps(), Date.now()]));
  } catch {
    // Storage can be unavailable in privacy modes. The server remains authoritative.
  }
}
