import {
  Edit,
  Trash2
} from 'lucide-react';
import { IconRenderer } from '../../ui/IconRenderer';
import type { AdminEditor } from '../useAdminEditor';

export function AdminExperienceSection({ editor }: { editor: Pick<AdminEditor, 'achievements' | 'deleteExperience' | 'editingExperienceId' | 'experiences' | 'handleCreateExp' | 'location' | 'newExp' | 'setEditingExperienceId' | 'setNewExp' | 'setIconPickerOpen' | 'setIconPickerTarget'> }) {
  const { deleteExperience, editingExperienceId, experiences, handleCreateExp, newExp, setEditingExperienceId, setNewExp, setIconPickerOpen, setIconPickerTarget } = editor;
  return (
    <div className="space-y-8">
      <form onSubmit={handleCreateExp} className="p-8 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-4 shadow-xl">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editingExperienceId ? 'Edit Work Experience Role' : 'Add Work Experience Role'}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="admin-field-029" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Role Title</label>
            <input
              id="admin-field-029"
              type="text"
              required
              value={newExp.title}
              onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
              placeholder="e.g. Lead Software Engineer"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="admin-field-030" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Company / Organization</label>
            <input
              id="admin-field-030"
              type="text"
              required
              value={newExp.company}
              onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
              placeholder="e.g. TechCorp AI"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="admin-field-031" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Period</label>
            <input
              id="admin-field-031"
              type="text"
              value={newExp.period}
              onChange={(e) => setNewExp({ ...newExp, period: e.target.value })}
              placeholder="e.g. Jan 2024 – Present"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="admin-field-032" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Location</label>
            <input
              id="admin-field-032"
              type="text"
              value={newExp.location}
              onChange={(e) => setNewExp({ ...newExp, location: e.target.value })}
              placeholder="e.g. San Francisco, CA / Remote"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="admin-field-exp-type" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Employment Type</label>
            <select
              id="admin-field-exp-type"
              value={newExp.type}
              onChange={(e) => setNewExp({ ...newExp, type: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>
          <div>
            <p className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Company / Role Icon</p>
            <button
              type="button"
              onClick={() => {
                setIconPickerTarget({ type: 'exp' });
                setIconPickerOpen(true);
              }}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <IconRenderer icon={newExp.logo} className="w-4 h-4" />
                <span className="font-mono text-xs">{newExp.logo}</span>
              </div>
              <span className="text-[11px] font-bold text-[var(--color-primary)]">Change Icon →</span>
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="admin-field-033" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Summary</label>
          <textarea
            id="admin-field-033"
            rows={2}
            value={newExp.summary}
            onChange={(e) => setNewExp({ ...newExp, summary: e.target.value })}
            placeholder="High-level narrative of technical scope and team collaboration..."
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="admin-field-034" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Responsibilities</label>
            <textarea id="admin-field-034" rows={3} value={newExp.responsibilities} onChange={(e) => setNewExp({ ...newExp, responsibilities: e.target.value })} placeholder="Comma-separated" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white resize-y" />
          </div>
          <div>
            <label htmlFor="admin-field-035" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Achievements</label>
            <textarea id="admin-field-035" rows={3} value={newExp.achievements} onChange={(e) => setNewExp({ ...newExp, achievements: e.target.value })} placeholder="Comma-separated" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white resize-y" />
          </div>
          <div>
            <label htmlFor="admin-field-036" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Technologies</label>
            <textarea id="admin-field-036" rows={3} value={newExp.technologies} onChange={(e) => setNewExp({ ...newExp, technologies: e.target.value })} placeholder="Comma-separated" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white resize-y" />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] cursor-pointer"
        >
          {editingExperienceId ? 'Save Experience Changes' : '+ Add Experience to Timeline'}
        </button>
      </form>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Existing Timeline ({experiences.length})</h3>
        <div className="space-y-3">
          {experiences.map((exp) => (
            <div key={exp.id} className="p-5 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-lg shrink-0">
                  <IconRenderer icon={exp.logo} name={exp.company} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{exp.title} at {exp.company}</h4>
                  <span className="text-[11px] text-gray-500 font-mono block truncate">{exp.period} · {exp.location}{exp.type ? ` · ${exp.type}` : ''}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setEditingExperienceId(exp.id);
                    setNewExp({
                      title: exp.title,
                      company: exp.company,
                      period: exp.period,
                      location: exp.location,
                      summary: exp.summary,
                      responsibilities: exp.responsibilities.join(', '),
                      achievements: exp.achievements.join(', '),
                      technologies: exp.technologies.join(', '),
                      logo: exp.logo,
                      type: exp.type || 'Full-time'
                    });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-2 rounded-xl text-gray-500 hover:bg-gray-500/10 cursor-pointer"
                  aria-label={`Edit ${exp.title}`}
                  title="Edit Experience"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete ${exp.title}?`)) deleteExperience(exp.id);
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
    </div>
  );
}
