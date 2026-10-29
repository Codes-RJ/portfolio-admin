import { SiteText } from '../components/ui/SiteText';
import { ResponsiveImage } from '../components/ui/ResponsiveImage';
import { MotionImage } from '../components/ui/MotionImage';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useContentSlice } from '../context/contentSubscriptions';
import { useTheme } from '../context/ThemeContext';
import {
  BookOpen,
  Calendar,
  Clock,
  Search,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { ContactCTA } from '../components/ui/ContactCTA';
import { defaultPageHeaders } from '../data/initialData';

export const BlogPage: React.FC = () => {
  const blogPosts = useContentSlice('blogPosts');
  const blogCategories = useContentSlice('blogCategories');
  const profile = useContentSlice('profile');
  const siteSettings = useContentSlice('siteSettings');
  const { isDark } = useTheme();
  const pageHeader = siteSettings.pageHeaders?.blog || defaultPageHeaders.blog;
  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const categories = ['All', ...(blogCategories || [])];

  const orderedPosts = [...blogPosts].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  const filtered = orderedPosts.filter((b) => {
    const matchCat = selectedCat === 'All' || b.category === selectedCat;
    const s = search.toLowerCase();
    const matchSearch =
      !s ||
      (b.title || '').toLowerCase().includes(s) ||
      (b.summary || '').toLowerCase().includes(s) ||
      (b.tags || []).some((t) => (t || '').toLowerCase().includes(s));
    return matchCat && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* 1. Breadcrumb & Hero Section (Requirement 19) */}
      <section className="page-hero page-hero--blog grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Heading & Subheading */}
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
            <span className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-bold">
              <BookOpen className="w-4 h-4" />
              {blogPosts.length}<SiteText id="BlogPage.eb9830a61ec1">{" Published Articles"}</SiteText></span>
            <span>·</span>
            <span><SiteText id="BlogPage.2308c67955cf">{"Weekly Releases"}</SiteText></span>
          </div>
        </div>

        {/* Right Column: Blog Illustration (Outside the box, sized to match text column) */}
        <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
          <MotionImage
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            src={isDark ? '/assets/Blog (Dark).webp' : '/assets/Blog (Light).webp'}
            alt="Blog Page Illustration"
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
              onClick={() => { setSelectedCat(cat); setCurrentPage(1); }}
              aria-pressed={selectedCat === cat}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCat === cat
                  ? 'bg-[var(--color-primary)] text-white shadow-md'
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
            aria-label="Search articles"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search articles or tags..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-hidden"
          />
        </div>
      </div>

      {/* 3. 2-Column Layout: Left (70% Articles) + Right (30% Sidebar) (Requirement 19) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (70%): Articles List */}
        <div className="lg:col-span-8 space-y-6">
          {paginated.length === 0 ? (
            <div className="p-16 text-center rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-4 my-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] mx-auto flex items-center justify-center">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {search || selectedCat !== 'All' ? 'No Matching Articles' : 'Engineering Blog Ready'}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {search || selectedCat !== 'All'
                  ? 'Try modifying your search keywords or switching category filters.'
                  : 'Technical articles are being prepared. Check back soon for new engineering notes and case studies.'}
              </p>
            </div>
          ) : (
            paginated.map((post) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 shadow-md hover:border-[var(--color-primary)]/50 transition-all flex flex-col md:flex-row gap-6 group"
              >
                {/* Thumbnail */}
                <div className="w-full md:w-56 aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden shrink-0 relative">
                  <ResponsiveImage
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/60 text-white backdrop-blur-md">
                    {post.category}{post.featured && ' | Featured'}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-xs text-gray-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                        {post.publishedAt}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                        {post.readTime}
                      </span>
                    </div>

                    <Link
                      to={`/blog/${post.slug}`}
                      className="block w-full text-left text-lg font-bold text-gray-900 dark:text-white group-hover:text-[var(--color-primary)] dark:group-hover:text-[var(--color-primary-light)] transition-colors cursor-pointer leading-snug line-clamp-2"
                    >
                      {post.title}
                    </Link>

                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                      {post.summary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-brand-500/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      to={`/blog/${post.slug}`}
                      aria-label={`Read article: ${post.title}`}
                      className="min-h-11 text-sm font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] hover:underline flex items-center gap-1"
                    >
                      <span><SiteText id="BlogPage.4536a47de9e8">{"Read Article"}</SiteText></span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
              ><SiteText id="BlogPage.435567b14289">{"← Previous"}</SiteText></button>
              <span className="text-xs font-mono text-gray-500 px-3"><SiteText id="BlogPage.6076934f99bd">{"Page "}</SiteText>{currentPage}<SiteText id="BlogPage.a4282e4b2298">{" of "}</SiteText>{totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
              ><SiteText id="BlogPage.bcf0489a7b45">{"Next →"}</SiteText></button>
            </div>
          )}
        </div>

        {/* Right Column: Sidebar with author details and popular posts */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. Author Card */}
          <div className="p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 shadow-md space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-[var(--color-primary)] to-brand-600 p-0.5">
                <div className="w-full h-full bg-[#090d16] rounded-[14px] flex items-center justify-center text-xl">
                  👨‍💻
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{profile.name}</h3>
                <p className="text-xs text-[var(--color-primary)] dark:text-[var(--color-primary-light)] font-semibold"><SiteText id="BlogPage.f6ff198de217">{"Author & Tech Writer"}</SiteText></p>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed"><SiteText id="BlogPage.842caa0f1e5f">{"Writing pragmatic technical breakdowns on full-stack web applications, AI models, and real-time distributed engineering."}</SiteText></p>
            <Link
              to="/about"
              className="inline-flex items-center space-x-1 text-xs font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] hover:underline"
            >
              <span><SiteText id="BlogPage.5f06bef28f75">{"More about Rohan"}</SiteText></span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* 2. Popular Posts */}
          <div className="p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 shadow-md space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-gray-100 dark:border-gray-800">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider"><SiteText id="BlogPage.c97df800661a">{"Popular Articles"}</SiteText></h3>
            </div>

            <div className="space-y-3">
              {orderedPosts.slice(0, 3).map((post) => (
                <Link
                  to={`/blog/${post.slug}`}
                  key={post.id}
                  className="block w-full text-left cursor-pointer group space-y-1 pb-3 border-b border-gray-100 dark:border-gray-800/60 last:border-none last:pb-0"
                >
                  <span className="text-[10px] font-mono text-brand-600 dark:text-brand-400 font-semibold">{post.category}</span>
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-[var(--color-primary)] dark:group-hover:text-[var(--color-primary-light)] transition-colors leading-snug">
                    {post.title}
                  </h4>
                  <span className="text-[10px] font-mono text-gray-400">{post.readTime}</span>
                </Link>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 4. Bottom Contact CTA */}
      <ContactCTA
        badge="// discuss insights & tech"
        title="Interested in collaborating or discussing engineering ideas?"
        description="I'm always open to technical discussions, code reviews, writing collaborations, and speaking opportunities."
        primaryBtnText="Get In Touch"
        primaryBtnPath="/contact"
        secondaryBtnText="Explore Projects"
        secondaryBtnPath="/projects"
      />

    </div>
  );
};
