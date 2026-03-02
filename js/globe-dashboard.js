/**
 * Community Dashboard — 3D Rotating Globe
 * Orthographic projection, particle land dots, animated city pings, hover tooltips
 */
(function () {

  // ── City data: [name, lat, lon, country, usersToday] ──
  var CITIES = [
    ['London',        51.5,  -0.1,   'UK',          34],
    ['Paris',         48.9,   2.3,   'France',       28],
    ['Berlin',        52.5,  13.4,   'Germany',      22],
    ['Amsterdam',     52.4,   4.9,   'Netherlands',  11],
    ['Madrid',        40.4,  -3.7,   'Spain',        13],
    ['Rome',          41.9,  12.5,   'Italy',        10],
    ['Stockholm',     59.3,  18.1,   'Sweden',        9],
    ['Moscow',        55.8,  37.6,   'Russia',       16],
    ['Istanbul',      41.0,  28.9,   'Turkey',       10],
    ['New York',      40.7, -74.0,   'US',           51],
    ['Los Angeles',   34.1,-118.2,   'US',           38],
    ['Chicago',       41.9, -87.6,   'US',           19],
    ['Toronto',       43.7, -79.4,   'Canada',       17],
    ['Mexico City',   19.4, -99.1,   'Mexico',       21],
    ['São Paulo',    -23.5, -46.6,   'Brazil',       31],
    ['Buenos Aires', -34.6, -58.4,   'Argentina',    14],
    ['Santiago',     -33.5, -70.6,   'Chile',         8],
    ['Bogotá',         4.7, -74.1,   'Colombia',      9],
    ['Tokyo',         35.7, 139.7,   'Japan',        44],
    ['Seoul',         37.6, 127.0,   'South Korea',  29],
    ['Beijing',       39.9, 116.4,   'China',        33],
    ['Shanghai',      31.2, 121.5,   'China',        27],
    ['Hong Kong',     22.3, 114.2,   'China',        18],
    ['Singapore',      1.3, 103.8,   'Singapore',    16],
    ['Jakarta',       -6.2, 106.8,   'Indonesia',    15],
    ['Bangkok',       13.8, 100.5,   'Thailand',     14],
    ['Kuala Lumpur',   3.1, 101.7,   'Malaysia',     11],
    ['Manila',        14.6, 121.0,   'Philippines',  12],
    ['Sydney',       -33.9, 151.2,   'Australia',    18],
    ['Melbourne',    -37.8, 144.9,   'Australia',    13],
    ['Mumbai',        19.1,  72.9,   'India',        25],
    ['Delhi',         28.6,  77.2,   'India',        20],
    ['Karachi',       24.9,  67.1,   'Pakistan',      8],
    ['Dubai',         25.2,  55.3,   'UAE',          12],
    ['Cairo',         30.1,  31.2,   'Egypt',        11],
    ['Lagos',          6.5,   3.4,   'Nigeria',       9],
    ['Nairobi',       -1.3,  36.8,   'Kenya',         7],
    ['Cape Town',    -33.9,  18.4,   'South Africa',  8],
    ['Johannesburg', -26.2,  28.0,   'South Africa',  9],
  ];

  // ── Land regions: [minLat, maxLat, minLon, maxLon, density] ──
  var LAND = [
    // ── North America ──
    [55,65,-168,-130, 0.82], [65,72,-167,-140, 0.72], // Alaska
    [49,60,-130,-120, 0.88], [48,62,-120,-108, 0.88], // Pacific Canada
    [48,58,-108,-92,  0.90], [44,58, -92, -76, 0.88], // Central/East Canada
    [44,52, -76, -64, 0.85], [46,52, -66, -52, 0.80], // Maritime/Labrador
    [32,48,-124,-118, 0.88], [32,48,-118,-100, 0.88], // Pacific+Mountain USA
    [30,48,-100, -82, 0.90], [30,44, -82, -68, 0.90], // Central+East USA
    [24,32, -90, -76, 0.88], [24,31, -87, -80, 0.85], // SE USA + Florida
    [22,32,-118,-100, 0.80], [14,22,-100, -86, 0.82], // Mexico N+S
    [17,22, -92, -86, 0.78], [8, 18, -88, -76, 0.78], // Yucatan + C.America
    [20,23, -85, -74, 0.80], [17,20, -74, -68, 0.78], // Cuba + Hispaniola
    [52,65, -82, -72, 0.60], [62,72, -72, -62, 0.50], // Hudson Bay / Baffin

    // ── Greenland + Iceland ──
    [62,84, -56, -18, 0.52], [72,84, -64, -32, 0.52],
    [63,67, -26, -13, 0.80],

    // ── South America ──
    [0, 12, -74, -60, 0.88], [2,  8, -60, -50, 0.88], // Venezuela/Guianas
    [-5, 5, -52, -35, 0.80], [-5, 5, -68, -52, 0.88], // Brazil N
    [-20,-5, -68, -44, 0.88], [-28,-14,-52, -38, 0.85], // Brazil C+SE
    [-5, 2, -82, -72, 0.82], [-18,-5, -82, -72, 0.80], // Peru/Ecuador
    [-22,-10,-70, -58, 0.85], [-28,-18,-62, -56, 0.85], // Bolivia/Paraguay
    [-38,-28,-64, -54, 0.85], [-52,-38,-70, -56, 0.82], // Argentina N+S
    [-52,-18,-76, -70, 0.78], [-34,-28,-60, -52, 0.85], // Chile + Uruguay

    // ── Europe ──
    [36,44, -9,   3, 0.92], [43,51, -2,   8, 0.90], // Iberia + France
    [50,56, -6,   2, 0.88], [55,59, -6,   2, 0.82], // England + Scotland
    [51,55,-10,  -5, 0.80], [54,58,  8,  12, 0.82], // Ireland + Denmark
    [49,53,  3,   7, 0.90], [47,55,  6,  15, 0.90], // Benelux + Germany
    [46,48,  6,  17, 0.88], [48,52, 12,  22, 0.88], // Switzerland + Czech
    [49,55, 14,  24, 0.90], [44,46,  7,  14, 0.85], // Poland + N Italy
    [38,46, 10,  18, 0.88], [40,46, 13,  20, 0.82], // Italy + Balkans W
    [44,48, 18,  27, 0.88], [44,48, 22,  30, 0.88], // Hungary + Romania
    [41,46, 20,  28, 0.85], [36,42, 20,  26, 0.80], // Bulgaria + Greece
    [40,42, 26,  30, 0.85], [44,52, 24,  40, 0.88], // Turkey Eur + Ukraine
    [51,55, 23,  32, 0.85], [54,60, 20,  28, 0.82], // Belarus + Baltic
    [60,70, 20,  30, 0.78], [57,65,  5,  20, 0.80], // Finland + Norway S
    [65,72, 14,  28, 0.68], [55,62, 10,  18, 0.85], // Norway N + Sweden S
    [62,68, 15,  22, 0.76], [50,60, 36,  60, 0.78], // Sweden N + Russia W
    [60,68, 40,  65, 0.68], [55,68, 55,  72, 0.62], // Russia N+E Eur

    // ── Africa ──
    [28,36, -6,   2, 0.88], [30,37,  2,  12, 0.82], // Morocco + Algeria
    [22,33, 10,  26, 0.78], [22,32, 26,  36, 0.80], // Libya + Egypt
    [15,28,-18,   6, 0.72], [10,22, 24,  42, 0.76], // W Sahara + Sudan
    [4, 15,-18,  10, 0.85], [-5, 5, 10,  30, 0.88], // W Africa + Congo
    [-12,10, 30,  42, 0.85], [2, 12, 40,  52, 0.80], // E Africa + Horn
    [-20,-5, 12,  36, 0.85], [-25,-10,30,  36, 0.82], // Angola/Zambia + Moz
    [-35,-25,16,  32, 0.85], [-30,-18,14,  28, 0.82], // S Africa + Namibia
    [-26,-12,43,  51, 0.88], // Madagascar

    // ── Asia — Middle East ──
    [36,42, 26,  44, 0.88], [30,38, 35,  42, 0.82], // Turkey + Levant
    [28,38, 38,  48, 0.82], [15,32, 36,  56, 0.80], // Iraq + Arabia
    [12,22, 42,  60, 0.78], [22,30, 46,  60, 0.76], // Yemen/Oman + Gulf
    // ── Asia — Central ──
    [25,40, 44,  64, 0.82], [28,38, 60,  75, 0.80], // Iran + Afghan
    [22,36, 62,  76, 0.82], [40,56, 50,  82, 0.70], // Pakistan + Kazakh
    [36,44, 52,  68, 0.76], [35,55, 55,  80, 0.62], // C Asia + W Siberia
    // ── Asia — South ──
    [8, 22, 68,  84, 0.90], [22,32, 72,  88, 0.88], // India S + N
    [6, 10, 79,  82, 0.85], [26,30, 80,  92, 0.82], // Sri Lanka + Nepal
    [20,26, 88,  92, 0.88], [14,28, 92, 102, 0.85], // Bangladesh + Myanmar
    // ── Asia — SE mainland ──
    [5, 20, 98, 104, 0.88], [10,22,100, 108, 0.85], // Thailand + Laos/Cam
    [8, 22,102, 110, 0.85], [1,  8,100, 104, 0.85], // Vietnam + Malay Pen
    // ── Asia — China/Korea/Japan ──
    [20,30,108, 122, 0.88], [30,38,100, 120, 0.85], // China S + C
    [38,48, 78, 110, 0.72], [42,52, 88, 120, 0.65], // China NW + Mongolia
    [34,42,125, 130, 0.88], [32,40,130, 142, 0.85], // Korea + Japan Honshu
    [42,46,140, 146, 0.80], [22,26,120, 122, 0.88], // Hokkaido + Taiwan
    // ── Asia — Russia Siberia ──
    [52,72, 90, 130, 0.48], [52,72,130, 155, 0.44],
    [50,62,158, 165, 0.68], // Kamchatka
    // ── Asia — SE islands ──
    [-6, 6, 95, 108, 0.85], [-9,-5,106, 116, 0.85], // Sumatra + Java
    [-4, 7,108, 118, 0.85], [-6, 2,118, 125, 0.78], // Borneo + Sulawesi
    [5, 20,118, 127, 0.75], [-10, 0,131, 151, 0.82], // Philippines + New Guinea

    // ── Australia ──
    [-36,-22,114, 122, 0.80], [-22,-14,114, 130, 0.82],
    [-26,-14,128, 138, 0.80], [-26,-14,138, 146, 0.82],
    [-36,-26,140, 154, 0.85], [-38,-26,128, 142, 0.80],
    [-38,-28,148, 154, 0.82], [-38,-34,140, 150, 0.85],
    [-44,-40,144, 148, 0.82], // Tasmania

    // ── New Zealand ──
    [-42,-34,172, 178, 0.82], [-47,-42,166, 172, 0.82],

    // ── Arctic islands ──
    [76,80, 14,  22, 0.50], // Svalbard
    [72,76, 22,  30, 0.45], // Novaya Zemlya N
  ];

  // ── Feed pools ──
  var FEED_USERS   = ['Luna_M','DreamWalker','StarryMind','NightOwl_23','CloudNine','MoonChaser',
                      'RiverDream','SilverFox','AstralKid','VoidWatcher','EchoMind','ZephyrSoul',
                      'NebulaDrift','CrimsonDream','QuietStorm','SageWillow'];
  var FEED_ACTIONS = ['destroyed a nightmare','shared a dream','just subscribed',
                      'completed a session','soothed a memory','blew away the fog',
                      'crushed a fear','rewrote a nightmare','shook apart the darkness',
                      'achieved emotional closure'];

  // ── Canvas / Globe state ──
  var canvas  = document.getElementById('globeCanvas');
  if (!canvas) return;
  var ctx     = canvas.getContext('2d');
  var W = 0, H = 0, R = 0, cx = 0, cy = 0;
  var animId;
  var rotY    = 0;
  var ROT_SPEED = 0.0025;
  var TILT    = 0.25;            // X-axis tilt (radians)
  var cosT    = Math.cos(TILT);
  var sinT    = Math.sin(TILT);

  var landPts     = [];          // [{lat, lon}]
  var activePings = [];
  var lastPingTs  = 0;
  var hoveredCity = null;
  var tooltip     = document.getElementById('globeTooltip');
  var isDragging  = false;
  var dragStartX  = 0;
  var dragStartRot = 0;

  // ── Pseudo-random (seeded) ──
  var _seed = 42;
  function rand() {
    _seed = (_seed * 1664525 + 1013904223) & 0xffffffff;
    return ((_seed >>> 0) / 0xffffffff);
  }

  // ── Generate land points ──
  function generateLandPts() {
    _seed = 42;
    landPts = [];
    var STEP = 1.8;
    for (var lat = -80; lat <= 80; lat += STEP) {
      for (var lon = -180; lon <= 180; lon += STEP) {
        for (var r = 0; r < LAND.length; r++) {
          var reg = LAND[r];
          if (lat >= reg[0] && lat <= reg[1] && lon >= reg[2] && lon <= reg[3]) {
            if (rand() < reg[4]) landPts.push({ lat: lat, lon: lon });
            break;
          }
        }
      }
    }
  }

  // ── 3D Orthographic Projection ──
  function project(lat, lon) {
    var phi    = lat * Math.PI / 180;
    var lambda = lon * Math.PI / 180 + rotY;

    var x = Math.cos(phi) * Math.cos(lambda);
    var y = -Math.sin(phi);
    var z = Math.cos(phi) * Math.sin(lambda);

    // Apply X tilt
    var y2 = y * cosT - z * sinT;
    var z2 = y * sinT + z * cosT;

    return {
      sx: cx + x * R,
      sy: cy + y2 * R,
      z:  z2,           // +1 = front centre, -1 = back centre
    };
  }

  // ── Glow helper ──
  function drawGlow(x, y, r, alpha) {
    var g = ctx.createRadialGradient(x, y, 0, x, y, r * 3.5);
    g.addColorStop(0,    'rgba(220,225,255,' + (alpha * 0.95) + ')');
    g.addColorStop(0.3,  'rgba(130,140,255,' + (alpha * 0.70) + ')');
    g.addColorStop(1,    'rgba(110,117,253,0)');
    ctx.beginPath();
    ctx.arc(x, y, r * 3.5, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(230,233,255,' + alpha + ')';
    ctx.fill();
  }

  // ── Add ping ──
  function addPing() {
    var c = CITIES[Math.floor(Math.random() * CITIES.length)];
    activePings.push({ lat: c[1], lon: c[2], city: c, born: performance.now(), duration: 2600 });
  }

  // ── Main draw loop ──
  function draw(ts) {
    ctx.clearRect(0, 0, W, H);

    if (!isDragging) rotY += ROT_SPEED;

    // 1. Atmosphere outer glow
    var atmo = ctx.createRadialGradient(cx, cy, R * 0.88, cx, cy, R * 1.22);
    atmo.addColorStop(0,   'rgba(90,100,220,0.0)');
    atmo.addColorStop(0.45,'rgba(90,100,220,0.12)');
    atmo.addColorStop(0.75,'rgba(70,80,200,0.06)');
    atmo.addColorStop(1,   'rgba(60,70,180,0.0)');
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.22, 0, Math.PI * 2);
    ctx.fillStyle = atmo;
    ctx.fill();

    // 2. Globe dark sphere
    var globe = ctx.createRadialGradient(cx - R * 0.28, cy - R * 0.28, R * 0.05, cx, cy, R);
    globe.addColorStop(0,   'rgba(30,18,65,0.96)');
    globe.addColorStop(0.6, 'rgba(12,5,30,0.98)');
    globe.addColorStop(1,   'rgba(5,2,15,0.99)');
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = globe;
    ctx.fill();

    // 3. Land dots (back first, then front for correct layering — simple: just skip back)
    for (var i = 0; i < landPts.length; i++) {
      var p = project(landPts[i].lat, landPts[i].lon);
      if (p.z < 0) continue;
      var alpha = p.z * 0.55 + 0.18;
      var dotR  = p.z * 0.9 + 1.4;
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, dotR, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(145,155,255,' + alpha + ')';
      ctx.fill();
    }

    // 4. Spawn & draw pings
    if (ts - lastPingTs > 1300) { addPing(); lastPingTs = ts; }
    var now = performance.now();
    activePings = activePings.filter(function (p) { return now - p.born < p.duration; });

    for (var i = 0; i < activePings.length; i++) {
      var ping = activePings[i];
      var sp   = project(ping.lat, ping.lon);
      if (sp.z < 0.05) continue;

      var age   = (now - ping.born) / ping.duration;
      var alpha = (1 - age) * sp.z;
      var scale = sp.z;

      // Outer ring
      ctx.beginPath();
      ctx.arc(sp.sx, sp.sy, age * 22 * scale, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(165,175,255,' + (alpha * 0.9) + ')';
      ctx.lineWidth   = 2;
      ctx.stroke();

      // Inner ring
      if (age > 0.2) {
        ctx.beginPath();
        ctx.arc(sp.sx, sp.sy, (age - 0.2) * 14 * scale, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(210,218,255,' + (alpha * 0.65) + ')';
        ctx.lineWidth   = 1;
        ctx.stroke();
      }

      drawGlow(sp.sx, sp.sy, 3.2 * scale, Math.min(1, alpha + 0.1));
    }

    // 5. City dots
    for (var i = 0; i < CITIES.length; i++) {
      var c  = CITIES[i];
      var sp = project(c[1], c[2]);
      if (sp.z < 0.05) continue;

      var isHov  = (hoveredCity && hoveredCity[0] === c[0]);
      var dotAlp = sp.z * 0.45 + 0.55;
      var dotSz  = isHov ? 5 : 3 * (sp.z * 0.4 + 0.7);

      ctx.beginPath();
      ctx.arc(sp.sx, sp.sy, dotSz, 0, Math.PI * 2);
      ctx.fillStyle = isHov ? 'rgba(255,255,255,1)' : 'rgba(200,212,255,' + dotAlp + ')';
      ctx.fill();

      if (isHov) {
        ctx.beginPath();
        ctx.arc(sp.sx, sp.sy, 10, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(110,120,255,0.75)';
        ctx.lineWidth   = 1.5;
        ctx.stroke();
        drawGlow(sp.sx, sp.sy, 4, 0.8);
      }
    }

    // 6. Globe rim
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(110,120,255,0.22)';
    ctx.lineWidth   = 1.2;
    ctx.stroke();

    // 7. Specular highlight (top-left shine)
    var shine = ctx.createRadialGradient(cx - R * 0.38, cy - R * 0.38, 0, cx - R * 0.38, cy - R * 0.38, R * 0.65);
    shine.addColorStop(0, 'rgba(180,190,255,0.08)');
    shine.addColorStop(1, 'rgba(180,190,255,0.0)');
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = shine;
    ctx.fill();

    animId = requestAnimationFrame(draw);
  }

  // ── Hover ──
  canvas.addEventListener('mousemove', function (e) {
    if (isDragging) {
      rotY = dragStartRot + (e.clientX - dragStartX) * 0.005;
      return;
    }
    var rect   = canvas.getBoundingClientRect();
    var scaleX = W / rect.width;
    var scaleY = H / rect.height;
    var mx = (e.clientX - rect.left) * scaleX;
    var my = (e.clientY - rect.top)  * scaleY;

    var closest = null, minD = 22;
    for (var i = 0; i < CITIES.length; i++) {
      var c  = CITIES[i];
      var sp = project(c[1], c[2]);
      if (sp.z < 0.05) continue;
      var dist = Math.hypot(sp.sx - mx, sp.sy - my);
      if (dist < minD) { minD = dist; closest = c; }
    }

    hoveredCity = closest;
    if (closest) {
      var tx = e.clientX - canvas.getBoundingClientRect().left + 16;
      var ty = e.clientY - canvas.getBoundingClientRect().top  - 52;
      var bnd = canvas.getBoundingClientRect();
      if (tx + 175 > bnd.width)  tx -= (tx + 175 - bnd.width + 10);
      if (ty < 0) ty = e.clientY - bnd.top + 16;
      tooltip.style.display = 'block';
      tooltip.style.left    = tx + 'px';
      tooltip.style.top     = ty + 'px';
      tooltip.innerHTML =
        '<div class="gt-city">' + closest[0] + '</div>' +
        '<div class="gt-country">' + closest[3] + '</div>' +
        '<div class="gt-stat"><span class="gt-dot"></span>' + closest[4] + ' new dreamers today</div>';
      canvas.style.cursor = 'crosshair';
    } else {
      tooltip.style.display = 'none';
      canvas.style.cursor   = 'default';
    }
  });

  canvas.addEventListener('mousedown', function (e) {
    isDragging   = true;
    dragStartX   = e.clientX;
    dragStartRot = rotY;
    canvas.style.cursor = 'grabbing';
  });
  window.addEventListener('mouseup', function () {
    if (isDragging) { isDragging = false; canvas.style.cursor = 'default'; }
  });
  canvas.addEventListener('mouseleave', function () {
    tooltip.style.display = 'none';
    hoveredCity = null;
  });

  // ── Resize ──
  function resize() {
    W  = canvas.offsetWidth;
    H  = W;                    // square for globe
    R  = W * 0.34;
    cx = W / 2;
    cy = H / 2;
    canvas.width  = W;
    canvas.height = H;
    canvas.style.height = H + 'px';
    generateLandPts();
  }

  window.addEventListener('resize', function () {
    cancelAnimationFrame(animId);
    resize();
    animId = requestAnimationFrame(draw);
  });

  // ── Count-up for stat cards ──
  function fmtNum(n, unit) { return unit ? Math.floor(n) + unit : Math.floor(n).toLocaleString(); }
  function countUp(el) {
    var target   = parseFloat(el.getAttribute('data-target'));
    var unit     = el.getAttribute('data-unit') || '';
    var duration = target > 1000 ? 2000 : 1400;
    var start    = performance.now();
    (function tick(now) {
      var t    = Math.min((now - start) / duration, 1);
      var ease = 1 - Math.pow(1 - t, 3);
      el.textContent = fmtNum(ease * target, unit);
      if (t < 1) requestAnimationFrame(tick);
    })(start);
  }

  var liveStats = {
    total:    { val: 12847, el: null, rate: 0.008 },
    newToday: { val: 247,   el: null, rate: 0.04  },
    dreams:   { val: 89,    el: null, rate: 0.015 },
    countries:{ val: 68,    el: null, rate: 0      },
  };

  var counted = false;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && !counted) {
        counted = true;
        var els = document.querySelectorAll('.dsc-num[data-target]');
        liveStats.total.el     = els[0];
        liveStats.newToday.el  = els[1];
        liveStats.dreams.el    = els[2];
        liveStats.countries.el = els[3];
        els.forEach(countUp);
        setTimeout(startLiveDrift, 2200);
      }
    });
  }, { threshold: 0.3 });

  function startLiveDrift() {
    var last = performance.now(), burstT = 0;
    setInterval(function () {
      var now = performance.now(), dt = (now - last) / 1000; last = now;
      burstT += dt;
      if (burstT > 8 + Math.random() * 4) {
        burstT = 0;
        liveStats.total.val    += Math.floor(Math.random() * 3) + 1;
        liveStats.newToday.val += Math.floor(Math.random() * 3) + 1;
        liveStats.dreams.val   += Math.random() * 0.3;
      }
      liveStats.total.val    += liveStats.total.rate    * dt * 60;
      liveStats.newToday.val += liveStats.newToday.rate * dt * 60;
      liveStats.dreams.val   += liveStats.dreams.rate   * dt * 60;
      function upd(s, unit) {
        if (!s.el) return;
        var prev = s.el.textContent, next = fmtNum(s.val, unit);
        if (prev !== next) {
          s.el.textContent = next;
          s.el.style.color = '#b0b8ff';
          setTimeout(function () { s.el.style.color = ''; }, 300);
        }
      }
      upd(liveStats.total, ''); upd(liveStats.newToday, ''); upd(liveStats.dreams, 'k+');
    }, 400);
  }

  var section = document.querySelector('.live-dashboard');
  if (section) obs.observe(section);

  // ── Live feed ──
  var feedEvents = [];
  for (var i = 0; i < CITIES.length; i++)
    for (var j = 0; j < FEED_ACTIONS.length; j++)
      feedEvents.push({ user: FEED_USERS[i % FEED_USERS.length], action: FEED_ACTIONS[j], city: CITIES[i][0] });
  feedEvents.sort(function () { return Math.random() - 0.5; });
  var feedIdx = 0;

  setInterval(function () {
    var list = document.getElementById('feedList');
    if (!list) return;
    var ev   = feedEvents[feedIdx++ % feedEvents.length];
    var item = document.createElement('div');
    item.className = 'feed-item';
    item.innerHTML =
      '<div class="feed-avatar">' + ev.user[0] + '</div>' +
      '<div class="feed-content">' +
        '<span class="feed-user">' + ev.user + '</span>' +
        '<span class="feed-action"> ' + ev.action + '</span>' +
        '<div class="feed-city">📍 ' + ev.city + '</div>' +
      '</div>' +
      '<span class="feed-time">just now</span>';
    list.insertBefore(item, list.firstChild);
    var timeEls = list.querySelectorAll('.feed-time');
    for (var k = 1; k < timeEls.length; k++) {
      var prev = timeEls[k].textContent;
      if (prev === 'just now') timeEls[k].textContent = '1m ago';
      else if (/^(\d+)m ago/.test(prev)) timeEls[k].textContent = (parseInt(prev) + 1) + 'm ago';
    }
    list.scrollTo({ top: 0, behavior: 'smooth' });
    while (list.children.length > 30) list.removeChild(list.lastChild);
  }, 3500);

  // ── Sync feed height ──
  function syncFeedHeight() {
    var leftPanel = document.querySelector('.dash-panel:first-child');
    var feedCard  = document.querySelector('.dash-feed-card');
    if (leftPanel && feedCard) feedCard.style.height = leftPanel.offsetHeight + 'px';
  }
  window.addEventListener('load', syncFeedHeight);
  window.addEventListener('resize', syncFeedHeight);

  // ── Init ──
  resize();
  animId = requestAnimationFrame(draw);

})();
