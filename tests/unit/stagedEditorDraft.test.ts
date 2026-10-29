import { act, renderHook } from '@testing-library/react';
import { beforeEach, expect, it } from 'vitest';
import { useStagedEditorDraft } from '@/hooks/useStagedEditorDraft';

beforeEach(() => localStorage.clear());
it('recovers account-scoped editor buffers across navigation and reload without publishing them', () => {
  const first = renderHook(() => useStagedEditorDraft('admin:one', 'website', { name: 'Published' }));
  act(() => first.result.current.setDraft({ name: 'Private edit' }));
  first.unmount();
  const restored = renderHook(() => useStagedEditorDraft('admin:one', 'website', { name: 'Published' }));
  expect(restored.result.current.draft).toEqual({ name: 'Private edit' });
  expect(restored.result.current.stale).toBe(false);
  expect(renderHook(() => useStagedEditorDraft('admin:two', 'website', { name: 'Published' })).result.current.draft).toBeNull();
  act(() => restored.result.current.setDraft(null));
  expect(localStorage.getItem('admin:one')).toBeNull();
});
it('blocks a stale staged draft from silently replacing newer content', () => {
  const { result, rerender } = renderHook(({ name }) => useStagedEditorDraft('admin:one', 'website', { name }), { initialProps: { name: 'Original' } });
  act(() => result.current.setDraft({ name: 'Old edit' }));
  rerender({ name: 'New publication' });
  expect(result.current.stale).toBe(true);
  expect(result.current.draft).toEqual({ name: 'Old edit' });
});
it('switches account/project scope in an already mounted editor without exposing or copying another draft', () => {
  const { result, rerender } = renderHook(({ account }) => useStagedEditorDraft(account, 'website', { name: 'Published' }), { initialProps: { account: 'admin:one' } });
  act(() => result.current.setDraft({ name: 'One private' }));
  rerender({ account: 'admin:two' });
  expect(result.current.draft).toBeNull();
  act(() => result.current.setDraft({ name: 'Two private' }));
  rerender({ account: 'admin:one' });
  expect(result.current.draft).toEqual({ name: 'One private' });
  expect(JSON.parse(localStorage.getItem('admin:two')!).website.value).toEqual({ name: 'Two private' });
});
it('retains drafts in different areas when updates are batched', () => {
  const { result, rerender } = renderHook(({ area }) => useStagedEditorDraft('admin:one', area, {}), { initialProps: { area: 'website' } });
  act(() => { result.current.setDraft({ a: 'first' }); result.current.setDraft({ a: 'second' }); });
  rerender({ area: 'profile' });
  act(() => result.current.setDraft({ name: 'Private' }));
  rerender({ area: 'website' });
  expect(result.current.draft).toEqual({ a: 'second' });
});
it('preserves unreadable draft evidence until explicit discard', () => {
  localStorage.setItem('admin:one', '{broken');
  const { result } = renderHook(() => useStagedEditorDraft('admin:one', 'website', {}));
  act(() => result.current.setDraft({ name: 'Must not overwrite' }));
  expect(result.current.unreadable).toBe(true);
  expect(localStorage.getItem('admin:one')).toBe('{broken');
  act(() => result.current.discardUnreadable());
  expect(result.current.unreadable).toBe(false);
});
