import { useState, useEffect } from 'react';
import { History, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { listPortfolioRevisions, restorePortfolioRevision, type PortfolioRevision } from '../../lib/supabase';
import { ConfirmModal } from '../ui/ConfirmModal';

export function DatabaseRevisionsPanel({ accessToken }: { accessToken: string }) {
  const [revisions, setRevisions] = useState<PortfolioRevision[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [pendingRollback, setPendingRollback] = useState<{ id: number; date: string } | null>(null);

  const handleRefresh = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const items = await listPortfolioRevisions(accessToken);
      setRevisions(items);
      if (items.length === 0) {
        setMessage({
          type: 'info',
          text: 'No historical revisions found or database function not yet deployed. Revisions are created automatically whenever published content is updated.',
        });
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Could not load database revisions.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    listPortfolioRevisions(accessToken)
      .then((items) => {
        if (ignore) return;
        setRevisions(items);
        if (items.length === 0) {
          setMessage({
            type: 'info',
            text: 'No historical revisions found or database function not yet deployed. Revisions are created automatically whenever published content is updated.',
          });
        }
      })
      .catch((err) => {
        if (ignore) return;
        setMessage({
          type: 'error',
          text: err instanceof Error ? err.message : 'Could not load database revisions.',
        });
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => { ignore = true; };
  }, [accessToken]);

  const handleRollback = (revisionId: number, replacedAt: string) => {
    const formattedDate = new Date(replacedAt).toLocaleString();
    setPendingRollback({ id: revisionId, date: formattedDate });
  };

  const executeRollback = async () => {
    if (!pendingRollback) return;
    const revisionId = pendingRollback.id;
    setRestoringId(revisionId);
    setMessage(null);
    setPendingRollback(null);
    try {
      const success = await restorePortfolioRevision(revisionId, accessToken);
      if (success) {
        setMessage({
          type: 'success',
          text: `Successfully restored snapshot #${revisionId}. The public site has updated. Reloading in 2 seconds…`,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage({ type: 'error', text: 'Rollback failed. The snapshot could not be found.' });
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Could not restore revision.',
      });
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <section aria-labelledby="db-revisions-title" className="rounded-2xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[var(--color-primary)]" />
          <h3 id="db-revisions-title" className="font-semibold text-sm text-gray-900 dark:text-white">
            Database Snapshot Rollback (1-Click Undo)
          </h3>
        </div>
        <button
          type="button"
          onClick={() => void handleRefresh()}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 cursor-pointer"
          title="Refresh revisions"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-300">
        Supabase automatically stores historical snapshots in PostgreSQL whenever content is updated. You can instantly restore any of the last 20 revisions.
      </p>

      {message && (
        <div
          className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
              : message.type === 'error'
              ? 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
              : 'bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {loading && !revisions && (
        <p className="text-xs text-gray-400 animate-pulse">Checking historical database snapshots…</p>
      )}

      {revisions && revisions.length > 0 && (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {revisions.map((rev) => {
            const date = new Date(rev.replacedAt);
            const isRestoring = restoringId === rev.revisionId;
            return (
              <div
                key={rev.revisionId}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/80 text-xs"
              >
                <div className="space-y-0.5">
                  <span className="font-mono font-bold text-gray-900 dark:text-white">
                    Snapshot #{rev.revisionId}
                  </span>
                  <p className="text-gray-500 dark:text-gray-400 text-[11px]">
                    Saved on {date.toLocaleDateString()} at {date.toLocaleTimeString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleRollback(rev.revisionId, rev.replacedAt)}
                  disabled={isRestoring || restoringId !== null}
                  className="px-3 py-1.5 rounded-lg font-semibold text-[11px] bg-brand-500/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] hover:bg-brand-500/20 border border-brand-500/30 disabled:opacity-50 cursor-pointer"
                >
                  {isRestoring ? 'Restoring…' : 'Rollback to this'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={pendingRollback !== null}
        onClose={() => setPendingRollback(null)}
        onConfirm={executeRollback}
        title={`Rollback Snapshot #${pendingRollback?.id}`}
        message={`Roll back portfolio content to snapshot #${pendingRollback?.id} (from ${pendingRollback?.date})? This will restore the public site to this earlier point in time.`}
        confirmText="Confirm Rollback"
        variant="warning"
      />
    </section>
  );
}