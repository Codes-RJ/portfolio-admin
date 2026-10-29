import React, { useState } from 'react';
import {
  BookOpen,
  Eye,
  Globe,
  Heart,
  HelpCircle,
  Milestone,
  Plus,
  Sparkles,
  Tag,
  Trash2,
  Type
} from 'lucide-react';
import type { AdminEditor } from '../useAdminEditor';
import { portfolioPageUrl } from '../../../lib/portfolioUrl';
import { websiteDefaults } from '../../../data/websiteDefaults';

export function AdminCopySection({ editor }: { editor: Pick<AdminEditor, 'pageHeaders' | 'siteSettings' | 'updateSiteSettings'> }) {
  const { pageHeaders, siteSettings, updateSiteSettings } = editor;

  const [activeSubTab, setActiveSubTab] = useState<'headers' | 'faqs' | 'aboutStory' | 'brandServices'>('headers');

  // FAQ Form State
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  // Fun Fact State
  const [newFunFact, setNewFunFact] = useState('');

  // Coursework Tag State
  const [newCourseworkTag, setNewCourseworkTag] = useState('');

  // Tech I Love State
  const [newTechLoveName, setNewTechLoveName] = useState('');
  const [newTechLoveIcon, setNewTechLoveIcon] = useState('Code');

  // What Drives Me State
  const [newDriveTitle, setNewDriveTitle] = useState('');
  const [newDriveDesc, setNewDriveDesc] = useState('');
  const [newDriveIcon, setNewDriveIcon] = useState('Sparkles');

  // My Journey State
  const [newJourneyPeriod, setNewJourneyPeriod] = useState('');
  const [newJourneyTitle, setNewJourneyTitle] = useState('');
  const [newJourneyCompany, setNewJourneyCompany] = useState('');
  const [newJourneyDesc, setNewJourneyDesc] = useState('');

  // Service State
  const [newServiceInput, setNewServiceInput] = useState('');

  const faqs = siteSettings.faqs || [];
  const funFacts = siteSettings.funFacts || [];
  const techLove = siteSettings.techLove || [];
  const coursework = siteSettings.education?.coursework || [];
  const aboutDrivesMe = siteSettings.aboutDrivesMe || [];
  const aboutJourney = siteSettings.aboutJourney || [];

  const website = { ...websiteDefaults, ...siteSettings.website };
  const contactServices = website.contactServices || websiteDefaults.contactServices;

  // FAQ Handlers
  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQ.trim() || !newFaqA.trim()) return;
    const updated = [
      ...faqs,
      {
        q: newFaqQ.trim(),
        question: newFaqQ.trim(),
        a: newFaqA.trim(),
        answer: newFaqA.trim()
      }
    ];
    updateSiteSettings({ faqs: updated });
    setNewFaqQ('');
    setNewFaqA('');
  };

  const handleRemoveFaq = (index: number) => {
    updateSiteSettings({ faqs: faqs.filter((_, i) => i !== index) });
  };

  // Fun Fact Handlers
  const handleAddFunFact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFunFact.trim()) return;
    updateSiteSettings({ funFacts: [...funFacts, newFunFact.trim()] });
    setNewFunFact('');
  };

  const handleRemoveFunFact = (index: number) => {
    updateSiteSettings({ funFacts: funFacts.filter((_, i) => i !== index) });
  };

  // Coursework Handlers
  const handleAddCoursework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseworkTag.trim()) return;
    const currentEdu = siteSettings.education || { degree: '', field: '', institution: '', period: '', location: '', coursework: [] };
    updateSiteSettings({
      education: {
        ...currentEdu,
        coursework: [...(currentEdu.coursework || []), newCourseworkTag.trim()]
      }
    });
    setNewCourseworkTag('');
  };

  const handleRemoveCoursework = (index: number) => {
    const currentEdu = siteSettings.education || { degree: '', field: '', institution: '', period: '', location: '', coursework: [] };
    updateSiteSettings({
      education: {
        ...currentEdu,
        coursework: (currentEdu.coursework || []).filter((_, i) => i !== index)
      }
    });
  };

  // Tech I Love Handlers
  const handleAddTechLove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTechLoveName.trim()) return;
    updateSiteSettings({
      techLove: [...techLove, { name: newTechLoveName.trim(), icon: newTechLoveIcon.trim() || 'Code' }]
    });
    setNewTechLoveName('');
    setNewTechLoveIcon('Code');
  };

  const handleRemoveTechLove = (index: number) => {
    updateSiteSettings({ techLove: techLove.filter((_, i) => i !== index) });
  };

  // What Drives Me Handlers
  const handleAddDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriveTitle.trim() || !newDriveDesc.trim()) return;
    updateSiteSettings({
      aboutDrivesMe: [
        ...aboutDrivesMe,
        { title: newDriveTitle.trim(), desc: newDriveDesc.trim(), icon: newDriveIcon.trim() || 'Sparkles' }
      ]
    });
    setNewDriveTitle('');
    setNewDriveDesc('');
    setNewDriveIcon('Sparkles');
  };

  const handleRemoveDrive = (index: number) => {
    updateSiteSettings({ aboutDrivesMe: aboutDrivesMe.filter((_, i) => i !== index) });
  };

  // My Journey Handlers
  const handleAddJourney = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJourneyTitle.trim() || !newJourneyCompany.trim()) return;
    updateSiteSettings({
      aboutJourney: [
        ...aboutJourney,
        {
          period: newJourneyPeriod.trim() || '2024',
          title: newJourneyTitle.trim(),
          company: newJourneyCompany.trim(),
          description: newJourneyDesc.trim()
        }
      ]
    });
    setNewJourneyPeriod('');
    setNewJourneyTitle('');
    setNewJourneyCompany('');
    setNewJourneyDesc('');
  };

  const handleRemoveJourney = (index: number) => {
    updateSiteSettings({ aboutJourney: aboutJourney.filter((_, i) => i !== index) });
  };

  // Service Handlers
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceInput.trim()) return;
    const nextServices = [...contactServices, newServiceInput.trim()];
    updateSiteSettings({
      website: {
        ...website,
        contactServices: nextServices
      }
    });
    setNewServiceInput('');
  };

  const handleRemoveService = (index: number) => {
    if (contactServices.length <= 1) return;
    const nextServices = contactServices.filter((_, i) => i !== index);
    updateSiteSettings({
      website: {
        ...website,
        contactServices: nextServices
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Content, Story & Site Settings CMS</h2>
          <p className="mt-1 text-xs text-gray-500">
            Edit public page headers, contact FAQs, About page narrative blocks, and contact form inquiry options.
          </p>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 shrink-0">
          {[
            { id: 'headers' as const, label: 'Page Headers', icon: Type },
            { id: 'faqs' as const, label: `FAQs (${faqs.length})`, icon: HelpCircle },
            { id: 'aboutStory' as const, label: 'About Story & Values', icon: BookOpen },
            { id: 'brandServices' as const, label: 'Services & Brand', icon: Globe }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[var(--color-primary)] text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Page Headers */}
      {activeSubTab === 'headers' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {(Object.entries(pageHeaders) as Array<[string, { eyebrow: string; title: string; subtitle: string }]>).map(([slug, content]) => (
            <article key={slug} className="p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white capitalize">{slug} page</h3>
                  <p className="text-[11px] font-mono text-gray-500">/{slug}</p>
                </div>
                {portfolioPageUrl(`/${slug}`) && (
                  <a
                    href={portfolioPageUrl(`/${slug}`)!}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] hover:underline"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </a>
                )}
              </div>
              {([
                ['eyebrow', 'Eyebrow / label'],
                ['title', 'Page title'],
                ['subtitle', 'Page subtitle']
              ] as const).map(([field, label]) => (
                <label key={field} className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {label}
                  {field === 'subtitle' ? (
                    <textarea
                      rows={3}
                      value={content[field]}
                      onChange={(event) => updateSiteSettings({ pageHeaders: { ...pageHeaders, [slug]: { ...content, [field]: event.target.value } } })}
                      className="mt-1.5 w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={content[field]}
                      onChange={(event) => updateSiteSettings({ pageHeaders: { ...pageHeaders, [slug]: { ...content, [field]: event.target.value } } })}
                      className="mt-1.5 w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                    />
                  )}
                </label>
              ))}
            </article>
          ))}
        </div>
      )}

      {/* Tab 2: Contact FAQs Manager */}
      {activeSubTab === 'faqs' && (
        <div className="space-y-6">
          <form onSubmit={handleAddFaq} className="p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-[var(--color-primary)]" />
              Add New Frequently Asked Question
            </h3>
            <div>
              <label htmlFor="admin-faq-question" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Question</label>
              <input
                id="admin-faq-question"
                type="text"
                required
                value={newFaqQ}
                onChange={(e) => setNewFaqQ(e.target.value)}
                placeholder="e.g. What are your terms for freelance or engineering consulting?"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="admin-faq-answer" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Answer</label>
              <textarea
                id="admin-faq-answer"
                rows={3}
                required
                value={newFaqA}
                onChange={(e) => setNewFaqA(e.target.value)}
                placeholder="Write clear, helpful answer text for recruiters and clients..."
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white resize-none"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] cursor-pointer"
            >
              + Add FAQ to Contact Page
            </button>
          </form>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Published Contact FAQs ({faqs.length})
            </h4>
            {faqs.length === 0 ? (
              <p className="text-xs text-gray-500 italic p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800 text-center">
                No FAQs configured. Add your first question above.
              </p>
            ) : (
              faqs.map((faq, idx) => (
                <div key={idx} className="p-5 rounded-2xl glass-card border border-gray-200 dark:border-gray-800 flex items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-mono font-bold text-[var(--color-primary)]">Q{idx + 1}</span>
                    <h5 className="text-xs font-bold text-gray-900 dark:text-white">{faq.question || faq.q}</h5>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed pt-1">{faq.answer || faq.a}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFaq(idx)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl shrink-0 cursor-pointer"
                    title="Remove FAQ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: About Story & Values */}
      {activeSubTab === 'aboutStory' && (
        <div className="space-y-8">
          {/* Section 3.1: Fun Facts */}
          <div className="p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Personal Fun Facts ({funFacts.length})
              </h3>
              <span className="text-[11px] text-gray-500 font-mono">Rendered in About page column</span>
            </div>

            <div className="space-y-2">
              {funFacts.map((fact, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span className="truncate">{fact}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFunFact(idx)}
                    className="p-1.5 text-red-400 hover:text-red-600 rounded-lg shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddFunFact} className="flex gap-2 pt-2">
              <input
                type="text"
                required
                value={newFunFact}
                onChange={(e) => setNewFunFact(e.target.value)}
                placeholder="e.g. Built an automated drone sensor beacon over a hackathon weekend"
                className="flex-1 px-4 py-2 text-xs rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] text-white text-xs font-bold cursor-pointer"
              >
                + Add Fact
              </button>
            </form>
          </div>

          {/* Section 3.2: Tech I Love */}
          <div className="p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                "Tech I Love" Highlights ({techLove.length})
              </h3>
              <span className="text-[11px] text-gray-500 font-mono">Displayed as chips on About page</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {techLove.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-600 dark:text-rose-400"
                >
                  <span>{item.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTechLove(idx)}
                    className="w-4 h-4 rounded-full bg-rose-500/20 hover:bg-rose-500 hover:text-white flex items-center justify-center text-[10px] cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddTechLove} className="flex gap-2 pt-2">
              <input
                type="text"
                required
                value={newTechLoveName}
                onChange={(e) => setNewTechLoveName(e.target.value)}
                placeholder="Tech Name (e.g. Next.js, Rust, PyTorch)"
                className="flex-1 px-4 py-2 text-xs rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] text-white text-xs font-bold cursor-pointer"
              >
                + Add Tech
              </button>
            </form>
          </div>

          {/* Section 3.3: Coursework Tags */}
          <div className="p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-500" />
                Relevant Academic Coursework ({coursework.length})
              </h3>
              <span className="text-[11px] text-gray-500 font-mono">Rendered below education on About page</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {coursework.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs font-mono font-bold text-blue-600 dark:text-blue-400"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCoursework(idx)}
                    className="w-4 h-4 rounded-full bg-blue-500/20 hover:bg-blue-500 hover:text-white flex items-center justify-center text-[10px] cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddCoursework} className="flex gap-2 pt-2">
              <input
                type="text"
                required
                value={newCourseworkTag}
                onChange={(e) => setNewCourseworkTag(e.target.value)}
                placeholder="Coursework tag (e.g. Distributed Operating Systems, Machine Learning Theory)"
                className="flex-1 px-4 py-2 text-xs rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] text-white text-xs font-bold cursor-pointer"
              >
                + Add Course
              </button>
            </form>
          </div>

          {/* Section 3.4: What Drives Me Value Cards */}
          <div className="p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                "What Drives Me" Core Principles ({aboutDrivesMe.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {aboutDrivesMe.map((drive, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-1 relative group">
                  <button
                    type="button"
                    onClick={() => handleRemoveDrive(idx)}
                    className="absolute top-3 right-3 p-1.5 text-red-400 hover:text-red-600 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">{drive.title}</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed pr-6">{drive.desc}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddDrive} className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300">+ Add Driving Principle</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Title (e.g. Relentless Craftsmanship)"
                  value={newDriveTitle}
                  onChange={(e) => setNewDriveTitle(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Description..."
                  value={newDriveDesc}
                  onChange={(e) => setNewDriveDesc(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] text-white text-xs font-bold cursor-pointer"
              >
                + Add Principle
              </button>
            </form>
          </div>

          {/* Section 3.5: My Career Journey Milestones */}
          <div className="p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Milestone className="w-4 h-4 text-emerald-500" />
                "My Journey" Narrative Milestones ({aboutJourney.length})
              </h3>
            </div>

            <div className="space-y-3">
              {aboutJourney.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-500">{item.period}</span>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">{item.title} — {item.company}</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed pt-1">{item.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveJourney(idx)}
                    className="p-1.5 text-red-400 hover:text-red-600 rounded-lg shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddJourney} className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300">+ Add Narrative Milestone</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Period (e.g. 2023 – 2024)"
                  value={newJourneyPeriod}
                  onChange={(e) => setNewJourneyPeriod(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Role / Milestone Title"
                  value={newJourneyTitle}
                  onChange={(e) => setNewJourneyTitle(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Organization / Company"
                  value={newJourneyCompany}
                  onChange={(e) => setNewJourneyCompany(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <textarea
                rows={2}
                placeholder="Narrative description of this milestone..."
                value={newJourneyDesc}
                onChange={(e) => setNewJourneyDesc(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white resize-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] text-white text-xs font-bold cursor-pointer"
              >
                + Add Journey Milestone
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 4: Services & Branding */}
      {activeSubTab === 'brandServices' && (
        <div className="space-y-6">
          {/* Contact Form Inquiry Services */}
          <div className="p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Contact Form Inquiry Services ({contactServices.length})
                </h3>
                <p className="text-xs text-gray-500">
                  These appear in the service selection dropdown on your contact form.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {contactServices.map((service, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400"
                >
                  <span>{service}</span>
                  {contactServices.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveService(idx)}
                      className="w-4 h-4 rounded-full bg-emerald-500/20 hover:bg-emerald-500 hover:text-white flex items-center justify-center text-[10px] cursor-pointer"
                      title="Remove Service"
                    >
                      ✕
                    </button>
                  )}
                </span>
              ))}
            </div>

            <form onSubmit={handleAddService} className="flex gap-2 pt-2">
              <input
                type="text"
                required
                value={newServiceInput}
                onChange={(e) => setNewServiceInput(e.target.value)}
                placeholder="New service (e.g. AI Architecture Audit, Full Stack Contract)"
                className="flex-1 px-4 py-2 text-xs rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] text-white text-xs font-bold cursor-pointer"
              >
                + Add Service
              </button>
            </form>
          </div>

          {/* Website Branding & SEO */}
          <div className="p-6 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Website Branding, Footer & SEO
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="admin-brand-name" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Brand Name</label>
                <input
                  id="admin-brand-name"
                  type="text"
                  value={website.brandName || 'Rohan'}
                  onChange={(e) => updateSiteSettings({ website: { ...website, brandName: e.target.value } })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="admin-brand-suffix" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Brand Suffix</label>
                <input
                  id="admin-brand-suffix"
                  type="text"
                  value={website.brandSuffix || 'OS'}
                  onChange={(e) => updateSiteSettings({ website: { ...website, brandSuffix: e.target.value } })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="admin-brand-symbol" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Brand Symbol</label>
                <input
                  id="admin-brand-symbol"
                  type="text"
                  value={website.brandSymbol || '//'}
                  onChange={(e) => updateSiteSettings({ website: { ...website, brandSymbol: e.target.value } })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-footer-desc" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Footer Tagline & Description</label>
              <textarea
                id="admin-footer-desc"
                rows={2}
                value={website.footerDescription || ''}
                onChange={(e) => updateSiteSettings({ website: { ...website, footerDescription: e.target.value } })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white resize-none"
              />
            </div>

            <div>
              <label htmlFor="admin-seo-keywords" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Global SEO Keywords (comma-separated)</label>
              <input
                id="admin-seo-keywords"
                type="text"
                value={website.seoKeywords || ''}
                onChange={(e) => updateSiteSettings({ website: { ...website, seoKeywords: e.target.value } })}
                placeholder="Software Engineer, Machine Learning, Edge IoT, Distributed Systems"
                className="w-full px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
