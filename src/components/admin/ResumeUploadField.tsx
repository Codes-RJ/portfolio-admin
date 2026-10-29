import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEditorActions } from '../../context/editorSubscriptions';
import { useContentSlice } from '../../context/contentSubscriptions';
import { isSupabaseConfigured, uploadPublicMedia } from '../../lib/supabase';
import { downloadDocument } from '../../utils/download';

import { ConfirmModal } from '../ui/ConfirmModal';

export function ResumeUploadField() {
  const { session } = useAuth();
  const profile = useContentSlice('profile');
  const { updateProfile } = useEditorActions();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);

  const upload = async (file: File) => {
    if (controller.current) return;
    const maxMB = isSupabaseConfigured ? 15 : 1;
    if (file.type !== 'application/pdf' || file.size > maxMB * 1024 * 1024) {
      setError(`Choose a PDF smaller than ${maxMB} MB.`); return;
    }
    const request = new AbortController(); controller.current = request;
    setPendingFile(file); setBusy(true); setError(''); setStatus('');
    try {
      let source: string;
      if (isSupabaseConfigured) {
        if (session?.mode !== 'supabase' || !session.isAdmin) throw new Error('Sign in as an administrator to upload.');
        source = await uploadPublicMedia(file, file.name, session.accessToken, request.signal);
      } else {
        source = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          request.signal.addEventListener('abort', () => reader.abort(), { once: true });
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = reader.onabort = () => reject(new Error('Reading the PDF failed.'));
          reader.readAsDataURL(file);
        });
      }
      if (request.signal.aborted) return;
      updateProfile({ resumePdf: source, resumeFileName: file.name }); setPendingFile(null);
      setStatus('Resume uploaded. Content synchronization will publish the change.');
    } catch {
      setError(request.signal.aborted ? 'Upload cancelled. The previous resume was kept.' : 'Upload failed or timed out. Retry the selected PDF.');
    } finally { controller.current = null; setBusy(false); }
  };

  return <div className="space-y-3">
    <label htmlFor="admin-resume-file" className="block text-sm font-semibold">Upload Resume File (PDF)</label>
    <input id="admin-resume-file" type="file" accept="application/pdf,.pdf" disabled={busy}
      onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ''; if (file) void upload(file); }} />
    {busy && <button type="button" onClick={() => controller.current?.abort()}>Cancel resume upload</button>}
    {error && <p role="alert">{error} {pendingFile && <button type="button" disabled={busy} onClick={() => void upload(pendingFile!)}>Retry resume upload</button>}</p>}
    {status && <p role="status">{status}</p>}
    {profile.resumePdf && <div className="flex flex-wrap gap-4">
      <span>{profile.resumeFileName || 'Resume.pdf'}</span>
      <button type="button" title="Download & Test File" onClick={() => void downloadDocument(profile.resumePdf!, profile.resumeFileName || 'Resume.pdf').catch(() => setError('The resume could not be downloaded.'))}>Download resume</button>
      <button type="button" disabled={busy} onClick={() => setConfirmRemoveOpen(true)}>Remove resume</button>
    </div>}

    <ConfirmModal
      isOpen={confirmRemoveOpen}
      onClose={() => setConfirmRemoveOpen(false)}
      onConfirm={() => {
        updateProfile({ resumePdf: '', resumeFileName: '' });
        setConfirmRemoveOpen(false);
      }}
      title="Remove Resume PDF"
      message="Are you sure you want to remove the uploaded resume PDF? Visitors will no longer be able to download it."
      confirmText="Remove Resume"
      variant="danger"
    />
  </div>;
}
