// Injects the 2.5D icon sprite into every page and exports each icon as a standalone SVG.
//   node tools/build.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sprite, icons, standalone } from './icons.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = ['index.html', 'artigo.html', 'sistema.html'];
const marker = /<!-- sprite:start -->[\s\S]*?<!-- sprite:end -->/;

for (const page of pages) {
  const file = path.join(root, page);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  if (!marker.test(html)) continue;
  fs.writeFileSync(file, html.replace(marker, `<!-- sprite:start -->\n${sprite()}\n<!-- sprite:end -->`));
  console.log('sprite →', page);
}

for (const name of Object.keys(icons)) {
  fs.writeFileSync(path.join(root, 'assets/icons', `${name}.svg`), standalone(name));
}
console.log('icons →', Object.keys(icons).length, 'files in assets/icons');
