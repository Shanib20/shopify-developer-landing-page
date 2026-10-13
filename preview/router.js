/* Preview-only hash router for the footer/info pages (Shipping, Returns,
   FAQ, Contact, About, Careers, Press, Sustainability, Privacy, Terms,
   Accessibility, Cookies). Not part of the Shopify theme: theme/ renders
   real Shopify pages via merchant-configurable menus instead. Uses plain
   location.hash changes (not pushState) so browser Back/Forward work for
   free via native history. */
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.querySelector('[data-info-overlay]');
  if (!overlay) return;

  const pages = Array.from(overlay.querySelectorAll('[data-info-page]'));
  const breadcrumbCurrent = overlay.querySelector('[data-info-breadcrumb-current]');
  const backLink = overlay.querySelector('[data-info-back]');
  const homeSections = Array.from(document.querySelectorAll(
    '.category-tabs, .hero-slider, .categories, .product-grid-section, .brand-story'
  ));

  function render() {
    const match = location.hash.match(/^#\/info\/([a-z-]+)/);
    const page = match ? pages.find((p) => p.dataset.infoPage === match[1]) : null;

    if (!page) {
      overlay.hidden = true;
      homeSections.forEach((s) => { s.hidden = false; });
      return;
    }

    pages.forEach((p) => { p.hidden = p !== page; });
    homeSections.forEach((s) => { s.hidden = true; });
    overlay.hidden = false;

    const heading = page.querySelector('h1');
    const label = heading ? heading.textContent.trim() : match[1];
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = label;
    document.title = label + ' — Heritage';
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', render);
  render();

  if (backLink) {
    backLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (history.length > 1) {
        history.back();
      } else {
        location.hash = '';
      }
    });
  }

  overlay.querySelectorAll('[data-info-demo-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fields = form.querySelector('[data-info-form-fields]');
      const success = form.querySelector('[data-info-form-success]');
      if (fields) fields.hidden = true;
      if (success) success.hidden = false;
    });
  });
});
