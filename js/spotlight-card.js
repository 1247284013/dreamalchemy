/**
 * SpotlightCard - mouse-following spotlight effect (vanilla JS)
 * Sets --mouse-x, --mouse-y, --spotlight-color on mousemove
 */
(function () {
  var SPOTLIGHT_COLOR = 'rgba(124, 130, 255, 0.2)';

  function init() {
    document.querySelectorAll('.card-spotlight').forEach(function (el) {
      el.style.setProperty('--spotlight-color', SPOTLIGHT_COLOR);
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        el.style.setProperty('--mouse-x', x + 'px');
        el.style.setProperty('--mouse-y', y + 'px');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
