document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('[data-header]');
    const nav = document.querySelector('[data-nav]');
    const navToggle = document.querySelector('[data-nav-toggle]');
    const backToTop = document.getElementById('back-to-top');
    const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
    const sections = [...document.querySelectorAll('main section[id]')];

    const closeNav = () => {
        if (!nav || !navToggle) return;
        nav.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
    };

    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('is-open');
            navToggle.classList.toggle('is-open', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            const target = targetId ? document.querySelector(targetId) : null;

            if (!target) return;

            event.preventDefault();
            closeNav();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    const updateChrome = () => {
        const currentY = window.scrollY;
        header?.classList.toggle('is-scrolled', currentY > 40);
        backToTop?.classList.toggle('is-visible', currentY > 650);

        let currentSection = '';
        sections.forEach((section) => {
            const top = section.offsetTop - 180;
            const bottom = top + section.offsetHeight;
            if (currentY >= top && currentY < bottom) {
                currentSection = section.id;
            }
        });

        navLinks.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${currentSection}`);
        });
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        window.requestAnimationFrame(() => {
            updateChrome();
            ticking = false;
        });
        ticking = true;
    }, { passive: true });

    backToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        });
    }, {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.12
    });

    document.querySelectorAll('.reveal').forEach((element) => {
        revealObserver.observe(element);
    });

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const counter = entry.target;
            const target = Number(counter.dataset.target || 0);
            const duration = 1600;
            const start = performance.now();

            const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 4);
                counter.textContent = Math.floor(target * eased).toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };

            requestAnimationFrame(tick);
            counterObserver.unobserve(counter);
        });
    }, {
        threshold: 0.35
    });

    document.querySelectorAll('.counter').forEach((counter) => {
        counterObserver.observe(counter);
    });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const setupAutoCarousel = (carousel, track) => {
        if (!carousel || !track || prefersReducedMotion) return;

        let resumeTimer;
        let isPaused = false;
        let lastFrameTime = 0;
        let autoScrollLeft = track.scrollLeft;
        const scrollSpeed = 18;

        const stepAutoScroll = (timestamp) => {
            if (!lastFrameTime) lastFrameTime = timestamp;

            const elapsed = timestamp - lastFrameTime;
            lastFrameTime = timestamp;

            const maxScrollLeft = track.scrollWidth - track.clientWidth;

            if (!isPaused && maxScrollLeft > 8) {
                autoScrollLeft += (elapsed / 1000) * scrollSpeed;

                if (autoScrollLeft >= maxScrollLeft - 1) {
                    autoScrollLeft = 0;
                }

                track.scrollLeft = autoScrollLeft;
            }

            requestAnimationFrame(stepAutoScroll);
        };

        const pauseAutoScroll = () => {
            isPaused = true;
            autoScrollLeft = track.scrollLeft;
            window.clearTimeout(resumeTimer);
        };

        const resumeAutoScroll = () => {
            autoScrollLeft = track.scrollLeft;
            isPaused = false;
            window.clearTimeout(resumeTimer);
        };

        const pauseAutoScrollBriefly = () => {
            pauseAutoScroll();
            resumeTimer = window.setTimeout(() => {
                resumeAutoScroll();
            }, 1200);
        };

        carousel.addEventListener('mouseenter', pauseAutoScroll);
        carousel.addEventListener('mouseleave', resumeAutoScroll);
        carousel.addEventListener('focusin', pauseAutoScroll);
        carousel.addEventListener('focusout', resumeAutoScroll);
        track.addEventListener('touchstart', pauseAutoScroll, { passive: true });
        track.addEventListener('touchend', () => {
            autoScrollLeft = track.scrollLeft;
            resumeTimer = window.setTimeout(resumeAutoScroll, 2500);
        }, { passive: true });
        track.addEventListener('touchcancel', () => {
            autoScrollLeft = track.scrollLeft;
            resumeTimer = window.setTimeout(resumeAutoScroll, 2500);
        }, { passive: true });
        track.addEventListener('wheel', pauseAutoScrollBriefly, { passive: true });

        requestAnimationFrame(stepAutoScroll);
    };

    document.querySelectorAll('[data-auto-carousel]').forEach((carousel) => {
        setupAutoCarousel(carousel, carousel.querySelector('[data-auto-track]'));
    });

    setupAutoCarousel(
        document.querySelector('[data-reel-carousel]'),
        document.querySelector('[data-reel-track]')
    );

    updateChrome();
});
