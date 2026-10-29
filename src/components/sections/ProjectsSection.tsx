import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ExternalLink, Github } from 'lucide-react';
import { useContentSlice } from '../../context/contentSubscriptions';
import { getProjectCategories } from '../../utils/projectCategories';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { SiteText } from '../ui/SiteText';

/** The homepage is a selection; searching and the complete collection live on /projects. */
export function ProjectsSection() {
  const projects = useContentSlice('projects');
  const flagship = projects.find(project => project.flagship) || projects.find(project => project.featured) || projects[0];
  const candidates = projects.filter(project => project.id !== flagship?.id);
  const selected = flagship ? [flagship, ...candidates.filter(project => project.homeShowcase || project.featured), ...candidates.filter(project => !project.homeShowcase && !project.featured)].slice(0, 3) : [];

  return <section id="home-projects" className="selected-work-section">
    <div className="home-section-wrap">
      <div className="selected-work-heading"><div><span className="section-kicker"><SiteText id="ProjectsSection.6284abe7d04a">{"01 / SELECTED WORK"}</SiteText></span><h2><SiteText id="ProjectsSection.578b64b8e219">{"A few things I've built."}</SiteText></h2></div><p><SiteText id="ProjectsSection.1a1931e15444">{"Different challenges."}</SiteText><br /><SiteText id="ProjectsSection.95d5e8d59b26">{"The same attention to detail."}</SiteText></p></div>
      {selected.length ? <div className="selected-work-grid">{selected.map((project, index) => <article key={project.id} className={`selected-work-card ${index === 0 ? 'selected-work-card--lead' : ''}`}>
        <Link to={`/projects/${project.id}`} className="selected-work-image" tabIndex={-1} aria-hidden="true"><ResponsiveImage src={project.image} alt="" width={960} height={600} loading="lazy" decoding="async" sizes={index === 0 ? '(max-width: 767px) 92vw, 90vw' : '(max-width: 767px) 92vw, 45vw'} /><span className="selected-work-index">0{index + 1}</span><span className="selected-work-image-arrow"><ArrowUpRight size={26} /></span></Link>
        <div className="selected-work-copy"><div className="selected-work-meta"><span>{getProjectCategories(project).join(' / ')}</span><span>{project.date}</span></div><h3><Link to={`/projects/${project.id}`}>{project.title}</Link></h3><p>{project.description}</p><div className="selected-work-technologies">{project.technologies.slice(0, 4).map(technology => <span key={technology}>{technology}</span>)}</div><div className="selected-work-actions"><Link to={`/projects/${project.id}`} aria-label={`Read case study: ${project.title}`}><SiteText id={index === 0 ? 'ProjectsSection.ee20284f69b0' : 'ProjectsSection.01fd608d5cba'}>{'Read case study'}</SiteText><ArrowRight size={17} aria-hidden="true" /></Link><div>{project.githubUrl && project.showGithub !== false && <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label={`${project.title} GitHub repository`}><Github size={18} /></a>}{project.liveUrl && project.showLive !== false && <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`${project.title} live demo`}><ExternalLink size={18} /></a>}</div></div></div>
      </article>)}</div> : <p className="py-12 text-base text-gray-600 dark:text-gray-300"><SiteText id="ProjectsSection.28419bb3a762">{'New case studies are being prepared. Check back soon for project details, source links, and live demonstrations.'}</SiteText></p>}
      <div className="selected-work-footer"><span>{projects.length}<SiteText id="ProjectsSection.939391315372">{" projects. Plenty of curiosity."}</SiteText></span><Link to="/projects"><SiteText id="ProjectsSection.9a92a27a2688">{'Explore all projects'}</SiteText><ArrowUpRight size={20} aria-hidden="true" /></Link></div>
    </div>
  </section>;
}
