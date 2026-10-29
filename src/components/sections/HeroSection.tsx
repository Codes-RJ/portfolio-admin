import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUpRight, FileText, Github, Linkedin, Mail } from 'lucide-react';
import { useContentSlice } from '../../context/contentSubscriptions';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { SiteText } from '../ui/SiteText';

export function HeroSection() {
  const profile = useContentSlice('profile');
  const projects = useContentSlice('projects');
  const settings = useContentSlice('siteSettings');
  const reducedMotion = usePrefersReducedMotion();
  const [titleIndex, setTitleIndex] = useState(0);
  const configuredTitles = profile.titles?.filter(title => title.trim()) || [];
  const titles = configuredTitles.length ? configuredTitles : [profile.title || 'Full Stack Engineer'];
  const selectedProject = projects.find(project => project.flagship) || projects.find(project => project.featured) || projects[0];
  const hasProjectsSection = !settings.website?.homeSections || settings.website.homeSections.includes('projects');

  useEffect(() => {
    if (titles.length < 2 || reducedMotion) return;
    const timer = window.setInterval(() => setTitleIndex(previous => (previous + 1) % titles.length), 4000);
    return () => window.clearInterval(timer);
  }, [titles.length, reducedMotion]);

  return <section className="hero-stage">
    <div className="hero-stage-grid" aria-hidden="true" />
    <div className="hero-stage-orbit" aria-hidden="true" />
    <div className="hero-stage-inner">
      <div className="hero-introduction">
        <div className="hero-availability"><span aria-hidden="true" />{profile.availabilityStatus}</div>
        <p className="hero-greeting">{profile.greeting}</p>
        <h1 className="hero-name">{profile.name}<span className="hero-name-dot" aria-hidden="true" /></h1>
        <div className="hero-role"><span className="hero-role-rule" aria-hidden="true" /><span key={reducedMotion ? 'static' : titleIndex} className={reducedMotion ? '' : 'hero-title-enter'}>{titles[titleIndex % titles.length]}</span></div>
        <p className="hero-description">{profile.bio}</p>
        <div className="hero-actions">
          <Link to="/projects" className="hero-primary-action"><SiteText id="HeroSection.95e83f6af248">{'Explore Projects'}</SiteText><span aria-hidden="true"><ArrowUpRight size={20} /></span></Link>
          <Link to="/resume" className="hero-secondary-action"><FileText size={18} aria-hidden="true" /><SiteText id="HeroSection.8b91ec601d3b">{'View resume'}</SiteText></Link>
        </div>
        <div className="hero-socials">
          <span className="hero-social-label"><SiteText id="HeroSection.bfd49ac7b3c6">{"Find me on"}</SiteText></span>
          {profile.socials.github && <a href={profile.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub profile"><Github size={18} /></a>}
          {profile.socials.linkedin && <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile"><Linkedin size={18} /></a>}
          {profile.socials.email && <a href={`mailto:${profile.socials.email}`} aria-label="Send an email"><Mail size={18} /></a>}
        </div>
      </div>
      <div className="hero-art">
        <div className="hero-art-caption" aria-hidden="true"><span><SiteText id="HeroSection.67781cce7d15">{"IDEAS / SYSTEMS / EXPERIENCES"}</SiteText></span><span><SiteText id="HeroSection.6284abe7d04a">{"01 / SELECTED WORK"}</SiteText></span></div>
        <div className="hero-art-orbit" aria-hidden="true" />
        {selectedProject ? <Link to={`/projects/${selectedProject.id}`} className="hero-project-window" aria-label={`Explore selected project: ${selectedProject.title}`}>
          <div className="hero-window-chrome" aria-hidden="true"><div><i /><i /><i /></div><span><SiteText id="HeroSection.ccd7e3adc3ec">{"A CLOSER LOOK / 01"}</SiteText></span><ArrowUpRight size={16} /></div>
          <div className="hero-project-image"><ResponsiveImage src={selectedProject.image} alt="" width={800} height={500} sizes="(max-width: 640px) 90vw, (max-width: 1023px) 70vw, 45vw" fetchPriority="high" decoding="async" /><div className="hero-project-image-shade" /></div>
          <div className="hero-project-caption"><div><span><SiteText id="HeroSection.5e4bf6f72e23">{"Featured project"}</SiteText></span><h2>{selectedProject.title}</h2></div><span className="hero-project-arrow" aria-hidden="true"><ArrowUpRight size={23} /></span></div>
        </Link> : <div className="hero-empty-art" aria-hidden="true"><span>{'</>'}</span><p><SiteText id="HeroSection.b9a1c7589ff0">{"Ideas, made tangible."}</SiteText></p></div>}
        <div className="hero-floating-note" aria-hidden="true"><span className="hero-note-symbol">{'{ }'}</span><div><strong><SiteText id="HeroSection.0567cc729be9">{"Built with intention."}</SiteText></strong><span><SiteText id="HeroSection.a2c11dcbfa54">{"From the first idea to the final detail."}</SiteText></span></div></div>
        <span className="hero-art-coordinate" aria-hidden="true"><SiteText id="HeroSection.f80abfbc936d">{"OPEN TO WHAT'S NEXT "}</SiteText><span>+</span></span>
      </div>
    </div>
    <div className="hero-bottom-rail"><span>{profile.location}</span>{hasProjectsSection ? <a href="#home-projects"><SiteText id="HeroSection.352ce8d49637">{"Discover the work "}</SiteText><ArrowDown size={15} aria-hidden="true" /></a> : <Link to="/projects"><SiteText id="HeroSection.352ce8d49637">{"Discover the work "}</SiteText><ArrowRight size={15} aria-hidden="true" /></Link>}<span className="hidden sm:inline"><SiteText id="HeroSection.5f2e4f1f973d">{"WEB / DATA / CONNECTED SYSTEMS"}</SiteText></span></div>
  </section>;
}
