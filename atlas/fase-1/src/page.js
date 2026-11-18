/* Página: escala das telas, controles do storyboard e pequenos desenhos de apoio. */
(function () {
  const A = window.ATLAS, d3 = window.d3;

  // telas de tamanho fixo, escaladas para a largura disponível
  const screens = Array.from(document.querySelectorAll('.screen'));
  function fitScreens() {
    screens.forEach(s => {
      const w = +s.dataset.w, h = +s.dataset.h, min = +(s.dataset.min || 760);
      const k = Math.max(s.clientWidth, min) / w, fit = s.firstElementChild, inner = fit.firstElementChild;
      fit.style.width = w * k + 'px'; fit.style.height = h * k + 'px'; inner.style.transform = `scale(${k})`;
    });
  }
  fitScreens();
  if (window.ResizeObserver) new ResizeObserver(fitScreens).observe(document.body); else window.addEventListener('resize', fitScreens);

  // sumário
  const tocBtns = Array.from(document.querySelectorAll('.toc button'));
  tocBtns.forEach(b => b.addEventListener('click', () => { const t = document.getElementById(b.dataset.to); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
  if (window.IntersectionObserver) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) tocBtns.forEach(b => b.setAttribute('aria-current', String(b.dataset.to === e.target.id))); }), { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('section.sec').forEach(s => io.observe(s));
  }
  if (!A || !d3) return;

  // silhuetas e mapa dos mockups de celular
  document.querySelectorAll('[data-glyph]').forEach(e => { e.innerHTML = A.glyphSvg(e.dataset.glyph); });
  const cm = document.querySelector('[data-cutmap]'), cl = document.querySelector('[data-cutlist]');
  if (cm && window.ATLAS_LAND) {
    const hit = A.RECS.filter(r => r.s <= 1518 && r.e >= 1508);
    const proj = d3.geoEqualEarth().rotate([-10, 0]).fitExtent([[4, 4], [246, 122]], { type: 'Sphere' }), path = d3.geoPath(proj);
    cm.innerHTML = `<path class="sph" d="${path({ type: 'Sphere' })}"/><path class="land" d="${path(window.ATLAS_LAND)}"/>` + hit.map(r => { const p = proj([r.lon, r.lat]); return `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="2.6" style="fill:var(--c-${r.cat})"/>`; }).join('');
    cl.innerHTML = A.LANES.map((l, i) => {
      const rs = hit.filter(r => r.lane === i && !r.range).sort((a, b) => b.imp - a.imp)[0];
      return `<li><b>${l.name}</b><span>${rs ? `<span>${A.fmtDate(rs)}</span>${rs.title}` : '<em>só processos longos</em>'}</span></li>`;
    }).join('');
  }

  // esquema do conceito D
  const dg = document.getElementById('diagram-d');
  if (dg) {
    const x = d3.scaleLinear([1400, 1600], [150, 500]), y = i => 34 + i * 34; let s = '';
    A.LANES.forEach((l, i) => { s += `<rect x="0" y="${y(i)}" width="520" height="34" style="fill:var(--${i % 2 ? 'surface' : 'bg'})"/><text class="dl" x="14" y="${y(i) + 21}">${l.name.replace(' e Central', '').replace('Leste e Sudeste Asiático', 'Leste e Sudeste Asiát.')}</text>`; });
    A.RECS.filter(r => r.s >= 1400 && r.s <= 1600 && r.imp >= 2 && r.e - r.s <= 60).forEach(r => {
      const on = r.s <= 1518 && r.e >= 1508, c = `var(--c-${r.cat})`;
      s += r.range ? `<rect x="${x(r.s).toFixed(1)}" y="${y(r.lane) + 21}" width="${(x(Math.min(1600, r.e)) - x(r.s)).toFixed(1)}" height="3.4" style="fill:${c}" opacity="${on ? 1 : 0.35}"/>`
        : `<circle cx="${x(r.s).toFixed(1)}" cy="${y(r.lane) + 12}" r="${on ? 3.6 : 2.6}" style="fill:${c}" opacity="${on ? 1 : 0.4}"/>`;
    });
    s += `<rect x="${x(1508)}" y="34" width="${x(1518) - x(1508)}" height="238" style="fill:var(--rub)" opacity=".1"/><line x1="${x(1513)}" x2="${x(1513)}" y1="20" y2="280" style="stroke:var(--rub)" stroke-width="1.5"/><text class="dm" x="${x(1513) + 7}" y="24">meridiano · 1513</text>`;
    s += `<line x1="150" x2="500" y1="280" y2="280" style="stroke:var(--ink3)"/>` + [1400, 1450, 1500, 1550, 1600].map(t => `<line x1="${x(t)}" x2="${x(t)}" y1="280" y2="285" style="stroke:var(--ink3)"/><text x="${x(t)}" y="300" text-anchor="middle">${t}</text>`).join('');
    s += `<text x="14" y="24">paralelos · regiões</text><text x="14" y="300">tempo</text><line x1="150" x2="150" y1="34" y2="280" style="stroke:var(--rule)"/>`;
    dg.innerHTML = s;
  }

  // storyboard
  const stage = document.getElementById('stage'), api = window.AtlasStage;
  if (!stage || !api) return;
  const SC = [
    { t: 'Toda a história numa tela', k: 'Panorama',
      f: ['Sete faixas regionais, de 300 mil anos atrás até hoje. Em cada uma, barras de sociedades e Estados de longa duração. Na base de cada faixa, a tira do acervo: hachurada onde ainda não há pesquisa, marcada onde há registros.',
        'Primeiro as faixas e os nomes das sociedades. Depois a sala aberta, 1400–1600, único trecho com registros. Por último o eixo e o minimapa.',
        'O cursor carrega o meridiano com o ano. Arrastar percorre o tempo. A pré-história usa escala comprimida, sinalizada no eixo.',
        'Zoom contínuo sobre 1400–1600. As barras afinam até virar linhas de contexto no topo de cada faixa e o bloco de sedimento se abre em grupos contados.'] },
    { t: 'Uma era de perto', k: 'Quatro séculos',
      f: ['De 1300 a 1700. Estados e dinastias viram linhas de contexto. Os registros aparecem agrupados em círculos com contagem, coloridos pela categoria dominante. Só os acontecimentos estruturantes têm rótulo.',
        'Primeiro os rótulos dos acontecimentos estruturantes. Depois os grupos e seu tamanho, que mostram onde há mais material. Por último o contexto político e o eixo.',
        'Clicar num grupo aproxima até ele se desfazer em registros. Os filtros por categoria recalculam os grupos na hora.',
        'Zoom para 1496–1546 e abertura da faixa Ásia Ocidental e Central. Os grupos se desfazem em marcas individuais. As outras faixas encolhem e continuam na tela.'] },
    { t: 'A vitrine de uma região', k: 'Cinquenta anos',
      f: ['A faixa aberta mostra pranchas de objetos e fichas de acontecimentos. As outras seguem visíveis em versão compacta. Na base de cada faixa há uma marca por registro, com a forma da sua datação.',
        'Primeiro as pranchas com imagem. Depois as fichas de texto. Por último as marcas de datação e as faixas vizinhas.',
        'Clicar em outra faixa troca a vitrine. Arrastar percorre os anos. O que não cabe como ficha permanece como marca e ganha ficha ao aproximar.',
        'Clique na prancha do Mapa de Piri Reis. O painel entra pela direita e a linha do tempo se comprime para continuar inteira na tela.'] },
    { t: 'Um registro aberto', k: 'Detalhe',
      f: ['Painel com imagem, título, datação com grau de precisão, lugar, texto, conexões, fontes e status. À esquerda a linha do tempo permanece, com o registro marcado.',
        'Primeiro imagem e título. Depois datação e lugar. Em seguida as conexões. Por último fontes, crédito da imagem e status.',
        'Cada conexão é um salto e leva a linha do tempo até o outro registro. O botão “Ver o mundo em 1513” fixa o meridiano naquele ano.',
        'Botão “Ver o mundo em 1513”. O painel troca de conteúdo, a faixa aberta volta ao tamanho normal e o meridiano fica fixo.'] },
    { t: 'Enquanto isso', k: 'Simultaneidade',
      f: ['Meridiano fixo em 1513, com margem de cinco anos. Os registros que cruzam o corte ficam acesos e o resto recua. O painel lista até dois registros por região e mostra os pontos num planisfério.',
        'Primeiro a linha do meridiano e os registros acesos. Depois a lista por região. Por último o planisfério.',
        'A margem do corte muda entre ±1, ±5 e ±25 anos. Regiões sem data exata no corte dizem isso com todas as letras. No produto, o meridiano também poderá ser arrastado.',
        'Afastar e deslizar até 780–1030, um trecho onde a pesquisa ainda não começou.'] },
    { t: 'Um trecho em branco', k: 'Acervo em construção',
      f: ['Duzentos e cinquenta anos com oito registros. As linhas de contexto continuam, a tira do acervo aparece hachurada e o painel mostra o estado do acervo: quantos registros existem e onde eles estão.',
        'Primeiro a frase que explica o vazio. Depois os poucos registros existentes. Por último o mapa de cobertura por região.',
        'Um atalho leva ao trecho mais denso. O minimapa mostra a única sala aberta. No produto, o painel também leva ao diário de pesquisa.',
        'Fim do percurso. O atalho para 1400–1600 devolve à cena 2.'] }
  ];
  const tabs = document.getElementById('sb-tabs'), LBL = ['Na tela', 'Hierarquia visual', 'Navegação', 'Transição para a próxima cena'];
  tabs.innerHTML = SC.map((s, i) => `<button type="button" role="tab" data-i="${i}" aria-selected="${i === 0}"><b>CENA ${i + 1}</b><span>${s.k}</span></button>`).join('');
  const prev = document.getElementById('sb-prev'), next = document.getElementById('sb-next'); let cur = 0;
  function notes(i) {
    cur = i;
    tabs.querySelectorAll('button').forEach((b, j) => b.setAttribute('aria-selected', String(j === i)));
    document.getElementById('sb-k').textContent = `Cena ${i + 1} de ${SC.length} · ${SC[i].k}`;
    document.getElementById('sb-title').textContent = SC[i].t;
    document.getElementById('sb-fields').innerHTML = SC[i].f.map((t, j) => `<div><dt>${LBL[j]}</dt><dd>${t}</dd></div>`).join('');
    prev.disabled = i === 0; next.disabled = i === SC.length - 1;
  }
  tabs.addEventListener('click', ev => { const b = ev.target.closest('button'); if (b) api.scene(+b.dataset.i); });
  prev.addEventListener('click', () => api.scene(Math.max(0, cur - 1)));
  next.addEventListener('click', () => api.scene(Math.min(SC.length - 1, cur + 1)));
  stage.addEventListener('scene', ev => notes(ev.detail));
  notes(0);

  const pair = (a, b, fn) => { const A1 = document.getElementById(a), B1 = document.getElementById(b); const set = v => { A1.setAttribute('aria-pressed', String(v)); B1.setAttribute('aria-pressed', String(!v)); fn(v); }; A1.addEventListener('click', () => set(true)); B1.addEventListener('click', () => set(false)); return set; };
  pair('sim-on', 'sim-off', v => api.setSim(v));
  const setSkin = pair('skin-day', 'skin-night', v => { stage.dataset.skin = v ? 'day' : 'night'; api.restyle(); });
  const th = document.documentElement.getAttribute('data-theme');
  if (th === 'dark' || (!th && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) setSkin(false);
})();
