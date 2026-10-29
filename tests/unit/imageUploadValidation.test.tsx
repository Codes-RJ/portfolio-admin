import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ImageUploadField } from '@/components/ui/ImageUploadField';

vi.mock('@/context/AuthContext', () => ({ useAuth: () => ({ session: null }) }));
vi.mock('@/context/editorSubscriptions', () => ({ useEditorActions: () => ({ registerMediaMetadata: vi.fn() }) }));
vi.mock('@/lib/supabase', () => ({ isSupabaseConfigured: false, dataUrlToBlob: vi.fn() }));
vi.mock('@/lib/responsiveMedia', () => ({ uploadResponsiveImage: vi.fn() }));
vi.mock('@/components/ui/ResponsiveImage', () => ({ ResponsiveImage: () => null }));
vi.mock('@/components/ui/ImageCropperModal', () => ({
  ImageCropperModal: ({ isOpen, onCropComplete }: { isOpen: boolean; onCropComplete: (value: string) => void }) => isOpen
    ? <div role="dialog" aria-label="Image crop"><button type="button" onClick={() => onCropComplete('data:image/webp;base64,Y3JvcA==')}>Apply test crop</button></div> : null,
}));

afterEach(() => vi.restoreAllMocks());

describe('image upload source validation', () => {
  it.each(['image/gif', 'image/avif', 'image/heic', 'application/pdf'])('rejects unsupported %s drops before reading or changing content', (type) => {
    const read = vi.spyOn(FileReader.prototype, 'readAsDataURL');
    const change = vi.fn();
    render(<ImageUploadField onChange={change} />);
    fireEvent.drop(screen.getByRole('button', { name: 'Upload Image / Photo' }), { dataTransfer: { files: [new File(['source'], 'source.image', { type })] } });
    expect(screen.getByRole('alert')).toHaveTextContent('Choose a PNG, JPG, WebP, or SVG image.');
    expect(read).not.toHaveBeenCalled();
    expect(change).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it.each(['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'])('opens supported %s sources for cropping and keeps the WebP output path', async (type) => {
    const change = vi.fn();
    const { container } = render(<ImageUploadField onChange={change} />);
    const input = container.querySelector('input[type=file]')!;
    expect(input).toHaveAttribute('accept', 'image/png,image/jpeg,image/webp,image/svg+xml');
    fireEvent.change(input, { target: { files: [new File(['source'], 'source.image', { type })] } });
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Image crop' })).toBeInTheDocument());
    expect(change).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Apply test crop' }));
    expect(change).toHaveBeenCalledWith('data:image/webp;base64,Y3JvcA==');
  });

  it('rejects an oversized replacement and preserves the existing image', () => {
    const read = vi.spyOn(FileReader.prototype, 'readAsDataURL');
    const change = vi.fn();
    const { container } = render(<ImageUploadField value="https://media.example/previous.webp" onChange={change} />);
    const file = new File(['source'], 'large.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: 10 * 1024 * 1024 + 1 });
    fireEvent.change(container.querySelector('input[type=file]')!, { target: { files: [file] } });
    expect(screen.getByRole('alert')).toHaveTextContent('Choose an image smaller than 10 MB.');
    expect(read).not.toHaveBeenCalled();
    expect(change).not.toHaveBeenCalled();
  });

  it('clears validation feedback when a supported replacement is selected', async () => {
    render(<ImageUploadField onChange={vi.fn()} />);
    const target = screen.getByRole('button', { name: 'Upload Image / Photo' });
    fireEvent.drop(target, { dataTransfer: { files: [new File(['gif'], 'old.gif', { type: 'image/gif' })] } });
    expect(screen.getByRole('alert')).toBeInTheDocument();
    fireEvent.drop(target, { dataTransfer: { files: [new File(['png'], 'new.png', { type: 'image/png' })] } });
    await waitFor(() => expect(screen.getByRole('dialog', { name: 'Image crop' })).toBeInTheDocument());
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
