// Especial: the brand board's word stack passes the needle from word to word, slowly.
// The big needle settles once when the band comes into view. Both stay still under
// reduced motion and in ?static renders.
const band = document.querySelector('.s-especial');
if (!band) return;
const U = window.Vikura && window.Vikura.util;
const still = !U || U.STATIC || U.reduced;

if (still) { band.classList.add('is-in'); return; }
new IntersectionObserver((entries, io) => {
  if (entries.some((e) => e.isIntersecting)) { band.classList.add('is-in'); io.disconnect(); }
}, { threshold: 0.35 }).observe(band);

const words = [...band.querySelectorAll('[data-wordstack] .wordstack__w')];
let i = words.findIndex((w) => w.classList.contains('is-on'));
setInterval(() => {
  if (document.hidden) return;
  words[i].classList.remove('is-on');
  i = (i + 1) % words.length;
  words[i].classList.add('is-on');
}, 2800);
