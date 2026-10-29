import { useContentSlice } from '../../context/contentSubscriptions';

/** Render plain text so content overrides retain the original document structure. */
export function SiteText({ id, children }: { id: string; children: string }) {
  const siteSettings = useContentSlice('siteSettings');
  return siteSettings.website?.copy[id] ?? children;
}
