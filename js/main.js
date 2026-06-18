/**
 * Konoba Gingulo V4 — Main JavaScript
 * Modern Minimal / Editorial
 */

'use strict';

/* =============================================================
   1. NAV SCROLL BEHAVIOR
   ============================================================= */
(function initNavScroll() {
  const header = document.getElementById('nav-header');
  if (!header) return;

  let ticking = false;

  function updateNav() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  // Run once on init in case page loads mid-scroll
  updateNav();
})();


/* =============================================================
   2. MOBILE MENU TOGGLE
   ============================================================= */
(function initMobileMenu() {
  const burger   = document.querySelector('.nav-burger');
  const closeBtn = document.querySelector('.mobile-menu-close');
  const menu     = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!burger || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Move focus into menu
    closeBtn && closeBtn.focus();
  }

  function closeMenu() {
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    burger.focus();
  }

  burger.addEventListener('click', openMenu);
  closeBtn && closeBtn.addEventListener('click', closeMenu);

  // Close on nav link click
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close on backdrop click (outside the nav element)
  menu.addEventListener('click', function (e) {
    if (e.target === menu) {
      closeMenu();
    }
  });
})();


/* =============================================================
   3. SCROLL REVEAL — IntersectionObserver
   ============================================================= */
(function initReveal() {
  // Don't animate if user prefers reduced motion
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
    return;
  }

  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -48px 0px'
    }
  );

  elements.forEach(function (el) {
    observer.observe(el);
  });
})();


/* =============================================================
   4. SMOOTH SCROLL WITH NAV OFFSET
   ============================================================= */
(function initSmoothScroll() {
  const NAV_HEIGHT = 72; // px — matches --nav-height CSS variable

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;

      window.scrollTo({
        top: Math.max(0, top),
        behavior: 'smooth'
      });
    });
  });
})();


/* =============================================================
   5. CURSOR DOT EFFECT (desktop only)
   ============================================================= */
(function initCursorDot() {
  // Only on devices that support hover (not touch)
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!supportsHover) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');
  document.body.appendChild(dot);

  let mx = -100;
  let my = -100;
  let cx = -100;
  let cy = -100;
  let isVisible = false;

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;

    if (!isVisible) {
      isVisible = true;
      dot.style.opacity = '1';
    }
  }, { passive: true });

  // Hide dot when cursor leaves the window
  document.addEventListener('mouseleave', function () {
    isVisible = false;
    dot.style.opacity = '0';
  });

  document.addEventListener('mouseenter', function () {
    isVisible = true;
    dot.style.opacity = '1';
  });

  // Scale dot on interactive elements
  const interactiveSelectors = 'a, button, [role="button"], input, textarea, select, label';

  document.addEventListener('mouseover', function (e) {
    if (e.target.closest(interactiveSelectors)) {
      dot.style.transform = cx + 'px, ' + cy + 'px'; // placeholder — update in loop
      dot.style.width = '16px';
      dot.style.height = '16px';
      dot.style.opacity = '0.6';
    }
  });

  document.addEventListener('mouseout', function (e) {
    if (e.target.closest(interactiveSelectors)) {
      dot.style.width = '8px';
      dot.style.height = '8px';
      dot.style.opacity = isVisible ? '1' : '0';
    }
  });

  function animateDot() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    dot.style.transform = 'translate(' + (cx - 4) + 'px, ' + (cy - 4) + 'px)';
    requestAnimationFrame(animateDot);
  }

  animateDot();
})();


/* =============================================================
   6. MARQUEE — PAUSE ON HOVER / FOCUS (accessibility)
   ============================================================= */
(function initMarqueePause() {
  const strip = document.querySelector('.marquee-strip');
  const track = document.querySelector('.marquee-track');
  if (!strip || !track) return;

  strip.addEventListener('mouseenter', function () {
    track.style.animationPlayState = 'paused';
  });

  strip.addEventListener('mouseleave', function () {
    track.style.animationPlayState = 'running';
  });

  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    track.style.animationPlayState = 'paused';
  }
})();


/* =============================================================
   7. HERO — ENSURE IMMEDIATE VISIBILITY
   ============================================================= */
(function initHeroReveal() {
  // Elements with .reveal-instant are already visible via CSS (no transform/opacity transition).
  // This function just ensures nothing in the hero is hidden by the reveal class.
  document.querySelectorAll('.hero .reveal').forEach(function (el) {
    el.classList.add('visible');
  });
})();


/* =============================================================
   8. STAGGER DELAYS FOR SIBLING REVEAL ELEMENTS
   ============================================================= */
(function initStaggerDelays() {
  // Apply stagger to about stats, arrival steps
  const staggerGroups = [
    { parent: '.arrival-steps', child: '.arrival-step', delay: 80 },
    { parent: '.numbers-grid',  child: '.number-cell',  delay: 100 },
    { parent: '.testimonials-inner', child: '.quote',   delay: 120 }
  ];

  staggerGroups.forEach(function (group) {
    const parent = document.querySelector(group.parent);
    if (!parent) return;

    parent.querySelectorAll(group.child).forEach(function (el, index) {
      if (el.classList.contains('reveal')) {
        el.style.transitionDelay = (index * group.delay) + 'ms';
      }
    });
  });
})();
