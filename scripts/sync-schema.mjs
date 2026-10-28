import { copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const files = [
  ['../rohan/src/lib/validation.ts', 'src/lib/validation.ts'],
  ['../rohan/src/lib/contentCompatibility.ts', 'src/lib/contentCompatibility.ts'],
  ['../rohan/src/lib/publicMetadata.ts', 'src/lib/publicMetadata.ts'],
  ['../rohan/src/data/initialData.ts', 'src/data/initialData.ts'],
  ['../rohan/src/data/contentDefaults.ts', 'src/data/contentDefaults.ts'],
  ['../rohan/src/data/publishedContent.json', 'src/data/publishedContent.json'],
  ['../rohan/src/data/editableCopy.json', 'src/data/editableCopy.json'],
  ['../rohan/src/data/imageMetadata.json', 'src/data/imageMetadata.json'],
  ['../rohan/src/data/websiteDefaultActions.json', 'src/data/websiteDefaultActions.json'],
  ['../rohan/src/data/routeMetadata.ts', 'src/data/routeMetadata.ts'],
  ['../rohan/src/data/contactServiceLabels.ts', 'src/data/contactServiceLabels.ts'],
];

console.log('Synchronizing shared schemas from rohan to admin...');
for (const [from, to] of files) {
  await copyFile(resolve(from), resolve(to));
  console.log(`  ✓ Synced ${to}`);
}
console.log('Schema synchronization complete. Both sites are 100% in sync.');
