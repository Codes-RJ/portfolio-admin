import { SiteText } from '../ui/SiteText';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useContentSlice, useModalActions } from '../../context/contentSubscriptions';
import { IconRenderer } from '../ui/IconRenderer';
import { Award, ShieldCheck, ExternalLink, ArrowRight } from 'lucide-react';

export const CertificatesSection: React.FC = () => {
  const certificates = useContentSlice('certificates');
  const { setActiveModalCert } = useModalActions();

  return (
    <section className="py-24 relative bg-gray-50/50 dark:bg-[#090d16]/60 border-y border-gray-200/60 dark:border-gray-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5" />
              <span><SiteText id="CertificatesSection.625039847b22">{"Professional Credentials"}</SiteText></span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight"><SiteText id="CertificatesSection.339a45a9d6a8">{"Professional Certifications"}</SiteText></h2>
          </div>

          <Link
            to="/certificates"
            className="inline-flex items-center space-x-2 text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-500 transition-colors"
          >
            <span><SiteText id="CertificatesSection.c9c0259825eb">{"View All "}</SiteText>{certificates.length}<SiteText id="CertificatesSection.4b1c50f6e64e">{" Certifications"}</SiteText></span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Certificates Grid */}
        {certificates.length === 0 ? (
          <div className="p-16 text-center rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-4 max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white"><SiteText id="CertificatesSection.c12719cb60b1">{"Credentials coming soon"}</SiteText></h3>
            <p className="text-xs text-gray-500 leading-relaxed"><SiteText id="CertificatesSection.662e31f4f942">{"Verified certificates and credential links will appear here when they are published."}</SiteText></p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.slice(0, 6).map((cert) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-3xl glass-card glass-card-hover border border-gray-200 dark:border-gray-800 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {cert.image && (
                    <ResponsiveImage src={cert.image} alt={`${cert.title} certificate`} loading="lazy" className="w-full aspect-[4/3] object-cover rounded-2xl border border-gray-200 dark:border-gray-700" />
                  )}
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-white/80 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 flex items-center justify-center p-2.5 shadow-xs group-hover:scale-110 group-hover:shadow-md transition-all">
                      <IconRenderer icon={cert.logo} name={`${cert.title} ${cert.issuer}`} className="w-7 h-7" />
                    </div>
                    {/^https?:\/\//i.test(cert.verificationUrl) && <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      <ShieldCheck className="w-3.5 h-3.5" /><SiteText id="CertificatesSection.30e0db739e05">{" Verified"}</SiteText></span>}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1">{cert.title}</h3>
                    <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 mt-0.5">{cert.issuer}</p>
                  </div>

                  <div className="text-[11px] font-mono text-gray-500 space-y-1">
                    <div>{cert.date}</div>
                    {cert.credentialId && <div className="truncate"><SiteText id="CertificatesSection.d7166e572248">{"ID: "}</SiteText>{cert.credentialId}</div>}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800/60 mt-4 flex items-center justify-between">
                  <button
                    onClick={() => setActiveModalCert(cert)}
                    className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                  ><SiteText id="CertificatesSection.ee22ca365475">{"View Proof Modal →"}</SiteText></button>

                  {/^https?:\/\//i.test(cert.verificationUrl) && (
                    <a
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Verify ${cert.title} on the issuer website`}
                      className="p-2 rounded-lg text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
