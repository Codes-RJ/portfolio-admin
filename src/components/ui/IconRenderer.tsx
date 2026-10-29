import { ResponsiveImage } from './ResponsiveImage';
import React, { lazy, Suspense } from 'react';
import { findPublicIcon } from './PublicIconRegistry';
const CatalogIcon = lazy(() => import('./CatalogIcon'));
import { Sparkles } from 'lucide-react';

interface IconRendererProps {
  icon?: string;
  name?: string;
  className?: string;
  size?: number;
  fallbackText?: string;
  color?: string;
}

export const IconRenderer: React.FC<IconRendererProps> = ({
  icon,
  name,
  className = 'w-5 h-5',
  size,
  fallbackText,
  color
}) => {
  // 1. Check if icon is an image URL
  if (icon && (icon.startsWith('http://') || icon.startsWith('https://') || icon.startsWith('data:image/') || icon.startsWith('/'))) {
    return (
      <ResponsiveImage
        src={icon}
        alt={name || 'icon'}
        className={`${className} object-contain rounded-md`}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  const matched = findPublicIcon(icon) || (!icon ? findPublicIcon(name) : undefined);

  if (matched) return <span className={className} aria-hidden="true"
    style={{ display: 'inline-flex', color: color || matched.color, width: size, height: size }}
    dangerouslySetInnerHTML={{ __html: matched.markup }} />;

  if (icon || name) return <Suspense fallback={<Sparkles className={className} />}>
    <CatalogIcon icon={icon} name={name} className={className} color={color} size={size} fallbackText={fallbackText} />
  </Suspense>;
  return <Sparkles className={className} />;
};
