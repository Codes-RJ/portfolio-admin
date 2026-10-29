import {
  Edit,
  Trash2
} from 'lucide-react';
import { ImageUploadField } from '../../ui/ImageUploadField';
import type { AdminEditor } from '../useAdminEditor';

export function AdminResearchSection({ editor }: { editor: Pick<AdminEditor, 'deleteResearchPaper' | 'editingPaperId' | 'handleCreatePaper' | 'newPaper' | 'researchPapers' | 'setEditingPaperId' | 'setNewPaper'> }) {
  const { deleteResearchPaper, editingPaperId, handleCreatePaper, newPaper, researchPapers, setEditingPaperId, setNewPaper } = editor;
  return (
    <div className="space-y-8">
      <form onSubmit={handleCreatePaper} className="p-8 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-4 shadow-xl">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editingPaperId ? 'Edit Research Publication' : 'Add Research Publication'}</h2>

        <ImageUploadField
          label="Paper Cover Image / Architecture Diagram (Optional)"
          value={newPaper.image || ''}
          aspectRatio="16:9"
          previewHeight="h-40"
          helperText="Upload a research preview screenshot or architecture diagram."
          onChange={(imgData) => setNewPaper({ ...newPaper, image: imgData })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="admin-field-045" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Paper Title</label>
            <input
              id="admin-field-045"
              type="text"
              required
              value={newPaper.title}
              onChange={(e) => setNewPaper({ ...newPaper, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="admin-field-046" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Venue / Journal</label>
            <input
              id="admin-field-046"
              type="text"
              required
              value={newPaper.venue}
              onChange={(e) => setNewPaper({ ...newPaper, venue: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label htmlFor="admin-field-047" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Abstract</label>
          <textarea
            id="admin-field-047"
            rows={3}
            value={newPaper.abstract}
            onChange={(e) => setNewPaper({ ...newPaper, abstract: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="admin-field-048" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Authors</label>
            <input id="admin-field-048" type="text" required value={newPaper.authors} onChange={(e) => setNewPaper({ ...newPaper, authors: e.target.value })} placeholder="Comma-separated author names" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white" />
          </div>
          <div>
            <label htmlFor="admin-field-049" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Year</label>
            <input id="admin-field-049" type="text" value={newPaper.year} onChange={(e) => setNewPaper({ ...newPaper, year: e.target.value })} placeholder="2026" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white" />
          </div>
          <div>
            <label htmlFor="admin-field-paper-category" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Research Domain / Category</label>
            <input id="admin-field-paper-category" type="text" value={newPaper.category} onChange={(e) => setNewPaper({ ...newPaper, category: e.target.value })} placeholder="e.g. Edge AI & IoT" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white" />
          </div>
          <div>
            <label htmlFor="admin-field-paper-readtime" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Estimated Read Time</label>
            <input id="admin-field-paper-readtime" type="text" value={newPaper.readTime} onChange={(e) => setNewPaper({ ...newPaper, readTime: e.target.value })} placeholder="e.g. 8 min read" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white" />
          </div>
          <div>
            <label htmlFor="admin-field-050" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">DOI</label>
            <input id="admin-field-050" type="text" value={newPaper.doi} onChange={(e) => setNewPaper({ ...newPaper, doi: e.target.value })} placeholder="Optional DOI" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white" />
          </div>
          <div>
            <label htmlFor="admin-field-051" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">PDF / Paper URL</label>
            <input id="admin-field-051" type="url" value={newPaper.pdfUrl} onChange={(e) => setNewPaper({ ...newPaper, pdfUrl: e.target.value })} placeholder="https://… (optional)" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white" />
          </div>
          <div>
            <label htmlFor="admin-field-052" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Citation Count</label>
            <input id="admin-field-052" type="number" min="0" value={newPaper.citations} onChange={(e) => setNewPaper({ ...newPaper, citations: Math.max(0, Number(e.target.value) || 0) })} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white" />
          </div>
          <div>
            <label htmlFor="admin-field-paper-keywords" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Keywords (comma-separated)</label>
            <input id="admin-field-paper-keywords" type="text" value={newPaper.keywords} onChange={(e) => setNewPaper({ ...newPaper, keywords: e.target.value })} placeholder="Deep Learning, Quantization, IoT" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white" />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] cursor-pointer"
        >
          {editingPaperId ? 'Save Publication Changes' : '+ Publish Research Paper'}
        </button>
      </form>

      <div className="space-y-3">
        {researchPapers.map((paper) => (
          <div key={paper.id} className="p-5 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white">{paper.title}</h4>
              <span className="text-[11px] text-gray-500">{paper.venue} · {paper.year}{paper.category ? ` · ${paper.category}` : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setEditingPaperId(paper.id);
                  setNewPaper({
                    title: paper.title,
                    authors: paper.authors.join(', '),
                    venue: paper.venue,
                    year: paper.year,
                    abstract: paper.abstract,
                    doi: paper.doi,
                    citations: paper.citations,
                    pdfUrl: paper.pdfUrl || paper.paperUrl || '',
                    category: paper.category || 'Edge AI & IoT',
                    readTime: paper.readTime || '8 min read',
                    date: paper.date || '',
                    image: paper.image || '',
                    keywords: (paper.keywords || []).join(', ')
                  });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-2 rounded-xl text-gray-500 hover:bg-gray-500/10 cursor-pointer"
                aria-label={`Edit ${paper.title}`}
                title="Edit Publication"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete ${paper.title}?`)) deleteResearchPaper(paper.id);
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
