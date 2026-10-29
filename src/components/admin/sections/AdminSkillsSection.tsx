import {
ChevronDown,
ChevronLeft,
ChevronRight,
ChevronUp,
Cpu,
Sparkles,
Trash2,
Trophy
} from 'lucide-react';
import { skillLevel } from '../../../utils/skills';
import { HexagonSkillRadar } from '../../ui/BlobDecorators';
import { IconRenderer } from '../../ui/IconRenderer';
import { HonorBadgeIcon } from '../../ui/HonorBadgeIcon';
import type { AdminEditor } from '../useAdminEditor';

export function AdminSkillsSection({ editor }: { editor: Pick<AdminEditor, 'achievements' | 'addSkillToCategory' | 'currentlyLearning' | 'deleteCurrentlyLearning' | 'deleteSkillCategory' | 'deleteSkillFromCategory' | 'deleteTechStackItem' | 'deleteTool' | 'handleAddTechStackItem' | 'handleCreateCategory' | 'handleCreateLearning' | 'handleCreateTool' | 'newCatIcon' | 'newCatProficiency' | 'newCatTitle' | 'newLearning' | 'newSkillPerCat' | 'newTechItem' | 'newTool' | 'reorderCurrentlyLearning' | 'reorderSkillCategories' | 'reorderSkillsInCategory' | 'reorderTechStack' | 'reorderTools' | 'setActiveTab' | 'setIconPickerOpen' | 'setIconPickerTarget' | 'setNewCatProficiency' | 'setNewCatTitle' | 'setNewLearning' | 'setNewSkillPerCat' | 'setNewTechItem' | 'setNewTool' | 'skillCategories' | 'techStack' | 'toolsList' | 'totalSkillsCount' | 'updateSkillCategory' | 'updateSkillInCategory' | 'updateTechStackItem'> }) {
  const { achievements, addSkillToCategory, currentlyLearning, deleteCurrentlyLearning, deleteSkillCategory, deleteSkillFromCategory, deleteTechStackItem, deleteTool, handleAddTechStackItem, handleCreateCategory, handleCreateLearning, handleCreateTool, newCatIcon, newCatProficiency, newCatTitle, newLearning, newSkillPerCat, newTechItem, newTool, reorderCurrentlyLearning, reorderSkillCategories, reorderSkillsInCategory, reorderTechStack, reorderTools, setActiveTab, setIconPickerOpen, setIconPickerTarget, setNewCatProficiency, setNewCatTitle, setNewLearning, setNewSkillPerCat, setNewTechItem, setNewTool, skillCategories, techStack, toolsList, totalSkillsCount, updateSkillCategory, updateSkillInCategory, updateTechStackItem } = editor;
  return (
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-10 shadow-xl">
            {/* Header & Metric Overview */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Skills, Tools & IoT Matrix CMS</h2>
                <p className="text-xs text-gray-500">
                  Full control: Add, edit, reorder, and delete skill groups, skills, proficiency levels, icons, tools, and roadmap items.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-brand-500/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] border border-brand-500/20">
                  {skillCategories.length} Groups
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {skillCategories.reduce((acc, cat) => acc + (cat.skills?.length || 0), 0)} Skills
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  {toolsList.length} Tools
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  {currentlyLearning.length} Learning
                </span>
              </div>
            </div>

            {/* Live Public Hero & Competency Dashboard Trio Sync Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] animate-ping" />
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Live Homepage Competency Dashboard (Honors · Validated Skills Radar · Tech Stack)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-gray-400">
                  {skillCategories.length} Active Categories · {totalSkillsCount} Skills · {achievements.length} Honors
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                {/* Col 1: Honors & Recognitions Preview */}
                <div className="lg:col-span-4 p-4 rounded-2xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-200/80 dark:border-gray-700/80 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200/60 dark:border-gray-700/60">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5 text-amber-500" />
                        Honors ({achievements.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveTab('honors')}
                        className="text-[10px] font-mono text-[var(--color-primary)] hover:underline"
                      >
                        Manage →
                      </button>
                    </div>

                    <div className="space-y-2 pt-2">
                      {achievements.length === 0 ? (
                        <p className="text-[11px] text-gray-400 font-mono text-center py-4">No honors added yet.</p>
                      ) : (
                        achievements.slice(0, 2).map((ach) => (
                          <div key={ach.id} className="flex items-center gap-2 text-xs">
                            <span className="shrink-0 text-violet-700 dark:text-white" aria-hidden="true">
                              <HonorBadgeIcon badge={ach.badge} category={ach.category} title={ach.title} className="w-6 h-6" />
                            </span>
                            <div className="min-w-0 flex-1 truncate">
                              <span className="font-semibold text-gray-900 dark:text-white truncate block">{ach.title}</span>
                              <span className="text-[10px] text-gray-400 font-mono">{ach.organization} · {ach.year}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] text-gray-400 font-mono text-center block pt-2 border-t border-gray-200/60 dark:border-gray-700/60">
                    Live synced with Homepage Col 1
                  </span>
                </div>

                {/* Col 2: Center Hexagon Radar */}
                <div className="lg:col-span-4 flex items-center justify-center">
                  <HexagonSkillRadar categories={skillCategories} className="max-w-[240px] h-full" />
                </div>

                {/* Col 3: Technology Stack Vector Logos */}
                <div className="lg:col-span-4 p-4 rounded-2xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-200/80 dark:border-gray-700/80 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200/60 dark:border-gray-700/60">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                        Tech Stack Logos
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">{techStack.length} Live Logos</span>
                    </div>

                    <div className="grid grid-cols-6 gap-1.5 pt-2">
                      {techStack.map((tech) => (
                        <div
                          key={tech.id}
                          title={tech.name}
                          className="aspect-square rounded-xl bg-white/70 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80 flex items-center justify-center p-1.5 shadow-xs hover:scale-110 transition-transform"
                        >
                          <IconRenderer icon={tech.icon} name={tech.name} color={tech.color} className="w-4 h-4" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <span className="text-[10px] text-gray-400 font-mono text-center block pt-2 border-t border-gray-200/60 dark:border-gray-700/60">
                    Live synced with Homepage Col 3
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION A: Technology Stack Vector Logos Manager (Homepage Column 3) */}
            <div className="p-6 rounded-3xl glass-card border border-brand-500/20 shadow-lg space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                      Technology Stack Logos (Homepage Column 3)
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500">
                    Manage the vector brand logos displayed on the homepage technology stack grid. Reorder, change icons, pick brand colors, or add new tools.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-brand-500/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] text-xs font-bold font-mono shrink-0">
                  {techStack.length} Logos Configured
                </span>
              </div>

              {/* Add New Technology Logo Form */}
              <form onSubmit={handleAddTechStackItem} className="p-4 rounded-2xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/80 flex flex-wrap items-center gap-3">
                {/* Icon Selector Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIconPickerTarget({ type: 'newTechStack' });
                    setIconPickerOpen(true);
                  }}
                  className="px-3 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 flex items-center gap-2 text-xs font-semibold hover:border-[var(--color-primary)] transition-colors cursor-pointer"
                  title="Choose Technology Icon"
                >
                  <div className="w-5 h-5 rounded-sm bg-brand-500/10 flex items-center justify-center">
                    <IconRenderer icon={newTechItem.icon} color={newTechItem.color} className="w-4 h-4" />
                  </div>
                  <span>Icon: <strong>{newTechItem.icon}</strong></span>
                </button>

                {/* Tech Name */}
                <input
                  type="text"
                  required
                  placeholder="Technology Name (e.g. Next.js, Docker, PyTorch, FastAPI)"
                  value={newTechItem.name}
                  onChange={(e) => setNewTechItem((prev) => ({ ...prev, name: e.target.value }))}
                  className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-hidden"
                />

                {/* Color input */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                  <span className="text-[11px] text-gray-400 font-medium">Color:</span>
                  <input
                    type="color"
                    value={newTechItem.color}
                    onChange={(e) => setNewTechItem((prev) => ({ ...prev, color: e.target.value }))}
                    className="w-6 h-6 rounded-sm cursor-pointer border-0 p-0 bg-transparent"
                    title="Choose brand color"
                  />
                  <span className="text-xs font-mono text-gray-600 dark:text-gray-300">{newTechItem.color}</span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  + Add to Stack
                </button>
              </form>

              {/* Grid of Configured Tech Stack Items with Reorder, Change Icon & Delete */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {techStack.map((tech, idx) => (
                  <div
                    key={tech.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-between text-center space-y-2.5 shadow-xs group hover:border-[var(--color-primary)]/60 transition-all"
                  >
                    {/* Top Reorder controls */}
                    <div className="w-full flex items-center justify-between">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => reorderTechStack(idx, idx - 1)}
                        className="p-1 rounded-sm bg-gray-100 dark:bg-gray-700 hover:bg-[var(--color-primary)] hover:text-white text-gray-500 disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                        title="Move left"
                      >
                        <ChevronLeft className="w-3 h-3" />
                      </button>
                      <span className="text-[10px] font-mono text-gray-400 font-bold">#{idx + 1}</span>
                      <button
                        type="button"
                        disabled={idx === techStack.length - 1}
                        onClick={() => reorderTechStack(idx, idx + 1)}
                        className="p-1 rounded-sm bg-gray-100 dark:bg-gray-700 hover:bg-[var(--color-primary)] hover:text-white text-gray-500 disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
                        title="Move right"
                      >
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Big Icon Preview with Change Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setIconPickerTarget({ type: 'techStack', id: tech.id });
                        setIconPickerOpen(true);
                      }}
                      className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                      title="Click to change icon"
                    >
                      <IconRenderer icon={tech.icon} name={tech.name} color={tech.color} className="w-6 h-6" />
                    </button>

                    {/* Editable Name */}
                    <input
                      type="text"
                      aria-label={`Edit ${tech.name || 'technology'} name`}
                      value={tech.name}
                      onChange={(e) => updateTechStackItem(tech.id, { name: e.target.value })}
                      className="w-full text-center text-xs font-bold text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:border-[var(--color-primary)] focus:outline-hidden px-1 py-0.5"
                    />

                    {/* Color Swatch & Delete */}
                    <div className="w-full flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-700/60">
                      <input
                        type="color"
                        value={tech.color || '#5B3FE8'}
                        onChange={(e) => updateTechStackItem(tech.id, { color: e.target.value })}
                        className="w-5 h-5 rounded-sm cursor-pointer border-0 p-0 bg-transparent"
                        title="Change brand color"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Remove "${tech.name}" from the technology stack?`)) {
                            deleteTechStackItem(tech.id);
                          }
                        }}
                        className="p-1 rounded-sm text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Delete technology"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION B: Validated Skills Radar Matrix Live Tuning & Dynamic Polygon Controls */}
            <div className="p-6 rounded-3xl glass-card border border-brand-500/20 shadow-lg space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <Cpu className="w-4 h-4 text-[var(--color-primary)]" />
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                      Validated Skills Radar Matrix (Dynamic N-Sided Polygon)
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500">
                    The matrix uses only the sections you add: <strong>0 = empty circle</strong>, <strong>1 = drop</strong>, <strong>2 = diamond</strong>, <strong>3 = triangle</strong>, <strong>4 = square</strong>, and every higher count becomes an <strong>N-sided polygon</strong>. Each section’s proficiency controls its own fill from the center outward.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono shrink-0">
                  {skillCategories.length >= 3 ? `${skillCategories.length}-Sided Polygon Active` : '3-Sided Triangle Active'}
                </span>
              </div>

              {/* Grid with Live Radar Preview and Category Control Sliders */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Live Radar Preview */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50/60 dark:bg-gray-800/40 border border-gray-200/80 dark:border-gray-700/80">
                  <HexagonSkillRadar categories={skillCategories} className="max-w-[260px] h-full" />
                  <span className="text-[11px] text-gray-400 font-mono mt-2 text-center">
                    Live dynamic preview based on your {skillCategories.length} skill groups
                  </span>
                </div>

                {/* Category Heading & Proficiency Control Bars */}
                <div className="lg:col-span-8 space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
                  {skillCategories.map((group, idx) => {
                    const avg = group.skills.length > 0
                      ? Math.round(group.skills.reduce((acc, s) => acc + skillLevel(s), 0) / group.skills.length)
                      : 0;
                    const currentProf = typeof group.proficiency === 'number' ? group.proficiency : avg;

                    return (
                      <div
                        key={group.id}
                        className="p-4 rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 space-y-3 shadow-xs hover:border-[var(--color-primary)]/50 transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          {/* Heading with Icon */}
                          <div className="flex items-center space-x-2 min-w-0 flex-1">
                            <span className="text-[10px] font-mono font-bold text-gray-400 px-1.5 py-0.5 rounded-sm bg-gray-100 dark:bg-gray-700">
                              Vertex #{idx + 1}
                            </span>
                            <div className="w-6 h-6 rounded-lg bg-brand-500/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] flex items-center justify-center shrink-0">
                              <IconRenderer icon={group.icon || group.iconName || 'Cpu'} className="w-3.5 h-3.5" />
                            </div>
                            <input
                              type="text"
                              value={group.category || group.title}
                              onChange={(e) =>
                                updateSkillCategory(group.id, {
                                  title: e.target.value,
                                  category: e.target.value
                                })
                              }
                              className="font-bold text-xs text-gray-900 dark:text-white bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:border-[var(--color-primary)] focus:outline-hidden px-1 py-0.5 min-w-[140px] flex-1"
                              placeholder="Section Heading"
                              title="Edit vertex heading"
                            />
                          </div>

                          {/* Proficiency score badge */}
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] text-gray-400 font-medium">Proficiency:</span>
                            <span className="text-xs font-mono font-extrabold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] px-2 py-0.5 rounded-lg bg-brand-500/10">
                              {currentProf}%
                            </span>
                          </div>
                        </div>

                        {/* Master Category Proficiency Control Bar */}
                        <div className="space-y-1">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={currentProf}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              updateSkillCategory(group.id, { proficiency: val });
                            }}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
                          />
                          <div className="flex justify-between text-[9px] font-mono text-gray-400">
                            <span>0% (Center)</span>
                            <span>50%</span>
                            <span>100% (Outer Edge)</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 1. Add New Skill Group / Category Form */}
            <div className="p-5 rounded-2xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/80 space-y-3">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider block">
                + Create New Skill Group / Category (Adds a New Vertex to Radar)
              </span>
              <form onSubmit={handleCreateCategory} className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIconPickerTarget({ type: 'newSkillCategory' });
                    setIconPickerOpen(true);
                  }}
                  className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 flex items-center gap-2 text-xs font-semibold hover:border-[var(--color-primary)] transition-colors cursor-pointer"
                  title="Choose Group Icon"
                >
                  <div className="w-5 h-5 rounded-sm bg-brand-500/10 flex items-center justify-center">
                    <IconRenderer icon={newCatIcon} className="w-3.5 h-3.5" />
                  </div>
                  <span>Icon ({newCatIcon})</span>
                </button>

                <input
                  type="text"
                  required
                  placeholder="Section Heading (e.g. Embedded Systems, Cloud Architecture, Mobile Dev)"
                  value={newCatTitle}
                  onChange={(e) => setNewCatTitle(e.target.value)}
                  className="flex-1 min-w-[220px] px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-hidden"
                />

                {/* Initial Proficiency Control Bar */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                  <span className="text-[11px] text-gray-500 font-medium">Proficiency:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={newCatProficiency}
                    onChange={(e) => setNewCatProficiency(Number(e.target.value))}
                    className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
                  />
                  <span className="text-xs font-mono font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] min-w-[32px] text-right">
                    {newCatProficiency}%
                  </span>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  + Add Skill Group
                </button>
              </form>
            </div>

            {/* 2. Skill Taxonomy Groups (Reorderable, Editable, Add Skills) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Skill Groups ({skillCategories.length}) — Reorder, Edit, Add/Remove Skills:
                </span>
                <span className="text-xs text-gray-500 font-mono">Use ▲ ▼ to reorder groups or skills</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {skillCategories.map((group, idx) => {
                  const currentProf = typeof group.proficiency === 'number'
                    ? group.proficiency
                    : group.skills.length > 0
                    ? Math.round(group.skills.reduce((acc, s) => acc + skillLevel(s), 0) / group.skills.length)
                    : 0;

                  return (
                    <div
                      key={group.id}
                      className="p-5 rounded-2xl bg-gray-50/70 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700/80 space-y-4 shadow-xs hover:border-brand-500/40 transition-colors"
                    >
                      {/* Group Header with Position, Icon, Editable Title, Delete */}
                      <div className="flex items-center justify-between gap-2 pb-3 border-b border-gray-200/70 dark:border-gray-700/70">
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          {/* Group Position Reorder */}
                          <div className="flex items-center space-x-1 pr-1.5 border-r border-gray-200 dark:border-gray-700 shrink-0">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => reorderSkillCategories(idx, idx - 1)}
                              className="w-5 h-5 rounded-sm bg-gray-100 dark:bg-gray-700 hover:bg-[var(--color-primary)] hover:text-white flex items-center justify-center text-gray-600 dark:text-gray-300 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                              title="Move group up"
                            >
                              <ChevronUp className="w-3 h-3" />
                            </button>
                            <span className="text-[10px] font-mono font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] px-0.5">
                              #{idx + 1}
                            </span>
                            <button
                              type="button"
                              disabled={idx === skillCategories.length - 1}
                              onClick={() => reorderSkillCategories(idx, idx + 1)}
                              className="w-5 h-5 rounded-sm bg-gray-100 dark:bg-gray-700 hover:bg-[var(--color-primary)] hover:text-white flex items-center justify-center text-gray-600 dark:text-gray-300 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                              title="Move group down"
                            >
                              <ChevronDown className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Group Icon Change */}
                          <button
                            type="button"
                            onClick={() => {
                              setIconPickerTarget({ type: 'skillCategory', id: group.id });
                              setIconPickerOpen(true);
                            }}
                            className="w-8 h-8 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 flex items-center justify-center text-lg shrink-0 transition-colors cursor-pointer"
                            title="Click to change icon"
                          >
                            <IconRenderer icon={group.icon || group.iconName} name={group.title} />
                          </button>

                          {/* Editable Group Title */}
                          <input
                            type="text"
                            value={group.category || group.title}
                            onChange={(e) =>
                              updateSkillCategory(group.id, {
                                title: e.target.value,
                                category: e.target.value
                              })
                            }
                            className="flex-1 px-2.5 py-1 text-xs font-bold text-gray-900 dark:text-white bg-transparent hover:bg-white dark:hover:bg-gray-800 rounded-lg border border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:border-[var(--color-primary)] focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden transition-all"
                            placeholder="Category Title"
                          />
                        </div>

                        {/* Delete Group Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete skill group "${group.category || group.title}" and its ${group.skills.length} skills?`)) {
                              deleteSkillCategory(group.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-500/10 transition-colors shrink-0 cursor-pointer"
                          title="Delete Group"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Radar Vertex Proficiency Slider */}
                      <div className="p-3 rounded-xl bg-brand-500/5 dark:bg-brand-500/10 border border-brand-500/15 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
                            <Cpu className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                            Radar Vertex Proficiency:
                          </span>
                          <span className="font-mono font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] text-sm">
                            {currentProf}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={currentProf}
                          onChange={(e) => updateSkillCategory(group.id, { proficiency: Number(e.target.value) })}
                          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
                        />
                        <span className="text-[10px] text-gray-400 font-mono block">
                          Controls the reach of this vertex on the live radar chart.
                        </span>
                      </div>

                    {/* Add Skill to this Group Form */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 dark:bg-gray-900/60 border border-gray-200/60 dark:border-gray-700/60">
                      <input
                        type="text"
                        placeholder="Skill Name (e.g. FreeRTOS, LangChain)"
                        value={newSkillPerCat[group.id]?.name || ''}
                        onChange={(e) =>
                          setNewSkillPerCat({
                            ...newSkillPerCat,
                            [group.id]: {
                              name: e.target.value,
                              level: newSkillPerCat[group.id]?.level ?? 85
                            }
                          })
                        }
                        className="flex-1 min-w-[120px] px-3 py-1.5 text-xs rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-[var(--color-primary)]"
                      />
                      <div className="flex items-center gap-1 shrink-0">
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={newSkillPerCat[group.id]?.level ?? 85}
                          onChange={(e) =>
                            setNewSkillPerCat({
                              ...newSkillPerCat,
                              [group.id]: {
                                name: newSkillPerCat[group.id]?.name || '',
                                level: Number(e.target.value)
                              }
                            })
                          }
                          className="w-14 px-2 py-1.5 text-xs rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-center font-mono font-bold"
                          title="Proficiency percentage (1-100)"
                        />
                        <span className="text-xs text-gray-400 font-mono">%</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const skillInput = newSkillPerCat[group.id];
                          if (!skillInput?.name?.trim()) return;
                          addSkillToCategory(group.id, {
                            name: skillInput.name.trim(),
                            level: Number(skillInput.level ?? 85),
                            proficiency: Number(skillInput.level ?? 85)
                          });
                          setNewSkillPerCat({
                            ...newSkillPerCat,
                            [group.id]: { name: '', level: 85 }
                          });
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] text-white text-xs font-bold shrink-0 transition-colors shadow-xs"
                      >
                        + Add Skill
                      </button>
                    </div>

                    {/* Skill items with individual position reordering, editing, and deletion */}
                    <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                      {group.skills.length === 0 ? (
                        <p className="text-center py-3 text-xs text-gray-400 font-mono">
                          No skills in this group yet. Add one above!
                        </p>
                      ) : (
                        group.skills.map((s, sIdx) => (
                          <div
                            key={s.name + sIdx}
                            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white dark:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700/60 text-xs gap-2 group/skill"
                          >
                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                              <span className="text-[10px] font-mono text-gray-400 w-4 shrink-0">#{sIdx + 1}</span>
                              <input
                                type="text"
                                value={s.name}
                                onChange={(e) =>
                                  updateSkillInCategory(group.id, sIdx, { name: e.target.value })
                                }
                                className="flex-1 px-1.5 py-0.5 text-xs font-medium text-gray-900 dark:text-gray-200 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-600 focus:border-[var(--color-primary)] focus:bg-white dark:focus:bg-gray-800 focus:outline-hidden"
                              />
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <input
                                type="number"
                                min="1"
                                max="100"
                                value={skillLevel(s)}
                                onChange={(e) =>
                                  updateSkillInCategory(group.id, sIdx, {
                                    level: Number(e.target.value),
                                    proficiency: Number(e.target.value)
                                  })
                                }
                                className="w-12 px-1 py-0.5 text-[11px] font-mono font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-600 text-right focus:outline-hidden"
                              />
                              <span className="text-[10px] text-gray-400 font-mono">%</span>

                              {/* Reorder Buttons */}
                              <div className="flex items-center gap-0.5 ml-1">
                                <button
                                  type="button"
                                  disabled={sIdx === 0}
                                  onClick={() => reorderSkillsInCategory(group.id, sIdx, sIdx - 1)}
                                  className="w-4 h-4 rounded-sm hover:bg-[var(--color-primary)] hover:text-white flex items-center justify-center text-gray-400 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                                  title="Move skill up"
                                >
                                  <ChevronUp className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={sIdx === group.skills.length - 1}
                                  onClick={() => reorderSkillsInCategory(group.id, sIdx, sIdx + 1)}
                                  className="w-4 h-4 rounded-sm hover:bg-[var(--color-primary)] hover:text-white flex items-center justify-center text-gray-400 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                                  title="Move skill down"
                                >
                                  <ChevronDown className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Delete Skill */}
                              <button
                                type="button"
                                onClick={() => deleteSkillFromCategory(group.id, sIdx)}
                                className="p-1 text-gray-400 hover:text-red-500 rounded-sm hover:bg-red-500/10 transition-colors"
                                title="Remove skill"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

            {/* 3. Productivity Tools & Hardware Components (Full Reorder & Delete) */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Productivity Tools & Hardware Components ({toolsList.length}):
                </span>
                <span className="text-xs text-gray-500 font-mono">Reorder with ▲ ▼ or remove</span>
              </div>

              {/* Add Tool Form */}
              <form onSubmit={handleCreateTool} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIconPickerTarget({ type: 'tool' });
                    setIconPickerOpen(true);
                  }}
                  className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 flex items-center gap-2 text-xs font-semibold"
                >
                  <IconRenderer icon={newTool.icon} className="w-4 h-4" />
                  <span>Choose Icon</span>
                </button>

                <input
                  type="text"
                  required
                  placeholder="Tool / Hardware Name (e.g. ESP32, Docker, Postman, Wireshark)"
                  value={newTool.name}
                  onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                  className="flex-1 min-w-[200px] px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-hidden"
                />

                <select
                  value={newTool.category}
                  onChange={(e) => setNewTool({ ...newTool, category: e.target.value })}
                  className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                >
                  <option value="Development">Development</option>
                  <option value="DevOps / Cloud">DevOps / Cloud</option>
                  <option value="Hardware / IoT">Hardware / IoT</option>
                  <option value="Design / UI">Design / UI</option>
                  <option value="Analytics">Analytics</option>
                </select>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] shadow-xs transition-colors"
                >
                  + Add Tool
                </button>
              </form>

              {/* Tools Grid with Reordering & Deletion */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {toolsList.map((tool, tIdx) => (
                  <div
                    key={tool.id || tool.name + tIdx}
                    className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700/80 flex items-center justify-between gap-2 group hover:border-[var(--color-primary)]/40 transition-colors"
                  >
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      {/* Reorder Buttons */}
                      <div className="flex flex-col gap-0.5">
                        <button
                          type="button"
                          disabled={tIdx === 0}
                          onClick={() => reorderTools(tIdx, tIdx - 1)}
                          className="w-3.5 h-3.5 rounded-sm hover:bg-[var(--color-primary)] hover:text-white flex items-center justify-center text-gray-400 disabled:opacity-20 disabled:pointer-events-none"
                          title="Move tool up"
                        >
                          <ChevronUp className="w-2.5 h-2.5" />
                        </button>
                        <button
                          type="button"
                          disabled={tIdx === toolsList.length - 1}
                          onClick={() => reorderTools(tIdx, tIdx + 1)}
                          className="w-3.5 h-3.5 rounded-sm hover:bg-[var(--color-primary)] hover:text-white flex items-center justify-center text-gray-400 disabled:opacity-20 disabled:pointer-events-none"
                          title="Move tool down"
                        >
                          <ChevronDown className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <div className="w-7 h-7 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
                        <IconRenderer icon={tool.icon} name={tool.name} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate block">
                          {tool.name}
                        </span>
                        <span className="text-[9px] text-gray-400 font-mono">#{tIdx + 1}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteTool(tool.id || tool.name)}
                      className="p-1 text-gray-400 hover:text-red-500 rounded-sm hover:bg-red-500/10 transition-colors shrink-0"
                      title="Delete tool"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Currently Learning & Exploration Roadmap CMS */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Currently Learning Roadmap ({currentlyLearning.length}):
                </span>
                <span className="text-xs text-gray-500 font-mono">Manage research & skills in progress</span>
              </div>

              {/* Add Learning Item Form */}
              <form onSubmit={handleCreateLearning} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIconPickerTarget({ type: 'newLearning' });
                    setIconPickerOpen(true);
                  }}
                  className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 flex items-center gap-2 text-xs font-semibold"
                >
                  <IconRenderer icon={newLearning.icon} className="w-4 h-4" />
                  <span>Icon</span>
                </button>

                <input
                  type="text"
                  required
                  placeholder="Topic (e.g. TinyML on Edge ESP32, Rust WebAssembly)"
                  value={newLearning.topic}
                  onChange={(e) => setNewLearning({ ...newLearning, topic: e.target.value, title: e.target.value })}
                  className="flex-1 min-w-[200px] px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />

                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newLearning.progress}
                    onChange={(e) => setNewLearning({ ...newLearning, progress: Number(e.target.value) })}
                    className="w-14 px-2 py-2 text-xs rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-center font-mono font-bold"
                  />
                  <span className="text-xs text-gray-400 font-mono">%</span>
                </div>

                <select
                  value={newLearning.status}
                  onChange={(e) => setNewLearning({ ...newLearning, status: e.target.value })}
                  className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Planned">Planned</option>
                  <option value="Exploring">Exploring</option>
                </select>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] shadow-xs transition-colors"
                >
                  + Add Milestone
                </button>
              </form>

              {/* Learning Roadmap List with Reorder & Delete */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {currentlyLearning.map((item, lIdx) => (
                  <div
                    key={item.id || `${item.title}-${lIdx}`}
                    className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700/80 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2 min-w-0">
                        {/* Reorder Buttons */}
                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            disabled={lIdx === 0}
                            onClick={() => reorderCurrentlyLearning(lIdx, lIdx - 1)}
                            className="w-4 h-4 rounded-sm hover:bg-[var(--color-primary)] hover:text-white flex items-center justify-center text-gray-400 disabled:opacity-20 disabled:pointer-events-none"
                            title="Move milestone up"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <span className="text-[10px] font-mono text-gray-400">#{lIdx + 1}</span>
                          <button
                            type="button"
                            disabled={lIdx === currentlyLearning.length - 1}
                            onClick={() => reorderCurrentlyLearning(lIdx, lIdx + 1)}
                            className="w-4 h-4 rounded-sm hover:bg-[var(--color-primary)] hover:text-white flex items-center justify-center text-gray-400 disabled:opacity-20 disabled:pointer-events-none"
                            title="Move milestone down"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                          <IconRenderer icon={item.icon || 'Code'} name={item.topic || item.title} />
                        </div>
                        <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
                          {item.topic || item.title}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteCurrentlyLearning(item.id || item.title || (item.topic as string))}
                        className="p-1 text-gray-400 hover:text-red-500 rounded-sm hover:bg-red-500/10 transition-colors shrink-0"
                        title="Delete milestone"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-gray-400">{item.status || 'In Progress'}</span>
                        <span className="font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">{item.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-[var(--color-primary)] to-brand-400 rounded-full"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
}
