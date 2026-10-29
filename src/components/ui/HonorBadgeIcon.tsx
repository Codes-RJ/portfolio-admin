import { IconRenderer } from './IconRenderer';

const imageReference = /^(?:https?:\/\/|data:image\/|\/)/i;

function fallbackIcon(category?: string): string {
  if (/publication|writing|article/i.test(category || '')) return 'honor-writing';
  if (/community|volunteer/i.test(category || '')) return 'honor-community';
  if (/hackathon|competition|medal/i.test(category || '')) return 'cert-medal';
  return 'cert-trophy';
}

/** Honors use vector icons even when older saved entries still contain image URLs. */
export function HonorBadgeIcon({ badge, category, title, className = 'w-9 h-9' }: {
  badge?: string;
  category?: string;
  title?: string;
  className?: string;
}) {
  const selected = badge?.trim();
  const icon = !selected || selected === 'Trophy' || imageReference.test(selected)
    ? fallbackIcon(category)
    : selected;
  return <IconRenderer icon={icon} name={title} className={className} color="currentColor" />;
}
