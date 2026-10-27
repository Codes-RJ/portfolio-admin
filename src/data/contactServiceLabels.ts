const contactPageLabels: Record<string, string> = {
  'Full Stack Development': 'Full Stack Engineering', 'AI/ML Solutions': 'AI / ML Solutions',
  'IoT Systems': 'IoT Telemetry & Embedded', 'Hiring Offer': 'Full-Time Job Offer',
  'Advisory/Consulting': 'Technical Consulting',
};
const homeLabels: Record<string, string> = {
  ...contactPageLabels, 'Full Stack Development': 'Full Stack Web App',
  'Hiring Offer': 'Employment Offer',
};
export const serviceLabel = (value: string, location: 'contact' | 'home') => (
  (location === 'contact' ? contactPageLabels : homeLabels)[value] || value
);
