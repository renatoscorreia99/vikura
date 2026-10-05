// Full-page renders of the mockups and of key interaction states.
//   npx http-server -p 8765 .   (in another shell)
//   node tools/render-mockups.mjs
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const base = process.env.BASE || 'http://127.0.0.1:8765';
fs.mkdirSync('mockups/estados', { recursive: true });

const browser = await chromium.launch();
const shot = async (url, out, { width = 1440, height = 900, scale = 1, full = true, before } = {}) => {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: scale });
  await page.goto(base + url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  // Sections below the fold lazy-load their photos; load everything before the capture.
  await page.evaluate(async () => {
    document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; });
    await Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })));
  });
  await page.waitForTimeout(400);
  if (before) await before(page);
  await page.screenshot({ path: out, fullPage: full });
  await page.close();
  console.log('→', out);
};

await shot('/index.html?static', 'mockups/01-vikura-home-desktop.png');
await shot('/artigo.html?static', 'mockups/02-vikura-artigo-desktop.png');
await shot('/sistema.html?static', 'mockups/03-vikura-sistema.png');
await shot('/index.html?static', 'mockups/01-vikura-home-mobile.png', { width: 390, height: 844, scale: 2 });
await shot('/artigo.html?static', 'mockups/02-vikura-artigo-mobile.png', { width: 390, height: 844, scale: 2 });

// States
await shot('/index.html', 'mockups/estados/01-busca-aberta.png', { full: false, height: 620, scale: 2, before: async (p) => {
  await p.click('.search-toggle'); await p.waitForTimeout(450);
  await p.fill('#busca', 'ansie'); await p.dispatchEvent('#busca', 'input'); await p.waitForTimeout(200);
  await p.mouse.move(820, 330);
}});
// The page scrolls smoothly; jump instantly so the capture lands where it was aimed.
const scrollTo = (p, sel, off) => p.evaluate(([sel, off]) => window.scrollTo({ top: document.querySelector(sel).getBoundingClientRect().top + scrollY - off, behavior: 'instant' }), [sel, off]);
await shot('/index.html', 'mockups/estados/02-tema-selecionado.png', { full: false, height: 900, scale: 2, before: async (p) => {
  await scrollTo(p, '.s-explore__map', 120); await p.waitForTimeout(300);
  await p.hover('.s-explore__topic--longevidade'); await p.waitForTimeout(500);
}});
await shot('/index.html', 'mockups/estados/03-card-hover.png', { full: false, height: 1000, scale: 2, before: async (p) => {
  await scrollTo(p, '.s-recentes__grid', 110); await p.waitForTimeout(200);
  await p.hover('.s-recentes__s--top .story__title a'); await p.waitForTimeout(700);
}});
await shot('/artigo.html', 'mockups/estados/04-citacao-aberta.png', { full: false, height: 820, scale: 2, before: async (p) => {
  await p.evaluate(() => document.querySelector('.cite[data-cite="3"]').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(400);
  await p.hover('.cite[data-cite="3"]'); await p.waitForTimeout(600);
}});
await shot('/index.html', 'mockups/estados/05-caminho-revelando.png', { full: false, height: 900, scale: 2, before: async (p) => {
  await scrollTo(p, '.s-jornada__steps', 160); await p.waitForTimeout(600);
}});
await shot('/index.html', 'mockups/estados/06-menu-mobile.png', { width: 390, height: 844, scale: 2, full: false, before: async (p) => {
  await p.click('.menu-toggle'); await p.waitForTimeout(300);
}});
await shot('/index.html', 'mockups/estados/07-fonte-aberta.png', { full: false, height: 900, scale: 2, before: async (p) => {
  await p.click('[aria-controls="ev-2"]'); await p.waitForTimeout(500);
  await scrollTo(p, '#ev-2', 380); await p.waitForTimeout(300);
}});
await shot('/index.html', 'mockups/estados/08-especial.png', { full: false, height: 900, scale: 2, before: async (p) => {
  await scrollTo(p, '.s-especial', 0); await p.waitForTimeout(1200);
}});
await browser.close();
