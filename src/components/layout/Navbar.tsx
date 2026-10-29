import { SiteText } from '../ui/SiteText';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronDown, Laptop, Menu, Moon, Sun, X } from 'lucide-react';
import { useContentSlice } from '../../context/contentSubscriptions';
import { useTheme } from '../../context/ThemeContext';
import { websiteDefaults } from '../../data/websiteDefaults';

export const Navbar = () => {
  const siteSettings = useContentSlice('siteSettings');
  const website = { ...websiteDefaults, ...siteSettings.website };
  const { theme, setTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const more = useRef<HTMLDetailsElement>(null);
  const location = useLocation();
  const navLinks = website.navigation.filter(link => !/^\/(admin|login)(\/|$)/.test(link.path));
  const primary = navLinks.filter(link => ['/', '/projects', '/about', '/experience'].includes(link.path));
  const visible = primary.length ? primary : navLinks.slice(0, 4);
  const secondary = navLinks.filter(link => !visible.includes(link) && link.path !== '/contact');
  const contactLabel = navLinks.find(link => link.path === '/contact')?.name || "Let's Talk";
  const close = () => { setMobileMenuOpen(false); if (more.current) more.current.open = false; };
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (more.current?.open) { more.current.open = false; more.current.querySelector('summary')?.focus(); }
      if (mobileMenuOpen) { setMobileMenuOpen(false); toggle.current?.focus(); }
    };
    const outside = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) close(); };
    document.addEventListener('keydown', keydown);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', keydown); document.removeEventListener('pointerdown', outside); };
  }, [mobileMenuOpen]);
  useEffect(() => {
    const frame = requestAnimationFrame(close);
    return () => cancelAnimationFrame(frame);
  }, [location.pathname]);
  useEffect(() => {
    if (!window.matchMedia) return;
    const desktop = window.matchMedia('(min-width: 1024px)');
    const changed = () => { if (desktop.matches) setMobileMenuOpen(false); };
    desktop.addEventListener('change', changed);
    return () => desktop.removeEventListener('change', changed);
  }, []);
  const cycleTheme = () => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark');
  const themeIcon = theme === 'dark' ? <Moon size={18} /> : theme === 'light' ? <Sun size={18} /> : <Laptop size={18} />;
  const navLink = (link: { name: string; path: string }, mobile = false) => <Link key={link.path} to={link.path} onClick={close}
    aria-current={location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path + '/')) ? 'page' : undefined}
    className={mobile ? 'portfolio-mobile-link' : 'portfolio-nav-link'}>{link.name}</Link>;
  return <header ref={header} className="portfolio-header">
    <div className="portfolio-header-inner">
      <Link to="/" onClick={close} className="flex items-center gap-2 whitespace-nowrap text-xl font-extrabold" aria-label={`${website.brandName}${website.brandSuffix} home`}>
        <span className="font-mono text-[var(--color-primary)]" aria-hidden="true">{website.brandSymbol}</span>
        <span>{website.brandName}<span className="text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">{website.brandSuffix}</span></span>
      </Link>
      <nav className="hidden lg:flex items-center gap-1" aria-label="Primary navigation">
        {visible.map(link => navLink(link))}
        {secondary.length > 0 && <details ref={more} className="relative" onBlur={(event) => {
          if (more.current && !more.current.contains(event.relatedTarget as Node)) {
            more.current.open = false;
          }
        }}><summary className="portfolio-nav-link flex cursor-pointer list-none items-center gap-1"><SiteText id="Navbar.2e1ac6e9292a">{"Explore "}</SiteText><ChevronDown size={15} /></summary>
          <div className="portfolio-explore-menu">{secondary.map(link => navLink(link))}</div>
        </details>}
      </nav>
      <div className="flex items-center gap-2">
        <button type="button" onClick={cycleTheme} aria-label={`Switch theme. Current mode: ${theme} (${isDark ? 'dark' : 'light'} mode active)`} title={`Theme: ${theme}`} className="portfolio-icon-button">{themeIcon}</button>
        <Link to="/contact" onClick={close} className="hidden lg:inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white">{contactLabel} <ArrowRight size={16} /></Link>
        <button ref={toggle} type="button" className="portfolio-icon-button portfolio-mobile-toggle" aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-controls="mobile-navigation" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen(open => !open)}>{mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
    </div>
    {mobileMenuOpen && <nav id="mobile-navigation" aria-label="Mobile navigation" className="portfolio-mobile-navigation lg:hidden">{navLinks.filter(link => link.path !== '/contact').map(link => navLink(link, true))}<Link to="/contact" onClick={close} className="portfolio-mobile-contact">{contactLabel} <ArrowRight size={16} /></Link></nav>}
  </header>;
};
