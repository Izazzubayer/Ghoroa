/** Ghoroa — mobile nav + light scroll (ponytail: no Lenis) */
(function () {
  'use strict';

  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const closeEls = document.querySelectorAll('[data-close-menu]');
  const nav = document.getElementById('siteNav');
  const langBtn = document.getElementById('langToggle');
  const langBtnMobile = document.getElementById('langToggleMobile');
  const langLabel = document.getElementById('langLabel');

  function setMenuOpen(open) {
    if (!menuToggle || !mobileDrawer) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    mobileDrawer.setAttribute('aria-hidden', String(!open));
    mobileDrawer.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    menuToggle.innerHTML = open
      ? '<i class="ph ph-x text-lg"></i>'
      : '<i class="ph ph-list text-lg"></i>';
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  menuToggle?.addEventListener('click', () => setMenuOpen(!mobileDrawer.classList.contains('open')));
  closeEls.forEach((el) => el.addEventListener('click', () => setMenuOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenuOpen(false); });

  function toggleLang() {
    document.body.classList.toggle('lang-bn-active');
    const bn = document.body.classList.contains('lang-bn-active');
    if (langLabel) langLabel.textContent = bn ? 'BN' : 'EN';
    localStorage.setItem('ghoroa_lang', bn ? 'bn' : 'en');
  }

  if (localStorage.getItem('ghoroa_lang') === 'bn') {
    document.body.classList.add('lang-bn-active');
    if (langLabel) langLabel.textContent = 'BN';
  }
  langBtn?.addEventListener('click', toggleLang);
  langBtnMobile?.addEventListener('click', toggleLang);

  if (nav) {
    let lastY = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      nav.classList.toggle('scrolled', y > 40);
      if (y > 350) nav.classList.toggle('nav-hidden', y > lastY && y > 500);
      else nav.classList.remove('nav-hidden');
      lastY = y;
    }, { passive: true });
  }

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.75, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
    });
  });

  ScrollTrigger.refresh();
})();
