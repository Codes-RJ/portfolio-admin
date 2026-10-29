import React, { useState } from 'react';
import {
  CheckCircle,
  ExternalLink,
  FileText,
  GraduationCap,
  Plus,
  Trash2,
  BarChart2,
  Share2
} from 'lucide-react';
import { isSupabaseConfigured } from '../../../lib/supabase';
import { ResumeUploadField } from '../../admin/ResumeUploadField';
import { ImageUploadField } from '../../ui/ImageUploadField';
import type { AdminEditor } from '../useAdminEditor';

export function AdminProfileSection({ editor }: { editor: Pick<AdminEditor, 'newTitleInput' | 'profile' | 'setNewTitleInput' | 'updateProfile'> }) {
  const { newTitleInput, profile, setNewTitleInput, updateProfile } = editor;

  // New Education Form State
  const [newEduDegree, setNewEduDegree] = useState('');
  const [newEduInstitution, setNewEduInstitution] = useState('');
  const [newEduPeriod, setNewEduPeriod] = useState('');
  const [newEduGrade, setNewEduGrade] = useState('');

  const handleAddEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEduDegree.trim() || !newEduInstitution.trim()) return;
    const currentEdu = profile.education || [];
    updateProfile({
      education: [
        ...currentEdu,
        {
          degree: newEduDegree.trim(),
          institution: newEduInstitution.trim(),
          school: newEduInstitution.trim(),
          period: newEduPeriod.trim() || '2020 – 2024',
          year: newEduPeriod.trim() || '2024',
          grade: newEduGrade.trim() || undefined,
          gpa: newEduGrade.trim() || undefined
        }
      ]
    });
    setNewEduDegree('');
    setNewEduInstitution('');
    setNewEduPeriod('');
    setNewEduGrade('');
  };

  const handleRemoveEducation = (index: number) => {
    const currentEdu = profile.education || [];
    updateProfile({
      education: currentEdu.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="p-8 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-8 shadow-xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Identity & Biography CMS</h2>
        <p className="text-xs text-gray-500">
          Upload portrait images, configure education history, update social profiles, and tune homepage metrics.
        </p>
      </div>

      {/* Photo Uploaders Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-gray-50/60 dark:bg-gray-800/40 border border-gray-200/80 dark:border-gray-700/80">
        <div>
          <ImageUploadField
            label="About Me Portrait Photo (Instagram / Phone 4:5)"
            value={profile.aboutPhotoUrl || ''}
            aspectRatio="4:5"
            previewHeight="h-56"
            helperText="Appears with the animated SVG blob on the About section. Recommended 4:5 Instagram phone portrait."
            onChange={(imgData) => updateProfile({ aboutPhotoUrl: imgData })}
          />
        </div>

        <div>
          <ImageUploadField
            label="Global Profile Avatar"
            value={profile.avatarUrl || ''}
            aspectRatio="1:1"
            previewHeight="h-56"
            helperText="Appears on Navbar, Hero, and Global profile badges."
            onChange={(imgData) => updateProfile({ avatarUrl: imgData })}
          />
        </div>
      </div>

      {/* Technical Resume / CV Document & Download Manager */}
      <div className="p-6 rounded-2xl bg-linear-to-br from-brand-500/5 via-transparent to-blue-500/5 dark:from-brand-950/20 dark:to-blue-950/20 border border-brand-500/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200/60 dark:border-gray-700/60 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Technical Resume / CV Document Uploader
              </h3>
              <p className="text-[11px] text-gray-500">
                Upload your official Resume PDF or specify a custom cloud link. Powers the "Download Official PDF" button across the site.
              </p>
            </div>
          </div>

          {profile.resumePdf && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{isSupabaseConfigured ? 'Stored in Supabase Storage' : 'Stored locally'}</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResumeUploadField />

          <div className="p-4 rounded-xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 space-y-3">
            <label htmlFor="admin-resume-url" className="block text-xs font-bold text-gray-700 dark:text-gray-300">
              External Cloud Resume URL (Optional)
            </label>
            <p className="text-[11px] text-gray-500">
              If you prefer hosting your resume on Google Drive, Dropbox, AWS, or Notion:
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <ExternalLink className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-resume-url"
                  type="text"
                  placeholder="https://drive.google.com/file/d/.../view"
                  value={profile.resumeUrl || ''}
                  onChange={(e) => updateProfile({ resumeUrl: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              {profile.resumeUrl && profile.resumeUrl !== '/resume' && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold hover:bg-[var(--color-primary-strong)] flex items-center gap-1 shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Identity & Personal Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">General Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="admin-field-001" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input
              id="admin-field-001"
              type="text"
              value={profile.name}
              onChange={(e) => updateProfile({ name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="admin-field-002" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Greeting Badge</label>
            <input
              id="admin-field-002"
              type="text"
              value={profile.greeting || "👋 Hello, I'm"}
              onChange={(e) => updateProfile({ greeting: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="admin-field-003" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Location</label>
            <input
              id="admin-field-003"
              type="text"
              value={profile.location || ''}
              onChange={(e) => updateProfile({ location: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="admin-field-004" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Availability Status</label>
            <input
              id="admin-field-004"
              type="text"
              value={profile.availabilityStatus || ''}
              onChange={(e) => updateProfile({ availabilityStatus: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="admin-field-005" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Contact Email Address</label>
            <input
              id="admin-field-005"
              type="email"
              value={profile.socials.email}
              onChange={(e) => updateProfile({ socials: { ...profile.socials, email: e.target.value } })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="admin-field-006" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Response Time Guarantee</label>
            <input
              id="admin-field-006"
              type="text"
              value={profile.responseTime}
              onChange={(e) => updateProfile({ responseTime: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Social Profiles Grid (GitHub, LinkedIn, Twitter, Instagram, LeetCode, Kaggle) */}
      <div className="space-y-4 p-5 rounded-2xl bg-gray-50/60 dark:bg-gray-800/40 border border-gray-200/80 dark:border-gray-700/80">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[var(--color-primary)]" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Social Profiles & Developer Networks</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="admin-social-github" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">GitHub Profile URL</label>
            <input
              id="admin-social-github"
              type="url"
              value={profile.socials.github}
              onChange={(e) => updateProfile({ socials: { ...profile.socials, github: e.target.value } })}
              placeholder="https://github.com/..."
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="admin-social-linkedin" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">LinkedIn Profile URL</label>
            <input
              id="admin-social-linkedin"
              type="url"
              value={profile.socials.linkedin}
              onChange={(e) => updateProfile({ socials: { ...profile.socials, linkedin: e.target.value } })}
              placeholder="https://linkedin.com/in/..."
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="admin-social-twitter" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Twitter / X URL</label>
            <input
              id="admin-social-twitter"
              type="url"
              value={profile.socials.twitter}
              onChange={(e) => updateProfile({ socials: { ...profile.socials, twitter: e.target.value } })}
              placeholder="https://x.com/..."
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="admin-social-instagram" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Instagram URL (Optional)</label>
            <input
              id="admin-social-instagram"
              type="url"
              value={profile.socials.instagram || ''}
              onChange={(e) => updateProfile({ socials: { ...profile.socials, instagram: e.target.value } })}
              placeholder="https://instagram.com/..."
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="admin-social-leetcode" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">LeetCode Profile URL (Optional)</label>
            <input
              id="admin-social-leetcode"
              type="url"
              value={profile.socials.leetcode || ''}
              onChange={(e) => updateProfile({ socials: { ...profile.socials, leetcode: e.target.value } })}
              placeholder="https://leetcode.com/u/..."
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="admin-social-kaggle" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Kaggle Profile URL (Optional)</label>
            <input
              id="admin-social-kaggle"
              type="url"
              value={profile.socials.kaggle || ''}
              onChange={(e) => updateProfile({ socials: { ...profile.socials, kaggle: e.target.value } })}
              placeholder="https://kaggle.com/..."
              className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Key Professional Metrics & Stats (Manual Overrides) */}
      <div className="space-y-4 p-5 rounded-2xl bg-gray-50/60 dark:bg-gray-800/40 border border-gray-200/80 dark:border-gray-700/80">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-[var(--color-primary)]" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Key Professional Statistics</h3>
        </div>
        <p className="text-xs text-gray-500">
          Displayed across hero badges, about metrics, and quick stat counters.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div>
            <label htmlFor="admin-stat-exp" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Years of Exp</label>
            <input
              id="admin-stat-exp"
              type="number"
              min="0"
              value={profile.stats.experienceYears ?? 4}
              onChange={(e) => updateProfile({ stats: { ...profile.stats, experienceYears: Math.max(0, Number(e.target.value) || 0) } })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-mono font-bold text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="admin-stat-proj" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Projects Count</label>
            <input
              id="admin-stat-proj"
              type="number"
              min="0"
              value={profile.stats.projects ?? 12}
              onChange={(e) => updateProfile({ stats: { ...profile.stats, projects: Math.max(0, Number(e.target.value) || 0) } })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-mono font-bold text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="admin-stat-certs" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Certificates</label>
            <input
              id="admin-stat-certs"
              type="number"
              min="0"
              value={profile.stats.certificates ?? 8}
              onChange={(e) => updateProfile({ stats: { ...profile.stats, certificates: Math.max(0, Number(e.target.value) || 0) } })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-mono font-bold text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="admin-stat-tech" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Technologies</label>
            <input
              id="admin-stat-tech"
              type="number"
              min="0"
              value={profile.stats.technologies ?? 25}
              onChange={(e) => updateProfile({ stats: { ...profile.stats, technologies: Math.max(0, Number(e.target.value) || 0) } })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-mono font-bold text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="admin-stat-repos" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Git Repositories</label>
            <input
              id="admin-stat-repos"
              type="number"
              min="0"
              value={profile.stats.repos ?? 40}
              onChange={(e) => updateProfile({ stats: { ...profile.stats, repos: Math.max(0, Number(e.target.value) || 0) } })}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-mono font-bold text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Academic Degrees & Higher Education Manager */}
      <div className="space-y-4 p-6 rounded-2xl bg-gray-50/60 dark:bg-gray-800/40 border border-gray-200/80 dark:border-gray-700/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[var(--color-primary)]" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Academic Degrees & Higher Education ({profile.education?.length || 0})
            </h3>
          </div>
          <span className="text-[11px] font-mono text-gray-500">Rendered on About & Resume pages</span>
        </div>

        {/* Existing Education List */}
        <div className="space-y-3">
          {(!profile.education || profile.education.length === 0) ? (
            <p className="text-xs text-gray-500 italic">No academic degrees added yet. Add your first university qualification below.</p>
          ) : (
            profile.education.map((edu, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4 shadow-xs">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">{edu.degree}</h4>
                  <p className="text-[11px] text-gray-500 font-mono">
                    {[edu.institution || edu.school, edu.period || edu.year, edu.grade || edu.gpa].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveEducation(idx)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl cursor-pointer"
                  title="Remove Degree"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add Degree Form */}
        <form onSubmit={handleAddEducation} className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
          <p className="text-xs font-bold text-gray-700 dark:text-gray-300">+ Add Academic Qualification</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              type="text"
              required
              placeholder="Degree (e.g. B.Tech in CSE)"
              value={newEduDegree}
              onChange={(e) => setNewEduDegree(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            />
            <input
              type="text"
              required
              placeholder="Institution / University"
              value={newEduInstitution}
              onChange={(e) => setNewEduInstitution(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            />
            <input
              type="text"
              placeholder="Period (e.g. 2020 – 2024)"
              value={newEduPeriod}
              onChange={(e) => setNewEduPeriod(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            />
            <input
              type="text"
              placeholder="Grade / GPA (e.g. 3.9 / 4.0)"
              value={newEduGrade}
              onChange={(e) => setNewEduGrade(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] text-white text-xs font-bold cursor-pointer"
          >
            + Add Academic Degree
          </button>
        </form>
      </div>

      {/* Hero Rotating Titles Manager */}
      <div className="space-y-3 p-5 rounded-2xl bg-gray-50/60 dark:bg-gray-800/40 border border-gray-200/80 dark:border-gray-700/80">
        <div>
          <p className="block text-xs font-bold text-gray-900 dark:text-white">
            Hero Rotating Professional Titles ({profile.titles.length} Active)
          </p>
          <p className="text-[11px] text-gray-500">
            These rotate with smooth transitions in the Hero headline ("I'm a [Title]").
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {profile.titles.map((title, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/10 dark:bg-brand-950/60 border border-brand-500/25 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] text-xs font-bold font-mono shadow-xs"
            >
              <span>{title}</span>
              <button
                type="button"
                onClick={() => {
                  const updated = profile.titles.filter((_, i) => i !== idx);
                  updateProfile({ titles: updated.length > 0 ? updated : ['Full Stack Engineer'] });
                }}
                className="w-4 h-4 rounded-full bg-brand-500/20 hover:bg-red-500 hover:text-white flex items-center justify-center text-[10px] transition-colors cursor-pointer"
                title="Remove title"
              >
                ✕
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2 pt-1">
          <input
            type="text"
            aria-label="Add a professional title"
            placeholder="Type new title (e.g. IoT Engineer, AI Researcher) & press Enter"
            value={newTitleInput}
            onChange={(e) => setNewTitleInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (newTitleInput.trim()) {
                  updateProfile({ titles: [...profile.titles, newTitleInput.trim()] });
                  setNewTitleInput('');
                }
              }
            }}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <button
            type="button"
            onClick={() => {
              if (newTitleInput.trim()) {
                updateProfile({ titles: [...profile.titles, newTitleInput.trim()] });
                setNewTitleInput('');
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] text-white text-xs font-bold shadow-md transition-colors cursor-pointer"
          >
            + Add Title
          </button>
        </div>
      </div>

      {/* Short Bio */}
      <div>
        <label htmlFor="admin-field-010" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Hero Short Bio</label>
        <textarea
          id="admin-field-010"
          rows={3}
          value={profile.bio}
          onChange={(e) => updateProfile({ bio: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white resize-none"
        />
      </div>

      {/* About Text Paragraphs */}
      <div className="space-y-3">
        <p className="block text-xs font-bold text-gray-700 dark:text-gray-300">
          Personal Biography Paragraphs (About Section & About Page)
        </p>
        {profile.aboutText.map((para, idx) => (
          <div key={idx} className="flex gap-2 items-start">
            <span className="w-6 h-6 rounded-lg bg-brand-500/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-2">
              {idx + 1}
            </span>
            <textarea
              rows={2}
              value={para}
              onChange={(e) => {
                const updated = [...profile.aboutText];
                updated[idx] = e.target.value;
                updateProfile({ aboutText: updated });
              }}
              className="flex-1 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white resize-none"
            />
            <button
              type="button"
              onClick={() => {
                if (profile.aboutText.length > 1) {
                  const updated = profile.aboutText.filter((_, i) => i !== idx);
                  updateProfile({ aboutText: updated });
                }
              }}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => updateProfile({ aboutText: [...profile.aboutText, 'New paragraph content...'] })}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[var(--color-primary)] bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Paragraph</span>
        </button>
      </div>
    </div>
  );
}
