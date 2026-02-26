/**
 * BlurText - word-by-word blur animation for headings, sub-headings, pricing-intro
 * Effect: blur(10px) opacity 0 y:-50 → blur(5px) opacity 0.5 y:5 → blur(0) opacity 1 y:0
 */
(function () {
  var WORD_DELAY = 150;
  var THRESHOLD = 0.08;
  var ROOT_MARGIN = '80px';

  var SELECTORS = [
    '.page-section .heading',
    '.page-section .sub-heading',
    '.page-section .pricing-intro'
  ];

  function extractSegments(el) {
    var segments = [];
    var nodes = Array.prototype.slice.call(el.childNodes);
    nodes.forEach(function (node) {
      var isSpan = node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SPAN';
      var isText = node.nodeType === Node.TEXT_NODE;
      var isBr = node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR';
      if (isText) {
        var text = node.textContent || '';
        var parts = text.split(/(\s+)/);
        parts.forEach(function (p) {
          if (/^\s+$/.test(p)) {
            if (segments.length) segments[segments.length - 1].spaceAfter = true;
          } else if (p) {
            segments.push({ text: p, accent: false, spaceAfter: false });
          }
        });
      } else if (isSpan) {
        var spanWords = (node.textContent || '').trim().split(/\s+/).filter(Boolean);
        spanWords.forEach(function (w, i) {
          segments.push({ text: w, accent: true, spaceAfter: i < spanWords.length - 1 });
        });
      } else if (isBr && segments.length) {
        segments[segments.length - 1].spaceAfter = true;
      } else if (node.nodeType === Node.ELEMENT_NODE && !isSpan && !isBr) {
        var inner = (node.textContent || '').trim();
        if (inner) {
          inner.split(/\s+/).forEach(function (w, i) {
            segments.push({ text: w, accent: false, spaceAfter: i < inner.split(/\s+/).length - 1 });
          });
        }
      }
    });
    return segments;
  }

  function wrapElement(el) {
    var segments = extractSegments(el);
    if (segments.length === 0) return false;
    var wordDelay = el.classList.contains('pricing-intro') ? 40 : WORD_DELAY;

    el.classList.add('blur-text-wrapper');
    el.innerHTML = '';
    el.style.display = 'flex';
    el.style.flexWrap = 'wrap';
    el.style.justifyContent = 'center';

    segments.forEach(function (seg, index) {
      var span = document.createElement('span');
      span.className = 'blur-word';
      span.style.animationDelay = (index * wordDelay) / 1000 + 's';
      if (seg.accent) span.classList.add('blur-word-accent');
      span.textContent = seg.text;
      el.appendChild(span);
      if (seg.spaceAfter) el.appendChild(document.createTextNode('\u00A0'));
    });
    return true;
  }

  function setup() {
    var items = [];
    SELECTORS.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (el.closest('header, footer')) return;
        if ((el.textContent || '').trim().length < 2) return;
        items.push(el);
      });
    });

    items.forEach(function (el) {
      wrapElement(el);
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('blur-text-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: THRESHOLD, rootMargin: ROOT_MARGIN }
    );

    document.querySelectorAll('.blur-text-wrapper').forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 80 && rect.bottom > -80) {
        el.classList.add('blur-text-visible');
      } else {
        observer.observe(el);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
