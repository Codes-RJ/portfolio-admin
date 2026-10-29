import { SiteText } from '../components/ui/SiteText';
import { IconRenderer } from '../components/ui/IconRenderer';
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useContentSlice } from '../context/contentSubscriptions';
import { PortraitPhotoBlob } from '../components/ui/BlobDecorators';
import { ContactCTA } from '../components/ui/ContactCTA';
import { defaultPageHeaders } from '../data/initialData';
import {
  GraduationCap,
  Heart,
  FileText,
  ArrowRight,
  Compass,
  Milestone,
  Smile,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const profile = useContentSlice('profile');
  const siteSettings = useContentSlice('siteSettings');
  const projects = useContentSlice('projects');
  const certificates = useContentSlice('certificates');
  const researchPapers = useContentSlice('researchPapers');
  const techStack = useContentSlice('techStack');
  const pageHeader = siteSettings.pageHeaders?.about || defaultPageHeaders.about;

  const techILove = techStack;

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      
      {/* 1. Breadcrumb & Hero Section (Requirement 10) */}
      <section className="page-hero page-hero--about space-y-6">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">
          <span>{pageHeader.eyebrow}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Intro Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {pageHeader.title}
            </h1>

            <div className="space-y-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
              <p>
              {pageHeader.subtitle}
              </p>
              <p><SiteText id="AboutPage.c99de808b5e0">{"My philosophy revolves around end-to-end software craftsmanship: from rigorous architecture and type safety to micro-interactions and smooth, accessible user interfaces. I constantly bridge theoretical computer science with pragmatic, production-grade applications."}</SiteText></p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/resume"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl text-xs font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] shadow-lg shadow-brand-600/25 transition-all transform hover:-translate-y-0.5"
              >
                <FileText className="w-4 h-4" />
                <span><SiteText id="AboutPage.f058670f3944">{"View resume"}</SiteText></span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl text-xs font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700/80 border border-gray-200 dark:border-gray-700 shadow-xs transition-all"
              >
                <span><SiteText id="AboutPage.c82a73213ffc">{"Let's Connect"}</SiteText></span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex items-center justify-center">
            <PortraitPhotoBlob imageSrc={profile.aboutPhotoUrl || profile.avatarUrl || ''} name={profile.name} />
          </div>
        </div>
      </section>

      {/* 2. 4-Column Statistics Card (Requirement 10) */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 shadow-lg">
          <div className="p-4 rounded-2xl bg-gray-50/60 dark:bg-gray-800/40 text-center space-y-1">
            <span className="block text-3xl sm:text-4xl font-extrabold text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">
              {projects.length > 0 ? `${projects.length}+` : '0'}
            </span>
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300"><SiteText id="AboutPage.758fd6c9610a">{"Projects Completed"}</SiteText></span>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50/60 dark:bg-gray-800/40 text-center space-y-1">
            <span className="block text-3xl sm:text-4xl font-extrabold text-brand-600 dark:text-brand-400">
              {certificates.length > 0 ? `${certificates.length}+` : '0'}
            </span>
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300"><SiteText id="AboutPage.471502f86c77">{"Certifications"}</SiteText></span>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50/60 dark:bg-gray-800/40 text-center space-y-1">
            <span className="block text-3xl sm:text-4xl font-extrabold text-brand-600 dark:text-brand-400">
              {researchPapers.length > 0 ? `${researchPapers.length}+` : '0'}
            </span>
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300"><SiteText id="AboutPage.15ea40642e51">{"Published Papers"}</SiteText></span>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50/60 dark:bg-gray-800/40 text-center space-y-1">
            <span className="block text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400"><SiteText id="AboutPage.1b2c08a8733d">{"Quality"}</SiteText></span>
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300"><SiteText id="AboutPage.44ad857559c4">{"Engineering Focus"}</SiteText></span>
          </div>
        </div>
      </section>

      {/* 3. What Drives Me (3 values) & My Journey (Vertical timeline) (Requirement 10) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: What Drives Me (3 values) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span><SiteText id="AboutPage.5912782f153a">{"Core Values"}</SiteText></span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight"><SiteText id="AboutPage.0c805b687f20">{"What Drives Me"}</SiteText></h2>

          <div className="space-y-4">
            {(!siteSettings.aboutDrivesMe || siteSettings.aboutDrivesMe.length === 0) ? (
              <div className="p-8 text-center rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 font-mono"><SiteText id="AboutPage.b618b98c7d31">{"Core values will appear here when published."}</SiteText></p>
              </div>
            ) : (
              siteSettings.aboutDrivesMe.map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 4 }}
                  className="p-5 rounded-2xl glass-card border border-gray-200 dark:border-gray-800 space-y-2 shadow-xs"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] flex items-center justify-center font-bold text-sm">
                      0{idx + 1}
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">{item.title}</h3>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed pl-12">
                    {item.desc}
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Right: My Journey (Vertical Timeline) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] text-xs font-semibold uppercase tracking-wider">
            <Milestone className="w-3.5 h-3.5" />
            <span><SiteText id="AboutPage.39c33dc2375f">{"Milestones"}</SiteText></span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight"><SiteText id="AboutPage.611757dd480e">{"My Journey"}</SiteText></h2>

          <div className="relative pl-6 border-l-2 border-brand-500/30 space-y-6">
            {(!siteSettings.aboutJourney || siteSettings.aboutJourney.length === 0) ? (
              <div className="p-8 text-center rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 font-mono"><SiteText id="AboutPage.ea173fe84502">{"Career milestones will appear here when published."}</SiteText></p>
              </div>
            ) : (
              siteSettings.aboutJourney.map((milestone, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[var(--color-primary)] ring-4 ring-white dark:ring-[#090d16]" />
                  <div className="p-4 rounded-2xl glass-card border border-gray-200 dark:border-gray-800 space-y-1">
                    <span className="text-[11px] font-mono font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">
                      {milestone.period}
                    </span>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">{milestone.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{milestone.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </section>

      {/* 4. 3-Column Lower Section (Education, Fun Facts, Tech I Love) (Requirement 10) */}
      <section className="space-y-6 pt-4">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight"><SiteText id="AboutPage.c11b71d1b24f">{"Academic Background, Personality & Tools"}</SiteText></h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* Column 1: Education with Coursework Tags */}
          <div className="p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center space-x-3 pb-3 mb-4 border-b border-gray-100 dark:border-gray-800">
                <GraduationCap className="w-5 h-5 text-[var(--color-primary)]" />
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider"><SiteText id="AboutPage.512ab3c6b986">{"Education"}</SiteText></h3>
              </div>

              <div className="space-y-3">
                {(!profile.education || profile.education.length === 0) ? (
                  <div className="p-6 text-center rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-dashed border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 font-mono"><SiteText id="AboutPage.1c1edf81a8d8">{"No education history added yet."}</SiteText></p>
                  </div>
                ) : (
                  profile.education.map((edu, idx) => (
                    <div key={idx} className="space-y-2">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">{edu.degree}</h4>
                      <p className="text-xs font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">{edu.institution || edu.school}</p>
                      <div className="flex justify-between text-xs text-gray-500 font-mono">
                        <span>{edu.period || edu.year}</span>
                        <span className="font-bold text-emerald-500"><SiteText id="AboutPage.1f84b1f4bb1c">{"GPA: "}</SiteText>{edu.grade || edu.gpa || 'N/A'}</span>
                      </div>
                    </div>
                  ))
                )}

                {/* Relevant Coursework Tags */}
                {siteSettings.education.coursework && siteSettings.education.coursework.length > 0 && (
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2"><SiteText id="AboutPage.9ce8238bd409">{"Relevant Coursework:"}</SiteText></span>
                    <div className="flex flex-wrap gap-1.5">
                      {siteSettings.education.coursework.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-lg bg-brand-500/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] text-[10px] font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Column 2: Fun Facts (5 items) */}
          <div className="p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center space-x-3 pb-3 mb-4 border-b border-gray-100 dark:border-gray-800">
                <Smile className="w-5 h-5 text-amber-500" />
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider"><SiteText id="AboutPage.cad583e44b20">{"Fun Facts"}</SiteText></h3>
              </div>

              <div className="space-y-2.5">
                {(!siteSettings.funFacts || siteSettings.funFacts.length === 0) ? (
                  <div className="p-6 text-center rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-dashed border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 font-mono"><SiteText id="AboutPage.57b0d6284e54">{"No fun facts added yet."}</SiteText></p>
                  </div>
                ) : (
                  siteSettings.funFacts.map((fact, fIdx) => (
                    <div key={fIdx} className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex items-start space-x-2.5 text-xs text-gray-700 dark:text-gray-300">
                      <span className="text-amber-500 shrink-0">✨</span>
                      <span>{fact}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Column 3: Tech I Love (9 items) */}
          <div className="p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center space-x-3 pb-3 mb-4 border-b border-gray-100 dark:border-gray-800">
                <Heart className="w-5 h-5 text-red-500 fill-current" />
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider"><SiteText id="AboutPage.0ed132a66a8d">{"Tech I Love"}</SiteText></h3>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {techILove.map((t, idx) => {
                  return (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.08, y: -2 }}
                      className={`p-3 rounded-2xl bg-gray-100/70 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80 hover:border-brand-500/60 text-center flex flex-col items-center justify-center space-y-1.5 transition-all shadow-xs group/item cursor-pointer`}
                    >
                      <IconRenderer icon={t.icon} name={t.name} color={t.color} className="w-6 h-6 transition-transform group-hover/item:scale-110" />
                      <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200 truncate">{t.name}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Bottom Contact CTA */}
      <ContactCTA
        badge="// let's build the future"
        title="Have a project in mind or want to collaborate?"
        description="I am currently open for full-time software engineering roles, high-impact consulting, and AI research projects."
        primaryBtnText="Get In Touch"
        primaryBtnPath="/contact"
        secondaryBtnText="View Projects"
        secondaryBtnPath="/projects"
      />

    </div>
  );
};

