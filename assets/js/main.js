/* ========================================
   WEBTOP - Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Sticky Header ---- */
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  /* ---- Burger Menu ---- */
  const burger = document.querySelector('.burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileClose = document.querySelector('.mobile-menu-close');

  if (burger && mobileMenu) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    if (mobileClose) {
      mobileClose.addEventListener('click', function () {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Mobile Submenu Toggle ---- */
  document.querySelectorAll('.mobile-submenu-toggle').forEach(function (toggle) {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      const submenu = this.nextElementSibling;
      if (submenu) {
        submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
      }
    });
  });

  /* ---- Smooth Scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = header ? header.offsetHeight + 16 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---- CTA buttons scroll to contact form ---- */
  document.querySelectorAll('.scroll-to-form').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const form = document.querySelector('#contact-form');
      if (form) {
        const offset = header ? header.offsetHeight + 16 : 80;
        const top = form.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Scroll Reveal ---- */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---- Stats Counter Animation ---- */
  function animateCounter(el, target, suffix) {
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(function () {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = start + suffix;
    }, 16);
  }

  const statNums = document.querySelectorAll('.stat-number[data-target]');
  if (statNums.length > 0 && 'IntersectionObserver' in window) {
    const statsObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const suffix = el.dataset.suffix || '';
          animateCounter(el, target, suffix);
          statsObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    statNums.forEach(function (el) { statsObs.observe(el); });
  }

  /* ---- Contact form submit (basic) ---- */
  const contactForm = document.querySelector('#contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Надсилаємо...';
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = 'Відправлено! ✓';
        btn.style.background = '#16a34a';
        setTimeout(function () {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.background = '';
          contactForm.reset();
        }, 3000);
      }, 1200);
    });
  }

});
