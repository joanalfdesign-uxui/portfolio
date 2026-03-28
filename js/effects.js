/* ================================================
   SHARED EFFECTS — grain, cursor, lenis, transitions
   ================================================ */

// ── 1. Smooth scroll (Lenis) ─────────────────────
if (typeof Lenis !== 'undefined') {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
}


// ── 2. Custom cursor circle ──────────────────────
(function initCursor() {
  const circle = document.querySelector('.custom-cursor');
  if (!circle) return;

  // Follow mouse
  document.addEventListener('mousemove', (e) => {
    circle.style.left = e.clientX + 'px';
    circle.style.top  = e.clientY + 'px';
  });

  // Hide when mouse leaves window
  document.addEventListener('mouseleave', () => circle.classList.add('is-hidden'));
  document.addEventListener('mouseenter', () => circle.classList.remove('is-hidden'));

  // Grow on interactive elements (links, buttons) except project cards
  const interactive = document.querySelectorAll('a:not(.project-card):not(.work-card), button');
  interactive.forEach(el => {
    el.addEventListener('mouseenter', () => circle.classList.add('is-large'));
    el.addEventListener('mouseleave', () => circle.classList.remove('is-large'));
  });

  // Hide on project/work cards (replaced by "See how it was done")
  const projectCards = document.querySelectorAll('a.project-card, a.work-card');
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      circle.classList.add('is-hidden');
      circle.classList.remove('is-large');
    });
    card.addEventListener('mouseleave', () => circle.classList.remove('is-hidden'));
  });
})();


// ── 3. Page transitions ──────────────────────────
(function initTransitions() {
  const overlay = document.querySelector('.page-overlay');
  if (!overlay) return;

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      link.target === '_blank' ||
      /^https?:\/\//.test(href)
    ) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      const dest = link.href;
      overlay.classList.add('leaving');
      setTimeout(() => { window.location.href = dest; }, 380);
    });
  });
})();
