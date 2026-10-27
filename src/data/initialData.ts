import { contentDefaults } from './contentDefaults';
import type { ValidatedPublishedContent, ValidatedBackup } from '../lib/validation';

export type Project = ValidatedPublishedContent['projects'][number];

export type Experience = ValidatedPublishedContent['experiences'][number];

export type SkillItem = SkillCategoryGroup['skills'][number];

export type SkillCategoryGroup = ValidatedPublishedContent['skillCategories'][number];

export type ToolItem = ValidatedPublishedContent['toolsList'][number];

export type CurrentlyLearningItem = ValidatedPublishedContent['currentlyLearning'][number];

export type Skill = ValidatedPublishedContent['skills'][number];

export interface TechItem {
  id: string;
  name: string;
  category: 'Languages' | 'Frontend' | 'Backend' | 'AI / ML' | 'Databases' | 'Cloud & DevOps' | string;
  icon: string;
  description: string;
}

export type TechStackItem = ValidatedPublishedContent['techStack'][number];

export type Achievement = ValidatedPublishedContent['achievements'][number];

export type Certificate = ValidatedPublishedContent['certificates'][number];

export type BlogPost = ValidatedPublishedContent['blogPosts'][number];

export type ResearchPaper = ValidatedPublishedContent['researchPapers'][number];

export type GalleryItem = ValidatedPublishedContent['gallery'][number];

export type ContactMessage = ValidatedBackup['messages'][number];

export type SiteContentSettings = ValidatedPublishedContent['siteSettings'];

export const defaultPageHeaders = {
  about: {
    eyebrow: '// get to know me',
    title: 'Engineering with Purpose, Precision & Passion',
    subtitle: 'A closer look at my engineering approach, career path, and the ideas that guide my work.'
  },
  projects: {
    eyebrow: '// my creations',
    title: 'Featured Projects & Technical Works',
    subtitle: 'A comprehensive catalog of full-stack web applications, machine learning diagnostics, edge IoT networks, and scalable open-source tools.'
  },
  skills: {
    eyebrow: '// what I bring to the table',
    title: 'My Technical Skills & Competencies',
    subtitle: 'A comprehensive, data-backed taxonomy of programming languages, frameworks, cloud platforms, system design methodologies, and tools I use to build production systems.'
  },
  experience: {
    eyebrow: '// career history & impact',
    title: 'Professional Experience & Career Narrative',
    subtitle: 'A comprehensive breakdown of roles, technical responsibilities, key business metrics delivered, and leadership contributions across high-impact engineering projects.'
  },
  certificates: {
    eyebrow: '// verified achievements',
    title: 'Professional Certifications & Credentials',
    subtitle: 'A verified portfolio of accredited certifications from leading technology providers and academic institutions including AWS, Google Cloud, Meta, Stanford, and DeepLearning.AI.'
  },
  blog: {
    eyebrow: '// my thoughts',
    title: 'Technical Articles & Engineering Insights',
    subtitle: 'In-depth explorations of modern software engineering, AI edge architectures, full-stack design patterns, and lessons learned building scalable systems.'
  },
  research: {
    eyebrow: '// explore. analyze. innovate.',
    title: 'Research Publications & Technical Preprints',
    subtitle: 'Peer-reviewed academic research in edge machine learning quantization, intelligent distributed architectures, computer vision for public safety, and real-time sensor fusion.'
  },
  contact: {
    eyebrow: '// get in touch',
    title: "Let's Connect & Build Together",
    subtitle: "Whether you have an inquiry about full-time software roles, engineering consulting, AI research collaboration, or open-source projects, I'd love to hear from you."
  }
} as const;

export type UserProfile = ValidatedPublishedContent['profile'];

export const initialProfile: UserProfile = contentDefaults.profile;

export const initialProjects: Project[] = contentDefaults.projects;

export const initialExperiences: Experience[] = contentDefaults.experiences;

export const initialSkillCategories: SkillCategoryGroup[] = contentDefaults.skillCategories;

export const initialToolsList: ToolItem[] = contentDefaults.toolsList;

export const initialTechStack: TechStackItem[] = contentDefaults.techStack;

export const initialCurrentlyLearning: CurrentlyLearningItem[] = contentDefaults.currentlyLearning;

export const initialRadarData: Array<{ subject: string; score: number; fullMark: number }> = [];

export const initialTopStrengths: Array<{ name: string; percentage: number }> = [];

export const initialSkills: Skill[] = contentDefaults.skills;

export const initialAchievements: Achievement[] = contentDefaults.achievements;

export const initialCertificates: Certificate[] = contentDefaults.certificates;

export const initialBlogPosts: BlogPost[] = contentDefaults.blogPosts;

export const initialResearchPapers: ResearchPaper[] = contentDefaults.researchPapers;

export const initialSiteSettings: SiteContentSettings = contentDefaults.siteSettings;

export const initialGallery: GalleryItem[] = contentDefaults.gallery;

export const initialMessages: ContactMessage[] = [];

export const initialProjectCategories: string[] = contentDefaults.projectCategories;

export const initialCertificateCategories: string[] = contentDefaults.certificateCategories;

export const initialBlogCategories: string[] = contentDefaults.blogCategories;

