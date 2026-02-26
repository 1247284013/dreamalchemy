/**
 * RevealItems - block-level blur-in animation
 * Each div/section animates as a whole: direction from top, blur(10px) opacity 0 y:-50 → blur(0) opacity 1 y:0
 * Delay 200ms between each block
 */
(function () {
  var DELAY_STEP = 400;
  var DIRECTION = 'top';
  var THRESHOLD = 0;
  var ROOT_MARGIN = '80px';

  var CONTAINER_CHILD = {
    'pricing-grid': 'pricing-card',
    'features-grid': 'feature-card',
    'trust-grid': 'trust-card',
    'steps-grid': 'step-card',
    'disclaimer-box': 'disclaimer-item',
    'traction-stats': 'stat-card',
    'insights-grid': 'insight-card',
    'metric-bar': 'metric-item',
    'tech-cards': 'tech-card',
    'tech-section': 'section-label,tech-title,tech-subtitle,metric-bar,tech-cards,logo-loop-section',
    'traction-section': 'traction-quote,traction-stats,mvp-bar,insights-grid',
    'narrative-inner': 'hook,p,.cta-line'
  };

  function expandContainer(el) {
    var cls = el.className && typeof el.className === 'string' ? el.className : '';
    for (var key in CONTAINER_CHILD) {
      if (cls.indexOf(key) >= 0) {
        var sel = CONTAINER_CHILD[key];
        var children = el.querySelectorAll('.' + sel.split(',')[0].trim());
        if (sel.indexOf(',') >= 0) {
          var parts = sel.split(',').map(function (s) { return s.trim(); });
          children = [];
          parts.forEach(function (part) {
            var q = part.charAt(0) === '.' ? part : (part === 'p' ? 'p' : '.' + part);
            el.querySelectorAll(q).forEach(function (c) { children.push(c); });
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

  function setupReveal() {
    var root = document.body;
    var items = collectItems(root);
    items.forEach(function (el, index) {
      el.classList.add('reveal-item');
      el.style.setProperty('--reveal-delay', (index * DELAY_STEP) / 1000 + 's');
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
          }
        });
      },
      { threshold: THRESHOLD, rootMargin: ROOT_MARGIN }
    );

    items.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var inView = rect.top < window.innerHeight + 80 && rect.bottom > -80;
      if (inView) {
        el.classList.add('reveal-visible');
      } else {
        observer.observe(el);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupReveal);
  } else {
    setupReveal();
  }
})();
