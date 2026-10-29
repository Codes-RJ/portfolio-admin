import {
ChevronDown,
ChevronUp,
Edit,
Pin,
Star,
Trash2
} from 'lucide-react';
import { getProjectCategories,normalizeProjectCategories } from '../../../utils/projectCategories';
import { ImageUploadField } from '../../ui/ImageUploadField';
import { ResponsiveImage } from '../../ui/ResponsiveImage';
import type { AdminEditor } from '../useAdminEditor';

export function AdminProjectsSection({ editor }: { editor: Pick<AdminEditor, 'deleteProject' | 'handleCreateProject' | 'newProject' | 'projectCategories' | 'projects' | 'reorderProjects' | 'setEditingProject' | 'setNewProject' | 'updateProject' | 'notify'> }) {
  const { deleteProject, handleCreateProject, newProject, projectCategories, projects, reorderProjects, setEditingProject, setNewProject, updateProject, notify } = editor;
  return (
          <div className="space-y-8">

            {/* Create Project Form */}
            <form onSubmit={handleCreateProject} className="p-8 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-6 shadow-xl">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add New Technical Project</h2>

              {/* Project Image Upload */}
              <div className="p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-gray-200/80 dark:border-gray-700/80">
                <ImageUploadField
                  label="Project Cover Screenshot / Visual"
                  value={newProject.image}
                  aspectRatio="16:9"
                  previewHeight="h-48"
                  helperText="Upload a project screenshot (16:9 recommended). Hosted files use shared Storage; local files remain in this browser."
                  onChange={(imgData) => setNewProject({ ...newProject, image: imgData })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="admin-field-011" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Project Title</label>
                  <input id="admin-field-011"
                    type="text"
                    required
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    placeholder="e.g. Distributed Analytics Platform"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="admin-field-012" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Primary group</label>
                  <select id="admin-field-012"
                    value={newProject.category}
                    onChange={(e) => setNewProject({
                      ...newProject,
                      category: e.target.value,
                      categories: normalizeProjectCategories(e.target.value, newProject.categories),
                    })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                  >
                    {projectCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <fieldset className="sm:col-span-2 rounded-2xl border border-gray-200 bg-gray-50/70 p-4 dark:border-gray-700 dark:bg-gray-800/40">
                  <legend className="px-1 text-xs font-semibold text-gray-700 dark:text-gray-300">Project groups</legend>
                  <p className="mb-3 text-[11px] text-gray-500">Select every area this project belongs to. The primary group is always included.</p>
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Project groups">
                    {projectCategories.map((category) => {
                      const checked = normalizeProjectCategories(newProject.category, newProject.categories).includes(category);
                      const isPrimary = category === newProject.category;
                      return (
                        <label key={category} className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${checked ? 'border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 text-[var(--color-primary)] dark:text-[#9B87FF]' : 'border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-300'} ${isPrimary ? 'cursor-default' : 'cursor-pointer'}`}>
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={isPrimary}
                            onChange={(event) => {
                              const next = event.target.checked
                                ? [...newProject.categories, category]
                                : newProject.categories.filter((item) => item !== category);
                              setNewProject({ ...newProject, categories: normalizeProjectCategories(newProject.category, next) });
                            }}
                            className="h-4 w-4 rounded-sm border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] disabled:opacity-70"
                          />
                          {category}{isPrimary ? ' (primary)' : ''}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <div>
                  <label htmlFor="admin-field-013" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Technologies (comma-separated)</label>
                  <input id="admin-field-013"
                    type="text"
                    value={newProject.technologies}
                    onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                    placeholder="React, TypeScript, Tailwind, Python"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="admin-field-014" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Project Date / Year</label>
                  <input id="admin-field-014"
                    type="text"
                    value={newProject.date}
                    onChange={(e) => setNewProject({ ...newProject, date: e.target.value })}
                    placeholder="e.g. 2025 or 2024 – 2025"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                  />
                </div>

                {/* GitHub link with Individual Visibility Tickbox */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/60">
                  <div className="flex items-center justify-between">
                    <label htmlFor="admin-new-project-github-url" className="text-xs font-semibold text-gray-700 dark:text-gray-300">GitHub Repository</label>
                    <label className="flex items-center gap-1.5 text-xs text-[var(--color-primary)] dark:text-[var(--color-primary-light)] cursor-pointer font-bold select-none">
                      <input
                        type="checkbox"
                        checked={newProject.showGithub}
                        onChange={(e) => setNewProject({ ...newProject, showGithub: e.target.checked })}
                        className="rounded-sm border-gray-400 text-[var(--color-primary)] focus:ring-[var(--color-primary)] w-4 h-4 cursor-pointer"
                      />
                      <span>✓ Show GitHub Link</span>
                    </label>
                  </div>
                  <input
                    id="admin-new-project-github-url"
                    type="text"
                    disabled={!newProject.showGithub}
                    value={newProject.githubUrl}
                    onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                    placeholder="https://github.com/username/project"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white disabled:opacity-40"
                  />
                </div>

                {/* Live Demo link with Individual Visibility Tickbox */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/60">
                  <div className="flex items-center justify-between">
                    <label htmlFor="admin-new-project-live-url" className="text-xs font-semibold text-gray-700 dark:text-gray-300">Live Demonstration URL</label>
                    <label className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 cursor-pointer font-bold select-none">
                      <input
                        type="checkbox"
                        checked={newProject.showLive}
                        onChange={(e) => setNewProject({ ...newProject, showLive: e.target.checked })}
                        className="rounded-sm border-gray-400 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                      />
                      <span>✓ Show Live Demo Link</span>
                    </label>
                  </div>
                  <input
                    id="admin-new-project-live-url"
                    type="text"
                    disabled={!newProject.showLive}
                    value={newProject.liveUrl}
                    onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                    placeholder="https://demo.example.com"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white disabled:opacity-40"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="admin-field-015" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Card Short Summary (Shown on grid cards)
                </label>
                <textarea id="admin-field-015"
                  rows={2}
                  required
                  placeholder="Concise 1-2 sentence overview of what the project does..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white resize-none"
                />
              </div>

              <div>
                <label htmlFor="admin-field-016" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Full Case Study & Architecture Overview (Shown in Case Study Modal)
                </label>
                <textarea id="admin-field-016"
                  rows={4}
                  placeholder="Detailed breakdown of the project narrative: problem statement, system design decisions, trade-offs, and technical implementation..."
                  value={newProject.longDescription}
                  onChange={(e) => setNewProject({ ...newProject, longDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="admin-field-017" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Impact & Performance Benchmarks (comma-separated)
                  </label>
                  <input id="admin-field-017"
                    type="text"
                    placeholder="e.g. 99.9% Uptime, <50ms P99 Latency, 15K+ Active Users"
                    value={newProject.metrics}
                    onChange={(e) => setNewProject({ ...newProject, metrics: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="admin-field-018" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Core Architectural Features (one feature per line)
                  </label>
                  <textarea id="admin-field-018"
                    rows={3}
                    placeholder="Real-time WebSockets synchronization&#10;Zero-downtime blue/green deployment&#10;End-to-end type safety with tRPC"
                    value={newProject.keyFeatures}
                    onChange={(e) => setNewProject({ ...newProject, keyFeatures: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)]"
              >
                + Add Project
              </button>
            </form>

            {/* Home Page Showcase Handpicker (Requirement 4) */}
            <div className="p-6 rounded-3xl glass-card border border-brand-500/20 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                      Home Page Showcase Manager (Max 5 Projects)
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Select 1 Featured Flagship Project and up to 4 Showcase Projects to display on the Home Page.
                  </p>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold">
                    Featured: {projects.filter((p) => p.flagship).length}/1
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] border border-brand-500/20 font-bold">
                    Showcase: {projects.filter((p) => !p.flagship && (p.homeShowcase || p.featured)).length}/4
                  </span>
                </div>
              </div>

              {/* Quick project selector list for Home */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {projects.map((proj) => {
                  const isFlagship = Boolean(proj.flagship);
                  const isShowcase = Boolean(!proj.flagship && (proj.homeShowcase || proj.featured));

                  return (
                    <div
                      key={proj.id}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-2.5 ${
                        isFlagship
                          ? 'border-amber-500/60 bg-amber-500/5 ring-2 ring-amber-500/30'
                          : isShowcase
                          ? 'border-brand-500/50 bg-brand-500/5 ring-1 ring-brand-500/30'
                          : 'border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 opacity-75'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <ResponsiveImage
                          src={proj.image}
                          alt={proj.title}
                          className="w-10 h-10 rounded-xl object-cover shrink-0 border border-gray-200 dark:border-gray-700"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{proj.title}</h4>
                          <span className="text-[10px] font-mono text-gray-500 line-clamp-1">{getProjectCategories(proj).join(' · ')}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                        {/* 1. Toggle Flagship (1 only) */}
                        <button
                          type="button"
                          onClick={() => {
                            // Make this the flagship, unset others
                            projects.forEach((p) => {
                              if (p.id === proj.id) {
                                updateProject(p.id, { flagship: true, homeShowcase: false, featured: true });
                              } else if (p.flagship) {
                                updateProject(p.id, { flagship: false, homeShowcase: true });
                              }
                            });
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                            isFlagship
                              ? 'bg-amber-500 text-black shadow-xs font-extrabold'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-amber-500'
                          }`}
                          title="Set as the 1 Featured Flagship Project on Home"
                        >
                          <Star className="w-3 h-3" />
                          <span>{isFlagship ? 'Featured (1/1)' : 'Make Featured'}</span>
                        </button>

                        {/* 2. Toggle Showcase (up to 4) */}
                        {!isFlagship && (
                          <button
                            type="button"
                            onClick={() => {
                              const currentCount = projects.filter((p) => !p.flagship && (p.homeShowcase || p.featured)).length;
                              if (!isShowcase && currentCount >= 4) {
                                notify('Choose up to four showcase projects. Unpin one before selecting another.', 'error');
                                return;
                              }
                              updateProject(proj.id, { homeShowcase: !isShowcase, featured: !isShowcase });
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                              isShowcase
                                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-[var(--color-primary)]'
                            }`}
                            title="Toggle inclusion in Home Showcase (4 projects)"
                          >
                            <Pin className="w-3 h-3" />
                            <span>{isShowcase ? 'On Home' : 'Show on Home'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* List Existing Projects with Position Ordering & Edit */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  All Projects & Position Ordering ({projects.length})
                </h3>
                <span className="text-xs text-gray-500 font-mono">Use ▲ ▼ to reorder positions</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((proj, idx) => (
                  <div key={proj.id} className="p-5 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
                    <div className="flex items-center space-x-3 min-w-0">
                      {/* Position Reordering Buttons */}
                      <div className="flex flex-col items-center justify-center space-y-1 pr-1 border-r border-gray-200 dark:border-gray-800">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => reorderProjects(idx, idx - 1)}
                          className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-[var(--color-primary)] hover:text-white flex items-center justify-center text-gray-600 dark:text-gray-400 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                          title="Move project up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] font-mono font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">
                          #{idx + 1}
                        </span>
                        <button
                          type="button"
                          disabled={idx === projects.length - 1}
                          onClick={() => reorderProjects(idx, idx + 1)}
                          className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-[var(--color-primary)] hover:text-white flex items-center justify-center text-gray-600 dark:text-gray-400 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                          title="Move project down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0">
                        <ResponsiveImage
                          src={proj.image}
                          alt={proj.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80';
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-gray-900 dark:text-white truncate">{proj.title}</span>
                          {getProjectCategories(proj).map((category) => (
                            <span key={category} className="px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-brand-500/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">
                              {category}
                            </span>
                          ))}
                        </div>
                        <span className="text-[11px] text-gray-500 block truncate">{getProjectCategories(proj).join(' · ')} · {proj.technologies.slice(0, 3).join(', ')}</span>
                        <div className="flex items-center gap-2 pt-1 text-[10px] font-mono text-gray-400">
                          <span>GitHub: {proj.showGithub !== false && proj.githubUrl ? '✓ Visible' : '✕ Hidden'}</span>
                          <span>·</span>
                          <span>Live: {proj.showLive !== false && proj.liveUrl ? '✓ Visible' : '✕ Hidden'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingProject(proj)}
                        className="p-2 rounded-xl text-[var(--color-primary)] hover:bg-brand-500/10"
                        title="Edit Project"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete ${proj.title}?`)) deleteProject(proj.id);
                        }}
                        className="p-2 rounded-xl text-red-500 hover:bg-red-500/10"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        );
}
