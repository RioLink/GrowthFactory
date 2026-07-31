/* ========================================
   WEBTOP - Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Compact cookie consent ---- */
  const consentCookieName = 'growthfactory_cookie_consent';
  const consentLifetimeDays = 7;

  function getConsentCookie() {
    const prefix = consentCookieName + '=';
    const cookie = document.cookie.split('; ').find(function (item) {
      return item.indexOf(prefix) === 0;
    });
    return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : '';
  }

  function saveConsentCookie(value) {
    const expires = new Date(Date.now() + consentLifetimeDays * 24 * 60 * 60 * 1000);
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = consentCookieName + '=' + encodeURIComponent(value) +
      '; expires=' + expires.toUTCString() + '; path=/; SameSite=Lax' + secure;
  }

  function showCookieConsent() {
    if (getConsentCookie()) return;

    const popup = document.createElement('aside');
    popup.className = 'cookie-consent';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-label', 'Налаштування cookies');
    popup.setAttribute('aria-live', 'polite');
    popup.innerHTML =
      '<div class="cookie-consent__mark" aria-hidden="true">●</div>' +
      '<div class="cookie-consent__content">' +
        '<p><strong>Cookies</strong> для роботи й аналітики сайту.</p>' +
        '<div class="cookie-consent__actions">' +
          '<button type="button" class="cookie-consent__button cookie-consent__button--accept" data-cookie-choice="accepted">Прийняти</button>' +
          '<button type="button" class="cookie-consent__button" data-cookie-choice="rejected">Відхилити</button>' +
          '<a href="/cookie-policy">Політика</a>' +
        '</div>' +
      '</div>';

    document.body.appendChild(popup);
    window.requestAnimationFrame(function () {
      popup.classList.add('is-visible');
    });

    popup.querySelectorAll('[data-cookie-choice]').forEach(function (button) {
      button.addEventListener('click', function () {
        const choice = button.getAttribute('data-cookie-choice');
        saveConsentCookie(choice);
        document.dispatchEvent(new CustomEvent('growthfactory:cookie-consent', {
          detail: { choice: choice }
        }));
        popup.classList.remove('is-visible');
        window.setTimeout(function () { popup.remove(); }, 220);
      });
    });
  }

  showCookieConsent();

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
