/* VIKURA — interações editoriais
   Calm by design: 200–400ms, soft ease-out, nothing that bounces or loops. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const params = new URLSearchParams(location.search);
  const STATIC = params.has('static');            // full-page renders: every path drawn, demo states on
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  if (STATIC) document.documentElement.classList.add('is-static');

  /* ---------------------------------------------------------------- header */
  const header = $('.site-header');
  const onScrollHeader = () => header && header.classList.toggle('is-scrolled', scrollY > 8);

  const menuBtn = $('.menu-toggle');
  menuBtn && menuBtn.addEventListener('click', () => {
    const nav = $('.nav');
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', open);
  });

  /* ---------------------------------------------------------------- search */
  const searchIndex = [
    ['Ansiedade ou estresse? Entender a diferença pode mudar a forma de cuidar', 'Mente'],
    ['Por que dormir bem muda mais do que o seu nível de energia?', 'Sono'],
    ['Insônia e ansiedade: como uma alimenta a outra', 'Sono'],
    ['Melatonina: quando faz sentido e quando não faz', 'Sono'],
    ['Caminhar 7 mil passos já faz diferença?', 'Movimento'],
    ['Exercício e ansiedade: o que os estudos mostram', 'Movimento'],
    ['Ultraprocessados: o que os estudos realmente mostram até agora', 'Nutrição'],
    ['TDAH na vida adulta: sinais que costumam passar despercebidos', 'Neurodiversidade'],
    ['Cannabis medicinal no Brasil: como funciona a prescrição', 'Cannabis medicinal'],
    ['Força e equilíbrio depois dos 50', 'Longevidade'],
    ['Respiração lenta: uma ferramenta simples para desacelerar', 'Autocuidado'],
  ];
  const panel = $('.search-panel');
  const toggle = $('.search-toggle');
  const input = $('#busca');
  const results = $('.search-results');
  const setSearch = (open) => {
    if (!panel) return;
    panel.classList.toggle('is-open', open);
    panel.setAttribute('aria-hidden', !open);
    toggle && toggle.setAttribute('aria-expanded', open);
    if (open) setTimeout(() => input && input.focus({ preventScroll: true }), 120);
  };
  toggle && toggle.addEventListener('click', () => setSearch(!panel.classList.contains('is-open')));
  $('.search-close') && $('.search-close').addEventListener('click', () => { setSearch(false); toggle && toggle.focus(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && panel && panel.classList.contains('is-open')) { setSearch(false); toggle && toggle.focus(); } });
  const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  input && input.addEventListener('input', () => {
    const q = norm(input.value.trim());
    if (q.length < 2) { results.innerHTML = ''; return; }
    const hits = searchIndex.filter(([t, c]) => norm(t + ' ' + c).includes(q)).slice(0, 5);
    results.innerHTML = hits.length
      ? hits.map(([t, c]) => {
          const i = norm(t).indexOf(q);
          const title = i >= 0 ? `${t.slice(0, i)}<mark>${t.slice(i, i + q.length)}</mark>${t.slice(i + q.length)}` : t;
          return `<a href="artigo.html" class="search-hit"><span>${title}</span><span class="meta">${c}</span></a>`;
        }).join('')
      : `<span>Nenhum conteúdo com “${input.value}”. Tente um tema, como sono ou movimento.</span>`;
  });

  /* ---------------------------------------------------------------- icons: 2–3px parallax */
  $$('[data-parallax]').forEach((host) => {
    const icons = $$('.vk-icon', host);
    host.addEventListener('pointermove', (e) => {
      if (reduced) return;
      const r = host.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      icons.forEach((svg) => { svg.style.setProperty('--vk-px', x.toFixed(3)); svg.style.setProperty('--vk-py', y.toFixed(3)); });
    });
    host.addEventListener('pointerleave', () => icons.forEach((svg) => { svg.style.setProperty('--vk-px', 0); svg.style.setProperty('--vk-py', 0); }));
  });

  /* ---------------------------------------------------------------- topics */
  const topicData = {
    sono: ['Sono', [['Por que dormir bem muda mais do que o seu nível de energia?', 'Guia · 8 min'], ['Insônia e ansiedade: como uma alimenta a outra', 'Estudo comentado · 6 min'], ['Melatonina: quando faz sentido e quando não faz', 'Perguntas · 5 min']]],
    'saude-mental': ['Saúde mental', [['Ansiedade ou estresse? Entender a diferença pode mudar a forma de cuidar', 'Guia · 8 min'], ['Terapia: como escolher uma abordagem que faça sentido para você', 'Guia · 7 min'], ['Esgotamento: sinais que aparecem antes do limite', 'Estudo comentado · 6 min']]],
    neurodiversidade: ['Neurodiversidade', [['TDAH na vida adulta: sinais que costumam passar despercebidos', 'Guia · 10 min'], ['Autismo em mulheres adultas: por que o diagnóstico chega tarde', 'Histórias · 7 min'], ['Neurodiversidade no trabalho: o que muda com informação', 'Guia · 6 min']]],
    longevidade: ['Longevidade', [['Força e equilíbrio depois dos 50', 'Guia · 7 min'], ['Sono e memória com o passar dos anos', 'Estudo comentado · 6 min'], ['Vínculos sociais também são saúde', 'Ensaio · 5 min']]],
    movimento: ['Movimento', [['Caminhar 7 mil passos já faz diferença?', 'Estudo comentado · 5 min'], ['Exercício e ansiedade: o que os estudos mostram', 'Guia · 6 min'], ['Mobilidade para quem passa o dia sentado', 'Prática · 4 min']]],
    nutricao: ['Nutrição', [['Ultraprocessados: o que os estudos realmente mostram até agora', 'Estudo comentado · 6 min'], ['Intestino e humor: o que já se sabe', 'Guia · 8 min'], ['Proteína depois dos 50: quanto é suficiente?', 'Perguntas · 5 min']]],
    autocuidado: ['Autocuidado', [['Respiração lenta: uma ferramenta simples para desacelerar', 'Prática · 4 min'], ['Pausas ao longo do dia: por que funcionam', 'Guia · 5 min'], ['Rotina de sono para quem trabalha em turnos', 'Guia · 6 min']]],
  };
  const preview = $('.topics__preview');
  const selectTopic = (btn) => {
    const key = btn.dataset.topic;
    const [name, items] = topicData[key];
    $$('.topic').forEach((b) => { const on = b === btn; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', on); });
    if (!preview) return;
    preview.classList.add('is-swapping');
    setTimeout(() => {
      $('.topics__preview-name', preview).textContent = name;
      $('.topics__preview-all', preview).textContent = `Ver tudo sobre ${name.toLowerCase()}`;
      $('ol', preview).innerHTML = items.map(([t, m]) => `<li><a href="artigo.html"><span class="meta">${m}</span><span class="serif">${t}</span></a></li>`).join('');
      preview.classList.remove('is-swapping');
    }, reduced ? 0 : 180);
    requestAnimationFrame(layoutLines);
  };
  $$('.topic').forEach((btn) => {
    btn.addEventListener('click', () => selectTopic(btn));
  });

  /* ---------------------------------------------------------------- index filters */
  $$('.filter').forEach((f) => f.addEventListener('click', () => {
    $$('.filter').forEach((x) => x.setAttribute('aria-pressed', x === f));
    const kind = f.dataset.kind;
    $$('.ix[data-kind]').forEach((it) => it.classList.toggle('is-dim', kind !== 'all' && !it.dataset.kind.split(' ').includes(kind)));
  }));

  /* ---------------------------------------------------------------- newsletter */
  $$('.signup').forEach((form) => form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('input', form);
    if (!email.value || !email.checkValidity()) {
      $('.signup__note', form).textContent = 'Confira o e-mail: ele precisa ter o formato nome@dominio.com.';
      email.focus();
      return;
    }
    form.innerHTML = `<p class="signup__done">Pronto. A próxima seleção chega na quinta-feira, em ${email.value}.</p><p class="signup__note">Você pode cancelar a qualquer momento pelo link no fim de cada e-mail.</p>`;
  }));

  /* ================================================================ Direction Line */
  const journey = $('#journey');
  const lines = [];

  // Hermite curve through points with explicit tangents: smooth, never arrow-like.
  const curve = (pts) => {
    let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      const dist = Math.hypot(b.x - a.x, b.y - a.y);
      const ka = (a.k ?? 0.42) * dist, kb = (b.k ?? 0.42) * dist;
      const ta = a.t || [b.x - a.x, b.y - a.y], tb = b.t || [b.x - a.x, b.y - a.y];
      const la = Math.hypot(...ta) || 1, lb = Math.hypot(...tb) || 1;
      d += `C${(a.x + (ta[0] / la) * ka).toFixed(1)} ${(a.y + (ta[1] / la) * ka).toFixed(1)} ${(b.x - (tb[0] / lb) * kb).toFixed(1)} ${(b.y - (tb[1] / lb) * kb).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
    }
    return d;
  };
  const box = (el) => {
    const r = el.getBoundingClientRect();
    const o = journey.getBoundingClientRect();
    return { left: r.left - o.left, top: r.top - o.top, right: r.right - o.left, bottom: r.bottom - o.top, width: r.width, height: r.height, cx: r.left - o.left + r.width / 2, cy: r.top - o.top + r.height / 2 };
  };
  const margin = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--m')) || 64;
  const narrow = () => innerWidth <= 720;

  const defs = {
    // Hero: leaves the headline, crosses the photograph, travels down the margin and underlines the topic.
    hero() {
      const last = $('.hero__title .line:last-child');
      const photo = $('.hero__photo');
      const topic = $('.topic.is-active .topic__name') || $('.topic__name');
      if (!last || !photo || !topic) return null;
      const range = document.createRange();
      range.selectNodeContents(last);
      const rr = range.getBoundingClientRect(), o = journey.getBoundingClientRect();
      const t = { right: rr.right - o.left, top: rr.top - o.top, height: rr.height };
      const p = box(photo), n = box(topic), gx = margin() / 2;
      const x0 = t.right + 22, y0 = t.top + t.height * 0.58;
      if (narrow()) {
        return [
          { x: gx, y: p.top - 80, t: [0, 1] },
          { x: gx, y: p.bottom + 80, t: [0, 1] },
          { x: gx, y: n.bottom - 40, t: [0, 1] },
          { x: n.left, y: n.bottom + 7, t: [1, 0], k: 0.5 },
          { x: n.right + 4, y: n.bottom + 7, t: [1, 0] },
        ];
      }
      return [
        { x: x0, y: y0, t: [1, 0.12] },
        { x: p.left + p.width * 0.7, y: p.top + p.height * 0.34, t: [0.08, 1], k: 0.5 },
        { x: p.left + p.width * 0.26, y: p.bottom, t: [-1, 0.42], k: 0.42 },
        { x: gx, y: p.bottom + 200, t: [-0.12, 1], k: 0.5 },
        { x: gx, y: n.bottom - 46, t: [0, 1] },
        { x: n.left, y: n.bottom + 7, t: [1, 0], k: 0.55 },
        { x: n.right + 6, y: n.bottom + 7, t: [1, 0] },
      ];
    },

    // The path of knowledge: one continuous journey through four stages, open at both ends.
    path() {
      const nodes = $$('.stage__node');
      const sec = $('.path__stages');
      if (nodes.length < 4 || !sec) return null;
      const s = box(sec);
      const c = nodes.map((n) => box(n));
      if (narrow()) {
        const x = c[0].cx;
        return [
          { x, y: s.top - 60, t: [0, 1] },
          ...c.map((b) => ({ x: b.cx, y: b.cy, t: [0, 1] })),
          { x, y: s.bottom + 40, t: [0, 1] },
        ];
      }
      const W = journey.getBoundingClientRect().width;
      return [
        { x: -20, y: c[0].cy + 150, t: [1, -0.55] },
        { x: c[0].cx, y: c[0].cy, t: [1, 0], k: 0.42 },
        { x: c[1].cx, y: c[1].cy, t: [1, 0], k: 0.42 },
        { x: c[2].cx, y: c[2].cy, t: [1, 0], k: 0.42 },
        { x: c[3].cx, y: c[3].cy, t: [1, 0], k: 0.42 },
        { x: W + 20, y: c[3].cy - 150, t: [1, -0.55] },
      ];
    },

    // Human stories: from the headline down across the active photograph.
    stories() {
      const title = $('.stories__title');
      const photo = $('.stories__active .photo');
      if (!title || !photo || narrow()) return null;
      const range = document.createRange();
      range.selectNodeContents($('.stories__title .line:last-child') || title);
      const rr = range.getBoundingClientRect(), o = journey.getBoundingClientRect();
      const p = box(photo);
      return [
        { x: rr.right - o.left + 22, y: rr.top - o.top + rr.height * 0.6, t: [1, 0.2] },
        { x: p.left + p.width * 0.82, y: p.top + p.height * 0.2, t: [0, 1], k: 0.5 },
        { x: p.left + p.width * 0.62, y: p.bottom - p.height * 0.08, t: [-1, 0.5], k: 0.45 },
      ];
    },

    // Index: links a quote to the study it comes from.
    index() {
      const q = $('.ix--quote figcaption');
      const ref = $('.ix--ref .ref');
      if (!q || !ref || narrow()) return null;
      const a = box(q), b = box(ref);
      return [
        { x: a.left, y: a.bottom + 26, t: [1, 0] },
        { x: b.left - 1, y: b.top, t: [0.2, -1], k: 0.6 },
      ];
    },

    // Footer: underlines the last promise and leaves the page, still open.
    footer() {
      const last = $('.footer__statement .line:last-child');
      if (!last) return null;
      const range = document.createRange();
      range.selectNodeContents(last);
      const rr = range.getBoundingClientRect(), o = journey.getBoundingClientRect();
      const W = o.width;
      const y = rr.bottom - o.top + 6;
      return [
        { x: rr.left - o.left, y, t: [1, 0] },
        { x: rr.right - o.left + 40, y, t: [1, 0] },
        { x: W + 20, y: y - 140, t: [1, -0.8], k: 0.5 },
      ];
    },
  };

  const ns = 'http://www.w3.org/2000/svg';
  function layoutLines() {
    if (!journey) return;
    journey.setAttribute('height', document.documentElement.scrollHeight);
    journey.style.height = document.documentElement.scrollHeight + 'px';
    lines.length = 0;
    journey.innerHTML = '';
    $$('[data-line]').forEach((host) => {
      const name = host.dataset.line;
      const pts = defs[name] && defs[name]();
      if (!pts) return;
      const path = document.createElementNS(ns, 'path');
      path.setAttribute('class', 'dline-path');
      path.setAttribute('d', curve(pts));
      path.dataset.name = name;
      journey.appendChild(path);
      const end = pts[pts.length - 1];
      let cap = null;
      if (name === 'hero' || name === 'stories' || name === 'index') {
        cap = document.createElementNS(ns, 'circle');
        cap.setAttribute('cx', end.x); cap.setAttribute('cy', end.y);
        cap.setAttribute('r', name === 'index' ? 3 : 4);
        cap.setAttribute('class', name === 'hero' || name === 'index' ? 'dline-dot' : 'dline-end');
        journey.appendChild(cap);
      }
      const L = path.getTotalLength();
      path.style.strokeDasharray = `${L} ${L}`;
      const ys = pts.map((p) => p.y);
      const line = { name, path, cap, L, top: Math.min(...ys), bottom: Math.max(...ys), pts };
      if (name === 'path') {
        // where along the line each stage sits
        const nodes = $$('.stage');
        line.stops = nodes.map((st) => {
          const b = box($('.stage__node', st));
          let best = 0, bd = Infinity;
          for (let i = 0; i <= 240; i++) {
            const l = (L * i) / 240, q = path.getPointAtLength(l);
            const dd = (q.x - b.cx) ** 2 + (q.y - b.cy) ** 2;
            if (dd < bd) { bd = dd; best = l; }
          }
          return { el: st, at: best / L };
        });
      }
      lines.push(line);
    });
    drawLines();
  }

  function drawLines() {
    const vh = innerHeight;
    const top = journey ? journey.getBoundingClientRect().top + scrollY : 0;
    lines.forEach((ln) => {
      let p;
      if (STATIC || reduced) p = 1;
      else {
        const start = top + ln.top - vh * 0.82;
        const span = Math.max(1, ln.bottom - ln.top + vh * 0.12);
        p = clamp((scrollY - start) / span);
        if (ln.name === 'hero') p = Math.max(p, heroIntro);
      }
      ln.path.style.strokeDashoffset = (ln.L * (1 - p)).toFixed(1);
      if (ln.cap) ln.cap.style.opacity = p > 0.985 ? 1 : 0;
      if (ln.stops) ln.stops.forEach((s) => s.el.classList.toggle('is-reached', p >= s.at - 0.01));
    });
  }

  // The hero line draws its first stretch on load, then follows the scroll.
  let heroIntro = STATIC || reduced ? 1 : 0;
  let introStart = 0;
  const intro = (now) => {
    if (!introStart) introStart = now;
    const t = clamp((now - introStart) / 1400);
    heroIntro = 0.32 * (1 - Math.pow(1 - t, 3));
    drawLines();
    if (t < 1) requestAnimationFrame(intro);
  };

  /* ================================================================ Article */
  const prose = $('.prose');
  const sources = {
    1: ['McEwen, 1998', 'Protective and damaging effects of stress mediators', 'New England Journal of Medicine', '1998', 'Artigo de revisão'],
    2: ['APA, 2022', 'Diagnostic and Statistical Manual of Mental Disorders, 5th ed., Text Revision (DSM-5-TR)', 'American Psychiatric Association', '2022', 'Manual diagnóstico'],
    3: ['OMS, 2017', 'Depression and other common mental disorders: global health estimates', 'Organização Mundial da Saúde', '2017', 'Relatório técnico'],
    4: ['COVID-19 Mental Disorders Collaborators, 2021', 'Global prevalence and burden of depressive and anxiety disorders in 204 countries and territories in 2020 due to the COVID-19 pandemic', 'The Lancet', '2021', 'Estudo de carga global de doença'],
    5: ['Stonerock et al., 2015', 'Exercise as treatment for anxiety: systematic review and analysis', 'Annals of Behavioral Medicine', '2015', 'Revisão sistemática'],
    6: ['Hofmann et al., 2012', 'The efficacy of cognitive behavioral therapy: a review of meta-analyses', 'Cognitive Therapy and Research', '2012', 'Revisão de meta-análises'],
  };
  const noteMarkup = (n, inline) => {
    const [short, title, pub, year, type] = sources[n];
    return `<div class="note__head"><span class="note__n">${n}</span><span>${short}</span></div>
      <div class="note__more"><div>
        <span class="note__title">${title}</span>
        <span><span class="note__pub">${pub}</span> · ${year}</span>
        <span>${type}</span>
        <a class="note__link" href="#fonte-${n}">Ver na lista de fontes <span class="cp cp--sm cp--e" aria-hidden="true"></span></a>
      </div></div>`;
  };

  let notes = [];
  function layoutNotes() {
    const aside = $('.notes');
    if (!aside || !prose || getComputedStyle(aside).display === 'none') return;
    const base = aside.getBoundingClientRect().top;
    let floor = -Infinity;
    notes.forEach((nt) => {
      const r = nt.cite.getBoundingClientRect();
      const want = r.top - base - 2;
      const y = Math.max(want, floor);
      nt.el.style.top = y + 'px';
      floor = y + nt.el.offsetHeight + 14;
    });
  }
  function openNote(n, on, pin) {
    notes.forEach((nt) => {
      const match = nt.n === n;
      if (pin !== undefined && match) nt.pinned = pin;
      const open = match ? on || nt.pinned : nt.pinned;
      nt.el.classList.toggle('is-open', !!open);
    });
    $$('.cite').forEach((c) => c.classList.toggle('is-open', notes.some((nt) => nt.n === c.dataset.cite && nt.el.classList.contains('is-open'))));
    setTimeout(layoutNotes, 0);
    setTimeout(layoutNotes, 420);
  }

  if (prose) {
    const aside = $('.notes');
    const seen = new Set();
    $$('.cite', prose).forEach((cite) => {
      const n = cite.dataset.cite;
      cite.setAttribute('aria-label', `Fonte ${n}: ${sources[n][0]}`);
      if (aside && !seen.has(n)) {
        seen.add(n);
        const el = document.createElement('div');
        el.className = 'note';
        el.id = `nota-${n}`;
        el.innerHTML = noteMarkup(n);
        aside.appendChild(el);
        notes.push({ n, el, cite, pinned: false });
        el.addEventListener('mouseenter', () => openNote(n, true));
        el.addEventListener('mouseleave', () => openNote(n, false));
      }
      cite.addEventListener('mouseenter', () => openNote(n, true));
      cite.addEventListener('mouseleave', () => openNote(n, false));
      cite.addEventListener('focus', () => openNote(n, true));
      cite.addEventListener('blur', () => openNote(n, false));
      cite.addEventListener('click', (e) => {
        e.preventDefault();
        if (aside && getComputedStyle(aside).display !== 'none') {
          const nt = notes.find((x) => x.n === n);
          openNote(n, true, !nt.pinned);
          return;
        }
        // Small screens: the source unfolds right under the paragraph.
        const para = cite.closest('p, li');
        let box = para.nextElementSibling;
        if (!box || !box.classList.contains('cite-inline') || box.dataset.n !== n) {
          $$('.cite-inline', prose).forEach((b) => b.remove());
          box = document.createElement('div');
          box.className = 'cite-inline note';
          box.dataset.n = n;
          box.innerHTML = noteMarkup(n);
          box.style.position = 'relative';
          box.style.margin = '12px 0 4px';
          para.after(box);
          requestAnimationFrame(() => box.classList.add('is-open'));
          cite.classList.add('is-open');
        } else {
          box.remove();
          cite.classList.remove('is-open');
        }
      });
    });

    // Contents + reading progress
    const heads = $$('.prose h2[id]');
    const tocLinks = $$('.toc a');
    const readFrom = () => {
      const r = prose.getBoundingClientRect();
      const total = r.height - innerHeight * 0.6;
      const read = STATIC ? 0.34 : clamp((-r.top + innerHeight * 0.2) / total);
      document.documentElement.style.setProperty('--read', read.toFixed(4));
      let cur = heads[0];
      heads.forEach((h) => { if (h.getBoundingClientRect().top < 160) cur = h; });
      if (STATIC) cur = heads[1];
      tocLinks.forEach((a) => a.classList.toggle('is-current', cur && a.getAttribute('href') === '#' + cur.id));
    };
    addEventListener('scroll', readFrom, { passive: true });
    addEventListener('resize', readFrom);
    readFrom();

    // Knowledge moments: the line along each list draws when it enters the view.
    if (!STATIC && !reduced && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.style.setProperty('--drawn', 1); io.unobserve(en.target); }
      }), { threshold: 0.35 });
      $$('.moment__list').forEach((l) => { l.style.setProperty('--drawn', 0); io.observe(l); });
    }
  }

  /* ---------------------------------------------------------------- boot */
  const relayout = () => { layoutLines(); layoutNotes(); };
  addEventListener('scroll', () => { onScrollHeader(); drawLines(); }, { passive: true });
  let rz;
  addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(relayout, 120); });
  const boot = () => {
    onScrollHeader();
    relayout();
    if (STATIC) {
      const kc = $('[data-demo="hover"]');
      kc && kc.classList.add('is-preview');
      if (notes.length) openNote('3', true, true);
      setTimeout(relayout, 60);
    } else if (!reduced) requestAnimationFrame(intro);
  };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(boot);
  addEventListener('load', relayout);
})();
