import { SiteText } from '../components/ui/SiteText';
import { ResponsiveImage } from '../components/ui/ResponsiveImage';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { useContentSlice, useContentStatus } from '../context/contentSubscriptions';
import { getProjectCategories } from '../utils/projectCategories';
import { ContentAvailability } from '../components/ui/ContentAvailability';

export const ProjectDetailPage: React.FC = () => {
  const { projectId = '' } = useParams();
  const projects = useContentSlice('projects');
  const contentSyncState = useContentStatus();
  const project = projects.find((item) => item.id === projectId);

  if (!project && contentSyncState === 'loading') return <ContentAvailability state="loading" backTo="/projects" />;
  if (!project && ['failed', 'invalid', 'missing'].includes(contentSyncState)) return <ContentAvailability state="unavailable" backTo="/projects" />;

  if (!project) return <div className="pt-32 pb-20 max-w-3xl mx-auto px-4"><h1 className="text-3xl font-bold"><SiteText id="ProjectDetailPage.758e8416eb8a">{"Project not found"}</SiteText></h1><Link to="/projects" className="mt-6 inline-flex text-[var(--color-primary)]"><SiteText id="ProjectDetailPage.d9088c8aee01">{"Back to projects"}</SiteText></Link></div>;

  return (
    <article className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]"><ArrowLeft className="w-4 h-4" /><SiteText id="ProjectDetailPage.4b87271b6b81">{"All projects"}</SiteText></Link>
      {project.image && <ResponsiveImage src={project.image} alt="" sizes="(max-width: 1024px) 92vw, 960px" className="w-full max-h-[520px] object-cover rounded-3xl border border-gray-200 dark:border-gray-800" />}
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {getProjectCategories(project).map((category) => <span key={category} className="rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">{category}</span>)}
          <span className="text-sm font-mono text-gray-500">{project.date}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">{project.title}</h1>
        <p className="text-base leading-8 text-gray-600 dark:text-gray-300">{project.longDescription || project.description}</p>
      </header>
      {project.keyFeatures?.length ? <section><h2 className="text-xl font-bold mb-3"><SiteText id="ProjectDetailPage.14e1eef6fb45">{"Key features"}</SiteText></h2><ul className="list-disc pl-6 space-y-2">{project.keyFeatures.map((feature) => <li key={feature}>{feature}</li>)}</ul></section> : null}
      <div className="flex flex-wrap gap-2">{project.technologies.map((technology) => <span key={technology} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-sm">{technology}</span>)}</div>
      <div className="flex flex-wrap gap-3">
        {project.githubUrl && project.showGithub !== false && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white"><Github className="w-4 h-4" /><SiteText id="ProjectDetailPage.0e570ca6fabe">{"Source"}</SiteText></a>}
        {project.liveUrl && project.showLive !== false && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white"><SiteText id="ProjectDetailPage.8e4af10c42ca">{"Live project"}</SiteText><ExternalLink className="w-4 h-4" /></a>}
      </div>
    </article>
  );
};
