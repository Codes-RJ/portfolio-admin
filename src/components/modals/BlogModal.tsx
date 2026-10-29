import { ResponsiveImage } from '../ui/ResponsiveImage';
import React from 'react';
import { useModalActions, useModalState } from '../../context/contentSubscriptions';
import { X, Calendar, Clock, Tag } from 'lucide-react';
import { useAccessibleModal } from '../../hooks/useAccessibleModal';
import { Link } from 'react-router-dom';

export const BlogModal: React.FC = () => {
  const { activeModalBlog } = useModalState();
  const { setActiveModalBlog } = useModalActions();

  const dialogRef = useAccessibleModal(Boolean(activeModalBlog), () => setActiveModalBlog(null));

  if (!activeModalBlog) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-blog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative w-full max-w-3xl bg-white dark:bg-[#111827] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
      >
        
        {/* Close Button */}
        <button
          onClick={() => setActiveModalBlog(null)}
          aria-label="Close article"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Banner */}
        <div className="relative h-64 w-full overflow-hidden">
          <ResponsiveImage
            src={activeModalBlog.image}
            alt={activeModalBlog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#111827] via-[#111827]/50 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-600 text-white">
                {activeModalBlog.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-300">
                <Calendar className="w-3.5 h-3.5" />
                {activeModalBlog.publishedAt}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-300">
                <Clock className="w-3.5 h-3.5" />
                {activeModalBlog.readTime}
              </span>
            </div>
            <h2 id="modal-blog-title" className="text-2xl font-bold text-white tracking-tight leading-snug">
              {activeModalBlog.title}
            </h2>
          </div>
        </div>

        {/* Article Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="p-4 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/40 text-xs sm:text-sm text-gray-700 dark:text-gray-300 italic">
            "{activeModalBlog.summary}"
          </div>

          <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-4 whitespace-pre-line leading-relaxed font-sans">
            {activeModalBlog.content}
          </div>

          {activeModalBlog.tags && activeModalBlog.tags.length > 0 && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex flex-wrap gap-2">
              {activeModalBlog.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
          <Link to={`/blog/${activeModalBlog.slug}`} onClick={() => setActiveModalBlog(null)} className="inline-flex px-4 py-2 rounded-xl text-sm font-semibold text-brand-600 bg-brand-50 dark:bg-brand-950/40">Open shareable article page</Link>
        </div>

      </div>
    </div>
  );
};
