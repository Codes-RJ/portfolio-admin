import { SiteText } from '../components/ui/SiteText';
import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ContactCTA } from '../components/ui/ContactCTA';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-gray-700 dark:text-gray-300">
      <div className="space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span><SiteText id="PrivacyPage.803c5679e9ab">{"Legal Compliance"}</SiteText></span>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight"><SiteText id="PrivacyPage.506ff3946215">{"Privacy Policy"}</SiteText></h1>
        <p className="text-xs text-gray-400 font-mono"><SiteText id="PrivacyPage.3d3e64aef8e3">{"Last updated: September 10, 2026"}</SiteText></p>
      </div>

      <div className="prose dark:prose-invert space-y-4 text-xs sm:text-sm leading-relaxed">
        <p><SiteText id="PrivacyPage.628fa20080ca">{"This notice explains what this portfolio stores when you browse the site, submit the contact form, or use the private administration area."}</SiteText></p>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white"><SiteText id="PrivacyPage.8dc7bf471f75">{"1. Information We Collect"}</SiteText></h3>
        <p><SiteText id="PrivacyPage.5a2b7de9dc6c">{"The contact form collects the name, email address, subject, service selection, and message you provide. Hosting infrastructure may also process routine request information, such as an IP address, to deliver the site, prevent abuse, and diagnose failures. This application does not add advertising trackers or analytics cookies."}</SiteText></p>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white"><SiteText id="PrivacyPage.3022ecbd90f1">{"2. Use of Information"}</SiteText></h3>
        <p><SiteText id="PrivacyPage.94016f657397">{"Contact information is used to review and respond to your inquiry, prevent duplicate or abusive submissions, and optionally send an inbox notification. Contact details are not sold to advertisers."}</SiteText></p>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white"><SiteText id="PrivacyPage.19b70162c48a">{"3. Storage and service providers"}</SiteText></h3>
        <p><SiteText id="PrivacyPage.f7cd383fb6ce">{"In the hosted configuration, contact submissions and portfolio content are stored in Supabase. Resend may process contact details when optional email notifications are enabled, and the hosting provider processes web requests. Contact messages remain in the admin inbox until the site owner deletes them or applies a separate retention process."}</SiteText></p>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white"><SiteText id="PrivacyPage.2962cf2dbf0d">{"4. Browser storage"}</SiteText></h3>
        <p><SiteText id="PrivacyPage.3bbeb4d1155b">{"The site uses browser storage for theme preferences and a local content cache. The private admin area also stores its sign-in session in browser-accessible storage; it does not use an HttpOnly authentication cookie. Avoid using the admin area on shared devices and sign out when finished."}</SiteText></p>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white"><SiteText id="PrivacyPage.d85eb8b670af">{"5. Security and your choices"}</SiteText></h3>
        <p><SiteText id="PrivacyPage.42afa70ace86">{"Production traffic should use HTTPS, database access is restricted by role-based policies, and server credentials are not included in browser code. No system can guarantee absolute security. You may request access, correction, or deletion of a contact submission through the contact page; the response available may depend on applicable law and the ability to identify the record."}</SiteText></p>
      </div>

      {/* Bottom Contact CTA */}
      <ContactCTA
        badge="// privacy & compliance"
        title="Have questions about data handling or privacy?"
        description="Feel free to reach out directly if you have any questions or data requests."
        primaryBtnText="Contact Me"
        primaryBtnPath="/contact"
        secondaryBtnText="View Terms"
        secondaryBtnPath="/terms"
      />
    </div>
  );
};
