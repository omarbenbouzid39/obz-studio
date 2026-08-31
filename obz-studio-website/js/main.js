(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Header scroll state ---------------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (window.scrollY > 24) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------- Mobile menu ---------------- */
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (menuToggle && mobileMenu) {
    const closeMenu = () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('is-open');
      document.body.style.overflow = '';
    };
    const openMenu = () => {
      menuToggle.setAttribute('aria-expanded', 'true');
      mobileMenu.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu() : openMenu();
    });
    mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------------- Theme toggle ---------------- */
  const themeToggle = document.querySelector('.js-theme-toggle');
  const root = document.documentElement;
  const stored = localStorage.getItem('obz-theme');
  if (stored === 'dark') root.setAttribute('data-theme', 'dark');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      if (isDark) {
        root.removeAttribute('data-theme');
        localStorage.setItem('obz-theme', 'light');
      } else {
        root.setAttribute('data-theme', 'dark');
        localStorage.setItem('obz-theme', 'dark');
      }
    });
  }

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------------- Hero gathering-dots motif ---------------- */
  /* Signature element: scattered points drift into a loose gathered
     arc — a visual echo of "لمّة" (a coming-together) rendered as
     OBZ Studio's own abstract mark, distinct from any product logo. */
  const motifHost = document.querySelector('.hero-motif');
  if (motifHost) {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 1000 700');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    svg.setAttribute('aria-hidden', 'true');

    const count = 28;
    const cx = 460, cy = 430, radius = 260;
    const dots = [];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 1.6 * i) / count + Math.PI * 0.95;
      const r = radius * (0.3 + 0.7 * (i / count));
      const targetX = cx + Math.cos(angle) * r;
      const targetY = cy + Math.sin(angle) * r * 0.85;
      const startX = targetX + (Math.random() - 0.5) * 300;
      const startY = targetY + (Math.random() - 0.5) * 300;
      const size = 2 + Math.random() * 4.6;
      const isGold = i % 5 === 0;

      const circle = document.createElementNS(svgNS, 'circle');
      circle.setAttribute('r', size.toFixed(2));
      circle.setAttribute('class', isGold ? 'dot dot--gold' : 'dot');
      circle.setAttribute('cx', prefersReducedMotion ? targetX.toFixed(1) : startX.toFixed(1));
      circle.setAttribute('cy', prefersReducedMotion ? targetY.toFixed(1) : startY.toFixed(1));
      circle.style.opacity = (0.35 + Math.random() * 0.5).toFixed(2);
      svg.appendChild(circle);
      dots.push({ el: circle, targetX, targetY, delay: i * 18 });
    }

    motifHost.appendChild(svg);

    if (!prefersReducedMotion) {
      requestAnimationFrame(() => {
        dots.forEach(({ el, targetX, targetY, delay }) => {
          el.style.transition = `cx 1400ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, cy 1400ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`;
          setTimeout(() => {
            el.setAttribute('cx', targetX.toFixed(1));
            el.setAttribute('cy', targetY.toFixed(1));
          }, 60);
        });
      });
    }
  }

  /* ---------------- Footer year ---------------- */
  const yearEl = document.querySelector('.js-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
