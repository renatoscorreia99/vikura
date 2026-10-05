// Renders one homepage section in isolation (shared header + section + footer) and checks it.
//   node tools/preview-section.mjs s03-explore            (needs the local server on :8765)
// Writes preview/<name>.html and screenshots preview/<name>-1440.png, preview/<name>-390.png,
// then reports horizontal overflow and console errors at both widths.
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { assemble, bundle } from './build.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/opt/node22/lib/node_modules/playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const name = process.argv[2];
if (!name) { console.error('usage: node tools/preview-section.mjs sNN-name'); process.exit(1); }
const base = process.env.BASE || 'http://127.0.0.1:8765';

fs.mkdirSync(path.join(root, 'preview'), { recursive: true });
const { css, js } = bundle([name]);
fs.writeFileSync(path.join(root, `preview/${name}.css`), css);
fs.writeFileSync(path.join(root, `preview/${name}.js`), js);
let html = assemble([name], { css: `preview/${name}.css`, js: `preview/${name}.js` });
html = html.replace('<head>', '<head>\n<base href="../">');
fs.writeFileSync(path.join(root, `preview/${name}.html`), html);

const browser = await chromium.launch();
for (const [w, h, scale] of [[1440, 900, 1], [390, 844, 2]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: scale });
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon/.test(m.text())) errors.push('console: ' + m.text()); });
  page.on('requestfailed', (r) => { if (!/fonts\/.*woff2/.test(r.url()) || !/CORS/.test(r.failure()?.errorText || '')) errors.push('failed: ' + r.url()); });
  await page.goto(`${base}/preview/${name}.html?static`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  const report = await page.evaluate(() => {
    const W = document.documentElement.clientWidth;
    const over = [];
    document.querySelectorAll('main *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width && r.right > W + 1 && !el.closest('.photo') && !el.closest('[data-scroll-x]')) over.push(`${el.tagName.toLowerCase()}.${(el.className.baseVal ?? el.className).toString().split(' ')[0]} right=${Math.round(r.right)}`);
    });
    return { scrollWidth: document.documentElement.scrollWidth, width: W, overflow: over.slice(0, 12) };
  });
  const out = `preview/${name}-${w}.png`;
  await page.screenshot({ path: path.join(root, out), fullPage: true });
  console.log(JSON.stringify({ width: w, screenshot: out, ...report, errors }, null, 1));
  await page.close();
}
await browser.close();
