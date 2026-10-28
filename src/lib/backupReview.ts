import type { ContactMessage } from '../data/initialData';
import { backupSchema } from './validation';

/** The same validation and compatibility rules are used for review and restore. */
export function parseBackupJSON(json: string) {
  const candidate: unknown = JSON.parse(json);
  const versioned = candidate && typeof candidate === 'object' && !('schemaVersion' in candidate)
    ? { ...candidate, schemaVersion: 1 } : candidate;
  return backupSchema.parse(versioned);
}

/** Restore updates matching IDs, adds missing messages and retains other messages. */
export function mergeBackupMessages(current: ContactMessage[], restored: ContactMessage[]) {
  const merged = new Map(current.map(message => [message.id, message]));
  restored.forEach(message => merged.set(message.id, message));
  return [...merged.values()].sort((left, right) =>
    (right.createdAt || right.timestamp || '').localeCompare(left.createdAt || left.timestamp || '') || right.id.localeCompare(left.id));
}
