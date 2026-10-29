import {
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2
} from 'lucide-react';
import { IconRenderer } from '../../ui/IconRenderer';
import { ImageUploadField } from '../../ui/ImageUploadField';
import type { AdminEditor } from '../useAdminEditor';

export function AdminCertificatesSection({ editor }: { editor: Pick<AdminEditor, 'certificateCategories' | 'certificates' | 'deleteCertificate' | 'editingCertId' | 'handleCreateCert' | 'newCert' | 'reorderCertificates' | 'setEditingCertId' | 'setIconPickerOpen' | 'setIconPickerTarget' | 'setNewCert'> }) {
  const { certificateCategories, certificates, deleteCertificate, editingCertId, handleCreateCert, newCert, reorderCertificates, setEditingCertId, setIconPickerOpen, setIconPickerTarget, setNewCert } = editor;
  return (
    <div className="space-y-8">
      <form onSubmit={handleCreateCert} className="p-8 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-6 shadow-xl">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editingCertId ? 'Edit Certificate / Accreditation' : 'Add Certificate / Accreditation'}</h2>

        {/* Certificate Image / Credential Upload */}
        <div className="p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-200/80 dark:border-gray-700/80">
          <ImageUploadField
            label="Certificate Badge / Certificate Image (Optional)"
            value={newCert.image}
            aspectRatio="4:3"
            previewHeight="h-40"
            helperText="Upload a certificate image or badge preview. Hosted mode stores uploads in Supabase Storage."
            onChange={(imgData) => setNewCert({ ...newCert, image: imgData })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="admin-field-023" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Certificate Title</label>
            <input
              id="admin-field-023"
              type="text"
              required
              value={newCert.title}
              onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
              placeholder="e.g. AWS Certified Solutions Architect"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="admin-field-024" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Issuer Organization</label>
            <input
              id="admin-field-024"
              type="text"
              required
              value={newCert.issuer}
              onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
              placeholder="e.g. Amazon Web Services / Stanford"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <p className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Badge Icon (From 120+ Library)</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setIconPickerTarget({ type: 'cert' });
                  setIconPickerOpen(true);
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <IconRenderer icon={newCert.logo} className="w-4 h-4" />
                  <span className="font-mono text-xs">{newCert.logo}</span>
                </div>
                <span className="text-[11px] font-bold text-[var(--color-primary)]">Change →</span>
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="admin-field-025" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select
              id="admin-field-025"
              value={newCert.category}
              onChange={(e) => setNewCert({ ...newCert, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            >
              {certificateCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="admin-field-026" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Issue Date</label>
            <input
              id="admin-field-026"
              type="text"
              value={newCert.date}
              onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
              placeholder="e.g. Issued May 2026"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="admin-field-027" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Credential ID</label>
            <input
              id="admin-field-027"
              type="text"
              value={newCert.credentialId}
              onChange={(e) => setNewCert({ ...newCert, credentialId: e.target.value })}
              placeholder="Optional credential identifier"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="admin-field-028" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Verification URL</label>
            <input
              id="admin-field-028"
              type="url"
              value={newCert.verificationUrl}
              onChange={(e) => setNewCert({ ...newCert, verificationUrl: e.target.value })}
              placeholder="https://issuer.example/verify/... (optional)"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="admin-field-cert-pdf" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">PDF Document Link (Optional)</label>
            <input
              id="admin-field-cert-pdf"
              type="url"
              value={newCert.pdfUrl || ''}
              onChange={(e) => setNewCert({ ...newCert, pdfUrl: e.target.value })}
              placeholder="https://... or /certificates/aws-cert.pdf"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] cursor-pointer"
        >
          {editingCertId ? 'Save Certificate Changes' : '+ Add Certificate'}
        </button>
      </form>

      {/* List Certificates with Position Ordering */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
            Registered Credentials & Position Ordering ({certificates.length})
          </h3>
          <span className="text-xs text-gray-500 font-mono">Use ▲ ▼ to reorder positions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((cert, idx) => (
            <div key={cert.id} className="p-5 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3 min-w-0">
                {/* Position Reordering Buttons */}
                <div className="flex flex-col items-center justify-center space-y-1 pr-1 border-r border-gray-200 dark:border-gray-800">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => reorderCertificates(idx, idx - 1)}
                    className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-[var(--color-primary)] hover:text-white flex items-center justify-center text-gray-600 dark:text-gray-400 disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                    title="Move certificate up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">
                    #{idx + 1}
                  </span>
                  <button
                    type="button"
                    disabled={idx === certificates.length - 1}
                    onClick={() => reorderCertificates(idx, idx + 1)}
                    className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-[var(--color-primary)] hover:text-white flex items-center justify-center text-gray-600 dark:text-gray-400 disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                    title="Move certificate down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-xl shrink-0">
                  <IconRenderer icon={cert.logo} name={cert.title} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{cert.title}</h4>
                  <span className="text-[11px] text-gray-500 block truncate">{cert.issuer} · {cert.date}</span>
                  <span className="text-[10px] font-mono text-brand-600 dark:text-brand-400">{cert.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCertId(cert.id);
                    setNewCert({
                      title: cert.title,
                      issuer: cert.issuer,
                      date: cert.date,
                      credentialId: cert.credentialId,
                      verificationUrl: cert.verificationUrl,
                      category: cert.category,
                      logo: cert.logo,
                      image: cert.image || '',
                      pdfUrl: cert.pdfUrl || ''
                    });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-2 rounded-xl text-gray-500 hover:bg-gray-500/10 cursor-pointer"
                  title="Edit Certificate"
                  aria-label={`Edit ${cert.title}`}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete ${cert.title}?`)) deleteCertificate(cert.id);
                  }}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 shrink-0 cursor-pointer"
                  title="Delete Certificate"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
