import { useStableActions } from '../hooks/useStableActions';
import { EditorActionsContext, ContentSyncContext, InboxContext } from './editorSubscriptions';
import { normalizeSiteSettings } from '../lib/contentCompatibility';
import { contentDefaults } from '../data/contentDefaults';
import { websiteDefaults } from '../data/websiteDefaults';
import { CONTENT_KEYS, ContentSliceContexts, ContentStatusContext, ModalStateContext, ModalActionsContext } from './contentSubscriptions';
import React, { createContext, useContext, useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { contentDraftKey, readContentDraft, clearConfirmedDraft, type ContentDraft } from '../lib/contentDraft';
import { readContentBootstrap } from '../lib/contentBootstrap';
import { reportDiagnostic } from '../lib/diagnostics';
import {
  Project,
  Experience,
  Skill,
  Achievement,
  Certificate,
  BlogPost,
  ResearchPaper,
  GalleryItem,
  ContactMessage,
  UserProfile,
  SiteContentSettings,
  SkillItem,
  SkillCategoryGroup,
  ToolItem,
  TechStackItem,
  CurrentlyLearningItem,
  initialMessages,
} from '../data/initialData';
import { getProjectCategories, normalizeProjectCategories } from '../utils/projectCategories';
import { reorderArray } from '../utils/array';
import { createPrimaryColorScale } from '../utils/color';
import { contentSliceSchemas, validatePublishedContent, PublishedContentValidationError, type ValidatedPublishedContent } from '../lib/validation';
import { mergeBackupMessages, parseBackupJSON } from '../lib/backupReview';
import {
  deleteContactMessage as deleteContactMessageFromSupabase,
  initializePublishedContent,
  isSupabaseConfigured,
  loadContactMessages,
  loadAllContactMessages,
  restorePortfolioBackup,
  loadPublishedContent,
  markAllContactMessagesAsRead,
  PublishedContentConflictError,
  savePublishedContent,
  updateContactMessageStatus as updateContactMessageStatusInSupabase,
} from '../lib/supabase';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';

export interface DataContextType {
  replaceContentSlice: <K extends Exclude<keyof typeof contentSliceSchemas, 'messages'>>(key: K, value: unknown) => void;
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;

  siteSettings: SiteContentSettings;
  updateSiteSettings: (settings: Partial<SiteContentSettings>) => void;
  registerMediaMetadata: (url: string, metadata: { width: number; height: number; small: string }) => void;
  
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  experiences: Experience[];
  addExperience: (exp: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;

  skills: Skill[];
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;

  skillCategories: SkillCategoryGroup[];
  addSkillCategory: (cat: Omit<SkillCategoryGroup, 'id'>) => void;
  updateSkillCategory: (id: string, category: Partial<SkillCategoryGroup>) => void;
  deleteSkillCategory: (id: string) => void;
  addSkillToCategory: (categoryId: string, skill: SkillItem) => void;
  updateSkillInCategory: (categoryId: string, skillIndex: number, skill: Partial<SkillItem>) => void;
  deleteSkillFromCategory: (categoryId: string, skillIndex: number) => void;

  toolsList: ToolItem[];
  addTool: (tool: ToolItem) => void;
  deleteTool: (idOrName: string) => void;
  updateToolsList: (tools: ToolItem[]) => void;
  reorderTools: (fromIndex: number, toIndex: number) => void;

  techStack: TechStackItem[];
  addTechStackItem: (item: Omit<TechStackItem, 'id'>) => void;
  updateTechStackItem: (id: string, item: Partial<TechStackItem>) => void;
  deleteTechStackItem: (id: string) => void;
  reorderTechStack: (fromIndex: number, toIndex: number) => void;

  currentlyLearning: CurrentlyLearningItem[];
  addCurrentlyLearning: (item: Omit<CurrentlyLearningItem, 'id'> & { id?: string }) => void;
  updateCurrentlyLearningItem: (id: string, item: Partial<CurrentlyLearningItem>) => void;
  deleteCurrentlyLearning: (id: string) => void;
  updateCurrentlyLearning: (items: CurrentlyLearningItem[]) => void;
  reorderCurrentlyLearning: (fromIndex: number, toIndex: number) => void;

  achievements: Achievement[];
  addAchievement: (ach: Omit<Achievement, 'id'>) => void;
  updateAchievement: (id: string, ach: Partial<Achievement>) => void;
  deleteAchievement: (id: string) => void;
  reorderAchievements: (fromIndex: number, toIndex: number) => void;

  certificates: Certificate[];
  addCertificate: (cert: Omit<Certificate, 'id'>) => void;
  updateCertificate: (id: string, cert: Partial<Certificate>) => void;
  deleteCertificate: (id: string) => void;

  reorderProjects: (fromIndex: number, toIndex: number) => void;
  reorderCertificates: (fromIndex: number, toIndex: number) => void;
  reorderSkillCategories: (fromIndex: number, toIndex: number) => void;
  reorderSkillsInCategory: (categoryId: string, fromIndex: number, toIndex: number) => void;

  projectCategories: string[];
  addProjectCategory: (category: string) => void;
  updateProjectCategory: (oldCat: string, newCat: string) => void;
  deleteProjectCategory: (category: string) => void;
  reorderProjectCategories: (fromIndex: number, toIndex: number) => void;

  certificateCategories: string[];
  addCertificateCategory: (category: string) => void;
  updateCertificateCategory: (oldCat: string, newCat: string) => void;
  deleteCertificateCategory: (category: string) => void;
  reorderCertificateCategories: (fromIndex: number, toIndex: number) => void;

  blogCategories: string[];
  addBlogCategory: (category: string) => void;
  updateBlogCategory: (oldCat: string, newCat: string) => void;
  deleteBlogCategory: (category: string) => void;
  reorderBlogCategories: (fromIndex: number, toIndex: number) => void;

  blogPosts: BlogPost[];
  addBlogPost: (post: Omit<BlogPost, 'id'>) => void;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;

  researchPapers: ResearchPaper[];
  addResearchPaper: (paper: Omit<ResearchPaper, 'id'>) => void;
  updateResearchPaper: (id: string, paper: Partial<ResearchPaper>) => void;
  deleteResearchPaper: (id: string) => void;

  gallery: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  updateGalleryItem: (id: string, item: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;

  messages: ContactMessage[];
  addMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => void;
  toggleMessageStatus: (id: string) => void;
  updateMessageStatus: (id: string, status: 'unread' | 'read' | 'replied') => void;
  markAllMessagesAsRead: () => void;
  deleteMessage: (id: string) => void;
  refreshMessages: () => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  messagesLoading: boolean;
  messagesError: string;
  hasMoreMessages: boolean;
  pendingMessageIds: string[];
  retryMessageMutation: () => void;
  contentSyncState: 'local' | 'loading' | 'ready' | 'saving' | 'missing' | 'failed' | 'conflict' | 'invalid';
  contentSyncError: string;
  lastContentSyncAt: string;
  retryContentSync: () => void;
  recoverableDraft: ContentDraft | null;
  draftStorageError: string;
  recoverDraft: () => void;
  discardDraft: () => void;
  exportDraftJSON: () => string;
  draftRecoveryRequired: boolean;
  contentEditingBlocked: boolean;
  saveAllChanges: () => Promise<void>;

  resetToDefaults: () => void;
  exportDataJSON: () => Promise<string>;
  exportPublicDataJSON: () => string;
  importDataJSON: (json: string) => Promise<boolean>;

  activeModalProject: Project | null;
  setActiveModalProject: (project: Project | null) => void;

  activeModalCert: Certificate | null;
  setActiveModalCert: (cert: Certificate | null) => void;

  activeModalBlog: BlogPost | null;
  setActiveModalBlog: (blog: BlogPost | null) => void;

  currentContent: ValidatedPublishedContent;
  publishedContent: ValidatedPublishedContent;
}

// The bundled JSON is the source of truth for published visitor content. Its
// fingerprint forms part of the cache namespace, so a deployment containing
// changed published content cannot be shadowed by a previous browser cache.
const CURRENT_VERSION = import.meta.env.VITE_CONTENT_BUNDLE_VERSION || 'v14_published_default';
const STORAGE_KEY = `rohanos_data_store_${isSupabaseConfigured ? 'hosted' : 'local'}_${CURRENT_VERSION}`;
const ACTIVE_BUNDLE_VERSION_KEY = `rohanos_data_store_active_bundle_version_${isSupabaseConfigured ? 'hosted' : 'local'}`;
const bundledContent = contentDefaults;

type PublicContentKey = Exclude<keyof ValidatedPublishedContent, 'schemaVersion'>;
const PUBLIC_CONTENT_KEYS: PublicContentKey[] = [
  'profile', 'siteSettings', 'projects', 'experiences', 'skills', 'skillCategories',
  'toolsList', 'techStack', 'currentlyLearning', 'achievements', 'certificates',
  'blogPosts', 'researchPapers', 'gallery', 'projectCategories', 'certificateCategories', 'blogCategories',
];

const safeUUID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const loadInitialContent = (): ValidatedPublishedContent => {
  const bootstrap = readContentBootstrap();
  if (bootstrap && isSupabaseConfigured && bootstrap.updatedAt) return bootstrap.content;
  try {
    const legacyCache = !isSupabaseConfigured && localStorage.getItem('rohanos_data_store_active_bundle_version') === CURRENT_VERSION;
    if (localStorage.getItem(ACTIVE_BUNDLE_VERSION_KEY) !== CURRENT_VERSION && !legacyCache) {
      return bootstrap?.content ?? bundledContent;
    }
    const candidate: Record<string, unknown> = { ...bundledContent };
    for (const key of PUBLIC_CONTENT_KEYS) {
      const saved = localStorage.getItem(`${STORAGE_KEY}_${key}`) || (legacyCache ? localStorage.getItem(`rohanos_data_store_${CURRENT_VERSION}_${key}`) : null);
      if (saved) candidate[key] = JSON.parse(saved);
    }
    return validatePublishedContent(candidate);
  } catch {
    return bootstrap?.content ?? bundledContent;
  }
};

const loadInitialMessages = (): ContactMessage[] => {
  try {
    const saved = localStorage.getItem(`${STORAGE_KEY}_messages`);
    const parsed = saved ? contentSliceSchemas.messages.safeParse(JSON.parse(saved)) : null;
    return parsed?.success ? parsed.data : initialMessages;
  } catch {
    return initialMessages;
  }
};

const getPublishedDefault = <K extends PublicContentKey>(key: K): ValidatedPublishedContent[K] => bundledContent[key];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();
  const { setDefaultTheme } = useTheme();
  const [cloudContentState, setCloudContentState] = useState<DataContextType['contentSyncState']>(
    isSupabaseConfigured ? 'loading' : 'local',
  );
  const cloudContentVersionRef = useRef<string | null>(null);
  const lastSyncedContentFingerprintRef = useRef<string | null>(null);
  const cloudSaveQueueRef = useRef<Promise<void>>(Promise.resolve());
  const [lastContentSyncAt, setLastContentSyncAt] = useState('');
  const [contentSyncError, setContentSyncError] = useState('');
  const hasLoadedMessagesForSession = useRef<string | null>(null);

  const [initialContent] = useState(loadInitialContent);
  const [profile, setProfileState] = useState<UserProfile>(initialContent.profile);
  const [siteSettings, setSiteSettings] = useState<SiteContentSettings>(initialContent.siteSettings);
  const [projects, setProjects] = useState<Project[]>(initialContent.projects);
  const [experiences, setExperiences] = useState<Experience[]>(initialContent.experiences);
  const [skills, setSkills] = useState<Skill[]>(initialContent.skills);
  const [skillCategories, setSkillCategories] = useState<SkillCategoryGroup[]>(initialContent.skillCategories);
  const [toolsList, setToolsList] = useState<ToolItem[]>(initialContent.toolsList);
  const [techStack, setTechStack] = useState<TechStackItem[]>(initialContent.techStack);
  const [currentlyLearning, setCurrentlyLearning] = useState<CurrentlyLearningItem[]>(initialContent.currentlyLearning);
  const [achievements, setAchievements] = useState<Achievement[]>(initialContent.achievements);
  const [certificates, setCertificates] = useState<Certificate[]>(initialContent.certificates);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialContent.blogPosts);
  const [researchPapers, setResearchPapers] = useState<ResearchPaper[]>(initialContent.researchPapers);
  const [gallery, setGallery] = useState<GalleryItem[]>(initialContent.gallery);
  const [messages, setMessages] = useState<ContactMessage[]>(() => isSupabaseConfigured ? [] : loadInitialMessages());
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState('');
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [pendingMessageIds, setPendingMessageIds] = useState<string[]>([]);
  const pendingMessageIdsRef = useRef(new Set<string>());
  type InboxMutation = { kind: 'status'; id: string; status: ContactMessage['status'] } | { kind: 'delete'; id: string } | { kind: 'readAll' };
  const failedInboxMutation = useRef<InboxMutation | null>(null);
  const sessionUserRef = useRef(session?.mode === 'supabase' ? session.userId : null);
  useEffect(() => { sessionUserRef.current = session?.mode === 'supabase' ? session.userId : null; }, [session]);
  const [projectCategories, setProjectCategories] = useState<string[]>(initialContent.projectCategories);
  const [certificateCategories, setCertificateCategories] = useState<string[]>(initialContent.certificateCategories);
  const [blogCategories, setBlogCategories] = useState<string[]>(initialContent.blogCategories);

  // Modals
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const [activeModalCert, setActiveModalCert] = useState<Certificate | null>(null);
  const [activeModalBlog, setActiveModalBlog] = useState<BlogPost | null>(null);
  const [recoverableDraft, setRecoverableDraft] = useState<ContentDraft | null>(null);
  const [draftStorageError, setDraftStorageError] = useState('');
  const [hasUnreadableDraft, setHasUnreadableDraft] = useState(false);
  const [hasPublishedContent, setHasPublishedContent] = useState(!isSupabaseConfigured);
  const [restoreInProgress, setRestoreInProgress] = useState(false);
  const restoreInProgressRef = useRef(false);
  const draftKey = session?.mode === 'supabase' && session.isAdmin
    ? contentDraftKey(import.meta.env.VITE_SUPABASE_URL || 'hosted', session.userId) : null;
  const checkedDraftKey = useRef<string | null>(null);
  const publishedContentRef = useRef<ValidatedPublishedContent>(initialContent);
  const [publishedContent, setPublishedContent] = useState<ValidatedPublishedContent>(initialContent);
  const currentContent = useMemo(() => ({
    schemaVersion: 1 as const, profile, siteSettings, projects, experiences, skills, skillCategories,
    toolsList, techStack, currentlyLearning, achievements, certificates, blogPosts,
    researchPapers, gallery, projectCategories, certificateCategories, blogCategories,
  }), [profile, siteSettings, projects, experiences, skills, skillCategories, toolsList,
    techStack, currentlyLearning, achievements, certificates, blogPosts, researchPapers,
    gallery, projectCategories, certificateCategories, blogCategories]);
  const currentContentRef = useRef(currentContent);
  useEffect(() => { currentContentRef.current = currentContent; }, [currentContent]);
  const initialContentFingerprint = useMemo(() => JSON.stringify(initialContent), [initialContent]);
  const applyContent = (content: ValidatedPublishedContent) => {
    setProfileState(content.profile); setSiteSettings(content.siteSettings);
    setProjects(content.projects); setExperiences(content.experiences); setSkills(content.skills);
    setSkillCategories(content.skillCategories); setToolsList(content.toolsList);
    setTechStack(content.techStack); setCurrentlyLearning(content.currentlyLearning);
    setAchievements(content.achievements); setCertificates(content.certificates);
    setBlogPosts(content.blogPosts); setResearchPapers(content.researchPapers); setGallery(content.gallery);
    setProjectCategories(content.projectCategories); setCertificateCategories(content.certificateCategories);
    setBlogCategories(content.blogCategories);
  };

  const modalState = useMemo(() => ({ activeModalProject, activeModalCert, activeModalBlog }), [activeModalProject, activeModalCert, activeModalBlog]);
  const modalActions = useMemo(() => ({ setActiveModalProject, setActiveModalCert, setActiveModalBlog }), []);

  // During local development, Vite can preserve the previous in-memory state
  // after bundled content changes. Activate each bundle version once so the
  // new Admin-editable seed wins, then preserve normal browser edits afterward.
  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_BUNDLE_VERSION_KEY, CURRENT_VERSION);
    } catch {
      // State still uses bundled defaults when browser storage is unavailable.
    }
  }, []);

  const persistedSlicesRef = useRef(new Map<string, unknown>());
  const { persist: persistDraft } = useStableActions({ persist() {
    if (session?.mode === 'demo') return;
    if (!draftKey || checkedDraftKey.current !== draftKey || recoverableDraft || hasUnreadableDraft || !cloudContentVersionRef.current) return;
    try {
      if (JSON.stringify(currentContent) !== lastSyncedContentFingerprintRef.current) {
        localStorage.setItem(draftKey, JSON.stringify({ version: 1, baseVersion: cloudContentVersionRef.current,
          savedAt: new Date().toISOString(), content: currentContent } satisfies ContentDraft));
      }
      setDraftStorageError('');
    } catch {
      setDraftStorageError('Browser storage is unavailable or full. Export your draft before closing this page.');
    }
  } });

  // Layout cleanup runs before the next session's actions replace these closures.
  // Flush on sign-out/account change or unmount, without writing on every edit.
  useLayoutEffect(() => () => { if (draftKey) persistDraft(); }, [draftKey, persistDraft]);

  // Persist one snapshot after user-visible work has settled instead of doing
  // a burst of synchronous localStorage writes during the first render.
  const { saveSlice } = useStableActions({
    saveSlice(key: string, data: unknown) {
      if (session?.mode === 'demo') return;
      if (persistedSlicesRef.current.get(key) === data) return;
      try {
        localStorage.setItem(`${STORAGE_KEY}_${key}`, JSON.stringify(data));
        persistedSlicesRef.current.set(key, data);
      } catch {
        reportDiagnostic('cache_write_failed');
      }
    }
  });

  useEffect(() => {
    const snapshot = isSupabaseConfigured ? publishedContentRef.current : currentContent;
    const idleWindow = window as typeof window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    let idleHandle: number | undefined;
    const persist = () => {
      for (const key of PUBLIC_CONTENT_KEYS) saveSlice(key, snapshot[key]);
      persistDraft();
      try {
        if (isSupabaseConfigured) localStorage.removeItem(`${STORAGE_KEY}_messages`);
        else saveSlice('messages', messages);
      } catch {
        reportDiagnostic('cache_write_failed');
      }
    };
    const debounceHandle = window.setTimeout(() => {
      idleHandle = idleWindow.requestIdleCallback
        ? idleWindow.requestIdleCallback(persist, { timeout: 1000 })
        : window.setTimeout(persist, 0);
    }, 150);
    window.addEventListener('pagehide', persist);

    return () => {
      window.removeEventListener('pagehide', persist);
      window.clearTimeout(debounceHandle);
      if (idleHandle === undefined) return;
      if (idleWindow.cancelIdleCallback) idleWindow.cancelIdleCallback(idleHandle);
      else window.clearTimeout(idleHandle);
    };
  }, [profile, siteSettings, projects, experiences, skills, skillCategories, toolsList, techStack,
    currentlyLearning, achievements, certificates, blogPosts, researchPapers, gallery, messages,
    projectCategories, certificateCategories, blogCategories, currentContent, draftKey, recoverableDraft, hasUnreadableDraft, cloudContentState, persistDraft, saveSlice]);

  // Supabase is the published source of truth when configured. Browser storage
  // remains a local fallback while the hosted document is loading or offline.
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;

    const bootstrap = readContentBootstrap();
    // The server-rendered snapshot and React start from the same validated data.
    // Keep createRoot: the crawler snapshot is not matching React SSR markup.
    (bootstrap?.updatedAt ? Promise.resolve({ payload: bootstrap.content, updatedAt: bootstrap.updatedAt }) : loadPublishedContent())
      .then((document) => {
        if (!active) return;
        if (!document) {
          setCloudContentState('missing');
          return;
        }
        cloudContentVersionRef.current = document.updatedAt;
        const remote = validatePublishedContent(document.payload);
        lastSyncedContentFingerprintRef.current = JSON.stringify(remote);
        publishedContentRef.current = remote;
        setPublishedContent(remote);
        setHasPublishedContent(true);
        if (JSON.stringify(currentContentRef.current) !== initialContentFingerprint) {
          // If the user has already begun making edits before the remote document loaded,
          // keep their active in-flight modifications rather than overwriting with remote.
          setContentSyncError('');
          setCloudContentState('ready');
          return;
        }
        setProfileState(remote.profile);
        setSiteSettings(remote.siteSettings);
        setProjects(remote.projects);
        setExperiences(remote.experiences);
        setSkills(remote.skills);
        setSkillCategories(remote.skillCategories);
        setToolsList(remote.toolsList);
        setTechStack(remote.techStack);
        setCurrentlyLearning(remote.currentlyLearning);
        setAchievements(remote.achievements);
        setCertificates(remote.certificates);
        setBlogPosts(remote.blogPosts);
        setResearchPapers(remote.researchPapers);
        setGallery(remote.gallery);
        setProjectCategories(remote.projectCategories);
        setCertificateCategories(remote.certificateCategories);
        setBlogCategories(remote.blogCategories);
        setContentSyncError('');
        setCloudContentState('ready');
      })
      .catch((error) => {
        if (!active) return;
        const reference = reportDiagnostic('content_load_failed');
        setContentSyncError(error instanceof PublishedContentValidationError ? error.message : `Published content could not be loaded. Retry synchronization. Reference: ${reference}`);
        setCloudContentState('failed');
      });

    return () => { active = false; };
  }, [initialContentFingerprint]);

  useEffect(() => {
    if (!draftKey) {
      if (checkedDraftKey.current) applyContent(publishedContentRef.current);
      checkedDraftKey.current = null;
      setRecoverableDraft(null);
      setHasUnreadableDraft(false);
      setDraftStorageError('');
      return;
    }
    if (cloudContentState !== 'ready' || checkedDraftKey.current === draftKey) return;
    if (checkedDraftKey.current && checkedDraftKey.current !== draftKey) applyContent(publishedContentRef.current);
    checkedDraftKey.current = draftKey;
    setRecoverableDraft(null);
    setHasUnreadableDraft(false);
    setDraftStorageError('');
    try {
      const draft = readContentDraft(draftKey);
      if (draft && JSON.stringify(draft.content) !== lastSyncedContentFingerprintRef.current) setRecoverableDraft(draft);
      else if (draft) localStorage.removeItem(draftKey);
    } catch (error) {
      setHasUnreadableDraft(true);
      setDraftStorageError(error instanceof Error ? error.message : 'Saved draft could not be read.');
    }
  }, [draftKey, cloudContentState]);

  const recoverDraft = () => {
    if (!recoverableDraft) return;
    if (recoverableDraft.baseVersion !== cloudContentVersionRef.current) {
      setDraftStorageError('Published content changed after this draft. Export it and merge the changes into the latest content before saving.');
      return;
    }
    applyContent(recoverableDraft.content);
    setRecoverableDraft(null);
  };
  const discardDraft = () => {
    if (!draftKey) return;
    try { localStorage.removeItem(draftKey); setRecoverableDraft(null); setHasUnreadableDraft(false); setDraftStorageError(''); }
    catch { setDraftStorageError('Saved draft could not be removed.'); }
  };
  const exportDraftJSON = () => {
    if (draftStorageError && draftKey) {
      try { const raw = localStorage.getItem(draftKey); if (raw) return raw; } catch { /* Export current in-memory content below. */ }
    }
    return JSON.stringify(recoverableDraft ?? {
    version: 1, baseVersion: cloudContentVersionRef.current, savedAt: new Date().toISOString(), content: currentContent,
  }, null, 2);
  };

  useEffect(() => {
    if (session?.mode !== 'supabase' || !session.isAdmin) {
      hasLoadedMessagesForSession.current = null;
      if (!isSupabaseConfigured) return;
      const clearMessages = window.setTimeout(() => setMessages([]), 0);
      return () => window.clearTimeout(clearMessages);
    }
    if (hasLoadedMessagesForSession.current === session.userId) return;
    let active = true;
    setMessagesLoading(true);
    setMessagesError('');

    loadContactMessages(session.accessToken)
      .then((remoteMessages) => {
        if (!active) return;
        hasLoadedMessagesForSession.current = session.userId;
        setMessages(remoteMessages);
        setHasMoreMessages(remoteMessages.length === 50);
      })
      .catch(() => {
        if (active) hasLoadedMessagesForSession.current = null;
        if (active) setMessagesError('Inbox could not be loaded. Retry when the connection is available.');
        reportDiagnostic('inbox_load_failed');
      })
      .finally(() => {
        if (active) setMessagesLoading(false);
      });

    return () => { active = false; };
  }, [session]);

  useEffect(() => {
    if (restoreInProgress || !['ready', 'invalid'].includes(cloudContentState) || session?.mode !== 'supabase' || !session.isAdmin || recoverableDraft || hasUnreadableDraft || checkedDraftKey.current !== draftKey) return;
    const candidate = currentContent;

    const timeout = window.setTimeout(() => {
      if (restoreInProgressRef.current) return;
      const fingerprint = JSON.stringify(candidate);
      if (fingerprint === lastSyncedContentFingerprintRef.current) return;
      const queuedSave = cloudSaveQueueRef.current
        .catch(() => undefined)
        .then(async () => {
          if (fingerprint === lastSyncedContentFingerprintRef.current) return;
          const payload = validatePublishedContent(candidate);
          const expectedUpdatedAt = cloudContentVersionRef.current;
          if (!expectedUpdatedAt) throw new Error('Cloud content has no concurrency version.');
          setCloudContentState('saving');
          const nextUpdatedAt = await savePublishedContent(payload, session.accessToken, expectedUpdatedAt);
          cloudContentVersionRef.current = nextUpdatedAt;
          lastSyncedContentFingerprintRef.current = fingerprint;
          publishedContentRef.current = payload;
          setPublishedContent(payload);
          setHasPublishedContent(true);
          if (draftKey) {
            try { clearConfirmedDraft(draftKey, payload); }
            catch { setDraftStorageError('Saved successfully, but the browser draft could not be cleared.'); }
          }
          setContentSyncError('');
          setLastContentSyncAt(new Date().toISOString());
          setCloudContentState('ready');
        });
      cloudSaveQueueRef.current = queuedSave;
      void queuedSave.catch((error) => {
        const reference = reportDiagnostic('content_save_failed');
        setContentSyncError(error instanceof PublishedContentValidationError || error instanceof PublishedContentConflictError
          ? error.message : `Hosted content could not be saved. Your draft was kept; retry synchronization. Reference: ${reference}`);
        setCloudContentState(error instanceof PublishedContentValidationError ? 'invalid' : error instanceof PublishedContentConflictError ? 'conflict' : 'failed');
      });
    }, 700);
    return () => window.clearTimeout(timeout);
  }, [cloudContentState, session, currentContent, recoverableDraft, hasUnreadableDraft, draftKey, restoreInProgress]);

  // Sync dynamic CSS color variables on theme/color change
  useEffect(() => {
    const color = siteSettings.primaryColor || '#5B3FE8';
    if (!/^#[0-9a-f]{6}$/i.test(color)) return;
    const scale = createPrimaryColorScale(color);
    document.documentElement.style.setProperty('--color-primary', color);
    document.documentElement.style.setProperty('--primary-purple', color);
    document.documentElement.style.setProperty('--hero-accent', color);
    for (const [shade, channels] of Object.entries(scale)) {
      document.documentElement.style.setProperty(`--color-primary-${shade}`, channels);
    }
  }, [siteSettings.primaryColor]);

  useEffect(() => {
    setDefaultTheme(siteSettings.themeMode);
  }, [setDefaultTheme, siteSettings.themeMode]);

  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfileState((prev) => ({ ...prev, ...updated }));
  };

  const updateSiteSettings = (updated: Partial<SiteContentSettings>) => {
    setSiteSettings((prev) => ({ ...prev, ...updated }));
  };
  const registerMediaMetadata = (url: string, metadata: { width: number; height: number; small: string }) => {
    setSiteSettings(previous => ({ ...previous, website: { ...(previous.website || websiteDefaults),
      media: { ...previous.website?.media, [url]: metadata } } }));
  };

  // The complete editor uses the same state and persistence pipeline as the
  // focused editors. Validate before mutating so incomplete drafts stay local.
  const replaceContentSlice: DataContextType['replaceContentSlice'] = (key, candidate) => {
    const value = contentSliceSchemas[key].parse(key === 'siteSettings' ? normalizeSiteSettings(candidate) : candidate);
    // A keyed setter table keeps every public slice available in this editor.
    const setters = {
      profile: setProfileState, siteSettings: setSiteSettings, projects: setProjects,
      experiences: setExperiences, skills: setSkills, skillCategories: setSkillCategories,
      toolsList: setToolsList, techStack: setTechStack, currentlyLearning: setCurrentlyLearning,
      achievements: setAchievements, certificates: setCertificates, blogPosts: setBlogPosts,
      researchPapers: setResearchPapers, gallery: setGallery, projectCategories: setProjectCategories,
      certificateCategories: setCertificateCategories, blogCategories: setBlogCategories,
    };
    // Each schema and setter share the same key and corresponding data type.
    (setters[key] as (next: typeof value) => void)(value);
  };

  const addProject = (p: Omit<Project, 'id'>) => {
    const newP: Project = { ...p, id: `proj-${safeUUID()}` };
    setProjects((prev) => [newP, ...prev]);
  };

  const updateProject = (id: string, p: Partial<Project>) => {
    setProjects((prev) => prev.map((item) => (item.id === id ? { ...item, ...p } : item)));
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((item) => item.id !== id));
  };

  const addExperience = (e: Omit<Experience, 'id'>) => {
    const newE: Experience = { ...e, id: `exp-${safeUUID()}` };
    setExperiences((prev) => [newE, ...prev]);
  };

  const updateExperience = (id: string, e: Partial<Experience>) => {
    setExperiences((prev) => prev.map((item) => (item.id === id ? { ...item, ...e } : item)));
  };

  const deleteExperience = (id: string) => {
    setExperiences((prev) => prev.filter((item) => item.id !== id));
  };

  const addSkill = (s: Omit<Skill, 'id'>) => {
    const newS: Skill = { ...s, id: `sk-${safeUUID()}` };
    setSkills((prev) => [...prev, newS]);
  };

  const updateSkill = (id: string, s: Partial<Skill>) => {
    setSkills((prev) => prev.map((item) => (item.id === id ? { ...item, ...s } : item)));
  };

  const deleteSkill = (id: string) => {
    setSkills((prev) => prev.filter((item) => item.id !== id));
  };

  const addSkillCategory = (cat: Omit<SkillCategoryGroup, 'id'>) => {
    const newCat: SkillCategoryGroup = {
      ...cat,
      id: `cat-${safeUUID()}`,
      skills: cat.skills || []
    };
    setSkillCategories((prev) => [...prev, newCat]);
  };

  const updateSkillCategory = (id: string, cat: Partial<SkillCategoryGroup>) => {
    setSkillCategories((prev) => prev.map((item) => (item.id === id ? { ...item, ...cat } : item)));
  };

  const deleteSkillCategory = (id: string) => {
    setSkillCategories((prev) => prev.filter((item) => item.id !== id));
  };

  const addSkillToCategory = (categoryId: string, skill: SkillItem) => {
    setSkillCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          skills: [...cat.skills, skill]
        };
      })
    );
  };

  const updateSkillInCategory = (categoryId: string, skillIndex: number, skill: Partial<SkillItem>) => {
    setSkillCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat;
        const updatedSkills = [...cat.skills];
        if (skillIndex >= 0 && skillIndex < updatedSkills.length) {
          updatedSkills[skillIndex] = { ...updatedSkills[skillIndex], ...skill };
        }
        return { ...cat, skills: updatedSkills };
      })
    );
  };

  const deleteSkillFromCategory = (categoryId: string, skillIndex: number) => {
    setSkillCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          skills: cat.skills.filter((_, idx) => idx !== skillIndex)
        };
      })
    );
  };

  const addTool = (tool: ToolItem) => {
    const newTool: ToolItem = { ...tool, id: tool.id || `tool-${safeUUID()}` };
    setToolsList((prev) => [...prev, newTool]);
  };

  const deleteTool = (idOrName: string) => {
    setToolsList((prev) => prev.filter((t) => (t.id ? t.id !== idOrName : t.name !== idOrName)));
  };

  const updateToolsList = (tools: ToolItem[]) => {
    setToolsList(tools);
  };

  const reorderTools = (fromIndex: number, toIndex: number) => {
    setToolsList((prev) => reorderArray(prev, fromIndex, toIndex));
  };

  const addTechStackItem = (item: Omit<TechStackItem, 'id'>) => {
    const newItem: TechStackItem = { ...item, id: `tech-${safeUUID()}` };
    setTechStack((prev) => [...prev, newItem]);
  };

  const updateTechStackItem = (id: string, updated: Partial<TechStackItem>) => {
    setTechStack((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
  };

  const deleteTechStackItem = (id: string) => {
    setTechStack((prev) => prev.filter((t) => t.id !== id));
  };

  const reorderTechStack = (fromIndex: number, toIndex: number) => {
    setTechStack((prev) => reorderArray(prev, fromIndex, toIndex));
  };

  const addCurrentlyLearning = (item: Omit<CurrentlyLearningItem, 'id'> & { id?: string }) => {
    const newItem: CurrentlyLearningItem = { ...item, id: item.id || `learn-${safeUUID()}` };
    setCurrentlyLearning((prev) => [...prev, newItem]);
  };

  const updateCurrentlyLearningItem = (id: string, item: Partial<CurrentlyLearningItem>) => {
    setCurrentlyLearning((prev) =>
      prev.map((l) => (l.id === id || l.topic === id ? { ...l, ...item } : l))
    );
  };

  const deleteCurrentlyLearning = (id: string) => {
    setCurrentlyLearning((prev) => prev.filter((item) => (item.id ? item.id !== id : item.topic !== id)));
  };

  const updateCurrentlyLearning = (items: CurrentlyLearningItem[]) => {
    setCurrentlyLearning(items);
  };

  const reorderCurrentlyLearning = (fromIndex: number, toIndex: number) => {
    setCurrentlyLearning((prev) => reorderArray(prev, fromIndex, toIndex));
  };

  const addAchievement = (ach: Omit<Achievement, 'id'>) => {
    const newAch: Achievement = { ...ach, id: `ach-${safeUUID()}` };
    setAchievements((prev) => [newAch, ...prev]);
  };

  const updateAchievement = (id: string, ach: Partial<Achievement>) => {
    setAchievements((prev) => prev.map((item) => (item.id === id ? { ...item, ...ach } : item)));
  };

  const deleteAchievement = (id: string) => {
    setAchievements((prev) => prev.filter((item) => item.id !== id));
  };

  const reorderAchievements = (fromIndex: number, toIndex: number) => {
    setAchievements((prev) => reorderArray(prev, fromIndex, toIndex));
  };

  const addCertificate = (c: Omit<Certificate, 'id'>) => {
    const newC: Certificate = { ...c, id: `cert-${safeUUID()}` };
    setCertificates((prev) => [newC, ...prev]);
  };

  const updateCertificate = (id: string, c: Partial<Certificate>) => {
    setCertificates((prev) => prev.map((item) => (item.id === id ? { ...item, ...c } : item)));
  };

  const deleteCertificate = (id: string) => {
    setCertificates((prev) => prev.filter((item) => item.id !== id));
  };

  const reorderProjects = (fromIndex: number, toIndex: number) => {
    setProjects((prev) => reorderArray(prev, fromIndex, toIndex));
  };

  const reorderCertificates = (fromIndex: number, toIndex: number) => {
    setCertificates((prev) => reorderArray(prev, fromIndex, toIndex));
  };

  const reorderSkillCategories = (fromIndex: number, toIndex: number) => {
    setSkillCategories((prev) => reorderArray(prev, fromIndex, toIndex));
  };

  const reorderSkillsInCategory = (categoryId: string, fromIndex: number, toIndex: number) => {
    setSkillCategories((prev) =>
      prev.map((cat) => (cat.id === categoryId ? { ...cat, skills: reorderArray(cat.skills, fromIndex, toIndex) } : cat))
    );
  };

  const addBlogPost = (b: Omit<BlogPost, 'id'>) => {
    const newB: BlogPost = { ...b, id: `blog-${safeUUID()}` };
    setBlogPosts((prev) => [newB, ...prev]);
  };

  const updateBlogPost = (id: string, b: Partial<BlogPost>) => {
    setBlogPosts((prev) => prev.map((item) => (item.id === id ? { ...item, ...b } : item)));
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts((prev) => prev.filter((item) => item.id !== id));
  };

  const addResearchPaper = (paper: Omit<ResearchPaper, 'id'>) => {
    const newR: ResearchPaper = { ...paper, id: `res-${safeUUID()}` };
    setResearchPapers((prev) => [newR, ...prev]);
  };

  const updateResearchPaper = (id: string, r: Partial<ResearchPaper>) => {
    setResearchPapers((prev) => prev.map((item) => (item.id === id ? { ...item, ...r } : item)));
  };

  const deleteResearchPaper = (id: string) => {
    setResearchPapers((prev) => prev.filter((item) => item.id !== id));
  };

  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    setGallery((current) => [{ ...item, id: `gallery-${safeUUID()}` }, ...current]);
  };

  const updateGalleryItem = (id: string, item: Partial<GalleryItem>) => {
    setGallery((current) => current.map((entry) => entry.id === id ? { ...entry, ...item } : entry));
  };

  const deleteGalleryItem = (id: string) => {
    setGallery((current) => current.filter((entry) => entry.id !== id));
  };

  // Project Categories CRUD
  const addProjectCategory = (category: string) => {
    const trimmed = category.trim();
    if (!trimmed) return;
    setProjectCategories((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
  };

  const updateProjectCategory = (oldCat: string, newCat: string) => {
    const trimmed = newCat.trim();
    if (!trimmed || oldCat === trimmed) return;
    setProjectCategories((prev) => Array.from(new Set(prev.map((c) => (c === oldCat ? trimmed : c)))));
    setProjects((prev) => prev.map((project) => {
      const primaryCategory = project.category === oldCat ? trimmed : project.category;
      const categories = getProjectCategories(project).map((item) => (item === oldCat ? trimmed : item));
      return {
        ...project,
        category: primaryCategory,
        categories: normalizeProjectCategories(primaryCategory, categories),
      };
    }));
  };

  const deleteProjectCategory = (category: string) => {
    const remainingCategories = projectCategories.filter((item) => item !== category);
    const needsFallback = projects.some((project) => (
      project.category === category && getProjectCategories(project).every((item) => item === category)
    ));
    const fallbackCategory = remainingCategories[0] || 'Uncategorized';

    setProjectCategories(
      needsFallback && !remainingCategories.includes(fallbackCategory)
        ? [...remainingCategories, fallbackCategory]
        : remainingCategories,
    );
    setProjects((prev) => prev.map((project) => {
      const remainingGroups = getProjectCategories(project).filter((item) => item !== category);
      const primaryCategory = project.category === category
        ? remainingGroups[0] || fallbackCategory
        : project.category;
      return {
        ...project,
        category: primaryCategory,
        categories: normalizeProjectCategories(primaryCategory, remainingGroups),
      };
    }));
  };

  const reorderProjectCategories = (fromIndex: number, toIndex: number) => {
    setProjectCategories((prev) => reorderArray(prev, fromIndex, toIndex));
  };

  // Certificate Categories CRUD
  const addCertificateCategory = (category: string) => {
    const trimmed = category.trim();
    if (!trimmed) return;
    setCertificateCategories((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
  };

  const updateCertificateCategory = (oldCat: string, newCat: string) => {
    const trimmed = newCat.trim();
    if (!trimmed || oldCat === trimmed) return;
    setCertificateCategories((prev) => prev.map((c) => (c === oldCat ? trimmed : c)));
    setCertificates((prev) => prev.map((c) => (c.category === oldCat ? { ...c, category: trimmed } : c)));
  };

  const deleteCertificateCategory = (category: string) => {
    const fallback = certificateCategories.find((item) => item !== category) || 'Uncategorized';
    setCertificateCategories((prev) => [...new Set([...prev.filter((c) => c !== category), fallback])]);
    setCertificates((prev) => prev.map((item) => item.category === category ? { ...item, category: fallback } : item));
  };

  const reorderCertificateCategories = (fromIndex: number, toIndex: number) => {
    setCertificateCategories((prev) => reorderArray(prev, fromIndex, toIndex));
  };

  // Blog Categories CRUD
  const addBlogCategory = (category: string) => {
    const trimmed = category.trim();
    if (!trimmed) return;
    setBlogCategories((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
  };

  const updateBlogCategory = (oldCat: string, newCat: string) => {
    const trimmed = newCat.trim();
    if (!trimmed || oldCat === trimmed) return;
    setBlogCategories((prev) => prev.map((c) => (c === oldCat ? trimmed : c)));
    setBlogPosts((prev) => prev.map((b) => (b.category === oldCat ? { ...b, category: trimmed } : b)));
  };

  const deleteBlogCategory = (category: string) => {
    const fallback = blogCategories.find((item) => item !== category) || 'Uncategorized';
    setBlogCategories((prev) => [...new Set([...prev.filter((c) => c !== category), fallback])]);
    setBlogPosts((prev) => prev.map((item) => item.category === category ? { ...item, category: fallback } : item));
  };

  const reorderBlogCategories = (fromIndex: number, toIndex: number) => {
    setBlogCategories((prev) => reorderArray(prev, fromIndex, toIndex));
  };

  const addMessage = (m: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => {
    const newM: ContactMessage = {
      ...m,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'unread',
    };
    setMessages((prev) => [newM, ...prev]);
  };

  const toggleMessageStatus = (id: string) => {
    const current = messages.find((message) => message.id === id);
    if (!current) return;
    const nextStatus = current.status === 'unread' ? 'read' : current.status === 'read' ? 'replied' : 'unread';
    updateMessageStatus(id, nextStatus);
  };

  const updateMessageStatus = (id: string, status: 'unread' | 'read' | 'replied') => {
    runInboxMutation({ kind: 'status', id, status });
  };

  const markAllMessagesAsRead = () => {
    runInboxMutation({ kind: 'readAll' });
  };

  const deleteMessage = (id: string) => {
    runInboxMutation({ kind: 'delete', id });
  };

  const runInboxMutation = (mutation: InboxMutation) => {
    const key = mutation.kind === 'readAll' ? '*' : mutation.id;
    if (messagesLoading) return;
    if (pendingMessageIdsRef.current.has(key) || pendingMessageIdsRef.current.has('*') || (key === '*' && pendingMessageIdsRef.current.size)) return;
    const apply = () => setMessages((previous) => mutation.kind === 'delete'
      ? previous.filter((message) => message.id !== mutation.id)
      : previous.map((message) => mutation.kind === 'readAll'
        ? { ...message, status: message.status === 'unread' ? 'read' : message.status }
        : message.id === mutation.id ? { ...message, status: mutation.status } : message));
    if (!isSupabaseConfigured) { apply(); return; }
    if (session?.mode !== 'supabase' || !session.isAdmin) return;
    const userId = session.userId;
    pendingMessageIdsRef.current.add(key); setPendingMessageIds([...pendingMessageIdsRef.current]);
    failedInboxMutation.current = null; setMessagesError('');
    const operation = mutation.kind === 'delete' ? deleteContactMessageFromSupabase(mutation.id, session.accessToken)
      : mutation.kind === 'readAll' ? markAllContactMessagesAsRead(session.accessToken)
        : updateContactMessageStatusInSupabase(mutation.id, mutation.status, session.accessToken);
    void operation.then(() => { if (sessionUserRef.current === userId) apply(); })
      .catch(() => {
        reportDiagnostic('inbox_mutation_failed');
        if (sessionUserRef.current !== userId) return;
        failedInboxMutation.current = mutation;
        setMessagesError('The inbox action failed. Your message was kept unchanged. Retry the action when the connection is available.');
      }).finally(() => {
        pendingMessageIdsRef.current.delete(key); setPendingMessageIds([...pendingMessageIdsRef.current]);
      });
  };
  const retryMessageMutation = () => { if (failedInboxMutation.current) runInboxMutation(failedInboxMutation.current); else void refreshMessages(); };

  const retryContentSync = () => {
    if (cloudContentState === 'missing' && session?.mode === 'supabase' && session.isAdmin) {
      const candidate = {
        schemaVersion: 1 as const,
        profile, siteSettings, projects, experiences, skills, skillCategories,
        toolsList, techStack, currentlyLearning, achievements, certificates,
        blogPosts, researchPapers, gallery, projectCategories, certificateCategories, blogCategories,
      };
      let payload;
      try {
        payload = validatePublishedContent(candidate);
        setContentSyncError('');
      } catch (error) {
        setContentSyncError(error instanceof Error ? error.message : 'Published content is invalid.');
        setCloudContentState('failed');
        return;
      }
      setCloudContentState('saving');
      void initializePublishedContent(payload, session.accessToken)
        .then((updatedAt) => {
          cloudContentVersionRef.current = updatedAt;
          lastSyncedContentFingerprintRef.current = JSON.stringify(payload);
          publishedContentRef.current = payload;
          setPublishedContent(payload);
          setHasPublishedContent(true);
          setLastContentSyncAt(new Date().toISOString());
          setCloudContentState('ready');
        })
        .catch((error) => {
          const reference = reportDiagnostic('content_initialize_failed');
          setContentSyncError(error instanceof PublishedContentConflictError ? error.message : `Hosted content could not be initialized. Retry synchronization. Reference: ${reference}`);
          setCloudContentState(error instanceof PublishedContentConflictError ? 'conflict' : 'failed');
        });
      return;
    }
    if (cloudContentState !== 'failed') return;
    if (cloudContentVersionRef.current && lastSyncedContentFingerprintRef.current) {
      setCloudContentState('ready');
      return;
    }
    window.location.reload();
  };

  const saveAllChanges = async () => {
    if (session?.mode === 'supabase' && session.isAdmin) {
      const candidate = currentContent;
      const payload = validatePublishedContent(candidate);
      const expectedUpdatedAt = cloudContentVersionRef.current;
      if (!expectedUpdatedAt) {
        if (cloudContentState === 'missing') {
          retryContentSync();
          return;
        }
        throw new Error('Cloud content has no concurrency version.');
      }
      setCloudContentState('saving');
      try {
        const nextUpdatedAt = await savePublishedContent(payload, session.accessToken, expectedUpdatedAt);
        cloudContentVersionRef.current = nextUpdatedAt;
        lastSyncedContentFingerprintRef.current = JSON.stringify(candidate);
        publishedContentRef.current = payload;
        setPublishedContent(payload);
        setHasPublishedContent(true);
        if (draftKey) {
          try { clearConfirmedDraft(draftKey, payload); }
          catch { setDraftStorageError('Saved successfully, but the browser draft could not be cleared.'); }
        }
        setContentSyncError('');
        setLastContentSyncAt(new Date().toISOString());
        setCloudContentState('ready');
      } catch (err) {
        if (err instanceof PublishedContentConflictError) {
          setContentSyncError('Conflict: Content was modified in another session. Please reload remote changes before publishing.');
          setCloudContentState('ready');
        } else {
          setContentSyncError(err instanceof Error ? err.message : 'Save failed.');
          setCloudContentState('failed');
        }
        throw err;
      }
    } else {
      if (session?.mode === 'demo') {
        try {
          sessionStorage.setItem('rohanos_demo_draft', JSON.stringify(currentContent));
        } catch {
          // Demo sandbox in-memory fallback
        }
      } else if (draftKey) {
        try {
          localStorage.setItem(draftKey, JSON.stringify(currentContent));
        } catch {
          setDraftStorageError('Local draft could not be saved to browser storage.');
        }
      }
      setLastContentSyncAt(new Date().toISOString());
    }
  };

  const refreshMessages = async () => {
    if (pendingMessageIdsRef.current.size) return;
    if (session?.mode !== 'supabase' || !session.isAdmin) return;
    const userId = session.userId;
    setMessagesLoading(true);
    setMessagesError('');
    try {
      const remoteMessages = await loadContactMessages(session.accessToken);
      if (sessionUserRef.current !== userId) return;
      setMessages(remoteMessages);
      setHasMoreMessages(remoteMessages.length === 50);
    } catch {
      if (sessionUserRef.current === userId) setMessagesError('Inbox could not be refreshed. Your existing view was kept.');
      reportDiagnostic('inbox_load_failed');
    } finally {
      if (sessionUserRef.current === userId) setMessagesLoading(false);
    }
  };

  const loadMoreMessages = async () => {
    if (session?.mode !== 'supabase' || !session.isAdmin || messagesLoading || !hasMoreMessages) return;
    const userId = session.userId;
    setMessagesLoading(true);
    setMessagesError('');
    try {
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage?.createdAt) {
        setHasMoreMessages(false);
        setMessagesError('More messages could not be loaded because the page cursor is missing. Refresh the inbox.');
        return;
      }
      const nextPage = await loadContactMessages(session.accessToken, { createdAt: lastMessage.createdAt, id: lastMessage.id });
      if (sessionUserRef.current !== userId) return;
      setMessages((current) => {
        const existingIds = new Set(current.map((message) => message.id));
        return [...current, ...nextPage.filter((message) => !existingIds.has(message.id))];
      });
      setHasMoreMessages(nextPage.length === 50);
    } catch {
      if (sessionUserRef.current === userId) setMessagesError('More messages could not be loaded. Please retry.');
      reportDiagnostic('inbox_load_failed');
    } finally {
      if (sessionUserRef.current === userId) setMessagesLoading(false);
    }
  };

  const resetToDefaults = () => {
    setProfileState(getPublishedDefault('profile'));
    setSiteSettings(getPublishedDefault('siteSettings'));
    setProjects(getPublishedDefault('projects'));
    setExperiences(getPublishedDefault('experiences'));
    setSkills(getPublishedDefault('skills'));
    setSkillCategories(getPublishedDefault('skillCategories'));
    setToolsList(getPublishedDefault('toolsList'));
    setTechStack(getPublishedDefault('techStack'));
    setCurrentlyLearning(getPublishedDefault('currentlyLearning'));
    setAchievements(getPublishedDefault('achievements'));
    setCertificates(getPublishedDefault('certificates'));
    setBlogPosts(getPublishedDefault('blogPosts'));
    setResearchPapers(getPublishedDefault('researchPapers'));
    setGallery(getPublishedDefault('gallery'));
    setProjectCategories(getPublishedDefault('projectCategories'));
    setCertificateCategories(getPublishedDefault('certificateCategories'));
    setBlogCategories(getPublishedDefault('blogCategories'));
  };

  const exportDataJSON = async () => {
    const inbox = isSupabaseConfigured
      ? session?.mode === 'supabase' && session.isAdmin ? await loadAllContactMessages(session.accessToken) : (() => { throw new Error('Sign in to export the hosted inbox.'); })()
      : messages;
    const bundle = {
      schemaVersion: 1,
      profile,
      siteSettings,
      projects,
      experiences,
      skills,
      skillCategories,
      toolsList,
      techStack,
      currentlyLearning,
      achievements,
      certificates,
      blogPosts,
      researchPapers,
      gallery,
      messages: inbox,
      projectCategories,
      certificateCategories,
      blogCategories,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(bundle, null, 2);
  };

  const exportPublicDataJSON = () => {
    const bundle = {
      schemaVersion: 1,
      profile,
      siteSettings,
      projects,
      experiences,
      skills,
      skillCategories,
      toolsList,
      techStack,
      currentlyLearning,
      achievements,
      certificates,
      blogPosts,
      researchPapers,
      gallery,
      messages: [],
      projectCategories,
      certificateCategories,
      blogCategories,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(bundle, null, 2);
  };

  const importDataJSON = async (json: string): Promise<boolean> => {
    if (restoreInProgressRef.current) throw new Error('A restore is already in progress. Wait for it to finish.');
    if (pendingMessageIdsRef.current.size) throw new Error('Wait for the current inbox action to finish before restoring.');
    let ownsRestoreLock = false;
    const restoreUserId = session?.mode === 'supabase' ? session.userId : null;
    try {
      let parsed;
      try { parsed = parseBackupJSON(json); } catch { return false; }
      const data = parsed as unknown as {
        profile: UserProfile; siteSettings: SiteContentSettings; projects: Project[]; experiences: Experience[];
        skills: Skill[]; skillCategories: SkillCategoryGroup[]; toolsList: ToolItem[]; techStack: TechStackItem[];
        currentlyLearning: CurrentlyLearningItem[]; achievements: Achievement[]; certificates: Certificate[];
        blogPosts: BlogPost[]; researchPapers: ResearchPaper[]; gallery: GalleryItem[]; messages: ContactMessage[];
        projectCategories: string[]; certificateCategories: string[]; blogCategories: string[];
      };
      ownsRestoreLock = true;
      restoreInProgressRef.current = true;
      setRestoreInProgress(true);
      if (isSupabaseConfigured) {
        if (session?.mode !== 'supabase' || !session.isAdmin) throw new Error('Sign in before restoring hosted data.');
        if (cloudContentState === 'loading' || cloudContentState === 'conflict') throw new Error('Reload hosted content before restoring.');
        setCloudContentState('saving');
        await cloudSaveQueueRef.current.catch(() => undefined);
        if (sessionUserRef.current !== restoreUserId) throw new Error('The administrator changed. Sign in again before restoring.');
        const { messages: _messages, exportedAt: _exportedAt, ...payload } = parsed;
        const version = await restorePortfolioBackup(payload, data.messages, cloudContentVersionRef.current, session.accessToken);
        // The request may finish after sign-out. Do not inject old-session
        // inbox state into the next account's mounted workspace.
        if (sessionUserRef.current !== restoreUserId) return true;
        cloudContentVersionRef.current = version;
        lastSyncedContentFingerprintRef.current = JSON.stringify(payload);
        publishedContentRef.current = payload;
        setPublishedContent(payload);
        setHasPublishedContent(true);
        if (draftKey) {
          try {
            localStorage.removeItem(draftKey);
            setRecoverableDraft(null); setHasUnreadableDraft(false); setDraftStorageError('');
          } catch {
            setHasUnreadableDraft(true);
            setDraftStorageError('Restore succeeded, but the previous browser draft could not be cleared. Export or discard it before editing.');
          }
        }
        setLastContentSyncAt(new Date().toISOString());
        setContentSyncError('');
        setCloudContentState('ready');
        // Rebuild the first-page cursor after the merge; backup messages may be
        // interleaved with newer messages absent from this file.
        await refreshMessages();
        if (sessionUserRef.current !== restoreUserId) return true;
      }
      setProfileState(data.profile);
      setSiteSettings(data.siteSettings);
      setProjects(data.projects);
      setExperiences(data.experiences);
      setSkills(data.skills);
      setSkillCategories(data.skillCategories);
      setToolsList(data.toolsList);
      setTechStack(data.techStack);
      setCurrentlyLearning(data.currentlyLearning);
      setAchievements(data.achievements);
      setCertificates(data.certificates);
      setBlogPosts(data.blogPosts);
      setResearchPapers(data.researchPapers);
      setGallery(data.gallery);
      if (!isSupabaseConfigured) setMessages(current => mergeBackupMessages(current, data.messages));
      setProjectCategories(data.projectCategories);
      setCertificateCategories(data.certificateCategories);
      setBlogCategories(data.blogCategories);
      return true;
    } catch (error) {
      if (isSupabaseConfigured && sessionUserRef.current === restoreUserId) {
        setCloudContentState('failed');
        const reference = reportDiagnostic('content_restore_failed');
        setContentSyncError(`Restore could not be confirmed. Export your draft and reload before retrying. Reference: ${reference}`);
      }
      throw error;
    } finally {
      if (ownsRestoreLock) {
        restoreInProgressRef.current = false;
        setRestoreInProgress(false);
      }
    }
  };

  const editorValue: DataContextType = {
        replaceContentSlice,
        profile,
        updateProfile,
        siteSettings,
        updateSiteSettings,
        registerMediaMetadata,
        projects,
        addProject,
        updateProject,
        deleteProject,
        experiences,
        addExperience,
        updateExperience,
        deleteExperience,
        skills,
        addSkill,
        updateSkill,
        deleteSkill,
        skillCategories,
        addSkillCategory,
        updateSkillCategory,
        deleteSkillCategory,
        addSkillToCategory,
        updateSkillInCategory,
        deleteSkillFromCategory,
        toolsList,
        addTool,
        deleteTool,
        updateToolsList,
        reorderTools,
        techStack,
        addTechStackItem,
        updateTechStackItem,
        deleteTechStackItem,
        reorderTechStack,
        currentlyLearning,
        addCurrentlyLearning,
        updateCurrentlyLearningItem,
        deleteCurrentlyLearning,
        updateCurrentlyLearning,
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
        reorderProjects,
        reorderCertificates,
        reorderSkillCategories,
        reorderSkillsInCategory,
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
        addMessage,
        toggleMessageStatus,
        updateMessageStatus,
        markAllMessagesAsRead,
        deleteMessage,
        refreshMessages,
        loadMoreMessages,
        messagesLoading,
        messagesError,
        hasMoreMessages,
        pendingMessageIds, retryMessageMutation,
        contentSyncState: cloudContentState,
        contentEditingBlocked: restoreInProgress || (isSupabaseConfigured && (!hasPublishedContent || !!recoverableDraft || hasUnreadableDraft)),
        contentSyncError,
        lastContentSyncAt,
        retryContentSync,
        saveAllChanges,
        recoverableDraft, draftStorageError, recoverDraft, discardDraft, exportDraftJSON, draftRecoveryRequired: !!recoverableDraft || hasUnreadableDraft,
        resetToDefaults,
        exportDataJSON,
        exportPublicDataJSON,
        importDataJSON,
        activeModalProject,
        setActiveModalProject,
        activeModalCert,
        setActiveModalCert,
        activeModalBlog,
        setActiveModalBlog,
        currentContent,
        publishedContent,

  };
  const stableActions = useStableActions({ replaceContentSlice, updateProfile, updateSiteSettings, registerMediaMetadata, addProject, updateProject, deleteProject, addExperience, updateExperience, deleteExperience, addSkill, updateSkill, deleteSkill, addSkillCategory, updateSkillCategory, deleteSkillCategory, addSkillToCategory, updateSkillInCategory, deleteSkillFromCategory, addTool, deleteTool, updateToolsList, reorderTools, addTechStackItem, updateTechStackItem, deleteTechStackItem, reorderTechStack, addCurrentlyLearning, updateCurrentlyLearningItem, deleteCurrentlyLearning, updateCurrentlyLearning, reorderCurrentlyLearning, addAchievement, updateAchievement, deleteAchievement, reorderAchievements, addCertificate, updateCertificate, deleteCertificate, reorderProjects, reorderCertificates, reorderSkillCategories, reorderSkillsInCategory, addProjectCategory, updateProjectCategory, deleteProjectCategory, reorderProjectCategories, addCertificateCategory, updateCertificateCategory, deleteCertificateCategory, reorderCertificateCategories, addBlogCategory, updateBlogCategory, deleteBlogCategory, reorderBlogCategories, addBlogPost, updateBlogPost, deleteBlogPost, addResearchPaper, updateResearchPaper, deleteResearchPaper, addGalleryItem, updateGalleryItem, deleteGalleryItem, addMessage, toggleMessageStatus, updateMessageStatus, markAllMessagesAsRead, deleteMessage, refreshMessages, loadMoreMessages, retryMessageMutation, retryContentSync, saveAllChanges, recoverDraft, discardDraft, exportDraftJSON, resetToDefaults, exportDataJSON, exportPublicDataJSON, importDataJSON, setActiveModalProject, setActiveModalCert, setActiveModalBlog });
  const syncValue = useMemo(() => ({ contentSyncState: cloudContentState, contentSyncError, lastContentSyncAt,
    recoverableDraft, draftStorageError, draftRecoveryRequired: !!recoverableDraft || hasUnreadableDraft,
    contentEditingBlocked: restoreInProgress || (isSupabaseConfigured && (!hasPublishedContent || !!recoverableDraft || hasUnreadableDraft)),
    retryContentSync: stableActions.retryContentSync, recoverDraft: stableActions.recoverDraft,
    discardDraft: stableActions.discardDraft, exportDraftJSON: stableActions.exportDraftJSON }),
    [cloudContentState, contentSyncError, lastContentSyncAt, recoverableDraft, hasUnreadableDraft, hasPublishedContent, draftStorageError, stableActions, restoreInProgress]);
  const inboxValue = useMemo(() => ({ messages, messagesLoading, messagesError, hasMoreMessages, pendingMessageIds,
    retryMessageMutation: stableActions.retryMessageMutation, refreshMessages: stableActions.refreshMessages,
    loadMoreMessages: stableActions.loadMoreMessages, updateMessageStatus: stableActions.updateMessageStatus,
    deleteMessage: stableActions.deleteMessage, markAllMessagesAsRead: stableActions.markAllMessagesAsRead }),
    [messages, messagesLoading, messagesError, hasMoreMessages, pendingMessageIds, stableActions]);
  return (
    <DataContext.Provider value={editorValue}>
      <EditorActionsContext.Provider value={stableActions}>
        <ContentSyncContext.Provider value={syncValue}>
          <InboxContext.Provider value={inboxValue}>
      <ContentStatusContext.Provider value={cloudContentState}>
        <ModalActionsContext.Provider value={modalActions}>
          <ModalStateContext.Provider value={modalState}>
            {CONTENT_KEYS.reduceRight((tree, key) => {
              const SliceProvider = ContentSliceContexts[key].Provider;
              return <SliceProvider key={key} value={currentContent[key]}>{tree}</SliceProvider>;
            }, children)}
          </ModalStateContext.Provider>
        </ModalActionsContext.Provider>
      </ContentStatusContext.Provider>
          </InboxContext.Provider>
        </ContentSyncContext.Provider>
      </EditorActionsContext.Provider>
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};


export const useOptionalData = () => useContext(DataContext);
