import { ResponsiveImage } from './ResponsiveImage';
import React, { useState, useRef, useEffect, useCallback } from 'react';
/* eslint-disable jsx-a11y-x/no-noninteractive-element-interactions, jsx-a11y-x/no-noninteractive-tabindex -- composite keyboard-accessible crop surface */
import {
  X,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Move,
  Circle
} from 'lucide-react';
import { useAccessibleModal } from '../../hooks/useAccessibleModal';

export type AspectRatioType = '1:1' | '4:5' | '16:9' | '4:3' | '9:16' | 'free';

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string;
  initialAspectRatio?: AspectRatioType;
  onCropComplete: (croppedDataUrl: string) => void;
  onClose: () => void;
  title?: string;
  maxDimension?: number;
}

const ASPECT_RATIO_VALUES: Record<AspectRatioType, number | null> = {
  '1:1': 1 / 1,
  '4:5': 4 / 5,
  '16:9': 16 / 9,
  '4:3': 4 / 3,
  '9:16': 9 / 16,
  'free': null,
};

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  imageSrc,
  initialAspectRatio = '1:1',
  onCropComplete,
  onClose,
  title = 'Crop & Reposition Image',
  maxDimension = 1200,
}) => {
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>(initialAspectRatio);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showCircularMask, setShowCircularMask] = useState<boolean>(initialAspectRatio === '1:1');
  const [imageLoaded, setImageLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const dialogRef = useAccessibleModal(isOpen, onClose);

  // Sync aspect ratio when modal opens with new initialAspectRatio
  useEffect(() => {
    if (isOpen) {
      const frame = window.requestAnimationFrame(() => {
        setAspectRatio(initialAspectRatio);
        setShowCircularMask(initialAspectRatio === '1:1');
        setZoom(1);
        setRotation(0);
        setPan({ x: 0, y: 0 });
        setImageLoaded(false);
      });
      return () => window.cancelAnimationFrame(frame);
    }
  }, [isOpen, initialAspectRatio, imageSrc]);

  // Compute crop box dimensions based on container and aspect ratio
  const getCropBoxDimensions = useCallback(() => {
    const maxWidth = 420;
    const maxHeight = 340;
    const ratio = ASPECT_RATIO_VALUES[aspectRatio];

    if (!ratio) {
      return { width: maxWidth, height: maxHeight };
    }

    if (ratio >= 1) {
      // Landscape or square
      const width = maxWidth;
      const height = Math.min(maxHeight, width / ratio);
      return { width: Math.round(height * ratio), height: Math.round(height) };
    } else {
      // Portrait
      const height = maxHeight;
      const width = Math.min(maxWidth, height * ratio);
      return { width: Math.round(width), height: Math.round(width / ratio) };
    }
  }, [aspectRatio]);

  const { width: cropWidth, height: cropHeight } = getCropBoxDimensions();

  // Mouse & Touch Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.0015;
    setZoom((prev) => Math.min(4, Math.max(1, +(prev + delta).toFixed(2))));
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Reset to initial centered state
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
  };

  // Rotate 90 deg clockwise
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Crop & Export High-Res Canvas
  const handleApplyCrop = () => {
    const img = imageRef.current;
    if (!img) return;

    // Determine target canvas resolution (high-DPI, e.g. up to 1200px width)
    const desiredWidth = Math.max(800, cropWidth * 2);
    const desiredHeight = desiredWidth / (cropWidth / cropHeight);
    const outputScale = Math.min(1, maxDimension / Math.max(desiredWidth, desiredHeight));
    const targetWidth = Math.round(desiredWidth * outputScale);
    const targetHeight = Math.round(desiredHeight * outputScale);

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Move origin to canvas center
    ctx.translate(targetWidth / 2, targetHeight / 2);

    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);

    // Scale multiplier between cropBox and targetCanvas
    const scaleFactor = targetWidth / cropWidth;

    // Pan displacement in canvas space (accounting for rotation)
    const rad = (-rotation * Math.PI) / 180;
    const rotatedPanX = (pan.x * Math.cos(rad) - pan.y * Math.sin(rad)) * scaleFactor;
    const rotatedPanY = (pan.x * Math.sin(rad) + pan.y * Math.cos(rad)) * scaleFactor;

    // Calculate base rendering dimensions of image to cover/fit crop area
    const isSideways = rotation === 90 || rotation === 270;
    const naturalW = isSideways ? img.naturalHeight : img.naturalWidth;
    const naturalH = isSideways ? img.naturalWidth : img.naturalHeight;

    const baseScale = Math.max(cropWidth / naturalW, cropHeight / naturalH);
    const renderWidth = (isSideways ? img.naturalHeight : img.naturalWidth) * baseScale * zoom * scaleFactor;
    const renderHeight = (isSideways ? img.naturalWidth : img.naturalHeight) * baseScale * zoom * scaleFactor;

    const drawW = isSideways ? renderHeight : renderWidth;
    const drawH = isSideways ? renderWidth : renderHeight;

    ctx.drawImage(
      img,
      rotatedPanX - drawW / 2,
      rotatedPanY - drawH / 2,
      drawW,
      drawH
    );

    // Export as lossless PNG so downstream responsive WebP compression does not incur double-lossy artifacts
    const croppedDataUrl = canvas.toDataURL('image/png');
    onCropComplete(croppedDataUrl);
    onClose();
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="image-cropper-title" tabIndex={-1} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 flex items-center justify-center text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">
              <Move className="w-4 h-4" />
            </div>
            <div>
              <h3 id="image-cropper-title" className="text-sm font-bold text-gray-900 dark:text-white">{title}</h3>
              <p className="text-[11px] text-gray-500">
                Drag to reposition · Scroll or slide to zoom · Choose aspect ratio
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close image cropper"
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewport / Crop Canvas Area */}
        {/* A composite pan/zoom surface intentionally uses the ARIA application role. */}
        <div
          ref={containerRef}
          role="application"
          tabIndex={0}
          aria-label="Image crop area. Use arrow keys to reposition and plus or minus to zoom."
          onWheel={handleWheel}
          className="relative bg-black flex items-center justify-center overflow-hidden select-none cursor-grab active:cursor-grabbing p-6 min-h-[360px]"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onKeyDown={(event) => {
            const step = event.shiftKey ? 10 : 2;
            if (event.key === 'ArrowLeft') setPan((current) => ({ ...current, x: current.x - step }));
            else if (event.key === 'ArrowRight') setPan((current) => ({ ...current, x: current.x + step }));
            else if (event.key === 'ArrowUp') setPan((current) => ({ ...current, y: current.y - step }));
            else if (event.key === 'ArrowDown') setPan((current) => ({ ...current, y: current.y + step }));
            else if (event.key === '+' || event.key === '=') setZoom((current) => Math.min(4, +(current + 0.2).toFixed(2)));
            else if (event.key === '-') setZoom((current) => Math.max(1, +(current - 0.2).toFixed(2)));
            else return;
            event.preventDefault();
          }}
        >
          {/* Hidden source image to load natural dimensions */}
          <ResponsiveImage
            ref={imageRef}
            src={imageSrc}
            alt="Source for cropping"
            onLoad={() => setImageLoaded(true)}
            className="hidden"
            crossOrigin="anonymous"
          />

          {/* Draggable & Scalable Image Layer */}
          {imageLoaded && (
            <div
              className="absolute pointer-events-none transition-transform duration-75 ease-out"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scale(${zoom})`,
                transformOrigin: 'center center'
              }}
            >
              <ResponsiveImage
                src={imageSrc}
                alt="Cropper Target"
                className="max-w-none select-none pointer-events-none"
                style={{
                  maxHeight: '450px',
                  objectFit: 'contain'
                }}
                draggable={false}
              />
            </div>
          )}

          {/* Dark Overlay with Transparent Crop Cutout */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Spotlight Crop Frame */}
            <div
              className={`relative border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] pointer-events-none transition-all duration-200 ${
                showCircularMask && aspectRatio === '1:1' ? 'rounded-full overflow-hidden' : 'rounded-xl'
              }`}
              style={{
                width: `${cropWidth}px`,
                height: `${cropHeight}px`
              }}
            >
              {/* Rule of Thirds Grid Lines */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                <div className="border-r border-b border-white/60"></div>
                <div className="border-r border-b border-white/60"></div>
                <div className="border-b border-white/60"></div>
                <div className="border-r border-b border-white/60"></div>
                <div className="border-r border-b border-white/60"></div>
                <div className="border-b border-white/60"></div>
                <div className="border-r border-white/60"></div>
                <div className="border-r border-white/60"></div>
                <div></div>
              </div>

              {/* Corner handles visual */}
              {!showCircularMask && (
                <>
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[var(--color-primary)] -translate-x-0.5 -translate-y-0.5" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[var(--color-primary)] translate-x-0.5 -translate-y-0.5" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[var(--color-primary)] -translate-x-0.5 translate-y-0.5" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[var(--color-primary)] translate-x-0.5 translate-y-0.5" />
                </>
              )}
            </div>
          </div>

          {/* Quick Helper Badge */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-white/80 border border-white/10 flex items-center space-x-1.5 pointer-events-none">
            <span>{aspectRatio}</span>
            <span>·</span>
            <span>{Math.round(zoom * 100)}%</span>
            {rotation !== 0 && (
              <>
                <span>·</span>
                <span>{rotation}°</span>
              </>
            )}
          </div>
        </div>

        {/* Controls Bar */}
        <div className="p-4 bg-gray-50 dark:bg-gray-850 border-t border-gray-100 dark:border-gray-800 space-y-3.5">
          {/* Aspect Ratio Selector Pills */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Ratio</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['1:1', '4:5', '16:9', '4:3', '9:16', 'free'] as AspectRatioType[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setAspectRatio(r);
                    if (r !== '1:1') setShowCircularMask(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    aspectRatio === r
                      ? 'bg-[var(--color-primary)] text-white shadow-xs'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {r === '1:1' ? '1:1 (Square)' : r === '16:9' ? '16:9 (Wide)' : r === '4:5' ? '4:5 (Portrait)' : r}
                </button>
              ))}

              {aspectRatio === '1:1' && (
                <button
                  type="button"
                  onClick={() => setShowCircularMask(!showCircularMask)}
                  className={`p-1.5 rounded-lg border text-xs transition-colors ${
                    showCircularMask
                      ? 'bg-brand-500/10 border-[var(--color-primary)] text-[var(--color-primary)]'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400'
                  }`}
                  title="Toggle Avatar Circle Mask"
                >
                  <Circle className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Zoom Slider and Tool Action Buttons */}
          <div className="flex items-center justify-between gap-4 pt-1">
            {/* Zoom Slider */}
            <div className="flex items-center space-x-2.5 flex-1 max-w-xs">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(1, +(z - 0.2).toFixed(2)))}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <input
                type="range"
                min="1"
                max="4"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
              />
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(4, +(z + 0.2).toFixed(2)))}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono text-gray-500 w-10 text-right">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            {/* Rotation & Reset Actions */}
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={handleRotate}
                className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Rotate 90° clockwise"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Rotate</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Reset crop & pan"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApplyCrop}
            className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] shadow-md transition-all hover:scale-[1.02]"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Crop & Position</span>
          </button>
        </div>
      </div>
    </div>
  );
};
