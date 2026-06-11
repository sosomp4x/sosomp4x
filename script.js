document.addEventListener('DOMContentLoaded', () => {

    /* --- Hero Video Autoplay Fallback --- */
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        // Ensure attributes are set (some browsers need this via JS)
        heroVideo.muted = true;
        heroVideo.playsInline = true;
        heroVideo.setAttribute('playsinline', '');
        heroVideo.setAttribute('webkit-playsinline', '');

        // Attempt to play immediately
        const tryPlay = () => {
            const playPromise = heroVideo.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {});
            }
        };

        tryPlay();

        // Retry on window load (video may not be ready yet)
        window.addEventListener('load', tryPlay);

        // Last resort: play on first user interaction
        const playOnInteraction = () => {
            tryPlay();
            document.removeEventListener('click', playOnInteraction);
            document.removeEventListener('touchstart', playOnInteraction);
            document.removeEventListener('scroll', playOnInteraction);
        };
        document.addEventListener('click', playOnInteraction);
        document.addEventListener('touchstart', playOnInteraction);
        document.addEventListener('scroll', playOnInteraction);
    }

    /* --- Custom Cursor --- */
    const cursor = document.getElementById('custom-cursor');
    const follower = document.getElementById('custom-cursor-follower');
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    if (cursor && follower) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        });

        function animateFollower() {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        const hoverElements = document.querySelectorAll('a, button, .pro-thumbnail, .skill-card, .stat-row, [data-cursor="hover"]');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.classList.add('hover-state');
                cursor.classList.add('hover-state');
            });
            el.addEventListener('mouseleave', () => {
                follower.classList.remove('hover-state');
                cursor.classList.remove('hover-state');
            });
        });
    }

    /* --- Sticky Header & Back To Top --- */
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Back To Top logic
        if (backToTop) {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    });
    
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* --- Smooth Scrolling for Nav Links --- */
    const navLinks = document.querySelectorAll('.nav-links a.nav-item, a[href^="#"].portfolio-btn, a[href^="#"].pill-btn');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });

    /* --- Intersection Observer for Sections (Nav Active State) --- */
    const sections = document.querySelectorAll('section');
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.2 });

    sections.forEach(section => scrollObserver.observe(section));

    /* --- Intersection Observer for Reveal Animations --- */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    document.querySelectorAll('.reveal-elem').forEach((el) => {
        revealObserver.observe(el);
    });


    /* --- Copy Email to Clipboard --- */
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const emailToast = document.getElementById('emailToast');

    if (copyEmailBtn && emailToast) {
        copyEmailBtn.addEventListener('click', () => {
            navigator.clipboard.writeText('sosomp4x@gmail.com').then(() => {
                emailToast.classList.add('show');
                setTimeout(() => {
                    emailToast.classList.remove('show');
                }, 2000);
            });
        });
    }

    /* --- 3D Shorts Carousels (Supports Multiple Instances) --- */
    const carousels = document.querySelectorAll('.carousel-wrapper');
    carousels.forEach(wrapper => {
        const track = wrapper.querySelector('.shorts-carousel-track');
        const slides = Array.from(wrapper.querySelectorAll('.carousel-slide'));
        const prevBtn = wrapper.querySelector('.prev-btn');
        const nextBtn = wrapper.querySelector('.next-btn');

        if (track && slides.length > 0) {
            let currentIndex = 0;
            const totalSlides = slides.length;

            function updateCarousel() {
                slides.forEach((slide, i) => {
                    slide.classList.remove('active', 'left', 'right', 'far-left', 'far-right');
                    
                    let diff = i - currentIndex;
                    
                    // Modulo math for infinite looping positions
                    if (diff < -1) diff += totalSlides;
                    if (diff > totalSlides - 2) diff -= totalSlides;
                    
                    if (diff === 0) {
                        slide.classList.add('active');
                    } else if (diff === 1) {
                        slide.classList.add('right');
                    } else if (diff === -1) {
                        slide.classList.add('left');
                    } else if (diff > 1) {
                        slide.classList.add('far-right');
                    } else if (diff < -1) {
                        slide.classList.add('far-left');
                    }

                    // Auto-pause local HTML5 videos for inactive slides
                    if (diff !== 0) {
                        const video = slide.querySelector('video');
                        if (video) {
                            video.pause();
                        }
                    }
                });
            }

            // Initialize
            updateCarousel();

            // Arrow Navigation
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                    updateCarousel();
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    currentIndex = (currentIndex + 1) % totalSlides;
                    updateCarousel();
                });
            }

            // Click on side slides to jump to them
            slides.forEach((slide, i) => {
                slide.addEventListener('click', (e) => {
                    if (i !== currentIndex) {
                        // Prevent activating video/iframe controls on side slides
                        e.preventDefault();
                        currentIndex = i;
                        updateCarousel();
                    }
                });
            });

            // Swipe / Drag Support
            let startX = 0;
            let isDragging = false;

            const handleDragStart = (e) => {
                startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
                isDragging = true;
            };

            const handleDragEnd = (e) => {
                if (!isDragging) return;
                const endX = e.type.includes('touch') ? e.changedTouches[0].clientX : e.clientX;
                const diffX = endX - startX;

                if (Math.abs(diffX) > 50) { // Threshold for swipe
                    if (diffX > 0) {
                        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                    } else {
                        currentIndex = (currentIndex + 1) % totalSlides;
                    }
                    updateCarousel();
                }
                isDragging = false;
            };

            // Attach event listeners for mouse drag and mobile touch
            track.addEventListener('mousedown', handleDragStart);
            track.addEventListener('mouseup', handleDragEnd);
            track.addEventListener('mouseleave', () => { isDragging = false; });
            
            track.addEventListener('touchstart', handleDragStart, { passive: true });
            track.addEventListener('touchend', handleDragEnd, { passive: true });
        }
    });

    /* --- Minimalist Background Particles --- */
    const particlesContainer = document.createElement('div');
    particlesContainer.id = 'particles-container';
    document.body.appendChild(particlesContainer);

    const particleCount = 45;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size between 1.5px and 3.5px
        const size = Math.random() * 2 + 1.5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random horizontal position
        particle.style.left = `${Math.random() * 100}vw`;
        
        // Random initial vertical position spread
        particle.style.top = `${Math.random() * 100}vh`;
        
        // Random opacity between 0.15 and 0.5
        particle.style.opacity = Math.random() * 0.35 + 0.15;
        
        // Random animation duration between 8s and 15s
        const duration = Math.random() * 7 + 8;
        particle.style.animationDuration = `${duration}s`;
        
        // Negative delay so they are already scattered at start
        particle.style.animationDelay = `${Math.random() * -15}s`;
        
        particlesContainer.appendChild(particle);
    }

    // Scroll listener to toggle visibility of particles (only from About Me section onwards)
    const toggleParticles = () => {
        if (window.scrollY > window.innerHeight * 0.4) {
            particlesContainer.classList.add('visible');
        } else {
            particlesContainer.classList.remove('visible');
        }
    };
    window.addEventListener('scroll', toggleParticles);
    toggleParticles(); // Check initial state

});
