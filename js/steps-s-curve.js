/**
 * Four Steps S-Curve - 跟随滚动沿 S 形路径发光出现
 */
(function () {
  var section = document.querySelector('.steps-section');
  if (!section) return;

  var pathEl = section.querySelector('.steps-s-path');
  var glowEl = section.querySelector('.steps-glow-dot');
  var rows = section.querySelectorAll('.step-row');

  if (!pathEl || !glowEl || !rows.length) return;

  var path = pathEl;
  var totalLength = path.getTotalLength();

  // 设置初始 stroke
  path.style.strokeDasharray = totalLength;
  path.style.strokeDashoffset = totalLength;

  // 每张卡对应的进度阈值 (0-1)，越小越早变色
  var cardThresholds = [0.06, 0.22, 0.45, 0.68];

  function update(progress) {
    progress = Math.max(0, Math.min(1, progress));

    // 路径绘制：从 0 到 progress 逐渐显示
    var offset = totalLength * (1 - progress);
    path.style.strokeDashoffset = offset;

    // 发光点沿路径移动
    var point = path.getPointAtLength(progress * totalLength);
    glowEl.setAttribute('cx', point.x);
    glowEl.setAttribute('cy', point.y);
    glowEl.style.opacity = progress > 0.02 ? '1' : '0';

    // 每行依次发光
    rows.forEach(function (row, i) {
      if (progress >= cardThresholds[i]) {
        row.classList.add('step-lit');
      } else {
        row.classList.remove('step-lit');
      }
    });
  }

  function getScrollProgress() {
    var rect = section.getBoundingClientRect();
    var winH = window.innerHeight;
    var startY = winH * 0.4;
    var endY = winH * 0.2;

    if (rect.top > startY) return 0;
    if (rect.bottom < endY) return 1;

    var total = startY - endY + rect.height;
    var scrolled = startY - rect.top;
    return Math.min(1, Math.max(0, scrolled / total));
  }

  function onScroll() {
    update(getScrollProgress());
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  // 初始化
  requestAnimationFrame(function () {
    update(getScrollProgress());
  });
})();
