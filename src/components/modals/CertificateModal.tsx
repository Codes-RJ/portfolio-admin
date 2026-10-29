import { ResponsiveImage } from '../ui/ResponsiveImage';
import React from 'react';
import { useModalActions, useModalState } from '../../context/contentSubscriptions';
import { IconRenderer } from '../ui/IconRenderer';
import { X, ExternalLink, ShieldCheck } from 'lucide-react';
import { useAccessibleModal } from '../../hooks/useAccessibleModal';

export const CertificateModal: React.FC = () => {
  const { activeModalCert } = useModalState();
  const { setActiveModalCert } = useModalActions();

  const dialogRef = useAccessibleModal(Boolean(activeModalCert), () => setActiveModalCert(null));

  if (!activeModalCert) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-cert-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative w-full max-w-lg bg-white dark:bg-[#111827] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden my-8 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200"
      >
        
        {/* Close Button */}
        <button
          onClick={() => setActiveModalCert(null)}
          aria-label="Close certificate details"
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-4">
          {activeModalCert.image && (
            <ResponsiveImage src={activeModalCert.image} alt={`${activeModalCert.title} certificate`} className="w-full aspect-[4/3] object-contain rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
          )}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/80 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 flex items-center justify-center p-3 shadow-md">
            <IconRenderer icon={activeModalCert.logo} name={`${activeModalCert.title} ${activeModalCert.issuer}`} className="w-9 h-9" />
          </div>

          <div>
            {/^(https?:\/\/)/i.test(activeModalCert.verificationUrl) && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Official Credential
            </span>}
            <h3 id="modal-cert-title" className="text-xl font-bold text-gray-900 dark:text-white">{activeModalCert.title}</h3>
            <p className="text-sm font-medium text-brand-600 dark:text-brand-400 mt-1">{activeModalCert.issuer}</p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/60 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Issue & Validity:</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{activeModalCert.date}</span>
            </div>
            {activeModalCert.credentialId && (
              <div className="flex justify-between">
                <span className="text-gray-500">Credential ID:</span>
                <span className="font-mono font-semibold text-brand-500">{activeModalCert.credentialId}</span>
              </div>
            )}
            <div className="flex justify-between">
                <span className="text-gray-500">Domain:</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{activeModalCert.category}</span>
            </div>
          </div>

          {/^(https?:\/\/)/i.test(activeModalCert.verificationUrl) && <div className="pt-2 flex items-center justify-center space-x-3">
            <a
              href={activeModalCert.verificationUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-600/25 transition-all"
            >
              <span>Verify Certificate Online</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>}
        </div>

      </div>
    </div>
  );
};
