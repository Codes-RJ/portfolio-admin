/** Decode a local file without importing the authenticated CMS client. */
export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const match = /^data:([^;,]+)?(;base64)?,(.*)$/s.exec(dataUrl);
  if (!match) throw new Error('Could not process the file.');
  try {
    const decoded = match[2] ? Uint8Array.from(atob(match[3]), character => character.charCodeAt(0)) : decodeURIComponent(match[3]);
    return new Blob([decoded], { type: match[1] || 'application/octet-stream' });
  } catch { throw new Error('Could not process the file.'); }
}
