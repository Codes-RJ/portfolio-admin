import { useContentSlice } from '../context/contentSubscriptions';
import { websiteDefaults } from '../data/websiteDefaults';
import React, { ComponentType, lazy, Suspense, useEffect, useRef, useState } from 'react';
import { HeroSection } from '../components/sections/HeroSection';

const AboutSection = lazy(() => import('../components/sections/HomePreviews').then((m) => ({ default: m.HomeAboutPreview })));
const ProjectsSection = lazy(() => import('../components/sections/ProjectsSection').then((m) => ({ default: m.ProjectsSection })));
const ExperienceSection = lazy(() => import('../components/sections/HomePreviews').then((m) => ({ default: m.HomeExperiencePreview })));
const SkillsTechSection = lazy(() => import('../components/sections/HomePreviews').then((m) => ({ default: m.HomeSkillsPreview })));
const CertificatesSection = lazy(() => import('../components/sections/HomePreviews').then((m) => ({ default: m.HomeCertificatesPreview })));
const ContactSection = lazy(() => import('../components/sections/HomePreviews').then((m) => ({ default: m.HomeContactPreview })));
const AnimatedContent = lazy(() => import('../components/ui/AnimatedContent'));

// Reserve the current bundled section footprints at mobile and desktop widths.
// Reprofile these values when the published content changes substantially.
const loadingHeights: Record<string, string> = {
  about: 'min-h-[750px] md:min-h-[540px]',
  projects: 'min-h-[1800px] md:min-h-[1150px]',
  experience: 'min-h-[620px] md:min-h-[540px]',
  skills: 'min-h-[750px] md:min-h-[600px]',
  certificates: 'min-h-[650px] md:min-h-[400px]',
  contact: 'min-h-[450px] md:min-h-[400px]',
};
const loadingCards: Record<string, number> = { about: 1, projects: 3, experience: 2, skills: 3, certificates: 3, contact: 1 };

const DeferredSection: React.FC<{ component: ComponentType; sectionKey: string }> = ({ component: Component, sectionKey }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(() =>
    !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsNearViewport(true);
        observer.disconnect();
      }
    }, { rootMargin: '500px 0px' });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef}>
      {isNearViewport ? <Suspense fallback={<SectionSkeleton sectionKey={sectionKey} />}><AnimatedContent><Component /></AnimatedContent></Suspense> : <SectionSkeleton sectionKey={sectionKey} />}
    </div>
  );
};

const SectionSkeleton: React.FC<{ sectionKey: string }> = ({ sectionKey }) => (
  <div aria-hidden="true" className={`py-16 px-4 sm:px-6 lg:px-8 animate-pulse motion-reduce:animate-none ${loadingHeights[sectionKey] || 'min-h-[620px]'}`}>
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="h-5 w-32 rounded-full bg-gray-200 dark:bg-gray-800" />
      <div className="h-10 w-3/5 max-w-lg rounded-2xl bg-gray-200 dark:bg-gray-800" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-5">
        {Array.from({ length: loadingCards[sectionKey] || 3 }, (_, item) => <div key={item} className="h-44 rounded-3xl bg-gray-200/80 dark:bg-gray-800/70" />)}
      </div>
    </div>
  </div>
);

export const HomePage: React.FC = () => {
  const siteSettings = useContentSlice('siteSettings');
  const configuredSections = siteSettings.website?.homeSections ?? websiteDefaults.homeSections;
  // Promote selected work for the original bundled order. An edited CMS order wins.
  const sections = configuredSections.join(',') === websiteDefaults.homeSections.join(',')
    ? ['hero', 'projects', 'about', 'experience', 'skills', 'certificates', 'contact']
    : configuredSections;
  const components: Record<string, ComponentType> = { about: AboutSection, projects: ProjectsSection, experience: ExperienceSection, skills: SkillsTechSection, certificates: CertificatesSection, contact: ContactSection };
  return <div className="space-y-0">{sections.map((key) => key === 'hero' ? <HeroSection key={key} /> : <DeferredSection key={key} component={components[key]} sectionKey={key} />)}</div>;
};
