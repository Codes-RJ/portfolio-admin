import React, { useMemo } from 'react';
import { UploadCloud, CheckCircle2, X, Layers, Briefcase, Award, BookOpen } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface PrePublishDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isSaving: boolean;
}

interface DiffDelta {
  type: 'added' | 'modified' | 'removed';
  category: string;
  label: string;
}

function computeDiffDeltas(
  current: ReturnType<typeof useData>['currentContent'],
  published: ReturnType<typeof useData>['publishedContent']
): DiffDelta[] {
  if (!current || !published) return [];
  const deltas: DiffDelta[] = [];

  const compareEntities = <T,>(
    currList: readonly T[] = [],
    pubList: readonly T[] = [],
    category: string,
    getName: (item: T) => string,
    getId: (item: T) => string = (item: any) => item.id
  ) => {
    const pubMap = new Map(pubList.map((i) => [getId(i), i]));
    const currMap = new Map(currList.map((i) => [getId(i), i]));

    for (const item of currList) {
      const id = getId(item);
      const pubItem = pubMap.get(id);
      if (!pubItem) {
        deltas.push({ type: 'added', category, label: getName(item) });
      } else if (JSON.stringify(item) !== JSON.stringify(pubItem)) {
        deltas.push({ type: 'modified', category, label: getName(item) });
      }
    }

    for (const item of pubList) {
      const id = getId(item);
      if (!currMap.has(id)) {
        deltas.push({ type: 'removed', category, label: getName(item) });
      }
    }
  };

  compareEntities(current.projects, published.projects, 'Project', (p) => p.title);
  compareEntities(current.blogPosts, published.blogPosts, 'Blog Post', (b) => b.title);
  compareEntities(current.certificates, published.certificates, 'Certificate', (c) => c.title);
  compareEntities(current.experiences, published.experiences, 'Experience', (e) => `${e.title} @ ${e.company}`);
  compareEntities(current.researchPapers, published.researchPapers, 'Research Paper', (r) => r.title);
  compareEntities(current.achievements, published.achievements, 'Honors & Award', (a) => a.title);
  compareEntities(current.skillCategories, published.skillCategories, 'Skill Group', (s) => s.category || s.title || 'Untitled Group');
  compareEntities(current.toolsList, published.toolsList, 'Tool', (t) => t.name, (t) => t.id || t.name);
  compareEntities(current.techStack, published.techStack, 'Tech Stack Logo', (t) => t.name, (t) => t.id || t.name);
  compareEntities(current.currentlyLearning, published.currentlyLearning, 'Learning Roadmap', (l) => l.topic || l.title || 'Milestone', (l) => l.id || l.title || l.topic || '');

  if (JSON.stringify(current.profile) !== JSON.stringify(published.profile)) {
    deltas.push({ type: 'modified', category: 'Profile', label: 'Identity & Bio Details' });
  }

  if (JSON.stringify(current.siteSettings?.pageHeaders) !== JSON.stringify(published.siteSettings?.pageHeaders)) {
    deltas.push({ type: 'modified', category: 'Copy', label: 'Page Titles & Descriptions' });
  }

  if (
    current.siteSettings?.primaryColor !== published.siteSettings?.primaryColor ||
    current.siteSettings?.themeMode !== published.siteSettings?.themeMode
  ) {
    deltas.push({ type: 'modified', category: 'Theme', label: 'Primary Brand Color or Mode' });
  }

  if (JSON.stringify(current.skills) !== JSON.stringify(published.skills)) {
    deltas.push({ type: 'modified', category: 'Skills', label: 'Skills Catalog' });
  }

  return deltas;
}

export const PrePublishDiffModal: React.FC<PrePublishDiffModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isSaving,
}) => {
  const data = useData();

  const deltas = useMemo(
    () => computeDiffDeltas(data.currentContent, data.publishedContent),
    [data.currentContent, data.publishedContent]
  );

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pre-publish-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0f1422] border border-gray-800 text-white shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 id="pre-publish-title" className="text-base font-bold">
                Pre-Publish Review
              </h3>
              <p className="text-xs text-gray-400">
                Review semantic changes before committing live to Supabase.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Snapshot Summary */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
            Current Content Snapshot
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center gap-2.5">
              <Briefcase className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <span className="text-base font-bold block leading-tight text-white">
                  {data.projects.length}
                </span>
                <span className="text-[10px] text-gray-400">Projects</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <span className="text-base font-bold block leading-tight text-white">
                  {data.blogPosts.length}
                </span>
                <span className="text-[10px] text-gray-400">Articles</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center gap-2.5">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-base font-bold block leading-tight text-white">
                  {data.certificates.length}
                </span>
                <span className="text-[10px] text-gray-400">Certificates</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-base font-bold block leading-tight text-white">
                  {data.skillCategories.length}
                </span>
                <span className="text-[10px] text-gray-400">Categories</span>
              </div>
            </div>
          </div>

          {/* Semantic Delta Breakdown (UI-ADM-02) */}
          {deltas.length > 0 ? (
            <div className="space-y-2 pt-1">
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
                Pending Modifications ({deltas.length})
              </span>
              <div className="max-h-44 overflow-y-auto space-y-1.5 p-3 rounded-xl bg-gray-900/90 border border-gray-800 text-xs">
                {deltas.map((d, i) => (
                  <div key={i} className="flex items-center justify-between py-1 border-b border-gray-800/60 last:border-0 gap-2">
                    <div className="flex items-center gap-2 truncate min-w-0">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase shrink-0 ${
                        d.type === 'added' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        d.type === 'modified' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {d.type === 'added' ? '+ Added' : d.type === 'modified' ? '~ Modified' : '- Removed'}
                      </span>
                      <span className="text-gray-200 font-medium truncate">{d.label}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono shrink-0">{d.category}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 text-xs text-gray-400 text-center">
              All in-memory content matches the live cloud version.
            </div>
          )}

          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Instant Visitor Reflection</p>
              <p className="text-[11px] text-indigo-300/80 mt-0.5">
                Saving updates Supabase PostgreSQL. Connected visitor browsers receive changes in under 100ms via Realtime WebSockets.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel / Keep Editing
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Publishing to Database…</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span>Confirm & Publish Live</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};