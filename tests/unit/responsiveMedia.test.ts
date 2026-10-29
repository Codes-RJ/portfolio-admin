import { afterEach, expect, it, vi } from 'vitest';
import { uploadResponsiveImage } from '@/lib/responsiveMedia';

const mocks = vi.hoisted(() => ({ upload: vi.fn() }));
vi.mock('@/lib/supabase', () => ({ uploadPublicMedia: mocks.upload }));
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); mocks.upload.mockReset(); });

function image(width: number, height: number) {
  const bitmap = { width, height, close: vi.fn() };
  const sizes: number[][] = [];
  vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue(bitmap));
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ drawImage: vi.fn() } as unknown as CanvasRenderingContext2D);
  vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(function(this: HTMLCanvasElement, callback, type) {
    sizes.push([this.width, this.height]); callback(new Blob(['encoded image'], { type }));
  });
  return { bitmap, sizes };
}

it('uploads full and small WebP variants with correct dimensions and shared cancellation', async () => {
  const { bitmap, sizes } = image(2400, 1600);
  mocks.upload.mockResolvedValueOnce('https://media.example/full.webp').mockResolvedValueOnce('https://media.example/small.webp');
  const controller = new AbortController();
  const result = await uploadResponsiveImage(new Blob(), 'token', controller.signal);
  expect(sizes).toEqual([[1280, 853], [640, 427]]);
  expect(result).toEqual({ url: 'https://media.example/full.webp', metadata: { width: 1280, height: 853, small: 'https://media.example/small.webp' } });
  expect(mocks.upload.mock.calls.every(([blob, , token, signal]) => blob.type === 'image/webp' && token === 'token' && signal === controller.signal)).toBe(true);
  expect(bitmap.close).toHaveBeenCalledOnce();
});

it('does not upscale or upload a duplicate small variant', async () => {
  const { sizes } = image(320, 200); mocks.upload.mockResolvedValueOnce('https://media.example/small.webp');
  const result = await uploadResponsiveImage(new Blob(), 'token', new AbortController().signal);
  expect(sizes).toEqual([[320, 200]]);
  expect(result.metadata.small).toBe(result.url);
  expect(mocks.upload).toHaveBeenCalledOnce();
});

it('stops after cancellation between variants and releases the decoded image', async () => {
  const { bitmap } = image(1600, 1000); const controller = new AbortController();
  mocks.upload.mockImplementationOnce(async () => { controller.abort(); return 'https://media.example/full.webp'; });
  await expect(uploadResponsiveImage(new Blob(), 'token', controller.signal)).rejects.toHaveProperty('name', 'AbortError');
  expect(mocks.upload).toHaveBeenCalledOnce();
  expect(bitmap.close).toHaveBeenCalledOnce();
});
