# VIKURA: website mockup

High-fidelity, working mockups for **Vikura**, a Brazilian health, wellbeing and knowledge platform. The brand idea behind them is *orientation for personal protagonism*.

| | Page | File | Render |
|---|---|---|---|
| 01 | Homepage | `index.html` | `mockups/01-vikura-home-desktop.png` · `mockups/01-vikura-home-mobile.png` |
| 02 | Article / knowledge page | `artigo.html` | `mockups/02-vikura-artigo-desktop.png` · `mockups/02-vikura-artigo-mobile.png` |
| 03 | Identity system board | `sistema.html` | `mockups/03-vikura-sistema.png` |

`mockups/estados/` holds interaction-state renders: open search, selected topic, card hover, open citation, the knowledge path mid-reveal, and the mobile menu.

All visible copy is in Brazilian Portuguese.

## View it

The pages are static HTML, CSS and JS with self-hosted fonts and no build step.

```sh
npx http-server -p 8765 .
# open http://127.0.0.1:8765/index.html
```

Append `?static` to any page to draw every Direction Line and switch the demo states on. The full-page renders use this mode.

## Identity system

- **Type.** Fraunces with the `SOFT` axis at 100 ("Fraunces Soft") carries headlines, statements, quotes and important questions. Instrument Sans carries navigation, body, metadata, labels and UI. The split is roughly 25 / 75.
- **Colour.** Cream `#FAECD1`, charcoal `#272424` and burgundy `#400D0E` carry the page. Orange `#DD5E3F` marks direction, selection and active state. Yellow `#F3D34A` appears only as a point of light, in the longevity headline. For small orange text on cream, `--orange-ink` (`#AE4029`) is used, which reaches 5.0:1 contrast.
- **Direction Line.** A continuous path drawn by `assets/js/vikura.js` from the real positions of elements on the page, so it connects them precisely at any width. It leaves the hero headline, crosses the photograph, travels down the margin and underlines the selected topic. It also runs through the four stages of the knowledge path, crosses the human-stories photograph, links a quote to its study, and leaves the page in the footer. It reveals with scroll, never ends in an arrowhead and never crosses running text. Inside the article it is solid for what is known and dashed for what is still open.
- **Compass point.** A two-tone needle (`.cp`) used as the dot of the ı in the logo, as category marker, bullet, active indicator and CTA marker.
- **2.5D icons.** Nine icons generated as SVG by `tools/icons.mjs`: sono, saúde mental, longevidade, movimento, nutrição, autocuidado, conhecimento, autonomia and evidência. Each is a front-facing silhouette with airbrushed radial light, a soft inner shadow, a warm bounce light and fine analog grain, with no outlines. Their layers shift 1–3 px with the pointer. Standalone files are in `assets/icons/`.
- **Grid.** 1440 px frame, 12 columns, 64 px margins, 24 px gutter, 8 px spacing system. On mobile: 4 columns, 20 px margins, and horizontal paths turn vertical.
- **Motion.** 200–400 ms with a soft ease-out and no springs. All of it is disabled under `prefers-reduced-motion`.

## Photography: action needed

This build environment could not reach stock-photo hosts, so **every photograph is an art-direction frame**. Each one is a light-and-colour study rendered by `tools/photo-frames.html`, carrying crop marks and a written shot brief: subject, age, light, crop and what to avoid. The frames hold the composition, palette and negative space of each shot. They do not stand in for real people.

To place the commissioned or licensed photography:

1. Replace the file in `assets/photos/` with one of the same name and aspect ratio.
2. Remove the `data-direction` attribute from its `<figure>` or `.photo` element. The crop marks and shot note then disappear.

| File | Shot |
|---|---|
| `hero.jpg` | Woman, early 40s, walking into the wind at late afternoon; deep blue sky, cropped at the shoulder |
| `sono-feature.jpg` | Morning light through blinds across linen sheets |
| `nutricao.jpg` | Overhead terracotta table, citrus, hands of different ages |
| `retrato-rafael.jpg` | Intimate portrait, man, 37, window light, real skin |
| `joana-pedalando.jpg` | Woman, 29, cycling the coast road, wind, low camera |
| `longevidade-cecilia.jpg` | Woman, 61, silver hair, in the sea at sunrise |
| `botanica.jpg` | Leaf shadows on limewash, a single stem in a glass (no buds, no smoke) |
| `leitura.jpg` | Reading at the kitchen table, late afternoon |
| `caminhada.jpg` | Two friends, 50 and 70, walking at dusk |
| `artigo-janela.jpg` | Woman, 35, eyes closed by an open window, first light |
| `relacionado-sono.jpg` | Bedroom at dawn, light through blinds |

## Content notes

People, reviewers and quotes are fictional placeholders. The bibliographic references in the article are real publications (McEwen 1998, DSM-5-TR, WHO 2017, the *Lancet* 2021 COVID-19 Mental Disorders Collaborators study, Stonerock et al. 2015, Hofmann et al. 2012, and Ding et al. 2025 in *The Lancet Public Health*). They should still go through the editorial team's own source check before anything is published. Brazilian resources mentioned (CVV 188, UBS, CAPS, Anvisa RDC 327/2019) are real.

## Scripts

```sh
node tools/build.mjs                 # inject the icon sprite into the pages, export assets/icons/*.svg
node tools/build-photos.mjs          # regenerate the art-direction frames (needs Playwright)
node tools/render-mockups.mjs        # full-page and state renders into mockups/ (needs the local server)
```

## Structure

```
index.html  artigo.html  sistema.html
assets/css/fonts.css     self-hosted Fraunces + Instrument Sans (OFL)
assets/css/vikura.css    tokens, grid, components, responsive
assets/js/vikura.js      Direction Line, topics, search, citations, reading progress
assets/icons/            2.5D icon SVGs
assets/photos/           art-direction frames (to be replaced)
tools/                   icon generator, sprite build, frame and mockup renderers
mockups/                 PNG renders
```
