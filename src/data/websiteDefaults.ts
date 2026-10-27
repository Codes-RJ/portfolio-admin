export type HomeSection = 'hero' | 'about' | 'projects' | 'experience' | 'skills' | 'certificates' | 'contact';
export const websiteDefaults = {
  brandName: 'Rohan', brandSuffix: 'OS', brandSymbol: '</>',
  faviconUrl: '/favicon.svg', seoKeywords: 'Rohan Jaiswal, Full Stack Developer, Data Scientist, AI Engineer, Machine Learning, React, TypeScript, Python, Portfolio, CMS',
  footerDescription: 'Building scalable web applications and beautiful user experiences with modern technologies.',
  footerCredit: 'Designed & Built with care',
  navigation: [
    { name: 'Home', path: '/' }, { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' }, { name: 'Experience', path: '/experience' },
    { name: 'Skills', path: '/skills' }, { name: 'Certificates', path: '/certificates' },
    { name: 'Blog', path: '/blog' }, { name: 'Research', path: '/research' },
  ],
  footerLinks: [
    { name: 'Home', path: '/' }, { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' }, { name: 'Experience', path: '/experience' },
    { name: 'Skills', path: '/skills' }, { name: 'Certificates', path: '/certificates' },
    { name: 'Blog', path: '/blog' }, { name: 'Research', path: '/research' },
    { name: 'Contact', path: '/contact' },
  ],
  homeSections: ['hero', 'about', 'projects', 'experience', 'skills', 'certificates', 'contact'] as HomeSection[],
  homeDomains: [
    { title: 'Full Stack Web', icon: 'SiReact', desc: 'React, Next.js, Node.js, TypeScript' },
    { title: 'Data Science & Analytics', icon: 'FaDatabase', desc: 'Python, Pandas, XGBoost, SQL' },
    { title: 'AI & Machine Learning', icon: 'FaBrain', desc: 'PyTorch, TensorFlow, YOLOv8, OpenCV' },
    { title: 'Embedded IoT Systems', icon: 'TbCpu', desc: 'ESP32, C++, MQTT, Microcontrollers' },
    { title: 'Cloud & DevOps', icon: 'FaAws', desc: 'AWS, Docker, Kubernetes, CI/CD' },
  ],
  contactServices: ['Full Stack Development', 'AI/ML Solutions', 'IoT Systems', 'Hiring Offer', 'Advisory/Consulting'],
  callsToAction: {} as Record<string, { badge: string; title: string; description: string; primaryBtnText: string; primaryBtnPath: string; secondaryBtnText: string; secondaryBtnPath: string }>,
  seo: {} as Record<string, { title: string; description: string; image: string }>,
  copy: {} as Record<string, string>,
  images: {} as Record<string, string>,
};
export type WebsiteSettings = typeof websiteDefaults;
