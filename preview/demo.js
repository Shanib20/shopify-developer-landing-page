/* Preview-only interactivity. Not part of the Shopify theme — the real
   theme/ uses Shopify's own search, cart (AJAX /cart API) and account
   routes once pushed to a store; this file exists only so the static
   mirror in preview/ is fully clickable when opened as a plain HTML file. */
document.addEventListener('DOMContentLoaded', () => {
  /* ---------- search + tab filtering ---------- */
  const grid = document.querySelector('[data-product-grid]');
  const emptyState = document.querySelector('[data-product-grid-empty]');
  const searchInputs = Array.from(document.querySelectorAll('.site-header__search input, .site-header__mobile-search-inner input'));
  const tabsRow = document.querySelector('.category-tabs__row');

  let searchTerm = '';

  const getActiveTabValue = () => {
    const activeTab = tabsRow ? tabsRow.querySelector('.category-tabs__tab[aria-selected="true"]') : null;
    return activeTab ? activeTab.dataset.tabValue : '';
  };

  const applyFilters = () => {
    if (!grid) return;
    const tabValue = getActiveTabValue();
    const cards = grid.querySelectorAll('.product-card');
    let visible = 0;
    cards.forEach((card) => {
      const collections = (card.dataset.productCollections || '').split(',');
      const matchesTab = !tabValue || collections.includes(tabValue);
      const title = card.querySelector('.product-card__title');
      const matchesSearch = !searchTerm || (title && title.textContent.toLowerCase().includes(searchTerm));
      const isVisible = matchesTab && matchesSearch;
      card.classList.toggle('is-filtered-out', !isVisible);
      if (isVisible) visible += 1;
    });
    if (emptyState) {
      emptyState.hidden = visible > 0;
      emptyState.textContent = searchTerm
        ? 'No products match "' + searchTerm + '".'
        : 'No products in this category yet.';
    }
  };

  searchInputs.forEach((input) => {
    input.addEventListener('input', () => {
      searchTerm = input.value.trim().toLowerCase();
      searchInputs.forEach((other) => { if (other !== input) other.value = input.value; });
      applyFilters();
    });
    const form = input.closest('form');
    if (form) form.addEventListener('submit', (e) => e.preventDefault());
  });

  window.addEventListener('tabs:change', applyFilters);

  /* ---------- cart drawer ---------- */
  const drawer = document.querySelector('[data-cart-drawer]');
  if (!drawer) return;

  const backdrop = drawer.querySelector('[data-cart-drawer-backdrop]');
  const closeBtn = drawer.querySelector('[data-cart-drawer-close]');
  const itemsEl = drawer.querySelector('[data-cart-drawer-items]');
  const emptyEl = drawer.querySelector('[data-cart-drawer-empty]');
  const footerEl = drawer.querySelector('[data-cart-drawer-footer]');
  const subtotalEl = drawer.querySelector('[data-cart-drawer-subtotal]');
  const triggers = Array.from(document.querySelectorAll('[data-cart-drawer-trigger]'));
  const countEls = Array.from(document.querySelectorAll('[data-cart-count]'));
  const cartLinks = Array.from(document.querySelectorAll('.site-header__cart'));

  let cart = []; // { id, title, priceCents, image, quantity }

  function formatMoney(cents) {
    return '₹' + (cents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d)(?=\.\d\d$|$))/g, ',');
  }

  const getFocusable = () => Array.from(drawer.querySelectorAll('a, button')).filter((el) => !el.hidden && !el.disabled);

  const trapFocus = (e) => {
    if (e.key !== 'Tab') return;
    const focusable = getFocusable();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const onKeydown = (e) => {
    if (e.key === 'Escape') closeDrawer();
    trapFocus(e);
  };

  function openDrawer() {
    drawer.hidden = false;
    requestAnimationFrame(() => drawer.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeydown);
    if (closeBtn) closeBtn.focus();
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeydown);
    const trigger = triggers[0];
    setTimeout(() => {
      drawer.hidden = true;
      if (trigger) trigger.focus();
    }, 250);
  }

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openDrawer();
    });
  });

  function clearChildren(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function totalCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function renderCart() {
    const count = totalCount();
    countEls.forEach((el) => { el.textContent = String(count); });
    cartLinks.forEach((el) => { el.setAttribute('aria-label', 'Cart, ' + count + ' items'); });

    clearChildren(itemsEl);

    if (cart.length === 0) {
      emptyEl.hidden = false;
      footerEl.hidden = true;
      return;
    }

    emptyEl.hidden = true;
    footerEl.hidden = false;

    let subtotal = 0;
    cart.forEach((item) => {
      subtotal += item.priceCents * item.quantity;

      const row = document.createElement('div');
      row.className = 'cart-drawer__item';

      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.title;
      img.width = 64;
      img.height = 85;
      img.loading = 'lazy';

      const info = document.createElement('div');

      const title = document.createElement('p');
      title.className = 'cart-drawer__item-title';
      title.textContent = item.title;

      const price = document.createElement('p');
      price.className = 'cart-drawer__item-price';
      price.textContent = formatMoney(item.priceCents * item.quantity);

      const controls = document.createElement('div');
      controls.className = 'cart-drawer__item-controls';

      const decrease = document.createElement('button');
      decrease.type = 'button';
      decrease.textContent = String.fromCharCode(8722);
      decrease.setAttribute('aria-label', 'Decrease quantity of ' + item.title);
      decrease.addEventListener('click', () => changeQuantity(item.id, item.quantity - 1));

      const qty = document.createElement('span');
      qty.textContent = String(item.quantity);

      const increase = document.createElement('button');
      increase.type = 'button';
      increase.textContent = '+';
      increase.setAttribute('aria-label', 'Increase quantity of ' + item.title);
      increase.addEventListener('click', () => changeQuantity(item.id, item.quantity + 1));

      controls.appendChild(decrease);
      controls.appendChild(qty);
      controls.appendChild(increase);

      info.appendChild(title);
      info.appendChild(price);
      info.appendChild(controls);

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'cart-drawer__item-remove';
      remove.textContent = String.fromCharCode(215);
      remove.setAttribute('aria-label', 'Remove ' + item.title + ' from cart');
      remove.addEventListener('click', () => changeQuantity(item.id, 0));

      row.appendChild(img);
      row.appendChild(info);
      row.appendChild(remove);
      itemsEl.appendChild(row);
    });

    subtotalEl.textContent = formatMoney(subtotal);
  }

  function changeQuantity(id, quantity) {
    if (quantity <= 0) {
      cart = cart.filter((item) => item.id !== id);
    } else {
      const item = cart.find((i) => i.id === id);
      if (item) item.quantity = quantity;
    }
    renderCart();
  }

  function addToCart(id, title, priceCents, image, qty) {
    const existing = cart.find((item) => item.id === id);
    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({ id: id, title: title, priceCents: priceCents, image: image, quantity: qty });
    }
    renderCart();
    openDrawer();
  }

  document.querySelectorAll('[data-add-to-cart]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const title = card ? card.querySelector('.product-card__title').textContent : 'Item';
      const id = btn.dataset.productId || title;
      const priceCents = parseInt(btn.dataset.productPrice, 10) || 0;
      const image = btn.dataset.productImage || '';
      const qty = parseInt(btn.dataset.quickViewQuantity, 10) || 1;
      addToCart(id, title, priceCents, image, qty);
    });
  });

  const checkoutLink = drawer.querySelector('[data-cart-drawer-checkout]');
  if (checkoutLink) {
    checkoutLink.addEventListener('click', (e) => {
      e.preventDefault();
    });
  }

  /* ---------- newsletter form ---------- */
  const newsletterForm = document.querySelector('[data-newsletter-form]');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const field = newsletterForm.querySelector('.site-footer__newsletter-field');
      const success = newsletterForm.querySelector('[data-newsletter-success]');
      if (field) field.hidden = true;
      if (success) success.hidden = false;
    });
  }
});
