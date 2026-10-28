import { uploadPublicMedia } from './supabase';

export async function uploadResponsiveImage(blob: Blob, token: string, signal: AbortSignal) {
  const bitmap = await createImageBitmap(blob);
  try {
    const encode = async (maximumWidth: number) => {
      if (signal.aborted) throw signal.reason;
      const width = Math.min(bitmap.width, maximumWidth);
      const height = Math.max(1, Math.round(bitmap.height * width / bitmap.width));
      const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Image resizing is unavailable in this browser.');
      context.drawImage(bitmap, 0, 0, width, height);
      const file = await new Promise<Blob>((resolve, reject) => canvas.toBlob(result => result ? resolve(result) : reject(new Error('Image encoding failed.')), 'image/webp', 0.82));
      return { width, height, file };
    };
    const full = await encode(1280);
    const url = await uploadPublicMedia(full.file, 'image.webp', token, signal);
    let small = url;
    if (full.width > 640) {
      if (signal.aborted) throw signal.reason;
      try {
        const smallEncoded = await encode(640);
        small = await uploadPublicMedia(smallEncoded.file, 'image-small.webp', token, signal);
      } catch {
        if (signal.aborted) throw signal.reason;
        // Fall back to the primary URL if secondary upload fails, preventing orphan storage leaks
        small = url;
      }
    }
    return { url, metadata: { width: full.width, height: full.height, small } };
  } finally { bitmap.close(); }
}
