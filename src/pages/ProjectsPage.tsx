import { SiteText } from '../components/ui/SiteText';
import { ResponsiveImage } from '../components/ui/ResponsiveImage';
import { MotionImage } from '../components/ui/MotionImage';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useContentSlice } from '../context/contentSubscriptions';
import { useTheme } from '../context/ThemeContext';
import { Layers, Search, Github, ExternalLink, Eye } from 'lucide-react';
import { ContactCTA } from '../components/ui/ContactCTA';
import { defaultPageHeaders } from '../data/initialData';
import { getProjectCategories } from '../utils/projectCategories';

export const ProjectsPage: React.FC = () => {
  const projects = useContentSlice('projects');
  const projectCategories = useContentSlice('projectCategories');
  const siteSettings = useContentSlice('siteSettings');
  const { isDark } = useTheme();
  const pageHeader = siteSettings.pageHeaders?.projects || defaultPageHeaders.projects;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', ...(projectCategories || [])];

  const filtered = projects.filter((p) => {
    const groups = getProjectCategories(p);
    const matchCat = selectedCategory === 'All' || groups.includes(selectedCategory);
    const s = searchQuery.toLowerCase();
    const matchSearch =
      !s ||
      (p.title || '').toLowerCase().includes(s) ||
      (p.description || '').toLowerCase().includes(s) ||
      groups.some((group) => group.toLowerCase().includes(s)) ||
      (p.technologies || []).some((t) => (t || '').toLowerCase().includes(s));
    return matchCat && matchSearch;
  });

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* 1. Header Section: Left-aligned with right-side illustration */}
      <section className="page-hero page-hero--projects grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Left-aligned Heading & Subheading */}
        <div className="lg:col-span-7 space-y-4 text-left">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">
            <span>{pageHeader.eyebrow}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {pageHeader.title}
          </h1>

          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
            {pageHeader.subtitle}
          </p>

          <div className="flex items-center gap-4 text-xs font-mono text-gray-500 pt-2">
            <span className="flex items-center gap-1.5 text-emerald-500 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              {projects.length}<SiteText id="ProjectsPage.4748e23b30c7">{" Total Projects"}</SiteText></span>
            <span>·</span>
            <span><SiteText id="ProjectsPage.92e4b812f583">{"Production & Research"}</SiteText></span>
          </div>
        </div>

        {/* Right Column: Project Page Illustration (Outside the box, sized to match text column) */}
        <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
          <MotionImage
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            src={isDark ? '/assets/Project Page (Dark).webp' : '/assets/Project Page (Light).webp'}
            alt="Project Page Illustration"
            decoding="async"
            fetchPriority="high"
            className="w-full max-w-[480px] h-auto max-h-[360px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
          />
        </div>

      </section>

      {/* 2. Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 shadow-xs">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              aria-pressed={selectedCategory === cat}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[var(--color-primary)] text-white shadow-md shadow-brand-600/20'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            aria-label="Search projects"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects or stack..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-hidden"
          />
        </div>
      </div>

      {/* 3. Project Cards Grid */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-4 max-w-xl mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] mx-auto flex items-center justify-center">
            <Layers className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {searchQuery || selectedCategory !== 'All' ? 'No Matching Projects' : 'Projects Showcase Ready'}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            {searchQuery || selectedCategory !== 'All'
              ? 'Try adjusting your search keywords or active category filter.'
              : 'New case studies are being prepared. Check back soon for project details, source links, and live demonstrations.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((project) => {
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl glass-card border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col justify-between hover:border-[var(--color-primary)]/50 hover:-translate-y-1 transition-all group shadow-md"
              >
                <div>
                  {/* Thumbnail with Live vs Code Status */}
                  <div className="relative aspect-video overflow-hidden">
                    <ResponsiveImage
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Project group pills */}
                    <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5">
                      {getProjectCategories(project).map((category) => (
                        <span key={category} className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-black/60 text-white backdrop-blur-md">
                          {category}
                        </span>
                      ))}
                    </div>

                    {/* Date Badge Bottom Right */}
                    {project.date && (
                      <div className="absolute bottom-3 right-3 flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-white border border-white/10">
                        <span>{project.date}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-[var(--color-primary)] transition-colors leading-snug">
                      <Link to={`/projects/${project.id}`} className="hover:underline">{project.title}</Link>
                    </h3>
                    
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
                      {project.description}
                    </p>

                    {/* Key Metrics / Highlights */}
                    {project.metrics && project.metrics.length > 0 && (
                      <div className="p-3 rounded-2xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200/50 dark:border-brand-800/30 text-[11px] font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] space-y-0.5">
                        <div className="font-mono text-xs uppercase text-gray-500"><SiteText id="ProjectsPage.22de249b5c59">{"Outcome"}</SiteText></div>
                        <div>{project.metrics[0]}</div>
                      </div>
                    )}

                    {/* Tech Stack Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-gray-400">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 pt-0 border-t border-gray-100 dark:border-gray-800/80 mt-4 flex items-center justify-between">
                  <Link
                    to={`/projects/${project.id}`}
                    aria-label={`Read case study: ${project.title}`}
                    className="min-h-11 text-sm font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span><SiteText id="ProjectsPage.4030b7369722">{"Case Study"}</SiteText></span>
                  </Link>

                  <div className="flex items-center space-x-2">
                    {project.githubUrl && project.showGithub !== false && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="GitHub Repository"
                        className="min-h-11 min-w-11 inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary-light)] transition-colors"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.liveUrl && project.showLive !== false && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="Live Demo"
                        className="min-h-11 min-w-11 inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary-light)] transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 4. Bottom Contact CTA */}
      <ContactCTA
        badge="// build something ambitious"
        title="Need a custom software solution or AI application?"
        description="I design, architect, and ship high-performance digital products from idea to production."
        primaryBtnText="Let's Talk"
        primaryBtnPath="/contact"
        secondaryBtnText="View resume"
        secondaryBtnPath="/resume"
      />

    </div>
  );
};
