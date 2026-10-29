import { useState } from 'react';
import { useContentSync } from '../../context/editorSubscriptions';
import { cleanupUnusedMedia, listUnusedMedia } from '../../lib/supabase';
import { ConfirmModal } from '../ui/ConfirmModal';

function browserDraftReferences(name: string, currentDraft: string) {
  const baseName = name.replace(/-small\.webp$/i, '.webp');
  const smallName = name.endsWith('.webp') && !name.endsWith('-small.webp')
    ? name.replace(/\.webp$/i, '-small.webp')
    : null;

  const matches = (raw: string) =>
    raw.includes(name) || raw.includes(encodeURI(name)) ||
    raw.includes(baseName) || raw.includes(encodeURI(baseName)) ||
    (smallName !== null && (raw.includes(smallName) || raw.includes(encodeURI(smallName))));

  if (matches(currentDraft)) return true;
  for (const key of Object.keys(localStorage)) {
    if ((key.startsWith('rohanos_editor_draft_v1:') || key.startsWith('rohanos_staged_controls_v1:')) && matches(localStorage.getItem(key) || '')) return true;
  }
  return false;
}

export function MediaCleanupPanel({ accessToken }: { accessToken: string }) {
  const { exportDraftJSON } = useContentSync();
  const [candidates, setCandidates] = useState<string[] | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [backedUp, setBackedUp] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const review = async () => {
    setBusy(true); setError(''); setNotice(''); setBackedUp(false); setSelected([]);
    try {
      const draft = exportDraftJSON();
      const files = await listUnusedMedia(accessToken);
      const safe = files.filter(name => !browserDraftReferences(name, draft));
      setCandidates(safe);
      setNotice(`${safe.length} candidate files. ${files.length - safe.length} files referenced by this browser's content or drafts were excluded.`);
    } catch (cause) {
      setCandidates(null);
      setError(cause instanceof Error ? cause.message : 'Could not inspect media. Retry the review.');
    } finally { setBusy(false); }
  };

  const executeRemove = async () => {
    if (!backedUp || !selected.length || busy) return;
    setConfirmDeleteOpen(false);
    setBusy(true); setError('');
    try {
      const draft = exportDraftJSON();
      const safe = selected.filter(name => !browserDraftReferences(name, draft));
      const removed = await cleanupUnusedMedia(accessToken, safe);
      setCandidates(null); setSelected([]); setBackedUp(false);
      setNotice(`Removed ${removed} files. Files that became referenced or ineligible were retained. Review again before another cleanup.`);
    } catch (cause) {
      setCandidates(null); setSelected([]); setBackedUp(false);
      setError(cause instanceof Error ? cause.message : 'Cleanup failed. Review the remaining files before retrying.');
    } finally { setBusy(false); }
  };

  return <section aria-labelledby="media-cleanup-title" className="rounded-2xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
    <h3 id="media-cleanup-title" className="font-semibold">Review unused media</h3>
    <p className="text-sm text-gray-600 dark:text-gray-300">Review uploads older than seven days that are unused by current content and retained revisions. JSON exports contain file URLs, not the files. Download a separate Storage backup before deletion. Drafts in other browsers and externally shared URLs may still use these files.</p>
    <button type="button" disabled={busy} onClick={() => void review()} className="rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-2 disabled:opacity-50">{busy ? 'Working…' : 'Review media candidates'}</button>
    {notice && <p role="status" className="text-sm">{notice}</p>}
    {error && <p role="alert" className="text-sm">{error}</p>}
    {candidates && candidates.length > 0 && <>
      <div className="max-h-64 overflow-auto space-y-2 border rounded-xl p-3">{candidates.map(name => <label key={name} className="flex items-start gap-3 text-sm break-all"><input type="checkbox" disabled={busy} checked={selected.includes(name)} onChange={event => setSelected(old => event.target.checked ? [...old, name] : old.filter(item => item !== name))} /><span>{name}</span></label>)}</div>
      <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={backedUp} disabled={busy} onChange={event => setBackedUp(event.target.checked)} /><span>I have a separate media-file backup and checked these paths against external links and drafts in other browsers.</span></label>
      <button type="button" onClick={() => setConfirmDeleteOpen(true)} disabled={busy || !backedUp || !selected.length} className="px-4 py-2 rounded-xl border border-red-400 text-red-700 dark:text-red-300 disabled:opacity-50 cursor-pointer">Delete selected files ({selected.length})</button>
    </>}

    <ConfirmModal
      isOpen={confirmDeleteOpen}
      onClose={() => setConfirmDeleteOpen(false)}
      onConfirm={executeRemove}
      title="Delete Unused Media"
      message={`Permanently delete ${selected.length} reviewed files? Your separate media backup is required to recover them.`}
      confirmText="Permanently Delete"
      variant="danger"
    />
  </section>;
}
