import { validatePublishedContent, type ValidatedPublishedContent } from './validation';

export const CONTENT_BOOTSTRAP_ID = 'portfolio-public-content';
export interface ContentBootstrap { content: ValidatedPublishedContent; updatedAt: string | null }

export function serializeContentBootstrap(content: ValidatedPublishedContent, updatedAt: string | null) {
  return JSON.stringify({ content, updatedAt }).replace(/</g, '\\u003c').replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

export function readContentBootstrap(): ContentBootstrap | null {
  if (typeof document === 'undefined') return null;
  const element = document.getElementById(CONTENT_BOOTSTRAP_ID);
  if (!element?.textContent) return null;
  try {
    const candidate = JSON.parse(element.textContent);
    if (candidate.updatedAt !== null && (typeof candidate.updatedAt !== 'string' || !Number.isFinite(Date.parse(candidate.updatedAt)))) return null;
    return { content: validatePublishedContent(candidate.content), updatedAt: candidate.updatedAt };
  } catch { return null; }
}
