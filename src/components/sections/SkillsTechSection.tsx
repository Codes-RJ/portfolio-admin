import { SiteText } from '../ui/SiteText';
import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useContentSlice } from '../../context/contentSubscriptions';
import { HexagonSkillRadar } from '../ui/BlobDecorators';
import { IconRenderer } from '../ui/IconRenderer';
import { HonorBadgeIcon } from '../ui/HonorBadgeIcon';
import { Cpu, Trophy, ArrowRight, Sparkles } from 'lucide-react';

export const SkillsTechSection: React.FC = () => {
  const achievements = useContentSlice('achievements');
  const skillCategories = useContentSlice('skillCategories');
  const techStack = useContentSlice('techStack');
  const navigate = useNavigate();

  return (
    <section className="py-14 sm:py-16 relative bg-white dark:bg-[#090d16] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] text-xs font-semibold uppercase tracking-wider mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span><SiteText id="SkillsTechSection.ca45ba8d6c7a">{"Skills & Expertise"}</SiteText></span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight"><SiteText id="SkillsTechSection.91220ceeef61">{"Honors, Core Skills & Technologies"}</SiteText></h2>
          </div>

          <Link
            to="/skills"
            className="inline-flex items-center space-x-2 text-xs font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] hover:underline transition-colors"
          >
            <span><SiteText id="SkillsTechSection.8593de92aff1">{"View All Skills"}</SiteText></span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* One shared surface, split into three equal columns on desktop. */}
        <div className="grid grid-cols-1 lg:grid-cols-3 items-stretch overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/50">
          
          {/* Col 1: Honors & Recognitions */}
          <div className="min-w-0 flex flex-col p-5 sm:p-6">
            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-violet-700 dark:text-white" /><SiteText id="SkillsTechSection.0f3fb17754d4">{"Honors & Awards"}</SiteText></h3>
                <span className="text-[11px] text-gray-400"><SiteText id="SkillsTechSection.74cf2bc63fe1">{"Achievements"}</SiteText></span>
              </div>

              <div className="grid flex-1 auto-rows-fr divide-y divide-gray-200 dark:divide-gray-800">
                {achievements.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
                    <Trophy className="w-9 h-9 text-violet-700 dark:text-white mx-auto" />
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300"><SiteText id="SkillsTechSection.8a6cd34114dd">{"Honors coming soon"}</SiteText></p>
                    <p className="text-[10px] text-gray-400"><SiteText id="SkillsTechSection.e63925a7f24a">{"Selected awards and recognitions will appear here."}</SiteText></p>
                  </div>
                ) : (
                  achievements.slice(0, 4).map((ach) => (
                    <motion.div
                      key={ach.id}
                      whileHover={{ x: 4 }}
                      className="min-w-0 flex items-center gap-3 py-3"
                    >
                      <span className="shrink-0 text-violet-700 dark:text-white" aria-hidden="true">
                        <HonorBadgeIcon badge={ach.badge} category={ach.category} title={ach.title} className="w-9 h-9" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                          {ach.link ? <a href={ach.link} target="_blank" rel="noreferrer" className="hover:underline">{ach.title}</a> : ach.title}
                        </h4>
                        <p className="text-[11px] font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] truncate">
                          {ach.organization} · {ach.year}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Col 2: Validated skills radar */}
          <div className="min-w-0 flex items-center justify-center border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 p-5 sm:p-6">
            <HexagonSkillRadar
              onClick={() => navigate('/skills')}
              unboxed
              className="h-full"
              categories={skillCategories}
            />
          </div>

          {/* Col 3: Tech stack icons */}
          <div className="min-w-0 flex flex-col border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 p-5 sm:p-6">
            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--color-primary)]" /><SiteText id="SkillsTechSection.c12c20b00b9c">{"Technology Stack"}</SiteText></h3>
                <span className="text-[11px] text-gray-400"><SiteText id="SkillsTechSection.7c7608de96a3">{"Core Tools"}</SiteText></span>
              </div>

              <div className="grid grid-cols-4 auto-rows-[3.25rem] gap-2 content-center flex-1 py-1">
                {techStack.length === 0 ? (
                  <div className="col-span-4 py-8 text-center text-xs text-gray-400"><SiteText id="SkillsTechSection.0f2298fe09b5">{"No tools added yet."}</SiteText></div>
                ) : (
                  techStack.slice(0, 16).map((tech) => (
                    <motion.div
                      key={tech.id}
                      whileHover={{ scale: 1.14, y: -2 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                      title={tech.name}
                      className="flex items-center justify-center rounded-lg transition-transform group/item"
                    >
                      <IconRenderer
                        icon={tech.icon}
                        name={tech.name}
                        color={tech.color}
                        className="w-8 h-8 transition-transform group-hover/item:scale-110"
                      />
                    </motion.div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
