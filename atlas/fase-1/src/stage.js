/* Storyboard navegável — direção "Meridiano".
   Toda a tela é função de um estado: janela de tempo [a, b], recuo do painel, altura das faixas. */
(function () {
  const A = window.ATLAS, d3 = window.d3, root = document.getElementById('stage');
  if (!root || !d3 || !A) return;

  const W = 1200, H = 772, GUT = 150, TOP = 92, LH = 560, AX = TOP + LH, MINI = 698, PANEL = 372;
  // Escala do tempo: linear depois de 3200 AEC, logarítmica antes (pré-história comprimida).
  const T0 = -3200, DMIN = -300000, DW = 520, K = DW / Math.log(DMIN / T0);
  const warp = y => (y >= T0 ? y : T0 - K * Math.log(y / T0));
  const unwarp = w => (w >= T0 ? w : T0 * Math.exp((T0 - w) / K));
  const EXT = [warp(DMIN), 2025];
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const sstep = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const AO = A.laneIx.ao;

  const S = {
    a: EXT[0], b: EXT[1], inset: 0, h: A.LANES.map(() => LH / 7), focus: -1,
    sel: null, panel: null, mer: null, margin: 5, hover: null, sim: true,
    cats: new Set(A.CATS.map(c => c.id)), scene: 0
  };
  const SCENES = [
    { win: [DMIN, 2025], focus: -1, panel: null },
    { win: [1300, 1700], focus: -1, panel: null },
    { win: [1496, 1546], focus: AO, panel: null },
    { win: [1496, 1546], focus: AO, panel: 'rec', sel: 'piri' },
    { win: [1496, 1546], focus: -1, panel: 'cut', mer: 1513 },
    { win: [780, 1030], focus: -1, panel: 'acervo' }
  ];

  /* ---------- estrutura ---------- */
  const screen = root.querySelector('.st-screen');
  screen.innerHTML = `
    <div class="st-top">
      <div class="st-wm"><i>Atlas</i><span>da História da Humanidade</span></div>
      <div class="st-win" id="st-win"></div>
      <div class="st-nav"><span class="st-search">Buscar <kbd>/</kbd></span><span>Acervo</span><span>Sobre</span></div>
    </div>
    <div class="st-chips">
      <span class="st-chips__l">Categorias</span>
      <div class="st-chips__c" id="st-chips"></div>
      <span class="st-count" id="st-count"></span>
    </div>
    <canvas class="st-canvas" width="${W * 2}" height="${H * 2}"></canvas>
    <svg class="st-svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Linha do tempo por regiões do mundo">
      <defs>
        <pattern id="st-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" class="st-hatchline"/></pattern>
        <clipPath id="st-clip"><rect id="st-cliprect" x="${GUT}" y="${TOP - 30}" width="${W - GUT}" height="${H}"/></clipPath>
      </defs>
    </svg>
    <aside class="st-panel" id="st-panel" aria-live="polite"></aside>
    <div class="st-status">
      <span class="st-level" id="st-level"></span>
      <span class="st-legend">
        <span><svg width="14" height="10"><circle cx="7" cy="5" r="3.2" class="lg-fill"/></svg>data exata</span>
        <span><svg width="22" height="10"><line x1="1" y1="5" x2="21" y2="5" class="lg-dash"/><circle cx="11" cy="5" r="3" class="lg-open"/></svg>aproximada</span>
        <span><svg width="22" height="10"><rect x="1" y="3" width="20" height="4" class="lg-fill"/></svg>intervalo</span>
        <span><svg width="22" height="10"><rect x="1.5" y="3" width="19" height="4" class="lg-est"/></svg>estimado</span>
        <span><svg width="22" height="10"><rect x="0" y="1" width="22" height="8" fill="url(#st-hatch)"/></svg>sem pesquisa</span>
      </span>
      <span class="st-zoom"><button type="button" id="st-out" aria-label="Afastar">−</button><button type="button" id="st-in" aria-label="Aproximar">+</button></span>
    </div>`;
  const svg = d3.select(screen).select('svg.st-svg');
  const canvas = screen.querySelector('canvas'), ctx = canvas.getContext('2d');
  const panel = screen.querySelector('#st-panel');
  const G = {};
  ['lanes', 'grid', 'strip', 'pols', 'clusters', 'keys', 'fichas', 'marks', 'mer', 'axis', 'mini', 'labels'].forEach(n => {
    G[n] = svg.append('g').attr('class', 'L-' + n);
    if (['strip', 'pols', 'clusters', 'keys', 'fichas', 'marks'].includes(n)) G[n].attr('clip-path', 'url(#st-clip)');
  });

  const chips = d3.select('#st-chips').selectAll('button').data(A.CATS).join('button')
    .attr('type', 'button').attr('class', 'st-chip').attr('aria-pressed', 'true')
    .html(c => `<i style="background:var(--c-${c.id})"></i>${c.name}`)
    .on('click', (ev, c) => {
      if (S.cats.has(c.id)) { if (S.cats.size > 1) S.cats.delete(c.id); } else S.cats.add(c.id);
      chips.attr('aria-pressed', d => String(S.cats.has(d.id)));
      render();
    });

  /* ---------- geometria ---------- */
  const PR = () => W - S.inset;
  const X = y => GUT + (warp(y) - S.a) / (S.b - S.a) * (PR() - GUT);
  const XI = x => unwarp(S.a + (x - GUT) / (PR() - GUT) * (S.b - S.a));
  const heights = f => A.LANES.map((_, i) => (f < 0 ? LH / 7 : i === f ? 236 : (LH - 236) / 6));
  const active = r => S.cats.has(r.cat);
  const inCut = r => S.mer == null || (r.s <= S.mer + S.margin && r.e >= S.mer - S.margin);
  let colors = {};
  function readColors() {
    const cs = getComputedStyle(root);
    A.CATS.forEach(c => { colors[c.id] = cs.getPropertyValue('--c-' + c.id).trim(); });
  }

  const wrap = (text, max, lines) => {
    const words = text.split(' '), out = []; let cur = '';
    for (const w of words) {
      if (!cur) cur = w; else if ((cur + ' ' + w).length <= max) cur += ' ' + w; else { out.push(cur); cur = w; }
    }
    if (cur) out.push(cur);
    if (out.length > lines) { out.length = lines; out[lines - 1] = out[lines - 1].replace(/[\s,]*\S{0,3}$/, '') + '…'; }
    return out;
  };
  const cut = (t, n) => (t.length > n ? t.slice(0, n - 1).replace(/[\s,]+$/, '') + '…' : t);

  /* ---------- desenho ---------- */
  function render() {
    const span = S.b - S.a, pr = PR(), pw = pr - GUT, ppy = pw / span;
    const aN1 = sstep(700, 1500, span), aN3 = 1 - sstep(90, 170, span), aN2 = 1 - aN1 - aN3;
    const y0 = XI(GUT), y1 = XI(pr);
    const ly = []; let acc = TOP; S.h.forEach(h => { ly.push(acc); acc += h; });
    const mode = i => (S.h[i] < 62 ? 'c' : S.h[i] > 150 ? 'f' : 'n');
    const sh = i => (mode(i) === 'c' ? 12 : 15);
    const base = i => ly[i] + S.h[i] - sh(i);
    const pitch = lerp(11, 16, aN1), bandH = lerp(1.5, 12, aN1);
    const rowsOf = i => (mode(i) === 'c' ? 1 : aN1 > 0.5 ? 3 : 2);
    d3.select('#st-cliprect').attr('width', Math.max(0, pw));

    const recs = A.RECS.filter(r => active(r) && r.e >= y0 - 2 && r.s <= y1 + 2);
    const counts = A.LANES.map(() => 0);
    recs.forEach(r => { counts[r.lane]++; });
    const sims = S.sim ? A.SIM.filter(r => active(r) && r.s >= y0 && r.s <= y1) : [];
    sims.forEach(r => { counts[r.lane]++; });

    // faixas
    G.lanes.selectAll('rect.lane').data(A.LANES).join('rect').attr('class', (d, i) => 'lane' + (i % 2 ? ' alt' : '') + (i === S.focus ? ' on' : ''))
      .attr('x', 0).attr('width', W).attr('y', (d, i) => ly[i]).attr('height', (d, i) => S.h[i]);
    G.lanes.selectAll('line.lane-r').data(A.LANES.concat([0])).join('line').attr('class', 'lane-r')
      .attr('x1', 0).attr('x2', W).attr('y1', (d, i) => (i < 7 ? ly[i] : AX)).attr('y2', (d, i) => (i < 7 ? ly[i] : AX));
    G.lanes.selectAll('line.gut').data([0]).join('line').attr('class', 'gut').attr('x1', GUT).attr('x2', GUT).attr('y1', TOP).attr('y2', AX);

    // rótulos das faixas
    const lab = G.labels.selectAll('g.lab').data(A.LANES).join(en => {
      const g = en.append('g').attr('class', 'lab');
      g.append('text').attr('class', 'lab-n').each(function (d) { d3.select(this).selectAll('tspan').data(d.lines).join('tspan').attr('x', 18).attr('dy', (l, i) => (i ? 14 : 0)).text(l => l); });
      g.append('text').attr('class', 'lab-c').attr('x', 18);
      g.append('path').attr('class', 'lab-k');
      return g;
    });
    lab.attr('transform', (d, i) => `translate(0,${ly[i]})`).classed('on', (d, i) => i === S.focus);
    lab.select('.lab-n').attr('y', (d, i) => (mode(i) === 'c' ? 16 : 20));
    lab.select('.lab-c').attr('y', (d, i) => (mode(i) === 'c' ? 16 : 20) + d.lines.length * 14 + (mode(i) === 'c' ? -1 : 1))
      .text((d, i) => (counts[i] ? counts[i].toLocaleString('pt-BR') + (counts[i] === 1 ? ' registro' : ' registros') : 'sem registros'));
    lab.select('.lab-k').attr('d', (d, i) => (i === S.focus ? 'M134 13l4 4 4-4' : 'M136 11l4 4-4 4'));

    // tira do acervo: hachura onde não há pesquisa, limpa na sala aberta
    const cov = [X(1400), X(1600)];
    G.strip.selectAll('rect.hatch').data(A.LANES).join('rect').attr('class', 'hatch').attr('fill', 'url(#st-hatch)')
      .attr('x', GUT).attr('width', Math.max(0, pw)).attr('y', (d, i) => base(i)).attr('height', (d, i) => sh(i));
    G.strip.selectAll('rect.cov').data(A.LANES).join('rect').attr('class', (d, i) => 'cov' + (i % 2 ? ' alt' : ''))
      .attr('x', cov[0]).attr('width', Math.max(0, cov[1] - cov[0])).attr('y', (d, i) => base(i)).attr('height', (d, i) => sh(i));
    G.strip.selectAll('line.st').data(A.LANES).join('line').attr('class', 'st').attr('x1', GUT).attr('x2', pr).attr('y1', (d, i) => base(i)).attr('y2', (d, i) => base(i));

    // sedimento simulado (canvas)
    ctx.setTransform(2, 0, 0, 2, 0, 0); ctx.clearRect(0, 0, W, H);
    if (sims.length) {
      ctx.globalAlpha = clamp(ppy / 16, 0.07, 0.62) * (S.mer == null ? 1 : 0.45);
      for (const r of sims) {
        const x = X(r.s); if (x < GUT || x > pr) continue;
        ctx.fillStyle = colors[r.cat]; ctx.fillRect(Math.round(x), base(r.lane) + 1.5, 1, sh(r.lane) - 3);
      }
      ctx.globalAlpha = 1;
    }

    // sociedades e Estados: barras no panorama, linhas de contexto de perto
    const pol = [];
    const items = (aN1 > 0.03 ? A.DEEP : []).concat(A.POLS);
    A.LANES.forEach((_, li) => {
      const rows = Array.from({ length: rowsOf(li) }, () => []);
      items.filter(p => p.lane === li).sort((p, q) => (q.deep ? 1e9 : q.e - q.s) - (p.deep ? 1e9 : p.e - p.s)).forEach(p => {
        const lw = p.name.length * 5.5 + 12;
        let x0 = X(p.s), x1 = X(p.e), showL = true;
        if (p.deep) { if (x0 < GUT - 2 || x0 > pr) return; x0 = Math.max(x0, GUT + 7); x1 = x0 + lw + 8; x0 -= 5; }
        else {
          if (x1 < GUT || x0 > pr) return; x0 = Math.max(x0, GUT); x1 = Math.min(x1, pr);
          if (x1 - x0 < 2.5) return; showL = x1 - x0 >= lw;
        }
        for (let r = 0; r < rows.length; r++) {
          if (rows[r].every(e => x1 + 4 < e[0] || x0 - 4 > e[1])) { rows[r].push([x0, x1]); pol.push({ p, x0, x1, y: ly[li] + 3 + r * pitch, showL, li }); return; }
        }
      });
    });
    const pg = G.pols.selectAll('g.pol').data(pol, d => d.p.id).join(en => {
      const g = en.append('g').attr('class', d => 'pol' + (d.p.deep ? ' deep' : ''));
      g.append(d => document.createElementNS('http://www.w3.org/2000/svg', d.p.deep ? 'path' : 'rect'));
      g.append('text').text(d => d.p.name);
      return g;
    });
    pg.attr('opacity', d => (d.p.deep ? aN1 : 1));
    pg.filter(d => !d.p.deep).select('rect').attr('x', d => d.x0).attr('width', d => d.x1 - d.x0).attr('y', d => d.y + pitch - 1.5 - bandH).attr('height', bandH)
      .attr('fill-opacity', lerp(0.4, 0.13, aN1));
    pg.filter(d => d.p.deep).select('path').attr('d', d => `M${d.x0 + 5} ${d.y + pitch - 12}l4 4.5-4 4.5-4-4.5z`);
    pg.select('text').attr('x', d => d.x0 + (d.p.deep ? 13 : 4)).attr('y', d => d.y + pitch - 4.2).attr('display', d => (d.showL ? null : 'none'));

    // grupos contados (nível intermediário)
    let clus = [];
    if (aN2 > 0.03) {
      const want = 46 / ppy, bin = [1, 2, 5, 10, 20, 25, 50, 100, 200].find(s => s >= want) || 500;
      const m = new Map();
      const add = (lane, y, cat) => {
        const k = lane * 100000 + Math.floor(y / bin) + 50000; let e = m.get(k);
        if (!e) { e = { k: k + ':' + bin, lane, bi: Math.floor(y / bin), n: 0, c: {} }; m.set(k, e); }
        e.n++; e.c[cat] = (e.c[cat] || 0) + 1;
      };
      recs.forEach(r => { if (r.s >= y0 && r.s <= y1) add(r.lane, r.s, r.cat); });
      sims.forEach(r => add(r.lane, r.s, r.cat));
      clus = Array.from(m.values()).map(e => {
        e.x = X((e.bi + 0.5) * bin); e.bin = bin;
        e.cat = Object.keys(e.c).sort((p, q) => e.c[q] - e.c[p])[0];
        e.r = clamp(3 + 1.25 * Math.log2(e.n + 1), 3.6, 13);
        const top = ly[e.lane] + 3 + rowsOf(e.lane) * pitch + (mode(e.lane) === 'c' ? 0 : 12);
        e.y = (top + base(e.lane)) / 2; return e;
      });
    }
    const cg = G.clusters.attr('opacity', aN2).attr('display', aN2 > 0.03 ? null : 'none').selectAll('g.clu').data(clus, d => d.k).join(en => {
      const g = en.append('g').attr('class', 'clu'); g.append('circle'); g.append('text'); return g;
    });
    cg.attr('transform', d => `translate(${d.x},${d.y})`).on('click', (ev, d) => { ev.stopPropagation(); zoomTo((d.bi + 0.5) * d.bin, Math.max(40, Math.min(d.bin * 2.4, 60)), d.lane); });
    cg.select('circle').attr('r', d => d.r).style('fill', d => `var(--c-${d.cat})`).style('stroke', d => `var(--c-${d.cat})`);
    cg.select('text').attr('dy', '0.35em').text(d => (d.r >= 8 ? d.n : ''));

    // acontecimentos estruturantes rotulados (nível intermediário)
    let keys = [];
    if (aN2 > 0.03) {
      A.LANES.forEach((_, li) => {
        if (mode(li) === 'c') return; let last = -1e9;
        recs.filter(r => r.lane === li && r.imp === 3 && r.s >= y0).sort((p, q) => p.s - q.s).forEach(r => {
          const x = X(r.s), t = cut(r.title, 32), w = t.length * 5.9 + 14;
          if (x < last + 10 || x + 30 > pr) return; last = x + w;
          keys.push({ r, x, t, y: ly[li] + 3 + rowsOf(li) * pitch + 10, yb: base(li) });
        });
      });
    }
    const kg = G.keys.attr('opacity', aN2).attr('display', aN2 > 0.03 ? null : 'none').selectAll('g.key').data(keys, d => d.r.id).join(en => {
      const g = en.append('g').attr('class', 'key'); g.append('line'); g.append('circle').attr('r', 2.4); g.append('text'); return g;
    });
    kg.attr('transform', d => `translate(${d.x},${d.y})`).attr('opacity', d => (inCut(d.r) ? 1 : 0.25)).on('click', (ev, d) => { ev.stopPropagation(); openRec(d.r.id); });
    kg.select('line').attr('y1', 1).attr('y2', d => d.yb - d.y);
    kg.select('circle').attr('cy', -3.5).style('fill', d => `var(--c-${d.r.cat})`);
    kg.select('text').attr('x', 7).text(d => d.t);

    // fichas (nível próximo)
    let fichas = [];
    if (aN3 > 0.03) {
      A.LANES.forEach((_, li) => {
        const m = mode(li), placed = [];
        const zy = ly[li] + 3 + rowsOf(li) * pitch + (m === 'c' ? 3 : 3);
        recs.filter(r => r.lane === li).map(r => ({ r, pri: r.imp + (r.glyph ? 0.6 : 0) + (r.id === S.sel ? 10 : 0) + (S.mer != null && inCut(r) ? 4 : 0) + (r.prec === 'd' ? -2 : 0) }))
          .sort((p, q) => q.pri - p.pri).forEach(({ r }) => {
            let x = X(r.s); if (r.range && x < GUT + 6 && X(r.e) > GUT + 40) x = GUT + 6;
            if (x < GUT + 3 || x > pr - 26) return;
            const date = A.fmtDate(r); let w, lines;
            if (m === 'c') { lines = [cut(r.title, 30)]; w = date.length * 5.9 + lines[0].length * 5.6 + 18; }
            else if (m === 'n') { lines = wrap(r.title, 20, 2); w = (r.glyph ? 40 : 7) + Math.max(date.length * 5.9, d3.max(lines, l => l.length) * 6) + 4; }
            else { lines = r.glyph ? wrap(r.title, 17, 3) : wrap(r.title, 14, 4); w = 108; }
            if (!placed.every(e => x + w + 10 < e[0] || x - 10 > e[1])) return;
            placed.push([x, x + w]);
            fichas.push({ r, x, zy, m, lines, date, stem: base(li) - zy, key: r.id + ':' + m });
          });
      });
    }
    const fg = G.fichas.attr('opacity', aN3).attr('display', aN3 > 0.03 ? null : 'none').selectAll('g.fic').data(fichas, d => d.key).join(en => {
      const g = en.append('g').attr('class', d => 'fic fic-' + d.m);
      g.append('line').attr('class', 'stem');
      g.each(function (d) {
        const s = d3.select(this), r = d.r;
        if (d.m === 'c') {
          const t = s.append('text').attr('x', 6).attr('y', 10);
          t.append('tspan').attr('class', 'f-date').text(d.date); t.append('tspan').attr('class', 'f-ttl').attr('dx', 6).text(d.lines[0]);
        } else if (d.m === 'n') {
          const tx = r.glyph ? 40 : 7;
          if (r.glyph) { s.append('rect').attr('class', 'plate').attr('x', 4).attr('y', 0).attr('width', 30).attr('height', 36); s.append('g').attr('class', 'gly').html(A.glyphSvg(r.glyph, 'x="7" y="3" width="24" height="30"')); }
          s.append('text').attr('class', 'f-date').attr('x', tx).attr('y', 9).text(d.date);
          d.lines.forEach((l, i) => s.append('text').attr('class', 'f-ttl').attr('x', tx).attr('y', 21.5 + i * 12.5).text(l));
        } else if (r.glyph) {
          s.append('rect').attr('class', 'plate').attr('x', 4).attr('y', 2).attr('width', 96).attr('height', 118);
          s.append('g').attr('class', 'gly').html(A.glyphSvg(r.glyph, 'x="19" y="14" width="66" height="94"'));
          s.append('text').attr('class', 'f-date').attr('x', 4).attr('y', 135).text(d.date);
          d.lines.forEach((l, i) => s.append('text').attr('class', 'f-serif it').attr('x', 4).attr('y', 151 + i * 15).text(l));
          s.append('text').attr('class', 'f-place').attr('x', 4).attr('y', 151 + d.lines.length * 15 + 0.5).text(cut(r.place, 20));
        } else {
          s.append('line').attr('class', 'f-rule').attr('x1', 4).attr('x2', 100).attr('y1', 3).attr('y2', 3);
          s.append('text').attr('class', 'f-eye').attr('x', 4).attr('y', 18).text(A.KINDS[r.kind]);
          d.lines.forEach((l, i) => s.append('text').attr('class', 'f-serif').attr('x', 4).attr('y', 39 + i * 18).text(l));
          s.append('text').attr('class', 'f-date').attr('x', 4).attr('y', 39 + d.lines.length * 18).text(d.date);
          s.append('text').attr('class', 'f-place').attr('x', 4).attr('y', 39 + d.lines.length * 18 + 14).text(cut(r.place, 20));
        }
        s.append('rect').attr('class', 'hit').attr('x', 0).attr('y', -1).attr('width', d.m === 'f' ? 104 : 150).attr('height', d.m === 'f' ? 186 : d.m === 'n' ? 38 : 14);
      });
      return g;
    });
    fg.attr('transform', d => `translate(${d.x},${d.zy})`).classed('sel', d => d.r.id === S.sel).attr('opacity', d => (inCut(d.r) ? 1 : 0.22))
      .on('click', (ev, d) => { ev.stopPropagation(); openRec(d.r.id); });
    fg.select('line.stem').attr('y1', 0).attr('y2', d => d.stem).style('stroke', d => `var(--c-${d.r.cat})`);

    // marcas de datação, uma por registro
    const rr = clamp(1 + ppy * 1.1, 1.1, 3.1);
    const mg = G.marks.selectAll('g.mk').data(recs, d => d.id).join(en => {
      const g = en.append('g').attr('class', d => 'mk p-' + d.prec);
      g.each(function (d) {
        const s = d3.select(this);
        if (d.range) s.append('rect'); else { if (d.prec === 'c') s.append('line'); s.append('circle'); }
        s.append('title').text(`${A.fmtDate(d)} · ${d.title}`);
      });
      return g;
    });
    mg.style('color', d => `var(--c-${d.cat})`).attr('opacity', d => (inCut(d) ? 1 : 0.22)).classed('sel', d => d.id === S.sel)
      .on('click', (ev, d) => { ev.stopPropagation(); openRec(d.id); });
    mg.select('circle').attr('cx', d => X(d.s)).attr('cy', d => base(d.lane) + (sh(d.lane) > 12 ? 4.8 : 4)).attr('r', d => rr + (d.imp === 3 && ppy > 1 ? 0.6 : 0));
    mg.select('line').attr('x1', d => X(d.s - 5)).attr('x2', d => X(d.s + 5)).attr('y1', d => base(d.lane) + (sh(d.lane) > 12 ? 4.8 : 4)).attr('y2', d => base(d.lane) + (sh(d.lane) > 12 ? 4.8 : 4)).attr('display', ppy > 1.2 ? null : 'none');
    mg.select('rect').attr('x', d => Math.max(GUT - 4, X(d.s))).attr('width', d => Math.max(1.5, Math.min(pr + 4, X(d.e)) - Math.max(GUT - 4, X(d.s))))
      .attr('y', d => base(d.lane) + (sh(d.lane) > 12 ? 9.3 : 7.6)).attr('height', d => (sh(d.lane) > 12 ? 4 : 3.2));

    // eixo
    const steps = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000], step = steps.find(s => s * ppy >= 76) || 2000;
    const ticks = []; const ya = Math.max(y0, T0 + 1);
    for (let y = Math.ceil(ya / step) * step; y <= y1; y += step) ticks.push({ y, x: X(y), t: y === 0 ? 'AEC | EC' : y < 0 ? (-y) + ' AEC' : String(y) });
    if (S.a < T0) [[-300000, '300 mil'], [-10000, '10 mil']].forEach(d => { const x = X(d[0]); if (x >= GUT - 1 && x <= pr) ticks.push({ y: d[0], x, t: d[1], deep: 1 }); });
    G.grid.selectAll('line').data(ticks, d => d.y).join('line').attr('x1', d => d.x).attr('x2', d => d.x).attr('y1', TOP).attr('y2', AX);
    const tg = G.axis.selectAll('g.tk').data(ticks, d => d.y).join(en => { const g = en.append('g').attr('class', 'tk'); g.append('line').attr('y2', 6); g.append('text').attr('y', 19); return g; });
    tg.attr('transform', d => `translate(${d.x},${AX})`).select('text').text(d => d.t).attr('text-anchor', d => (d.x < GUT + 24 ? 'start' : d.x > pr - 30 ? 'end' : 'middle'));
    const sub = step / (step === 25 || step === 250 || step === 2 ? 5 : step === 1 ? 1 : 5), minor = [];
    if (sub * ppy > 5 && sub !== step) for (let y = Math.ceil(ya / sub) * sub; y <= y1; y += sub) minor.push(y);
    G.axis.selectAll('line.mn').data(minor, d => d).join('line').attr('class', 'mn').attr('x1', d => X(d)).attr('x2', d => X(d)).attr('y1', AX).attr('y2', AX + 3);
    const notes = [];
    if (S.a < T0 - 20) notes.push({ k: 'deep', x: GUT, t: 'pré-história em escala comprimida', a: 'start', o: aN1 }, { k: 'brk', x: X(T0), t: '' });
    if (aN1 > 0.2 && cov[1] > GUT && cov[0] < pr) notes.push({ k: 'room', x: (cov[0] + cov[1]) / 2, t: 'sala aberta: 1400–1600', a: 'middle', o: aN1 });
    const ng = G.axis.selectAll('g.note').data(notes, d => d.k).join(en => { const g = en.append('g').attr('class', d => 'note n-' + d.k); g.append('path'); g.append('text').attr('y', 33); return g; });
    ng.attr('transform', d => `translate(${d.x},${AX})`).attr('opacity', d => (d.o == null ? 1 : d.o));
    ng.select('text').text(d => d.t).attr('text-anchor', d => d.a);
    ng.select('path').attr('d', d => (d.k === 'brk' ? 'M-4 5l3-10M1 5l3-10' : ''));

    // minimapa: toda a história, com a janela atual
    const mr = pr - 18, mx = w => GUT + (w - EXT[0]) / (EXT[1] - EXT[0]) * (mr - GUT);
    const mm = G.mini.selectAll('g.mm').data([0]).join(en => {
      const g = en.append('g').attr('class', 'mm');
      g.append('text').attr('class', 'mm-l').attr('x', 18).attr('y', MINI + 14).text('toda a história');
      g.append('rect').attr('class', 'mm-bg').attr('fill', 'url(#st-hatch)'); g.append('rect').attr('class', 'mm-cov'); g.append('g').attr('class', 'mm-t');
      g.append('rect').attr('class', 'mm-w'); g.append('rect').attr('class', 'mm-hit'); return g;
    });
    mm.select('.mm-bg').attr('x', GUT).attr('y', MINI).attr('width', Math.max(0, mr - GUT)).attr('height', 20);
    mm.select('.mm-cov').attr('x', mx(1400)).attr('y', MINI).attr('width', mx(1600) - mx(1400)).attr('height', 20);
    mm.select('.mm-t').selectAll('line').data([-3000, -2000, -1000, 0, 1000, 2000]).join('line').attr('x1', d => mx(d)).attr('x2', d => mx(d)).attr('y1', MINI + 20).attr('y2', MINI + 24);
    mm.select('.mm-w').attr('x', mx(S.a)).attr('y', MINI - 3).attr('width', Math.max(5, mx(S.b) - mx(S.a))).attr('height', 26);
    mm.select('.mm-hit').attr('x', GUT).attr('y', MINI - 4).attr('width', Math.max(0, mr - GUT)).attr('height', 28)
      .on('click', ev => { ev.stopPropagation(); const w = EXT[0] + (pt(ev)[0] - GUT) / (mr - GUT) * (EXT[1] - EXT[0]); const hs = (S.b - S.a) / 2; go(fit({ a: w - hs, b: w + hs })); });

    // meridiano
    const m = S.mer != null ? S.mer : S.hover, md = [];
    if (m != null) { const x = X(m); if (x >= GUT && x <= pr) md.push({ x, m }); }
    const meg = G.mer.selectAll('g.mer').data(md).join(en => {
      const g = en.append('g').attr('class', 'mer'); g.append('rect').attr('class', 'band'); g.append('line');
      g.append('rect').attr('class', 'chip').attr('rx', 2); g.append('text').attr('text-anchor', 'middle'); return g;
    });
    meg.classed('pin', S.mer != null);
    meg.select('line').attr('x1', d => d.x).attr('x2', d => d.x).attr('y1', TOP).attr('y2', AX + 7);
    meg.select('.band').attr('display', S.mer != null ? null : 'none').attr('x', d => X(d.m - S.margin)).attr('width', d => X(d.m + S.margin) - X(d.m - S.margin)).attr('y', TOP).attr('height', LH);
    const ypp = 1 / ppy, rs = ypp < 0.5 ? 1 : ypp < 2.5 ? 5 : ypp < 12 ? 10 : 50;
    const mt = d => (S.mer != null ? `${d.m} ± ${S.margin} anos` : d.m < T0 ? 'c. ' + A.fmtYear(Math.round(d.m / 1000) * 1000) : A.fmtYear(Math.round(d.m / rs) * rs));
    meg.select('text').attr('x', d => clamp(d.x, GUT + 48, pr - 48)).attr('y', AX + 19.5).text(mt);
    meg.select('.chip').each(function (d) { const w = mt(d).length * 6.6 + 26; d3.select(this).attr('x', clamp(d.x, GUT + 48, pr - 48) - w / 2).attr('y', AX + 7).attr('width', w).attr('height', 18); });

    // leituras
    const lvl = aN1 > 0.5 ? 'Panorama' : aN3 > 0.5 ? 'Vitrine' : 'Era';
    const f0 = y0 < T0 ? A.fmtYear(Math.round(y0 / 1000) * 1000) : A.fmtYear(y0), yrs = Math.round(y1 - y0);
    document.getElementById('st-win').innerHTML = `<b>${f0} – ${A.fmtYear(y1)}</b>` + (y0 >= T0 ? `<span>${yrs.toLocaleString('pt-BR')} anos</span>` : '');
    document.getElementById('st-level').innerHTML = `<b>${lvl}</b><span>${lvl === 'Panorama' ? 'sociedades e Estados de longa duração' : lvl === 'Era' ? 'registros agrupados, acontecimentos estruturantes' : 'um registro por marca, fichas e pranchas'}</span>`;
    const nd = recs.length, ns = sims.length;
    document.getElementById('st-count').innerHTML = `<b>${nd}</b> de demonstração` + (S.sim ? ` · <b>${ns.toLocaleString('pt-BR')}</b> simulados` : '') + ' nesta janela';
    panel.style.transform = `translateX(${PANEL - S.inset}px)`;
    panel.style.visibility = S.inset > 1 ? 'visible' : 'hidden';
    screen.classList.toggle('has-panel', S.inset > 120);
  }

  /* ---------- navegação ---------- */
  function fit(t) {
    let span = clamp(t.b - t.a, 8, EXT[1] - EXT[0]), a = t.a;
    a = clamp(a, EXT[0], EXT[1] - span);
    return Object.assign({}, t, { a, b: a + span });
  }
  let timer = null;
  function go(to, dur) {
    const from = { a: S.a, b: S.b, inset: S.inset, h: S.h.slice() };
    const t = { a: to.a != null ? to.a : S.a, b: to.b != null ? to.b : S.b, inset: to.inset != null ? to.inset : S.inset, h: heights(S.focus) };
    const zi = d3.interpolateZoom([(from.a + from.b) / 2, 0, from.b - from.a], [(t.a + t.b) / 2, 0, t.b - t.a]);
    const D = reduce ? 0 : dur != null ? dur : clamp(zi.duration * 0.95, 520, 1900);
    if (timer) timer.stop();
    const apply = k => {
      const z = zi(k); S.a = z[0] - z[2] / 2; S.b = z[0] + z[2] / 2;
      S.inset = lerp(from.inset, t.inset, k); S.h = from.h.map((h, i) => lerp(h, t.h[i], k)); render();
    };
    if (!D) { apply(1); return; }
    const e = d3.easeCubicInOut;
    timer = d3.timer(el => { const k = Math.min(1, el / D); apply(e(k)); if (k >= 1) timer.stop(); });
  }
  function zoomTo(year, span, lane) {
    if (lane != null) S.focus = lane;
    const c = warp(year); go(fit({ a: c - span / 2, b: c + span / 2 }));
  }
  function setPanel(kind) { S.panel = kind; drawPanel(); return kind ? PANEL : 0; }
  function openRec(id) {
    const r = A.byId[id]; S.sel = id; S.mer = null; S.focus = r.lane;
    const inset = setPanel('rec'), span = Math.min(S.b - S.a, 60), vis = (W - inset - GUT) / (W - GUT);
    let a = S.a, b = S.b; const xs = warp(r.s);
    if (b - a > 170 || xs < a + (b - a) * 0.06 || xs > a + (b - a) * vis * 0.86) { a = xs - span * 0.3; b = a + span; }
    go(fit({ a, b, inset }));
  }
  function openCut(year) { S.mer = Math.round(year); S.focus = -1; const inset = setPanel('cut'); let a = S.a, b = S.b; if (b - a > 120 || S.mer < a + 4 || S.mer > b - 4) { a = S.mer - 17; b = S.mer + 33; } go(fit({ a, b, inset })); }
  function closePanel() { S.sel = null; S.mer = null; go({ inset: setPanel(null) }); }
  function scene(i) {
    const sc = SCENES[i]; S.scene = i; S.focus = sc.focus; S.sel = sc.sel || null; S.mer = sc.mer != null ? sc.mer : null; S.margin = 5;
    const inset = setPanel(sc.panel);
    go(fit({ a: warp(sc.win[0]), b: warp(sc.win[1]), inset }));
    root.dispatchEvent(new CustomEvent('scene', { detail: i }));
  }

  /* ---------- painel ---------- */
  const deg = (v, p, n) => `${Math.abs(v).toFixed(2).replace('.', ',')}° ${v >= 0 ? p : n}`;
  const linkBtn = (r, why) => `<li><button type="button" data-go="${r.id}"><span class="yr">${A.fmtDate(r)}</span><span class="tt">${r.title}</span><span class="why">${why ? why + ' · ' : ''}${A.LANES[r.lane].name}</span></button></li>`;
  function drawPanel() {
    let h = '';
    const head = k => `<div class="pn-head"><span class="pn-kind">${k}</span><button type="button" class="pn-x" data-close aria-label="Fechar painel">×</button></div>`;
    if (S.panel === 'rec') {
      const r = A.byId[S.sel], t = A.TEXT[r.id] || {};
      const cat = A.CATS.find(c => c.id === r.cat);
      let links = t.links ? t.links.map(l => [A.byId[l[0]], l[1]]) : A.LINKS.filter(l => l.includes(r.id)).map(l => [A.byId[l[0] === r.id ? l[1] : l[0]], '']);
      h = head(t.kindLabel || A.KINDS[r.kind])
        + (r.glyph ? `<div class="pn-plate">${A.glyphSvg(r.glyph)}</div><p class="pn-credit">Silhueta ilustrativa. No acervo real, este espaço traz a fotografia com instituição, crédito e licença.</p>` : '')
        + `<h3 class="pn-title">${r.title}</h3>
        <dl class="pn-meta">
          <div><dt>Datação</dt><dd>${t.dating || A.fmtDate(r) + ' · ' + A.PREC[r.prec]}</dd></div>
          <div><dt>Lugar</dt><dd>${r.place}<span>${deg(r.lat, 'N', 'S')}, ${deg(r.lon, 'L', 'O')}</span></dd></div>
          <div><dt>Região</dt><dd>${A.LANES[r.lane].name}</dd></div>
          <div><dt>Categoria</dt><dd><i style="background:var(--c-${r.cat})"></i>${cat.name}</dd></div>
        </dl>
        <div class="pn-body">${(t.body || ['Texto de demonstração. A ficha real traz contexto, descrição e leitura crítica das fontes.']).map(p => `<p>${p}</p>`).join('')}</div>
        <button type="button" class="pn-btn" data-cut="${r.range ? Math.round((r.s + r.e) / 2) : r.s}">Ver o mundo em ${r.range ? Math.round((r.s + r.e) / 2) : r.s}</button>`
        + (links.length ? `<h4>Conexões</h4><ul class="pn-links">${links.map(l => linkBtn(l[0], l[1])).join('')}</ul>` : '')
        + `<h4>Fontes</h4><p class="pn-none">Nenhuma fonte cadastrada. Este é um registro de demonstração, ainda não validado.</p>
        <div class="pn-status"><span class="dash">demonstração</span><span>status: rascunho</span></div>`;
    } else if (S.panel === 'cut') {
      const hit = A.RECS.filter(r => active(r) && inCut(r));
      const proj = d3.geoEqualEarth().rotate([-10, 0]).fitExtent([[2, 2], [330, 164]], { type: 'Sphere' }), path = d3.geoPath(proj);
      h = head('Corte no tempo') + `<h3 class="pn-title">Enquanto isso, em ${S.mer}</h3>
        <p class="pn-sub">Registros que cruzam ${S.mer - S.margin}–${S.mer + S.margin}, por região.</p>
        <svg class="pn-map" viewBox="0 0 332 166"><path class="sph" d="${path({ type: 'Sphere' })}"/><path class="land" d="${path(window.ATLAS_LAND)}"/>${hit.map(r => { const p = proj([r.lon, r.lat]); return `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${r.range ? 2.6 : 3.4}" style="fill:var(--c-${r.cat})"${r.range ? ' opacity=".7"' : ''}/>`; }).join('')}</svg>
        <ul class="pn-cut">${A.LANES.map((l, i) => {
          const rs = hit.filter(r => r.lane === i).sort((p, q) => (q.range ? 0 : 3) + q.imp - ((p.range ? 0 : 3) + p.imp));
          const pts = rs.filter(r => !r.range);
          return `<li><span class="rg">${l.name}</span><div>${rs.slice(0, 2).map(r => `<button type="button" data-go="${r.id}"><span class="yr">${A.fmtDate(r)}</span>${r.title}</button>`).join('')}${rs.length > 2 ? `<em>mais ${rs.length - 2} ${rs.length - 2 === 1 ? 'registro' : 'registros'}</em>` : ''}${!rs.length ? '<em>sem registros neste corte</em>' : !pts.length ? '<em>só processos de longa duração, nenhuma data exata</em>' : ''}</div></li>`;
        }).join('')}</ul>
        <div class="pn-margin"><span>Margem</span>${[1, 5, 25].map(mg => `<button type="button" data-margin="${mg}" aria-pressed="${S.margin === mg}">± ${mg} ${mg === 1 ? 'ano' : 'anos'}</button>`).join('')}</div>`;
    } else if (S.panel === 'acervo') {
      const y0 = Math.round(unwarp(warp(SCENES[5].win[0]))), y1 = SCENES[5].win[1];
      const n = A.RECS.filter(r => r.e >= y0 && r.s <= y1).length, cx = w => 96 + (w - EXT[0]) / (EXT[1] - EXT[0]) * 232;
      h = head('Estado do acervo') + `<h3 class="pn-title it">Aqui o atlas ainda está quase em branco.</h3>
        <div class="pn-body"><p>Entre ${y0} e ${y1} há ${n} registros de demonstração. As linhas no topo de cada faixa mostram dinastias e Estados para orientar a leitura. A pesquisa deste trecho ainda não começou.</p></div>
        <h4>Cobertura por região, de 300 mil AEC a hoje</h4>
        <svg class="pn-cov" viewBox="0 0 332 ${A.LANES.length * 19 + 4}">${A.LANES.map((l, i) => `<text x="0" y="${i * 19 + 12}">${l.name.replace(' e Central', '').replace('Leste e Sudeste Asiático', 'Leste e Sudeste As.').replace(' e Pacífico', '')}</text><rect x="96" y="${i * 19 + 4}" width="232" height="10" fill="url(#st-hatch)"/><rect class="c" x="${cx(1400)}" y="${i * 19 + 4}" width="${cx(1600) - cx(1400)}" height="10"/>${A.RECS.filter(r => r.lane === i && r.s < 1100).map(r => `<rect class="c" x="${cx(r.s).toFixed(1)}" y="${i * 19 + 4}" width="1.2" height="10"/>`).join('')}`).join('')}<rect class="w" x="${cx(y0)}" y="1" width="${Math.max(4, cx(y1) - cx(y0))}" height="${A.LANES.length * 19}"/></svg>
        <dl class="pn-nums"><div><dt>${A.RECS.length}</dt><dd>registros de demonstração</dd></div><div><dt>1</dt><dd>sala aberta, 1400–1600</dd></div><div><dt>0</dt><dd>registros validados</dd></div></dl>
        <button type="button" class="pn-btn" data-win="1300,1700">Ir para o trecho mais denso, 1400–1600</button>
        <p class="pn-none">No produto, este painel também leva ao diário de pesquisa, com o que está sendo estudado agora.</p>`;
    }
    panel.innerHTML = h; panel.scrollTop = 0;
  }
  panel.addEventListener('click', ev => {
    const b = ev.target.closest('button'); if (!b) return;
    if (b.dataset.close != null) closePanel();
    else if (b.dataset.go) openRec(b.dataset.go);
    else if (b.dataset.cut) openCut(+b.dataset.cut);
    else if (b.dataset.margin) { S.margin = +b.dataset.margin; drawPanel(); render(); }
    else if (b.dataset.win) { const w = b.dataset.win.split(',').map(Number); S.focus = -1; go(fit({ a: warp(w[0]), b: warp(w[1]), inset: setPanel(null) })); }
  });

  /* ---------- ponteiro: meridiano, arrasto, abrir faixa ---------- */
  const node = svg.node();
  const pt = ev => { const r = node.getBoundingClientRect(); return [(ev.clientX - r.left) * W / r.width, (ev.clientY - r.top) * H / r.height]; };
  let drag = null;
  node.addEventListener('pointerdown', ev => {
    const p = pt(ev); if (p[1] < TOP || p[1] > AX + 30 || ev.button) return;
    drag = { x: p[0], y: p[1], a: S.a, b: S.b, moved: false, id: ev.pointerId };
  });
  node.addEventListener('pointermove', ev => {
    const p = pt(ev);
    if (drag) {
      const dx = p[0] - drag.x;
      if (!drag.moved && Math.abs(dx) > 4) { drag.moved = true; if (timer) timer.stop(); try { node.setPointerCapture(drag.id); } catch (e) { /* sem captura */ } node.classList.add('dragging'); }
      if (drag.moved) { const dw = -dx / (PR() - GUT) * (drag.b - drag.a), t = fit({ a: drag.a + dw, b: drag.b + dw }); S.a = t.a; S.b = t.b; S.hover = null; render(); }
      return;
    }
    const h = p[0] > GUT && p[0] < PR() && p[1] > TOP - 30 && p[1] < AX + 30 ? XI(p[0]) : null;
    if (h !== S.hover) { S.hover = h; render(); }
  });
  const up = ev => {
    if (!drag) return; const d = drag; drag = null; node.classList.remove('dragging');
    if (d.moved || ev.type === 'pointercancel') return;
    if (d.y > TOP && d.y < AX && !ev.target.closest('.fic,.mk,.clu,.key')) {
      let acc = TOP, li = -1; S.h.forEach((h, i) => { if (d.y >= acc && d.y < acc + h) li = i; acc += h; });
      if (li >= 0) { S.focus = S.focus === li ? -1 : li; go({}, 620); }
    }
  };
  node.addEventListener('pointerup', up); node.addEventListener('pointercancel', up);
  node.addEventListener('pointerleave', () => { if (S.hover != null && !drag) { S.hover = null; render(); } });
  const zoomBy = f => { const c = (S.a + S.b) / 2, s = (S.b - S.a) * f; go(fit({ a: c - s / 2, b: c + s / 2 })); };
  document.getElementById('st-in').addEventListener('click', () => zoomBy(0.45));
  document.getElementById('st-out').addEventListener('click', () => zoomBy(2.2));

  /* ---------- API para a página ---------- */
  window.AtlasStage = {
    scene, restyle() { readColors(); render(); },
    setSim(v) { S.sim = v; render(); }, count: SCENES.length
  };
  readColors(); drawPanel(); render();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => render());
})();
