import { ResponsiveImage } from './ResponsiveImage';
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, Link as LinkIcon, Trash2, RefreshCw, Crop, Move } from 'lucide-react';
import { ImageCropperModal, AspectRatioType } from './ImageCropperModal';
import { useAuth } from '../../context/AuthContext';
import { useEditorActions } from '../../context/editorSubscriptions';
import { dataUrlToBlob, isSupabaseConfigured } from '../../lib/supabase';
import { uploadResponsiveImage } from '../../lib/responsiveMedia';

const acceptedImageTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
const acceptedImageFiles = acceptedImageTypes.join(',');

interface ImageUploadFieldProps {
  value?: string;
  onChange: (dataUrlOrUrl: string) => void;
  label?: string;
  helperText?: string;
  aspectRatio?: '4:5' | '3:4' | '9:16' | '16:9' | '1:1' | '4:3' | 'free';
  maxDimension?: number;
  previewHeight?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value = '',
  onChange,
  label = 'Image / Photo',
  helperText = 'Upload PNG, JPG, WebP, or SVG. Drag & zoom to reposition the crop window.',
  aspectRatio = '16:9',
  maxDimension = 1200,
  previewHeight = 'h-40'
}) => {
  const { session } = useAuth();
  const { registerMediaMetadata } = useEditorActions();
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputError, setInputError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const pendingImage = useRef('');
  const uploadController = useRef<AbortController | null>(null);
  useEffect(() => () => uploadController.current?.abort(), []);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Cropper Modal State
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperSourceImage, setCropperSourceImage] = useState<string>('');

  // Handle uploaded file: Read as DataURL and open cropper directly
  const processImageFile = (file: File) => {
    if (!acceptedImageTypes.includes(file.type)) {
      setInputError('Choose a PNG, JPG, WebP, or SVG image. Other image formats are not supported.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setInputError('Choose an image smaller than 10 MB.');
      return;
    }

    setInputError('');
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      setIsProcessing(false);
      setCropperSourceImage(rawDataUrl);
      setCropperOpen(true);
    };
    reader.onerror = () => {
      setInputError('The image could not be read. Choose the file again.');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
      // reset input so same file can be re-selected if needed
      e.target.value = '';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleApplyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      onChange('');
      setInputError('');
      return;
    }
    const isValid = /^\/(?![/\\])/.test(trimmed)
      || trimmed.startsWith('data:image/')
      || /^https?:\/\//i.test(trimmed);

    if (!isValid) {
      setInputError('Enter a valid image URL starting with http://, https://, or /');
      return;
    }
    setInputError('');
    onChange(trimmed);
  };

  const handleOpenCropperForExisting = () => {
    if (value) {
      setCropperSourceImage(value);
      setCropperOpen(true);
    }
  };

  const handleCropComplete = async (croppedDataUrl: string) => {
    if (uploadController.current) return;
    if (!isSupabaseConfigured) {
      onChange(croppedDataUrl);
      setUrlInput(croppedDataUrl);
      return;
    }
    if (session?.mode !== 'supabase' || !session.isAdmin) {
      setUploadError('Please sign in with the Supabase admin account before uploading media.');
      return;
    }

    setIsProcessing(true);
    setUploadError('');
    pendingImage.current = croppedDataUrl;
    const controller = new AbortController();
    uploadController.current = controller;
    try {
      const blob = await dataUrlToBlob(croppedDataUrl);
      const uploaded = await uploadResponsiveImage(blob, session.accessToken, controller.signal);
      if (controller.signal.aborted) return;
      const publicUrl = uploaded.url;
      registerMediaMetadata(publicUrl, uploaded.metadata);
      onChange(publicUrl);
      setUrlInput(publicUrl);
      pendingImage.current = '';
    } catch {
      setUploadError(controller.signal.aborted ? 'Upload cancelled. Your previous image was kept.' : 'Upload failed or timed out. Your crop is available to retry.');
    } finally {
      uploadController.current = null;
      setIsProcessing(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    setUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Convert string aspectRatio to AspectRatioType
  const normalizedAspect: AspectRatioType =
    aspectRatio === '3:4' ? '4:5' : (aspectRatio as AspectRatioType);

  return (
    <div className="space-y-2">
      {inputError && <p role="alert">{inputError}</p>}
      {uploadError && <p role="alert">{uploadError} <button type="button" disabled={isProcessing} onClick={() => void handleCropComplete(pendingImage.current)}>Retry upload</button></p>}
      {isProcessing && <button type="button" onClick={() => uploadController.current?.abort()}>Cancel upload</button>}
      {/* Label and Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-[var(--color-primary)] dark:text-[var(--color-primary-light)]" />
          <span>{label}</span>
          {aspectRatio !== 'free' && (
            <span className="text-[10px] font-mono text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-1.5 py-0.5 rounded-sm border border-brand-200 dark:border-brand-800">
              {aspectRatio}
            </span>
          )}
        </label>

        <div className="flex items-center space-x-1 text-[11px] font-medium text-gray-500">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded-md transition-colors ${
              mode === 'upload'
                ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] font-bold'
                : 'hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Upload File
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded-md transition-colors ${
              mode === 'url'
                ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] font-bold'
                : 'hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Image URL
          </button>
        </div>
      </div>

      {/* Main Upload / Preview Container */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-800 group bg-gray-100 dark:bg-gray-900 shadow-xs">
          <div className={`w-full ${previewHeight} flex items-center justify-center overflow-hidden bg-dot-pattern`}>
            <ResponsiveImage
              src={value}
              alt="Preview"
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                aspectRatio === '1:1' ? 'max-w-[140px] mx-auto rounded-xl shadow-inner' : ''
              }`}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80';
              }}
            />
          </div>

          {/* Action Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
            <button
              type="button"
              onClick={handleOpenCropperForExisting}
              className="px-3 py-1.5 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold shadow-sm hover:bg-[var(--color-primary-strong)] flex items-center gap-1.5 transition-transform hover:scale-105"
              title="Crop, zoom and reposition image"
            >
              <Crop className="w-3.5 h-3.5" />
              <span>Crop & Adjust</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-white text-gray-900 text-xs font-bold shadow-sm hover:bg-gray-100 flex items-center gap-1.5 transition-transform hover:scale-105"
              title="Replace with new file"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold shadow-sm hover:bg-red-700 flex items-center gap-1.5 transition-transform hover:scale-105"
              title="Remove image"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedImageFiles}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : mode === 'upload' ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={'Upload ' + label}
          className={`w-full ${previewHeight} rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-[var(--color-primary)] bg-brand-50 dark:bg-brand-950/40'
              : 'border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 hover:border-[var(--color-primary)]/60 hover:bg-brand-50/20'
          }`}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center space-y-2">
              <RefreshCw className="w-6 h-6 text-[var(--color-primary)] animate-spin" />
              <span className="text-xs text-gray-500 font-mono">Loading image cropper...</span>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="w-10 h-10 mx-auto rounded-full bg-brand-500/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center justify-center gap-1.5">
                <span>Click to upload or drag & drop</span>
                <Crop className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              </p>
              <p className="text-[11px] text-gray-400 font-mono">
                PNG, JPG, WebP, SVG · Interactive Crop & Zoom Tool
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedImageFiles}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="https://example.com/photo.png"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3.5 py-2 bg-[var(--color-primary)] text-white rounded-xl text-xs font-bold hover:bg-[#4d33d4] transition-colors"
          >
            Apply
          </button>
        </div>
      )}

      {helperText && (
        <p className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
          <Move className="w-2.5 h-2.5 text-[var(--color-primary)]" />
          <span>{helperText}</span>
        </p>
      )}

      {/* Interactive Google/Insta/WhatsApp-like Image Cropper Modal */}
      <ImageCropperModal
        isOpen={cropperOpen}
        imageSrc={cropperSourceImage}
        initialAspectRatio={normalizedAspect}
        maxDimension={maxDimension}
        onCropComplete={handleCropComplete}
        onClose={() => setCropperOpen(false)}
        title={`Adjust & Crop ${label}`}
      />
    </div>
  );
};
