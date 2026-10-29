import { websiteDefaults } from '../../data/websiteDefaults';
import { IconRenderer } from '../ui/IconRenderer';
import { SiteText } from '../ui/SiteText';
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useContentSlice } from '../../context/contentSubscriptions';
import { PortraitPhotoBlob } from '../ui/BlobDecorators';
import { User, ArrowRight } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const profile = useContentSlice('profile');
  const siteSettings = useContentSlice('siteSettings');

  const domains = siteSettings.website?.homeDomains ?? websiteDefaults.homeDomains;

  return (
    <section id="home-about" className="py-20 relative bg-gray-50/50 dark:bg-[#090d16]/60 border-y border-gray-200/60 dark:border-gray-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] text-xs font-semibold uppercase tracking-wider"
          >
            <User className="w-3.5 h-3.5" />
            <span><SiteText id="AboutSection.fc63ebaddbec">{"Personal Biography"}</SiteText></span>
          </motion.div>

          <motion.h2
            initial={reducedMotion ? false : { opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight"
          ><SiteText id="AboutSection.97b5f34147c1">{"Passionate Engineering at the Intersection of Data & Code"}</SiteText></motion.h2>
        </div>

        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Left: 9:16 Photo Frame with SVG Blob Covering the Back (Requirement) */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            <PortraitPhotoBlob imageSrc={profile.aboutPhotoUrl || profile.avatarUrl || ''} name={profile.name} />
          </motion.div>

          {/* Right: Bio & Details Column - Clean reduced typography */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 space-y-5"
          >
            <div className="space-y-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {(profile.aboutText || [profile.bio || '']).map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Domains Pills Grid */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5"><SiteText id="AboutSection.bbb57afd2e77">{"Core Technical Domains"}</SiteText></h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {domains.map((dom, idx) => {

                  return (
                    <div key={idx} className="p-3 rounded-2xl glass-card border border-gray-200 dark:border-gray-800 flex items-start space-x-3">
                      <div className="p-2 rounded-xl bg-brand-500/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] shrink-0">
                        <IconRenderer icon={dom.icon} className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900 dark:text-white">{dom.title}</div>
                        <div className="text-[11px] text-gray-500 font-mono mt-0.5">{dom.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 dark:hover:bg-brand-900/60 border border-brand-200 dark:border-brand-800/80 transition-colors"
              >
                <span><SiteText id="AboutSection.f0ce0fbfd164">{"Read Complete Career Narrative"}</SiteText></span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};

