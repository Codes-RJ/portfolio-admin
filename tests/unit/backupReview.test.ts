import { expect, it } from 'vitest';
import { mergeBackupMessages, parseBackupJSON } from '@/lib/backupReview';
import content from '@/data/publishedContent.json';
import type { ContactMessage } from '@/data/initialData';

it('validates backup review using the restore contract before accepting it', () => {
  expect(parseBackupJSON(JSON.stringify(content)).profile.name).toBe(content.profile.name);
  expect(() => parseBackupJSON(JSON.stringify({ ...content, projects: [{ id: 'invalid' }] }))).toThrow();
  expect(() => parseBackupJSON('{broken')).toThrow();
});

it('updates matching message states and retains messages absent from a backup', () => {
  const base: ContactMessage = { id: 'match', name: 'Ada', email: 'ada@example.com', subject: '', service: '', message: 'Inquiry', status: 'read', createdAt: '2026-10-20T12:00:00Z' };
  const unrelated = { ...base, id: 'retained' };
  const restored = mergeBackupMessages([base, unrelated], [{ ...base, status: 'unread' }, { ...base, id: 'added' }]);
  expect(restored).toHaveLength(3);
  expect(restored.find(message => message.id === 'match')?.status).toBe('unread');
  expect(restored.find(message => message.id === 'retained')).toEqual(unrelated);
});
