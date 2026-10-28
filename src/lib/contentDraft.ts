import { publishedContentSchema, type ValidatedPublishedContent } from './validation';
import { normalizeLegacyContent } from './contentCompatibility';

export interface ContentDraft {
  version: 1;
  baseVersion: string | null;
  savedAt: string;
  content: ValidatedPublishedContent;
}

// Drafts survive bundle upgrades and are scoped to a backend and administrator.
// They contain public content only; inbox messages and access tokens stay out.
export const contentDraftKey = (backend: string, userId: string) =>
  `rohanos_editor_draft_v1:${backend}:${userId}`;

export function readContentDraft(key: string): ContentDraft | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  const draft = JSON.parse(raw) as ContentDraft;
  if (draft.version !== 1 || !draft.content || draft.content.schemaVersion !== 1 || typeof draft.savedAt !== 'string') {
    throw new Error('The saved draft format is unsupported. Export it before clearing browser storage.');
  }
  const normalized = normalizeLegacyContent(draft.content);
  const shape = publishedContentSchema.safeParse(normalized);
  if (!shape.success && shape.error.issues.some(issue => ['invalid_type', 'unrecognized_keys', 'invalid_union', 'invalid_value'].includes(issue.code))) {
    throw new Error('The saved draft is damaged. Export the saved draft file before discarding it.');
  }
  // Incomplete field values are intentional drafts, so publication validation
  // belongs at save time rather than here.
  return { ...draft, content: shape.success ? shape.data : normalized as ValidatedPublishedContent };
}

export function clearConfirmedDraft(key: string, content: ValidatedPublishedContent) {
  const draft = readContentDraft(key);
  if (draft && JSON.stringify(draft.content) === JSON.stringify(content)) localStorage.removeItem(key);
}
