import {
Cpu,
Download,
RefreshCw,
Sparkles,
Trash2,
Trophy,
Upload
} from 'lucide-react';
import { MediaCleanupPanel } from '../MediaCleanupPanel';
import { DatabaseRevisionsPanel } from '../DatabaseRevisionsPanel';
import { useContentSync } from '../../../context/editorSubscriptions';
import { skillLevel } from '../../../utils/skills';
import { HexagonSkillRadar } from '../../ui/BlobDecorators';
import { IconRenderer } from '../../ui/IconRenderer';
import { HonorBadgeIcon } from '../../ui/HonorBadgeIcon';
import type { AdminEditor } from '../useAdminEditor';

export function AdminOverviewSection({ editor }: { editor: Pick<AdminEditor, 'achievements' | 'certificates' | 'contentSyncError' | 'contentSyncState' | 'handleBackupDownload' | 'handleImportFile' | 'handlePublicContentDownload' | 'lastContentSyncAt' | 'messages' | 'profile' | 'projects' | 'researchPapers' | 'resetToDefaults' | 'retryContentSync' | 'session' | 'setActiveTab' | 'skillCategories' | 'techStack' | 'totalSkillsCount' | 'unreadMessagesCount' | 'restorePreview' | 'restoreBusy' | 'confirmRestore' | 'cancelRestore' | 'notify' | 'hasMoreMessages'> }) {
  const { contentEditingBlocked } = useContentSync();
  const { achievements, certificates, contentSyncError, contentSyncState, handleBackupDownload, handleImportFile, handlePublicContentDownload, lastContentSyncAt, messages, profile, projects, researchPapers, resetToDefaults, retryContentSync, session, setActiveTab, skillCategories, techStack, totalSkillsCount, unreadMessagesCount } = editor;
  return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-1">
                <span className="text-xs font-bold text-gray-500">Live Projects</span>
                <div className="text-3xl font-extrabold text-[var(--color-primary)]">{projects.length}</div>
                <span className={`text-[10px] font-mono ${contentSyncState === 'failed' || contentSyncState === 'conflict' || contentSyncState === 'invalid' ? 'text-red-500' : 'text-emerald-500'}`}>
                  {contentSyncState === 'invalid' ? 'Complete the invalid field to resume saving' : contentSyncState === 'local' ? 'Stored in this browser' : contentSyncState === 'saving' ? 'Saving…' : contentSyncState === 'conflict' ? 'Conflict — reload required' : contentSyncState === 'failed' ? 'Save failed — retry available' : contentSyncState === 'loading' ? 'Loading hosted content…' : contentSyncState === 'missing' ? 'Hosted document not initialized' : lastContentSyncAt ? `Saved ${new Date(lastContentSyncAt).toLocaleTimeString()}` : 'Hosted content loaded'}
                </span>
                {contentSyncState === 'failed' && <button type="button" onClick={retryContentSync} className="text-[10px] font-semibold text-[var(--color-primary)] underline">Retry or reload</button>}
                {contentSyncState === 'missing' && <button type="button" onClick={retryContentSync} className="text-[10px] font-semibold text-[var(--color-primary)] underline">Initialize hosted content</button>}
                {contentSyncError && <span className="block text-xs text-red-600 dark:text-red-400" role="alert">{contentSyncError}</span>}
              </div>
              <div className="p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-1">
                <span className="text-xs font-bold text-gray-500">Skill Groups & IoT</span>
                <div className="text-3xl font-extrabold text-brand-600">{skillCategories.length} Categories</div>
                <span className="text-[10px] text-gray-400 font-mono">120+ Curated Icons Available</span>
              </div>
              <div className="p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-1">
                <span className="text-xs font-bold text-gray-500">Certificates & Papers</span>
                <div className="text-3xl font-extrabold text-brand-600">{certificates.length + researchPapers.length}</div>
                <span className="text-[10px] text-emerald-500 font-mono">Published credentials</span>
              </div>
              <div className="p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-1">
                <span className="text-xs font-bold text-gray-500">Loaded inquiries</span>
                <div className="text-3xl font-extrabold text-amber-500">{messages.length}</div>
                <span className="text-sm text-gray-600 dark:text-gray-300">{unreadMessagesCount} unread among loaded messages{editor.hasMoreMessages ? ' · more available in Inbox' : ''}</span>
              </div>
            </div>

            {/* 3-Column Competency Dashboard Trio (Honors, Validated Skills, Tech Stack) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-[var(--color-primary)]" />
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Homepage Competency Dashboard
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">
                  ● Uses published content
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

                {/* Col 1: Honors & Recognitions Live Sync */}
                <div className="lg:col-span-4 flex flex-col justify-between p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 shadow-md">
                  <div>
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-gray-800/80">
                      <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        Honors & Recognitions
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab('honors')}
                        className="text-[11px] font-mono font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] hover:underline cursor-pointer"
                      >
                        Manage ({achievements.length}) →
                      </button>
                    </div>

                    <div className="space-y-3">
                      {achievements.length === 0 ? (
                        <div className="p-6 text-center rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-dashed border-gray-200 dark:border-gray-700 space-y-2">
                          <Trophy className="w-6 h-6 text-amber-500/50 mx-auto" />
                          <p className="text-xs font-bold text-gray-700 dark:text-gray-300">No Honors Added Yet</p>
                          <button
                            type="button"
                            onClick={() => setActiveTab('honors')}
                            className="text-[10px] font-mono text-[var(--color-primary)] hover:underline font-bold cursor-pointer"
                          >
                            + Add First Award in Honors Tab
                          </button>
                        </div>
                      ) : (
                        achievements.slice(0, 4).map((ach) => (
                          <div
                            key={ach.id}
                            className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/60 flex items-center space-x-3.5"
                          >
                            <span className="shrink-0 text-violet-700 dark:text-white" aria-hidden="true">
                              <HonorBadgeIcon badge={ach.badge} category={ach.category} title={ach.title} className="w-9 h-9" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                                {ach.title}
                              </h4>
                              <p className="text-[11px] font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] truncate">
                                {ach.organization} · {ach.year}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="pt-3 mt-4 border-t border-gray-100 dark:border-gray-800/80 text-center">
                    <span className="text-[11px] text-gray-500 font-mono">Recognized for technical excellence & innovation</span>
                  </div>
                </div>

                {/* Col 2: Center Validated Skills Square Hexagon Radar */}
                <div className="lg:col-span-4 flex items-center justify-center">
                  <HexagonSkillRadar
                    onClick={() => setActiveTab('skills')}
                    className="h-full"
                    categories={skillCategories}
                  />
                </div>

                {/* Col 3: Technology Stack Official Vector Logos Grid */}
                <div className="lg:col-span-4 flex flex-col justify-between p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 shadow-md">
                  <div>
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-gray-800/80">
                      <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
                        Technology Stack
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab('skills')}
                        className="text-[11px] font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] hover:underline cursor-pointer"
                      >
                        Manage Logos →
                      </button>
                    </div>

                    {/* Logos Grid */}
                    <div className="grid grid-cols-4 gap-2.5 py-1">
                      {techStack.length === 0 ? (
                        <div className="col-span-4 py-6 text-center text-xs text-gray-400">
                          No tech stack logos added yet.
                        </div>
                      ) : (
                        techStack.slice(0, 16).map((tech) => (
                          <button
                            type="button"
                            key={tech.id}
                            title={tech.name}
                            onClick={() => setActiveTab('skills')}
                            className="aspect-square rounded-2xl bg-white/70 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80 hover:border-[var(--color-primary)]/60 flex items-center justify-center p-2.5 shadow-xs hover:scale-105 transition-all group/item cursor-pointer"
                          >
                            <IconRenderer
                              icon={tech.icon}
                              name={tech.name}
                              color={tech.color}
                              className="w-6 h-6 transition-transform group-hover/item:scale-110"
                            />
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="pt-3 mt-4 border-t border-gray-100 dark:border-gray-800/80 text-center">
                    <span className="text-[11px] text-gray-500">{techStack.length} Production Technologies & Tools</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Hero Section Live Metrics & Ecosystem Telemetry */}
            <div className="p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 shadow-lg space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Hero Section Telemetry & Ecosystem Pulse
                  </h3>
                </div>
                <div className="flex items-center space-x-3 text-[11px] font-mono text-gray-500">
                  <span>Status: <strong className="text-emerald-500">{profile.availabilityStatus}</strong></span>
                  <span>Response: <strong className="text-gray-700 dark:text-gray-300">{profile.responseTime}</strong></span>
                </div>
              </div>

              {/* 4-Item Metrics Breakdown matching Hero bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-center space-y-0.5">
                  <span className="block text-xl font-extrabold text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">
                    {projects.length}+
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">Hero Projects</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-center space-y-0.5">
                  <span className="block text-xl font-extrabold text-brand-600 dark:text-brand-400">
                    {certificates.length}+
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">Hero Certs</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center space-y-0.5">
                  <span className="block text-xl font-extrabold text-blue-600 dark:text-blue-400">
                    {totalSkillsCount}+
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">Hero Tech Stack</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-0.5">
                  <span className="block text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {profile.stats?.repos || 0}+
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">GitHub Repos</span>
                </div>
              </div>

              {/* Validated Competency Coverage Bars */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Validated Competency Group Scores (Live on Homepage):
                </span>
                {skillCategories.length === 0 ? (
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-dashed border-gray-300 dark:border-gray-700 text-center">
                    <p className="text-xs text-gray-500 font-mono">No skill groups added yet. Create groups in Skills CMS to activate matrix telemetry.</p>
                  </div>
                ) : (
                  skillCategories.slice(0, 4).map((group, gIdx) => {
                    const count = group.skills?.length || 0;
                    const avg = count > 0
                      ? Math.round(group.skills.reduce((sum: number, s: any) => sum + (skillLevel(s)), 0) / count)
                      : 0;
                    return (
                      <div key={gIdx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                            <IconRenderer icon={group.icon || group.iconName || 'Code'} className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                            <span>{group.title}</span>
                            <span className="text-[10px] font-mono text-gray-400">({count} skills)</span>
                          </span>
                          <span className="font-mono font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">{avg}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-linear-to-r from-[var(--color-primary)] to-brand-500 transition-all duration-500"
                            style={{ width: `${avg}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {session?.mode === 'supabase' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DatabaseRevisionsPanel accessToken={session.accessToken} />
                <MediaCleanupPanel accessToken={session.accessToken} />
              </div>
            )}
            {/* Quick Actions & Local Backup Tools */}
            <div className="p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Local Storage & Asset Tools
              </h3>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={handleBackupDownload}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)]"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Content & Full Inbox (Media URLs Included)</span>
                </button>

                <button
                  onClick={handlePublicContentDownload}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20"
                  title="Download visitor-safe content for the next deployment"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Publishable Content</span>
                </button>

                <label className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Restore from JSON</span>
                  <input type="file" accept=".json,application/json" disabled={editor.restoreBusy} onChange={handleImportFile} className="hidden" />
                </label>

                <button
                  disabled={contentEditingBlocked}
                  onClick={() => {
                    if (window.confirm('Replace public content with the bundled defaults? Export a backup first. The private inbox is retained.')) {
                      resetToDefaults();
                      editor.notify('Bundled content defaults applied. Inbox retained. Check publication status to confirm saving.');
                    }
                  }}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-red-600 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset Defaults</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm('Clear only RohanOS cached content from this browser? Hosted content and unrelated site data will not be deleted.')) {
                      Object.keys(localStorage).filter((key) => key.startsWith('rohanos_data_store_')).forEach((key) => localStorage.removeItem(key));
                      window.location.reload();
                    }
                  }}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 shadow-xs"
                  title="Clear this browser's cached portfolio content"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear Browser Content Cache</span>
                </button>
              </div>
              {editor.restorePreview && <section aria-labelledby="restore-preview-title" className="rounded-2xl border border-amber-400 p-5 space-y-3 text-sm">
                <h4 id="restore-preview-title" className="font-bold text-base">Restore preview</h4>
                <p className="break-all">{editor.restorePreview.filename} · Exported {new Date(editor.restorePreview.exportedAt).toLocaleString()}</p>
                <p>{editor.restorePreview.projects} projects, {editor.restorePreview.articles} articles and {editor.restorePreview.messages} inbox messages in this backup.</p>
                <p>This replaces the whole public content document, including settings, navigation and media references. Matching inbox IDs are overwritten with the backup's fields and read/replied state. Missing messages are added. Messages absent from the backup are retained.</p>
                <p>Newer inbox states on matching IDs can be replaced by older backup states. Export a fresh backup first. Uploaded media files are not restored by JSON; original Storage URLs must still work or be recovered from a separate media backup. Existing staged editor drafts remain private and may need manual merging after restore.</p>
                <div className="flex flex-wrap gap-4">
                  <button type="button" disabled={editor.restoreBusy || contentSyncState === 'loading' || contentSyncState === 'conflict'} onClick={() => void editor.confirmRestore()} className="rounded-xl bg-brand-600 text-white px-4 py-2 disabled:opacity-50">{editor.restoreBusy ? 'Restoring…' : 'Confirm restore'}</button>
                  <button type="button" disabled={editor.restoreBusy} onClick={editor.cancelRestore} className="rounded-xl border border-gray-400 px-4 py-2">Cancel restore</button>
                </div>
              </section>}
            </div>
          </div>
        );
}
