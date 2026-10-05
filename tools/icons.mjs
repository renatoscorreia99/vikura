// Vikura 2.5D icon system.
// Flat, front-facing silhouettes with airbrushed light, soft inner shadow and analog grain.
// Run `node tools/build.mjs` to regenerate the sprite and the standalone SVG files.

const C = {
  cream: '#FAECD1',
  orange: '#DD5E3F',
  burgundy: '#400D0E',
};

// Shared paint + filters. Gradients use objectBoundingBox units so every shape
// receives the same light: soft key light from the upper left, warm falloff lower right.
export const defs = `
  <radialGradient id="vk-or" cx=".32" cy=".26" r=".95">
    <stop offset="0" stop-color="#F28A63"/>
    <stop offset=".42" stop-color="#E26944"/>
    <stop offset=".78" stop-color="#D2553A"/>
    <stop offset="1" stop-color="#B4442E"/>
  </radialGradient>
  <radialGradient id="vk-or-deep" cx=".35" cy=".3" r=".9">
    <stop offset="0" stop-color="#E06A47"/>
    <stop offset=".6" stop-color="#C9503A"/>
    <stop offset="1" stop-color="#A23E2B"/>
  </radialGradient>
  <radialGradient id="vk-cr" cx=".3" cy=".24" r="1">
    <stop offset="0" stop-color="#FFF9EE"/>
    <stop offset=".45" stop-color="#F9E9CC"/>
    <stop offset=".8" stop-color="#EDD3A8"/>
    <stop offset="1" stop-color="#DDBC8C"/>
  </radialGradient>
  <radialGradient id="vk-cr-shade" cx=".4" cy=".2" r="1">
    <stop offset="0" stop-color="#F3DDB6"/>
    <stop offset=".7" stop-color="#E2C496"/>
    <stop offset="1" stop-color="#CFAA78"/>
  </radialGradient>
  <radialGradient id="vk-hl" cx=".3" cy=".22" r=".55">
    <stop offset="0" stop-color="#FFF6E6" stop-opacity=".62"/>
    <stop offset=".55" stop-color="#FFF6E6" stop-opacity=".16"/>
    <stop offset="1" stop-color="#FFF6E6" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="vk-bounce" cx=".7" cy=".95" r=".6">
    <stop offset="0" stop-color="#FFE3B8" stop-opacity=".32"/>
    <stop offset="1" stop-color="#FFE3B8" stop-opacity="0"/>
  </radialGradient>
  <filter id="vk-matte" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB">
    <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur"/>
    <feOffset in="blur" dx="-5" dy="-7" result="lifted"/>
    <feComposite in="SourceAlpha" in2="lifted" operator="out" result="rim"/>
    <feFlood flood-color="${C.burgundy}" flood-opacity=".26"/>
    <feComposite in2="rim" operator="in" result="inner"/>
    <feTurbulence type="fractalNoise" baseFrequency=".95" numOctaves="2" seed="7" result="noise"/>
    <feColorMatrix in="noise" type="matrix" values="0 0 0 0 .16  0 0 0 0 .05  0 0 0 0 .04  .34 .34 .34 0 -.47" result="grainDark"/>
    <feColorMatrix in="noise" type="matrix" values="0 0 0 0 1  0 0 0 0 .97  0 0 0 0 .9  -.34 -.34 -.34 0 .56" result="grainLight"/>
    <feComposite in="grainDark" in2="SourceAlpha" operator="in" result="gd"/>
    <feComposite in="grainLight" in2="SourceAlpha" operator="in" result="gl"/>
    <feMerge>
      <feMergeNode in="SourceGraphic"/>
      <feMergeNode in="inner"/>
      <feMergeNode in="gd"/>
      <feMergeNode in="gl"/>
    </feMerge>
  </filter>
  <filter id="vk-cast" x="-30%" y="-100%" width="160%" height="300%">
    <feGaussianBlur stdDeviation="5"/>
  </filter>`;

// Each layer moves with the pointer by `depth` px (2–3px max) for a quiet parallax.
const layer = (depth, body) =>
  `<g class="vk-layer" style="transform:translate(calc(var(--vk-px,0) * ${depth}px),calc(var(--vk-py,0) * ${depth}px))">${body}</g>`;

// A lit solid: base paint, diffuse highlight and bounce light, then matte + grain.
const solid = (d, paint = 'or', extra = '') =>
  `<g filter="url(#vk-matte)">` +
  `<path d="${d}" fill="url(#vk-${paint})"${extra}/>` +
  `<path d="${d}" fill="url(#vk-hl)"/>` +
  `<path d="${d}" fill="url(#vk-bounce)"/>` +
  `</g>`;

const cast = (cx, cy, rx, ry = 6, o = 0.16) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${C.burgundy}" opacity="${o}" filter="url(#vk-cast)"/>`;

const circle = (cx, cy, r) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;

const ellipse = (cx, cy, rx, ry) =>
  `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0Z`;

// Organic closed blob, used for pebbles and growth rings.
function blob(cx, cy, r, { wobble = 0.035, seed = 1, sx = 1, sy = 1, steps = 72 } = {}) {
  const pts = [];
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const k =
      1 +
      wobble * Math.sin(3 * t + seed) +
      wobble * 0.6 * Math.sin(5 * t + seed * 1.7) +
      wobble * 0.35 * Math.sin(7 * t + seed * 0.4);
    pts.push([cx + Math.cos(t) * r * k * sx, cy + Math.sin(t) * r * k * sy]);
  }
  // Catmull-Rom to cubic Bézier for a smooth, hand-made edge.
  let d = `M${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < steps; i++) {
    const p0 = pts[(i - 1 + steps) % steps];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % steps];
    const p3 = pts[(i + 2) % steps];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(2)} ${c1[1].toFixed(2)} ${c2[0].toFixed(2)} ${c2[1].toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return d + 'Z';
}

export const icons = {
  // Sono — a cream crescent resting beside a small orange sphere.
  sono: {
    label: 'Sono',
    body:
      cast(78, 142, 42) +
      layer(1, solid('M69.34 30.45A50 50 0 1 0 121.7 100.27A44 44 0 0 1 69.34 30.45Z', 'cr')) +
      layer(3, solid(circle(118, 46, 13), 'or')),
  },

  // Saúde mental — a cairn: stones in balance, the oldest trail marker there is.
  'saude-mental': {
    label: 'Saúde mental',
    body:
      cast(80, 142, 46) +
      layer(1, solid(blob(80, 120, 44, { sy: 0.44, seed: 2, wobble: 0.025 }), 'cr')) +
      layer(1.6, solid(blob(76, 90, 31, { sy: 0.46, seed: 4, wobble: 0.03 }), 'or')) +
      layer(2.3, solid(blob(83, 65, 21, { sy: 0.55, seed: 6, wobble: 0.03 }), 'cr')) +
      layer(3, solid(circle(79, 45, 9), 'or')),
  },

  // Longevidade — growth rings with an off-centre pith, like a real cross-section.
  longevidade: {
    label: 'Longevidade',
    body:
      cast(80, 144, 46) +
      layer(1, solid(blob(80, 80, 56, { seed: 1.2, wobble: 0.03 }), 'or-deep')) +
      layer(1.5, solid(blob(79, 79, 49, { seed: 1.6, wobble: 0.028 }), 'cr')) +
      layer(1.8, `<path d="${blob(77, 77, 39, { seed: 2.1, wobble: 0.03 })}" fill="${C.orange}" opacity=".22"/>` +
        `<path d="${blob(77, 77, 36.5, { seed: 2.1, wobble: 0.03 })}" fill="#F7E4C2"/>`) +
      layer(2.1, `<path d="${blob(75, 75, 28, { seed: 3, wobble: 0.035 })}" fill="${C.orange}" opacity=".26"/>` +
        `<path d="${blob(75, 75, 25.5, { seed: 3, wobble: 0.035 })}" fill="#F9E8C9"/>`) +
      layer(2.4, `<path d="${blob(73, 73, 17, { seed: 4, wobble: 0.04 })}" fill="${C.orange}" opacity=".3"/>` +
        `<path d="${blob(73, 73, 14.5, { seed: 4, wobble: 0.04 })}" fill="#FBEDD3"/>`) +
      layer(3, solid(blob(72, 72, 6.5, { seed: 5, wobble: 0.05 }), 'or')),
  },

  // Movimento — a sphere about to roll from the shoulder of an arch.
  movimento: {
    label: 'Movimento',
    body:
      cast(82, 140, 54) +
      layer(1, solid('M28 120A52 52 0 0 1 132 120L106 120A26 26 0 0 0 54 120Z', 'cr')) +
      layer(3, solid(circle(124, 62, 15), 'or')),
  },

  // Nutrição — half a citrus, seen straight on.
  nutricao: {
    label: 'Nutrição',
    body: (() => {
      const cx = 80, cy = 80;
      let seg = '';
      for (let i = 0; i < 9; i++) {
        const a0 = (i / 9) * Math.PI * 2 + 0.09;
        const a1 = ((i + 1) / 9) * Math.PI * 2 - 0.09;
        const r0 = 9, r1 = 40;
        const p = (a, r) => `${(cx + Math.cos(a) * r).toFixed(2)} ${(cy + Math.sin(a) * r).toFixed(2)}`;
        seg += `M${p(a0 + 0.12, r0)}L${p(a0, r1 - 4)}Q${p((a0 + a1) / 2, r1 + 3)} ${p(a1, r1 - 4)}L${p(a1 - 0.12, r0)}Z`;
      }
      return (
        cast(80, 142, 46) +
        layer(1, solid(circle(cx, cy, 54), 'or-deep')) +
        layer(1.6, solid(circle(cx, cy, 47), 'cr')) +
        layer(2.4, solid(seg, 'or'))
      );
    })(),
  },

  // Autocuidado — a bowl that holds.
  autocuidado: {
    label: 'Autocuidado',
    body:
      cast(80, 140, 44) +
      layer(2.6, solid(circle(80, 78, 25), 'or')) +
      layer(1, solid('M26 92L134 92A54 46 0 0 1 26 92Z', 'cr')),
  },

  // Conhecimento — an open book with a ribbon marker.
  conhecimento: {
    label: 'Conhecimento',
    body:
      cast(80, 140, 54) +
      layer(1, solid('M80 74C64 63 40 60 18 66L18 124C40 118 64 120 80 131C96 120 120 118 142 124L142 66C120 60 96 63 80 74Z', 'or-deep')) +
      layer(1.8, solid('M80 66C66 55 44 52 24 57L24 114C44 109 66 112 80 123Z', 'cr')) +
      layer(1.8, solid('M80 66C94 55 116 52 136 57L136 114C116 109 94 112 80 123Z', 'cr-shade')) +
      layer(2.8, solid('M84 62L94 62L94 132L89 126L84 132Z', 'or')),
  },

  // Autonomia — a compass whose needle rests off true north.
  autonomia: {
    label: 'Autonomia',
    body:
      cast(80, 142, 46) +
      layer(1, solid(circle(80, 80, 54), 'cr')) +
      layer(2.6,
        `<g transform="rotate(28 80 80)">` +
        solid('M80 32L91 80L69 80Z', 'or') +
        solid('M69 80L91 80L80 128Z', 'cr-shade') +
        `</g>`) +
      layer(3, solid(circle(80, 80, 6), 'cr')),
  },

  // Evidência — sources stacked and sealed: information that shows where it came from.
  evidencia: {
    label: 'Evidência',
    body:
      cast(80, 142, 48) +
      layer(1, solid('M46 30L118 30L118 118L46 118Z', 'cr-shade', ' transform="rotate(-7 82 74)"')) +
      layer(1.7, solid('M38 40L104 40L118 54L118 130L38 130Z', 'cr')) +
      layer(2, `<path d="M52 64H96M52 78H104M52 92H84" stroke="${C.orange}" stroke-opacity=".3" stroke-width="5" stroke-linecap="round" fill="none"/>`) +
      layer(3, solid(circle(110, 112, 20), 'or') + solid(circle(110, 112, 7), 'cr')),
  },
};

export const symbol = (name) =>
  `<symbol id="vk-icon-${name}" viewBox="0 0 160 160">${icons[name].body}</symbol>`;

export const sprite = () =>
  `<svg class="vk-sprite" width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden"><defs>${defs}</defs>${Object.keys(icons).map(symbol).join('')}</svg>`;

export const standalone = (name) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160" role="img" aria-label="${icons[name].label}"><title>${icons[name].label}</title><defs>${defs}</defs>${icons[name].body}</svg>\n`;
