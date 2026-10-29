import {
Award,
BookOpen,
ChevronDown,
ChevronUp,
Layers,
Trash2
} from 'lucide-react';
import type { AdminEditor } from '../useAdminEditor';

export function AdminCategoriesSection({ editor }: { editor: Pick<AdminEditor, 'addBlogCategory' | 'addCertificateCategory' | 'addProjectCategory' | 'blogCategories' | 'certificateCategories' | 'deleteBlogCategory' | 'deleteCertificateCategory' | 'deleteProjectCategory' | 'newBlogCatInput' | 'newCertCatInput' | 'newProjectCatInput' | 'projectCategories' | 'reorderBlogCategories' | 'reorderCertificateCategories' | 'reorderProjectCategories' | 'setNewBlogCatInput' | 'setNewCertCatInput' | 'setNewProjectCatInput' | 'updateBlogCategory' | 'updateCertificateCategory' | 'updateProjectCategory'> }) {
  const { addBlogCategory, addCertificateCategory, addProjectCategory, blogCategories, certificateCategories, deleteBlogCategory, deleteCertificateCategory, deleteProjectCategory, newBlogCatInput, newCertCatInput, newProjectCatInput, projectCategories, reorderBlogCategories, reorderCertificateCategories, reorderProjectCategories, setNewBlogCatInput, setNewCertCatInput, setNewProjectCatInput, updateBlogCategory, updateCertificateCategory, updateProjectCategory } = editor;
  return (
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-8 shadow-xl">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Categories Management Hub</h2>
              <p className="text-xs text-gray-500">
                Add, edit, reorder, and delete categories for Projects, Certificates, and Technical Blogs. Changing a category name automatically cascades to all associated items.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 1. Projects Categories Column */}
              <div className="p-5 rounded-2xl bg-gray-50/70 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700/80 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-brand-500/10 flex items-center justify-center text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-900 dark:text-white">Project Categories</h3>
                      <span className="text-[10px] font-mono text-gray-400">{projectCategories.length} categories</span>
                    </div>
                  </div>
                </div>

                {/* Add Category Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newProjectCatInput.trim()) return;
                    addProjectCategory(newProjectCatInput.trim());
                    setNewProjectCatInput('');
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    required
                    placeholder="New category name..."
                    value={newProjectCatInput}
                    onChange={(e) => setNewProjectCatInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] rounded-xl shadow-xs transition-colors shrink-0"
                  >
                    + Add
                  </button>
                </form>

                {/* Category List */}
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {projectCategories.map((cat, idx) => (
                    <div
                      key={cat + idx}
                      className="flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-gray-800/80 border border-gray-200/70 dark:border-gray-700/70 text-xs gap-2 group"
                    >
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        {/* Reorder Buttons */}
                        <div className="flex items-center space-x-0.5 shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => reorderProjectCategories(idx, idx - 1)}
                            className="w-4 h-4 rounded-sm hover:bg-[var(--color-primary)] hover:text-white flex items-center justify-center text-gray-400 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                            title="Move category up"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <span className="text-[10px] font-mono text-gray-400 w-4 text-center">#{idx + 1}</span>
                          <button
                            type="button"
                            disabled={idx === projectCategories.length - 1}
                            onClick={() => reorderProjectCategories(idx, idx + 1)}
                            className="w-4 h-4 rounded-sm hover:bg-[var(--color-primary)] hover:text-white flex items-center justify-center text-gray-400 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                            title="Move category down"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Editable Name */}
                        <input
                          type="text"
                          value={cat}
                          onChange={(e) => updateProjectCategory(cat, e.target.value)}
                          className="flex-1 px-2 py-0.5 text-xs font-semibold text-gray-900 dark:text-gray-200 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700/40 rounded-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-600 focus:border-[var(--color-primary)] focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete project category "${cat}"?`)) {
                            deleteProjectCategory(cat);
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 rounded-sm hover:bg-red-500/10 transition-colors shrink-0"
                        title="Delete category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Certificate Categories Column */}
              <div className="p-5 rounded-2xl bg-gray-50/70 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700/80 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-900 dark:text-white">Certificate Categories</h3>
                      <span className="text-[10px] font-mono text-gray-400">{certificateCategories.length} categories</span>
                    </div>
                  </div>
                </div>

                {/* Add Category Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newCertCatInput.trim()) return;
                    addCertificateCategory(newCertCatInput.trim());
                    setNewCertCatInput('');
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    required
                    placeholder="New category name..."
                    value={newCertCatInput}
                    onChange={(e) => setNewCertCatInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors shrink-0"
                  >
                    + Add
                  </button>
                </form>

                {/* Category List */}
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {certificateCategories.map((cat, idx) => (
                    <div
                      key={cat + idx}
                      className="flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-gray-800/80 border border-gray-200/70 dark:border-gray-700/70 text-xs gap-2 group"
                    >
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        {/* Reorder Buttons */}
                        <div className="flex items-center space-x-0.5 shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => reorderCertificateCategories(idx, idx - 1)}
                            className="w-4 h-4 rounded-sm hover:bg-emerald-600 hover:text-white flex items-center justify-center text-gray-400 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                            title="Move category up"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <span className="text-[10px] font-mono text-gray-400 w-4 text-center">#{idx + 1}</span>
                          <button
                            type="button"
                            disabled={idx === certificateCategories.length - 1}
                            onClick={() => reorderCertificateCategories(idx, idx + 1)}
                            className="w-4 h-4 rounded-sm hover:bg-emerald-600 hover:text-white flex items-center justify-center text-gray-400 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                            title="Move category down"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Editable Name */}
                        <input
                          type="text"
                          value={cat}
                          onChange={(e) => updateCertificateCategory(cat, e.target.value)}
                          className="flex-1 px-2 py-0.5 text-xs font-semibold text-gray-900 dark:text-gray-200 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700/40 rounded-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-600 focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete certificate category "${cat}"?`)) {
                            deleteCertificateCategory(cat);
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 rounded-sm hover:bg-red-500/10 transition-colors shrink-0"
                        title="Delete category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Blog Categories Column */}
              <div className="p-5 rounded-2xl bg-gray-50/70 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700/80 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-900 dark:text-white">Blog Categories</h3>
                      <span className="text-[10px] font-mono text-gray-400">{blogCategories.length} categories</span>
                    </div>
                  </div>
                </div>

                {/* Add Category Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newBlogCatInput.trim()) return;
                    addBlogCategory(newBlogCatInput.trim());
                    setNewBlogCatInput('');
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    required
                    placeholder="New category name..."
                    value={newBlogCatInput}
                    onChange={(e) => setNewBlogCatInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors shrink-0"
                  >
                    + Add
                  </button>
                </form>

                {/* Category List */}
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {blogCategories.map((cat, idx) => (
                    <div
                      key={cat + idx}
                      className="flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-gray-800/80 border border-gray-200/70 dark:border-gray-700/70 text-xs gap-2 group"
                    >
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        {/* Reorder Buttons */}
                        <div className="flex items-center space-x-0.5 shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => reorderBlogCategories(idx, idx - 1)}
                            className="w-4 h-4 rounded-sm hover:bg-blue-600 hover:text-white flex items-center justify-center text-gray-400 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                            title="Move category up"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <span className="text-[10px] font-mono text-gray-400 w-4 text-center">#{idx + 1}</span>
                          <button
                            type="button"
                            disabled={idx === blogCategories.length - 1}
                            onClick={() => reorderBlogCategories(idx, idx + 1)}
                            className="w-4 h-4 rounded-sm hover:bg-blue-600 hover:text-white flex items-center justify-center text-gray-400 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                            title="Move category down"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Editable Name */}
                        <input
                          type="text"
                          value={cat}
                          onChange={(e) => updateBlogCategory(cat, e.target.value)}
                          className="flex-1 px-2 py-0.5 text-xs font-semibold text-gray-900 dark:text-gray-200 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700/40 rounded-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-600 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete blog category "${cat}"?`)) {
                            deleteBlogCategory(cat);
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 rounded-sm hover:bg-red-500/10 transition-colors shrink-0"
                        title="Delete category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
}
