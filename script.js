(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    function initNavScroll() {
        var nav = document.querySelector('nav.navbar');
        if (!nav) return;
        var onScroll = function () {
            nav.classList.toggle('nav-scrolled', window.scrollY > 40);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    function initActiveNavLink() {
        var links = document.querySelectorAll('nav.navbar .nav-link');
        var current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
        links.forEach(function (link) {
            var href = (link.getAttribute('href') || '').toLowerCase();
            if (href === current || (current === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    function initScrollProgress() {
        var bar = document.createElement('div');
        bar.className = 'scroll-progress';
        var inner = document.createElement('div');
        inner.className = 'scroll-progress-bar';
        bar.appendChild(inner);
        document.body.appendChild(bar);
        var onScroll = function () {
            var h = document.documentElement;
            var scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
            inner.style.transform = 'scaleX(' + Math.min(Math.max(scrolled, 0), 1) + ')';
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    function initBackToTop() {
        var btn = document.createElement('button');
        btn.className = 'back-to-top';
        btn.setAttribute('aria-label', 'Back to top');
        btn.innerHTML = '<i class="bi bi-arrow-up"></i>';
        document.body.appendChild(btn);
        var onScroll = function () {
            btn.classList.toggle('visible', window.scrollY > 500);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
        onScroll();
    }

    function initHeroEntrance() {
        var hero = document.querySelector('[data-hero]');
        if (!hero || typeof gsap === 'undefined') return;
        var targets = hero.querySelectorAll('[data-hero-item]');
        if (reduceMotion) {
            targets.forEach(function (el) { el.style.opacity = 1; });
            return;
        }
        gsap.set(targets, { opacity: 0, y: 24 });
        gsap.to(targets, {
            opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out', delay: 0.15
        });
    }

    function initAOS() {
        if (typeof AOS === 'undefined') return;
        AOS.init({
            duration: 700,
            easing: 'ease-out-cubic',
            once: true,
            offset: 60,
            disable: function () { return reduceMotion; }
        });
    }

    function initTiltCards() {
        if (isTouch || reduceMotion) return;
        document.querySelectorAll('.project-card').forEach(function (card) {
            var rect;
            card.addEventListener('mouseenter', function () { rect = card.getBoundingClientRect(); });
            card.addEventListener('mousemove', function (e) {
                if (!rect) rect = card.getBoundingClientRect();
                var px = (e.clientX - rect.left) / rect.width - 0.5;
                var py = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = 'translateY(-6px) rotateX(' + (py * -6) + 'deg) rotateY(' + (px * 8) + 'deg)';
            });
            card.addEventListener('mouseleave', function () { card.style.transform = ''; });
        });
    }

    function initCustomCursor() {
        if (isTouch || reduceMotion) return;
        var dot = document.createElement('div');
        dot.className = 'cursor-dot';
        var ring = document.createElement('div');
        ring.className = 'cursor-ring';
        document.body.appendChild(dot);
        document.body.appendChild(ring);
        document.body.classList.add('has-custom-cursor');
        var rx = 0, ry = 0, x = 0, y = 0;
        window.addEventListener('mousemove', function (e) {
            x = e.clientX; y = e.clientY;
            dot.style.transform = 'translate(' + x + 'px,' + y + 'px)';
        });
        (function loop() {
            rx += (x - rx) * 0.18;
            ry += (y - ry) * 0.18;
            ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
            requestAnimationFrame(loop);
        })();
        document.querySelectorAll('a, button, .icon-hover, .project-card').forEach(function (el) {
            el.addEventListener('mouseenter', function () { ring.classList.add('cursor-hover'); });
            el.addEventListener('mouseleave', function () { ring.classList.remove('cursor-hover'); });
        });
    }

    function initMagneticButtons() {
        if (isTouch || reduceMotion || typeof gsap === 'undefined') return;
        document.querySelectorAll('.icon-row .btn').forEach(function (btn) {
            var xTo = gsap.quickTo(btn, 'x', { duration: 0.3, ease: 'power3' });
            var yTo = gsap.quickTo(btn, 'y', { duration: 0.3, ease: 'power3' });
            btn.addEventListener('mousemove', function (e) {
                var r = btn.getBoundingClientRect();
                xTo((e.clientX - r.left - r.width / 2) * 0.35);
                yTo((e.clientY - r.top - r.height / 2) * 0.35);
            });
            btn.addEventListener('mouseleave', function () { xTo(0); yTo(0); });
        });
    }

    function initHeroParticles() {
        var canvas = document.getElementById('hero-particles');
        if (!canvas || reduceMotion || window.innerWidth < 480) return;
        var ctx = canvas.getContext('2d');
        var particles = [];
        function resize() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
        function spawn() {
            particles = Array.from({ length: 28 }, function () {
                return {
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    r: Math.random() * 1.6 + 0.4,
                    speed: Math.random() * 0.4 + 0.15,
                    drift: Math.random() * 0.6 - 0.3
                };
            });
        }
        function frame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(174,50,50,0.55)';
            particles.forEach(function (p) {
                p.y -= p.speed;
                p.x += p.drift;
                if (p.y < 0) {
                    p.y = canvas.height;
                    p.x = Math.random() * canvas.width;
                }
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            });
            requestAnimationFrame(frame);
        }
        resize();
        spawn();
        frame();
        window.addEventListener('resize', function () {
            resize();
            spawn();
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initNavScroll();
        initActiveNavLink();
        initScrollProgress();
        initBackToTop();
        initHeroEntrance();
        initAOS();
        initTiltCards();
        initCustomCursor();
        initMagneticButtons();
        initHeroParticles();
    });
})();
