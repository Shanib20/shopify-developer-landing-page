document.addEventListener('DOMContentLoaded', () => {
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

  const moneyFormat = (window.theme && window.theme.moneyFormat) || '${{amount}}';

  function formatMoney(cents) {
    const amount = (cents / 100).toFixed(2);
    const withCommas = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (moneyFormat.indexOf('amount_no_decimals') !== -1) {
      return moneyFormat.replace(/\{\{\s*amount_no_decimals\s*\}\}/, Math.round(cents / 100).toString());
    }
    return moneyFormat.replace(/\{\{\s*amount\s*\}\}/, withCommas);
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
    if (e.key === 'Escape') close();
    trapFocus(e);
  };

  function open() {
    drawer.hidden = false;
    requestAnimationFrame(() => drawer.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeydown);
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    drawer.classList.remove('is-open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeydown);
    setTimeout(() => { drawer.hidden = true; }, 250);
  }

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (backdrop) backdrop.addEventListener('click', close);
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      open();
      refreshCart();
    });
  });

  function clearChildren(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function renderCart(cart) {
    countEls.forEach((el) => { el.textContent = String(cart.item_count); });
    cartLinks.forEach((el) => { el.setAttribute('aria-label', 'Cart, ' + cart.item_count + ' items'); });

    clearChildren(itemsEl);

    if (cart.item_count === 0) {
      emptyEl.hidden = false;
      footerEl.hidden = true;
      return;
    }

    emptyEl.hidden = true;
    footerEl.hidden = false;

    cart.items.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'cart-drawer__item';

      const img = document.createElement('img');
      if (item.image) {
        img.src = item.image + (item.image.indexOf('?') === -1 ? '?' : '&') + 'width=120';
      }
      img.alt = item.product_title;
      img.width = 64;
      img.height = 85;
      img.loading = 'lazy';

      const info = document.createElement('div');

      const title = document.createElement('p');
      title.className = 'cart-drawer__item-title';
      title.textContent = item.product_title;

      const price = document.createElement('p');
      price.className = 'cart-drawer__item-price';
      price.textContent = formatMoney(item.final_line_price);

      const controls = document.createElement('div');
      controls.className = 'cart-drawer__item-controls';

      const decrease = document.createElement('button');
      decrease.type = 'button';
      decrease.textContent = String.fromCharCode(8722); // minus sign
      decrease.setAttribute('aria-label', 'Decrease quantity of ' + item.product_title);
      decrease.addEventListener('click', () => changeLine(item.key, item.quantity - 1));

      const qty = document.createElement('span');
      qty.textContent = String(item.quantity);

      const increase = document.createElement('button');
      increase.type = 'button';
      increase.textContent = '+';
      increase.setAttribute('aria-label', 'Increase quantity of ' + item.product_title);
      increase.addEventListener('click', () => changeLine(item.key, item.quantity + 1));

      controls.appendChild(decrease);
      controls.appendChild(qty);
      controls.appendChild(increase);

      info.appendChild(title);
      info.appendChild(price);
      info.appendChild(controls);

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'cart-drawer__item-remove';
      remove.textContent = String.fromCharCode(215); // multiplication sign, used as a close glyph
      remove.setAttribute('aria-label', 'Remove ' + item.product_title + ' from cart');
      remove.addEventListener('click', () => changeLine(item.key, 0));

      row.appendChild(img);
      row.appendChild(info);
      row.appendChild(remove);
      itemsEl.appendChild(row);
    });

    subtotalEl.textContent = formatMoney(cart.total_price);
  }

  function refreshCart() {
    fetch('/cart.js', { headers: { Accept: 'application/json' } })
      .then((res) => res.json())
      .then(renderCart)
      .catch(() => { /* real store not connected in this environment */ });
  }

  function changeLine(key, quantity) {
    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: key, quantity: Math.max(0, quantity) }),
    })
      .then((res) => res.json())
      .then(renderCart)
      .catch(() => { /* real store not connected in this environment */ });
  }

  document.querySelectorAll('form[action$="/cart/add"]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('[type="submit"]');
      if (!submitBtn) return;
      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.classList.add('is-loading');
      submitBtn.textContent = 'Adding...';

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      })
        .then((res) => res.json())
        .then(() => {
          submitBtn.classList.remove('is-loading');
          submitBtn.classList.add('is-success');
          submitBtn.textContent = 'Added';
          open();
          refreshCart();
          setTimeout(() => {
            submitBtn.classList.remove('is-success');
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
          }, 1200);
        })
        .catch(() => {
          submitBtn.classList.remove('is-loading');
          submitBtn.innerHTML = originalHTML;
          submitBtn.disabled = false;
          /* real store not connected in this environment */
        });
    });
  });

  refreshCart();
});
