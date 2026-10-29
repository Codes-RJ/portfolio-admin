import { contentDefaults } from '@/data/contentDefaults';
import { useEffect } from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import content from '@/data/publishedContent.json';
import { ThemeProvider } from '@/context/ThemeContext';
import { DataProvider, useData } from '@/context/DataContext';
import { contentDraftKey } from '@/lib/contentDraft';
import { useContentSlice } from '@/context/contentSubscriptions';

const mocks = vi.hoisted(() => ({
  load: vi.fn(), save: vi.fn(), restore: vi.fn(), inbox: vi.fn(), allInbox: vi.fn(), deleteMessage: vi.fn(), updateStatus: vi.fn(),
  session: { mode: 'supabase', isAdmin: true, userId: 'admin', accessToken: 'token' } as { mode: 'supabase'; isAdmin: boolean; userId: string; accessToken: string } | null,
}));
vi.mock('@/context/AuthContext', () => ({ useAuth: () => ({ session: mocks.session }) }));
vi.mock('@/lib/supabase', async importOriginal => ({
  ...await importOriginal<typeof import('@/lib/supabase')>(),
  isSupabaseConfigured: true,
  loadPublishedContent: mocks.load,
  savePublishedContent: mocks.save,
  restorePortfolioBackup: mocks.restore,
  loadContactMessages: mocks.inbox,
  loadAllContactMessages: mocks.allInbox,
  deleteContactMessage: mocks.deleteMessage,
  updateContactMessageStatus: mocks.updateStatus,
}));
let workspace: ReturnType<typeof useData>;
function Editor() { const current = useData(); useEffect(() => { workspace = current; }); return <output>{current.contentSyncState}</output>; }
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  mocks.session = { mode: 'supabase', isAdmin: true, userId: 'admin', accessToken: 'token' };
  vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
  const { messages: _messages, exportedAt: _exportedAt, ...publicContent } = content;
  mocks.load.mockResolvedValue({ payload: { ...publicContent, profile: { ...content.profile, name: 'Hosted Name' } }, updatedAt: '2026-09-01T00:00:00Z' });
  mocks.save.mockResolvedValue('2026-09-02T00:00:00Z');
  mocks.restore.mockResolvedValue('2026-09-03T00:00:00Z');
  mocks.inbox.mockResolvedValue([]);
  mocks.deleteMessage.mockResolvedValue(undefined);
  mocks.updateStatus.mockResolvedValue(undefined);
  mocks.allInbox.mockResolvedValue(Array.from({ length: 125 }, (_, i) => ({ id: `message-${i}`, name: 'Ada', email: 'ada@example.com', message: 'Hello', subject: '', service: '', status: 'unread', timestamp: '2026-09-01T00:00:00Z', createdAt: '2026-09-01T00:00:00Z' })));
});
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

it('activates hosted cache, recovers an invalid draft, and persists a full backup restore', async () => {
  render(<ThemeProvider><DataProvider><Editor /></DataProvider></ThemeProvider>);
  await waitFor(() => expect(workspace.profile.name).toBe('Hosted Name'));
  await waitFor(() => expect(workspace.contentSyncState).toBe('ready'));
  expect(localStorage.getItem('rohanos_data_store_active_bundle_version_hosted')).toBeTruthy();
  act(() => workspace.updateProfile({ name: '' }));
  await waitFor(() => expect(workspace.contentSyncState).toBe('invalid'), { timeout: 3000 });
  expect(mocks.save).not.toHaveBeenCalled();
  act(() => workspace.updateProfile({ name: 'Corrected Name' }));
  await waitFor(() => expect(mocks.save).toHaveBeenCalled(), { timeout: 3000 });
  await waitFor(() => expect(workspace.contentSyncState).toBe('ready'));
  act(() => workspace.replaceContentSlice('toolsList', workspace.toolsList.map((tool, index) => index === 0 ? { ...tool, name: 'Hosted edited tool' } : tool)));
  await waitFor(() => expect(mocks.save).toHaveBeenLastCalledWith(expect.objectContaining({ toolsList: expect.arrayContaining([expect.objectContaining({ name: 'Hosted edited tool' })]) }), 'token', expect.any(String)), { timeout: 3000 });
  await waitFor(() => expect(workspace.contentSyncState).toBe('ready'));
  expect(() => workspace.replaceContentSlice('toolsList', [{ id: 'same', name: 'One', icon: '' }, { id: 'same', name: 'Two', icon: '' }])).toThrow('unique');
  expect(workspace.toolsList[0].name).toBe('Hosted edited tool');
  const backup = await workspace.exportDataJSON();
  expect(JSON.parse(backup).messages).toHaveLength(125);
  await act(async () => { expect(await workspace.importDataJSON(backup)).toBe(true); });
  expect(mocks.restore).toHaveBeenCalledWith(expect.objectContaining({ profile: expect.objectContaining({ name: 'Corrected Name' }) }), expect.any(Array), '2026-09-02T00:00:00Z', 'token');
  // The restore merges in the database, then reloads the first inbox page to
  // avoid skipping retained messages between backup IDs during pagination.
  expect(mocks.inbox).toHaveBeenCalledTimes(2);
  expect(workspace.messages).toHaveLength(0);
  expect(workspace.contentSyncState).toBe('ready');
  mocks.restore.mockRejectedValueOnce(new Error('Database unavailable'));
  await act(async () => { await expect(workspace.importDataJSON(backup)).rejects.toThrow('Database unavailable'); });
  expect(workspace.contentSyncState).toBe('failed');
}, 10_000);

it('preserves failed drafts across a reload and recovers only on request', async () => {
  mocks.save.mockRejectedValueOnce(new Error('Offline'));
  const first = render(<ThemeProvider><DataProvider><Editor /></DataProvider></ThemeProvider>);
  await waitFor(() => expect(workspace.contentSyncState).toBe('ready'));
  act(() => workspace.updateProfile({ name: 'Unsaved draft' }));
  await waitFor(() => expect(workspace.contentSyncState).toBe('failed'), { timeout: 3000 });
  first.unmount();
  render(<ThemeProvider><DataProvider><Editor /></DataProvider></ThemeProvider>);
  await waitFor(() => expect(workspace.recoverableDraft?.content.profile.name).toBe('Unsaved draft'));
  expect(workspace.profile.name).toBe('Hosted Name');
  expect(mocks.save).toHaveBeenCalledTimes(1);
  act(() => workspace.recoverDraft());
  expect(workspace.profile.name).toBe('Unsaved draft');
  await waitFor(() => expect(mocks.save).toHaveBeenCalledTimes(2), { timeout: 3000 });
  await waitFor(() => expect(workspace.contentSyncState).toBe('ready'));
  expect(localStorage.getItem(contentDraftKey(import.meta.env.VITE_SUPABASE_URL || 'hosted', 'admin'))).toBeNull();
});

it('pauses autosave while restore drains an earlier save and awaits its RPC', async () => {
  let finishSave!: (version: string) => void;
  let finishRestore!: (version: string) => void;
  mocks.save.mockImplementationOnce(() => new Promise<string>(resolve => { finishSave = resolve; }));
  mocks.restore.mockImplementationOnce(() => new Promise<string>(resolve => { finishRestore = resolve; }));
  render(<ThemeProvider><DataProvider><Editor /></DataProvider></ThemeProvider>);
  await waitFor(() => expect(workspace.contentSyncState).toBe('ready'));
  act(() => workspace.updateProfile({ name: 'Older queued edit' }));
  await waitFor(() => expect(mocks.save).toHaveBeenCalledTimes(1), { timeout: 3000 });
  let restoration!: Promise<boolean>;
  act(() => { restoration = workspace.importDataJSON(JSON.stringify(content)); });
  await waitFor(() => expect(workspace.contentEditingBlocked).toBe(true));
  await act(async () => { finishSave('2026-10-20T00:00:00Z'); });
  await waitFor(() => expect(mocks.restore).toHaveBeenCalledTimes(1));
  await act(async () => { await new Promise(resolve => setTimeout(resolve, 850)); });
  expect(mocks.save).toHaveBeenCalledTimes(1);
  await act(async () => { finishRestore('2026-10-20T01:00:00Z'); expect(await restoration).toBe(true); });
  expect(workspace.profile.name).toBe(content.profile.name);
  expect(workspace.contentEditingBlocked).toBe(false);
}, 10_000);

it('does not apply an old account restore response after sign-out', async () => {
  let finishRestore!: (version: string) => void;
  mocks.restore.mockImplementationOnce(() => new Promise<string>(resolve => { finishRestore = resolve; }));
  const workspaceView = <ThemeProvider><DataProvider><Editor /></DataProvider></ThemeProvider>;
  const view = render(workspaceView);
  await waitFor(() => expect(workspace.contentSyncState).toBe('ready'));
  let restoration!: Promise<boolean>;
  const backup = JSON.stringify({ ...content, profile: { ...content.profile, name: 'Old account response' } });
  act(() => { restoration = workspace.importDataJSON(backup); });
  await waitFor(() => expect(mocks.restore).toHaveBeenCalledTimes(1));
  mocks.session = null;
  view.rerender(<ThemeProvider><DataProvider><Editor /></DataProvider></ThemeProvider>);
  await waitFor(() => expect(workspace.messages).toHaveLength(0));
  await act(async () => { finishRestore('2026-10-20T01:00:00Z'); expect(await restoration).toBe(true); });
  expect(workspace.profile.name).not.toBe('Old account response');
  expect(mocks.inbox).toHaveBeenCalledTimes(1);
});

it('keeps a stale draft available for export without overwriting newer content', async () => {
  localStorage.setItem(contentDraftKey(import.meta.env.VITE_SUPABASE_URL || 'hosted', 'admin'), JSON.stringify({
    version: 1, savedAt: new Date().toISOString(), baseVersion: 'older-version', content: { ...contentDefaults, profile: { ...contentDefaults.profile, name: 'Old draft' } },
  }));
  render(<ThemeProvider><DataProvider><Editor /></DataProvider></ThemeProvider>);
  await waitFor(() => expect(workspace.recoverableDraft).not.toBeNull());
  act(() => workspace.recoverDraft());
  expect(workspace.profile.name).toBe('Hosted Name');
  expect(workspace.draftStorageError).toContain('changed');
  expect(JSON.parse(workspace.exportDraftJSON()).content.profile.name).toBe('Old draft');
  expect(mocks.save).not.toHaveBeenCalled();
});

it('restores a valid backup over invalid hosted content using its concurrency version', async () => {
  mocks.load.mockResolvedValueOnce({ payload: { schemaVersion: 1 }, updatedAt: '2026-10-01T00:00:00Z' });
  render(<ThemeProvider><DataProvider><Editor /></DataProvider></ThemeProvider>);
  await waitFor(() => expect(workspace.contentSyncState).toBe('failed'));
  expect(workspace.contentEditingBlocked).toBe(true);
  await act(async () => { expect(await workspace.importDataJSON(JSON.stringify(content))).toBe(true); });
  expect(mocks.restore).toHaveBeenCalledWith(expect.objectContaining({ schemaVersion: 1 }), [], '2026-10-01T00:00:00Z', 'token');
  expect(workspace.contentSyncState).toBe('ready');
  expect(workspace.contentEditingBlocked).toBe(false);
});

it('flushes the latest edit on unmount before the storage debounce runs', async () => {
  const view = render(<ThemeProvider><DataProvider><Editor /></DataProvider></ThemeProvider>);
  await waitFor(() => expect(workspace.contentSyncState).toBe('ready'));
  act(() => workspace.updateProfile({ name: 'Last instant edit' }));
  view.unmount();
  const raw = localStorage.getItem(contentDraftKey(import.meta.env.VITE_SUPABASE_URL || 'hosted', 'admin'));
  expect(JSON.parse(raw!).content.profile.name).toBe('Last instant edit');
  expect(mocks.save).not.toHaveBeenCalled();
});

it('flushes an administrator draft on sign-out and restores the public view', async () => {
  const tree = <ThemeProvider><DataProvider><Editor /></DataProvider></ThemeProvider>;
  const view = render(tree);
  await waitFor(() => expect(workspace.contentSyncState).toBe('ready'));
  act(() => workspace.updateProfile({ name: 'Edit before sign-out' }));
  mocks.session = null;
  view.rerender(<ThemeProvider><DataProvider><Editor /></DataProvider></ThemeProvider>);
  await waitFor(() => expect(workspace.profile.name).toBe('Hosted Name'));
  const raw = localStorage.getItem(contentDraftKey(import.meta.env.VITE_SUPABASE_URL || 'hosted', 'admin'));
  expect(JSON.parse(raw!).content.profile.name).toBe('Edit before sign-out');
  expect(mocks.save).not.toHaveBeenCalled();
});

it('protects an unreadable draft until it is exported or explicitly discarded', async () => {
  const key = contentDraftKey(import.meta.env.VITE_SUPABASE_URL || 'hosted', 'admin');
  const raw = '{broken saved content';
  localStorage.setItem(key, raw);
  render(<ThemeProvider><DataProvider><Editor /></DataProvider></ThemeProvider>);
  await waitFor(() => expect(workspace.draftRecoveryRequired).toBe(true));
  expect(workspace.contentEditingBlocked).toBe(true);
  expect(workspace.exportDraftJSON()).toBe(raw);
  await new Promise(resolve => setTimeout(resolve, 850));
  expect(localStorage.getItem(key)).toBe(raw);
  expect(mocks.save).not.toHaveBeenCalled();
  act(() => workspace.discardDraft());
  expect(localStorage.getItem(key)).toBeNull();
  expect(workspace.contentEditingBlocked).toBe(false);
});

it('keeps a confirmed restore successful when browser draft cleanup is blocked', async () => {
  render(<ThemeProvider><DataProvider><Editor /></DataProvider></ThemeProvider>);
  await waitFor(() => expect(workspace.contentSyncState).toBe('ready'));
  const original = Storage.prototype.removeItem;
  vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(function(this: Storage, key) {
    if (key.startsWith('rohanos_editor_draft_')) throw new DOMException('Storage blocked', 'SecurityError');
    original.call(this, key);
  });
  await act(async () => { expect(await workspace.importDataJSON(JSON.stringify(content))).toBe(true); });
  expect(workspace.profile.name).toBe(contentDefaults.profile.name);
  expect(workspace.contentSyncState).toBe('ready');
  expect(workspace.draftStorageError).toContain('Restore succeeded');
});

it('keeps failed inbox changes visible and retries with pending feedback', async () => {
  mocks.inbox.mockResolvedValueOnce([{ id: 'message-1', name: 'Ada', email: 'ada@example.com', subject: '', service: '', message: 'Hello', status: 'unread' }]);
  mocks.updateStatus.mockRejectedValueOnce(new Error('Offline'));
  render(<ThemeProvider><DataProvider><Editor /></DataProvider></ThemeProvider>);
  await waitFor(() => expect(workspace.messages).toHaveLength(1));
  act(() => workspace.updateMessageStatus('message-1', 'read'));
  expect(workspace.pendingMessageIds).toContain('message-1');
  await waitFor(() => expect(workspace.messagesError).toContain('action failed'));
  expect(workspace.messages[0].status).toBe('unread');
  act(() => workspace.retryMessageMutation());
  await waitFor(() => expect(workspace.messages[0].status).toBe('read'));
  expect(workspace.pendingMessageIds).toEqual([]);
});

it('does not rerender unrelated public content consumers for profile edits or inbox changes', async () => {
  let projectRenders = 0;
  function ProjectsProbe() { useContentSlice('projects'); projectRenders++; return null; }
  render(<ThemeProvider><DataProvider><Editor /><ProjectsProbe /></DataProvider></ThemeProvider>);
  await waitFor(() => expect(workspace.contentSyncState).toBe('ready'));
  const afterLoad = projectRenders;
  act(() => workspace.updateProfile({ name: 'Changed profile' }));
  expect(projectRenders).toBe(afterLoad);
  act(() => workspace.addMessage({ name: 'Ada', email: 'ada@example.com', subject: '', service: '', message: 'Hello' }));
  expect(projectRenders).toBe(afterLoad);
});
