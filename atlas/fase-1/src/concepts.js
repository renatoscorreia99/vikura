/* Mockups das três direções de arte. Mesmos dados, três composições. */
(function () {
  const A = window.ATLAS, d3 = window.d3;
  if (!A || !d3) return;
  const R = A.RECS.filter(r => r.e >= 1400 && r.s <= 1600);
  const N = R.length;
  const el = id => document.getElementById(id);
  const cat = id => A.CATS.find(c => c.id === id).name;

  /* ---------- A · Arquivo Vivo ---------- */
  (function () {
    const host = el('mock-a'); if (!host) return;
    const hero = A.byId.idia, next = ['pedrasol', 'monalisa', 'sistina'].map(i => A.byId[i]);
    const x = d3.scaleLinear([1400, 1600], [0, 1104]);
    let ticks = '';
    for (let y = 1400; y <= 1600; y += 10) ticks += `<line x1="${x(y)}" x2="${x(y)}" y1="40" y2="${y % 50 ? 46 : 52}" class="t"/>` + (y % 50 ? '' : `<text x="${x(y)}" y="74" class="n">${y}</text>`);
    const marks = R.filter(r => r.s >= 1400).map(r => `<line x1="${x(r.s).toFixed(1)}" x2="${x(r.s).toFixed(1)}" y1="${r.glyph ? 22 : 30}" y2="40" class="${r.glyph ? 'o' : 'e'}"/>`).join('');
    host.innerHTML = `
      <header class="ca-top"><span class="ca-wm">Atlas</span><nav><b>Sala 1400–1600</b><span>Salas</span><span>Acervo</span><span>Sobre</span></nav><span class="ca-s">Buscar</span></header>
      <section class="ca-intro">
        <p class="ca-eye">Sala 1400–1600 · ${N} registros de demonstração</p>
        <h3>O mundo<br>por volta<br>de <em>1500</em></h3>
        <p class="ca-p">Objetos, obras e documentos de sete regiões, em ordem de tempo. Role para atravessar a sala.</p>
        <p class="ca-arrows"><span>←</span><span>→</span></p>
      </section>
      <figure class="ca-hero">
        <div class="ca-plate">${A.glyphSvg(hero.glyph)}</div>
        <figcaption><span class="k">47 de ${N}</span><em>${hero.title}</em><span>${hero.place} · ${A.fmtDate(hero)}</span><span>Marfim esculpido</span></figcaption>
      </figure>
      <div class="ca-next">${next.map((r, i) => `<figure class="n${i}"><div class="ca-plate">${A.glyphSvg(r.glyph)}</div><figcaption><em>${r.title}</em><span>${A.fmtDate(r)}</span></figcaption></figure>`).join('')}</div>
      <div class="ca-ruler"><svg viewBox="-24 0 1152 84" width="1152" height="84">
        <line x1="0" x2="1104" y1="40" y2="40" class="b"/>${ticks}${marks}
        <rect x="${x(1500)}" y="14" width="${x(1521) - x(1500)}" height="26" class="w"/>
        <line x1="${x(1500)}" x2="${x(1500)}" y1="6" y2="40" class="h"/><text x="${x(1500) + 6}" y="11" class="hl">em exposição · 1500–1521</text>
      </svg></div>`;
  })();

  /* ---------- B · Observatório do Tempo ---------- */
  (function () {
    const host = el('mock-b'); if (!host) return;
    const W = 1200, H = 720, x = d3.scaleLinear([1400, 1600], [196, 1160]);
    const laneY = i => 126 + i * 64, col = c => `var(--b-${c})`;
    const pos = {}; const hash = s => { let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) % 997; return h / 997; };
    R.forEach(r => { pos[r.id] = [x(Math.max(1400, r.s)), laneY(r.lane) + (hash(r.id) - 0.5) * 34]; });
    const sel = A.byId.gama, linked = new Set(A.LINKS.filter(l => l.includes('gama')).flat());
    let s = `<rect width="${W}" height="${H}" class="bg"/>`;
    A.LANES.forEach((l, i) => { s += `<line x1="196" x2="1160" y1="${laneY(i)}" y2="${laneY(i)}" class="ln"/><text x="28" y="${laneY(i) + 3}" class="lb">${l.name.toUpperCase()}</text>`; });
    for (let y = 1400; y <= 1600; y += 25) s += `<line x1="${x(y)}" x2="${x(y)}" y1="92" y2="544" class="gr"/><text x="${x(y)}" y="682" class="ax" text-anchor="middle">${y}</text>`;
    s += A.SIM.map(p => `<circle cx="${x(p.s).toFixed(1)}" cy="${(laneY(p.lane) + (p.v - 0.5) * 50).toFixed(1)}" r="1" style="fill:${col(p.cat)}" opacity=".42"/>`).join('');
    s += A.LINKS.filter(l => pos[l[0]] && pos[l[1]]).map(l => {
      const p = pos[l[0]], q = pos[l[1]], on = l.includes('gama'), mx = (p[0] + q[0]) / 2, my = Math.min(p[1], q[1]) - Math.abs(p[0] - q[0]) * 0.22 - 14;
      return `<path d="M${p[0].toFixed(1)} ${p[1].toFixed(1)}Q${mx.toFixed(1)} ${my.toFixed(1)} ${q[0].toFixed(1)} ${q[1].toFixed(1)}" class="arc${on ? ' on' : ''}"/>`;
    }).join('');
    s += R.map(r => {
      const p = pos[r.id], on = linked.has(r.id);
      return (r.range && r.e - r.s <= 60 ? `<line x1="${p[0].toFixed(1)}" x2="${x(Math.min(1600, r.e)).toFixed(1)}" y1="${p[1].toFixed(1)}" y2="${p[1].toFixed(1)}" style="stroke:${col(r.cat)}" class="iv"/>` : '')
        + `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${1.6 + r.imp * 0.8}" style="fill:${col(r.cat)}" class="pt${on ? ' on' : ''}"/>`;
    }).join('');
    const placed = [];
    R.filter(r => r.imp === 3 || linked.has(r.id)).sort((p, q) => (linked.has(q.id) ? 1 : 0) - (linked.has(p.id) ? 1 : 0)).forEach(r => {
      const p = pos[r.id], t = r.title.length > 30 ? r.title.slice(0, 29) + '…' : r.title, w = t.length * 5.5 + 10, bx = [p[0] + 7, p[1] - 9, p[0] + 7 + w, p[1] + 4];
      if (bx[2] > 1170 || placed.some(b => !(bx[0] > b[2] || bx[2] < b[0] || bx[1] > b[3] || bx[3] < b[1]))) return;
      placed.push(bx); s += `<text x="${(p[0] + 8).toFixed(1)}" y="${(p[1] + 3).toFixed(1)}" class="tl${linked.has(r.id) ? ' on' : ''}">${t}</text>`;
    });
    const sp = pos.gama;
    s += `<line x1="${sp[0]}" x2="${sp[0]}" y1="92" y2="660" class="cross"/><circle cx="${sp[0]}" cy="${sp[1]}" r="9" class="ring"/>`;
    const bins = d3.bin().domain([1400, 1600]).thresholds(d3.range(1400, 1600, 2))(A.SIM.map(p => p.s).concat(R.map(r => r.s)));
    const hy = d3.scaleLinear([0, d3.max(bins, b => b.length)], [0, 78]);
    s += bins.map(b => `<rect x="${x(b.x0).toFixed(1)}" y="${(660 - hy(b.length)).toFixed(1)}" width="${(x(b.x1) - x(b.x0) - 1.4).toFixed(1)}" height="${hy(b.length).toFixed(1)}" class="hb${b.x0 >= 1480 && b.x1 <= 1520 ? ' in' : ''}"/>`).join('');
    s += `<rect x="${x(1480)}" y="574" width="${x(1520) - x(1480)}" height="88" class="br"/><text x="${x(1480)}" y="568" class="ax">JANELA 1480–1520</text>`;
    s += `<text x="28" y="40" class="wm">ATLAS / OBSERVATÓRIO</text><text x="28" y="60" class="ax">N = ${(A.SIM.length + N).toLocaleString('pt-BR')} REGISTROS · ${A.SIM.length.toLocaleString('pt-BR')} SIMULADOS · 7 REGIÕES</text>`;
    s += `<g transform="translate(846,26)"><rect width="314" height="78" class="ro"/><text x="14" y="22" class="ax hi">1498 · CALICUTE · 11,26° N 75,78° L</text><text x="14" y="45" class="rt">${sel.title}</text><text x="14" y="64" class="ax">${linked.size - 1} CONEXÕES · ${cat(sel.cat).toUpperCase()}</text></g>`;
    s += `<g transform="translate(28,602)">${A.CATS.map((c, i) => `<circle cx="4" cy="${i * 14}" r="3" style="fill:${col(c.id)}"/><text x="14" y="${i * 14 + 3}" class="ax">${c.name.toUpperCase()}</text>`).join('')}</g>`;
    host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${s}</svg>`;
  })();

  /* ---------- C · Atlas da Humanidade ---------- */
  (function () {
    const host = el('mock-c'); if (!host || !window.ATLAS_LAND) return;
    const W = 1200, H = 720, w0 = 1475, w1 = 1525;
    const proj = d3.geoEqualEarth().rotate([-10, 0]).fitExtent([[26, 84], [846, 512]], { type: 'Sphere' }), path = d3.geoPath(proj);
    const inWin = R.filter(r => r.s <= w1 && r.e >= w0), keyed = inWin.filter(r => r.imp === 3 && !r.range || ['idia', 'pedrasol', 'monalisa'].includes(r.id)).sort((a, b) => a.s - b.s).slice(0, 13);
    const routes = [
      ['Vasco da Gama, 1497–1498', 'r1', [[-9.14, 38.72], [-17, 28], [-23.5, 15], [-22, 0], [-28, -18], [-15, -32], [5, -36], [18.47, -34.36], [27, -34], [35.5, -24], [40.7, -15], [40.12, -3.22], [58, 6], [75.78, 11.26]]],
      ['Magalhães e Elcano, 1519–1522', 'r2', [[-6.35, 36.78], [-17, 28], [-25, 10], [-32, -8], [-43.2, -22.9], [-58, -36], [-67.5, -49.3], [-70, -52.6], [-78, -48], [-90, -30], [-115, -16], [-145, -8], [-168, 2], [172, 8], [144.79, 13.44], [123.96, 10.31], [127.4, 0.7], [125, -9], [100, -20], [70, -32], [40, -37], [18.5, -36], [5, -25], [-15, 0], [-24, 15], [-28, 30], [-6.35, 36.78]]]
    ];
    let s = `<rect width="${W}" height="${H}" class="paper"/><path d="${path({ type: 'Sphere' })}" class="sea"/><path d="${path(d3.geoGraticule().step([30, 30])())}" class="grat"/><path d="${path(window.ATLAS_LAND)}" class="land"/><path d="${path({ type: 'Sphere' })}" class="neat"/>`;
    [['Oceano Atlântico', -34, 6], ['Oceano Índico', 78, -24], ['Oceano Pacífico', -135, 2], ['Oceano Pacífico', 158, 24]].forEach(o => { const p = proj([o[1], o[2]]); s += `<text x="${p[0]}" y="${p[1]}" class="ocean" text-anchor="middle">${o[0]}</text>`; });
    routes.forEach(r => { s += `<path d="${path({ type: 'LineString', coordinates: r[2] })}" class="route ${r[1]}"/>`; });
    s += inWin.filter(r => !keyed.includes(r)).map(r => { const p = proj([r.lon, r.lat]); return `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="2.6" class="pin"/>`; }).join('');
    const used = [];
    keyed.forEach((r, i) => {
      let p = proj([r.lon, r.lat]); let dx = 0, dy = 0;
      while (used.some(u => Math.hypot(u[0] - p[0] - dx, u[1] - p[1] - dy) < 17)) { dx += 12; dy -= 9; }
      used.push([p[0] + dx, p[1] + dy]);
      s += (dx ? `<line x1="${p[0]}" y1="${p[1]}" x2="${p[0] + dx}" y2="${p[1] + dy}" class="lead"/><circle cx="${p[0]}" cy="${p[1]}" r="1.8" class="pin"/>` : '') + `<circle cx="${p[0] + dx}" cy="${p[1] + dy}" r="8" class="num"/><text x="${p[0] + dx}" y="${p[1] + dy + 3.6}" class="numt" text-anchor="middle">${i + 1}</text>`;
    });
    s += `<text x="28" y="38" class="rub">ATLAS DA HUMANIDADE · PRANCHA DE DEMONSTRAÇÃO</text><text x="28" y="68" class="ttl">O mundo entre ${w0} e ${w1}</text>`;
    s += `<text x="846" y="68" class="meta" text-anchor="end">${inWin.length} registros na janela · projeção Equal Earth</text>`;
    s += `<g transform="translate(884,40)"><text class="rub" y="0">LEGENDA</text>${keyed.map((r, i) => `<g transform="translate(0,${22 + i * 26})"><circle cx="8" cy="-4" r="8" class="num"/><text x="8" y="-0.4" class="numt" text-anchor="middle">${i + 1}</text><text x="26" y="0" class="lg"><tspan class="${r.prec === 'e' ? 'yr' : 'yr it'}">${A.fmtDate(r)}</tspan><tspan dx="7">${r.title.length > 30 ? r.title.slice(0, 29) + '…' : r.title}</tspan></text></g>`).join('')}
      <g transform="translate(0,${22 + keyed.length * 26 + 14})"><line x1="0" x2="34" y1="-4" y2="-4" class="route r1"/><text x="42" y="0" class="lg">${routes[0][0]}</text><line x1="0" x2="34" y1="16" y2="16" class="route r2"/><text x="42" y="20" class="lg">${routes[1][0]}</text><text x="0" y="44" class="meta">Traçados esquemáticos. Datas em itálico são aproximadas.</text></g></g>`;
    const x = d3.scaleLinear([1400, 1600], [190, 1172]), ry = i => 566 + i * 17;
    s += `<line x1="28" x2="1172" y1="540" y2="540" class="rule"/><rect x="${x(w0)}" y="548" width="${x(w1) - x(w0)}" height="${7 * 17 + 6}" class="win"/>`;
    A.LANES.forEach((l, i) => { s += `<text x="28" y="${ry(i)}" class="rg">${l.name}</text><line x1="190" x2="1172" y1="${ry(i) - 4}" y2="${ry(i) - 4}" class="rr"/>`; });
    s += R.map(r => (r.range
      ? `<rect x="${x(Math.max(1400, r.s)).toFixed(1)}" y="${ry(r.lane) - 6.2}" width="${Math.max(2, x(Math.min(1600, r.e)) - x(Math.max(1400, r.s))).toFixed(1)}" height="4.4" class="iv${r.prec === 'i' ? '' : ' est'}"/>`
      : `<line x1="${x(r.s).toFixed(1)}" x2="${x(r.s).toFixed(1)}" y1="${ry(r.lane) - 11}" y2="${ry(r.lane) + 2}" class="tk${r.imp === 3 ? ' k' : ''}"/>`)).join('');
    for (let y = 1400; y <= 1600; y += 25) s += `<text x="${x(y)}" y="702" class="ax" text-anchor="middle">${y}</text><line x1="${x(y)}" x2="${x(y)}" y1="684" y2="689" class="rule"/>`;
    s += `<path d="M${x(w0)} 548v-8M${x(w1)} 548v-8" class="hand"/>`;
    host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${s}</svg>`;
  })();
})();
