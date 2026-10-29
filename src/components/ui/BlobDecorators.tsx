import { skillLevel } from '../../utils/skills';
import { ResponsiveImage } from './ResponsiveImage';
import React from 'react';
import { motion } from 'framer-motion';
import type { SkillCategoryGroup } from '../../data/initialData';

// SVG blob paths extracted from Blob.svg
const BLOB_PATHS = [
  "M40.5,-68.1C51.8,-63.7,59.6,-51.3,66.6,-38.7C73.5,-26,79.4,-13,77.3,-1.3C75.1,10.5,64.8,21,56.7,31.6C48.6,42.3,42.8,53.2,33.7,61.9C24.7,70.6,12.3,77.1,-1.1,79C-14.6,81,-29.2,78.4,-43,72.4C-56.8,66.5,-69.8,57.1,-73.9,44.5C-77.9,31.9,-73,15.9,-71.3,1C-69.5,-13.9,-70.8,-27.8,-64.2,-36C-57.6,-44.2,-43,-46.8,-31,-50.7C-19,-54.7,-9.5,-60.1,2.6,-64.5C14.6,-69,29.3,-72.5,40.5,-68.1Z",
  "M34.4,-58.9C46.9,-52.4,60.8,-47.8,65.7,-38.3C70.7,-28.8,66.6,-14.4,63.8,-1.6C61,11.2,59.5,22.3,56.6,35.3C53.7,48.4,49.4,63.3,39.8,73.8C30.1,84.2,15,90.3,1.7,87.4C-11.7,84.5,-23.4,72.7,-32.3,61.7C-41.1,50.8,-47.2,40.7,-50.9,30.6C-54.6,20.5,-56,10.2,-60.8,-2.8C-65.7,-15.8,-74,-31.7,-70.3,-41.9C-66.7,-52.2,-51.2,-56.9,-37.4,-62.7C-23.7,-68.5,-11.9,-75.4,-0.4,-74.6C11,-73.8,22,-65.4,34.4,-58.9Z",
  "M40.8,-72.8C51.5,-64.6,57.8,-50.8,59.3,-37.7C60.8,-24.7,57.6,-12.3,60,1.4C62.4,15.1,70.6,30.3,69.4,43.9C68.2,57.6,57.8,69.7,44.6,73.3C31.5,76.9,15.8,71.9,0.2,71.6C-15.4,71.3,-30.8,75.6,-44.4,72.4C-58.1,69.1,-69.9,58.2,-78.2,44.8C-86.5,31.5,-91.1,15.7,-91.6,-0.3C-92,-16.3,-88.3,-32.5,-79.8,-45.5C-71.3,-58.5,-58.1,-68.2,-44.1,-74.5C-30,-80.8,-15,-83.7,0,-83.7C15.1,-83.8,30.2,-81.1,40.8,-72.8Z",
  "M34.7,-63.5C42.4,-55.6,44.4,-41.2,49.3,-29.5C54.2,-17.9,62,-8.9,64.8,1.6C67.6,12.2,65.4,24.3,61.4,37.5C57.4,50.7,51.6,65,41.1,68.6C30.5,72.2,15.3,65,-0.5,65.9C-16.2,66.7,-32.5,75.6,-43.6,72.3C-54.6,69.1,-60.5,53.7,-66.6,39.6C-72.6,25.6,-78.8,12.8,-79.1,-0.2C-79.3,-13.1,-73.7,-26.2,-63.9,-33.7C-54.1,-41.2,-40,-43.1,-28.7,-49C-17.3,-54.8,-8.7,-64.6,2.4,-68.8C13.5,-72.9,26.9,-71.4,34.7,-63.5Z",
  "M35.6,-61C45.9,-55.6,54.1,-45.8,63.9,-34.9C73.8,-23.9,85.4,-12,85.4,0C85.4,12,73.8,24,65.6,37.6C57.3,51.3,52.3,66.7,42,71.4C31.6,76.2,15.8,70.3,1.5,67.7C-12.8,65,-25.6,65.7,-33,59.3C-40.5,52.9,-42.7,39.4,-51.9,28.3C-61.1,17.3,-77.4,8.6,-82.9,-3.2C-88.4,-14.9,-83,-29.9,-74,-41.4C-65.1,-52.9,-52.5,-61,-39.5,-64.9C-26.6,-68.8,-13.3,-68.6,-0.3,-68.1C12.6,-67.5,25.2,-66.5,35.6,-61Z",
  "M33.9,-54.1C48.3,-50.4,67.3,-50.2,74.1,-41.7C80.8,-33.2,75.3,-16.6,71.7,-2.1C68.1,12.5,66.5,25,59.4,32.9C52.4,40.7,39.8,43.9,29,47.7C18.2,51.5,9.1,55.8,-0.9,57.3C-10.8,58.8,-21.6,57.5,-34.8,55.1C-48,52.7,-63.6,49.2,-67.1,39.8C-70.6,30.4,-62.1,15.2,-58.5,2.1C-54.9,-11,-56.1,-22.1,-53.5,-33.1C-50.9,-44.1,-44.5,-55.1,-35,-61.5C-25.4,-67.9,-12.7,-69.8,-1.5,-67.2C9.8,-64.6,19.5,-57.7,33.9,-54.1Z",
  "M32.7,-56.8C42.3,-51.1,50.1,-42.2,53,-32.3C55.8,-22.3,53.7,-11.1,55.7,1.1C57.6,13.4,63.7,26.9,60.3,35.9C56.9,44.8,44,49.4,32.4,53.3C20.8,57.3,10.4,60.6,-2.5,64.9C-15.4,69.3,-30.8,74.6,-42.6,70.8C-54.5,67,-62.8,54,-66.4,40.7C-70,27.4,-68.9,13.7,-67.1,1.1C-65.2,-11.6,-62.6,-23.1,-54.6,-28.7C-46.5,-34.3,-32.9,-34,-22.9,-39.4C-12.9,-44.9,-6.5,-56.3,2.5,-60.7C11.5,-65,23,-62.5,32.7,-56.8Z"
];

// Multi-layered animated Blob for Hero intro section (Requirement 2)
export const LayeredHeroBlob: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full max-w-[440px] aspect-square flex items-center justify-center ${className}`}>
      {/* Glow aura */}
      <div className="absolute inset-0 bg-linear-to-tr from-brand-500/20 via-brand-500/25 to-pink-500/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />

      {/* Layer 1: Base rotating ambient blob */}
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full text-brand-500/20 dark:text-brand-600/30 filter drop-shadow-lg"
        animate={{ rotate: 360, scale: [1, 1.05, 0.98, 1] }}
        transition={{ rotate: { duration: 25, repeat: Infinity, ease: 'linear' }, scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' } }}
      >
        <path fill="currentColor" d={BLOB_PATHS[2]} transform="translate(100 100)" />
      </motion.svg>

      {/* Layer 2: Counter-rotating vibrant gradient blob */}
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute inset-2 w-[92%] h-[92%] text-brand-600/35 dark:text-brand-500/40"
        animate={{ rotate: -360, scale: [1, 0.95, 1.04, 1] }}
        transition={{ rotate: { duration: 20, repeat: Infinity, ease: 'linear' }, scale: { duration: 7, repeat: Infinity, ease: 'easeInOut' } }}
      >
        <defs>
          <linearGradient id="heroBlobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#9333ea" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <path fill="url(#heroBlobGrad)" d={BLOB_PATHS[0]} transform="translate(100 100)" />
      </motion.svg>

      {/* Layer 3: Central floating pop-out glass sphere with code badges */}
      <motion.div
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 w-[78%] h-[78%] rounded-3xl glass-panel p-6 flex flex-col justify-between border border-white/40 dark:border-brand-500/30 shadow-2xl backdrop-blur-xl bg-white/60 dark:bg-[#0b0f19]/80"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-400/90 shadow-xs" />
            <div className="w-3 h-3 rounded-full bg-amber-400/90 shadow-xs" />
            <div className="w-3 h-3 rounded-full bg-emerald-400/90 shadow-xs" />
          </div>
          <span className="text-[11px] font-mono font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-full border border-brand-500/20">
            &lt;/&gt; RohanOS Core
          </span>
        </div>

        {/* Center 3D visual / tech stack */}
        <div className="space-y-2.5 my-auto py-2">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20">
            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">🚀 Full Stack Ecosystem</span>
            <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">v2026</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20">
            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">⚡ Performance Metric</span>
            <span className="text-xs font-mono font-bold text-emerald-500">Measured</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">🤖 Intelligence Engine</span>
            <span className="text-xs font-mono font-bold text-blue-500">AI / ML</span>
          </div>
        </div>

        {/* Bottom indicator */}
        <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono pt-2 border-t border-gray-200/50 dark:border-gray-800/80">
          <span className="flex items-center gap-1.5 text-emerald-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Active & Available
          </span>
          <span>India · Global</span>
        </div>
      </motion.div>
    </div>
  );
};

// Instagram / Phone Portrait Photo Card (4:5 Ratio) with Layered Backing SVG Blob for About Section
export const PortraitPhotoBlob: React.FC<{
  imageSrc?: string;
  className?: string;
  name?: string;
}> = ({
  imageSrc = '',
  className = '',
  name = 'Rohan'
}) => {
  return (
    <div className={`relative w-full max-w-[340px] sm:max-w-[360px] mx-auto aspect-[4/5] flex items-center justify-center p-3 ${className}`}>
      
      {/* Light technical backdrop: transparent, geometric, and intentionally free of gradient blobs. */}
      <div className="absolute inset-1 rounded-[34px] bg-[var(--color-primary)]/[0.035] dark:bg-[var(--color-primary-light)]/[0.06] border border-[var(--color-primary)]/10 dark:border-[var(--color-primary-light)]/15 rotate-3 pointer-events-none z-0" />
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 rounded-[34px] border border-dashed border-[var(--color-primary)]/20 dark:border-[var(--color-primary-light)]/25 -rotate-2 pointer-events-none z-0"
        animate={{ rotate: [-2, -0.5, -2], y: [0, -3, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span aria-hidden="true" className="absolute -top-1 right-5 w-2 h-2 rounded-full bg-[var(--color-primary-light)]/45 z-0" />
      <span aria-hidden="true" className="absolute bottom-8 -left-1 w-2.5 h-2.5 rounded-full bg-cyan-400/30 z-0" />

      {/* Instagram 4:5 photo frame */}
      <motion.div
        whileHover={{ scale: 1.02, translateY: -3 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative z-10 w-[88%] h-[90%] rounded-[30px] overflow-hidden border border-white/70 dark:border-brand-300/25 shadow-xl shadow-slate-950/10 dark:shadow-black/20 bg-white/20 dark:bg-[#0b0f19]/45 backdrop-blur-md group flex items-center justify-center"
      >
        {imageSrc ? (
          <ResponsiveImage
            src={imageSrc}
            alt={name}
            className="w-full h-full object-cover rounded-[28px] group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full rounded-[28px] bg-gray-100/70 dark:bg-gray-900/50 flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="w-20 h-20 rounded-3xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-3xl font-extrabold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] shadow-lg shadow-brand-500/10">
              {name[0] || 'R'}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{name}</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                Ready for Profile Photo Upload
              </p>
            </div>
          </div>
        )}

        {/* Subtle Bottom Gradient Overlay for Name / Status */}
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/45 to-transparent p-5 pt-10 flex items-end justify-between pointer-events-none">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-brand-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>&lt;/&gt; Core Engineer</span>
            </div>
            <h3 className="text-white text-base font-extrabold tracking-tight mt-0.5">{name}</h3>
          </div>
        </div>
      </motion.div>

    </div>
  );
};

type SkillMatrixProps = {
  onClick?: () => void;
  className?: string;
  categories?: SkillCategoryGroup[];
  unboxed?: boolean;
};

const getSkillSectionScore = (category: SkillCategoryGroup) => {
  if (typeof category?.proficiency === 'number') return Math.min(100, Math.max(0, category.proficiency));
  const skills = Array.isArray(category?.skills) ? category.skills : [];
  if (!skills.length) return 0;
  return Math.round(skills.reduce((sum, skill) => (
    sum + (skillLevel(skill))
  ), 0) / skills.length);
};

const DynamicSkillMatrix: React.FC<SkillMatrixProps> = ({ onClick, className = '', categories = [], unboxed = false }) => {
  const sections = Array.isArray(categories) ? categories : [];
  const count = sections.length;
  const center = 100;
  const radius = unboxed ? 83 : 68;
  const isInteractive = Boolean(onClick);
  const shellClass = unboxed
    ? `relative w-full min-w-0 flex flex-col items-center justify-center ${isInteractive ? 'cursor-pointer group' : ''} ${className}`
    : `relative w-full aspect-square max-w-[340px] mx-auto rounded-3xl glass-card p-5 flex flex-col items-center justify-between border border-brand-500/20 transition-all duration-300 ${isInteractive ? 'cursor-pointer hover:border-brand-500/50 group' : ''} ${className}`;

  if (count === 0) {
    return (
      <div className={shellClass} aria-label="No skill sections configured">
        <svg viewBox="0 0 200 200" className="w-full h-full p-5" role="img" aria-label="Empty skill matrix">
          {[0.25, 0.5, 0.75, 1].map((scale) => (
            <circle key={scale} cx={center} cy={center} r={radius * scale} fill="none" stroke="currentColor" strokeWidth={scale === 1 ? "1.5" : "1"} strokeDasharray={scale === 1 ? undefined : "3 3"} className="text-gray-300 dark:text-gray-700" />
          ))}
          {Array.from({ length: 8 }, (_, index) => {
            const angle = (index * Math.PI * 2) / 8 - Math.PI / 2;
            return <line key={index} x1={center} y1={center} x2={center + radius * Math.cos(angle)} y2={center + radius * Math.sin(angle)} stroke="currentColor" strokeWidth="1" className="text-gray-300 dark:text-gray-700" />;
          })}
          <circle cx={center} cy={center} r="2.5" className="fill-gray-300 dark:fill-gray-700" />
        </svg>
      </div>
    );
  }

  const getLabel = (section: SkillCategoryGroup, index: number) => section.title || section.category || `Section ${index + 1}`;
  const shapeLabel = count === 1 ? 'Single-section drop matrix' : count === 2 ? 'Two-section diamond matrix' : `${count}-sided skill matrix`;

  const renderOneSection = () => {
    const score = getSkillSectionScore(sections[0]);
    const progress = score / 100;
    const webCenterY = 121;
    const webRadius = 55;
    const dropPath = 'M100 24 C145 64 156 93 156 122 C156 153 131 176 100 176 C69 176 44 153 44 122 C44 93 55 64 100 24 Z';
    const fillTop = 176 - 152 * progress;
    const fillHeight = 152 * progress;
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible" role="img" aria-label={shapeLabel}>
        <defs>
          <linearGradient id="single-axis-fill" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.42" />
          </linearGradient>
          <clipPath id="single-axis-drop-clip"><path d={dropPath} /></clipPath>
        </defs>
        {/* A simple teardrop shell with the radar web concentrated in its circular lower body. */}
        <path d={dropPath} fill="rgba(91, 63, 232, 0.035)" stroke="currentColor" strokeWidth="1.5" className="text-gray-300 dark:text-gray-700" />
        {/* Bucket fill: no border, just a clipped volume rising from the bottom with proficiency. */}
        {fillHeight > 0 && <motion.rect x="40" y={fillTop} width="120" height={fillHeight} clipPath="url(#single-axis-drop-clip)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.55, ease: 'easeOut' }} fill="url(#single-axis-fill)" />}
        {[0.25, 0.5, 0.75, 0.99].map((scale) => <circle key={scale} cx={center} cy={webCenterY} r={webRadius * scale} fill="none" stroke="currentColor" strokeWidth={scale === 0.99 ? "1.25" : "1"} strokeDasharray={scale === 0.99 ? undefined : "3 3"} className="text-gray-300 dark:text-gray-700" />)}
        {Array.from({ length: 6 }, (_, index) => {
          const angle = (index * Math.PI * 2) / 6 - Math.PI / 2;
          return <line key={index} x1={center} y1={webCenterY} x2={center + webRadius * Math.cos(angle)} y2={webCenterY + webRadius * Math.sin(angle)} stroke="currentColor" strokeWidth="1" className="text-gray-300 dark:text-gray-700" />;
        })}
        <text x={center} y="14" textAnchor="middle" className="text-[9.5px] font-semibold fill-gray-700 dark:fill-gray-300">{getLabel(sections[0], 0)}</text>
      </svg>
    );
  };

  const renderTwoSections = () => {
    const topProgress = getSkillSectionScore(sections[0]) / 100;
    const bottomProgress = getSkillSectionScore(sections[1]) / 100;
    const leftX = center - radius;
    const rightX = center + radius;
    const topTipY = center - radius * topProgress;
    const bottomTipY = center + radius * bottomProgress;
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible" role="img" aria-label={shapeLabel}>
        <defs>
          <linearGradient id="two-section-top-fill" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.32" />
          </linearGradient>
          <linearGradient id="two-section-bottom-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EC4899" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F472B6" stopOpacity="0.52" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((scale) => <polygon key={scale} points={[['100', center - radius * scale], [center + radius * scale, '100'], ['100', center + radius * scale], [center - radius * scale, '100']].map((point) => point.join(',')).join(' ')} fill="none" stroke="currentColor" strokeWidth={scale === 1 ? "1.5" : "1"} strokeDasharray={scale === 1 ? undefined : "3 3"} className="text-gray-300 dark:text-gray-700" />)}
        {[[100, 24], [168, 100], [100, 176], [32, 100]].map(([x, y], index) => <line key={index} x1={center} y1={center} x2={x} y2={y} stroke="currentColor" strokeWidth="1" className="text-gray-300 dark:text-gray-700" />)}
        {/* Both skills begin at the same zero-percent left-to-right baseline. */}
        <line x1={leftX} y1={center} x2={rightX} y2={center} stroke="currentColor" strokeWidth="1.5" className="text-gray-400 dark:text-gray-600" />
        {/* Borderless area fills: first section rises upward, second section falls downward. */}
        {topProgress > 0 && <motion.polygon points={`${leftX},${center} ${rightX},${center} ${center},${topTipY}`} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.55, ease: 'easeOut' }} fill="url(#two-section-top-fill)" />}
        {bottomProgress > 0 && <motion.polygon points={`${leftX},${center} ${rightX},${center} ${center},${bottomTipY}`} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.08, ease: 'easeOut' }} fill="url(#two-section-bottom-fill)" />}
        <text x={center} y="14" textAnchor="middle" className="text-[9.5px] font-semibold fill-gray-700 dark:fill-gray-300">{getLabel(sections[0], 0)}</text>
        <text x={center} y="193" textAnchor="middle" className="text-[9.5px] font-semibold fill-gray-700 dark:fill-gray-300">{getLabel(sections[1], 1)}</text>
      </svg>
    );
  };

  const renderPolygon = () => {
    const points = sections.map((section, index) => {
      const angle = (index * Math.PI * 2) / count - Math.PI / 2;
      const score = getSkillSectionScore(section) / 100;
      return {
        label: getLabel(section, index), angle, score,
        x: center + radius * Math.cos(angle), y: center + radius * Math.sin(angle),
        valueX: center + radius * score * Math.cos(angle), valueY: center + radius * score * Math.sin(angle),
        labelX: center + (radius + 18) * Math.cos(angle), labelY: center + (radius + 18) * Math.sin(angle)
      };
    });
    const fill = points.map((point) => `${point.valueX},${point.valueY}`).join(' ');
    return (
      <svg viewBox={unboxed ? '-4 -4 208 208' : '-18 -18 236 236'} className="w-full h-full overflow-visible" role="img" aria-label={shapeLabel}>
        {[0.25, 0.5, 0.75, 1].map((scale) => (
          <polygon key={scale} points={points.map((point) => `${center + (point.x - center) * scale},${center + (point.y - center) * scale}`).join(' ')} fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray={scale === 1 ? undefined : '3 3'} className="text-gray-300 dark:text-gray-800" />
        ))}
        {points.map((point, index) => <line key={index} x1={center} y1={center} x2={point.x} y2={point.y} stroke="currentColor" strokeWidth="1" className="text-gray-300 dark:text-gray-800" />)}
        <motion.polygon points={fill} initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 95, damping: 14, delay: 0.15 }} style={{ transformOrigin: '100px 100px' }} fill="rgba(124, 93, 250, 0.38)" />
        {points.map((point, index) => <circle key={index} cx={point.valueX} cy={point.valueY} r="4" className="fill-[var(--color-primary)] dark:fill-[var(--color-primary-light)]" />)}
        {points.map((point, index) => {
          const anchor = Math.cos(point.angle) > 0.25 ? 'start' : Math.cos(point.angle) < -0.25 ? 'end' : 'middle';
          return <text key={index} x={point.labelX} y={point.labelY + (Math.sin(point.angle) > 0.25 ? 8 : Math.sin(point.angle) < -0.25 ? -4 : 3)} textAnchor={anchor} className="text-[9.5px] font-semibold fill-gray-700 dark:fill-gray-300">{point.label.length > 18 ? `${point.label.slice(0, 16)}…` : point.label}</text>;
        })}
      </svg>
    );
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={(event) => {
        if (isInteractive && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          onClick?.();
        }
      }}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      className={shellClass}
      title={isInteractive ? 'Click to view full skills breakdown' : undefined}
    >
      <div className={`w-full flex items-center justify-between border-b border-gray-200 dark:border-gray-800 ${unboxed ? 'pb-3 mb-2' : 'pb-2'}`}>
        <span className={`text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5 ${unboxed ? 'uppercase tracking-wider' : ''}`}><span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />Self-assessed Skills Matrix</span>
        {isInteractive && <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400">View All →</span>}
      </div>
      <div className={`relative w-full flex items-center justify-center ${unboxed ? 'h-[275px]' : 'h-[220px] my-auto'}`}>{count === 1 ? renderOneSection() : count === 2 ? renderTwoSections() : renderPolygon()}</div>
      {!unboxed && <div className="w-full text-center text-[10px] text-gray-500 font-mono pt-1">{shapeLabel}</div>}
    </div>
  );
};

// Interactive Dynamic N-Sided Polygon Radar Matrix for Validated Skills
export const HexagonSkillRadar: React.FC<{
  onClick?: () => void;
  className?: string;
  categories?: SkillCategoryGroup[];
  unboxed?: boolean;
}> = ({ onClick, className = '', categories, unboxed = false }) => {
  return <DynamicSkillMatrix onClick={onClick} className={className} categories={categories} unboxed={unboxed} />;
};
