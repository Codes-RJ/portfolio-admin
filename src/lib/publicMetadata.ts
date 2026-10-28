import { PUBLIC_ROUTE_METADATA, type RouteMetadata } from '../data/routeMetadata';
import type { ValidatedPublishedContent } from './validation';

export const publicMetadata = (content: Pick<ValidatedPublishedContent, 'profile' | 'siteSettings' | 'projects' | 'blogPosts'>): Record<string, RouteMetadata & { image?: string }> => {
  const website = content.siteSettings.website;
  const brand = website ? `${website.brandName}${website.brandSuffix}` : 'RohanOS';
  const metadata: Record<string, RouteMetadata & { image?: string }> = {
    ...Object.fromEntries(Object.entries(PUBLIC_ROUTE_METADATA).map(([route, page]) => [route, { ...page, title: page.title.replace(/RohanOS/g, brand) }])),
    '/': { title: `${content.profile.name} — Portfolio | ${brand}`, description: content.profile.bio },
    ...Object.fromEntries(content.projects.map((project) => [`/projects/${encodeURIComponent(project.id)}`, { title: `${project.title} | ${brand}`, description: project.description, image: project.image }])),
    ...Object.fromEntries(content.blogPosts.map((post) => [`/blog/${post.slug}`, { title: `${post.title} | ${brand}`, description: post.summary, image: post.image }])),
  };
  for (const [route, page] of Object.entries(metadata)) {
    const header = content.siteSettings.pageHeaders?.[route.slice(1)];
    if (header) { page.title = `${header.title} | ${brand}`; page.description = header.subtitle; }
    const override = website?.seo[route];
    if (override) {
      if (override.title) page.title = override.title;
      if (override.description) page.description = override.description;
      if (override.image) page.image = override.image;
    }
  }
  return metadata;
};
