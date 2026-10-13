document.addEventListener('DOMContentLoaded', () => {
  const tabs = Array.from(document.querySelectorAll('.category-tabs__tab'));
  if (!tabs.length) return;

  const scrollToProducts = () => {
    const target = document.querySelector('.product-grid-section') || document.querySelector('[data-product-grid]');
    if (!target) return;
    const header = document.querySelector('[data-site-header]');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: 'smooth'
    });
  };

  const activate = (tab, shouldScroll = false) => {
    tabs.forEach((t) => {
      const isActive = t === tab;
      t.setAttribute('aria-selected', String(isActive));
      t.setAttribute('tabindex', isActive ? '0' : '-1');
      const path = t.querySelector('.arch-shape path');
      if (path) {
        path.setAttribute('fill', isActive ? 'var(--color-accent)' : 'var(--color-muted)');
        path.setAttribute('stroke-width', isActive ? '0' : '1');
      }
    });
    tab.focus();
    dispatch(tab);

    if (shouldScroll) {
      scrollToProducts();
    }
  };

  const dispatch = (tab) => {
    const label = tab.querySelector('.category-tabs__label');
    window.dispatchEvent(new CustomEvent('tabs:change', {
      detail: { value: tab.dataset.tabValue, label: label ? label.textContent : '' },
    }));
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activate(tab, true));
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') activate(tabs[(i + 1) % tabs.length]);
      if (e.key === 'ArrowLeft') activate(tabs[(i - 1 + tabs.length) % tabs.length]);
      if (e.key === 'Home') activate(tabs[0]);
      if (e.key === 'End') activate(tabs[tabs.length - 1]);
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate(tab, true);
      }
    });
  });

  const initial = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
  if (initial) dispatch(initial);

  // Links elsewhere on the page (header nav, mobile menu, footer "Shop"
  // column, hero CTA) that should both scroll to the products and pre-select a tab there.
  document.querySelectorAll('[data-nav-tab-trigger]').forEach((link) => {
    const match = tabs.find((t) => t.dataset.tabValue === link.dataset.navTabTrigger);
    if (!match) return;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      activate(match, true);
    });
  });
});
