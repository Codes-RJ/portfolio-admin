import { SiteText } from '../ui/SiteText';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import React from 'react';
import { ContactForm } from '../ui/ContactForm';
import { useContentSlice } from '../../context/contentSubscriptions';
import { useTheme } from '../../context/ThemeContext';
import { Mail, CheckCircle2, Clock, MapPin, Globe } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const profile = useContentSlice('profile');
  const { isDark } = useTheme();

  return (
    <section className="py-20 relative bg-white dark:bg-[#090d16] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] text-xs font-semibold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            <span><SiteText id="ContactSection.3ee6cddb8ee0">{"Get In Touch"}</SiteText></span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight"><SiteText id="ContactSection.d4bd4bb7f356">{"Let's Build Something Extraordinary Together"}</SiteText></h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400"><SiteText id="ContactSection.10ac8172f9bd">{"Have a project, job opportunity, consulting inquiry, or technical question? Send a message directly."}</SiteText></p>
        </div>

        {/* 3-Column Layout (Requirement 9) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: World Map Graphic (Requirement 9) */}
          <div className="order-3 lg:order-1 lg:col-span-4 p-5 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-800/80">
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-[var(--color-primary)] dark:text-[var(--color-primary-light)]" /><SiteText id="ContactSection.a803f50021a1">{"Global Reach & Connectivity"}</SiteText></h3>
                <span className="text-[10px] font-mono text-emerald-500 font-bold"><SiteText id="ContactSection.ab99e81e4dcf">{"● Worldwide"}</SiteText></span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4"><SiteText id="ContactSection.a67b8cd748e7">{"Collaborating remotely with clients, engineering teams, and open-source contributors across the globe."}</SiteText></p>
            </div>

            {/* Dynamic Map Graphic */}
            <div className="relative w-full rounded-2xl overflow-hidden bg-brand-500/5 dark:bg-brand-950/20 p-2 my-auto border border-brand-500/20">
              <ResponsiveImage
                src={isDark ? '/assets/World_map_(purple_dots).webp' : '/assets/World_map_(blue_dots).webp'}
                alt="World Map Reach"
                width={1920}
                height={1200}
                loading="lazy"
                decoding="async"
                className="w-full aspect-[8/5] object-contain rounded-xl hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80 text-center">
              <span className="text-[11px] font-mono text-gray-500"><SiteText id="ContactSection.0a6181a89b0a">{"Based in India · Open to Remote & Relocation"}</SiteText></span>
            </div>
          </div>

          {/* Center Column: Full Contact Form (Requirement 9) */}
          <div className="order-1 lg:order-2 lg:col-span-5 p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 shadow-xl flex flex-col justify-between">
            <ContactForm variant="home" />

          </div>

          {/* Right Column: Direct Communication (Requirement 9) */}
          <div className="order-2 lg:order-3 lg:col-span-3 p-5 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center space-x-3 pb-3 mb-3 border-b border-gray-100 dark:border-gray-800/80">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] flex items-center justify-center text-lg">
                  📬
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider"><SiteText id="ContactSection.fdee706ec7ad">{"Direct Communication"}</SiteText></h3>
                  <p className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {profile.availabilityStatus}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-1 text-xs">
                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/60">
                  <div className="flex items-center space-x-2 text-gray-400 mb-1">
                    <Clock className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    <span className="text-[10px] uppercase font-bold"><SiteText id="ContactSection.8f6bed11e7d7">{"Response Time:"}</SiteText></span>
                  </div>
                  <span className="font-bold text-gray-800 dark:text-white text-xs">{profile.responseTime}</span>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/60">
                  <div className="flex items-center space-x-2 text-gray-400 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    <span className="text-[10px] uppercase font-bold"><SiteText id="ContactSection.bbdffe25dc7d">{"Location:"}</SiteText></span>
                  </div>
                  <span className="font-bold text-gray-800 dark:text-white text-xs">{profile.location}</span>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/60">
                  <div className="flex items-center space-x-2 text-gray-400 mb-1">
                    <Mail className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    <span className="text-[10px] uppercase font-bold"><SiteText id="ContactSection.d849c8e4e08f">{"Direct Email:"}</SiteText></span>
                  </div>
                  <a
                    href={`mailto:${profile.socials.email}`}
                    className="font-mono font-bold text-xs text-[var(--color-primary)] dark:text-[var(--color-primary-light)] hover:underline block truncate"
                  >
                    {profile.socials.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80 text-center">
              <span className="text-[11px] text-gray-500"><SiteText id="ContactSection.2868f7d0f861">{"I usually respond within 24 hours"}</SiteText></span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

