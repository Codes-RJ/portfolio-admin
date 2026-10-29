import React,{ useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { Project,defaultPageHeaders } from '../../data/initialData';
import { normalizeProjectCategories } from '../../utils/projectCategories';
import { parseBackupJSON } from '../../lib/backupReview';
export type AdminSection =
  | 'overview' | 'profile' | 'copy' | 'theme' | 'projects' | 'categories'
  | 'skills' | 'honors' | 'experience' | 'certificates' | 'blog' | 'research' | 'gallery' | 'inbox' | 'controls';
const adminSections: AdminSection[] = [
  'overview', 'profile', 'copy', 'theme', 'projects', 'categories', 'skills',
  'honors', 'experience', 'certificates', 'blog', 'research', 'gallery', 'inbox', 'controls'
];
export function useAdminEditor() {
  const [feedback, setFeedback] = useState<{ message: string; kind: 'success' | 'error' } | null>(null);
  const notify = (message: string, kind: 'success' | 'error' = 'success') => setFeedback({ message, kind });
  const [restorePreview, setRestorePreview] = useState<{ filename: string; json: string; exportedAt: string; projects: number; articles: number; messages: number } | null>(null);
  const [restoreBusy, setRestoreBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, session } = useAuth();
  const { theme, setTheme } = useTheme();
  const {
    currentContent,
    publishedContent,
    siteSettings,
    updateSiteSettings,
    profile,
    updateProfile,
    projects,
    addProject,
    updateProject,
    deleteProject,
    reorderProjects,
    projectCategories,
    addProjectCategory,
    updateProjectCategory,
    deleteProjectCategory,
    reorderProjectCategories,
    certificateCategories,
    addCertificateCategory,
    updateCertificateCategory,
    deleteCertificateCategory,
    reorderCertificateCategories,
    blogCategories,
    addBlogCategory,
    updateBlogCategory,
    deleteBlogCategory,
    reorderBlogCategories,
    experiences,
    addExperience,
    updateExperience,
    deleteExperience,
    skillCategories,
    addSkillCategory,
    updateSkillCategory,
    deleteSkillCategory,
    addSkillToCategory,
    updateSkillInCategory,
    deleteSkillFromCategory,
    reorderSkillCategories,
    reorderSkillsInCategory,
    toolsList,
    addTool,
    deleteTool,
    reorderTools,
    techStack,
    addTechStackItem,
    updateTechStackItem,
    deleteTechStackItem,
    reorderTechStack,
    currentlyLearning,
    addCurrentlyLearning,
    deleteCurrentlyLearning,
    reorderCurrentlyLearning,
    achievements,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    reorderAchievements,
    certificates,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    reorderCertificates,
    blogPosts,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    researchPapers,
    addResearchPaper,
    updateResearchPaper,
    deleteResearchPaper,
    gallery,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    messages,
    updateMessageStatus,
    markAllMessagesAsRead,
    deleteMessage,
    refreshMessages,
    loadMoreMessages,
    messagesLoading,
    messagesError,
    hasMoreMessages,
    pendingMessageIds, retryMessageMutation,
    contentSyncState,
    contentSyncError,
    lastContentSyncAt,
    retryContentSync,
    resetToDefaults,
    exportDataJSON,
    exportPublicDataJSON,
    importDataJSON
  } = useData();

  const requestedSection = location.pathname.replace(/^\/admin\/?/, '').split('/')[0];
  const activeTab: AdminSection = adminSections.includes(requestedSection as AdminSection)
    ? requestedSection as AdminSection
    : 'overview';
  const setActiveTab = (section: AdminSection) => navigate(section === 'overview' ? '/admin' : `/admin/${section}`);

  const unreadMessagesCount = messages.filter((m) => m.status === 'unread').length;
  const totalSkillsCount = skillCategories.reduce((acc, cat) => acc + (cat.skills?.length || 0), 0);
  const [customHex, setCustomHex] = useState(siteSettings.primaryColor || '#5B3FE8');
  const [newTitleInput, setNewTitleInput] = useState('');
  const pageHeaders = { ...defaultPageHeaders, ...(siteSettings.pageHeaders || {}) };

  // Category Management Inputs
  const [newProjectCatInput, setNewProjectCatInput] = useState('');
  const [newCertCatInput, setNewCertCatInput] = useState('');
  const [newBlogCatInput, setNewBlogCatInput] = useState('');

  // Honors & Recognitions CMS States
  const [newAchTitle, setNewAchTitle] = useState('');
  const [newAchOrg, setNewAchOrg] = useState('');
  const [newAchYear, setNewAchYear] = useState(new Date().getFullYear().toString());
  const [newAchDesc, setNewAchDesc] = useState('');
  const [newAchBadge, setNewAchBadge] = useState('cert-trophy');
  const [editingAchId, setEditingAchId] = useState<string | null>(null);
  const [editAchTitle, setEditAchTitle] = useState('');
  const [editAchOrg, setEditAchOrg] = useState('');
  const [editAchYear, setEditAchYear] = useState('');
  const [editAchDesc, setEditAchDesc] = useState('');

  // Inbox Search & Filter States

  // Icon Picker Modal State
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [iconPickerTarget, setIconPickerTarget] = useState<{
    type: 'cert' | 'skillCategory' | 'tool' | 'editProject' | 'newSkillCategory' | 'newLearning' | 'newAchievement' | 'editAchievement' | 'techStack' | 'newTechStack' | 'exp';
    id?: string;
    field?: string;
  } | null>(null);

  // New Tech Stack Item State
  const [newTechItem, setNewTechItem] = useState({
    name: '',
    icon: 'SiReact',
    color: '#61DAFB'
  });

  // New Project Form state
  const [newProject, setNewProject] = useState({
    title: '',
    category: 'Web Dev' as string,
    categories: [] as string[],
    description: '',
    longDescription: '',
    keyFeatures: '',
    image: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    showGithub: true,
    showLive: true,
    featured: true,
    flagship: false,
    date: '2026',
    metrics: ''
  });

  // Editing Project Modal / Form State
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // New Cert Form state
  const [newCert, setNewCert] = useState({
    title: '',
    issuer: '',
    date: '',
    credentialId: '',
    verificationUrl: '',
    category: 'Cloud' as string,
    logo: 'FaAws',
    image: '',
    pdfUrl: ''
  });

  // New Tool Form state
  const [newTool, setNewTool] = useState({
    name: '',
    icon: 'SiVisualstudiocode',
    category: 'Development'
  });

  // New Skill Category Group Form state
  const [newCatTitle, setNewCatTitle] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Cpu');
  const [newCatProficiency, setNewCatProficiency] = useState(85);

  // Per-category new skill inputs: { [catId: string]: { name: string; level: number } }
  const [newSkillPerCat, setNewSkillPerCat] = useState<{ [catId: string]: { name: string; level: number } }>({});

  // New Learning Item Form state
  const [newLearning, setNewLearning] = useState({
    title: '',
    topic: '',
    progress: 75,
    status: 'In Progress',
    icon: 'Code',
    description: ''
  });

  // New Blog Form state
  const [newBlog, setNewBlog] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    category: 'Development' as string,
    readTime: '5 min read',
    publishedAt: new Date().toISOString().slice(0, 10),
    tags: '',
    image: '',
    featured: false
  });

  // New Research Paper state
  const [newPaper, setNewPaper] = useState({
    title: '',
    authors: '',
    venue: '',
    year: '',
    abstract: '',
    doi: '',
    citations: 0,
    pdfUrl: '',
    category: 'Edge AI & IoT' as string,
    readTime: '8 min read',
    date: '',
    image: '',
    keywords: ''
  });

  const [newGalleryItem, setNewGalleryItem] = useState({
    title: '',
    category: '',
    imageUrl: '',
    description: ''
  });
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [editingPaperId, setEditingPaperId] = useState<string | null>(null);

  // New Experience Form state
  const [newExp, setNewExp] = useState({
    title: '',
    company: '',
    period: '',
    location: '',
    summary: '',
    responsibilities: '',
    achievements: '',
    technologies: '',
    logo: 'Building2',
    type: 'Full-time'
  });

  const colorPresets = [
    { name: 'Royal Purple', hex: '#5B3FE8' },
    { name: 'Electric Violet', hex: '#7C5DFA' },
    { name: 'Ocean Cyan', hex: '#06b6d4' },
    { name: 'Emerald Green', hex: '#10b981' },
    { name: 'Crimson Rose', hex: '#f43f5e' },
    { name: 'Amber Gold', hex: '#f59e0b' },
    { name: 'Vibrant Magenta', hex: '#ec4899' },
    { name: 'Deep Indigo', hex: '#6366f1' },
    { name: 'Sky Blue', hex: '#3b82f6' },
    { name: 'Teal Aurora', hex: '#14b8a6' },
    { name: 'Coral Flame', hex: '#f97316' },
    { name: 'Ruby Red', hex: '#e11d48' }
  ];

  const handleColorChange = (hex: string) => {
    setCustomHex(hex);
    updateSiteSettings({ primaryColor: hex });
    document.documentElement.style.setProperty('--color-primary', hex);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProject.title && newProject.description) {
      addProject({
        title: newProject.title,
        category: newProject.category,
        categories: normalizeProjectCategories(newProject.category, newProject.categories),
        description: newProject.description,
        longDescription: newProject.longDescription || newProject.description,
        image: newProject.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
        technologies: newProject.technologies ? newProject.technologies.split(',').map((t) => t.trim()).filter(Boolean) : [],
        metrics: newProject.metrics ? newProject.metrics.split(',').map((m) => m.trim()).filter(Boolean) : [],
        keyFeatures: newProject.keyFeatures ? newProject.keyFeatures.split('\n').map((f) => f.trim()).filter(Boolean) : [],
        githubUrl: newProject.githubUrl,
        liveUrl: newProject.liveUrl,
        showGithub: newProject.showGithub,
        showLive: newProject.showLive,
        featured: newProject.featured,
        flagship: newProject.flagship,
        date: newProject.date || '2026'
      });
      setNewProject({
        title: '',
        category: projectCategories[0] || 'Web Dev',
        categories: [],
        description: '',
        longDescription: '',
        keyFeatures: '',
        image: '',
        technologies: '',
        githubUrl: '',
        liveUrl: '',
        showGithub: true,
        showLive: true,
        featured: true,
        flagship: false,
        date: '2026',
        metrics: ''
      });
      notify('Project applied. Check the publication status to confirm saving.');
    }
  };

  const handleCreateCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCert.title && newCert.issuer) {
      if (editingCertId) updateCertificate(editingCertId, newCert);
      else addCertificate(newCert);
      setEditingCertId(null);
      setNewCert({
        title: '',
        issuer: '',
        date: '',
        credentialId: '',
        verificationUrl: '',
        category: 'Cloud',
        logo: 'FaAws',
        image: '',
        pdfUrl: ''
      });
    }
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatTitle.trim()) {
      notify('Enter a title for the skill group.', 'error');
      return;
    }
    addSkillCategory({
      title: newCatTitle.trim(),
      category: newCatTitle.trim(),
      icon: newCatIcon,
      iconName: newCatIcon,
      proficiency: Number(newCatProficiency),
      skills: []
    });
    setNewCatTitle('');
    setNewCatIcon('Cpu');
    setNewCatProficiency(85);
    notify('Skill group applied. Check the publication status to confirm saving.');
  };

  const handleCreateTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTool.name) {
      addTool({
        name: newTool.name.trim(),
        icon: newTool.icon,
        category: newTool.category
      });
      setNewTool({ name: '', icon: 'SiVisualstudiocode', category: 'Development' });
      notify('Tool applied. Check the publication status to confirm saving.');
    }
  };

  const handleAddTechStackItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTechItem.name.trim()) {
      notify('Enter a technology name, such as React, Docker or Python.', 'error');
      return;
    }
    addTechStackItem({
      name: newTechItem.name.trim(),
      icon: newTechItem.icon || 'SiReact',
      color: newTechItem.color || '#5B3FE8'
    });
    setNewTechItem({ name: '', icon: 'SiReact', color: '#61DAFB' });
  };

  const handleCreateLearning = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLearning.topic.trim()) {
      addCurrentlyLearning({
        title: newLearning.title || newLearning.topic,
        topic: newLearning.topic,
        progress: Number(newLearning.progress),
        status: newLearning.status,
        icon: newLearning.icon,
        description: newLearning.description
      });
      setNewLearning({
        title: '',
        topic: '',
        progress: 75,
        status: 'In Progress',
        icon: 'Code',
        description: ''
      });
      notify('Learning item applied. Check the publication status to confirm saving.');
    }
  };

  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBlog.title && newBlog.summary) {
      const slugBase = (newBlog.slug || newBlog.title)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || `article-${Date.now()}`;
      let slug = slugBase;
      let suffix = 2;
      while (blogPosts.some((post) => post.slug === slug && post.id !== editingBlogId)) slug = `${slugBase}-${suffix++}`;
      const blogInput = {
        ...newBlog,
        slug,
        featured: newBlog.featured,
        tags: newBlog.tags.split(',').map((t) => t.trim()).filter(Boolean)
      };
      if (editingBlogId) updateBlogPost(editingBlogId, blogInput);
      else addBlogPost(blogInput);
      setEditingBlogId(null);
      setNewBlog({
        title: '',
        slug: '',
        summary: '',
        content: '',
        category: 'Development',
        readTime: '5 min read',
        publishedAt: new Date().toISOString().slice(0, 10),
        tags: '',
        image: '',
        featured: false
      });
    }
  };

  const handleCreatePaper = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPaper.title && newPaper.venue) {
      const paperInput = {
        ...newPaper,
        authors: newPaper.authors.split(',').map((a) => a.trim()).filter(Boolean),
        keywords: newPaper.keywords ? newPaper.keywords.split(',').map((k) => k.trim()).filter(Boolean) : []
      };
      if (editingPaperId) updateResearchPaper(editingPaperId, paperInput);
      else addResearchPaper(paperInput);
      setEditingPaperId(null);
      setNewPaper({
        title: '',
        authors: '',
        venue: '',
        year: '',
        abstract: '',
        doi: '',
        citations: 0,
        pdfUrl: '',
        category: 'Edge AI & IoT',
        readTime: '8 min read',
        date: '',
        image: '',
        keywords: ''
      });
    }
  };

  const handleCreateGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newGalleryItem.title.trim();
    const category = newGalleryItem.category.trim();
    if (!title || !category || !newGalleryItem.imageUrl) return;
    addGalleryItem({ ...newGalleryItem, title, category, description: newGalleryItem.description.trim() });
    setNewGalleryItem({ title: '', category: '', imageUrl: '', description: '' });
  };

  const handleCreateExp = (e: React.FormEvent) => {
    e.preventDefault();
    if (newExp.title && newExp.company) {
      const experienceInput = {
        ...newExp,
        type: newExp.type || 'Full-time',
        responsibilities: newExp.responsibilities.split(',').map((r) => r.trim()).filter(Boolean),
        achievements: newExp.achievements.split(',').map((a) => a.trim()).filter(Boolean),
        technologies: newExp.technologies.split(',').map((t) => t.trim()).filter(Boolean)
      };
      if (editingExperienceId) updateExperience(editingExperienceId, experienceInput);
      else addExperience(experienceInput);
      setEditingExperienceId(null);
      setNewExp({
        title: '',
        company: '',
        period: '',
        location: '',
        summary: '',
        responsibilities: '',
        achievements: '',
        technologies: '',
        logo: 'Building2',
        type: 'Full-time'
      });
    }
  };

  const handleCreateAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchTitle.trim()) return;
    addAchievement({
      title: newAchTitle.trim(),
      organization: newAchOrg.trim() || 'Honor',
      year: newAchYear.trim() || new Date().getFullYear().toString(),
      category: 'Award',
      description: newAchDesc.trim(),
      badge: newAchBadge || 'cert-trophy',
    });
    setNewAchTitle('');
    setNewAchOrg('');
    setNewAchDesc('');
  };

  const handleSaveAchievementEdit = (id: string) => {
    updateAchievement(id, {
      title: editAchTitle.trim(),
      organization: editAchOrg.trim(),
      year: editAchYear.trim(),
      description: editAchDesc.trim(),
    });
    setEditingAchId(null);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target?.result as string;
        try {
          const backup = parseBackupJSON(content);
          setRestorePreview({ filename: file.name, json: content, exportedAt: backup.exportedAt, projects: backup.projects.length, articles: backup.blogPosts.length, messages: backup.messages.length });
          setFeedback(null);
        } catch {
          setRestorePreview(null);
          notify('This file is not a valid portfolio backup. Choose an exported Content & Full Inbox JSON file.', 'error');
        }
      };
      reader.onerror = () => notify('The backup file could not be read. Choose it again.', 'error');
      reader.readAsText(file);
    }
  };

  const confirmRestore = async () => {
    if (!restorePreview || restoreBusy) return;
    setRestoreBusy(true);
    try {
      const ok = await importDataJSON(restorePreview.json);
      if (!ok) throw new Error('The backup did not pass validation. No data was restored.');
      setRestorePreview(null);
      notify('Content restored. Matching inbox messages were updated, missing messages were added, and other messages were retained. Media files were not copied.');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'Restore failed. The selected backup is kept for retry.', 'error');
    } finally { setRestoreBusy(false); }
  };

  const downloadJson = (json: string, filename: string) => {
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  const handleBackupDownload = async () => {
    try { downloadJson(await exportDataJSON(), `rohanos-backup-${new Date().toISOString().slice(0, 10)}.json`); }
    catch (error) { notify(error instanceof Error ? error.message : 'Backup failed. Retry the export.', 'error'); }
  };
  const handlePublicContentDownload = () => downloadJson(exportPublicDataJSON(), 'publishedContent.json');

  const handleIconSelected = (iconId: string) => {
    if (!iconPickerTarget) return;

    if (iconPickerTarget.type === 'cert') {
      setNewCert((prev) => ({ ...prev, logo: iconId }));
    } else if (iconPickerTarget.type === 'tool') {
      setNewTool((prev) => ({ ...prev, icon: iconId }));
    } else if (iconPickerTarget.type === 'skillCategory' && iconPickerTarget.id) {
      updateSkillCategory(iconPickerTarget.id, { icon: iconId, iconName: iconId });
    } else if (iconPickerTarget.type === 'newSkillCategory') {
      setNewCatIcon(iconId);
    } else if (iconPickerTarget.type === 'newLearning') {
      setNewLearning((prev) => ({ ...prev, icon: iconId }));
    } else if (iconPickerTarget.type === 'newAchievement') {
      setNewAchBadge(iconId);
    } else if (iconPickerTarget.type === 'editAchievement' && iconPickerTarget.id) {
      updateAchievement(iconPickerTarget.id, { badge: iconId });
    } else if (iconPickerTarget.type === 'techStack' && iconPickerTarget.id) {
      updateTechStackItem(iconPickerTarget.id, { icon: iconId });
    } else if (iconPickerTarget.type === 'newTechStack') {
      setNewTechItem((prev) => ({ ...prev, icon: iconId }));
    } else if (iconPickerTarget.type === 'exp') {
      setNewExp((prev) => ({ ...prev, logo: iconId }));
    }
  };
return { currentContent, publishedContent, feedback, notify, clearFeedback: () => setFeedback(null), restorePreview, restoreBusy, confirmRestore, cancelRestore: () => setRestorePreview(null), navigate, location, signOut, session, theme, setTheme, siteSettings, updateSiteSettings, profile, updateProfile, projects, addProject, updateProject, deleteProject, reorderProjects, projectCategories, addProjectCategory, updateProjectCategory, deleteProjectCategory, reorderProjectCategories, certificateCategories, addCertificateCategory, updateCertificateCategory, deleteCertificateCategory, reorderCertificateCategories, blogCategories, addBlogCategory, updateBlogCategory, deleteBlogCategory, reorderBlogCategories, experiences, addExperience, updateExperience, deleteExperience, skillCategories, addSkillCategory, updateSkillCategory, deleteSkillCategory, addSkillToCategory, updateSkillInCategory, deleteSkillFromCategory, reorderSkillCategories, reorderSkillsInCategory, toolsList, addTool, deleteTool, reorderTools, techStack, addTechStackItem, updateTechStackItem, deleteTechStackItem, reorderTechStack, currentlyLearning, addCurrentlyLearning, deleteCurrentlyLearning, reorderCurrentlyLearning, achievements, addAchievement, updateAchievement, deleteAchievement, reorderAchievements, certificates, addCertificate, updateCertificate, deleteCertificate, reorderCertificates, blogPosts, addBlogPost, updateBlogPost, deleteBlogPost, researchPapers, addResearchPaper, updateResearchPaper, deleteResearchPaper, gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem, messages, updateMessageStatus, markAllMessagesAsRead, deleteMessage, refreshMessages, loadMoreMessages, messagesLoading, messagesError, hasMoreMessages, pendingMessageIds, retryMessageMutation, contentSyncState, contentSyncError, lastContentSyncAt, retryContentSync, resetToDefaults, exportDataJSON, exportPublicDataJSON, importDataJSON, requestedSection, activeTab, setActiveTab, unreadMessagesCount, totalSkillsCount, customHex, setCustomHex, newTitleInput, setNewTitleInput, pageHeaders, newProjectCatInput, setNewProjectCatInput, newCertCatInput, setNewCertCatInput, newBlogCatInput, setNewBlogCatInput, newAchTitle, setNewAchTitle, newAchOrg, setNewAchOrg, newAchYear, setNewAchYear, newAchDesc, setNewAchDesc, newAchBadge, setNewAchBadge, editingAchId, setEditingAchId, editAchTitle, setEditAchTitle, editAchOrg, setEditAchOrg, editAchYear, setEditAchYear, editAchDesc, setEditAchDesc, iconPickerOpen, setIconPickerOpen, iconPickerTarget, setIconPickerTarget, newTechItem, setNewTechItem, newProject, setNewProject, editingProject, setEditingProject, newCert, setNewCert, newTool, setNewTool, newCatTitle, setNewCatTitle, newCatIcon, setNewCatIcon, newCatProficiency, setNewCatProficiency, newSkillPerCat, setNewSkillPerCat, newLearning, setNewLearning, newBlog, setNewBlog, newPaper, setNewPaper, newGalleryItem, setNewGalleryItem, editingCertId, setEditingCertId, editingExperienceId, setEditingExperienceId, editingBlogId, setEditingBlogId, editingPaperId, setEditingPaperId, newExp, setNewExp, colorPresets, handleColorChange, handleLogout, handleCreateProject, handleCreateCert, handleCreateCategory, handleCreateTool, handleAddTechStackItem, handleCreateLearning, handleCreateBlog, handleCreatePaper, handleCreateGalleryItem, handleCreateExp, handleCreateAchievement, handleSaveAchievementEdit, handleImportFile, downloadJson, handleBackupDownload, handlePublicContentDownload, handleIconSelected };
}
export type AdminEditor = ReturnType<typeof useAdminEditor>;
