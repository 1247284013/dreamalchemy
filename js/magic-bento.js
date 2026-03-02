/**
 * MagicBento-style effects for feature cards - vanilla JS
 * Spotlight, border glow, tilt, magnetism, click ripple
 */
(function () {
  var SPOTLIGHT_RADIUS = 280;
  var GLOW_COLOR = '124, 130, 255';
  var MOBILE_BREAKPOINT = 768;

  function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function init() {
    var grids = document.querySelectorAll('.features-grid.magic-bento-grid, .risk-grid.magic-bento-grid');
    if (!grids.length || isMobile()) return;
    grids.forEach(function (g) { initGrid(g); });
  }

  function initGrid(grid) {
    var cards = grid.querySelectorAll('.feature-card.magic-bento-card, .risk-card.magic-bento-card');
    if (!cards.length) return;

    var spotlight = document.createElement('div');
    spotlight.className = 'magic-bento-spotlight';
    spotlight.style.cssText =
      'position:fixed;width:800px;height:800px;border-radius:50%;pointer-events:none;' +
      'background:radial-gradient(circle,rgba(' + GLOW_COLOR + ',0.12) 0%,rgba(' + GLOW_COLOR + ',0.06) 20%,rgba(' + GLOW_COLOR + ',0.02) 40%,transparent 65%);' +
      'z-index:1;opacity:0;transform:translate(-50%,-50%);mix-blend-mode:screen;transition:opacity .25s;';
    document.body.appendChild(spotlight);

    var section = grid.closest('.page-section');
    var proximity = SPOTLIGHT_RADIUS * 0.5;
    var fadeDistance = SPOTLIGHT_RADIUS * 0.75;

    function updateCardGlow(card, mouseX, mouseY, intensity) {
      var rect = card.getBoundingClientRect();
      var x = ((mouseX - rect.left) / rect.width) * 100;
      var y = ((mouseY - rect.top) / rect.height) * 100;
      card.style.setProperty('--glow-x', x + '%');
      card.style.setProperty('--glow-y', y + '%');
      card.style.setProperty('--glow-intensity', intensity);
      card.style.setProperty('--glow-radius', SPOTLIGHT_RADIUS + 'px');
    }

    function onMouseMove(e) {
      if (!section) return;
      var rect = section.getBoundingClientRect();
      var inside =
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom;

      if (!inside) {
        spotlight.style.opacity = '0';
        spotlight.style.left = '-9999px';
        cards.forEach(function (c) { c.style.setProperty('--glow-intensity', '0'); });
        return;
      }

      spotlight.style.left = e.clientX + 'px';
      spotlight.style.top = e.clientY + 'px';

      var minDist = Infinity;
      cards.forEach(function (card) {
        var cr = card.getBoundingClientRect();
        var cx = cr.left + cr.width / 2;
        var cy = cr.top + cr.height / 2;
        var d = Math.hypot(e.clientX - cx, e.clientY - cy) - Math.max(cr.width, cr.height) / 2;
        d = Math.max(0, d);
        minDist = Math.min(minDist, d);

        var glow = 0;
        if (d <= proximity) glow = 1;
        else if (d <= fadeDistance) glow = (fadeDistance - d) / (fadeDistance - proximity);
        updateCardGlow(card, e.clientX, e.clientY, glow);
      });

      var op = minDist <= proximity ? 0.7 : minDist <= fadeDistance ? ((fadeDistance - minDist) / (fadeDistance - proximity)) * 0.7 : 0;
      spotlight.style.opacity = op;
    }

    function onMouseLeave() {
      spotlight.style.opacity = '0';
      cards.forEach(function (c) { c.style.setProperty('--glow-intensity', '0'); });
    }

    cards.forEach(function (card) {
      card.style.transformOrigin = 'center center';

      function onCardMouseMove(e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var cx = rect.width / 2;
        var cy = rect.height / 2;
        var rx = ((y - cy) / cy) * -6;
        var ry = ((x - cx) / cx) * 6;
        var mx = (x - cx) * 0.03;
        var my = (y - cy) * 0.03;
        card.style.transform = 'perspective(800px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translate(' + mx + 'px,' + my + 'px) translateX(6px)';
        card.style.transition = 'transform .12s ease-out';
      }

      function onCardMouseLeave() {
        card.style.transform = '';
        card.style.transition = 'transform .3s ease';
      }

      function onCardClick(e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var maxD = Math.max(
          Math.hypot(x, y),
          Math.hypot(x - rect.width, y),
          Math.hypot(x, y - rect.height),
          Math.hypot(x - rect.width, y - rect.height)
        );
        var ripple = document.createElement('div');
        ripple.style.cssText =
          'position:absolute;width:' + (maxD * 2) + 'px;height:' + (maxD * 2) + 'px;' +
          'border-radius:50%;background:radial-gradient(circle,rgba(' + GLOW_COLOR + ',0.35) 0%,rgba(' + GLOW_COLOR + ',0.15) 35%,transparent 70%);' +
          'left:' + (x - maxD) + 'px;top:' + (y - maxD) + 'px;pointer-events:none;z-index:10;' +
          'animation:magic-ripple .7s ease-out forwards;';
        card.style.position = 'relative';
        card.appendChild(ripple);
        setTimeout(function () { ripple.remove(); }, 700);
      }

      card.addEventListener('mousemove', onCardMouseMove);
      card.addEventListener('mouseleave', onCardMouseLeave);
      card.addEventListener('click', onCardClick);
    });

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
  }

  var style = document.createElement('style');
  style.textContent = '@keyframes magic-ripple{0%{transform:scale(0);opacity:1}100%{transform:scale(1);opacity:0}}';
  document.head.appendChild(style);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
