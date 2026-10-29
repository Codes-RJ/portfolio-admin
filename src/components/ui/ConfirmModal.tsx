import React, { useId } from 'react';
import { AlertTriangle, Info, Trash2, X } from 'lucide-react';
import { useAccessibleModal } from '../../hooks/useAccessibleModal';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isBusy?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isBusy = false,
}) => {
  const titleId = useId();
  const descId = useId();
  const dialogRef = useAccessibleModal(isOpen, onClose);

  if (!isOpen) return null;

  const iconBg =
    variant === 'danger'
      ? 'bg-red-500/10 text-red-400 border-red-500/20'
      : variant === 'warning'
      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';

  const confirmBtnBg =
    variant === 'danger'
      ? 'bg-red-600 hover:bg-red-500 shadow-red-600/30'
      : variant === 'warning'
      ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
      : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative w-full max-w-md rounded-2xl bg-[#0f1422] border border-gray-800 text-white shadow-2xl p-6 space-y-4 focus:outline-hidden"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${iconBg} shrink-0`}>
              {variant === 'danger' ? (
                <Trash2 className="w-5 h-5" />
              ) : variant === 'warning' ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <Info className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 id={titleId} className="text-base font-bold text-white">
                {title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            aria-label="Close dialog"
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p id={descId} className="text-xs text-gray-300 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-800/80">
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isBusy}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all disabled:opacity-50 cursor-pointer ${confirmBtnBg}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
