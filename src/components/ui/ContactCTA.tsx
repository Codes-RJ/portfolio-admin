import { useContentSlice } from '../../context/contentSubscriptions';
import { useLocation } from 'react-router-dom';
import { ResponsiveImage } from './ResponsiveImage';
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { ArrowRight } from 'lucide-react';

interface ContactCTAProps {
  badge?: string;
  title?: string;
  description?: string;
  primaryBtnText?: string;
  primaryBtnPath?: string;
  secondaryBtnText?: string;
  secondaryBtnPath?: string;
  className?: string;
}

export const ContactCTA: React.FC<ContactCTAProps> = ({
  badge = "// let's build the future",
  title = 'Have a project in mind or want to collaborate?',
  description = 'I am currently open for full-time software engineering roles, high-impact consulting, and AI research projects.',
  primaryBtnText = 'Get In Touch',
  primaryBtnPath = '/contact',
  secondaryBtnText = 'View Projects',
  secondaryBtnPath = '/projects',
  className = '',
}) => {
  const siteSettings = useContentSlice('siteSettings');
  const { pathname } = useLocation();
  const effectivePath = pathname.replace(/^\/preview/, '') || '/';
  const overrides = siteSettings.website?.callsToAction[pathname] || siteSettings.website?.callsToAction[effectivePath];
  if (overrides) ({ badge, title, description, primaryBtnText, primaryBtnPath, secondaryBtnText, secondaryBtnPath } = overrides);
  const { isDark } = useTheme();

  return (
    <section
      className={`relative rounded-3xl overflow-hidden p-8 sm:p-12 border border-brand-200/80 dark:border-brand-500/20 bg-linear-to-br from-brand-50/90 via-white to-brand-50/90 dark:from-brand-950/40 dark:via-[#090d16] dark:to-brand-950/30 text-center space-y-6 shadow-xl dark:shadow-2xl transition-colors duration-300 ${className}`}
    >
      {/* Background Dot Map Overlay */}
      <div className="absolute inset-0 opacity-15 dark:opacity-20 pointer-events-none flex items-center justify-center">
        <ResponsiveImage
          src={isDark ? '/assets/World_map_(purple_dots).webp' : '/assets/World_map_(blue_dots).webp'}
          alt="World dots"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-4">
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-brand-100/90 dark:bg-[var(--color-primary)]/20 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] border border-brand-200 dark:border-brand-500/30">
          {badge}
        </span>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {title}
        </h2>

        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl mx-auto">
          {description}
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link
            to={primaryBtnPath}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-xs font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] shadow-lg shadow-brand-600/30 transition-all transform hover:-translate-y-0.5"
          >
            <span>{primaryBtnText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {secondaryBtnText && secondaryBtnPath && (
            <Link
              to={secondaryBtnPath}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-xs font-semibold text-gray-800 dark:text-white bg-white dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/20 border border-gray-200 dark:border-white/20 shadow-xs transition-all transform hover:-translate-y-0.5"
            >
              <span>{secondaryBtnText}</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};
