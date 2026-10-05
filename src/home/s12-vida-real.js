// Direction Line for "Saúde na vida real": underlines the last line of Juliana's quote,
// then rises and leaves the page open. Wide screens only; on phones the quote stands alone.
if (!document.querySelector('.s-vida') || !window.Vikura) return;

window.Vikura.lines.register('vida', (u) => {
  const q = u.$('.s-vida__quote-text');
  if (!q || u.narrow()) return null;
  const b = u.textBox(q);
  const y = b.bottom + 12;
  return [
    { x: b.left + 6, y, t: [1, 0] },
    { x: b.right + 20, y, t: [1, 0], k: 0.4 },
    { x: u.width() + 20, y: y - 150, t: [1, -0.9], k: 0.5 },
  ];
}, { offset: 0.7, cap: null });
