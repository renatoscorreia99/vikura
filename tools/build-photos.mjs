// Renders the art-direction light studies in tools/photo-frames.html to assets/photos/*.jpg.
// Replace any of these files with the commissioned photograph (same name, same ratio)
// and remove `data-direction` from its <figure> to retire the shot note.
//
//   node tools/build-photos.mjs
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const frames = [
  ['hero', 'hero', 2400, 1330],
  ['sono-feature', 'sono', 1600, 1180],
  ['nutricao', 'nutricao', 960, 720],
  ['retrato-rafael', 'retrato', 1120, 1400],
  ['joana-pedalando', 'ativo', 1800, 1200],
  ['longevidade-cecilia', 'longevidade', 1440, 1800],
  ['botanica', 'botanica', 1120, 1400],
  ['leitura', 'leitura', 960, 1280],
  ['caminhada', 'caminhada', 1600, 1000],
  ['artigo-janela', 'janela', 2200, 1240],
  ['relacionado-sono', 'sono', 1200, 900],
];

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('file://' + path.join(root, 'tools/photo-frames.html'));
for (const [file, scene, w, h] of frames) {
  const data = await page.evaluate(([s, w, h]) => {
    window.renderScene(s, w, h);
    return document.getElementById('c').toDataURL('image/jpeg', 0.82);
  }, [scene, w, h]);
  fs.writeFileSync(path.join(root, 'assets/photos', file + '.jpg'), Buffer.from(data.split(',')[1], 'base64'));
  console.log('photo', file, `${w}×${h}`);
}
await browser.close();
