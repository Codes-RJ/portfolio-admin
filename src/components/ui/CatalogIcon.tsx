import { findIconItem } from './IconCatalog';
import { Sparkles } from 'lucide-react';

export default function CatalogIcon({ icon, name, className, color, size, fallbackText }: {
  icon?: string; name?: string; className?: string; color?: string; size?: number; fallbackText?: string;
}) {
  const matched = (icon ? findIconItem(icon) : undefined) || (name ? findIconItem(name) : undefined);
  if (matched) { const Icon = matched.Icon; return <Icon className={className} size={size} style={{ color: color || matched.color }} />; }
  if (icon && icon.length <= 4 && !/^[A-Za-z0-9_-]+$/.test(icon)) return <span className="inline-flex items-center justify-center select-none text-base leading-none">{icon}</span>;
  return fallbackText ? <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">{fallbackText.slice(0, 2).toUpperCase()}</span> : <Sparkles className={className} />;
}
