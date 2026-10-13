document.addEventListener('DOMContentLoaded', () => {
  const trigger = document.querySelector('[data-mobile-menu-trigger]');
  const panel = document.querySelector('[data-mobile-menu-panel]');
  const closeBtn = document.querySelector('[data-mobile-menu-close]');
  const backdrop = document.querySelector('[data-mobile-menu-backdrop]');

  if (trigger && panel && closeBtn && backdrop) {
    const getFocusable = () => Array.from(panel.querySelectorAll('a, button')).filter((el) => !el.hidden);

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

    const open = () => {
      panel.hidden = false;
      backdrop.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
      document.addEventListener('keydown', onKeydown);
    };
    const close = () => {
      panel.hidden = true;
      backdrop.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      trigger.focus();
      document.removeEventListener('keydown', onKeydown);
    };
    const onKeydown = (e) => {
      if (e.key === 'Escape') close();
      trapFocus(e);
    };

    trigger.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', close);
    panel.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && !panel.hidden) close();
    });
  }

  const searchTrigger = document.querySelector('[data-mobile-search-trigger]');
  const searchPanel = document.querySelector('[data-mobile-search-panel]');
  if (searchTrigger && searchPanel) {
    searchTrigger.addEventListener('click', () => {
      const isOpen = !searchPanel.hidden;
      searchPanel.hidden = isOpen;
      searchTrigger.setAttribute('aria-expanded', String(!isOpen));
      if (!isOpen) searchPanel.querySelector('input').focus();
    });
  }

  const header = document.querySelector('[data-site-header]');
  if (header) {
    let ticking = false;
    const updateScrolled = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateScrolled);
        ticking = true;
      }
    }, { passive: true });
    updateScrolled();
  }
});
