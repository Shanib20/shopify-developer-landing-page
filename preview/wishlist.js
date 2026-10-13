document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('[data-product-grid]');
  const heading = document.querySelector('[data-product-grid-heading]');
  const emptyState = document.querySelector('[data-product-grid-empty]');
  if (grid) {
    window.addEventListener('tabs:change', (e) => {
      const target = e.detail.value;
      const cards = grid.querySelectorAll('.product-card');
      let visibleCount = 0;
      cards.forEach((card) => {
        const collections = card.dataset.productCollections.split(',');
        const matches = !target || collections.includes(target);
        card.classList.toggle('is-filtered-out', !matches);
        if (matches) visibleCount += 1;
      });
      if (heading && e.detail.label) heading.textContent = e.detail.label;
      if (emptyState) emptyState.hidden = visibleCount > 0;
    });
  }

  document.querySelectorAll('[data-wishlist-toggle]').forEach((btn) => {
    const id = btn.dataset.productId;
    const key = `wishlist:${id}`;
    const setState = (active) => {
      btn.setAttribute('aria-pressed', String(active));
      try { localStorage.setItem(key, active ? '1' : '0'); } catch (err) { /* storage unavailable */ }
    };
    let saved = false;
    try { saved = localStorage.getItem(key) === '1'; } catch (err) { /* storage unavailable */ }
    setState(saved);
    btn.addEventListener('click', () => setState(btn.getAttribute('aria-pressed') !== 'true'));
  });
});
