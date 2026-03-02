/**
 * RevealItems - block-level blur-in animation
 * Each div/section animates as a whole: direction from top, blur(10px) opacity 0 y:-50 → blur(0) opacity 1 y:0
 * Delay 200ms between each block
 */
(function () {
  var DELAY_STEP = 100;
  var DIRECTION = 'top';
  var THRESHOLD = 0;
  var ROOT_MARGIN = '10px';

  var CONTAINER_CHILD = {
    'pricing-grid': 'pricing-card',
    'features-grid': 'feature-card',
    'trust-grid': 'trust-card',
    'steps-grid': 'step-row',
    'disclaimer-box': 'disclaimer-item',
    'traction-stats': 'stat-card',
    'insights-grid': 'insight-card',
    'metric-bar': 'metric-item',
    'tech-cards': 'tech-card',
    'tech-section': 'section-label,tech-title,tech-subtitle,metric-bar,tech-cards,logo-loop-section',
    'disclaimer-section': 'section-label,disclaimer-title,disclaimer-subheading,disclaimer-box',
    'narrative-inner': 'hook,p,.cta-line'
  };
  var CONTAINER_DIRECT_ONLY = { 'tech-section': 1, 'disclaimer-section': 1 };

  function expandContainer(el) {
    var cls = el.className && typeof el.className === 'string' ? el.className : '';
    for (var key in CONTAINER_CHILD) {
      if (cls.indexOf(key) >= 0) {
        var sel = CONTAINER_CHILD[key];
        var directOnly = CONTAINER_DIRECT_ONLY[key];
        var children = el.querySelectorAll('.' + sel.split(',')[0].trim());
        if (sel.indexOf(',') >= 0) {
          var parts = sel.split(',').map(function (s) { return s.trim(); });
          children = [];
          parts.forEach(function (part) {
            var q = part.charAt(0) === '.' ? part : (part === 'p' ? 'p' : '.' + part);
            var scope = directOnly ? ':scope > ' : '';
            el.querySelectorAll(scope + q).forEach(function (c) { children.push(c); });
          });
        }
        return children.length ? Array.prototype.slice.call(children) : null;
      }
    }
    return null;
  }

  function collectItems(root) {
    var items = [];
    var sections = root.querySelectorAll('section.page-section, section.narrative-section, section.steps-section');
    sections.forEach(function (sec) {
      var direct = sec.children;
      for (var i = 0; i < direct.length; i++) {
        var el = direct[i];
        if (el.classList.contains('heading') || el.classList.contains('sub-heading') || el.classList.contains('pricing-intro')) continue;
        var children = expandContainer(el);
        if (children) {
          children.forEach(function (c) {
            var sub = expandContainer(c);
            if (sub) sub.forEach(function (s) { items.push(s); });
            else items.push(c);
          });
        } else {
          items.push(el);
        }
      }
    });
    return items;
  }

  var TECH_FAST_STEP = 170;
  var LOGO_LOOP_STEP = 80;
  var STEPS_FAST_DELAY = 0.04;
  var STEPS_FAST_DURATION_MS = 120;

  function setupReveal() {
    var root = document.body;
    var items = collectItems(root);
    var techSectionStartIdx = -1;
    var stepsSectionStartIdx = -1;
    items.forEach(function (el, i) {
      if (el.closest && el.closest('.tech-section') && techSectionStartIdx < 0) techSectionStartIdx = i;
      if (el.closest && el.closest('.steps-section') && !el.closest('.tech-section') && stepsSectionStartIdx < 0) stepsSectionStartIdx = i;
    });
    items.forEach(function (el, index) {
      el.classList.add('reveal-item');
      var delay = (index * DELAY_STEP) / 1000;
      if (techSectionStartIdx >= 0 && el.closest && el.closest('.tech-section')) {
        var techRelativeIdx = index - techSectionStartIdx;
        var base = (techSectionStartIdx * DELAY_STEP) / 1000 * 0.001;
        if (el.classList.contains('logo-loop-section')) {
          delay = base + (techRelativeIdx - 1) * TECH_FAST_STEP / 1000 + LOGO_LOOP_STEP / 1000;
        } else {
          delay = base + techRelativeIdx * TECH_FAST_STEP / 1000;
        }
      }
      el.style.setProperty('--reveal-delay', delay + 's');
    });

    var techRevealPending = [];
    var techRevealScheduled = false;

    function isStepsComplete() {
      if (stepsSectionStartIdx < 0 || techSectionStartIdx < 0) return true;
      for (var i = stepsSectionStartIdx; i < techSectionStartIdx; i++) {
        if (!items[i].classList.contains('reveal-visible')) return false;
      }
      return true;
    }

    function fastForwardStepsThenRevealTech() {
      var unrevealed = [];
      for (var i = stepsSectionStartIdx; i < techSectionStartIdx; i++) {
        if (!items[i].classList.contains('reveal-visible')) unrevealed.push(items[i]);
      }
      unrevealed.forEach(function (el, idx) {
        el.classList.add('reveal-fast');
        el.style.setProperty('--reveal-fast-delay', (idx * STEPS_FAST_DELAY) + 's');
        el.classList.add('reveal-visible');
      });
      var totalMs = unrevealed.length * STEPS_FAST_DELAY * 1000 + STEPS_FAST_DURATION_MS;
      setTimeout(function () {
        techRevealPending.forEach(function (el) {
          if (!el.classList.contains('reveal-visible')) el.classList.add('reveal-visible');
        });
        techRevealPending = [];
        techRevealScheduled = false;
      }, totalMs);
      techRevealScheduled = true;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var isTech = techSectionStartIdx >= 0 && el.closest && el.closest('.tech-section');
          if (isTech) {
            if (techRevealScheduled) {
              techRevealPending.push(el);
              return;
            }
            if (!isStepsComplete()) {
              techRevealPending.push(el);
              fastForwardStepsThenRevealTech();
              return;
            }
          }
          el.classList.add('reveal-visible');
        });
      },
      { threshold: THRESHOLD, rootMargin: ROOT_MARGIN }
    );

    function checkInitialView() {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          var initialTechInView = [];
          items.forEach(function (el) {
            var inNarrative = el.closest && el.closest('.narrative-section');
            if (inNarrative) {
              observer.observe(el);
              return;
            }
            var isTech = techSectionStartIdx >= 0 && el.closest && el.closest('.tech-section');
            var rect = el.getBoundingClientRect();
            var inView = rect.top < window.innerHeight + 120 && rect.bottom > -120;
            if (inView) {
              if (isTech && !isStepsComplete()) {
                initialTechInView.push(el);
              } else {
                el.classList.add('reveal-visible');
              }
            } else {
              observer.observe(el);
            }
          });
          if (initialTechInView.length) {
            techRevealPending = initialTechInView;
            fastForwardStepsThenRevealTech();
          }
          setTimeout(function () {
            document.querySelectorAll('.reveal-item:not(.reveal-visible)').forEach(function (el) {
              if (el.closest && el.closest('.narrative-section')) return;
              var isTech = techSectionStartIdx >= 0 && el.closest && el.closest('.tech-section');
              if (el.getBoundingClientRect().top < window.innerHeight + 200) {
                if (isTech && !isStepsComplete()) {
                  techRevealPending.push(el);
                  if (!techRevealScheduled) fastForwardStepsThenRevealTech();
                } else {
                  el.classList.add('reveal-visible');
                }
              }
            });
          }, 150);
        });
      });
    }
    checkInitialView();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupReveal);
  } else {
    setupReveal();
  }
})();
