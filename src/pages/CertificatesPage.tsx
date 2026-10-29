import { SiteText } from '../components/ui/SiteText';
import { ResponsiveImage } from '../components/ui/ResponsiveImage';
import { MotionImage } from '../components/ui/MotionImage';
import { dateValue } from '../utils/skills';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useContentSlice, useModalActions } from '../context/contentSubscriptions';
import { useTheme } from '../context/ThemeContext';
import { IconRenderer } from '../components/ui/IconRenderer';
import { ContactCTA } from '../components/ui/ContactCTA';
import { defaultPageHeaders } from '../data/initialData';
import {
  Award,
  ShieldCheck,
  ExternalLink,
  Search,
  Grid,
  List,
  FileText,
  ArrowRight,
  Eye
} from 'lucide-react';

export const CertificatesPage: React.FC = () => {
  const certificates = useContentSlice('certificates');
  const certificateCategories = useContentSlice('certificateCategories');
  const { setActiveModalCert } = useModalActions();
  const siteSettings = useContentSlice('siteSettings');
  const { isDark } = useTheme();
  const pageHeader = siteSettings.pageHeaders?.certificates || defaultPageHeaders.certificates;
  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alpha'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = ['All', ...(certificateCategories || [])];
  const verifiedCount = certificates.filter((certificate) => /^https?:\/\//i.test(certificate.verificationUrl)).length;
  const issuerCount = new Set(certificates.map((certificate) => certificate.issuer).filter(Boolean)).size;
  const activeCategoryCount = new Set(certificates.map((certificate) => certificate.category).filter(Boolean)).size;

  // Filter & Search
  let filtered = certificates.filter((c) => {
    const matchCat = selectedCat === 'All' || c.category === selectedCat;
    const s = search.toLowerCase();
    const matchSearch =
      !s ||
      (c.title || '').toLowerCase().includes(s) ||
      (c.issuer || '').toLowerCase().includes(s) ||
      (c.credentialId || '').toLowerCase().includes(s);
    return matchCat && matchSearch;
  });

  // Sort
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'alpha') return a.title.localeCompare(b.title);
    if (sortBy === 'oldest') return dateValue(a.date) - dateValue(b.date);
    return dateValue(b.date) - dateValue(a.date);
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* 1. Breadcrumb & Hero Section */}
      <section className="page-hero page-hero--certificates grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
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

          <div className="flex items-center gap-4 pt-2">
            <Link
              to="/resume"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] shadow-lg shadow-brand-600/25 transition-all transform hover:-translate-y-0.5"
            >
              <FileText className="w-4 h-4" />
              <span><SiteText id="CertificatesPage.5e093f8d5f1f">{"View In Full CV"}</SiteText></span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Column: Certificate Page Illustration (Outside the box, sized to match text column) */}
        <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
          <MotionImage
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            src={isDark ? '/assets/Certificate Page (Dark).webp' : '/assets/Certificate Page (Light).webp'}
            alt="Certificates Overview Illustration"
            className="w-full max-w-[480px] h-auto max-h-[360px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
          />
        </div>

      </section>

      {/* 2. Content-derived Stats Bar */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 shadow-md">
          <div className="p-3 text-center space-y-1">
            <span className="block text-2xl sm:text-3xl font-extrabold text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">{certificates.length}</span>
            <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400"><SiteText id="CertificatesPage.e7d33774b9a4">{"Total Certifications"}</SiteText></span>
          </div>
          <div className="p-3 text-center space-y-1">
            <span className="block text-2xl sm:text-3xl font-extrabold text-emerald-500">{verifiedCount}</span>
            <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400"><SiteText id="CertificatesPage.5388991aa531">{"With Verification Links"}</SiteText></span>
          </div>
          <div className="p-3 text-center space-y-1">
            <span className="block text-2xl sm:text-3xl font-extrabold text-brand-600 dark:text-brand-400">{issuerCount}</span>
            <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400"><SiteText id="CertificatesPage.d7ad8029d5e3">{"Issuers"}</SiteText></span>
          </div>
          <div className="p-3 text-center space-y-1">
            <span className="block text-2xl sm:text-3xl font-extrabold text-brand-600 dark:text-brand-400">{activeCategoryCount}</span>
            <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400"><SiteText id="CertificatesPage.b2561b50e122">{"Specializations"}</SiteText></span>
          </div>
        </div>
      </section>

      {/* 3. Controls Bar: Filter, Search, Sort, Grid/List */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 shadow-xs">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 w-full lg:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCat(cat); setCurrentPage(1); }}
              aria-pressed={selectedCat === cat}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCat === cat
                  ? 'bg-[var(--color-primary)] text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search, Sort & Toggle */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              aria-label="Search certificates"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search cert or issuer..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-hidden"
            />
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            aria-label="Sort certificates"
            className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white focus:outline-hidden"
          >
            <option value="newest"><SiteText id="CertificatesPage.4ea1885778d3">{"Newest First"}</SiteText></option>
            <option value="oldest"><SiteText id="CertificatesPage.c4a20dba48c5">{"Oldest First"}</SiteText></option>
            <option value="alpha"><SiteText id="CertificatesPage.a49d631f8c6c">{"Alphabetical"}</SiteText></option>
          </select>

          {/* Grid / List Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'grid' ? 'bg-white dark:bg-[#090d16] text-[var(--color-primary)] shadow-xs' : 'text-gray-500'
              }`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'list' ? 'bg-white dark:bg-[#090d16] text-[var(--color-primary)] shadow-xs' : 'text-gray-500'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* 4. Certificate Cards Grid / List */}
      {paginated.length === 0 ? (
        <div className="p-16 text-center rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-4 max-w-xl mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] mx-auto flex items-center justify-center">
            <Award className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {search || selectedCat !== 'All' ? 'No Matching Credentials' : 'Certifications Vault Ready'}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            {search || selectedCat !== 'All'
              ? 'Try adjusting your search query or selected category filter.'
              : 'Verified certificates and credential links will appear here when they are published.'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((cert) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 flex flex-col justify-between hover:border-[var(--color-primary)]/50 hover:-translate-y-1 transition-all shadow-md group"
            >
              <div className="space-y-4">
                {cert.image && <ResponsiveImage src={cert.image} alt={`${cert.title} certificate`} loading="lazy" className="w-full aspect-[4/3] object-cover rounded-2xl border border-gray-200 dark:border-gray-700" />}
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-white/70 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 flex items-center justify-center p-2.5 shadow-xs group-hover:scale-110 group-hover:shadow-md transition-all">
                    <IconRenderer icon={cert.logo} name={`${cert.title} ${cert.issuer}`} className="w-7 h-7" />
                  </div>
                  {/^(https?:\/\/)/i.test(cert.verificationUrl) && <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    <ShieldCheck className="w-3.5 h-3.5" /><SiteText id="CertificatesPage.bbc254c547a7">{" Credential link"}</SiteText></span>}
                </div>

                <div>
                  <span className="text-[10px] font-mono text-brand-600 dark:text-brand-400 font-semibold uppercase">{cert.category}</span>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-[var(--color-primary)] transition-colors leading-snug">
                    {cert.title}
                  </h3>
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mt-1">{cert.issuer}</p>
                </div>

                <div className="text-[11px] font-mono text-gray-500 space-y-0.5 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div><SiteText id="CertificatesPage.0a5aeb82680a">{"Issued: "}</SiteText>{cert.date}</div>
                  {cert.credentialId && <div className="truncate"><SiteText id="CertificatesPage.d7166e572248">{"ID: "}</SiteText>{cert.credentialId}</div>}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800/80 mt-4 flex items-center justify-between">
                <button
                  onClick={() => setActiveModalCert(cert)}
                  className="text-xs font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span><SiteText id="CertificatesPage.324b134f57c7">{"Preview"}</SiteText></span>
                </button>

                {/^(https?:\/\/)/i.test(cert.verificationUrl) && <a
                  href={cert.verificationUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="Verify Credential"
                  className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary-light)] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {paginated.map((cert) => (
            <div
              key={cert.id}
              className="p-4 rounded-2xl glass-card border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[var(--color-primary)]/50 transition-all"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-xl bg-white/70 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 flex items-center justify-center p-2 shrink-0">
                  <IconRenderer icon={cert.logo} name={`${cert.title} ${cert.issuer}`} className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{cert.title}</h3>
                  <p className="text-xs text-[var(--color-primary)] font-semibold">{cert.issuer} · {cert.date}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {cert.credentialId && <span className="text-[11px] font-mono text-gray-500 hidden md:inline"><SiteText id="CertificatesPage.d7166e572248">{"ID: "}</SiteText>{cert.credentialId}</span>}
                <button
                  onClick={() => setActiveModalCert(cert)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-strong)]"
                ><SiteText id="CertificatesPage.45989de49fb7">{"Details"}</SiteText></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
          ><SiteText id="CertificatesPage.435567b14289">{"← Previous"}</SiteText></button>
          <span className="text-xs font-mono text-gray-500 px-3"><SiteText id="CertificatesPage.6076934f99bd">{"Page "}</SiteText>{currentPage}<SiteText id="CertificatesPage.a4282e4b2298">{" of "}</SiteText>{totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
          ><SiteText id="CertificatesPage.bcf0489a7b45">{"Next →"}</SiteText></button>
        </div>
      )}

      {/* 6. Bottom Contact CTA */}
      <ContactCTA
        badge="// committed to engineering mastery"
        title="Continual Certification & Knowledge Benchmarking"
        description="I actively pursue ongoing credentialing in advanced cloud engineering, distributed architectures, and generative AI systems."
        primaryBtnText="Get In Touch"
        primaryBtnPath="/contact"
        secondaryBtnText="Explore Skills Matrix"
        secondaryBtnPath="/skills"
      />

    </div>
  );
};
