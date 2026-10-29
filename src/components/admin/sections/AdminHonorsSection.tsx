import {
ChevronDown,
ChevronUp,
Edit,
Plus,
Trash2,
Trophy
} from 'lucide-react';
import { HonorBadgeIcon } from '../../ui/HonorBadgeIcon';
import type { AdminEditor } from '../useAdminEditor';

export function AdminHonorsSection({ editor }: { editor: Pick<AdminEditor, 'achievements' | 'deleteAchievement' | 'editAchDesc' | 'editAchOrg' | 'editAchTitle' | 'editAchYear' | 'editingAchId' | 'handleCreateAchievement' | 'handleSaveAchievementEdit' | 'newAchBadge' | 'newAchDesc' | 'newAchOrg' | 'newAchTitle' | 'newAchYear' | 'reorderAchievements' | 'setEditAchDesc' | 'setEditAchOrg' | 'setEditAchTitle' | 'setEditAchYear' | 'setEditingAchId' | 'setIconPickerOpen' | 'setIconPickerTarget' | 'setNewAchDesc' | 'setNewAchOrg' | 'setNewAchTitle' | 'setNewAchYear'> }) {
  const { achievements, deleteAchievement, editAchDesc, editAchOrg, editAchTitle, editAchYear, editingAchId, handleCreateAchievement, handleSaveAchievementEdit, newAchBadge, newAchDesc, newAchOrg, newAchTitle, newAchYear, reorderAchievements, setEditAchDesc, setEditAchOrg, setEditAchTitle, setEditAchYear, setEditingAchId, setIconPickerOpen, setIconPickerTarget, setNewAchDesc, setNewAchOrg, setNewAchTitle, setNewAchYear } = editor;
  return (
          <div className="space-y-8">
            {/* Create New Honor Form */}
            <form onSubmit={handleCreateAchievement} className="p-8 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <span>Add Honor, Award or Recognition</span>
                  </h2>
                  <p className="text-xs text-gray-500">
                    Showcased in the Competency Dashboard right beside the Validated Skills Matrix on the homepage.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  {achievements.length} Active Honors
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="admin-field-019" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Award / Honor Title
                  </label>
                  <input id="admin-field-019"
                    type="text"
                    required
                    placeholder="e.g. Smart India Hackathon Finalist"
                    value={newAchTitle}
                    onChange={(e) => setNewAchTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label htmlFor="admin-field-020" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Organization / Issuing Body
                  </label>
                  <input id="admin-field-020"
                    type="text"
                    required
                    placeholder="e.g. Ministry of Education / IEEE"
                    value={newAchOrg}
                    onChange={(e) => setNewAchOrg(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label htmlFor="admin-field-021" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Year / Period
                  </label>
                  <input id="admin-field-021"
                    type="text"
                    required
                    placeholder="e.g. 2026"
                    value={newAchYear}
                    onChange={(e) => setNewAchYear(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="sm:col-span-2">
                  <label htmlFor="admin-field-022" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Description / Significance (Optional)
                  </label>
                  <input id="admin-field-022"
                    type="text"
                    placeholder="Brief description of the accomplishment or ranking"
                    value={newAchDesc}
                    onChange={(e) => setNewAchDesc(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-hidden"
                  />
                </div>

                <div>
                  <p className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Badge Icon
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIconPickerTarget({ type: 'newAchievement' });
                      setIconPickerOpen(true);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs flex items-center justify-between hover:border-[var(--color-primary)] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 text-violet-700 dark:text-white" aria-hidden="true">
                        <HonorBadgeIcon badge={newAchBadge} className="w-6 h-6" />
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">{newAchBadge}</span>
                    </div>
                    <span className="text-[11px] text-[var(--color-primary)] font-semibold">Change</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Honor / Award</span>
              </button>
            </form>

            {/* List of Existing Honors */}
            <div className="p-8 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Honors & Recognitions ({achievements.length}) — Reorderable:
                </h3>
                <span className="text-xs text-gray-400 font-mono">Use ▲ ▼ to arrange display order</span>
              </div>

              {achievements.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-dashed border-gray-300 dark:border-gray-700 space-y-2">
                  <Trophy className="w-10 h-10 text-amber-500/50 mx-auto" />
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300">No Honors or Awards Added Yet</p>
                  <p className="text-xs text-gray-400 font-mono">Use the form above to add your first award or achievement.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((ach, idx) => (
                    <div
                      key={ach.id}
                      className="p-4 rounded-2xl bg-gray-50/80 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 space-y-3 hover:border-amber-500/40 transition-all shadow-xs"
                    >
                      {editingAchId === ach.id ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editAchTitle}
                            onChange={(e) => setEditAchTitle(e.target.value)}
                            placeholder="Title"
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-xs"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={editAchOrg}
                              onChange={(e) => setEditAchOrg(e.target.value)}
                              placeholder="Organization"
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-xs"
                            />
                            <input
                              type="text"
                              value={editAchYear}
                              onChange={(e) => setEditAchYear(e.target.value)}
                              placeholder="Year"
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-xs"
                            />
                          </div>
                          <input
                            type="text"
                            value={editAchDesc}
                            onChange={(e) => setEditAchDesc(e.target.value)}
                            placeholder="Description"
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-xs"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleSaveAchievementEdit(ach.id)}
                              className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingAchId(null)}
                              className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-xs font-semibold"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            {/* Reorder Buttons */}
                            <div className="flex flex-col gap-1 shrink-0">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => reorderAchievements(idx, idx - 1)}
                                className="w-5 h-5 rounded-sm bg-gray-100 dark:bg-gray-700 hover:bg-[var(--color-primary)] hover:text-white flex items-center justify-center text-gray-500 disabled:opacity-20 transition-colors cursor-pointer"
                                title="Move Up"
                              >
                                <ChevronUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === achievements.length - 1}
                                onClick={() => reorderAchievements(idx, idx + 1)}
                                className="w-5 h-5 rounded-sm bg-gray-100 dark:bg-gray-700 hover:bg-[var(--color-primary)] hover:text-white flex items-center justify-center text-gray-500 disabled:opacity-20 transition-colors cursor-pointer"
                                title="Move Down"
                              >
                                <ChevronDown className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Badge Icon */}
                            <button
                              type="button"
                              onClick={() => {
                                setIconPickerTarget({ type: 'editAchievement', id: ach.id });
                                setIconPickerOpen(true);
                              }}
                              className="shrink-0 rounded-lg p-1 text-violet-700 dark:text-white hover:text-violet-500 dark:hover:text-violet-200 hover:scale-105 transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
                              title="Click to Change Badge Icon"
                            >
                              <HonorBadgeIcon badge={ach.badge} category={ach.category} title={ach.title} className="w-9 h-9" />
                            </button>

                            {/* Info */}
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                                {ach.title}
                              </h4>
                              <p className="text-[11px] font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] truncate">
                                {ach.organization} · {ach.year}
                              </p>
                              {ach.description && (
                                <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                                  {ach.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center space-x-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingAchId(ach.id);
                                setEditAchTitle(ach.title);
                                setEditAchOrg(ach.organization);
                                setEditAchYear(ach.year);
                                setEditAchDesc(ach.description || '');
                              }}
                              className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete honor "${ach.title}"?`)) {
                                  deleteAchievement(ach.id);
                                }
                              }}
                              className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
}
