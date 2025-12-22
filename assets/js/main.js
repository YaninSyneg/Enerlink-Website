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


})();

// Header shrink + Back to Top Button Functionality
document.addEventListener('DOMContentLoaded', function() {
// OBJECT ORIENTED PROGRAMMING
class ShrinkingElement {
    constructor(selector, w) {
        this.selector = selector
        this.element = null;
        this.styles = '';
        this.init();
        console.log(selector, this.element)

        w.addEventListener('scroll', () => {
            console.log('scrolling');
            w.scrollY > 10 
                ? this.element.classList.add('small') 
                : this.element.classList.remove('small')
        })
    }

    getElement() {
        this.element = document.querySelector(this.selector)
    }

    addStyles() {
        this.styles = `
            ${this.selector} {
                transition: height 0.5s ease-in-out;
            }

            ${this.selector}.small {
                height: 60px;
            }
        `
        const styleTag = document.createElement('style');
        styleTag.innerHTML = this.styles;
        document.head.appendChild(styleTag);
        console.log(styleTag);
    }

    init() {
        this.getElement();
        this.addStyles();
    }


}


//Back to Top button
  const backToTopBtn = document.getElementById('backToTop') || document.getElementById('back-to-top');
  if(backToTopBtn){
    const toggleBackToTop = () => {
      backToTopBtn.style.display = (window.scrollY > 200) ? 'block' : 'none';
    };
    toggleBackToTop();
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // File upload status indicator
  const fileInput = document.getElementById('cv');
  const fileStatus = document.getElementById('file-status');
  const removeBtn = document.getElementById('remove-file');
  if(fileInput && fileStatus){
    fileInput.addEventListener('change', function() {
      if(this.files && this.files.length > 0){
        fileStatus.textContent = this.files[0].name;
        fileStatus.classList.add('uploaded');
        if(removeBtn) removeBtn.style.display = 'inline-flex';
      } else {
        fileStatus.textContent = 'No file chosen';
        fileStatus.classList.remove('uploaded');
        if(removeBtn) removeBtn.style.display = 'none';
      }
    });
    
    // Remove file functionality
    if(removeBtn){
      removeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        fileInput.value = '';
        fileStatus.textContent = 'No file chosen';
        fileStatus.classList.remove('uploaded');
        removeBtn.style.display = 'none';
      });
    }
  }
});
