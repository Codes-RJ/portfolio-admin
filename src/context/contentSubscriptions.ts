import { createContext, useContext, type Context } from 'react';
import type { ValidatedPublishedContent } from '../lib/validation';
import type { Project, Certificate, BlogPost } from '../data/initialData';

export type ContentKey = Exclude<keyof ValidatedPublishedContent, 'schemaVersion'>;
export const CONTENT_KEYS: ContentKey[] = ['profile', 'siteSettings', 'projects', 'experiences', 'skills',
  'skillCategories', 'toolsList', 'techStack', 'currentlyLearning', 'achievements', 'certificates',
  'blogPosts', 'researchPapers', 'gallery', 'projectCategories', 'certificateCategories', 'blogCategories'];
export const ContentSliceContexts = Object.fromEntries(CONTENT_KEYS.map(key => [key, createContext<unknown>(undefined)])) as Record<ContentKey, Context<unknown>>;
export const ContentStatusContext = createContext('local');
export const PublishedAvailabilityContext = createContext(true);
export const ModalStateContext = createContext<{ activeModalProject: Project | null; activeModalCert: Certificate | null; activeModalBlog: BlogPost | null } | null>(null);
export const ModalActionsContext = createContext<{
  setActiveModalProject: (value: Project | null) => void;
  setActiveModalCert: (value: Certificate | null) => void;
  setActiveModalBlog: (value: BlogPost | null) => void;
} | null>(null);

export function useContentSlice<K extends ContentKey>(key: K): ValidatedPublishedContent[K] {
  const content = useContext(ContentSliceContexts[key]);
  if (content === undefined) throw new Error('Content must be read within a DataProvider.');
  return content as ValidatedPublishedContent[K];
}
export function useOptionalContentSlice<K extends ContentKey>(key: K) {
  return useContext(ContentSliceContexts[key]) as ValidatedPublishedContent[K] | undefined;
}
export const useContentStatus = () => useContext(ContentStatusContext);
export const usePublishedAvailability = () => useContext(PublishedAvailabilityContext);
export function useModalState() {
  const value = useContext(ModalStateContext); if (!value) throw new Error('Modals require a DataProvider.'); return value;
}
export function useModalActions() {
  const value = useContext(ModalActionsContext); if (!value) throw new Error('Modals require a DataProvider.'); return value;
}
