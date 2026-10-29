import { SiteText } from '../components/ui/SiteText';
import React from 'react';
import { FileText } from 'lucide-react';
import { ContactCTA } from '../components/ui/ContactCTA';

export const TermsPage: React.FC = () => {
  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-gray-700 dark:text-gray-300">
      <div className="space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase">
          <FileText className="w-3.5 h-3.5" />
          <span><SiteText id="TermsPage.12a0015fa322">{"Terms of Use"}</SiteText></span>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight"><SiteText id="TermsPage.173f5f9f26b4">{"Terms & Conditions"}</SiteText></h1>
        <p className="text-xs text-gray-400 font-mono"><SiteText id="TermsPage.a8e85d87e457">{"Effective Date: January 1, 2026"}</SiteText></p>
      </div>

      <div className="prose dark:prose-invert space-y-4 text-xs sm:text-sm leading-relaxed">
        <p><SiteText id="TermsPage.981650c4c048">{"Welcome to RohanOS. By accessing or using this website, you agree to comply with and be bound by the following terms and conditions."}</SiteText></p>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white"><SiteText id="TermsPage.a0e6307a7047">{"1. Intellectual Property"}</SiteText></h3>
        <p><SiteText id="TermsPage.55c4993d81bb">{"All source code, project showcase designs, research publication text, and branding logos on RohanOS are the intellectual property of Rohan Jaiswal unless stated otherwise."}</SiteText></p>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white"><SiteText id="TermsPage.edfc2788fc5e">{"2. Open Source Software"}</SiteText></h3>
        <p><SiteText id="TermsPage.f59c692ad017">{"Specific project repositories linked in the portfolio are governed by their respective open source licenses (e.g. MIT, Apache 2.0)."}</SiteText></p>
      </div>

      {/* Bottom Contact CTA */}
      <ContactCTA
        badge="// terms & inquiries"
        title="Looking for a commercial license or custom software agreement?"
        description="I provide custom software engineering agreements and commercial licensing for enterprise applications."
        primaryBtnText="Get In Touch"
        primaryBtnPath="/contact"
        secondaryBtnText="Privacy Policy"
        secondaryBtnPath="/privacy"
      />
    </div>
  );
};
