// Em destaque agora: on phones the headline list scrolls sideways.
// Fade only the edge that still has content behind it.
const rail = document.querySelector('.s-destaque [data-scroll-x]');
if (!rail) return;
const update = () => {
  const max = rail.scrollWidth - rail.clientWidth;
  rail.classList.toggle('is-scrolled', rail.scrollLeft > 4);
  rail.classList.toggle('is-end', max <= 4 || rail.scrollLeft >= max - 4);
};
rail.addEventListener('scroll', update, { passive: true });
addEventListener('resize', update);
update();
