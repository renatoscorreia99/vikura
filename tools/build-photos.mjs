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
const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/opt/node22/lib/node_modules/playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const frames = [
  // Article page
  ['artigo-janela', 'janela', 2200, 1240],
  ['relacionado-sono', 'sono', 1200, 900],
  // System board
  ['hero', 'hero', 2400, 1330],
  ['retrato-rafael', 'retrato', 1120, 1400],
  ['longevidade-cecilia', 'longevidade', 1440, 1800],
  ['botanica', 'botanica', 1120, 1400],
  // Portal homepage — front page
  ['capa-principal', 'vento', 2000, 1500],
  ['capa-descanso', 'retratoClaro', 900, 1125],
  ['capa-longevidade', 'jardim', 1200, 800],
  // Mais recentes
  ['recentes-sono', 'noite', 1800, 1200],
  ['recentes-cozinha', 'cozinha', 1200, 900],
  ['recentes-cidade', 'cidade', 1200, 900],
  ['recentes-agua', 'agua', 800, 800],
  ['recentes-folhas', 'folhas', 800, 800],
  ['recentes-leitura', 'leitura', 800, 800],
  // Editorial feature
  ['especial-perguntas', 'leitura', 1800, 2200],
  // Saúde mental
  ['mente-principal', 'janela', 1600, 2000],
  ['mente-retrato', 'retrato', 900, 1125],
  ['mente-caminhada', 'caminhada', 1200, 800],
  ['mente-mar', 'agua', 1200, 900],
  // Longevidade
  ['longevidade-principal', 'longevidade', 2400, 1500],
  ['longevidade-horta', 'jardim', 1000, 1250],
  ['longevidade-cozinha', 'cozinha', 1000, 750],
  // Movimento
  ['movimento-principal', 'vento', 2400, 1600],
  ['movimento-escada', 'escada', 1000, 1250],
  ['movimento-parque', 'parque', 1200, 800],
  ['movimento-agua', 'agua', 1000, 1000],
  // Cannabis medicinal
  ['cannabis-botanica', 'botanica', 1400, 1750],
  ['cannabis-folhas', 'folhas', 1200, 800],
  // Saúde na vida real
  ['vida-retrato', 'retrato', 1400, 1750],
  ['vida-retrato-2', 'retratoClaro', 600, 750],
  ['vida-retrato-3', 'retrato', 600, 750],
  ['vida-retrato-4', 'retratoClaro', 600, 750],
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
