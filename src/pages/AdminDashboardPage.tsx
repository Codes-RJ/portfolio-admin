import {
Award,
BookOpen,
Briefcase,
Cpu,
Download,
FileCode,
Image,
Layers,
LayoutDashboard,
LogOut,
MessageSquare,
Palette,
Tag,
Trophy,
Type,
User,
X
} from 'lucide-react';
import React, { Suspense, lazy } from 'react';
import { SyncRecoveryNotice } from '../components/admin/SyncRecoveryNotice';
import { useAdminEditor, type AdminSection } from '../components/admin/useAdminEditor';
import { IconPickerModal } from '../components/ui/IconPickerModal';
import { ImageUploadField } from '../components/ui/ImageUploadField';
import { useContentSync } from '../context/editorSubscriptions';
import { getProjectCategories, normalizeProjectCategories } from '../utils/projectCategories';

// Code-split CMS panel sections (PERF-ADM-01)
const CompleteControlsPanel = lazy(() => import('../components/admin/CompleteControlsPanel').then((m) => ({ default: m.CompleteControlsPanel })));
const AdminBlogSection = lazy(() => import('../components/admin/sections/AdminBlogSection').then((m) => ({ default: m.AdminBlogSection })));
const AdminCategoriesSection = lazy(() => import('../components/admin/sections/AdminCategoriesSection').then((m) => ({ default: m.AdminCategoriesSection })));
const AdminCertificatesSection = lazy(() => import('../components/admin/sections/AdminCertificatesSection').then((m) => ({ default: m.AdminCertificatesSection })));
const AdminCopySection = lazy(() => import('../components/admin/sections/AdminCopySection').then((m) => ({ default: m.AdminCopySection })));
const AdminExperienceSection = lazy(() => import('../components/admin/sections/AdminExperienceSection').then((m) => ({ default: m.AdminExperienceSection })));
const AdminGallerySection = lazy(() => import('../components/admin/sections/AdminGallerySection').then((m) => ({ default: m.AdminGallerySection })));
const AdminHonorsSection = lazy(() => import('../components/admin/sections/AdminHonorsSection').then((m) => ({ default: m.AdminHonorsSection })));
const AdminInboxSection = lazy(() => import('../components/admin/sections/AdminInboxSection').then((m) => ({ default: m.AdminInboxSection })));
const AdminOverviewSection = lazy(() => import('../components/admin/sections/AdminOverviewSection').then((m) => ({ default: m.AdminOverviewSection })));
const AdminProfileSection = lazy(() => import('../components/admin/sections/AdminProfileSection').then((m) => ({ default: m.AdminProfileSection })));
const AdminProjectsSection = lazy(() => import('../components/admin/sections/AdminProjectsSection').then((m) => ({ default: m.AdminProjectsSection })));
const AdminResearchSection = lazy(() => import('../components/admin/sections/AdminResearchSection').then((m) => ({ default: m.AdminResearchSection })));
const AdminSkillsSection = lazy(() => import('../components/admin/sections/AdminSkillsSection').then((m) => ({ default: m.AdminSkillsSection })));
const AdminThemeSection = lazy(() => import('../components/admin/sections/AdminThemeSection').then((m) => ({ default: m.AdminThemeSection })));

const SectionSkeletonLoader: React.FC = () => (
  <div className="p-8 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-6 animate-pulse" role="status" aria-label="Loading section">
    <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
      <div className="space-y-2">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        <div className="h-4 w-72 bg-gray-100 dark:bg-gray-800/60 rounded-md" />
      </div>
      <div className="h-9 w-28 bg-gray-200 dark:bg-gray-800 rounded-xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="h-32 bg-gray-100 dark:bg-gray-800/40 rounded-2xl" />
      <div className="h-32 bg-gray-100 dark:bg-gray-800/40 rounded-2xl" />
    </div>
  </div>
);

export const AdminDashboardPage: React.FC = () => {
const editor = useAdminEditor();
const { contentEditingBlocked } = useContentSync();
const { achievements, activeTab, blogPosts, certificates, currentContent, editingProject, experiences, gallery, handleBackupDownload, handleIconSelected, handleLogout, iconPickerOpen, iconPickerTarget, messages, newCatIcon, newCert, newLearning, newTechItem, newTool, profile, projectCategories, projects, publishedContent, researchPapers, session, setActiveTab, setEditingProject, setIconPickerOpen, setIconPickerTarget, unreadMessagesCount, updateProject } = editor;
  const dirtyTabs = React.useMemo(() => {
    if (!currentContent || !publishedContent) return {} as Record<string, boolean>;
    const curr = currentContent;
    const pub = publishedContent;
    return {
      profile: JSON.stringify(curr.profile) !== JSON.stringify(pub.profile),
      copy: JSON.stringify(curr.siteSettings?.pageHeaders) !== JSON.stringify(pub.siteSettings?.pageHeaders),
      theme: (
        curr.siteSettings?.primaryColor !== pub.siteSettings?.primaryColor ||
        curr.siteSettings?.themeMode !== pub.siteSettings?.themeMode
      ),
      projects: JSON.stringify(curr.projects) !== JSON.stringify(pub.projects),
      skills: (
        JSON.stringify(curr.skills) !== JSON.stringify(pub.skills) ||
        JSON.stringify(curr.skillCategories) !== JSON.stringify(pub.skillCategories) ||
        JSON.stringify(curr.toolsList) !== JSON.stringify(pub.toolsList) ||
        JSON.stringify(curr.techStack) !== JSON.stringify(pub.techStack) ||
        JSON.stringify(curr.currentlyLearning) !== JSON.stringify(pub.currentlyLearning)
      ),
      experience: JSON.stringify(curr.experiences) !== JSON.stringify(pub.experiences),
      certificates: JSON.stringify(curr.certificates) !== JSON.stringify(pub.certificates),
      blog: JSON.stringify(curr.blogPosts) !== JSON.stringify(pub.blogPosts),
      research: JSON.stringify(curr.researchPapers) !== JSON.stringify(pub.researchPapers),
      gallery: JSON.stringify(curr.gallery) !== JSON.stringify(pub.gallery),
      honors: JSON.stringify(curr.achievements) !== JSON.stringify(pub.achievements),
      categories: (
        JSON.stringify(curr.projectCategories) !== JSON.stringify(pub.projectCategories) ||
        JSON.stringify(curr.certificateCategories) !== JSON.stringify(pub.certificateCategories) ||
        JSON.stringify(curr.blogCategories) !== JSON.stringify(pub.blogCategories)
      ),
    } as Record<string, boolean>;
  }, [currentContent, publishedContent]);

  return (
    <main className="pt-28 pb-24 min-h-screen bg-gray-50/50 dark:bg-[#090d16] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl glass-card border border-brand-500/20 shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-[var(--color-primary)] to-brand-600 p-0.5 shadow-lg">
              <div className="w-full h-full bg-[#090d16] rounded-[14px] flex items-center justify-center font-bold text-white text-xl">
                R<span className="text-[var(--color-primary-light)]">OS</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">RohanOS CMS Studio</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  {session?.mode === 'supabase' ? 'HOSTED WORKSPACE' : 'LOCAL DEV WORKSPACE'}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-mono">Logged in as {profile.name} (Super Admin)</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleBackupDownload}
              disabled={editor.restoreBusy}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-[var(--color-primary)] transition-colors"
              title="Download a complete local backup"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup JSON</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] gap-6 items-start">
        {/* URL-addressable CMS pages */}
        <aside className="lg:sticky lg:top-28 p-3 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 shadow-xs">
          <div className="px-3 pt-2 pb-3">
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">CMS navigation</p>
            <p className="mt-1 text-xs text-gray-500">Each area has its own link and editing page.</p>
          </div>
          <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0" aria-label="Admin pages">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'profile', label: 'Home & identity', icon: User },
            { id: 'controls', label: 'Complete controls', icon: Layers },
            { id: 'copy', label: 'Page titles & copy', icon: Type },
            { id: 'projects', label: `Projects (${projects.length})`, icon: Layers },
            { id: 'skills', label: 'Skills & tools', icon: Cpu },
            { id: 'experience', label: `Experience (${experiences.length})`, icon: Briefcase },
            { id: 'certificates', label: `Certificates (${certificates.length})`, icon: Award },
            { id: 'blog', label: `Blog (${blogPosts.length})`, icon: BookOpen },
            { id: 'research', label: `Research (${researchPapers.length})`, icon: FileCode },
            { id: 'gallery', label: `Gallery (${gallery.length})`, icon: Image },
            { id: 'honors', label: `Honors & Awards (${achievements.length})`, icon: Trophy },
            { id: 'categories', label: 'Categories', icon: Tag },
            { id: 'theme', label: 'Theme', icon: Palette },
            { id: 'inbox', label: `Inbox (${messages.length} loaded)`, icon: MessageSquare, badge: unreadMessagesCount }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminSection)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex shrink-0 lg:w-full items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'bg-[var(--color-primary)] text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{tab.label}</span>
                {tab.badge && tab.badge > 0 ? (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse ml-auto shrink-0" />
                ) : dirtyTabs[tab.id] ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 ml-auto shrink-0 shadow-xs shadow-amber-500/50" title="Unpublished local modifications" />
                ) : null}
              </button>
            );
          })}
          </nav>
        </aside>

        <section className="min-w-0 space-y-8">
        <SyncRecoveryNotice />
        {editor.feedback && <div role={editor.feedback.kind === 'error' ? 'alert' : 'status'} className="rounded-xl border border-gray-300 dark:border-gray-700 p-4 text-sm flex items-start justify-between gap-4">
          <p>{editor.feedback.message}</p>
          <button type="button" onClick={editor.clearFeedback} aria-label="Dismiss editor message" className="shrink-0 underline">Dismiss</button>
        </div>}

        {editor.restoreBusy && <p role="status">Restoring the reviewed backup. Editing is paused until this finishes.</p>}
        <fieldset disabled={editor.restoreBusy || (contentEditingBlocked && !['overview', 'inbox'].includes(activeTab))}
          {...(editor.restoreBusy || (contentEditingBlocked && !['overview', 'inbox'].includes(activeTab)) ? { inert: '' } : {})}
          className="min-w-0 space-y-8">

        <Suspense fallback={<SectionSkeletonLoader />}>
          {activeTab === 'controls' && <CompleteControlsPanel />}

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && <AdminOverviewSection editor={editor} />}

          {/* Tab 2: Profile & Photos CMS */}
          {activeTab === 'profile' && <AdminProfileSection editor={editor} />}

          {/* Page copy CMS */}
          {activeTab === 'copy' && <AdminCopySection editor={editor} />}

          {/* Theme Studio */}
          {activeTab === 'theme' && <AdminThemeSection editor={editor} />}

          {/* Tab 4: Projects CMS */}
          {activeTab === 'projects' && <AdminProjectsSection editor={editor} />}

          {/* Tab: Categories Hub (Projects, Certificates & Blog Categories Management) */}
          {activeTab === 'categories' && <AdminCategoriesSection editor={editor} />}

          {/* Tab 5: Skills, Tools & IoT Matrix CMS (Full Control) */}
          {activeTab === 'skills' && <AdminSkillsSection editor={editor} />}

          {/* Tab: Honors & Recognitions CMS */}
          {activeTab === 'honors' && <AdminHonorsSection editor={editor} />}

          {/* Tab 6: Certificates CMS with 120+ Icons & Images */}
          {activeTab === 'certificates' && <AdminCertificatesSection editor={editor} />}

          {/* Tab 7: Experience CMS */}
          {activeTab === 'experience' && <AdminExperienceSection editor={editor} />}

          {/* Tab 8: Blog CMS */}
          {activeTab === 'blog' && <AdminBlogSection editor={editor} />}

          {/* Tab 9: Research Papers CMS */}
          {activeTab === 'research' && <AdminResearchSection editor={editor} />}

          {/* Gallery CMS */}
          {activeTab === 'gallery' && <AdminGallerySection editor={editor} />}

          {/* Inbound Messages */}
          {activeTab === 'inbox' && <AdminInboxSection />}
        </Suspense>

        </fieldset>

        </section>
        </div>
      </div>

      {/* Global Icon Picker Modal */}
      <IconPickerModal
        isOpen={iconPickerOpen && !contentEditingBlocked}
        onClose={() => {
          setIconPickerOpen(false);
          setIconPickerTarget(null);
        }}
        onSelect={handleIconSelected}
        currentIcon={
          iconPickerTarget?.type === 'cert'
            ? newCert.logo
            : iconPickerTarget?.type === 'tool'
            ? newTool.icon
            : iconPickerTarget?.type === 'newSkillCategory'
            ? newCatIcon
            : iconPickerTarget?.type === 'newLearning'
            ? newLearning.icon
            : iconPickerTarget?.type === 'newTechStack'
            ? newTechItem.icon
            : ''
        }
      />

      {/* Edit Project Modal Dialog */}
      {editingProject && !contentEditingBlocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl glass-card bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-800 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Edit Project: {editingProject.title}
                </h3>
                <p className="text-xs text-gray-500">
                  Update project metadata, links, and individual card visibility.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Project Image */}
            <ImageUploadField
              label="Project Screenshot / Visual"
              value={editingProject.image}
              aspectRatio="16:9"
              previewHeight="h-44"
              onChange={(imgData) => setEditingProject({ ...editingProject, image: imgData })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="admin-field-053" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Project Title</label>
                <input id="admin-field-053"
                  type="text"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="admin-field-054" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Primary group</label>
                <select id="admin-field-054"
                  value={editingProject.category}
                  onChange={(e) => setEditingProject({
                    ...editingProject,
                    category: e.target.value,
                    categories: normalizeProjectCategories(e.target.value, editingProject.categories),
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
                    const checked = getProjectCategories(editingProject).includes(category);
                    const isPrimary = category === editingProject.category;
                    return (
                      <label key={category} className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${checked ? 'border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 text-[var(--color-primary)] dark:text-[#9B87FF]' : 'border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-300'} ${isPrimary ? 'cursor-default' : 'cursor-pointer'}`}>
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={isPrimary}
                          onChange={(event) => {
                            const current = getProjectCategories(editingProject);
                            const next = event.target.checked
                              ? [...current, category]
                              : current.filter((item) => item !== category);
                            setEditingProject({ ...editingProject, categories: normalizeProjectCategories(editingProject.category, next) });
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
                <label htmlFor="admin-field-055" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Technologies (comma-separated)</label>
                <input id="admin-field-055"
                  type="text"
                  value={Array.isArray(editingProject.technologies) ? editingProject.technologies.join(', ') : editingProject.technologies}
                  onChange={(e) => setEditingProject({
                    ...editingProject,
                    technologies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                  })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="admin-field-056" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Project Date / Year</label>
                <input id="admin-field-056"
                  type="text"
                  value={editingProject.date || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, date: e.target.value })}
                  placeholder="e.g. 2025"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                />
              </div>

              {/* GitHub Link with Individual Checkbox */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/60">
                <div className="flex items-center justify-between">
                  <label htmlFor="admin-edit-project-github-url" className="text-xs font-semibold text-gray-700 dark:text-gray-300">GitHub Repository</label>
                  <label className="flex items-center gap-1.5 text-xs text-[var(--color-primary)] dark:text-[var(--color-primary-light)] cursor-pointer font-bold select-none">
                    <input
                      type="checkbox"
                      checked={editingProject.showGithub !== false}
                      onChange={(e) => setEditingProject({ ...editingProject, showGithub: e.target.checked })}
                      className="rounded-sm border-gray-400 text-[var(--color-primary)] focus:ring-[var(--color-primary)] w-4 h-4 cursor-pointer"
                    />
                    <span>✓ Show Link</span>
                  </label>
                </div>
                <input
                  id="admin-edit-project-github-url"
                  type="text"
                  disabled={editingProject.showGithub === false}
                  value={editingProject.githubUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white disabled:opacity-40"
                />
              </div>

              {/* Live Demo Link with Individual Checkbox */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/60">
                <div className="flex items-center justify-between">
                  <label htmlFor="admin-edit-project-live-url" className="text-xs font-semibold text-gray-700 dark:text-gray-300">Live Demonstration URL</label>
                  <label className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 cursor-pointer font-bold select-none">
                    <input
                      type="checkbox"
                      checked={editingProject.showLive !== false}
                      onChange={(e) => setEditingProject({ ...editingProject, showLive: e.target.checked })}
                      className="rounded-sm border-gray-400 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <span>✓ Show Link</span>
                  </label>
                </div>
                <input
                  id="admin-edit-project-live-url"
                  type="text"
                  disabled={editingProject.showLive === false}
                  value={editingProject.liveUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                  placeholder="https://demo..."
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white disabled:opacity-40"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-field-057" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Card Short Summary (Shown on grid cards)
              </label>
              <textarea id="admin-field-057"
                rows={2}
                value={editingProject.description}
                onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white resize-none"
              />
            </div>

            <div>
              <label htmlFor="admin-field-058" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Full Case Study & Architecture Overview (Shown in Case Study Modal)
              </label>
              <textarea id="admin-field-058"
                rows={4}
                value={editingProject.longDescription || ''}
                onChange={(e) => setEditingProject({ ...editingProject, longDescription: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="admin-field-059" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Impact & Performance Benchmarks (comma-separated)
                </label>
                <input id="admin-field-059"
                  type="text"
                  placeholder="99.9% Uptime, <50ms P99 Latency, 15K+ Active Users"
                  value={Array.isArray(editingProject.metrics) ? editingProject.metrics.join(', ') : editingProject.metrics || ''}
                  onChange={(e) => setEditingProject({
                    ...editingProject,
                    metrics: e.target.value.split(',').map((m) => m.trim()).filter(Boolean)
                  })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="admin-field-060" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Core Architectural Features (one feature per line)
                </label>
                <textarea id="admin-field-060"
                  rows={3}
                  placeholder="Real-time WebSockets synchronization&#10;Zero-downtime blue/green deployment"
                  value={Array.isArray(editingProject.keyFeatures) ? editingProject.keyFeatures.join('\n') : editingProject.keyFeatures || ''}
                  onChange={(e) => setEditingProject({
                    ...editingProject,
                    keyFeatures: e.target.value.split('\n').map((f) => f.trim()).filter(Boolean)
                  })}
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  updateProject(editingProject.id, {
                    ...editingProject,
                    categories: normalizeProjectCategories(editingProject.category, editingProject.categories),
                  });
                  setEditingProject(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] text-white text-xs font-bold shadow-lg transition-colors"
              >
                Save Project Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
