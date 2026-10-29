import { SiteText } from '../components/ui/SiteText';
import React, { useState } from 'react';
import { selectSkills } from '../utils/skills';
import { downloadDocument } from '../utils/download';
import { Download, Printer } from 'lucide-react';
import { useContentSlice } from '../context/contentSubscriptions';
import { ContactCTA } from '../components/ui/ContactCTA';

export const ResumePage: React.FC = () => {
  const profile = useContentSlice('profile');
  const experiences = useContentSlice('experiences');
  const skills = useContentSlice('skills');
  const skillCategories = useContentSlice('skillCategories');
  const certificates = useContentSlice('certificates');

  const allSkills = selectSkills(skillCategories, skills);
  const [downloadError, setDownloadError] = useState('');
  const source = profile.resumePdf || (profile.resumeUrl !== '/resume' ? profile.resumeUrl : '');
  const handleDownload = async () => {
    setDownloadError('');
    try {
      if (source) await downloadDocument(source, profile.resumeFileName || `${profile.name.replace(/\s+/g, '_')}_CV.pdf`);
      else window.print();
    } catch {
      setDownloadError('The resume file could not be opened. Please try again or print the web resume.');
    }
  };

  return (
    <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl glass-card border border-brand-500/20 shadow-xl print:hidden">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] mb-1">
            <span><SiteText id="ResumePage.96c5289ca8ae">{"// curriculum vitae"}</SiteText></span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white"><SiteText id="ResumePage.65fbb60d43e4">{"Official Technical Resume & CV"}</SiteText></h1>
          <p className="text-xs text-gray-500 font-mono">
            {profile.resumeFileName ? `Active file: ${profile.resumeFileName}` : 'Live Web & Print Format · 2026 Edition'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => void handleDownload()}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-xs font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] shadow-lg shadow-brand-600/25 transition-all cursor-pointer"
          >
            {source ? <Download className="w-4 h-4" /> : <Printer className="w-4 h-4" />}
            <span>{source ? 'Download PDF' : 'Print / save web resume'}</span>
          </button>
        </div>
      </div>

      {downloadError && <p role="alert" className="text-sm text-red-700 dark:text-red-300 print:hidden">{downloadError}</p>}

      {/* Embedded Document Reader View */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-800 shadow-2xl space-y-8 text-gray-800 dark:text-gray-200 font-sans">
        
        {/* Document Title Header */}
        <div className="border-b border-gray-200 dark:border-gray-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{profile.name}</h2>
            <p className="text-sm font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] mt-1">{profile.title || profile.titles?.[0] || 'Full Stack Engineer & AI Specialist'}</p>
            <p className="text-xs text-gray-500 font-mono mt-1">{profile.location} · {profile.socials.email}</p>
          </div>

          <div className="text-xs font-mono space-y-1 text-right">
            <div><SiteText id="ResumePage.def4e731b45b">{"GitHub: "}</SiteText><a href={profile.socials.github} target="_blank" rel="noreferrer" className="text-[var(--color-primary)] hover:underline">{profile.socials.github}</a></div>
            <div><SiteText id="ResumePage.fa95d7ba3f06">{"LinkedIn: "}</SiteText><a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="text-[var(--color-primary)] hover:underline">{profile.socials.linkedin}</a></div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider"><SiteText id="ResumePage.43d27beaebd9">{"Executive Profile"}</SiteText></h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {profile.bio}<SiteText id="ResumePage.40e0b23fe043">{" Specializing in high-throughput React/Next.js web applications, Python machine learning pipelines, edge computer vision models, and distributed microservices architecture."}</SiteText></p>
        </div>

        {/* Experience Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 pb-2"><SiteText id="ResumePage.4c69852522c0">{"Work Experience"}</SiteText></h3>
          {experiences.map((exp) => (
            <div key={exp.id} className="space-y-2">
              <div className="flex justify-between items-baseline">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">{exp.title} — <span className="text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">{exp.company}</span></h4>
                <span className="text-xs font-mono text-gray-400">{exp.period}</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs text-gray-600 dark:text-gray-300">
                {exp.responsibilities.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {profile.education && profile.education.length > 0 && <section className="space-y-3"><h3 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider"><SiteText id="ResumePage.512ab3c6b986">{"Education"}</SiteText></h3>{profile.education.map((item, index) => <div key={index}><h4 className="text-sm font-bold">{item.degree}</h4><p className="text-xs text-gray-500">{[item.institution || item.school, item.period || item.year, item.grade || item.gpa].filter(Boolean).join(' ? ')}</p></div>)}</section>}
        {/* Core Skills */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 pb-2"><SiteText id="ResumePage.15e54e79bbc8">{"Technical Competencies"}</SiteText></h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
            {allSkills.map((s) => (
              <div key={s.id} className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex justify-between">
                <span className="font-bold text-gray-900 dark:text-white">{s.name}</span>
                <span className="text-[var(--color-primary)]">{s.level}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] uppercase tracking-wider border-b border-gray-200 dark:border-gray-800 pb-2"><SiteText id="ResumePage.c8027be2993a">{"Certifications & Industry Credentials"}</SiteText></h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {certificates.map((c) => (
              <div key={c.id} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">{c.title}</div>
                  <div className="text-[11px] text-gray-400">{c.issuer} · {c.date}</div>
                </div>
                {/^(https?:\/\/)/i.test(c.verificationUrl) && <span className="text-[10px] font-mono text-emerald-500 font-bold"><SiteText id="ResumePage.2ea99b8796a4">{"Verification link"}</SiteText></span>}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Contact CTA */}
      <ContactCTA
        badge="// hiring & engineering inquiry"
        title="Ready to discuss an engineering role or technical project?"
        description="I am actively interviewing for full-stack engineering and machine learning roles. Let's start a conversation."
        primaryBtnText="Get In Touch"
        primaryBtnPath="/contact"
        secondaryBtnText="Explore Projects"
        secondaryBtnPath="/projects"
      />

    </div>
  );
};

