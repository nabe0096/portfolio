document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        easing: 'ease-in-out'
    });

    // スムーススクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Enhanced hero background image switching
    const heroBgImages = document.querySelectorAll('.hero-bg-image');
    let currentImageIndex = 0;

    function changeHeroBackground() {
        if (heroBgImages.length <= 1) return;
        
        // Remove active class from current image
        heroBgImages[currentImageIndex].classList.remove('active');
        
        // Move to next image
        currentImageIndex = (currentImageIndex + 1) % heroBgImages.length;
        
        // Add active class to new image
        heroBgImages[currentImageIndex].classList.add('active');
    }

    // Initialize first image
    if (heroBgImages.length > 0) {
        heroBgImages[0].classList.add('active');
        
        // Start slideshow if multiple images
        if (heroBgImages.length > 1) {
            setInterval(changeHeroBackground, 4000);
        }
    }

    // Enhanced counter animation
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetCount = +target.dataset.target;
                const duration = 2000; // 2 seconds
                const startTime = performance.now();
                
                const animateCounter = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing function for smooth animation
                    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                    const currentCount = Math.floor(targetCount * easeOutQuart);
                    
                    target.innerText = currentCount.toLocaleString();
                    
                    if (progress < 1) {
                        requestAnimationFrame(animateCounter);
                    } else {
                        target.innerText = targetCount.toLocaleString();
                    }
                };
                
                requestAnimationFrame(animateCounter);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.counter').forEach(counter => {
        counterObserver.observe(counter);
    });

    // Enhanced scroll effects
    const navbar = document.querySelector('.navbar');
    const backToTopBtn = document.getElementById('back-to-top');
    
    const updateNavbar = () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    };
    
    // Update active navigation link
    const updateActiveNavLink = () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    };
    
    const updateBackToTopButton = () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    };
    
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Enhanced scroll event with throttling
    let ticking = false;
    
    const onScroll = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateNavbar();
                updateBackToTopButton();
                ticking = false;
            });
            ticking = true;
        }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Initialize scroll position
    updateNavbar();
    updateBackToTopButton();
    
    // Enhanced loading state
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // Image Lightbox
    const lightbox = document.getElementById('image-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('.image-lightbox-img');
        const lightboxClose = lightbox.querySelector('.image-lightbox-close');
        const lightboxContent = lightbox.querySelector('.image-lightbox-content');

        const openLightbox = (src, alt) => {
            lightboxImg.src = src;
            lightboxImg.alt = alt || '';
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        document.querySelectorAll('.service-image-wrap').forEach(wrap => {
            wrap.addEventListener('click', () => {
                const img = wrap.querySelector('img');
                if (img) openLightbox(img.src, img.alt);
            });
        });

        lightbox.addEventListener('click', (e) => {
            if (!lightboxContent.contains(e.target) || e.target === lightboxClose) {
                closeLightbox();
            }
        });

        lightboxClose.addEventListener('click', closeLightbox);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    // Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    // Only activate on non-touch devices
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows immediately
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with delay (using animate for smooth trailing)
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Add hover effect for links and buttons
        const interactiveElements = document.querySelectorAll('a, button, .service-item, .achievement-item, input, textarea');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('hovering');
            });
            
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('hovering');
            });
        });
    }
});