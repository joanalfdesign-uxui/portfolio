/* ================================================
   SHARED EFFECTS — grain, cursor, lenis, transitions
   ================================================ */

// ── 0. Countdown intro ───────────────────────────
(function initCountdown() {
  const screen = document.getElementById('countdown');
  const numEl  = document.getElementById('countdown-number');
  if (!screen || !numEl) return;

  // Only show on first visit — reset clears it
  if (localStorage.getItem('cd_seen')) {
    screen.remove();
    return;
  }
  localStorage.setItem('cd_seen', '1');

  const nums = ['3', '2', '1'];
  let idx = 0;

  function flipTo(next, done) {
    // Slide current out downward
    numEl.classList.add('out');
    setTimeout(() => {
      numEl.classList.remove('out');
      numEl.textContent = next;
      numEl.classList.add('in');
      setTimeout(() => {
        numEl.classList.remove('in');
        done && done();
      }, 350);
    }, 300);
  }

  function run() {
    if (idx >= nums.length - 1) {
      setTimeout(() => {
        screen.classList.add('hide');
        setTimeout(() => screen.remove(), 500);
      }, 700);
      return;
    }
    flipTo(nums[idx + 1], () => {
      idx++;
      setTimeout(run, 400);
    });
  }

  setTimeout(run, 700);
})();

// ── 1. Smooth scroll (Lenis) ─────────────────────
if (typeof Lenis !== 'undefined') {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
}


// ── 2. Custom cursor circle ───────────────────────
(function initCursor() {
  const circle = document.querySelector('.custom-cursor');
  if (!circle) return;

  // Only hide the native cursor once JS is confirmed running
  document.body.classList.add('cursor-ready');

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


// ── 3. Scroll progress bar ───────────────────────
(function initProgressBar() {
  const bar = document.getElementById('navProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = docHeight > 0 ? (scrollTop / docHeight) * 100 + '%' : '0%';
  }, { passive: true });
})();


