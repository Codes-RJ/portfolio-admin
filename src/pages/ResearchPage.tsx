import { SiteText } from '../components/ui/SiteText';
import { ResponsiveImage } from '../components/ui/ResponsiveImage';
import { MotionImage } from '../components/ui/MotionImage';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useContentSlice } from '../context/contentSubscriptions';
import { useTheme } from '../context/ThemeContext';
import {
  FileText,
  ExternalLink,
  Award,
  Search,
  ArrowRight,
  Sparkles,
  Users,
  Quote,
  Flame,
  Mail
} from 'lucide-react';
import { ContactCTA } from '../components/ui/ContactCTA';
import { defaultPageHeaders } from '../data/initialData';

export const ResearchPage: React.FC = () => {
  const researchPapers = useContentSlice('researchPapers');
  const siteSettings = useContentSlice('siteSettings');
  const { isDark } = useTheme();
  const pageHeader = siteSettings.pageHeaders?.research || defaultPageHeaders.research;
  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const categories = ['All', ...new Set(researchPapers.map((paper) => paper.category).filter((category): category is string => Boolean(category)))];

  const filtered = researchPapers.filter((p) => {
    const matchCat = selectedCat === 'All' || p.category === selectedCat;
    const s = search.toLowerCase();
    const matchSearch =
      !s ||
      (p.title || '').toLowerCase().includes(s) ||
      (p.abstract || '').toLowerCase().includes(s) ||
      (p.venue || '').toLowerCase().includes(s) ||
      (p.authors || []).some((a) => (a || '').toLowerCase().includes(s)) ||
      (p.keywords || []).some((k) => (k || '').toLowerCase().includes(s));
    return matchCat && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* 1. Breadcrumb & Hero Section (Requirement 21) */}
      <section className="page-hero page-hero--research grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
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
              <Award className="w-4 h-4" />
              {researchPapers.length}<SiteText id="ResearchPage.885f5575b804">{" Published Papers"}</SiteText></span>
            <span>·</span>
            <span><SiteText id="ResearchPage.ca62d48e7f74">{"IEEE / Springer & Open Preprints"}</SiteText></span>
          </div>
        </div>

        {/* Right Column: Research Illustration (Outside the box, sized to match text column) */}
        <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
          <MotionImage
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            src={isDark ? '/assets/Research (Dark).webp' : '/assets/Research (Light).webp'}
            alt="Research Page Illustration"
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
            aria-label="Search research papers"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search papers or authors..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-hidden"
          />
        </div>
      </div>

      {/* 3. 2-Column Layout: Left (70% Papers) + Right (30% Sidebar) (Requirement 21) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (70%): Papers List */}
        <div className="lg:col-span-8 space-y-6">
          {paginated.length === 0 ? (
            <div className="p-16 text-center rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-4 my-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] mx-auto flex items-center justify-center">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {search || selectedCat !== 'All' ? 'No Matching Publications' : 'Academic & Research Publications Ready'}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {search || selectedCat !== 'All'
                  ? 'Try modifying your search query or selecting another domain.'
                  : 'No publications are available yet. Papers, preprints, and DOI links will appear here when published.'}
              </p>
            </div>
          ) : (
            paginated.map((paper) => (
              <motion.div
                key={paper.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 sm:p-8 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 shadow-md space-y-5 hover:border-[var(--color-primary)]/50 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-brand-500/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] border border-brand-500/20">
                        {paper.venue} ({paper.year})
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">{paper.category}</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-2 leading-snug">
                      {paper.title}
                    </h2>
                  </div>

                  <span className="px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0 self-start sm:self-auto flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" /><SiteText id="ResearchPage.28d5d4f2b351">{"Citations: "}</SiteText>{paper.citations}
                  </span>
                </div>

                {paper.image && <ResponsiveImage src={paper.image} alt={paper.title} className="w-full max-h-64 object-cover rounded-xl" loading="lazy" />}
                {(paper.date || paper.readTime) && <p className="text-xs text-gray-500">{[paper.date, paper.readTime].filter(Boolean).join(' | ')}</p>}
                {/* Authors */}
                <div className="flex items-center space-x-2 text-xs font-mono text-gray-500">
                  <Users className="w-4 h-4 text-[var(--color-primary)]" />
                  <span><SiteText id="ResearchPage.6f5a07f420c3">{"Authors: "}</SiteText><strong className="text-gray-800 dark:text-gray-200">{paper.authors.join(', ')}</strong></span>
                </div>

                {/* Abstract */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Quote className="w-3.5 h-3.5 text-[var(--color-primary)]" /><SiteText id="ResearchPage.d21b4a64a2d8">{"Abstract"}</SiteText></h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-serif">
                    {paper.abstract}
                  </p>
                </div>

                {/* Keywords & Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex flex-wrap gap-1.5">
                    {paper.keywords?.map((kw: string) => (
                      <span
                        key={kw}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-brand-500/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)]"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>

                  {(paper.pdfUrl) || (paper.paperUrl) || paper.doi ? <a
                    href={(paper.pdfUrl) ? paper.pdfUrl : (paper.paperUrl) ? paper.paperUrl : `https://doi.org/${encodeURIComponent(paper.doi)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] shadow-md shadow-brand-600/20 transition-all"
                  >
                    <span><SiteText id="ResearchPage.56a06eafcaa6">{"Read Full PDF"}</SiteText></span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a> : null}
                </div>
              </motion.div>
            ))
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
              ><SiteText id="ResearchPage.435567b14289">{"← Previous"}</SiteText></button>
              <span className="text-xs font-mono text-gray-500 px-3"><SiteText id="ResearchPage.6076934f99bd">{"Page "}</SiteText>{currentPage}<SiteText id="ResearchPage.a4282e4b2298">{" of "}</SiteText>{totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
              ><SiteText id="ResearchPage.bcf0489a7b45">{"Next →"}</SiteText></button>
            </div>
          )}
        </div>

        {/* Right Column (30%): Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. Research Focus */}
          <div className="p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 shadow-md space-y-3">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-gray-100 dark:border-gray-800">
              <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
              <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider"><SiteText id="ResearchPage.0cba071de1d3">{"Research Focus & Domains"}</SiteText></h3>
            </div>
            
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed"><SiteText id="ResearchPage.ff5ff07011f6">{"Targeting high-throughput, low-latency neural processing on constrained edge hardware, sensor synchronization, and real-time computer vision networks."}</SiteText></p>

            <div className="space-y-2 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex justify-between font-mono">
                <span><SiteText id="ResearchPage.c8918ee2cedc">{"Model Quantization"}</SiteText></span>
                <span className="text-[var(--color-primary)] font-bold"><SiteText id="ResearchPage.f0bbd8088f00">{"INT8 / FP16"}</SiteText></span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex justify-between font-mono">
                <span><SiteText id="ResearchPage.327c38b9bd27">{"Inference Targets"}</SiteText></span>
                <span className="text-[var(--color-primary)] font-bold"><SiteText id="ResearchPage.f1d90830edf5">{"ESP32 / Edge TPU"}</SiteText></span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex justify-between font-mono">
                <span><SiteText id="ResearchPage.7aa75bab9024">{"Telemetry Protocols"}</SiteText></span>
                <span className="text-[var(--color-primary)] font-bold"><SiteText id="ResearchPage.c8408bda5d9c">{"MQTT / gRPC"}</SiteText></span>
              </div>
            </div>
          </div>

          {/* 2. Research Collaboration CTA */}
          <div className="p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 shadow-md space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-[var(--color-primary)]" />
              <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider"><SiteText id="ResearchPage.a9773fddff4f">{"Academic Collaboration"}</SiteText></h3>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed"><SiteText id="ResearchPage.3e0b42746f10">{"Open to co-authoring papers, joint research grants, and peer-reviewing publications in AI/ML & IoT."}</SiteText></p>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center space-x-2 w-full py-3 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] shadow-xs transition-all"
            >
              <span><SiteText id="ResearchPage.7377ff394d7a">{"Initiate Research Inquiry"}</SiteText></span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>

      {/* 4. Bottom Contact CTA */}
      <ContactCTA
        badge="// academic & industry collaboration"
        title="Interested in Joint AI & Edge Computing Research?"
        description="I actively collaborate with universities, research labs, and tech enterprises on model optimization, IoT telemetry, and computer vision."
        primaryBtnText="Initiate Collaboration"
        primaryBtnPath="/contact"
        secondaryBtnText="Explore Full CV"
        secondaryBtnPath="/resume"
      />

    </div>
  );
};

