import {
Trash2
} from 'lucide-react';
import { ImageUploadField } from '../../ui/ImageUploadField';
import { ResponsiveImage } from '../../ui/ResponsiveImage';
import type { AdminEditor } from '../useAdminEditor';

export function AdminGallerySection({ editor }: { editor: Pick<AdminEditor, 'deleteGalleryItem' | 'gallery' | 'handleCreateGalleryItem' | 'newGalleryItem' | 'setNewGalleryItem' | 'updateGalleryItem'> }) {
  const { deleteGalleryItem, gallery, handleCreateGalleryItem, newGalleryItem, setNewGalleryItem, updateGalleryItem } = editor;
  return (
          <div className="space-y-8">
            <form onSubmit={handleCreateGalleryItem} className="p-6 sm:p-8 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-5 shadow-xl">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add Gallery Item</h2>
                <p className="text-xs text-gray-500 mt-1">Publish event, speaking, award, and design photos on the public gallery page.</p>
              </div>
              <ImageUploadField
                value={newGalleryItem.imageUrl}
                onChange={(imageUrl) => setNewGalleryItem((current) => ({ ...current, imageUrl }))}
                label="Gallery image"
                aspectRatio="16:9"
                maxDimension={1600}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="gallery-title" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Title</label>
                  <input id="gallery-title" required value={newGalleryItem.title} onChange={(event) => setNewGalleryItem({ ...newGalleryItem, title: event.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label htmlFor="gallery-category" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <input id="gallery-category" required value={newGalleryItem.category} onChange={(event) => setNewGalleryItem({ ...newGalleryItem, category: event.target.value })} placeholder="Hackathons, Speaking, UI/UX Design…" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white" />
                </div>
              </div>
              <div>
                <label htmlFor="gallery-description" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea id="gallery-description" rows={3} value={newGalleryItem.description} onChange={(event) => setNewGalleryItem({ ...newGalleryItem, description: event.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white resize-none" />
              </div>
              <button type="submit" disabled={!newGalleryItem.title.trim() || !newGalleryItem.category.trim() || !newGalleryItem.imageUrl} className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] disabled:opacity-50 disabled:cursor-not-allowed">
                + Publish Gallery Item
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {gallery.map((item) => (
                <article key={item.id} className="overflow-hidden rounded-3xl glass-card border border-gray-200 dark:border-gray-800">
                  <ResponsiveImage src={item.imageUrl} alt="" className="w-full aspect-video object-cover" />
                  <div className="p-5 space-y-3">
                    <input aria-label="Gallery item title" value={item.title} onChange={(event) => updateGalleryItem(item.id, { title: event.target.value })} className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-900 dark:text-white" />
                    <input aria-label="Gallery item category" value={item.category} onChange={(event) => updateGalleryItem(item.id, { category: event.target.value })} className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white" />
                    <textarea aria-label="Gallery item description" rows={2} value={item.description} onChange={(event) => updateGalleryItem(item.id, { description: event.target.value })} className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white resize-none" />
                    <button type="button" onClick={() => { if (window.confirm(`Delete ${item.title}?`)) deleteGalleryItem(item.id); }} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/10">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </article>
              ))}
              {gallery.length === 0 && <p className="text-xs text-gray-500">No gallery items published yet.</p>}
            </div>
          </div>
        );
}
