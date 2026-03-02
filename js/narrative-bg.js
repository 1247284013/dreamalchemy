/**
 * Narrative section - 右侧背景图随滚动透明度从 0 到 1
 */
(function () {
  var section = document.querySelector('.narrative-section');
  var bg = section && section.querySelector('.narrative-bg-img');
  if (!section || !bg) return;

  function update() {
    var rect = section.getBoundingClientRect();
    var winH = window.innerHeight;
    var startY = winH * 0.5;
    var endY = winH * 0.3;

    if (rect.top > startY) {
      bg.style.opacity = '0';
      return;
    }
    if (rect.bottom < endY) {
      bg.style.opacity = '1';
      return;
    }

    var total = startY - endY + rect.height;
    var scrolled = startY - rect.top;
    var progress = Math.min(1, Math.max(0, scrolled / total));
    bg.style.opacity = String(progress);
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  requestAnimationFrame(update);
})();
