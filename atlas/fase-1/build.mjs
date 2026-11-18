// Monta a página da Fase 1 a partir de src/.
//   node build.mjs                 -> index.html (página completa, abre direto no navegador)
//   node build.mjs --fragment <f>  -> só o conteúdo, sem <html>/<head>, para publicar como artifact
import { readFileSync, writeFileSync } from 'node:fs';
const here = new URL('./', import.meta.url);
const r = f => readFileSync(new URL('src/' + f, here), 'utf8');
const FONTS = 'https://fonts.googleapis.com/css2?family=Archivo+Narrow:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Hanken+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..600&family=Spectral:ital,wght@0,400;0,500;1,400&display=swap';
const head = `<title>Direção Criativa do Atlas</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="${FONTS}">
<style>
${r('styles.css')}</style>`;
const body = `${r('page.html')}
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js"></script>
<script>
${r('data.js')}
window.ATLAS_LAND = ${r('land.json')};
${r('concepts.js')}
${r('stage.js')}
${r('page.js')}
</script>`;
const i = process.argv.indexOf('--fragment');
if (i > -1) { writeFileSync(process.argv[i + 1], head + '\n' + body + '\n'); console.log('fragmento:', process.argv[i + 1]); }
const full = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>:root{color-scheme:light}html,body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
${head}
</head>
<body>
${body}
</body>
</html>
`;
writeFileSync(new URL('index.html', here), full);
console.log('index.html', (full.length / 1024).toFixed(0) + ' KB');
