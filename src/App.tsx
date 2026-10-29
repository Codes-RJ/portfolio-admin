import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

import {
  LayoutDashboard,
  Eye,
  ExternalLink,
  Save,
  Moon,
  Sun,
  LogOut,
  PlusCircle,
  Edit3,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useModalState } from './context/contentSubscriptions';
import { PrePublishDiffModal } from './components/admin/PrePublishDiffModal';

// Portfolio pages for replica mode
import { HomePage } from './pages/HomePage';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SkeletonPageLoader } from './components/ui/SkeletonPageLoader';
import { publicMetadata } from './lib/publicMetadata';

const setMeta = (selector: string, attribute: string, key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
};

const RouteMeta: React.FC = () => {
  const { pathname } = useLocation();
  const { projects, blogPosts, profile, siteSettings } = useData();

  React.useEffect(() => {
    if (pathname === '/login' || pathname.startsWith('/admin')) {
      document.title = 'RohanOS Studio | Admin CMS & Visual Editor';
      setMeta('meta[name="robots"]', 'name', 'robots', 'noindex, nofollow, noarchive');
      return;
    }

    const effectivePath = pathname.replace(/^\/preview/, '') || '/';
    const metadata = publicMetadata({ projects, blogPosts, profile, siteSettings })[effectivePath];
    const title = metadata?.title ?? (effectivePath.startsWith('/projects/')
      ? projects.find((p) => `/projects/${encodeURIComponent(p.id)}` === effectivePath)?.title
      : effectivePath.startsWith('/blog/')
        ? blogPosts.find((p) => `/blog/${p.slug}` === effectivePath)?.title
        : undefined) ?? 'RohanOS Portfolio';

    document.title = title;
    if (metadata?.description) {
      setMeta('meta[name="description"]', 'name', 'description', metadata.description);
    }
    if (siteSettings?.website?.seoKeywords) {
      setMeta('meta[name="keywords"]', 'name', 'keywords', siteSettings.website.seoKeywords);
    }
    const favicon = document.head.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (favicon && siteSettings?.website?.faviconUrl) {
      favicon.href = siteSettings.website.faviconUrl;
    }
  }, [pathname, projects, blogPosts, profile, siteSettings]);

  return null;
};

const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage })));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage').then((m) => ({ default: m.ProjectDetailPage })));
const SkillsPage = lazy(() => import('./pages/SkillsPage').then((m) => ({ default: m.SkillsPage })));
const ExperiencePage = lazy(() => import('./pages/ExperiencePage').then((m) => ({ default: m.ExperiencePage })));
const CertificatesPage = lazy(() => import('./pages/CertificatesPage').then((m) => ({ default: m.CertificatesPage })));
const BlogPage = lazy(() => import('./pages/BlogPage').then((m) => ({ default: m.BlogPage })));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage').then((m) => ({ default: m.BlogDetailPage })));
const ResearchPage = lazy(() => import('./pages/ResearchPage').then((m) => ({ default: m.ResearchPage })));
const GalleryPage = lazy(() => import('./pages/GalleryPage').then((m) => ({ default: m.GalleryPage })));
const ResumePage = lazy(() => import('./pages/ResumePage').then((m) => ({ default: m.ResumePage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then((m) => ({ default: m.TermsPage })));

// Global modals for visual replica
const CertificateModal = lazy(() => import('./components/modals/CertificateModal').then((m) => ({ default: m.CertificateModal })));
const ProjectDetailModal = lazy(() => import('./components/modals/ProjectDetailModal').then((m) => ({ default: m.ProjectDetailModal })));
const BlogModal = lazy(() => import('./components/modals/BlogModal').then((m) => ({ default: m.BlogModal })));

const GlobalModals: React.FC = () => {
  const { activeModalCert, activeModalProject, activeModalBlog } = useModalState();

  return (
    <Suspense fallback={null}>
      {activeModalCert && <CertificateModal />}
      {activeModalProject && <ProjectDetailModal />}
      {activeModalBlog && <BlogModal />}
    </Suspense>
  );
};

// Studio Top Bar Component
const StudioTopBar: React.FC<{
  viewMode: 'visual' | 'cms';
  setViewMode: (mode: 'visual' | 'cms') => void;
  onOpenQuickAdd: (type: string) => void;
}> = ({ viewMode, setViewMode, onOpenQuickAdd }) => {
  const { session, signOut } = useAuth();
  const { theme, setTheme, isDark } = useTheme();
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');
  const { saveAllChanges } = useData();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDiffModal, setShowDiffModal] = useState(false);

  const portfolioUrl = import.meta.env.VITE_PORTFOLIO_URL || 'http://localhost:3000';

  const handleSave = async () => {
    try {
      setSaving(true);
      await saveAllChanges?.();
      setSaveSuccess(true);
      setShowDiffModal(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error('Save failed:', e);
    } finally {
      setSaving(false);
    }
  };

  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[#090d16]/90 backdrop-blur-md border-b border-gray-800 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & DB Status */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-0.5 shadow-md flex items-center justify-center font-bold text-white text-base">
            R<span className="text-indigo-300">OS</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide">RohanOS <span className="text-indigo-400">Studio</span></span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {session?.mode === 'demo' ? 'SHOWCASE DEMO' : 'ADMIN'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{session?.mode === 'supabase' ? 'Supabase DB Connected' : session?.mode === 'demo' ? 'Recruiter Sandbox Demo' : 'Local Dev Mode (Same DB)'}</span>
            </div>
          </div>
        </div>

        {/* Center: View Switcher */}
        <div className="flex items-center bg-gray-900/90 p-1 rounded-xl border border-gray-800">
          <button
            onClick={() => {
              if (window.location.pathname.startsWith('/admin')) {
                navigate('/');
              }
              setViewMode('visual');
            }}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'visual'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Visual Portfolio Replica</span>
          </button>
          <button
            onClick={() => {
              if (!window.location.pathname.startsWith('/admin')) {
                navigate('/admin');
              }
              setViewMode('cms');
            }}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'cms'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Studio CMS Dashboard</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          {/* Quick Add Menu */}
          <div className="relative group">
            <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors">
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Quick Add</span>
            </button>
            <div className="absolute right-0 mt-1 w-44 bg-gray-900 border border-gray-800 rounded-xl shadow-xl py-1 hidden group-hover:block z-50">
              <button onClick={() => onOpenQuickAdd('project')} className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-800 hover:text-white flex items-center justify-between">
                <span>Add Project</span>
                <span className="text-[10px] text-indigo-400">⌘P</span>
              </button>
              <button onClick={() => onOpenQuickAdd('skill')} className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-800 hover:text-white flex items-center justify-between">
                <span>Add Skill</span>
                <span className="text-[10px] text-indigo-400">⌘S</span>
              </button>
              <button onClick={() => onOpenQuickAdd('experience')} className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-800 hover:text-white flex items-center justify-between">
                <span>Add Experience</span>
                <span className="text-[10px] text-indigo-400">⌘E</span>
              </button>
              <button onClick={() => onOpenQuickAdd('certificate')} className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-800 hover:text-white flex items-center justify-between">
                <span>Add Certificate</span>
                <span className="text-[10px] text-indigo-400">⌘C</span>
              </button>
              <button onClick={() => onOpenQuickAdd('blog')} className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-800 hover:text-white flex items-center justify-between">
                <span>Add Blog Post</span>
                <span className="text-[10px] text-indigo-400">⌘B</span>
              </button>
            </div>
          </div>

          {/* Save to DB Button */}
          <button
            onClick={() => setShowDiffModal(true)}
            disabled={saving}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              saveSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
            }`}
          >
            {saveSuccess ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saving ? 'Saving...' : saveSuccess ? 'Saved to DB!' : 'Save & Publish'}</span>
          </button>

          <PrePublishDiffModal
            isOpen={showDiffModal}
            onClose={() => setShowDiffModal(false)}
            onConfirm={handleSave}
            isSaving={saving}
          />

          {/* Open Portfolio */}
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            title="Open Live Portfolio Site"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Logout */}
          <button
            onClick={() => signOut()}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

// Visual Replica View with In-Context Action Overlays
const VisualPortfolioReplica: React.FC<{
  onEditSection: (section: string) => void;
}> = ({ onEditSection }) => {
  const { pathname } = useLocation();

  const getActiveSection = () => {
    if (pathname.includes('/projects')) return { id: 'projects', label: 'Edit Projects' };
    if (pathname.includes('/skills')) return { id: 'skills', label: 'Edit Skills' };
    if (pathname.includes('/experience')) return { id: 'experience', label: 'Edit Experience' };
    if (pathname.includes('/certificates')) return { id: 'certificates', label: 'Edit Certificates' };
    if (pathname.includes('/blog')) return { id: 'blog', label: 'Edit Blog' };
    if (pathname.includes('/research')) return { id: 'research', label: 'Edit Research' };
    if (pathname.includes('/gallery')) return { id: 'gallery', label: 'Edit Gallery' };
    if (pathname.includes('/contact')) return { id: 'inbox', label: 'View Inbox' };
    return { id: 'profile', label: 'Edit Hero & Profile' };
  };

  const active = getActiveSection();

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-[#090d16] text-gray-900 dark:text-gray-100 transition-colors">
      {/* Floating Replica Notification Banner */}
      <div className="bg-indigo-600/10 border-b border-indigo-500/20 py-2 px-4 text-center text-xs text-indigo-300 font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        <span>You are viewing the <strong>Live Portfolio Replica</strong> with admin editing capabilities enabled. Click any section edit button to modify content.</span>
      </div>

      <Navbar />

      <main className="flex-grow">
        {/* In-Context Section Edit Floating Action Badge */}
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-gray-900/90 dark:bg-gray-800/90 backdrop-blur-md p-1.5 rounded-2xl border border-gray-700/60 shadow-2xl">
          <button
            onClick={() => onEditSection(active.id)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white shadow-lg hover:bg-indigo-500 transition-all cursor-pointer"
            title={`Open ${active.label} in CMS`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{active.label}</span>
          </button>
          <div className="hidden sm:flex items-center gap-1 border-l border-gray-700/60 pl-2">
            <button
              onClick={() => onEditSection('projects')}
              className="px-2 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer"
            >
              Projects
            </button>
            <button
              onClick={() => onEditSection('skills')}
              className="px-2 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer"
            >
              Skills
            </button>
            <button
              onClick={() => onEditSection('experience')}
              className="px-2 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer"
            >
              Experience
            </button>
            <button
              onClick={() => onEditSection('certificates')}
              className="px-2 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer"
            >
              Certs
            </button>
          </div>
        </div>

        {/* Hero Section with Edit Button */}
        <div className="relative group">
          <div className="absolute top-24 right-8 z-30 opacity-90 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEditSection('profile')}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white shadow-lg hover:bg-indigo-500 transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Hero & Profile</span>
            </button>
          </div>
          <Suspense fallback={<SkeletonPageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/preview" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/preview/about" element={<AboutPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/preview/projects" element={<ProjectsPage />} />
              <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
              <Route path="/preview/projects/:projectId" element={<ProjectDetailPage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/preview/skills" element={<SkillsPage />} />
              <Route path="/experience" element={<ExperiencePage />} />
              <Route path="/preview/experience" element={<ExperiencePage />} />
              <Route path="/certificates" element={<CertificatesPage />} />
              <Route path="/preview/certificates" element={<CertificatesPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/preview/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />
              <Route path="/preview/blog/:slug" element={<BlogDetailPage />} />
              <Route path="/research" element={<ResearchPage />} />
              <Route path="/preview/research" element={<ResearchPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/preview/gallery" element={<GalleryPage />} />
              <Route path="/resume" element={<ResumePage />} />
              <Route path="/preview/resume" element={<ResumePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/preview/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/preview/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/preview/terms" element={<TermsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </main>

      <Footer />
      <GlobalModals />
    </div>
  );
};

// Admin Main Workspace (Wraps either Visual Replica or Full CMS Dashboard)
const AdminWorkspace: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isCms = location.pathname.startsWith('/admin');
  const viewMode: 'visual' | 'cms' = isCms ? 'cms' : 'visual';

  const setViewMode = (nextMode: 'visual' | 'cms') => {
    if (nextMode === 'cms' && !isCms) {
      navigate('/admin');
    } else if (nextMode === 'visual' && isCms) {
      navigate('/');
    }
  };

  const handleOpenQuickAdd = (type: string) => {
    const tabMap: Record<string, string> = {
      project: 'projects',
      skill: 'skills',
      experience: 'experience',
      certificate: 'certificates',
      blog: 'blog',
    };
    const target = tabMap[type] || 'overview';
    navigate(target === 'overview' ? '/admin' : `/admin/${target}`);
  };

  const handleEditSection = (section: string) => {
    navigate(section === 'overview' ? '/admin' : `/admin/${section}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16]">
      <StudioTopBar
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenQuickAdd={handleOpenQuickAdd}
      />
      <div className="flex-grow">
        {viewMode === 'visual' ? (
          <VisualPortfolioReplica onEditSection={handleEditSection} />
        ) : (
          <AdminDashboardPage />
        )}
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <Router>
            <RouteMeta />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <AdminWorkspace />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
