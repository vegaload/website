import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const site = 'https://vegaload.ai';
const xml = readFileSync(join(root, 'dist/sitemap-0.xml'), 'utf8');
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
let failed = false;

for (const loc of locs) {
  if (!loc.startsWith(site)) {
    console.error(`unexpected address: ${loc}`);
    failed = true;
    continue;
  }
  let path = loc.slice(site.length);
  if (path === '' || path === '/') path = 'index.html';
  else if (path.endsWith('/')) path = `${path.slice(1)}index.html`;
  else path = path.slice(1);
  const file = join(root, 'dist', path);
  if (!existsSync(file)) {
    console.error(`missing file for ${loc}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log(`sitemap ok: ${locs.length} pages`);
