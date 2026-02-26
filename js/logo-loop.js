/**
 * LogoLoop - infinite horizontal scroll animation (vanilla JS)
 */
(function () {
  var SPEED = 100;
  var TAU = 0.25;

  function init() {
    var loop = document.querySelector('.logo-loop');
    if (!loop) return;
    var track = loop.querySelector('.logo-loop__track');
    var list = loop.querySelector('.logo-loop__list');
    if (!track || !list) return;

    var gap = 32;
    var seqWidth = list.getBoundingClientRect().width + gap;
    var offset = 0;
    var velocity = 0;
    var lastTime = null;
    var raf = null;

    function animate(timestamp) {
      if (lastTime === null) lastTime = timestamp;
      var dt = Math.min((timestamp - lastTime) / 1000, 0.1);
      lastTime = timestamp;

      var easing = 1 - Math.exp(-dt / TAU);
      velocity += (SPEED - velocity) * easing;
      offset += velocity * dt;
      if (offset >= seqWidth) offset -= seqWidth;

      track.style.transform = 'translate3d(' + (-offset) + 'px, 0, 0)';
      raf = requestAnimationFrame(animate);
    }

    raf = requestAnimationFrame(animate);
  }

  function run() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        requestAnimationFrame(function () { init(); });
      });
    } else {
      requestAnimationFrame(function () { init(); });
    }
  }
  run();
})();
