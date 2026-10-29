import { websiteDefaults } from '../../data/websiteDefaults';
import { SiteText } from '../ui/SiteText';
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Instagram, Mail } from 'lucide-react';
import { useContentSlice } from '../../context/contentSubscriptions';

export const Footer: React.FC = () => {
  const profile = useContentSlice('profile');
  const siteSettings = useContentSlice('siteSettings');
  const website = { ...websiteDefaults, ...siteSettings.website };
  const quickLinks = website.footerLinks.filter(link => !/^\/(admin|login)(\/|$)/.test(link.path));

  return (
    <footer className="bg-white dark:bg-[#060910] border-t border-gray-200 dark:border-gray-800/80 pt-16 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-200 dark:border-gray-800/60">
          
          {/* Column 1: Brand & Socials */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold font-mono text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">{website.brandSymbol}</span>
              <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">{website.brandName}<span className="text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">{website.brandSuffix}</span>
              </span>
            </Link>
            
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs">{website.footerDescription}</p>

            <div className="flex items-center gap-2 pt-2 flex-wrap">
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noreferrer"
                title="GitHub"
                aria-label="GitHub profile"
                className="w-11 h-11 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary-light)] hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                title="LinkedIn"
                aria-label="LinkedIn profile"
                className="w-11 h-11 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary-light)] hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={profile.socials.twitter}
                target="_blank"
                rel="noreferrer"
                title="Twitter / X"
                aria-label="Twitter / X profile"
                className="w-11 h-11 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary-light)] hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              {profile.socials.instagram && <a
                href={profile.socials.instagram}
                target="_blank"
                rel="noreferrer"
                title="Instagram"
                aria-label="Instagram profile"
                className="w-11 h-11 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary-light)] hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>}
              <a
                href={`mailto:${profile.socials.email}`}
                title="Email"
                aria-label="Send an email"
                className="w-11 h-11 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary-light)] hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
              {(['kaggle', 'leetcode'] as const).map((network) => profile.socials[network] && <a key={network} href={profile.socials[network]} target="_blank" rel="noreferrer" className="text-xs font-semibold hover:underline">{network === 'kaggle' ? 'Kaggle' : 'LeetCode'}</a>)}
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4"><SiteText id="Footer.3db65f8c2a7d">{"Navigation"}</SiteText></h4>
            <ul className="space-y-2.5 text-xs">
              {quickLinks.slice(0, 5).map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary-light)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Secondary Links */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4"><SiteText id="Footer.3b73900b8d29">{"Explore"}</SiteText></h4>
            <ul className="space-y-2.5 text-xs">
              {quickLinks.slice(5).map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary-light)] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4"><SiteText id="Footer.727fa290a135">{"Get in Touch"}</SiteText></h4>
            <ul className="space-y-2.5 text-xs text-gray-600 dark:text-gray-400">
              <li>
                <span className="block text-gray-400 dark:text-gray-500 text-[10px] uppercase font-bold"><SiteText id="Footer.969ccbd3cf63">{"Email"}</SiteText></span>
                <a href={`mailto:${profile.socials.email}`} className="hover:text-[var(--color-primary)] dark:hover:text-white transition-colors">
                  {profile.socials.email}
                </a>
              </li>
              <li>
                <span className="block text-gray-400 dark:text-gray-500 text-[10px] uppercase font-bold"><SiteText id="Footer.15b61974b270">{"Location"}</SiteText></span>
                <span>{profile.location}</span>
              </li>
              <li>
                <span className="block text-gray-400 dark:text-gray-500 text-[10px] uppercase font-bold"><SiteText id="Footer.12f67f8539c4">{"Availability"}</SiteText></span>
                <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {profile.availabilityStatus}
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
          <p><SiteText id="Footer.fa8cb5660331">{"© 2026 Rohan Jaiswal. All rights reserved."}</SiteText></p>

          <div className="flex items-center space-x-6">
            <Link to="/privacy" className="hover:text-[var(--color-primary)] dark:hover:text-white transition-colors"><SiteText id="Footer.506ff3946215">{"Privacy Policy"}</SiteText></Link>
            <Link to="/terms" className="hover:text-[var(--color-primary)] dark:hover:text-white transition-colors"><SiteText id="Footer.173f5f9f26b4">{"Terms & Conditions"}</SiteText></Link>
            <span className="text-gray-400">{website.footerCredit}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
