import { useContentSync } from '../../context/editorSubscriptions';

export function SyncRecoveryNotice() {
  const { recoverableDraft, draftStorageError, recoverDraft, discardDraft, exportDraftJSON,
    contentSyncState, contentSyncError, contentEditingBlocked, retryContentSync } = useContentSync();
  const exportDraft = () => {
    const url = URL.createObjectURL(new Blob([exportDraftJSON()], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'portfolio-editor-draft.json'; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <aside aria-label="Content synchronization" className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 space-y-3">
    <p role="status" className="text-sm font-medium">{contentSyncState === 'local' ? 'Local workspace: applied changes are saved only in this browser. Export publishable content for a static deployment.' : contentSyncState === 'ready' ? 'Published content loaded. Applied edits save automatically to the shared portfolio database.' : contentSyncState === 'saving' ? 'Saving applied changes to the shared portfolio database…' : contentSyncState === 'loading' ? 'Loading hosted content before editing…' : contentSyncState === 'missing' ? 'Hosted content is not initialized. Use Overview to initialize it deliberately.' : contentSyncState === 'conflict' ? 'Publication paused: newer content exists in another session.' : contentSyncState === 'invalid' ? 'Publication paused: correct the invalid field to resume saving.' : 'Publication failed. Your local changes need attention.'}</p>
    <p className="text-xs text-gray-500">Complete controls keeps a private editor draft until you choose Save changes. Other editors apply changes when you use their save or add actions, or edit an immediate field.</p>
    {recoverableDraft && <>
      <p>A saved draft from {new Date(recoverableDraft.savedAt).toLocaleString()} is available. Published content is currently displayed.</p>
      <div className="flex flex-wrap gap-4">
        <button type="button" onClick={recoverDraft}>Recover draft</button>
        <button type="button" onClick={exportDraft}>Export draft</button>
        <button type="button" onClick={discardDraft}>Discard saved draft</button>
      </div>
    </>}
    {contentEditingBlocked && contentSyncState !== 'loading' && <p>Editing is paused while content loading, backup restoration or saved-draft recovery needs attention. Recovery actions are available in Overview.</p>}
    {contentSyncError && <p role="alert">{contentSyncError}</p>}
    {draftStorageError && <p role="alert">{draftStorageError}</p>}
    {draftStorageError && !recoverableDraft && <button type="button" onClick={exportDraft}>Export saved draft file</button>}
    {['failed', 'conflict', 'invalid'].includes(contentSyncState) && <button type="button" onClick={exportDraft}>Export current draft</button>}
    {contentSyncState === 'failed' && <button type="button" onClick={retryContentSync} className="ml-4">Retry synchronization</button>}
    {draftStorageError && !recoverableDraft && <button type="button" onClick={discardDraft}>Discard saved draft</button>}
    {contentSyncState === 'conflict' && <p>Export your changes, then reload to merge them with the latest published content.</p>}
  </aside>;
}
