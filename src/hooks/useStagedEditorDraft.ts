import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';

const storedDrafts = z.record(z.string(), z.object({ base: z.string(), value: z.unknown(), savedAt: z.string() }).strict());
type Drafts = z.infer<typeof storedDrafts>;

function readDrafts(storageKey: string) {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(storageKey);
    return { storageKey, records: raw ? storedDrafts.parse(JSON.parse(raw)) : {} as Drafts, unreadable: false, raw, storageError: '' };
  } catch {
    return { storageKey, records: {} as Drafts, unreadable: true, raw, storageError: '' };
  }
}

/** Private, account-scoped editor buffers; never used as published content. */
export function useStagedEditorDraft(storageKey: string, area: string, current: unknown) {
  const [stored, setStored] = useState(() => readDrafts(storageKey));
  // Change scope during render so the previous account's values are never exposed
  // for even one render or persisted under the new account's storage key.
  const scoped = stored.storageKey === storageKey ? stored : readDrafts(storageKey);
  if (stored.storageKey !== storageKey) setStored(scoped);
  const { records, unreadable, storageError } = scoped;
  const latest = useRef(scoped);
  useEffect(() => { latest.current = scoped; }, [scoped]);
  const fingerprint = JSON.stringify(current);
  const saved = records[area];

  const persist = (next: Drafts) => {
    let error = '';
    try {
      if (Object.keys(next).length) localStorage.setItem(storageKey, JSON.stringify(next));
      else localStorage.removeItem(storageKey);
    } catch {
      error = 'This browser could not save your editor draft. Export it before leaving or reloading.';
    }
    const updated = { storageKey, records: next, unreadable: false, raw: null, storageError: error };
    latest.current = updated;
    setStored(updated);
  };
  const setDraft = (value: unknown) => {
    if (unreadable) return;
    const next = { ...(latest.current.storageKey === storageKey ? latest.current.records : records) };
    if (value === null) delete next[area];
    else next[area] = { base: next[area]?.base ?? fingerprint, value, savedAt: new Date().toISOString() };
    persist(next);
  };
  const discardUnreadable = () => persist({});
  const exportDraft = () => {
    const raw = unreadable ? scoped.raw : JSON.stringify(latest.current.records, null, 2);
    const url = URL.createObjectURL(new Blob([raw ?? '{}'], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'portfolio-staged-editor-drafts.json'; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  useEffect(() => {
    if (!storageError) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [storageError]);

  return { draft: saved?.value ?? null, setDraft, stale: Boolean(saved && saved.base !== fingerprint),
    unreadable, storageError, exportDraft, discardUnreadable };
}
