import { SiteText } from '../ui/SiteText';
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useContentSlice } from '../../context/contentSubscriptions';
import { Experience } from '../../data/initialData';
import { IconRenderer } from '../ui/IconRenderer';
import { Briefcase, Calendar, ArrowRight, MapPin } from 'lucide-react';

interface CardProps {
  exp: Experience;
  isAbove?: boolean;
}

const ExperienceCard: React.FC<CardProps> = ({ exp, isAbove = false }) => {
  return (
    <motion.div
      whileHover={{ y: isAbove ? -4 : 4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      className="w-full p-4 sm:p-5 rounded-2xl glass-card border border-gray-200/80 dark:border-gray-800 shadow-xl hover:border-[var(--color-primary)]/50 hover:shadow-brand-600/15 transition-all space-y-3 group text-left"
    >
      {/* Header Row: Logo Avatar + Type + Period */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] flex items-center justify-center text-sm font-bold border border-brand-500/20 group-hover:scale-110 transition-transform shrink-0">
            <IconRenderer icon={exp.logo} name={exp.company} className="w-4 h-4" />
          </div>
          {exp.type && (
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 truncate max-w-[80px]">
              {exp.type}
            </span>
          )}
        </div>

        <span className="text-[11px] font-mono font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] flex items-center gap-1 bg-brand-500/10 px-2 py-0.5 rounded-full shrink-0">
          <Calendar className="w-3 h-3" />
          {exp.period}
        </span>
      </div>

      {/* Role Title & Company */}
      <div>
        <h3 className="text-sm font-extrabold text-gray-900 dark:text-white group-hover:text-[var(--color-primary)] dark:group-hover:text-[var(--color-primary-light)] transition-colors leading-snug line-clamp-1">
          {exp.title}
        </h3>
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300 font-medium mt-1">
          <span className="truncate font-semibold">{exp.company}</span>
          {exp.location && (
            <span className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-0.5 shrink-0">
              <MapPin className="w-3 h-3" />
              {exp.location.split(',')[0]}
            </span>
          )}
        </div>
      </div>

      {/* Tech Stack Pills */}
      {exp.technologies && exp.technologies.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-gray-100 dark:border-gray-800/80">
          {exp.technologies.slice(0, 3).map((tech, tIdx) => (
            <span
              key={tIdx}
              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-gray-50 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/60 text-gray-600 dark:text-gray-400"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export const ExperienceSection: React.FC = () => {
  const experiences = useContentSlice('experiences');

  return (
    <section className="py-24 relative bg-gray-50/60 dark:bg-[#090d16]/70 border-y border-gray-200/70 dark:border-gray-800/70 overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-[var(--color-primary)]/10 dark:bg-[var(--color-primary)]/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[250px] bg-brand-600/10 dark:bg-brand-600/15 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/70 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] text-xs font-semibold uppercase tracking-wider mb-3 border border-brand-200/80 dark:border-brand-800/80 shadow-xs">
              <Briefcase className="w-3.5 h-3.5" />
              <span><SiteText id="ExperienceSection.557ce5562a3a">{"Career Trajectory"}</SiteText></span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight"><SiteText id="ExperienceSection.ed738ed803f9">{"Experience Timeline"}</SiteText></h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 font-mono"><SiteText id="ExperienceSection.d00a80368f1e">{"// high-impact roles in AI systems, full-stack architecture & distributed cloud"}</SiteText></p>
          </div>

          <Link
            to="/experience"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 dark:hover:bg-brand-900/60 border border-brand-200 dark:border-brand-800/80 transition-all group"
          >
            <span><SiteText id="ExperienceSection.67caa1fabc9d">{"Full Deliverables & Metrics"}</SiteText></span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {experiences.length === 0 ? (
          <div className="p-16 text-center rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-4 max-w-xl mx-auto my-8">
            <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] mx-auto flex items-center justify-center">
              <Briefcase className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white"><SiteText id="ExperienceSection.4a7bf673bec0">{"Experience details coming soon"}</SiteText></h3>
            <p className="text-xs text-gray-500 leading-relaxed"><SiteText id="ExperienceSection.d1fcf6dc2b14">{"Professional milestones and selected accomplishments will appear here when published."}</SiteText></p>
          </div>
        ) : (
          <>
            {/* 1. Desktop Alternating Horizontal Timeline (>= md) */}
            <div className="hidden md:block relative py-6">
              
              {/* Top Row: Cards for index 1 and index 3 */}
              <div className="grid grid-cols-4 gap-6 items-end">
                <div /> {/* Column 0 Empty */}
                
                {/* Column 1: Item #2 */}
                {experiences[1] && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="flex flex-col items-center"
                  >
                    <ExperienceCard exp={experiences[1]} isAbove={true} />
                    {/* Stem pointing down to node */}
                    <div className="w-0.5 h-8 bg-linear-to-b from-[var(--color-primary)] to-brand-400/30" />
                  </motion.div>
                )}

                <div /> {/* Column 2 Empty */}

                {/* Column 3: Item #4 */}
                {experiences[3] && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.35 }}
                    className="flex flex-col items-center"
                  >
                    <ExperienceCard exp={experiences[3]} isAbove={true} />
                    {/* Stem pointing down to node */}
                    <div className="w-0.5 h-8 bg-linear-to-b from-[var(--color-primary)] to-brand-400/30" />
                  </motion.div>
                )}
              </div>

              {/* Center Row: Continuous Axis Bar + 4 Numbered Milestone Nodes */}
              <div className="relative my-2 py-2 flex items-center">
                {/* Horizontal Axis Bar */}
                <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-linear-to-r from-[var(--color-primary)]/20 via-[var(--color-primary)] to-brand-400/20 rounded-full shadow-xs shadow-brand-500/25" />

                {/* 4 Evenly Spaced Milestone Nodes */}
                <div className="grid grid-cols-4 gap-6 w-full relative z-10">
                  {experiences.slice(0, 4).map((_, idx) => {
                    const isCurrent = idx === 0;
                    return (
                      <div key={idx} className="flex items-center justify-center">
                        <div className="relative flex items-center justify-center">
                          {isCurrent && (
                            <span className="absolute w-12 h-12 rounded-full bg-[var(--color-primary)]/30 animate-ping pointer-events-none" />
                          )}
                          <div
                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono font-bold text-xs shadow-lg transition-all ${
                              isCurrent
                                ? 'bg-[var(--color-primary)] text-white border-white dark:border-brand-300 shadow-brand-600/50 ring-4 ring-brand-500/25'
                                : 'bg-white dark:bg-[#0f172a] text-[var(--color-primary)] dark:text-[var(--color-primary-light)] border-[var(--color-primary)] hover:scale-110'
                            }`}
                          >
                            {idx + 1}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Row: Cards for index 0 and index 2 */}
              <div className="grid grid-cols-4 gap-6 items-start">
                {/* Column 0: Item #1 (Current) */}
                {experiences[0] && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 }}
                    className="flex flex-col items-center"
                  >
                    {/* Stem pointing up to node */}
                    <div className="w-0.5 h-8 bg-linear-to-b from-brand-400/30 to-[var(--color-primary)]" />
                    <ExperienceCard exp={experiences[0]} isAbove={false} />
                  </motion.div>
                )}

                <div /> {/* Column 1 Empty */}

                {/* Column 2: Item #3 */}
                {experiences[2] && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.25 }}
                    className="flex flex-col items-center"
                  >
                    {/* Stem pointing up to node */}
                    <div className="w-0.5 h-8 bg-linear-to-b from-brand-400/30 to-[var(--color-primary)]" />
                    <ExperienceCard exp={experiences[2]} isAbove={false} />
                  </motion.div>
                )}

                <div /> {/* Column 3 Empty */}
              </div>

            </div>

            {/* 2. Mobile Vertical Alternating Timeline (< md) */}
            <div className="md:hidden space-y-6 relative pl-6 border-l-2 border-brand-500/30 ml-2">
              {experiences.map((exp, idx) => (
                <motion.div
                  key={exp.id || idx}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative"
                >
                  {/* Milestone Node on vertical axis */}
                  <div className="absolute -left-[33px] top-4 w-6 h-6 rounded-full bg-[var(--color-primary)] border-2 border-white dark:border-brand-300 text-white flex items-center justify-center text-[10px] font-bold font-mono shadow-md">
                    {idx + 1}
                  </div>
                  
                  <ExperienceCard exp={exp} />
                </motion.div>
              ))}
            </div>
          </>
        )}

      </div>
    </section>
  );
};


