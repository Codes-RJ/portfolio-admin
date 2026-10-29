import { ResponsiveImage } from '../ui/ResponsiveImage';
import React from 'react';
import { useModalActions, useModalState } from '../../context/contentSubscriptions';
import { X, ExternalLink, Github, CheckCircle2, Calendar, Tag } from 'lucide-react';
import { useAccessibleModal } from '../../hooks/useAccessibleModal';
import { Link } from 'react-router-dom';
import { getProjectCategories } from '../../utils/projectCategories';

export const ProjectDetailModal: React.FC = () => {
  const { activeModalProject } = useModalState();
  const { setActiveModalProject } = useModalActions();

  const dialogRef = useAccessibleModal(Boolean(activeModalProject), () => setActiveModalProject(null));

  if (!activeModalProject) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative w-full max-w-3xl bg-white dark:bg-[#111827] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200"
      >
        
        {/* Close Button */}
        <button
          onClick={() => setActiveModalProject(null)}
          aria-label="Close project details"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Image */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <ResponsiveImage
            src={activeModalProject.image}
            alt={activeModalProject.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#111827] via-[#111827]/40 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {getProjectCategories(activeModalProject).map((category) => (
                <span key={category} className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-600 text-white shadow-md">
                  {category}
                </span>
              ))}
              {activeModalProject.flagship && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500 text-black shadow-md">
                  ⭐ Flagship Project
                </span>
              )}
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-800/80 text-gray-300 backdrop-blur-xs">
                <Calendar className="w-3.5 h-3.5" />
                {activeModalProject.date}
              </span>
            </div>
            <h2 id="modal-project-title" className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {activeModalProject.title}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Overview */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Project Overview</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
              {activeModalProject.longDescription || activeModalProject.description}
            </p>
          </div>

          {/* Key Metrics */}
          {activeModalProject.metrics && activeModalProject.metrics.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Outcomes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeModalProject.metrics.map((metric, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/50">
                    <span className="block text-xs text-brand-600 dark:text-brand-400 font-semibold mb-0.5">Outcome #{idx + 1}</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{metric}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Features */}
          {activeModalProject.keyFeatures && activeModalProject.keyFeatures.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Architecture & Core Features</h3>
              <ul className="space-y-2">
                {activeModalProject.keyFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack Pills */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-brand-500" />
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {activeModalProject.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-xl text-xs font-mono font-medium bg-gray-100 dark:bg-gray-800 text-brand-600 dark:text-brand-400 border border-gray-200 dark:border-gray-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-end space-x-3">
            <Link to={`/projects/${encodeURIComponent(activeModalProject.id)}`} onClick={() => setActiveModalProject(null)} className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-semibold text-brand-600 bg-brand-50 dark:bg-brand-950/40">Shareable page</Link>
            {activeModalProject.githubUrl && activeModalProject.showGithub !== false && (
              <a
                href={activeModalProject.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>Source Repository</span>
              </a>
            )}
            {activeModalProject.liveUrl && activeModalProject.showLive !== false && (
              <a
                href={activeModalProject.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-600/25 transition-all"
              >
                <span>Live Demonstration</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
