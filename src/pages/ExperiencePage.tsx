import { SiteText } from '../components/ui/SiteText';
import { MotionImage } from '../components/ui/MotionImage';
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useContentSlice } from '../context/contentSubscriptions';
import { useTheme } from '../context/ThemeContext';
import { IconRenderer } from '../components/ui/IconRenderer';
import { ContactCTA } from '../components/ui/ContactCTA';
import { defaultPageHeaders } from '../data/initialData';
import {
  Briefcase,
  Calendar,
  MapPin,
  CheckCircle2,
  Trophy,
  FileText,
  ArrowRight,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';

export const ExperiencePage: React.FC = () => {
  const experiences = useContentSlice('experiences');
  const siteSettings = useContentSlice('siteSettings');
  const techStack = useContentSlice('techStack');
  const { isDark } = useTheme();
  const pageHeader = siteSettings.pageHeaders?.experience || defaultPageHeaders.experience;
  const careerHighlights = Array.isArray(siteSettings.experienceHighlights)
    ? siteSettings.experienceHighlights
    : siteSettings.experienceHighlights.coreStrengths;

  // Tech stack logos list for sidebar - Logos only per Requirement 16
  const techLogos = techStack;

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* 1. Header Section: Left-aligned with Right-side illustration (Requirement 15) */}
      <section className="page-hero page-hero--experience grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
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

          <div className="flex items-center gap-4 pt-2">
            <Link
              to="/resume"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] shadow-lg shadow-brand-600/25 transition-all transform hover:-translate-y-0.5"
            >
              <FileText className="w-4 h-4" />
              <span><SiteText id="ExperiencePage.cedcb18dd05a">{"View resume"}</SiteText></span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Column: Experience Page Illustration (Outside the box, sized to match text column) */}
        <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
          <MotionImage
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            src={isDark ? '/assets/Experience Page (Dark).webp' : '/assets/Experience Page (Light).webp'}
            alt="Experience Page Illustration"
            className="w-full max-w-[480px] h-auto max-h-[360px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
          />
        </div>

      </section>

      {/* 2. 70% Left Timeline + 30% Right Sidebar Layout (Requirement 16) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 70% Left: Detailed Timeline Blocks */}
        <div className="lg:col-span-8 space-y-8">
          {experiences.length === 0 ? (
            <div className="p-16 text-center rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-4 my-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] mx-auto flex items-center justify-center">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white"><SiteText id="ExperiencePage.4a7bf673bec0">{"Experience details coming soon"}</SiteText></h3>
              <p className="text-xs text-gray-500 leading-relaxed"><SiteText id="ExperiencePage.4718284698c7">{"Professional milestones, responsibilities, and selected accomplishments will appear here when published."}</SiteText></p>
            </div>
          ) : (
            <div className="relative pl-6 sm:pl-8 border-l-2 border-brand-500/30 space-y-8">
              {experiences.map((exp, idx) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group"
                >
                  {/* Numbered Bullet Node on Axis */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xs font-bold ring-4 ring-white dark:ring-[#090d16] shadow-md">
                    {idx + 1}
                  </div>

                  <div className="p-6 sm:p-8 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 shadow-md space-y-5 hover:border-[var(--color-primary)]/50 transition-all">
                    
                    {/* Role & Company Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] shrink-0">
                          <IconRenderer icon={exp.logo} name={exp.company} className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{exp.title}</h2>
                          <p className="text-xs font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">{exp.company}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-500 font-mono">
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                          <Calendar className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                          {exp.period}{exp.type && ` ? ${exp.type}`}
                        </span>
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                          <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                          {exp.location}
                        </span>
                      </div>
                    </div>

                    {/* Role Summary */}
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                      {exp.summary}
                    </p>

                    {/* Responsibilities */}
                    <div className="space-y-2.5">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider"><SiteText id="ExperiencePage.dd142e0c1ea9">{"Key Responsibilities & System Architecture:"}</SiteText></h3>
                      <ul className="space-y-2">
                        {exp.responsibilities.map((resp, rIdx) => (
                          <li key={rIdx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Accomplishments */}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="space-y-2.5 pt-2">
                        <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Trophy className="w-3.5 h-3.5" /><SiteText id="ExperiencePage.6b23844b034f">{" Key Accomplishments & Metrics:"}</SiteText></h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {exp.achievements.map((ach, aIdx) => (
                            <div key={aIdx} className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-700 dark:text-amber-300">
                              🏆 {ach}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tech Stack Tags */}
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-2">
                      {exp.technologies.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-brand-500/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* 30% Right Sidebar: Highlights, Core Strengths, Tech Stack Logos (Requirement 16) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: Career Highlights */}
          <div className="p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 shadow-md space-y-4">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-gray-100 dark:border-gray-800">
              <Zap className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider"><SiteText id="ExperiencePage.75abc688ad62">{"Career Highlights"}</SiteText></h3>
            </div>

            <div className="space-y-3">
              {careerHighlights.map((highlight: string, hIdx: number) => (
                <div key={hIdx} className="flex items-start space-x-2.5 text-xs text-gray-700 dark:text-gray-300">
                  <span className="text-[var(--color-primary)] font-bold">●</span>
                  <span>{highlight}</span>
                </div>
              ))}
              {careerHighlights.length === 0 && <p className="text-xs text-gray-500"><SiteText id="ExperiencePage.686ccf9d354d">{"Career highlights will appear here when published."}</SiteText></p>}
            </div>
          </div>

          {/* Card 2: Core Engineering Strengths */}
          <div className="p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 shadow-md space-y-4">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-gray-100 dark:border-gray-800">
              <Target className="w-4 h-4 text-[var(--color-primary)]" />
              <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider"><SiteText id="ExperiencePage.16ef0eaf6363">{"Core Strengths"}</SiteText></h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
                <span className="font-bold text-gray-900 dark:text-white block"><SiteText id="ExperiencePage.177ec7844083">{"Full Stack Execution"}</SiteText></span>
                <span className="text-[11px] text-gray-500"><SiteText id="ExperiencePage.3388f1a92d06">{"React, Next.js, Node.js, Express, REST/GraphQL"}</SiteText></span>
              </div>
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
                <span className="font-bold text-gray-900 dark:text-white block"><SiteText id="ExperiencePage.ea71b5e16ad2">{"AI & Computer Vision"}</SiteText></span>
                <span className="text-[11px] text-gray-500"><SiteText id="ExperiencePage.782e7f360d43">{"YOLOv8, PyTorch, Edge TPU inference, OpenCV"}</SiteText></span>
              </div>
              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
                <span className="font-bold text-gray-900 dark:text-white block"><SiteText id="ExperiencePage.c4998dadb948">{"Embedded IoT Telemetry"}</SiteText></span>
                <span className="text-[11px] text-gray-500"><SiteText id="ExperiencePage.752794bc51e6">{"ESP32, MicroPython, MQTT, Cloud Data Pipelines"}</SiteText></span>
              </div>
            </div>
          </div>

          {/* Card 3: Technology Stack Logos Only (Requirement 16) */}
          <div className="p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider"><SiteText id="ExperiencePage.e321ba3dad9f">{"Tech Stack Logos"}</SiteText></h3>
              </div>
              <span className="text-[10px] font-mono text-gray-400"><SiteText id="ExperiencePage.8a1376fa2f26">{"Logos Only"}</SiteText></span>
            </div>

            {/* Logos Grid (Official react-icons with hover feedback) */}
            <div className="grid grid-cols-4 gap-2.5">
              {techLogos.map((tech, idx) => {
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.15, y: -2 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    title={tech.name}
                    className={`aspect-square rounded-2xl bg-gray-100/70 dark:bg-gray-800/60 bg-white/70 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80 hover:border-brand-500/60 flex items-center justify-center p-2.5 shadow-xs hover:shadow-md cursor-pointer transition-all group/item`}
                  >
                    <IconRenderer icon={tech.icon} name={tech.name} color={tech.color} className="w-6 h-6 transition-transform group-hover/item:scale-110" />
                  </motion.div>
                );
              })}
            </div>

            <div className="pt-2 text-center text-[10px] text-gray-500 font-mono"><SiteText id="ExperiencePage.c87baa09f628">{"Proficient in modern engineering toolchains"}</SiteText></div>
          </div>

        </div>

      </section>

      {/* 3. Contact CTA Before Footer */}
      <ContactCTA
        badge="// explore collaboration"
        title="Looking for a driven Full Stack & AI Engineer?"
        description="I am available for full-time software engineering roles, high-impact consulting, and AI systems engineering."
        primaryBtnText="Get In Touch"
        primaryBtnPath="/contact"
        secondaryBtnText="Explore Projects"
        secondaryBtnPath="/projects"
      />

    </div>
  );
};

