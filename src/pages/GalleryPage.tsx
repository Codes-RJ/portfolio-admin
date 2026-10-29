import { SiteText } from '../components/ui/SiteText';
import { ResponsiveImage } from '../components/ui/ResponsiveImage';
import React from 'react';
import { useContentSlice } from '../context/contentSubscriptions';
import { Image } from 'lucide-react';
import { ContactCTA } from '../components/ui/ContactCTA';

export const GalleryPage: React.FC = () => {
  const gallery = useContentSlice('gallery');

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider">
          <Image className="w-3.5 h-3.5" />
          <span><SiteText id="GalleryPage.4b5db6b18c52">{"Visual Showcase"}</SiteText></span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight"><SiteText id="GalleryPage.7d44296188f8">{"Media & Hackathon Gallery"}</SiteText></h1>
        <p className="text-sm text-gray-600 dark:text-gray-400"><SiteText id="GalleryPage.94d5fe95364e">{"Selected highlights from events, talks, design work, and technical collaborations."}</SiteText></p>
      </div>

      {gallery.length === 0 ? (
        <div className="p-16 text-center rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-4 max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] mx-auto flex items-center justify-center">
            <Image className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white"><SiteText id="GalleryPage.c95e54f997b3">{"Media Gallery Ready"}</SiteText></h3>
          <p className="text-xs text-gray-500 leading-relaxed"><SiteText id="GalleryPage.e1500d2bf618">{"No gallery items have been published yet. Check back soon for new visual highlights."}</SiteText></p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gallery.map((item) => (
            <div key={item.id} className="rounded-3xl glass-card overflow-hidden border border-gray-200 dark:border-gray-800">
              <div className="relative aspect-video overflow-hidden">
                <ResponsiveImage src={item.imageUrl} alt={item.title} loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-black/60 text-white backdrop-blur-md">
                  {item.category}
                </span>
              </div>
              <div className="p-6 space-y-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Contact CTA */}
      <ContactCTA
        badge="// connect & create"
        title="Want to build something thoughtful together?"
        description="Get in touch to discuss engineering, design, research, or collaboration opportunities."
        primaryBtnText="Let's Talk"
        primaryBtnPath="/contact"
        secondaryBtnText="Explore Projects"
        secondaryBtnPath="/projects"
      />
    </div>
  );
};
