/* ============================================================
   CROSSROAD CLIPPERS — app.js
   Premium Barber Studio · Gyedu St, Accra, Ghana
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════════════
     1. CURSOR GLOW (desktop only)
  ══════════════════════════════════════════ */
  const cursorGlow = document.getElementById('cursorGlow');

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && cursorGlow) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top  = e.clientY + 'px';
    }, { passive: true });
  } else if (cursorGlow) {
    cursorGlow.style.display = 'none';
  }

  /* ══════════════════════════════════════════
     2. NAVBAR — Scroll behaviour + style toggle
  ══════════════════════════════════════════ */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ══════════════════════════════════════════
     3. MOBILE NAV — Hamburger drawer
  ══════════════════════════════════════════ */
  const hamburger  = document.getElementById('hamburger');
  const navMobile  = document.getElementById('navMobile');
  const mobileLinks = navMobile ? navMobile.querySelectorAll('a') : [];

  function closeMenu() {
    hamburger.classList.remove('open');
    navMobile.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      navMobile.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    navMobile.addEventListener('click', (e) => {
      if (e.target === navMobile) closeMenu();
    });
  }

  /* ══════════════════════════════════════════
     4. SCROLLSPY — Active nav link tracking
  ══════════════════════════════════════════ */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link[data-section]');

  if (sections.length && navLinks.length) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === id);
          });
        }
      });
    }, {
      rootMargin: '-40% 0px -50% 0px',
      threshold:  0
    });

    sections.forEach(section => spyObserver.observe(section));
  }

  /* ══════════════════════════════════════════
     5. SCROLL REVEAL — IntersectionObserver
  ══════════════════════════════════════════ */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // free memory after reveal
        }
      });
    }, {
      threshold:  0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    // Stagger children inside sections
    revealEls.forEach(el => {
      revealObserver.observe(el);
    });
  }

  /* ══════════════════════════════════════════
     6. STAT COUNTER ANIMATIONS
  ══════════════════════════════════════════ */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  if (statNumbers.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el       = entry.target;
        const target   = parseInt(el.dataset.target, 10);
        const suffix   = el.dataset.suffix || '';
        const countEl  = el.querySelector('.count');
        const duration = 1800;
        const steps    = 60;
        const stepTime = Math.floor(duration / steps);
        let   current  = 0;

        const interval = setInterval(() => {
          current += Math.ceil(target / steps);
          if (current >= target) {
            current = target;
            clearInterval(interval);
          }
          countEl.textContent = current.toLocaleString();
        }, stepTime);

        counterObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));
  }

  /* ══════════════════════════════════════════
     7. TESTIMONIAL SLIDER
     - Viewport-aware column count
     - Touch swipe support
     - Auto-play loop
     - Self-aware dot controls
  ══════════════════════════════════════════ */
  const track     = document.getElementById('sliderTrack');
  const wrapper   = document.getElementById('sliderWrapper');
  const prevBtn   = document.getElementById('sliderPrev');
  const nextBtn   = document.getElementById('sliderNext');
  const dotsWrap  = document.getElementById('sliderDots');
  const controls  = document.getElementById('sliderControls');

  if (track && wrapper) {
    const cards = Array.from(track.querySelectorAll('.testimonial-card'));
    let   currentIndex  = 0;
    let   autoPlayTimer = null;
    let   touchStartX   = 0;
    let   touchEndX     = 0;

    function getVisibleCount() {
      if (window.innerWidth < 768)  return 1;
      if (window.innerWidth < 1100) return 1;
      return 2;
    }

    function getMaxIndex() {
      return Math.max(0, cards.length - getVisibleCount());
    }

    function setCardWidths() {
      const visible = getVisibleCount();
      const gap     = 16; // 1rem
      cards.forEach(card => {
        card.style.minWidth = visible > 1
          ? `calc(${100 / visible}% - ${gap / visible}px)`
          : `calc(100% - ${gap}px)`;
      });
    }

    function goTo(index) {
      const visible = getVisibleCount();
      const max     = getMaxIndex();
      currentIndex  = Math.max(0, Math.min(index, max));

      // Calculate offset
      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap       = 16;
      track.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;

      // Update dots
      document.querySelectorAll('.slider-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
        dot.setAttribute('aria-selected', String(i === currentIndex));
      });

      // Hide/show arrows
      if (prevBtn) prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
      if (nextBtn) nextBtn.style.opacity = currentIndex >= max ? '0.3' : '1';
    }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      const max = getMaxIndex();

      if (max === 0) {
        if (controls) controls.style.display = 'none';
        return;
      }
      if (controls) controls.style.display = 'flex';

      for (let i = 0; i <= max; i++) {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.setAttribute('aria-selected', String(i === 0));
        dot.addEventListener('click', () => {
          goTo(i);
          resetAutoPlay();
        });
        dotsWrap.appendChild(dot);
      }
    }

    function next() {
      goTo(currentIndex < getMaxIndex() ? currentIndex + 1 : 0);
    }

    function prev() {
      goTo(currentIndex > 0 ? currentIndex - 1 : getMaxIndex());
    }

    function startAutoPlay() {
      autoPlayTimer = setInterval(next, 4500);
    }

    function resetAutoPlay() {
      clearInterval(autoPlayTimer);
      startAutoPlay();
    }

    // Arrow buttons
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAutoPlay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAutoPlay(); });

    // Touch swipe
    wrapper.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? next() : prev();
        resetAutoPlay();
      }
    }, { passive: true });

    // Pause on hover/focus
    wrapper.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
    wrapper.addEventListener('mouseleave', startAutoPlay);
    wrapper.addEventListener('focusin',    () => clearInterval(autoPlayTimer));
    wrapper.addEventListener('focusout',   startAutoPlay);

    // Resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setCardWidths();
        buildDots();
        goTo(0);
      }, 200);
    }, { passive: true });

    // Init
    setCardWidths();
    buildDots();
    goTo(0);
    startAutoPlay();
  }

  /* ══════════════════════════════════════════
     8. FAQ ACCORDION
  ══════════════════════════════════════════ */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          const otherAnswer = other.querySelector('.faq-answer');
          const otherBtn    = other.querySelector('.faq-question');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
          if (otherBtn)    otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = null;
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ══════════════════════════════════════════
     9. BUTTON RIPPLE EFFECT
     Procedural coordinate-precise ripple
  ══════════════════════════════════════════ */
  const rippleBtns = document.querySelectorAll('.ripple-btn');

  rippleBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect   = this.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 2;
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;

      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.cssText = `
        width:  ${size}px;
        height: ${size}px;
        left:   ${x}px;
        top:    ${y}px;
      `;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  /* ══════════════════════════════════════════
     10. SMOOTH SCROLL (fallback for older browsers)
  ══════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navH   = navbar ? navbar.offsetHeight : 0;
        const top    = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ══════════════════════════════════════════
     11. HERO ELEMENTS — Trigger reveal on load
  ══════════════════════════════════════════ */
  const heroReveals = document.querySelectorAll('.hero .reveal');
  setTimeout(() => {
    heroReveals.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 120);
    });
  }, 300);

});
