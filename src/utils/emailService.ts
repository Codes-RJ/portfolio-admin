import { contactPayloadSchema } from '../lib/validation';

export interface EmailPayload {
  name: string;
  email: string;
  subject?: string;
  service?: string;
  message: string;
}

export interface EmailDispatchResult {
  success: boolean;
  status: string;
  message: string;
  requestId?: string;
  retryAfterSeconds?: number;
  fieldErrors?: Partial<Record<keyof EmailPayload, string>>;
}

const isRequestId = (value: string | null | undefined): value is string => Boolean(value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value));
const fieldNames = new Set<keyof EmailPayload>(['name', 'email', 'subject', 'service', 'message']);

const readFieldErrors = (value: unknown): EmailDispatchResult['fieldErrors'] => {
  if (!value || typeof value !== 'object') return undefined;
  const errors: EmailDispatchResult['fieldErrors'] = {};
  for (const [key, message] of Object.entries(value)) {
    if (fieldNames.has(key as keyof EmailPayload) && typeof message === 'string' && message.trim() && message.length <= 300) {
      errors[key as keyof EmailPayload] = message;
    }
  }
  return Object.keys(errors).length ? errors : undefined;
};

const readRetryAfter = (value: string | null) => {
  if (!value?.trim()) return undefined;
  const seconds = /^\d+$/.test(value.trim()) ? Number(value) : Math.ceil((Date.parse(value) - Date.now()) / 1_000);
  return Number.isFinite(seconds) && seconds > 0 ? Math.min(86_400, Math.ceil(seconds)) : undefined;
};

// Vercel serves the bundled contact relay at this path. The variable remains
// available for deployments that need a different same-origin path.
const contactEndpoint = import.meta.env.VITE_CONTACT_ENDPOINT?.trim() || '/api/contact';

/**
 * Sends validated contact data to an optional same-origin serverless endpoint.
 * Keeping the endpoint same-origin preserves the site's strict CSP and avoids
 * sending visitor messages to an unreviewed third party.
 */
export async function sendContactEmail(payload: EmailPayload, requestId: string = crypto.randomUUID()): Promise<EmailDispatchResult> {
  const reference = isRequestId(requestId) ? requestId : crypto.randomUUID();
  const parsed = contactPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors: EmailDispatchResult['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof EmailPayload;
      if (fieldNames.has(field) && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return { success: false, status: '422 Validation failed', message: 'Please check the highlighted contact details.', fieldErrors };
  }
  let endpoint: URL;
  try {
    endpoint = new URL(contactEndpoint, window.location.origin);
  } catch {
    return { success: false, status: '400 Invalid contact endpoint', message: 'Contact delivery is unavailable. Please use email directly.' };
  }
  if (endpoint.origin !== window.location.origin) {
    return {
      success: false,
      status: '400 Invalid contact endpoint',
      message: 'Contact delivery must use a same-origin endpoint.',
    };
  }

  const controller = new AbortController();
  // Three bounded server operations may take up to 24 seconds in total.
  const timeout = window.setTimeout(() => controller.abort(), 30_000);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'Idempotency-Key': reference },
      body: JSON.stringify(parsed.data),
      signal: controller.signal,
    });
    const result: unknown = await response.json().catch(() => null);
    const responseReference = response.headers.get('X-Request-Id');
    const metadata = { requestId: isRequestId(responseReference) ? responseReference : reference };
    if (!response.ok) {
      const retryAfterSeconds = readRetryAfter(response.headers.get('Retry-After'));
      if (response.status === 422) {
        return {
          ...metadata, success: false, status: '422 Validation failed', message: 'Please check the highlighted contact details.',
          fieldErrors: readFieldErrors(result && typeof result === 'object' && 'fieldErrors' in result ? result.fieldErrors : undefined),
        };
      }
      if (response.status === 429) {
        return { ...metadata, success: false, status: '429 Too many messages', retryAfterSeconds: retryAfterSeconds ?? 60, message: 'Too many messages were sent. Please wait before trying again, or use email directly.' };
      }
      if (response.status === 503) {
        return { ...metadata, success: false, status: '503 Contact service unavailable', retryAfterSeconds, message: 'Message delivery is temporarily unavailable. Please try again shortly or use email directly.' };
      }
      return { ...metadata, success: false, status: `${response.status} Contact service error`, message: 'We could not confirm delivery. Your message is still here; retry or use email directly.' };
    }
    if (!result || typeof result !== 'object' || !('success' in result) || result.success !== true) {
      return { ...metadata, success: false, status: '502 Invalid contact service response', message: 'We could not confirm delivery. Your message is still here; retry or use email directly.' };
    }
    return { ...metadata, success: true, status: `${response.status} Received`, message: 'Thanks — your message has been received.' };
  } catch {
    return { requestId: reference, success: false, status: '503 Contact service unavailable', message: 'We could not confirm delivery. Your message is still here; retry or use email directly.' };
  } finally {
    window.clearTimeout(timeout);
  }
}
