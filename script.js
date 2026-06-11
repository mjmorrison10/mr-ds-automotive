/* ============================================
   MR D'S AUTOMOTIVE — JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // --- Scroll Progress Bar ---
  const scrollProgress = document.getElementById('scrollProgress');
  window.addEventListener('scroll', function () {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgress) {
      scrollProgress.style.width = scrollPercent + '%';
    }
  });

  // --- Open/Closed Indicator ---
  function updateOpenStatus() {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    if (!statusDot || !statusText) return;

    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const time = hours + minutes / 60;

    let isOpen = false;
    // Mon-Fri: 7:30AM - 5:30PM
    if (day >= 1 && day <= 5 && time >= 7.5 && time < 17.5) isOpen = true;
    // Sat: 8AM - 2PM
    if (day === 6 && time >= 8 && time < 14) isOpen = true;

    if (isOpen) {
      statusDot.classList.remove('closed');
      statusText.textContent = 'Abierto / Open Now';
    } else {
      statusDot.classList.add('closed');
      statusText.textContent = 'Cerrado / Closed';
    }
  }
  updateOpenStatus();
  setInterval(updateOpenStatus, 60000);

  // --- Navbar Scroll Behavior ---
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    if (navbar) {
      if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });

  // --- Mobile Menu ---
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', function () {
      mobileToggle.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // --- Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  // --- Counter Animation ---
  function animateCounters() {
    const counters = document.querySelectorAll('.hero-stat-num[data-target]');
    counters.forEach(function (counter) {
      if (counter.dataset.animated) return;

      const rect = counter.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) return;

      counter.dataset.animated = 'true';
      const target = parseInt(counter.dataset.target, 10);
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        if (target >= 1000) {
          counter.textContent = current.toLocaleString().replace(/,/g, '');
        } else {
          counter.textContent = current;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  window.addEventListener('scroll', animateCounters);
  // Initial check
  setTimeout(animateCounters, 500);

  // --- Back to Top Button ---
  const backToTop = document.getElementById('backToTop');
  const mobileCtaBar = document.getElementById('mobileCtaBar');

  window.addEventListener('scroll', function () {
    if (backToTop) {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
    if (mobileCtaBar) {
      if (window.scrollY > 600) {
        mobileCtaBar.classList.add('visible');
      } else {
        mobileCtaBar.classList.remove('visible');
      }
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Form Validation ---
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name');
      const phone = document.getElementById('phone');
      let isValid = true;

      // Reset styles
      [name, phone].forEach(function (field) {
        if (field) field.style.borderColor = '';
      });

      if (name && !name.value.trim()) {
        name.style.borderColor = '#ef4444';
        name.focus();
        isValid = false;
      }

      if (phone && !phone.value.trim()) {
        phone.style.borderColor = '#ef4444';
        if (isValid) phone.focus();
        isValid = false;
      }

      // Email validation (optional field, but if filled must be valid)
      const email = document.getElementById('email');
      if (email && email.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
          email.style.borderColor = '#ef4444';
          isValid = false;
        }
      }

      if (isValid) {
        contactForm.style.display = 'none';
        if (formSuccess) {
          formSuccess.classList.add('show');
        }
      }
    });

    // Real-time validation reset
    contactForm.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        this.style.borderColor = '';
      });
      field.addEventListener('focus', function () {
        if (this.style.borderColor === 'rgb(239, 68, 68)') {
          this.style.borderColor = '';
        }
      });
    });
  }

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

  // --- Parallax-like effect on hero monogram ---
  const heroMono = document.querySelector('.hero-mono-bg');
  if (heroMono) {
    window.addEventListener('scroll', function () {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroMono.style.transform = 'translateY(' + (-50 + scrollY * 0.08) + '%)';
      }
    });
  }

  // --- Service cards click to scroll to contact ---
  document.querySelectorAll('.servicio-card').forEach(function (card) {
    card.addEventListener('click', function () {
      const contacto = document.getElementById('contacto');
      if (contacto) {
        const offsetTop = contacto.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

});
