document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('[data-quick-view-modal]');
  if (!modal) return;

  const backdrop = modal.querySelector('[data-quick-view-backdrop]');
  const closeBtn = modal.querySelector('[data-quick-view-close]');
  const imgEl = modal.querySelector('[data-quick-view-image]');
  const titleEl = modal.querySelector('[data-quick-view-title]');
  const priceEl = modal.querySelector('[data-quick-view-price]');
  const compareEl = modal.querySelector('[data-quick-view-compare]');
  const badgeEl = modal.querySelector('[data-quick-view-badge]');
  const descEl = modal.querySelector('[data-quick-view-description]');
  const addBtn = modal.querySelector('[data-quick-view-add]');
  const addBtnOriginalHTML = addBtn.innerHTML;
  const wishlistBtn = modal.querySelector('[data-quick-view-wishlist]');
  const qtyDisplay = modal.querySelector('[data-quick-view-qty]');
  const qtyDecrease = modal.querySelector('[data-quick-view-qty-decrease]');
  const qtyIncrease = modal.querySelector('[data-quick-view-qty-increase]');

  let sourceCard = null;
  let lastFocused = null;
  let quantity = 1;

  const getFocusable = () => Array.from(modal.querySelectorAll('a, button')).filter((el) => !el.hidden && !el.disabled);

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
    if (e.key === 'Escape') close();
    trapFocus(e);
  };

  function setQuantity(q) {
    quantity = Math.max(1, q);
    if (qtyDisplay) qtyDisplay.textContent = String(quantity);
  }

  function syncWishlist() {
    if (!sourceCard || !wishlistBtn) return;
    const cardWishlist = sourceCard.querySelector('[data-wishlist-toggle]');
    wishlistBtn.setAttribute('aria-pressed', cardWishlist ? cardWishlist.getAttribute('aria-pressed') : 'false');
    wishlistBtn.hidden = !cardWishlist;
  }

  function open(card) {
    sourceCard = card;
    lastFocused = document.activeElement;
    setQuantity(1);

    const title = card.querySelector('.product-card__title');
    const price = card.querySelector('.product-card__price');
    const compare = card.querySelector('.product-card__compare-price');
    const badge = card.querySelector('.product-card__badge');
    const img = card.querySelector('.product-card__image--primary');
    const form = card.querySelector('form[action$="/cart/add"]');
    const cardAddBtn = card.querySelector('.product-card__add');

    titleEl.textContent = title ? title.textContent.trim() : '';
    priceEl.textContent = price ? price.textContent.trim() : '';
    if (compare) {
      compareEl.textContent = compare.textContent.trim();
      compareEl.hidden = false;
    } else {
      compareEl.hidden = true;
    }
    if (badge) {
      badgeEl.textContent = badge.textContent.trim();
      badgeEl.className = badge.className;
      badgeEl.hidden = false;
    } else {
      badgeEl.hidden = true;
    }
    if (img && img.getAttribute('src')) {
      imgEl.src = img.getAttribute('src');
      imgEl.alt = img.getAttribute('alt') || '';
      imgEl.parentElement.hidden = false;
    } else {
      imgEl.parentElement.hidden = true;
    }
    descEl.textContent = card.dataset.quickViewDescription
      || 'A signature piece from the collection, crafted with traditional techniques and finished by hand.';

    const unavailable = !form && (!cardAddBtn || cardAddBtn.disabled);
    addBtn.disabled = unavailable;
    addBtn.innerHTML = addBtnOriginalHTML;
    if (unavailable) addBtn.textContent = 'Unavailable';

    syncWishlist();

    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeydown);
    closeBtn.focus();
  }

  function close() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeydown);
    setTimeout(() => { modal.hidden = true; }, 300);
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('[data-quick-view-trigger]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const card = trigger.closest('.product-card');
      if (card) open(card);
    });
  });

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  if (qtyDecrease) qtyDecrease.addEventListener('click', () => setQuantity(quantity - 1));
  if (qtyIncrease) qtyIncrease.addEventListener('click', () => setQuantity(quantity + 1));

  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', () => {
      if (!sourceCard) return;
      const cardWishlist = sourceCard.querySelector('[data-wishlist-toggle]');
      if (cardWishlist) {
        cardWishlist.click();
        syncWishlist();
      }
    });
  }

  addBtn.addEventListener('click', () => {
    if (!sourceCard) return;
    const form = sourceCard.querySelector('form[action$="/cart/add"]');
    if (form && form.requestSubmit) {
      let qtyInput = form.querySelector('input[name="quantity"]');
      if (!qtyInput) {
        qtyInput = document.createElement('input');
        qtyInput.type = 'hidden';
        qtyInput.name = 'quantity';
        form.appendChild(qtyInput);
      }
      qtyInput.value = String(quantity);
      close();
      form.requestSubmit();
      return;
    }
    const demoBtn = sourceCard.querySelector('[data-add-to-cart]');
    if (demoBtn) {
      demoBtn.dataset.quickViewQuantity = String(quantity);
      close();
      demoBtn.click();
    }
  });
});
