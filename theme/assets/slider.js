document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[data-hero-slider]');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll('[data-slide]'));
  const dots = Array.from(root.querySelectorAll('[data-slide-dot]'));
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let timer = null;
  let isHovered = false;
  let hasFocus = false;

  const show = (i) => {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, j) => {
      const active = j === index;
      s.classList.toggle('is-active', active);
      s.setAttribute('aria-hidden', String(!active));
      if (active) {
        s.removeAttribute('inert');
      } else {
        s.setAttribute('inert', '');
      }
    });
    dots.forEach((d, j) => {
      d.classList.toggle('is-active', j === index);
      d.setAttribute('aria-current', j === index ? 'true' : 'false');
    });
  };

  const updatePauseState = () => {
    const paused = isHovered || hasFocus || reducedMotionQuery.matches;
    dots.forEach((d) => d.classList.toggle('is-paused', paused && d.classList.contains('is-active')));
  };

  const stop = () => { if (timer) clearInterval(timer); timer = null; };
  const start = () => {
    stop();
    updatePauseState();
    if (reducedMotionQuery.matches || slides.length < 2 || isHovered || hasFocus) return;
    timer = setInterval(() => show(index + 1), 5500);
  };

  root.querySelector('[data-slide-prev]').addEventListener('click', () => { show(index - 1); start(); });
  root.querySelector('[data-slide-next]').addEventListener('click', () => { show(index + 1); start(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); start(); }));

  root.addEventListener('mouseenter', () => { isHovered = true; start(); });
  root.addEventListener('mouseleave', () => { isHovered = false; start(); });
  root.addEventListener('focusin', () => { hasFocus = true; start(); });
  root.addEventListener('focusout', () => { hasFocus = false; start(); });
  reducedMotionQuery.addEventListener('change', start);

  let touchStartX = 0;
  root.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  root.addEventListener('touchend', (e) => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 40) show(index + (delta < 0 ? 1 : -1));
    start();
  }, { passive: true });

  show(0);
  start();
});
