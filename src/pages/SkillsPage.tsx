import { SiteText } from '../components/ui/SiteText';
import { skillLevel } from '../utils/skills';
import { MotionImage } from '../components/ui/MotionImage';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useContentSlice } from '../context/contentSubscriptions';
import { useTheme } from '../context/ThemeContext';
import { IconRenderer } from '../components/ui/IconRenderer';
import { ContactCTA } from '../components/ui/ContactCTA';
import { defaultPageHeaders } from '../data/initialData';
import {
  Cpu,
  FileText,
  ArrowRight,
  Wrench,
  BookOpen,
} from 'lucide-react';

export const SkillsPage: React.FC = () => {
  const skillCategories = useContentSlice('skillCategories');
  const toolsList = useContentSlice('toolsList');
  const currentlyLearning = useContentSlice('currentlyLearning');
  const projects = useContentSlice('projects');
  const siteSettings = useContentSlice('siteSettings');
  const { isDark } = useTheme();
  const pageHeader = siteSettings.pageHeaders?.skills || defaultPageHeaders.skills;
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('All');

  // Dynamic top strengths extracted from highest proficiency skills
  const allFlattenedSkills = skillCategories.flatMap((c) =>
    (c.skills || []).map((s) => ({
      name: s.name,
      level: skillLevel(s)
    }))
  ).sort((a, b) => b.level - a.level).slice(0, 4);

  const filteredCategories = skillCategories.filter(
    (c) => selectedCategoryTab === 'All' || (c.category || c.title) === selectedCategoryTab
  );

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      
      {/* 1. Breadcrumb & Hero Section (Requirement 14) */}
      <section className="page-hero page-hero--skills grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Heading & Download CV CTA */}
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
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl text-xs font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] shadow-lg shadow-brand-600/25 transition-all transform hover:-translate-y-0.5"
            >
              <FileText className="w-4 h-4" />
              <span><SiteText id="SkillsPage.1e0b2c25f35d">{"View resume"}</SiteText></span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Column: Hero Illustration (Outside the box, sized to match text column) */}
        <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
          <MotionImage
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            src={isDark ? '/assets/Skill Page (Dark).webp' : '/assets/Skill Page (Light).webp'}
            alt="Skills Overview Illustration"
            className="w-full max-w-[480px] h-auto max-h-[360px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
          />
        </div>

      </section>

      <section className="space-y-5">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold"><SiteText id="SkillsPage.66dae7ff043f">{"Skills in practice"}</SiteText></h2>
          <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300"><SiteText id="SkillsPage.7ec9ccccfe3a">{"Skills and percentages below are self-assessments. Explore the related projects for examples of how these technologies are used."}</SiteText></p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {allFlattenedSkills.map(skill => {
            const project = projects.find(item => item.technologies.some(technology => technology.toLowerCase() === skill.name.toLowerCase()));
            return <div key={skill.name} className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800">
              <h3 className="text-base font-bold">{skill.name}</h3>
              {project ? <Link to={`/projects/${project.id}`} className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-[var(--color-primary)] hover:underline dark:text-[var(--color-primary-light)]">{project.title}<ArrowRight className="h-4 w-4 shrink-0" /></Link> : <Link to="/projects" className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--color-primary)] hover:underline dark:text-[var(--color-primary-light)]"><SiteText id="SkillsPage.0e57f7625091">{"Explore project work"}</SiteText></Link>}
            </div>;
          })}
        </div>
      </section>

      {/* 4. 8 Category Cards with 6 Skills Each (Requirement 14) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] uppercase"><SiteText id="SkillsPage.00e4e5eef5a1">{"// self-assessed skills"}</SiteText></span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white"><SiteText id="SkillsPage.920a1c12e312">{"Skill Categories & Proficiencies"}</SiteText></h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {['All', ...skillCategories.map((c) => c.category || c.title)].map((cat) => (
              <button
                  key={cat}
                  onClick={() => setSelectedCategoryTab(cat)}
                  aria-pressed={selectedCategoryTab === cat}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategoryTab === cat
                    ? 'bg-[var(--color-primary)] text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Category Cards Grid */}
        {skillCategories.length === 0 ? (
          <div className="p-16 text-center rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-4 max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] mx-auto flex items-center justify-center">
              <Cpu className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white"><SiteText id="SkillsPage.628b2e03c50c">{"Skills profile coming soon"}</SiteText></h3>
            <p className="text-xs text-gray-500 leading-relaxed"><SiteText id="SkillsPage.4173c1c96524">{"A detailed, self-assessed skills profile will appear here when it is published."}</SiteText></p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCategories.map((group) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-5 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 shadow-md hover:border-[var(--color-primary)]/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2.5 pb-3 mb-3 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-8 h-8 rounded-xl bg-brand-500/10 flex items-center justify-center text-lg shrink-0">
                      <IconRenderer icon={group.icon || group.iconName} name={group.title} />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">{group.category || group.title}</h3>
                  </div>

                  {/* Skills in Category */}
                  <div className="space-y-3">
                    {group.skills.map((skill, sIdx) => {
                      const skillLevel = skill.level ?? (typeof skill.proficiency === 'number' ? skill.proficiency : 0);
                      return (
                        <div key={sIdx} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold text-gray-800 dark:text-gray-200">
                            <span>{skill.name}</span>
                            <span className="font-mono text-[11px] text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">{skillLevel}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                            <div
                              className="h-full bg-linear-to-r from-[var(--color-primary)] to-brand-500 rounded-full"
                              style={{ width: `${skillLevel}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 font-mono text-center">
                  {group.skills.length}<SiteText id="SkillsPage.42ee6595f96c">{" Self-assessed Skills"}</SiteText></div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Tools List */}
      <section className="p-8 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] uppercase"><SiteText id="SkillsPage.aab1987287d7">{"// developer environment"}</SiteText></span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white"><SiteText id="SkillsPage.54040de4c16e">{"Favorite Productivity Tools & Software"}</SiteText></h2>
          </div>

          <Link
            to="/projects"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] hover:underline"
          >
            <span><SiteText id="SkillsPage.95e83f6af248">{"Explore Projects"}</SiteText></span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Tools Grid */}
        {toolsList.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-dashed border-gray-200 dark:border-gray-700 space-y-2">
            <Wrench className="w-6 h-6 text-brand-500/50 mx-auto" />
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300"><SiteText id="SkillsPage.e0fbdf63c992">{"No Custom Tools Added Yet"}</SiteText></p>
            <p className="text-[10px] text-gray-400 font-mono"><SiteText id="SkillsPage.78a6a2674108">{"Add your primary IDEs, CLI tools, and databases in Admin"}</SiteText></p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {toolsList.map((tool, tIdx) => (
              <motion.div
                key={tool.id || tool.name || tIdx}
                whileHover={{ scale: 1.05 }}
                className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/60 flex flex-col items-center justify-center text-center space-y-2"
              >
                <div className="w-8 h-8 rounded-xl bg-brand-500/10 flex items-center justify-center text-lg mx-auto">
                  <IconRenderer icon={tool.icon} name={tool.name} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">{tool.name}</h4>
                  <span className="text-[10px] font-mono text-gray-500">{tool.category || 'Developer Tool'}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 6. Currently Learning Section */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-mono font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] uppercase"><SiteText id="SkillsPage.9ab010ed93eb">{"// continuous growth"}</SiteText></span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white"><SiteText id="SkillsPage.0dd4b4d3de89">{"Currently Learning & Researching"}</SiteText></h2>
        </div>

        {currentlyLearning.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-dashed border-gray-200 dark:border-gray-700 space-y-2">
            <BookOpen className="w-6 h-6 text-brand-500/50 mx-auto" />
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300"><SiteText id="SkillsPage.75ee8d69a810">{"Continuous Learning Roadmap Ready"}</SiteText></p>
            <p className="text-[10px] text-gray-400 font-mono"><SiteText id="SkillsPage.405ab158aa66">{"Add upcoming technologies you are studying in Admin"}</SiteText></p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {currentlyLearning.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 flex flex-col justify-between space-y-3 shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-500/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] border border-brand-500/20 inline-block">
                      {item.status}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-brand-500/10 flex items-center justify-center text-sm border border-brand-500/20">
                      <IconRenderer icon={item.icon} name={item.topic || item.title} className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">{item.topic || item.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between text-[11px] font-mono text-gray-500">
                    <span><SiteText id="SkillsPage.4664827f8e89">{"Progress"}</SiteText></span>
                    <span className="font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">{item.progress ?? 0}%</span>
                  </div>
                <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-[var(--color-primary)] to-brand-500 rounded-full"
                    style={{ width: `${item.progress ?? 0}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </section>

      {/* 7. Bottom Contact CTA */}
      <ContactCTA
        badge="// discuss technical stacks"
        title="Looking for specialized full-stack or AI expertise?"
        description="I bring hands-on experience in production environments, microservices, and modern web application development."
        primaryBtnText="Let's Talk"
        primaryBtnPath="/contact"
        secondaryBtnText="Explore Projects"
        secondaryBtnPath="/projects"
      />

    </div>
  );
};

