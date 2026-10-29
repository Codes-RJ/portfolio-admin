import {
  Edit,
  Trash2
} from 'lucide-react';
import { ImageUploadField } from '../../ui/ImageUploadField';
import type { AdminEditor } from '../useAdminEditor';

export function AdminBlogSection({ editor }: { editor: Pick<AdminEditor, 'blogCategories' | 'blogPosts' | 'deleteBlogPost' | 'editingBlogId' | 'handleCreateBlog' | 'newBlog' | 'setEditingBlogId' | 'setNewBlog'> }) {
  const { blogCategories, blogPosts, deleteBlogPost, editingBlogId, handleCreateBlog, newBlog, setEditingBlogId, setNewBlog } = editor;
  return (
    <div className="space-y-8">
      <form onSubmit={handleCreateBlog} className="p-8 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-4 shadow-xl">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editingBlogId ? 'Edit Blog Article' : 'Publish Article to Blog'}</h2>

        <ImageUploadField
          label="Article Cover Image"
          value={newBlog.image}
          aspectRatio="16:9"
          previewHeight="h-44"
          onChange={(imgData) => setNewBlog({ ...newBlog, image: imgData })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="admin-field-037" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Article Title</label>
            <input
              id="admin-field-037"
              type="text"
              required
              value={newBlog.title}
              onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="admin-field-038" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select
              id="admin-field-038"
              value={newBlog.category}
              onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            >
              {blogCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="admin-field-039" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Excerpt / Summary</label>
          <textarea
            id="admin-field-039"
            rows={2}
            required
            value={newBlog.summary}
            onChange={(e) => setNewBlog({ ...newBlog, summary: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="admin-field-040" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">URL Slug</label>
            <input id="admin-field-040" type="text" value={newBlog.slug} onChange={(e) => setNewBlog({ ...newBlog, slug: e.target.value })} placeholder="Generated from title if blank" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white" />
          </div>
          <div>
            <label htmlFor="admin-field-041" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Publish Date</label>
            <input id="admin-field-041" type="date" value={newBlog.publishedAt} onChange={(e) => setNewBlog({ ...newBlog, publishedAt: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white" />
          </div>
          <div>
            <label htmlFor="admin-field-042" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Read Time</label>
            <input id="admin-field-042" type="text" value={newBlog.readTime} onChange={(e) => setNewBlog({ ...newBlog, readTime: e.target.value })} placeholder="5 min read" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white" />
          </div>
        </div>

        <div>
          <label htmlFor="admin-field-043" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Article Body</label>
          <textarea id="admin-field-043" rows={10} required value={newBlog.content} onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })} placeholder="Write the full article content…" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white resize-y" />
        </div>

        <div>
          <label htmlFor="admin-field-044" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Tags</label>
          <input id="admin-field-044" type="text" value={newBlog.tags} onChange={(e) => setNewBlog({ ...newBlog, tags: e.target.value })} placeholder="React, TypeScript, Architecture" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white" />
        </div>

        <div className="flex items-center gap-2 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/60">
          <input
            id="admin-field-blog-featured"
            type="checkbox"
            checked={Boolean(newBlog.featured)}
            onChange={(e) => setNewBlog({ ...newBlog, featured: e.target.checked })}
            className="rounded-sm border-gray-400 text-[var(--color-primary)] focus:ring-[var(--color-primary)] w-4 h-4 cursor-pointer"
          />
          <label htmlFor="admin-field-blog-featured" className="text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
            Featured Article (Spotlight article on the blog)
          </label>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] cursor-pointer"
        >
          {editingBlogId ? 'Save Article Changes' : '+ Publish Article'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {blogPosts.map((post) => (
          <div key={post.id} className="p-5 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white">{post.title}</h4>
              <span className="text-[11px] text-gray-500">{post.category} · {post.readTime}{post.featured ? ' · ★ Featured' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setEditingBlogId(post.id);
                  setNewBlog({
                    title: post.title,
                    slug: post.slug,
                    summary: post.summary,
                    content: post.content,
                    category: post.category,
                    readTime: post.readTime,
                    publishedAt: post.publishedAt,
                    tags: post.tags.join(', '),
                    image: post.image,
                    featured: Boolean(post.featured)
                  });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-2 rounded-xl text-gray-500 hover:bg-gray-500/10 cursor-pointer"
                aria-label={`Edit ${post.title}`}
                title="Edit Article"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete ${post.title}?`)) deleteBlogPost(post.id);
                }}
                className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
