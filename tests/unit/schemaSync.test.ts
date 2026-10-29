import { describe, it, expect } from 'vitest';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Shared Schema Parity across Projects', () => {
  const syncPairs = [
    ['src/lib/validation.ts', '../rohan/src/lib/validation.ts'],
    ['src/lib/contentCompatibility.ts', '../rohan/src/lib/contentCompatibility.ts'],
    ['src/lib/publicMetadata.ts', '../rohan/src/lib/publicMetadata.ts'],
    ['src/data/initialData.ts', '../rohan/src/data/initialData.ts'],
    ['src/data/contentDefaults.ts', '../rohan/src/data/contentDefaults.ts'],
    ['src/data/publishedContent.json', '../rohan/src/data/publishedContent.json'],
    ['src/data/editableCopy.json', '../rohan/src/data/editableCopy.json'],
    ['src/data/imageMetadata.json', '../rohan/src/data/imageMetadata.json'],
    ['src/data/websiteDefaultActions.json', '../rohan/src/data/websiteDefaultActions.json'],
    ['src/data/routeMetadata.ts', '../rohan/src/data/routeMetadata.ts'],
    ['src/data/contactServiceLabels.ts', '../rohan/src/data/contactServiceLabels.ts'],
  ];

  it('guarantees admin and rohan data schemas are identical', async () => {
    for (const [adminFile, rohanFile] of syncPairs) {
      const adminPath = resolve(adminFile);
      const rohanPath = resolve(rohanFile);

      if (!existsSync(rohanPath)) continue;

      const [adminContent, rohanContent] = await Promise.all([
        readFile(adminPath, 'utf8'),
        readFile(rohanPath, 'utf8'),
      ]);

      expect(adminContent.replace(/\r\n/g, '\n'), `Schema drift detected in ${adminFile} vs ${rohanFile}`)
        .toBe(rohanContent.replace(/\r\n/g, '\n'));
    }
  });
});
