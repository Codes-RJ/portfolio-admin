import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Award } from 'lucide-react';
import { useContentSlice } from '../../context/contentSubscriptions';
import { websiteDefaults } from '../../data/websiteDefaults';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import { SiteText } from '../ui/SiteText';

export function HomeAboutPreview() {
  const profile = useContentSlice('profile');
  const settings = useContentSlice('siteSettings');
  const domains = settings.website?.homeDomains ?? websiteDefaults.homeDomains;
  return <section id="home-about" className="home-about-preview"><div className="home-section-wrap home-about-grid">
    <div className="home-about-portrait"><ResponsiveImage src={profile.aboutPhotoUrl || profile.avatarUrl || ''} alt={profile.name} width={480} height={560} loading="lazy" decoding="async" sizes="(max-width: 767px) 80vw, 35vw" /><span aria-hidden="true"><SiteText id="HomePreviews.bf3102a211b6">{"A LITTLE ABOUT ME /"}</SiteText></span></div>
    <div className="home-about-copy"><span className="section-kicker"><SiteText id="HomePreviews.7a45618f61d4">{"02 / THE PERSON BEHIND THE CODE"}</SiteText></span><h2><SiteText id="AboutSection.97b5f34147c1">{'Curiosity meets craft.'}</SiteText></h2><p>{profile.aboutText?.[0] || profile.bio}</p><div className="home-domain-list">{domains.slice(0, 3).map(domain => <span key={domain.title}>{domain.title}</span>)}</div><Link to="/about" className="home-text-link"><SiteText id="HomePreviews.2f344c8e0365">{"More about "}</SiteText>{profile.name}<ArrowUpRight size={19} aria-hidden="true" /></Link></div>
  </div></section>;
}

export function HomeExperiencePreview() {
  const experiences = useContentSlice('experiences');
  return <section id="home-experience" className="home-experience-preview"><div className="home-section-wrap"><div className="home-preview-heading"><div><span className="section-kicker"><SiteText id="HomePreviews.508fb79b61ff">{"03 / ALONG THE WAY"}</SiteText></span><h2><SiteText id="HomePreview.experience">{'Experience that shapes the work.'}</SiteText></h2></div><Link to="/experience" className="home-text-link"><SiteText id="HomePreviews.1fcb1b7cb0d5">{"The full story"}</SiteText><ArrowUpRight size={19} aria-hidden="true" /></Link></div><div className="home-experience-rows">{experiences.slice(0, 2).map(experience => <article key={experience.id}><span className="home-experience-period">{experience.period}</span><div><h3>{experience.title}</h3><p className="home-experience-company">{experience.company}</p><p className="home-experience-summary">{experience.summary}</p></div><Link to="/experience" aria-label={`Read about ${experience.title} at ${experience.company}`}><ArrowUpRight size={23} /></Link></article>)}</div></div></section>;
}

export function HomeSkillsPreview() {
  const categories = useContentSlice('skillCategories');
  return <section id="home-skills" className="home-skills-preview"><div className="home-section-wrap home-skills-grid"><div><span className="section-kicker"><SiteText id="HomePreviews.701c0e16205c">{"04 / A VERSATILE TOOLKIT"}</SiteText></span><h2><SiteText id="SkillsTechSection.91220ceeef61">{'Good tools. Thoughtful choices.'}</SiteText></h2><p><SiteText id="HomePreviews.d35f08529346">{"The technologies behind the work, with room to keep learning."}</SiteText></p><Link to="/skills" className="home-text-link"><SiteText id="HomePreviews.7fd2f733160f">{"Explore my toolkit"}</SiteText><ArrowUpRight size={19} aria-hidden="true" /></Link></div><div className="home-skills-list">{categories.slice(0, 5).map((category, index) => <div key={category.id}><span className="home-skills-index">0{index + 1}</span><div><h3>{category.category || category.title}</h3><p>{category.skills.slice(0, 4).map(skill => skill.name).join(' / ')}</p></div><ArrowUpRight size={18} aria-hidden="true" /></div>)}</div></div></section>;
}

export function HomeCertificatesPreview() {
  const certificates = useContentSlice('certificates');
  return <section id="home-certificates" className="home-certificates-preview"><div className="home-section-wrap"><div className="home-preview-heading"><div><span className="section-kicker"><SiteText id="HomePreviews.2324f6316889">{"05 / NEVER DONE LEARNING"}</SiteText></span><h2><SiteText id="HomePreview.credentials">{'A little more depth.'}</SiteText></h2></div><Link to="/certificates" className="home-text-link"><SiteText id="HomePreviews.7c7188ce750a">{"All credentials"}</SiteText><ArrowUpRight size={19} aria-hidden="true" /></Link></div><div className="home-credential-grid">{certificates.slice(0, 3).map(certificate => <Link to="/certificates" key={certificate.id} className="home-credential"><Award size={25} aria-hidden="true" /><h3>{certificate.title}</h3><p>{certificate.issuer}</p><ArrowUpRight className="home-credential-arrow" size={18} aria-hidden="true" /></Link>)}</div></div></section>;
}

export function HomeContactPreview() {
  const profile = useContentSlice('profile');
  return <section id="home-contact" className="home-contact-preview"><div className="home-section-wrap"><span className="section-kicker"><SiteText id="HomePreviews.15f8399cfa37">{"06 / SOMETHING GOOD STARTS HERE"}</SiteText></span><div className="home-contact-heading"><h2><SiteText id="ContactSection.d4bd4bb7f356">{'Have something in mind?'}</SiteText></h2><Link to="/contact" className="home-contact-arrow" aria-label="Start a conversation"><ArrowUpRight size={42} /></Link></div><div className="home-contact-bottom"><p><SiteText id="ContactSection.10ac8172f9bd">{'A project, an opportunity, or just a good conversation. Let’s talk.'}</SiteText></p><a href={`mailto:${profile.socials.email}`}>{profile.socials.email}<ArrowRight size={18} aria-hidden="true" /></a></div></div></section>;
}
