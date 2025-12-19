(function(){
  const burger = document.querySelector('[data-burger]');
  const nav = document.querySelector('[data-nav]');
  if(burger && nav){
    burger.addEventListener('click', () => {
      nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
  }

  // Active link helper (based on body data-page)
  const page = document.body.getAttribute('data-page');
  if(page){
    document.querySelectorAll('.navlinks a').forEach(a => {
      if(a.getAttribute('data-link') === page) a.classList.add('active');
    });
  }

  // Add a marker class so CSS can hide elements until JS runs (prevents FOUC)
  document.documentElement.classList.add('js');

  // Reveal-on-scroll with dynamic staggered delays using IntersectionObserver
  const revealSelector = '.hero-card, .panel, .card, .li, .kicker, .footer-grid';
  const observerOptions = { root: null, rootMargin: '0px 0px -12% 0px', threshold: 0.06 };
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const el = entry.target;
        // delay based on element position in viewport for natural staggering
        const ratio = Math.max(0, Math.min(1, entry.boundingClientRect.top / window.innerHeight));
        const delay = Math.round(ratio * 320); // up to ~320ms delay
        el.style.transitionDelay = `${delay}ms`;
        requestAnimationFrame(() => el.classList.add('visible'));
        revealObserver.unobserve(el);
      }
    });
  }, observerOptions);
  document.querySelectorAll(revealSelector).forEach(el => revealObserver.observe(el));

  // Smooth lerp-based parallax for hero backgrounds (skips when user prefers reduced motion)
  const heroes = Array.from(document.querySelectorAll('.hero'));
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(heroes.length && !prefersReduced){
    const state = heroes.map(h => ({ el: h, media: h.querySelector('.hero-media'), target: 0, current: 0 }));
    let rafId = null;
    const ease = 0.08;

    const updateTargets = () => {
      const pageY = window.pageYOffset;
      state.forEach(s => {
        const offsetTop = s.el.offsetTop || 0;
        s.target = (pageY - offsetTop) * 0.12; // gentle factor
      });
      if(!rafId) runRAF();
    };

    const runRAF = () => {
      let running = false;
      state.forEach(s => {
        s.current += (s.target - s.current) * ease;
        const transformY = Math.round(s.current * 100) / 100; // limit subpixel noise
        if(s.media) s.media.style.transform = `translate3d(0, ${transformY}px, 0)`;
        if(Math.abs(s.target - s.current) > 0.2) running = true;
      });
      if(running) rafId = requestAnimationFrame(runRAF);
      else rafId = null;
    };

    // initialize and bind
    updateTargets();
    window.addEventListener('scroll', updateTargets, { passive: true });
    window.addEventListener('resize', updateTargets, { passive: true });
  }


  // Shrink header on scroll
  const header = document.querySelector('.header');
  if(header){
    window.addEventListener('scroll', () => {
      if(window.scrollY > 50){
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Back to top button
  const backToTopBtn = document.getElementById('back-to-top');
  if(backToTopBtn){
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    // Show/hide based on scroll
    window.addEventListener('scroll', () => {
      if(window.scrollY > 100){
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
  }

})();
