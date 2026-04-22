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

  // Grow on interactive elements (links, buttons) except project cards and cs-next
  const interactive = document.querySelectorAll('a:not(.project-card):not(.work-card):not(.cs-next), button');
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

  // cs-next: hide circle, show "Read next" pill cursor
  const csNext = document.querySelector('a.cs-next');
  const csNextCursor = document.querySelector('.cs-next-cursor');
  if (csNext && csNextCursor) {
    document.addEventListener('mousemove', (e) => {
      csNextCursor.style.left = e.clientX + 'px';
      csNextCursor.style.top  = e.clientY + 'px';
    });
    csNext.addEventListener('mouseenter', () => {
      csNextCursor.classList.add('visible');
      circle.classList.add('is-hidden');
    });
    csNext.addEventListener('mouseleave', () => {
      csNextCursor.classList.remove('visible');
      circle.classList.remove('is-hidden');
    });
  }
})();


// ── 3. Scroll reveal ─────────────────────────────
(function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
})();


// ── 4. Lightbox for case study images ────────────
(function initLightbox() {
  if (!document.querySelector('.cs-hero')) return;

  const images = Array.from(document.querySelectorAll(
    '.cs-cover img, .cs-image img, .cs-image-grid img'
  ));
  if (images.length === 0) return;

  // Inject lightbox
  const lb = document.createElement('div');
  lb.className = 'cs-lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.innerHTML = `
    <button class="cs-lightbox__close" aria-label="Close">&#x2715;</button>
    <button class="cs-lightbox__prev" aria-label="Previous">&#8592;</button>
    <img class="cs-lightbox__img" src="" alt="" />
    <button class="cs-lightbox__next" aria-label="Next">&#8594;</button>
    <span class="cs-lightbox__counter"></span>
    <span class="cs-lightbox__hint">Press ESC or click outside to close</span>
  `;
  document.body.appendChild(lb);

  const lbImg     = lb.querySelector('.cs-lightbox__img');
  const lbCounter = lb.querySelector('.cs-lightbox__counter');
  let current = 0;

  function show(index) {
    current = (index + images.length) % images.length;
    lbImg.src = images[current].src;
    lbImg.alt = images[current].alt || '';
    lbCounter.textContent = `${current + 1} / ${images.length}`;
  }

  function open(index) {
    show(index);
    lb.classList.add('is-open');
    document.documentElement.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('is-open');
    document.documentElement.style.overflow = '';
  }

  images.forEach((img, i) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => open(i));
  });

  lb.querySelector('.cs-lightbox__close').addEventListener('click', close);
  lb.querySelector('.cs-lightbox__prev').addEventListener('click', () => { show(current - 1); });
  lb.querySelector('.cs-lightbox__next').addEventListener('click', () => { show(current + 1); });
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();


// ── 4.5. LinkedIn deep-link on mobile ────────────
(function initLinkedInDeepLink() {
  const links = document.querySelectorAll('a.site-footer__social[href*="linkedin.com/in/"]');
  if (!links.length) return;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (!isMobile) return;

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const webUrl = link.href;
      // Extract "/in/<handle>" → linkedin://in/<handle>
      const match = webUrl.match(/\/in\/([^\/?#]+)/);
      if (!match) return;
      const appUrl = 'linkedin://in/' + match[1];

      e.preventDefault();

      // Fallback: open the website if the app doesn't capture the scheme
      const fallback = setTimeout(() => {
        window.location.href = webUrl;
      }, 800);

      // If the app opens, the page is backgrounded and the fallback is cancelled
      const cancel = () => clearTimeout(fallback);
      window.addEventListener('pagehide', cancel, { once: true });
      window.addEventListener('blur', cancel, { once: true });

      window.location.href = appUrl;
    });
  });
})();


// ── 4.6. Mobile-only project card CTA pill ────────
(function initProjectCardMobileCTA() {
  const cards = document.querySelectorAll('a.project-card, a.work-card, a.cs-next');
  if (!cards.length) return;

  const pills = [];
  cards.forEach(card => {
    if (card.querySelector('.project-card__cta')) return;
    const body = card.querySelector(
      '.project-card__body, .work-card__body, .work-card__content, .cs-next__info'
    );
    if (!body) return;

    const isComingSoon = card.dataset.comingSoon === 'true';
    const pill = document.createElement('span');
    pill.className = 'project-card__cta';
    if (isComingSoon) pill.classList.add('project-card__cta--coming');
    pill.setAttribute('aria-hidden', 'true');
    pill.textContent = isComingSoon
      ? 'Coming soon'
      : (card.classList.contains('cs-next') ? 'Read next' : 'See how it was done');
    body.appendChild(pill);
    pills.push(pill);
  });

  // Show on mobile (narrow viewport OR no-hover device)
  const mql = window.matchMedia('(hover: none), (pointer: coarse), (max-width: 768px)');
  const apply = () => {
    pills.forEach(p => p.classList.toggle('project-card__cta--visible', mql.matches));
  };
  apply();
  mql.addEventListener ? mql.addEventListener('change', apply) : mql.addListener(apply);
})();


// ── 5. Scroll progress bar ───────────────────────
(function initProgressBar() {
  const bar = document.getElementById('navProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = docHeight > 0 ? (scrollTop / docHeight) * 100 + '%' : '0%';
  }, { passive: true });
})();


