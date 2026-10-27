export interface RouteMetadata {
  title: string;
  description: string;
}

export const PUBLIC_ROUTE_METADATA: Record<string, RouteMetadata> = {
  '/': {
    title: 'Rohan Jaiswal — Full Stack Developer & Data Scientist | RohanOS',
    description: 'Portfolio of Rohan Jaiswal: full-stack engineering, data science, AI/ML, IoT projects, research, and technical writing.',
  },
  '/about': { title: 'About | RohanOS', description: 'Learn about Rohan Jaiswal’s engineering approach, experience, and career journey.' },
  '/projects': { title: 'Projects | RohanOS', description: 'Explore full-stack, data science, AI/ML, IoT, and cloud projects.' },
  '/skills': { title: 'Skills | RohanOS', description: 'Technical skills, tools, and self-assessed proficiency across engineering disciplines.' },
  '/experience': { title: 'Experience | RohanOS', description: 'Professional experience, responsibilities, and measurable engineering impact.' },
  '/certificates': { title: 'Certificates | RohanOS', description: 'Professional certificates and technical credentials with verification links where available.' },
  '/blog': { title: 'Blog | RohanOS', description: 'Technical articles and practical engineering insights.' },
  '/research': { title: 'Research | RohanOS', description: 'Research publications, technical preprints, and areas of exploration.' },
  '/gallery': { title: 'Gallery | RohanOS', description: 'A visual collection of design, engineering, and professional work.' },
  '/resume': { title: 'Resume | RohanOS', description: 'View Rohan Jaiswal’s professional resume and background.' },
  '/contact': { title: 'Contact | RohanOS', description: 'Get in touch about engineering roles, collaborations, and consulting.' },
  '/privacy': { title: 'Privacy | RohanOS', description: 'Privacy policy for the RohanOS portfolio.' },
  '/terms': { title: 'Terms | RohanOS', description: 'Terms and conditions for the RohanOS portfolio.' },
};

export const PRIVATE_ROUTE_METADATA: Record<string, RouteMetadata> = {
  '/login': { title: 'Admin sign in | RohanOS', description: 'Administrator access for RohanOS.' },
  '/admin': { title: 'Admin dashboard | RohanOS', description: 'Administrator workspace for RohanOS.' },
};

