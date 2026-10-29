import defaultActions from '../../data/websiteDefaultActions.json';
import { useState } from 'react';
import { z } from 'zod';
import { useData } from '../../context/DataContext';
import { contentSliceSchemas, websiteSettingsSchema } from '../../lib/validation';
import { websiteDefaults } from '../../data/websiteDefaults';
import { PUBLIC_ROUTE_METADATA } from '../../data/routeMetadata';
import { defaultPageHeaders } from '../../data/initialData';
import copyCatalog from '../../data/editableCopy.json';
import imageMetadata from '../../data/imageMetadata.json';
import { SchemaFields } from './SchemaFields';
import { ImageUploadField } from '../ui/ImageUploadField';
import { useAuth } from '../../context/AuthContext';
import { useStagedEditorDraft } from '../../hooks/useStagedEditorDraft';

const areas = {
  website: 'Website: brand, navigation, home sections, services, SEO & calls to action',
  copy: 'Public text: page sections, footer, legal policies & labels',
  images: 'Public illustrations: light and dark themes',
  profile: 'Identity: education, social links, statistics & resume',
  siteSettings: 'About & contact: journey, values, facts, coursework, FAQs & highlights',
  projects: 'Projects: all fields & ordering', experiences: 'Experience: all fields & ordering',
  skills: 'Legacy skills: all fields', skillCategories: 'Skill groups: all fields & ordering',
  toolsList: 'Tools: edit existing entries & ordering', techStack: 'Technology stack: all fields & ordering',
  currentlyLearning: 'Currently learning: edit existing entries & ordering',
  achievements: 'Awards: categories, links & ordering', certificates: 'Certificates: PDF links & all fields',
  blogPosts: 'Blog: featured status & all fields', researchPapers: 'Research: images, keywords, links & all fields',
  gallery: 'Gallery: edit existing entries & ordering', projectCategories: 'Project categories',
  certificateCategories: 'Certificate categories', blogCategories: 'Blog categories',
} as const;
type Area = keyof typeof areas;
const inputClass = 'w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm';

export function CompleteControlsPanel() {
  const data = useData();
  const { session } = useAuth();
  const draftKey = `rohanos_staged_controls_v1:${import.meta.env.VITE_SUPABASE_URL || 'local'}:${session?.mode === 'supabase' ? session.userId : session?.email || 'local'}`;
  const [area, setArea] = useState<Area>(() => {
    try { const saved = localStorage.getItem(`${draftKey}:area`); return saved && saved in areas ? saved as Area : 'website'; }
    catch { return 'website'; }
  });
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState('');
  const website = { ...websiteDefaults, ...data.siteSettings.website };
  const defaults = {
    ...website,
    seo: { ...Object.fromEntries(Object.entries(PUBLIC_ROUTE_METADATA).map(([route]) => [route, { title: '', description: '', image: '' }])), ...website.seo },
    callsToAction: { ...defaultActions, ...website.callsToAction },
  };
  const current = area === 'website' ? defaults : area === 'copy' ? website.copy : area === 'images' ? website.images : area === 'siteSettings' ? { ...data.siteSettings, pageHeaders: { ...defaultPageHeaders, ...data.siteSettings.pageHeaders } } : data[area];
  const { draft, setDraft, stale, unreadable, storageError, exportDraft, discardUnreadable } = useStagedEditorDraft(draftKey, area, current);
  const value = draft ?? current;
  const changeArea = (next: Area) => {
    try { localStorage.setItem(`${draftKey}:area`, next); } catch { /* Buffers still report their persistence errors. */ }
    setArea(next); setNotice(''); setQuery(''); setScope('');
  };
  const save = () => {
    if (stale || unreadable) return;
    try {
      if (area === 'website' || area === 'copy' || area === 'images') {
        const next = area === 'website' ? value : { ...website, [area]: value };
        const validated = websiteSettingsSchema.parse(next);
        data.replaceContentSlice('siteSettings', { ...data.siteSettings, website: validated });
      } else data.replaceContentSlice(area, value);
      setDraft(null);
      setNotice(data.contentSyncState === 'local' ? 'Saved in this browser. Export the public content to publish it in a deployment.' : 'Validated. Changes are queued for hosted saving; check the sync status above.');
    } catch (error) {
      setNotice(error instanceof z.ZodError ? error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n') : error instanceof Error ? error.message : 'Unable to save these changes.');
    }
  };
  return <div className="space-y-5 p-5 rounded-3xl border border-gray-200 dark:border-gray-800 min-w-0">
    <h2 className="text-xl font-bold">Complete website controls</h2>
    {storageError && <p role="alert">{storageError} <button type="button" onClick={exportDraft}>Export draft</button></p>}
    {unreadable && <div role="alert">A saved editor draft could not be read. Export it before discarding it. <button type="button" onClick={exportDraft}>Export saved draft</button> <button type="button" onClick={discardUnreadable}>Discard unreadable draft</button></div>}
    {stale && <div role="alert">Content changed since this editor draft was started. Export the draft, discard it, then merge your changes into the latest content before saving. <button type="button" onClick={exportDraft}>Export draft</button></div>}
    <p className="text-sm text-gray-600 dark:text-gray-300">Advanced controls expose every supported field, including compatibility settings. For everyday identity, project and page-title edits, use the focused pages in CMS navigation. Here, changes stay in a private browser draft until Save changes validates and applies the selected area. Removing a home section hides it; its page route remains available.</p>
    <label htmlFor="complete-control-area">Control area</label>
    <select id="complete-control-area" className={inputClass} value={area} onChange={(event) => changeArea(event.target.value as Area)}>{Object.entries(areas).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select>
    {(area === 'copy' || area === 'images') && <><label htmlFor="control-search">Find content</label><input id="control-search" className={inputClass} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search page or text" /></>}
    {area === 'copy' && <><label htmlFor="copy-page">Page or section</label><select id="copy-page" className={inputClass} value={scope} onChange={(event) => setScope(event.target.value)}><option value="">All pages</option>{[...new Set(Object.values(copyCatalog).map((item) => item.scope))].sort().map((item) => <option key={item}>{item}</option>)}</select><div className="space-y-4">{Object.entries(copyCatalog).filter(([key, item]) => (!scope || item.scope === scope) && `${key} ${item.text}`.toLowerCase().includes(query.toLowerCase())).map(([key, item]) => <div key={key}><label htmlFor={`copy-${key}`} className="block text-xs text-gray-500 mb-1">{item.scope}: {item.text.slice(0, 100)}</label><textarea id={`copy-${key}`} className={inputClass} rows={item.text.length > 160 ? 4 : 2} value={(value as Record<string, string>)[key] ?? item.text} onChange={(event) => setDraft({ ...value as Record<string, string>, [key]: event.target.value })} /><button type="button" className="text-xs" onClick={() => setDraft(Object.fromEntries(Object.entries(value as Record<string, string>).filter(([old]) => old !== key)))}>Restore original text</button></div>)}</div></>}
    {area === 'images' && <div className="space-y-5">{Object.keys(imageMetadata).filter((key) => !key.includes('640') && key.toLowerCase().includes(query.toLowerCase())).map((key) => <div key={key}><ImageUploadField label={key.replace('/assets/', '')} value={(value as Record<string, string>)[key] || key} onChange={(next) => setDraft({ ...value as Record<string, string>, [key]: next })} /><button type="button" className="text-xs" onClick={() => setDraft(Object.fromEntries(Object.entries(value as Record<string, string>).filter(([old]) => old !== key)))}>Restore original illustration</button></div>)}</div>}
    {area !== 'copy' && area !== 'images' && <SchemaFields key={area} schema={area === 'website' ? websiteSettingsSchema : contentSliceSchemas[area]} value={value} onChange={setDraft} name={area} />}
    <div className="sticky bottom-3 z-20 p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-lg flex flex-wrap items-center gap-4"><button type="button" disabled={draft === null || stale || unreadable || ['loading', 'conflict', 'missing'].includes(data.contentSyncState)} onClick={save} className="px-5 py-2 rounded-xl bg-brand-600 text-white disabled:opacity-50">Save changes</button><button type="button" disabled={draft === null} onClick={() => { setDraft(null); setNotice('Draft discarded.'); }}>Discard draft</button><span className="text-xs">{draft === null ? 'No unsaved changes' : 'Draft kept privately in this browser'}</span></div>
    {notice && <p role="status" className="text-sm whitespace-pre-wrap break-words">{notice}</p>}
  </div>;
}
