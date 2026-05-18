// ───────────────────────────────────────────────
// Notaría García Morlesín — JS de cliente
// Animaciones scroll · Mobile menu · FAQ · Form
// ───────────────────────────────────────────────
(function () {
  'use strict';

  // 0) Mark body as JS-enabled — activa animaciones via CSS
  document.body.classList.add('js-on');

  // 1) Reveal on scroll (IntersectionObserver)
  const reveals = document.querySelectorAll('.reveal, .reveal-fade, .reveal-zoom, .reveal-left, .reveal-right, .reveal-stagger');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  // 2) Mobile menu toggle
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('nav.menu');
  const overlay = document.querySelector('.menu-overlay');
  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.classList.toggle('is-open', open);
    if (overlay) overlay.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      setMenu(!isOpen);
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    if (overlay) overlay.addEventListener('click', function () { setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  // 3) FAQ accordion
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.setAttribute('aria-expanded', q.parentElement.classList.contains('open') ? 'true' : 'false');
    q.addEventListener('click', function () {
      const item = q.parentElement;
      const isOpen = item.classList.toggle('open');
      q.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  // 4) Contact form — auto-select asunto desde ?asunto= y simulated submit
  const params = new URLSearchParams(window.location.search);
  const asunto = params.get('asunto');
  const select = document.querySelector('select[name="asunto"]');
  if (asunto && select) {
    const target = Array.from(select.options).find(function (o) {
      return o.value === asunto || o.value.toLowerCase() === asunto.toLowerCase();
    });
    if (target) {
      select.value = target.value;
      select.classList.add('was-prefilled');
    }
  }
  const form = document.querySelector('form.contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const success = document.querySelector('.form-success');
      if (success) {
        success.classList.add('is-visible');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
    });
  }

  // 5b) Sticky header — añade .is-scrolled cuando scrollY > 8 (passive listener)
  const header = document.querySelector('header.nav');
  if (header) {
    let ticking = false;
    const onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 5) Mark active nav item
  const path = window.location.pathname.replace(/\/$/, '');
  document.querySelectorAll('nav.menu a[href]').forEach(function (a) {
    const href = a.getAttribute('href').replace(/\/$/, '');
    if (href && href !== '#' && (path.endsWith(href) || (href !== '/' && path.includes(href)))) {
      a.classList.add('is-active');
    }
    if (path === '' || path === '/index.html') {
      if (a.getAttribute('href') === '/' || a.getAttribute('href') === 'index.html' || a.getAttribute('href') === '/index.html') {
        a.classList.add('is-active');
      }
    }
  });
})();
