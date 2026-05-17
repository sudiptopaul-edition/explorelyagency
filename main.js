document.addEventListener('DOMContentLoaded', () => {
    // 0. False Preloader Logic
    const preloader = document.getElementById('preloader');
    
    if (preloader) {
        // Block user scrolling immediately
        document.body.classList.add('loading-active');
        
        // Exact 2-second false preload duration
        setTimeout(() => {
            preloader.classList.add('fade-out');
            
            // Enable scrolling and trigger entrance animations
            document.body.classList.remove('loading-active');
            document.body.classList.add('body-loaded');
            
            // Clean up preloader display after transition (1.2s)
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 1200);
        }, 2000); // Exactly 2 seconds
    }

    // 1. Scroll-triggered Navbar Color
    const navbar = document.querySelector('.sticky-nav');
    const sections = document.querySelectorAll('section, .footer-wrapper');
    
    if (navbar) {
        const handleScroll = () => {
            let currentTheme = 'dark';
            const navRect = navbar.getBoundingClientRect();
            const navCenter = navRect.top + navRect.height / 2;

            sections.forEach(sec => {
                const rect = sec.getBoundingClientRect();
                if (rect.top <= navCenter && rect.bottom >= navCenter) {
                    if (sec.classList.contains('about-section') || 
                        sec.classList.contains('tour-details-section') || 
                        sec.classList.contains('tour-doc-section') || 
                        sec.classList.contains('testimonials-page-section') || 
                        sec.classList.contains('how-to-book-section') ||
                        sec.classList.contains('booking-form-section')) {
                        currentTheme = 'light';
                    }
                }
            });

            // Check if the navbar overlaps with the white package card
            const whiteCards = document.querySelectorAll('.card-white');
            whiteCards.forEach(card => {
                const rect = card.getBoundingClientRect();
                if (rect.top <= navCenter && rect.bottom >= navCenter) {
                    currentTheme = 'light';
                }
            });

            if (currentTheme === 'light') {
                navbar.classList.add('nav-theme-light');
            } else {
                navbar.classList.remove('nav-theme-light');
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // init
    }

    // 2. Parallax Entry Fade-Ins & Staggered Reveal
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                entry.target.classList.add('visible'); // For stagger-reveal
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-on-scroll, .stagger-reveal');
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Ensure stagger-reveal has span wrapper
    document.querySelectorAll('.stagger-reveal').forEach(el => {
        if (!el.querySelector('span:not(.script-accent)')) {
             if(el.children.length === 0) {
                const text = el.innerText;
                el.innerHTML = `<span>${text}</span>`;
             }
        }
    });

    // Hero Hover Logic
    const heroCards = document.querySelectorAll('.h-card');
    const heroBgImgs = document.querySelectorAll('.hero-bg-img');
    
    // Initialize hero bg image opacities based on current active-card on page load
    const initialActiveCard = document.querySelector('.h-card.active-card');
    if (initialActiveCard && heroBgImgs.length > 0) {
        const initialIndex = Array.from(heroCards).indexOf(initialActiveCard);
        heroBgImgs.forEach((img, i) => {
            img.style.opacity = i <= initialIndex ? '1' : '0';
        });
    }

    if (heroCards.length > 0 && heroBgImgs.length > 0) {
        heroCards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                heroCards.forEach(c => c.classList.remove('active-card'));
                card.classList.add('active-card');
                
                // Update background image opacities (L->R soft fade-in, R->L soft fade-out)
                heroBgImgs.forEach((img, i) => {
                    if (i <= index) {
                        img.style.opacity = '1';
                    } else {
                        img.style.opacity = '0';
                    }
                });
            });
        });
    }

    // Tour Doc Slider Logic
    const docCenter = document.querySelector('.doc-col-center');
    if (docCenter) {
        const slides = [
            { img: 'hero-image.png', subtitle: 'Jeep Adventure', title: 'Cherrapunji Hills' },
            { img: 'living-root-bridge.jpg', subtitle: 'Living Root Bridge', title: 'Nongriat Trek' },
            { img: 'nohkalikai-falls.jpg', subtitle: 'Waterfall Chase', title: 'Nohkalikai Falls' },
            { img: 'laitlum-grandeur.jpg', subtitle: 'Canyon Views', title: 'Laitlum Grandeur' }
        ];
        let currentSlide = 0;
        
        const imgEl = docCenter.querySelector('img');
        const subtitleEl = docCenter.querySelector('.overlay-text span');
        const titleEl = docCenter.querySelector('.overlay-text h4');
        const prevBtn = docCenter.querySelector('.ctrl-btn:first-child');
        const nextBtn = docCenter.querySelector('.ctrl-btn:last-child');
        
        const updateSlide = () => {
            imgEl.style.opacity = '0.5';
            setTimeout(() => {
                imgEl.src = slides[currentSlide].img;
                subtitleEl.textContent = slides[currentSlide].subtitle;
                titleEl.textContent = slides[currentSlide].title;
                imgEl.style.opacity = '1';
            }, 150);
        };
        if (imgEl) imgEl.style.transition = 'opacity 0.15s ease';
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                updateSlide();
            });
            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % slides.length;
                updateSlide();
            });
        }
    }

    // 3. Horizontal Slider Controls & Progress
    const slider = document.querySelector('.horizontal-slider-viewport');
    const progressBar = document.querySelector('.progress-fill-active');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (slider && progressBar) {
        const updateProgress = () => {
            const scrollLeft = slider.scrollLeft;
            const scrollWidth = slider.scrollWidth - slider.clientWidth;
            if (scrollWidth > 0) {
                const scrollPercent = (scrollLeft / scrollWidth);
                const currentWidth = 35 + (scrollPercent * 65); // 35% base to 100% max
                progressBar.style.width = `${Math.min(100, Math.max(35, currentWidth))}%`;
            }
        };

        slider.addEventListener('scroll', updateProgress);
        updateProgress();

        if (prevBtn && nextBtn) {
            const scrollAmount = 450; // Approximate scroll increment
            
            nextBtn.addEventListener('click', () => {
                slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });

            prevBtn.addEventListener('click', () => {
                slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
        }
    }

    // 4. Segment Filter Pill Logic & Cross-fading
    const filterPills = document.querySelectorAll('.filter-pill');
    const sliderTrack = document.querySelector('.horizontal-slider-track');
    
    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            if(pill.classList.contains('active')) return;

            // Remove active from all
            filterPills.forEach(p => p.classList.remove('active'));
            // Add to clicked
            pill.classList.add('active');
            
            // Cross-fade animation effect
            if (sliderTrack) {
                sliderTrack.classList.add('switching');
                setTimeout(() => {
                    // Logic to swap items would go here in a real app
                    sliderTrack.classList.remove('switching');
                }, 400); // Wait for fade out
            }
        });
    });

    // 5. Lightweight Parallax Scroll Engine
    const parallaxElements = document.querySelectorAll('.parallax');
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', () => {
            requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                parallaxElements.forEach(el => {
                    const speed = el.getAttribute('data-speed') || 0.05;
                    const yPos = scrolled * speed;
                    el.style.transform = `translateY(${yPos}px)`;
                });
            });
        });
    }

    // 6. Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navContainer = document.querySelector('.nav-container');

    if (mobileToggle && navContainer) {
        mobileToggle.addEventListener('click', () => {
            navContainer.classList.toggle('mobile-open');
        });
    }

    // 7. Toast Notification System
    const showToast = (message) => {
        const toast = document.createElement('div');
        toast.className = 'custom-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // Footer Subscribe Notification
    const subscribeBtn = document.querySelector('.footer-subscribe button');
    const subscribeInput = document.querySelector('.footer-subscribe input');
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (subscribeInput.value.trim() !== '') {
                showToast('Our team will connect with you soon');
                subscribeInput.value = '';
            } else {
                showToast('Please enter an email address');
            }
        });
    }

    // Booking Form Submission
    const bookingForm = document.querySelector('#booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Your data is recorded');
            bookingForm.reset();
        });
    }
});
