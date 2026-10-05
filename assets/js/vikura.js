/* VIKURA — interações editoriais (núcleo)
   Calm by design: 200–350ms, soft ease-out, nothing that bounces or loops.

   Public API for page sections (see src/home/*.js):
     Vikura.lines.register(name, def, opts)
       def(util) returns an array of points [{x, y, t: [dx, dy], k}] in page
       coordinates, or { points, stops: [elements] }. Hosts opt in with
       data-line="name". opts: { cap: 'dot' | 'ring' | null, dashed: bool,
       start: 0..1 (fraction drawn before scrolling), offset: vh fraction }
     Vikura.util: { $, $$, box(el), textBox(el), margin(), narrow(), clamp, STATIC, reduced }
     Vikura.relayout()
*/
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
  const onScrollHeader = () => header && header.classList.toggle('is-scrolled', scrollY > 40);

  const menuBtn = $('.menu-toggle');
  menuBtn && menuBtn.addEventListener('click', () => {
    const nav = $('.nav');
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });

  /* ---------------------------------------------------------------- search */
  const searchIndex = [
    ['Não existe uma única forma de estar bem', 'Bem-estar'],
    ['Ansiedade ou estresse? Entender a diferença pode mudar a forma de cuidar', 'Saúde mental'],
    ['Por que descansar também faz parte do cuidado?', 'Saúde mental'],
    ['Dormir melhor começa antes de deitar', 'Sono'],
    ['O impacto da luz no sono', 'Sono'],
    ['O que acontece com seu corpo quando você dorme menos de seis horas?', 'Sono'],
    ['Saúde mental depois dos 40', 'Saúde mental'],
    ['Caminhar ainda é um dos melhores exercícios?', 'Movimento'],
    ['O que sabemos sobre creatina e cognição', 'Ciência'],
    ['Exercício pode ajudar a memória? O que mostram as evidências', 'Ciência'],
    ['O que realmente muda quando começamos a envelhecer melhor?', 'Longevidade'],
    ['Cannabis medicinal e dor crônica', 'Cannabis medicinal'],
    ['TDAH na vida adulta: sinais que costumam passar despercebidos', 'Neurodiversidade'],
    ['Ultraprocessados: o que os estudos realmente mostram até agora', 'Nutrição'],
    ['Cinco perguntas para levar à próxima consulta', 'Especial'],
    ['Burnout não é falta de força de vontade', 'Saúde mental'],
    ['Quando procurar ajuda em saúde mental', 'Saúde mental'],
    ['Força depois dos 60: por que o músculo virou assunto de saúde', 'Longevidade'],
    ['Amizades protegem a memória?', 'Longevidade'],
    ['Subir escadas conta como exercício?', 'Movimento'],
    ['Cannabis medicinal: como funciona no Brasil', 'Cannabis medicinal'],
    ['CBD, THC e espectro completo: o que muda entre os produtos', 'Cannabis medicinal'],
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

  /* ---------------------------------------------------------------- icons: 1–3px parallax */
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

  /* ---------------------------------------------------------------- disclosure */
  // <button class="disclose" aria-expanded="false" aria-controls="x"> + <div class="disclose__panel" id="x"><div>…</div></div>
  $$('.disclose[aria-controls]').forEach((btn) => {
    const target = document.getElementById(btn.getAttribute('aria-controls'));
    if (!target) return;
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', open);
      target.classList.toggle('is-open', open);
      const label = btn.querySelector('[data-open-label]');
      if (label) label.textContent = open ? label.dataset.closeLabel : label.dataset.openLabel;
      setTimeout(relayout, 380);
    });
  });

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
  const registry = new Map();
  const lines = [];
  const ns = 'http://www.w3.org/2000/svg';

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
  const origin = () => journey.getBoundingClientRect();
  const box = (el) => {
    const r = el.getBoundingClientRect();
    const o = origin();
    return { left: r.left - o.left, top: r.top - o.top, right: r.right - o.left, bottom: r.bottom - o.top, width: r.width, height: r.height, cx: r.left - o.left + r.width / 2, cy: r.top - o.top + r.height / 2 };
  };
  // Box of the rendered text itself (last line of a headline, for example).
  const textBox = (el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    const rects = [...range.getClientRects()];
    const r = rects.length ? rects[rects.length - 1] : el.getBoundingClientRect();
    const o = origin();
    return { left: r.left - o.left, top: r.top - o.top, right: r.right - o.left, bottom: r.bottom - o.top, width: r.width, height: r.height, cx: r.left - o.left + r.width / 2, cy: r.top - o.top + r.height / 2 };
  };
  const margin = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--m')) || 48;
  const narrow = () => innerWidth <= 720;
  const util = { $, $$, box, textBox, margin, narrow, clamp, STATIC, reduced, width: () => origin().width };

  function layoutLines() {
    if (!journey) return;
    const H = document.documentElement.scrollHeight;
    journey.setAttribute('height', H);
    journey.style.height = H + 'px';
    lines.length = 0;
    journey.innerHTML = '';
    $$('[data-line]').forEach((host) => {
      const name = host.dataset.line;
      const entry = registry.get(name);
      if (!entry) return;
      let out;
      try { out = entry.def(util, host); } catch (err) { console.warn('Direction Line', name, err); return; }
      if (!out) return;
      const pts = Array.isArray(out) ? out : out.points;
      if (!pts || pts.length < 2) return;
      const opts = entry.opts || {};
      const path = document.createElementNS(ns, 'path');
      path.setAttribute('class', 'dline-path' + (opts.dashed ? ' dline-path--dashed' : ''));
      path.setAttribute('d', curve(pts));
      path.dataset.name = name;
      journey.appendChild(path);
      let cap = null;
      if (opts.cap) {
        const end = pts[pts.length - 1];
        cap = document.createElementNS(ns, 'circle');
        cap.setAttribute('cx', end.x); cap.setAttribute('cy', end.y);
        cap.setAttribute('r', opts.cap === 'dot' ? 3.5 : 4.5);
        cap.setAttribute('class', opts.cap === 'dot' ? 'dline-dot' : 'dline-end');
        journey.appendChild(cap);
      }
      const L = path.getTotalLength();
      if (!opts.dashed) path.style.strokeDasharray = `${L} ${L}`;
      const ys = pts.map((p) => p.y);
      const line = { name, path, cap, L, opts, top: Math.min(...ys), bottom: Math.max(...ys) };
      const stops = !Array.isArray(out) && out.stops ? out.stops : null;
      if (stops) {
        line.stops = stops.map((el) => {
          const b = box(el);
          let best = 0, bd = Infinity;
          for (let i = 0; i <= 240; i++) {
            const l = (L * i) / 240, q = path.getPointAtLength(l);
            const dd = (q.x - b.cx) ** 2 + (q.y - b.cy) ** 2;
            if (dd < bd) { bd = dd; best = l; }
          }
          return { el, at: best / L };
        });
      }
      lines.push(line);
    });
    drawLines();
  }

  function drawLines() {
    if (!journey) return;
    const vh = innerHeight;
    const top = journey.getBoundingClientRect().top + scrollY;
    lines.forEach((ln) => {
      let p;
      if (STATIC || reduced) p = 1;
      else {
        const start = top + ln.top - vh * (ln.opts.offset ?? 0.82);
        const span = Math.max(1, ln.bottom - ln.top + vh * 0.12);
        p = clamp((scrollY - start) / span);
        if (ln.opts.start) p = Math.max(p, ln.opts.start * intro);
      }
      if (ln.opts.dashed) {
        // dashed lines reveal through a mask-less trick: fade in with progress
        ln.path.style.opacity = clamp(p * 1.4).toFixed(3);
      } else {
        ln.path.style.strokeDashoffset = (ln.L * (1 - p)).toFixed(1);
      }
      if (ln.cap) ln.cap.style.opacity = p > 0.985 ? 1 : 0;
      if (ln.stops) ln.stops.forEach((s) => s.el.classList.toggle('is-reached', p >= s.at - 0.01));
    });
  }

  // Lines that start inside the first view draw their first stretch on load.
  let intro = STATIC || reduced ? 1 : 0;
  let introStart = 0;
  const introStep = (now) => {
    if (!introStart) introStart = now;
    const t = clamp((now - introStart) / 1400);
    intro = 1 - Math.pow(1 - t, 3);
    drawLines();
    if (t < 1) requestAnimationFrame(introStep);
  };

  // Footer: the last line underlines the promise and leaves the page, still open.
  registry.set('footer', {
    opts: {},
    def: ({ textBox, $, width }) => {
      const last = $('.footer__statement .line:last-child');
      if (!last) return null;
      const t = textBox(last);
      const W = width();
      const y = t.bottom + 4;
      return [
        { x: t.left, y, t: [1, 0] },
        { x: t.right + 48, y, t: [1, 0] },
        { x: W + 20, y: y - 120, t: [1, -0.8], k: 0.5 },
      ];
    },
  });

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
  const noteMarkup = (n) => {
    const [short, title, pub, year, type] = sources[n];
    return `<div class="note__head"><span class="note__n">${n}</span><span>${short}</span></div>
      <div class="note__more"><div>
        <span class="note__title">${title}</span>
        <span><span class="note__pub">${pub}</span> · ${year}</span>
        <span>${type}</span>
        <a class="note__link" href="#fonte-${n}">Ver na lista de fontes <span class="cp cp--sm" aria-hidden="true"></span></a>
      </div></div>`;
  };

  const notes = [];
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
        let inline = para.nextElementSibling;
        if (!inline || !inline.classList.contains('cite-inline') || inline.dataset.n !== n) {
          $$('.cite-inline', prose).forEach((b) => b.remove());
          inline = document.createElement('div');
          inline.className = 'cite-inline note';
          inline.dataset.n = n;
          inline.innerHTML = noteMarkup(n);
          inline.style.position = 'relative';
          inline.style.margin = '12px 0 4px';
          para.after(inline);
          requestAnimationFrame(() => inline.classList.add('is-open'));
          cite.classList.add('is-open');
        } else {
          inline.remove();
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
  let booted = false;
  const relayout = () => { layoutLines(); layoutNotes(); };
  window.Vikura = {
    util,
    relayout,
    lines: {
      register(name, def, opts = {}) {
        registry.set(name, { def, opts });
        if (booted) relayout();
      },
    },
  };
  addEventListener('scroll', () => { onScrollHeader(); drawLines(); }, { passive: true });
  let rz;
  addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(relayout, 120); });
  const boot = () => {
    booted = true;
    onScrollHeader();
    relayout();
    document.dispatchEvent(new CustomEvent('vikura:ready'));
    if (STATIC) {
      $$('[data-demo-open]').forEach((el) => el.click());
      if (notes.length) openNote('3', true, true);
      setTimeout(relayout, 60);
    } else if (!reduced) requestAnimationFrame(introStep);
  };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(boot, 0));
  addEventListener('load', relayout);
})();
