var lastGlowTime = 0;
var glowThrottle = 120;
document.addEventListener("mousemove", function (event) {
    var now = Date.now();
    if (now - lastGlowTime < glowThrottle) return;
    lastGlowTime = now;
    var glow = document.createElement("div");
    glow.className = "glow";
    var glowInner = document.createElement("div");
    glowInner.className = "glow-inner";
    glow.appendChild(glowInner);
    document.body.appendChild(glow);
    glow.style.left = event.clientX + "px";
    glow.style.top = event.clientY + "px";
    setTimeout(function () {
        glow.remove();
    }, 900);
});


//toggle icon navbar
let menuIcon = document.querySelector("#menu-icon");
let navbar = document.querySelector('.navbar');

menuIcon.addEventListener('click', () =>{
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
});
document.querySelectorAll('.nav-item-has-dropdown > a').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
        if (window.innerWidth <= 1048) {
            e.preventDefault();
            var item = btn.closest('.nav-item');
            item.classList.toggle('open');
        }
    });
});
if (window.location.hash) {
    setTimeout(function () {
        var el = document.querySelector(window.location.hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

//scroll sections
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav .nav-item > a');
if (navLinks.length === 0) navLinks = document.querySelectorAll('header nav a');

function setActiveFromCurrentPage() {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(function (link) {
        var href = link.getAttribute('href') || '';
        var hrefPage = href.split('#')[0];
        link.classList.toggle('active', hrefPage === currentPage || (currentPage === 'index.html' && (hrefPage === 'index.html' || hrefPage === '')));
    });
}

window.onscroll = function () {
    var activatedBySection = false;
    sections.forEach(function (sec) {
        var top = window.scrollY;
        var offset = sec.offsetTop - 100;
        var height = sec.offsetHeight;
        var id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            if (id) {
                var target = document.querySelector('header nav a[href*="' + id + '"]');
                if (target) {
                    navLinks.forEach(function (link) { link.classList.remove('active'); });
                    var mainLink = target.closest && target.closest('.nav-item') && target.closest('.nav-item').querySelector(':scope > a');
                    (mainLink || target).classList.add('active');
                    activatedBySection = true;
                }
            }
            sec.classList.add('show-animate');
        } else {
            sec.classList.remove('show-animate');
        }
    });
    if (!activatedBySection) {
        setActiveFromCurrentPage();
    }
    var header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 100);
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
};

setActiveFromCurrentPage();
