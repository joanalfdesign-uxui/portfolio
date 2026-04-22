/* ================================================
   SHARED WEB COMPONENTS
   <site-header> and <site-footer> — light DOM (no shadow root)
   Loaded blocking in <head> so connectedCallback fires inline
   during parsing — zero flash of unstyled content.
   ================================================ */

(function defineComponents() {
  'use strict';

  /* ── Path helpers ───────────────────────────── */
  const p = location.pathname;
  const inWork  = p.includes('/work/');
  const isHome  = !inWork && !p.includes('/about');
  const isSWork = inWork || (p.endsWith('/work/') || p.endsWith('/work'));
  const isAbout = p.includes('/about');

  /* base is '' at root level, '../' inside work/ */
  const base = inWork ? '../' : '';

  /* SVG arrows reused in footer nav */
  const arrowOut = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M7 17L17 7M17 7H8M17 7v9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
  const arrowDown = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  /* ── <site-header> ──────────────────────────── */
  class SiteHeader extends HTMLElement {
    connectedCallback() {
      const link = (href, label, active) => `
        <li>
          <a href="${href}"
             class="nav__link${active ? ' nav__link--active' : ''}"
             ${active ? 'aria-current="page"' : ''}>
            ${label}
          </a>
        </li>`;

      this.innerHTML = `
        <header class="site-header">
          <nav class="nav" aria-label="Main navigation">
            <ul class="nav__list">
              ${link(`${base}index.html`, 'Home',          isHome)}
              ${link(`${base}work/`,      'Selected Work', isSWork)}
              ${link(`${base}about.html`, 'About me',      isAbout)}
            </ul>
            <div class="nav__progress-bar" id="navProgress"></div>
          </nav>
        </header>`;
    }
  }

  /* ── <site-footer> ──────────────────────────── */
  class SiteFooter extends HTMLElement {
    connectedCallback() {
      const footerLink = (href, label, icon, extra = '') => `
        <li class="site-footer__nav-item">
          <a href="${href}" class="site-footer__nav-link"${extra}>
            <div class="footer-link-overlay" aria-hidden="true"></div>
            <span class="footer-link-text">${label}</span>
            ${icon}
          </a>
        </li>`;

      this.innerHTML = `
        <footer class="site-footer" aria-label="Footer">
          <div class="site-footer__bg">

            <div class="site-footer__cols">

              <!-- Left: CTA + contact -->
              <div class="site-footer__col site-footer__col--left">
                <div class="site-footer__cta">
                  <h2 class="site-footer__heading">Got a complex problem to solve?</h2>
                  <p class="site-footer__subheading">I work best when the constraints are real.</p>
                </div>
                <div class="site-footer__contact">
                  <p class="site-footer__contact-item">Portugal</p>
                  <a href="mailto:joanalf.design@gmail.com"
                     class="site-footer__contact-item site-footer__email">
                    joanalf.design@gmail.com
                  </a>
                  <a href="https://www.linkedin.com/in/joanalf-uxuidesign/"
                     target="_blank" rel="noopener noreferrer"
                     class="site-footer__social" aria-label="LinkedIn">
                    <img src="${base}assets/LINKEDIN_ICON.png"
                         alt="" width="24" height="24"
                         aria-hidden="true" loading="lazy" decoding="async" />
                  </a>
                </div>
              </div>

              <!-- Center: nav -->
              <div class="site-footer__col site-footer__col--center">
                <nav aria-label="Footer navigation">
                  <ul class="site-footer__nav-list">
                    ${footerLink(`${base}index.html`,  'HOME',         arrowOut)}
                    ${footerLink(`${base}work/`,       'SELECTED WORK',arrowOut)}
                    ${footerLink(`${base}about.html`,  'ABOUT ME',     arrowOut)}
                    ${footerLink(
                      `${base}assets/cv_joanafilipe_productdesigner.pdf`,
                      'DOWNLOAD CV',
                      arrowDown,
                      ' target="_blank" rel="noopener noreferrer"'
                    )}
                  </ul>
                </nav>
              </div>

              <!-- Right: profile + credit -->
              <div class="site-footer__col site-footer__col--right">
                <a href="${base}about.html" class="site-footer__profile">
                  <img src="${base}assets/JOANA_IMAGE.png"
                       alt="Joana Filipe" class="site-footer__avatar"
                       loading="lazy" decoding="async" />
                  <span class="site-footer__profile-name">Joana Filipe</span>
                </a>
                <p class="site-footer__credit">Designed in Figma · Built with Claude</p>
              </div>

            </div><!-- .site-footer__cols -->

            <!-- Name banner -->
            <div class="site-footer__name-banner">
              <img src="${base}assets/JOANAFILIPE_NAME.png"
                   alt="Joana Filipe" class="site-footer__name-banner-img"
                   loading="lazy" decoding="async" />
            </div>

          </div>
        </footer>`;
    }
  }

  customElements.define('site-header', SiteHeader);
  customElements.define('site-footer', SiteFooter);
})();
