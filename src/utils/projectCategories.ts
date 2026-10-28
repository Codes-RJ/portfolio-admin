import type { Project } from '../data/initialData';

export const normalizeProjectCategories = (
  primaryCategory: string,
  categories: string[] = [],
): string[] => Array.from(
  new Set([primaryCategory, ...categories].map((category) => category.trim()).filter(Boolean)),
);

export const getProjectCategories = (
  project: Pick<Project, 'category' | 'categories'>,
): string[] => normalizeProjectCategories(project.category, project.categories);
