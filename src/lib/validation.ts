import { z } from 'zod';
import { normalizeLegacyContent } from './contentCompatibility';

const text = (max: number) => z.string().trim().max(max);
const requiredText = (max: number) => text(max).min(1);
const id = requiredText(160).regex(/^[a-zA-Z0-9_-]+$/, 'Use letters, numbers, underscores, or hyphens for identifiers.');
const percentage = z.number().finite().min(0).max(100);
const count = z.number().finite().min(0);
const uniqueRecords = <T extends z.ZodType>(schema: T, maximum: number, fields = ['id'], legacyIdentity?: string) =>
  z.array(schema).max(maximum).superRefine((items, context) => {
    for (const field of fields) {
      const seen = new Set<unknown>();
      items.forEach((item, index) => {
        const record = item as Record<string, unknown>;
        const value = record[field] ?? (legacyIdentity ? record[legacyIdentity] : undefined);
        if (value === undefined) return;
        if (seen.has(value)) context.addIssue({ code: 'custom', path: [index, field], message: `Each ${field} must be unique.` });
        seen.add(value);
      });
    }
  });
const link = text(4_096).refine((value) => {
  if (!value || /^\/(?![/\\])/.test(value)) return true;
  try {
    const protocol = new URL(value).protocol;
    return protocol === 'https:' || protocol === 'http:' || protocol === 'mailto:';
  } catch {
    return false;
  }
}, 'Link must be empty, site-relative, or use http, https, or mailto.');
const mediaLink = text(2_000_000).refine((value) => (
  !value
  || /^\/(?![/\\])/.test(value)
  || value.startsWith('data:image/')
  || value.startsWith('data:application/pdf')
  || /^https?:\/\//i.test(value)
), 'Media must be empty, site-relative, an image/PDF data URL, or use http/https.');
const iconReference = z.union([mediaLink, text(160).regex(/^[A-Za-z][A-Za-z0-9_-]*$|^\p{Extended_Pictographic}[\p{Extended_Pictographic}\uFE0F\u200D]*$/u)]);

export const contactPayloadSchema = z.object({
  name: text(150).min(1, 'Name is required.'),
  email: z.string().trim().email('Enter a valid email address.').max(254),
  subject: text(255).optional().default(''),
  service: text(100).optional().default('General inquiry'),
  message: text(5_000).min(1, 'Message is required.'),
}).strict();

const projectSchema = z.object({
  id, title: requiredText(240), category: requiredText(100), description: text(2_000),
  categories: z.array(requiredText(100)).max(20).optional(),
  longDescription: text(20_000).optional(), image: mediaLink,
  technologies: z.array(text(100)).max(100), metrics: z.array(text(300)).max(100),
  githubUrl: link.optional(), liveUrl: link.optional(), showGithub: z.boolean().optional(),
  showLive: z.boolean().optional(), featured: z.boolean(), flagship: z.boolean().optional(),
  homeShowcase: z.boolean().optional(), date: text(100), keyFeatures: z.array(text(500)).max(100).optional(),
  order: z.number().int().finite().optional(),
}).strict();

const experienceSchema = z.object({
  id, title: requiredText(240), company: requiredText(240), location: text(240), period: text(160),
  type: text(100).optional(), logo: iconReference, summary: text(5_000),
  responsibilities: z.array(text(1_000)).max(100), achievements: z.array(text(1_000)).max(100),
  technologies: z.array(text(100)).max(100),
}).strict();

const skillSchema = z.object({
  id, name: requiredText(160), category: requiredText(100), level: percentage,
  proficiency: requiredText(100), years: count, projectsCount: count, iconName: text(160),
}).strict();

const skillItemSchema = z.object({
  name: requiredText(160), level: percentage.optional(), proficiency: z.union([percentage, requiredText(100)]),
}).strict();

const skillCategorySchema = z.object({
  id, title: requiredText(160), category: text(100).optional(), iconName: text(160).optional(),
  icon: text(160).optional(), proficiency: percentage.optional(), skills: z.array(skillItemSchema).max(200),
}).strict();

const toolSchema = z.object({ id: id.optional(), name: requiredText(160), icon: text(160), category: text(100).optional() }).strict();
const techStackSchema = z.object({
  id, name: requiredText(160), icon: text(160), color: text(40).optional(), category: text(100).optional(),
}).strict();
const currentlyLearningSchema = z.object({
  id, title: requiredText(240), topic: text(240).optional(), icon: text(160), description: text(2_000),
  progress: percentage.optional(), status: requiredText(100),
}).strict();
const achievementSchema = z.object({
  id, title: requiredText(240), organization: text(240), year: text(40), category: requiredText(100),
  description: text(5_000), badge: iconReference, link: link.optional(),
}).strict();
const certificateSchema = z.object({
  id, title: requiredText(240), issuer: requiredText(240), date: text(100), credentialId: text(240),
  verificationUrl: link, category: requiredText(100), logo: iconReference, image: mediaLink.optional(), pdfUrl: link.optional(),
}).strict();
const blogPostSchema = z.object({
  id, title: requiredText(300), slug: requiredText(240).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: text(3_000), content: text(100_000), category: requiredText(100), readTime: text(100),
  publishedAt: text(100), tags: z.array(text(100)).max(100), image: mediaLink, featured: z.boolean().optional(),
}).strict();
const researchPaperSchema = z.object({
  id, title: requiredText(500), venue: text(300), year: text(40), authors: z.array(text(240)).max(100),
  abstract: text(20_000), pdfUrl: link.optional(), paperUrl: link.optional(), doi: text(300),
  citations: z.number().int().min(0), readTime: text(100).optional(), date: text(100).optional(),
  category: text(100).optional(), image: mediaLink.optional(), keywords: z.array(text(100)).max(100).optional(),
}).strict();
const galleryItemSchema = z.object({
  id, title: requiredText(240), category: requiredText(100), imageUrl: mediaLink,
  description: text(3_000),
}).strict();
const contactMessageSchema = z.object({
  id, name: requiredText(150), email: z.string().trim().email().max(254), subject: text(255),
  service: text(100), message: requiredText(5_000), createdAt: text(100).optional(),
  timestamp: text(100).optional(), status: z.enum(['unread', 'read', 'replied']),
}).strict();

const profileSchema = z.object({
  name: requiredText(240), title: text(240).optional(), greeting: text(500), titles: z.array(text(240)).max(30),
  bio: text(5_000), avatarUrl: mediaLink.optional(), aboutPhotoUrl: mediaLink.optional(), location: text(300),
  availabilityStatus: text(160), responseTime: text(160), aboutText: z.array(text(10_000)).max(50),
  education: z.array(z.object({
    degree: text(300), school: text(300).optional(), institution: text(300).optional(), year: text(100).optional(),
    period: text(100).optional(), gpa: text(100).optional(), grade: text(100).optional(),
  }).strict()).max(30).optional(),
  stats: z.object({
    projects: count, certificates: count, technologies: count, repos: count, experienceYears: count,
  }).strict(),
  socials: z.object({
    github: link, linkedin: link, twitter: link, instagram: link.optional(),
    email: z.string().trim().email().max(254), kaggle: link.optional(), leetcode: link.optional(),
  }).strict(),
  resumeUrl: link, resumePdf: mediaLink.optional(), resumeFileName: text(300).optional(),
}).strict();

const navigationLink = z.object({ name: requiredText(160), path: link.refine((value) => value.startsWith('/') && !value.startsWith('//'), 'Use a local page path.') }).strict();
export const websiteSettingsSchema = z.object({
  brandName: text(100), brandSuffix: text(100), brandSymbol: text(100),
  faviconUrl: mediaLink, seoKeywords: text(2_000),
  footerDescription: text(5_000), footerCredit: text(500),
  navigation: z.array(navigationLink).max(20), footerLinks: z.array(navigationLink).max(30),
  homeSections: z.array(z.enum(['hero', 'about', 'projects', 'experience', 'skills', 'certificates', 'contact'])).max(7)
    .refine((items) => new Set(items).size === items.length, 'Each home section can appear only once.'),
  homeDomains: z.array(z.object({ title: text(300), desc: text(2_000), icon: iconReference }).strict()).max(50),
  contactServices: z.array(requiredText(100)).min(1).max(30)
    .refine((items) => new Set(items.map((item) => item.toLowerCase())).size === items.length, 'Contact services must be unique.'),
  callsToAction: z.record(z.string(), z.object({ badge: text(300), title: text(500), description: text(5_000), primaryBtnText: text(160), primaryBtnPath: link, secondaryBtnText: text(160), secondaryBtnPath: link }).strict()),
  seo: z.record(z.string(), z.object({ title: text(500), description: text(5_000), image: mediaLink }).strict()),
  copy: z.record(z.string(), text(100_000)), images: z.record(z.string(), mediaLink),
  media: z.record(z.string(), z.object({ width: z.number().int().min(1).max(16_384), height: z.number().int().min(1).max(16_384), small: mediaLink }).strict())
    .refine(items => Object.keys(items).length <= 1_000, 'Keep at most 1,000 image metadata entries.').optional(),
}).strict();

const siteSettingsSchema = z.object({
  website: websiteSettingsSchema.optional(),
  primaryColor: z.string().regex(/^#[0-9a-f]{6}$/i), themeMode: z.enum(['dark', 'light', 'system']),
  heroHeading: text(500), heroRole: text(500), heroDescription: text(5_000), aboutIntro: text(5_000),
  aboutDrivesMe: z.array(z.object({ title: text(300), desc: text(2_000), icon: text(160) }).strict()).max(50).optional(),
  aboutJourney: z.array(z.object({ period: text(160), title: text(300), company: text(300), description: text(3_000) }).strict()).max(100).optional(),
  education: z.object({
    degree: text(300), field: text(300), institution: text(300), period: text(160), location: text(300),
    coursework: z.array(text(300)).max(100),
  }).strict(),
  funFacts: z.array(text(1_000)).max(100),
  techLove: z.array(z.object({ name: text(160), icon: text(160) }).strict()).max(100),
  experienceHighlights: z.union([
    z.array(text(1_000)).max(100),
    z.object({
      yearsExp: text(100), organizations: text(100), projectsDelivered: text(100),
      clientSatisfaction: text(100), coreStrengths: z.array(text(300)).max(100),
    }).strict(),
  ]),
  contactInfo: z.object({
    email: z.string().trim().email().max(254), phone: text(100), location: text(300), responseTime: text(160),
  }).strict(),
  faqs: z.array(z.object({
    q: text(1_000).optional(), a: text(5_000).optional(),
    question: text(1_000).optional(), answer: text(5_000).optional(),
  }).strict().refine((item) => Boolean((item.q || item.question)?.trim() && (item.a || item.answer)?.trim()), 'A FAQ needs a question and an answer.')).max(100),
  pageHeaders: z.record(z.string(), z.object({
    eyebrow: text(300), title: text(500), subtitle: text(2_000),
  }).strict()).optional(),
}).strict();

export const contentSliceSchemas = {
  profile: profileSchema, siteSettings: siteSettingsSchema, projects: uniqueRecords(projectSchema, 200),
  experiences: uniqueRecords(experienceSchema, 200), skills: uniqueRecords(skillSchema, 300),
  skillCategories: uniqueRecords(skillCategorySchema, 100), toolsList: uniqueRecords(toolSchema, 300, ['id'], 'name'),
  techStack: uniqueRecords(techStackSchema, 300), currentlyLearning: uniqueRecords(currentlyLearningSchema, 100),
  achievements: uniqueRecords(achievementSchema, 200), certificates: uniqueRecords(certificateSchema, 300),
  blogPosts: uniqueRecords(blogPostSchema, 300, ['id', 'slug']), researchPapers: uniqueRecords(researchPaperSchema, 300),
  gallery: uniqueRecords(galleryItemSchema, 300).default([]),
  messages: uniqueRecords(contactMessageSchema, 100_000), projectCategories: z.array(text(100)).max(100),
  certificateCategories: z.array(text(100)).max(100), blogCategories: z.array(text(100)).max(100),
} as const;

const publicContentShape = {
  schemaVersion: z.literal(1), profile: profileSchema, siteSettings: siteSettingsSchema,
  projects: contentSliceSchemas.projects, experiences: contentSliceSchemas.experiences, skills: contentSliceSchemas.skills,
  skillCategories: contentSliceSchemas.skillCategories, toolsList: contentSliceSchemas.toolsList,
  techStack: contentSliceSchemas.techStack, currentlyLearning: contentSliceSchemas.currentlyLearning,
  achievements: contentSliceSchemas.achievements, certificates: contentSliceSchemas.certificates,
  blogPosts: contentSliceSchemas.blogPosts, researchPapers: contentSliceSchemas.researchPapers,
  gallery: contentSliceSchemas.gallery,
  projectCategories: contentSliceSchemas.projectCategories, certificateCategories: contentSliceSchemas.certificateCategories,
  blogCategories: contentSliceSchemas.blogCategories,
};

export const publishedContentSchema = z.preprocess(normalizeLegacyContent, z.object(publicContentShape).strict());
export const backupSchema = z.preprocess(normalizeLegacyContent, z.object({
  ...publicContentShape, messages: contentSliceSchemas.messages, exportedAt: z.string().datetime(),
}).strict());

export class PublishedContentValidationError extends Error {
  constructor(public readonly issues: z.core.$ZodIssue[]) {
    const firstIssue = issues[0];
    const location = firstIssue?.path.length ? firstIssue.path.join('.') : 'document';
    super(firstIssue ? `Invalid content at ${location}: ${firstIssue.message}` : 'Published content is invalid.');
    this.name = 'PublishedContentValidationError';
  }
}

export const validatePublishedContent = (candidate: unknown): ValidatedPublishedContent => {
  const result = publishedContentSchema.safeParse(candidate);
  if (!result.success) throw new PublishedContentValidationError(result.error.issues);
  return result.data;
};

export type ValidatedPublishedContent = z.infer<typeof publishedContentSchema>;
export type ValidatedBackup = z.infer<typeof backupSchema>;
