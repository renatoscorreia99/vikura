# VIKURA: website mockup

High-fidelity, working mockups for **Vikura**, a Brazilian health, wellbeing and knowledge platform. Core idea: *Conhecimento para você encontrar o seu caminho.*

Version 2 turns the homepage into a **news and knowledge portal**. It reads like the front page of an independent editorial publication, not a marketing landing page.

| | Page | File | Render |
|---|---|---|---|
| 01 | Homepage (portal) | `index.html` | `mockups/01-vikura-home-desktop.png` · `mockups/01-vikura-home-mobile.png` |
| 02 | Article / knowledge page | `artigo.html` | `mockups/02-vikura-artigo-desktop.png` · `mockups/02-vikura-artigo-mobile.png` |
| 03 | Identity system board | `sistema.html` | `mockups/03-vikura-sistema.png` |

`mockups/estados/` holds interaction-state renders: search, topic hover, story hover, citation, the journey line, the mobile menu, an expanded evidence source and the Especial band.

All visible copy is in Brazilian Portuguese.

## View it

The pages are static HTML, CSS and JS with self-hosted fonts and no runtime dependencies.

```sh
npx http-server -p 8765 .
# open http://127.0.0.1:8765/index.html
```

Append `?static` to any page to draw every Direction Line and switch the demo states on. The full-page renders use this mode.

## Homepage structure

1. **Masthead.** A dateline (date and what Vikura is), the logo, seven sections (Saúde, Mente, Bem-estar, Longevidade, Movimento, Ciência, Cannabis medicinal), Buscar and Sobre, and a thin rule. The search panel unfolds under the bar.
2. **Front page** (`s01-capa`). One dominant story with three secondary stories, each given a different weight.
3. **Em destaque agora** (`s02-destaque`). A slim numbered strip that scrolls horizontally on mobile.
4. **Explore sua saúde** (`s03-explore`). Topic navigation with the 2.5D icons and live story links. All 11 portal topics are reachable from it.
5. **Mais recentes** (`s04-recentes`). Lead story, two smaller stories, a dated list and a "Mais lidas" column. At the end of the rail, a sticky "Por onde começar" card is modelled on the brand board's cream card.
6. **Especial** (`s05-especial`). A burgundy band modelled on the brand board's burgundy card. The statement "Cuidar da saúde também é aprender a fazer melhores perguntas." sits beside the needle at poster scale and the board's word stack (Bem-estar · Protagonismo · Saúde), where the needle moves from word to word. Below is a strip of five questions to take to an appointment.
7. **Saúde mental** (`s06-mente`). A portrait lead, a rail of three stories with three treatments, and a text-only guide on when and where to look for help (UBS, CAPS, CVV 188, Samu 192).
8. **Ciência por trás do cuidado** (`s07-ciencia`). On the left, an evidence ladder that explains study types. On the right, a register of five real studies showing the finding, study type, journal and year, and certainty (bars plus words). Each source expands in place to show the full reference, sample size, what is still unknown and the related Vikura story.
9. **Longevidade** (`s08-longevidade`). A wide horizon lead, one voice (portrait and quote), two portrait stories and a list of topics to raise with a doctor after 60.
10. **Movimento** (`s09-movimento`). The only yellow band, taken from the brand board's yellow card: the statement "Não existe um único jeito de se mexer.", the needle and the signature line. Beside it are a lead and a rail. Below are three starting points instead of a training plan. On yellow, small accent text uses burgundy.
11. **Cannabis medicinal** (`s10-cannabis`). A restrained botanical vertical with a herbarium still life, a text-led lead and short list, and an orientation rail ("Como funciona no Brasil": prescrição, farmácia under RDC 327/2019, importação under RDC 660/2022, acompanhamento).
12. **O caminho do conhecimento** (`s11-jornada`). The Direction Line underlines Descobrir, Entender, Escolher and Agir.
13. **Saúde na vida real** (`s12-vida-real`). Editorial portraits and quotes about people's own health paths, not testimonials. The Direction Line underlines the main quote and leaves the page open.
14. **Newsletter** ("Uma pausa para entender melhor.") and **footer** ("Conhecimento para você encontrar o seu caminho.").

## Identity system

- **Logo.** The supplied master file (`assets/brand/vikura-logo.svg`), inlined so the wordmark can turn cream on dark grounds. The symbol is in `assets/brand/vikura-simbolo.svg`. Note that the logo file uses `#FC5E3B` while the interface palette uses `#DD5E3F`. The logo is applied exactly as delivered.
- **Compass point.** The supplied needle (`assets/brand/vikura-agulha.svg`), used as a CSS mask (`.cp`): category marker on hover, bullets, CTA markers, the review seal and active indicators. At poster scale (`.needle-xl`) it points onward from the Especial and Movimento bands and the orientation card, as the chevron does on the brand board's cards. `.wordstack` is the board's three-word list with one word lit by the needle.
- **Type.** Fraunces with the `SOFT` axis at 100 carries headlines, statements, quotes and human moments. Instrument Sans carries navigation, body copy, metadata, categories, sources and UI, at roughly 25–30 % / 70–75 %.
- **Colour.** Cream `#FAECD1`, off-white paper `#FDF6EA`, charcoal `#272424` and burgundy `#400D0E` carry the page. Orange `#DD5E3F` is the accent; small orange text uses `#AE4029` (5.0:1 on cream). Yellow `#F3D34A` is rare light: it grounds only the Movimento band.
- **Story system.** Category, headline, dek, metadata and review seal sit directly on the page, separated by rules rather than boxed in cards. Rounded corners appear only on a few photo modules. On hover the headline shifts 2 px, the category turns orange and the needle appears, and the photo crop moves 1.5 %. List dividers warm to orange.
- **2.5D icons.** Thirteen SVG icons generated by `tools/icons.mjs`. Each is a front-facing silhouette with airbrushed light, a soft inner shadow and analog grain, with no outlines. Their layers move 1–3 px with the pointer.
- **Direction Line.** Drawn by `assets/js/vikura.js` from real element positions. It reveals with scroll, never ends in an arrowhead, and leaves the page open. Sections register lines declaratively with `Vikura.lines.register(name, def, opts)`.
- **Grid and motion.** 1440 px frame, 12 columns, 48 px margins, 24 px gutter, 8 px rhythm; 4 columns and 20 px margins on mobile. Transitions run 200–350 ms with a soft ease-out, and all of them are disabled under `prefers-reduced-motion`.

## Photography: action needed

This build environment cannot reach stock-photo hosts, so **every photograph is an art-direction frame**. Each frame is a light-and-colour study rendered by `tools/photo-frames.html`, with crop marks and a written shot brief: subject, age, light, crop and what to avoid. The frames hold composition, palette and negative space only; they never depict people.

To place the commissioned or licensed photography:

1. Replace the file in `assets/photos/` with one of the same name and a similar ratio.
2. Remove `data-direction` from its `.photo` element. The crop marks and shot note then disappear.

Photos below the front page use `loading="lazy"`. The render scripts switch them to eager loading before taking full-page captures.

## Content notes

People, reviewers and quotes are fictional placeholders. Where a study is named, it is a real publication. Elsewhere only journal, year and study type are shown, and the Nature Medicine 2026 example comes from the brief. All sources should go through the editorial team's own check before publication. Brazilian resources (CVV 188, Samu 192, SUS, UBS, CAPS, Anvisa RDC 327/2019 and RDC 660/2022) are real. The five studies in the homepage evidence register (Noetel et al., BMJ 2024; Paluch et al., Lancet Public Health 2022; Livingston et al., Lancet 2024; Lane et al., BMJ 2024; Mücke et al., Cochrane 2018) are real, and their summaries are paraphrased.

## Working on it

```sh
node tools/build.mjs                       # assemble index.html from src/, inject partials + icon sprite
node tools/preview-section.mjs s04-recentes  # one section in isolation, screenshots + overflow check
node tools/build-photos.mjs                # regenerate the art-direction frames
node tools/render-mockups.mjs              # full-page and state renders into mockups/ (needs the local server)
```

```
src/index.template.html   homepage shell
src/home/sNN-*.html|css|js  homepage sections → index.html, assets/css/home.css, assets/js/home.js
src/partials/             header, newsletter, footer, inline logo (shared by every page)
assets/css/vikura.css     tokens, type, needle, story system, header, footer
assets/css/article.css    article page
assets/js/vikura.js       search, menu, disclosure, Direction Line engine, article citations
assets/brand/             logo master, symbol, needle
assets/icons/             2.5D icon SVGs
assets/photos/            art-direction frames (to be replaced)
tools/                    builders and renderers
mockups/                  PNG renders
```
