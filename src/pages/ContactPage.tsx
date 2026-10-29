import { ContactForm } from '../components/ui/ContactForm';
import { SiteText } from '../components/ui/SiteText';
import { ResponsiveImage } from '../components/ui/ResponsiveImage';
import { MotionImage } from '../components/ui/MotionImage';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContentSlice } from '../context/contentSubscriptions';
import { useTheme } from '../context/ThemeContext';
import { defaultPageHeaders } from '../data/initialData';
import {
  Mail,
  CheckCircle2,
  Clock,
  MapPin,
  Globe,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Github,
  Linkedin,
  Twitter,
  Instagram
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const profile = useContentSlice('profile');
  const siteSettings = useContentSlice('siteSettings');
  const { isDark } = useTheme();
  const pageHeader = siteSettings.pageHeaders?.contact || defaultPageHeaders.contact;

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 lg:space-y-12">

      {/* 1. Breadcrumb & Hero Section (Requirement 20) */}
      <section className="page-hero page-hero--contact grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

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

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-gray-500 pt-2">
            <span className="flex items-center gap-1.5 text-emerald-500 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              {profile.availabilityStatus}
            </span>
            <span>·</span>
            <span><SiteText id="ContactPage.be35524d355b">{"Avg Response: "}</SiteText>{profile.responseTime}</span>
          </div>
          <a href={`mailto:${profile.socials.email}`} className="inline-flex min-h-11 items-center break-all text-sm font-semibold text-[var(--color-primary)] underline dark:text-[var(--color-primary-light)]">{profile.socials.email}</a>
        </div>

        {/* Right Column: Contact Page Illustration (Outside the box, sized to match text column) */}
        <div className="hidden lg:flex lg:col-span-5 items-center justify-end">
          <MotionImage
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            src={isDark ? '/assets/Contact (Dark).webp' : '/assets/Contact (Light).webp'}
            alt="Contact Page Illustration"
            className="w-full max-w-[480px] h-auto max-h-[360px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
          />
        </div>

      </section>

      {/* 2. 2-Column Contact Info + Form Section (Requirement 20) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Right Column: Contact Form */}
        <div className="order-1 lg:order-2 lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 shadow-xl">

            <ContactForm />

          </div>
        </div>


        {/* Left Column: Direct Info Cards & Socials */}
        <div className="order-2 lg:order-1 lg:col-span-5 space-y-6">

          <div className="p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 shadow-md space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] flex items-center justify-center border border-brand-500/20">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider"><SiteText id="ContactPage.777cd23ce55c">{"Direct Channels"}</SiteText></h3>
                <span className="text-[11px] text-gray-500"><SiteText id="ContactPage.fa81ad5b80f9">{"Quick Response"}</SiteText></span>
              </div>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/60">
                <div className="flex items-center space-x-2 text-gray-400 mb-1">
                  <Mail className="w-4 h-4 text-[var(--color-primary)]" />
                  <span className="text-[10px] uppercase font-bold"><SiteText id="ContactPage.a93d4dd3b6f4">{"Email Address:"}</SiteText></span>
                </div>
                <a
                  href={`mailto:${profile.socials.email}`}
                  className="font-mono font-bold text-xs text-[var(--color-primary)] dark:text-[var(--color-primary-light)] hover:underline block truncate"
                >
                  {profile.socials.email}
                </a>
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/60">
                <div className="flex items-center space-x-2 text-gray-400 mb-1">
                  <Clock className="w-4 h-4 text-[var(--color-primary)]" />
                  <span className="text-[10px] uppercase font-bold"><SiteText id="ContactPage.646de1d1e1ac">{"Response Guarantee:"}</SiteText></span>
                </div>
                <span className="font-bold text-gray-800 dark:text-white text-xs">{profile.responseTime}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/60">
                <div className="flex items-center space-x-2 text-gray-400 mb-1">
                  <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
                  <span className="text-[10px] uppercase font-bold"><SiteText id="ContactPage.bbdffe25dc7d">{"Location:"}</SiteText></span>
                </div>
                <span className="font-bold text-gray-800 dark:text-white text-xs">{profile.location}</span>
              </div>
            </div>

            {siteSettings.contactInfo.phone && <a className="block text-sm font-semibold" href={`tel:${siteSettings.contactInfo.phone.replace(/[^+0-9]/g, '')}`}>{siteSettings.contactInfo.phone}</a>}
            {/* Social Links Row */}
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2"><SiteText id="ContactPage.00c9eb602360">{"Connect Directly:"}</SiteText></span>
              <div className="flex items-center space-x-2">
                <a
                  href={profile.socials.github}
                  aria-label="GitHub profile"
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-11 min-w-11 inline-flex items-center justify-center p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary-light)] transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={profile.socials.linkedin}
                  aria-label="LinkedIn profile"
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-11 min-w-11 inline-flex items-center justify-center p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary-light)] transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={profile.socials.twitter}
                  aria-label="Twitter profile"
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-11 min-w-11 inline-flex items-center justify-center p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary-light)] transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                {profile.socials.instagram && (
                  <a
                    href={profile.socials.instagram}
                  aria-label="Instagram profile"
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-11 min-w-11 inline-flex items-center justify-center p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary-light)] transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Interactive World Map & Availability Card (Requirement 20) */}
          <div className="p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 shadow-md space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-gray-100 dark:border-gray-800">
              <Globe className="w-4 h-4 text-[var(--color-primary)]" />
              <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider"><SiteText id="ContactPage.ad411144a97f">{"Remote & Global Availability"}</SiteText></h3>
            </div>

            <div className="rounded-2xl overflow-hidden bg-brand-500/5 dark:bg-brand-950/20 p-2 border border-brand-500/20">
              <ResponsiveImage
                src={isDark ? '/assets/World_map_(purple_dots).webp' : '/assets/World_map_(blue_dots).webp'}
                alt="Global Reach"
                className="w-full h-auto object-contain rounded-xl hover:scale-105 transition-transform duration-500"
              />
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed text-center"><SiteText id="ContactPage.3f00e7f684db">{"Available for remote engineering contracts, global distributed teams, and on-site relocation."}</SiteText></p>
          </div>

        </div>


      </div>

      {/* 3. Interactive FAQ Accordions (Requirement 20) */}
      <section className="space-y-8 pt-8 border-t border-gray-200 dark:border-gray-800">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span><SiteText id="ContactPage.4e9f48728271">{"Got Questions?"}</SiteText></span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white"><SiteText id="ContactPage.a3d458e1bd1e">{"Frequently Asked Questions"}</SiteText></h2>
          <p className="text-xs text-gray-500"><SiteText id="ContactPage.080ec9e88db5">{"Common questions regarding work engagement models, technologies, and response timelines."}</SiteText></p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {siteSettings.faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;

            return (
              <div
                key={idx}
                className="rounded-2xl glass-card border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  className="w-full p-4 text-left flex items-center justify-between font-bold text-sm text-gray-900 dark:text-white"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-[var(--color-primary)] font-mono text-xs">0{idx + 1}.</span>
                    <span>{faq.question || faq.q}</span>
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[var(--color-primary)]" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${idx}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-4 pb-4 pt-1 text-xs text-gray-600 dark:text-gray-300 leading-relaxed pl-8 border-t border-gray-100 dark:border-gray-800/60"
                    >
                      {faq.answer || faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

