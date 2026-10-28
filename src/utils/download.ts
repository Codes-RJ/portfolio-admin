import { dataUrlToBlob } from '../lib/dataUrl';

export async function downloadDocument(source: string, filename: string) {
  const link = document.createElement('a');
  let objectUrl: string | undefined;
  if (source.startsWith('data:application/pdf')) {
    objectUrl = URL.createObjectURL(await dataUrlToBlob(source));
    link.href = objectUrl;
  } else {
    const url = new URL(source, window.location.origin);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Unsupported document URL.');
    link.href = url.href;
    // Cross-origin download attributes are ignored by browsers. Navigation is
    // synchronous and permitted by CSP; no third-party fetch or delayed popup.
    if (url.origin !== window.location.origin) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
  }
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  if (objectUrl) window.setTimeout(() => URL.revokeObjectURL(objectUrl!), 1_000);
}
