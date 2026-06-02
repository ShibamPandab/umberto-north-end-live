/**
 * Umberto's North End - Client Side Core Script
 * ------------------------------------------------
 * Includes:
 * 1. Flour Particles Canvas Simulation
 * 2. Translucent Navigation Scroll Effects
 * 3. Interactive Menu Category Filtering Tabs
 * 4. Custom Review Carousel with Swipe/Drag Support
 * 5. Lightweight Photo Lightbox Gallery
 * 6. Dynamic Local Boston Time & Operating Status Checker
 * 7. Premium Form Validations & Submissions
 * 8. Intersection Observer Animations Trigger
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. FLOUR PARTICLES CANVAS SIMULATION
    // ==========================================
    const initFlourParticles = () => {
        const canvas = document.getElementById('flour-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrameId;

        // Mouse influence coordinates
        const mouse = { x: null, y: null, radius: 100 };

        const resizeCanvas = () => {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Listen for mouse movements within the hero section
        canvas.parentElement.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        canvas.parentElement.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5; // Fine flour dust
                this.speedX = Math.random() * 0.4 - 0.2; // Slow drifting
                this.speedY = Math.random() * 0.3 + 0.1; // Slow falling
                this.opacity = Math.random() * 0.5 + 0.1;
                this.wobble = Math.random() * 2 * Math.PI;
                this.wobbleSpeed = Math.random() * 0.02 + 0.005;
            }

            update() {
                // Fall down and drift
                this.y += this.speedY;
                this.wobble += this.wobbleSpeed;
                this.x += this.speedX + Math.sin(this.wobble) * 0.15;

                // Reset particle to top if it goes off screen
                if (this.y > canvas.height) {
                    this.y = 0;
                    this.x = Math.random() * canvas.width;
                }
                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;

                // Mouse interaction physics (pushing dust aside)
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radius) {
                        const force = (mouse.radius - distance) / mouse.radius;
                        const angle = Math.atan2(dy, dx);
                        const pushX = Math.cos(angle) * force * 1.5;
                        const pushY = Math.sin(angle) * force * 1.5;

                        this.x += pushX;
                        this.y += pushY;
                    }
                }
            }

            draw() {
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Initialize particles based on screen width
        const density = Math.min(80, Math.floor(canvas.width / 15));
        for (let i = 0; i < density; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();
    };

    initFlourParticles();


    // ==========================================
    // 2. TRANSLUCENT NAVIGATION SCROLL EFFECTS
    // ==========================================
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    const handleScrollEffects = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scrollspy active indicator
        let currentSectionId = '';
        sections.forEach(sec => {
            const sectionTop = sec.offsetTop - 120;
            const sectionHeight = sec.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    };

    window.addEventListener('scroll', handleScrollEffects);
    handleScrollEffects(); // Trigger once on mount

    // Mobile burger toggle menu
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('open');
        });

        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('open');
            });
        });
    }


    // ==========================================
    // 3. INTERACTIVE MENU CATEGORY TABS
    // ==========================================
    const tabBtns = document.querySelectorAll('.menu-tab-btn');
    const menuCards = document.querySelectorAll('.menu-item-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            menuCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                
                // Reset card styling
                card.style.display = 'flex';
                
                if (category === 'all' || cardCat === category) {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 350); // Timeout matched with CSS transition duration
                }
            });
        });
    });


    // ==========================================
    // 4. CUSTOM REVIEWS CAROUSEL WITH SWIPE
    // ==========================================
    const container = document.getElementById('carousel-container');
    const slides = document.querySelectorAll('.review-slide');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    const prevBtn = document.getElementById('prev-review');
    const nextBtn = document.getElementById('next-review');
    
    if (container && slides.length > 0) {
        let activeIdx = 0;
        let autoplayTimer;
        const totalSlides = slides.length;

        const updateCarousel = (newIdx) => {
            // Remove active classes
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));

            // Safe wrapping of indices
            activeIdx = (newIdx + totalSlides) % totalSlides;
            
            // Set active states
            slides[activeIdx].classList.add('active');
            dots[activeIdx].classList.add('active');

            // Slide translation container
            container.style.transform = `translateX(-${activeIdx * 100}%)`;
        };

        const startAutoplay = () => {
            stopAutoplay();
            autoplayTimer = setInterval(() => {
                updateCarousel(activeIdx + 1);
            }, 6000); // Transition every 6s
        };

        const stopAutoplay = () => {
            if (autoplayTimer) clearInterval(autoplayTimer);
        };

        // Navigation click handlers
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                updateCarousel(activeIdx + 1);
                startAutoplay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                updateCarousel(activeIdx - 1);
                startAutoplay();
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                updateCarousel(index);
                startAutoplay();
            });
        });

        // Touch/Swipe Events Support for Mobile Devices
        let touchStartX = 0;
        let touchEndX = 0;

        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoplay();
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const threshold = 50; // minimum distance in px
            
            if (touchStartX - touchEndX > threshold) {
                // Swipe Left -> Next Slide
                updateCarousel(activeIdx + 1);
            } else if (touchEndX - touchStartX > threshold) {
                // Swipe Right -> Prev Slide
                updateCarousel(activeIdx - 1);
            }
            startAutoplay();
        }, { passive: true });

        // Start initial auto play
        startAutoplay();
    }


    // ==========================================
    // 5. LIGHTBOX PHOTO GALLERY WITH MODAL
    // ==========================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    if (galleryItems.length > 0 && lightbox) {
        let currentGalleryIdx = 0;

        const openLightbox = (idx) => {
            currentGalleryIdx = idx;
            const item = galleryItems[idx];
            const img = item.querySelector('.gallery-img');
            const caption = item.querySelector('.gallery-caption').textContent;

            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxCaption.textContent = caption;
            
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock background scroll
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        const showNextImage = () => {
            let nextIdx = (currentGalleryIdx + 1) % galleryItems.length;
            openLightbox(nextIdx);
        };

        const showPrevImage = () => {
            let prevIdx = (currentGalleryIdx - 1 + galleryItems.length) % galleryItems.length;
            openLightbox(prevIdx);
        };

        // Attach click triggers to grid items
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                openLightbox(index);
            });
        });

        // Close actions
        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // Navigation click actions
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showNextImage();
        });
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrevImage();
        });

        // Keyboard accessibility controls
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        });
    }


    // ==========================================
    // 6. LIVE STATUS INDICATOR (BOSTON LOCAL TIME)
    // ==========================================
    const checkOperatingStatus = () => {
        const statusCard = document.getElementById('live-status-card');
        const statusLabel = document.getElementById('live-status-label');
        const statusTime = document.getElementById('live-status-time');
        
        if (!statusCard || !statusLabel || !statusTime) return;

        // We calculate current local Boston Time (Eastern Time)
        // Boston is either UTC-4 (EDT) or UTC-5 (EST)
        // Let's create an accurate date object representing Boston time
        const options = {
            timeZone: 'America/New_York',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            weekday: 'long'
        };
        
        const formatter = new Intl.DateTimeFormat('en-US', options);
        const parts = formatter.formatToParts(new Date());
        
        // Extract parameters from parts
        let weekday = '';
        let hour = 0;
        let minute = 0;
        let ampm = '';

        parts.forEach(part => {
            if (part.type === 'weekday') weekday = part.value;
            if (part.type === 'hour') hour = parseInt(part.value, 10);
            if (part.type === 'minute') minute = parseInt(part.value, 10);
            if (part.type === 'dayPeriod') ampm = part.value.toUpperCase();
        });

        // Format beautiful clock text
        const displayMin = minute < 10 ? '0' + minute : minute;
        statusTime.innerHTML = `<i class="fa-regular fa-clock"></i> Boston Local Time: ${hour}:${displayMin} ${ampm} (${weekday})`;

        // Business Logic: Tuesday to Saturday, 11:00 AM to 2:30 PM (11:00 to 14:30)
        let totalMinutes = (ampm === 'PM' && hour !== 12 ? hour + 12 : (ampm === 'AM' && hour === 12 ? 0 : hour)) * 60 + minute;
        const openTimeMinutes = 11 * 60; // 11:00 AM is 660 mins
        const closeTimeMinutes = 14 * 60 + 30; // 2:30 PM is 870 mins
        
        const isOpenDay = ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].includes(weekday);
        const isOpenHour = totalMinutes >= openTimeMinutes && totalMinutes < closeTimeMinutes;

        // Reset classes
        statusCard.classList.remove('open-status', 'closed-status');

        if (isOpenDay && isOpenHour) {
            statusCard.classList.add('open-status');
            statusLabel.textContent = 'OPEN NOW - Baking Fresh Trays!';
        } else {
            statusCard.classList.add('closed-status');
            if (isOpenDay && totalMinutes >= closeTimeMinutes) {
                statusLabel.textContent = 'CLOSED NOW - Sold Out for Today';
            } else if (weekday === 'Sunday' || weekday === 'Monday') {
                statusLabel.textContent = 'CLOSED TODAY - Prepping Dough & Sauce';
            } else {
                statusLabel.textContent = 'CLOSED NOW - Opens at 11:00 AM';
            }
        }
    };

    // Run clock updates every 30 seconds
    checkOperatingStatus();
    setInterval(checkOperatingStatus, 30000);


    // ==========================================
    // 7. CONTACT FORM VALIDATIONS & ALERTS
    // ==========================================
    const form = document.getElementById('contact-form');
    const successAlert = document.getElementById('form-success');
    const closeAlertBtn = document.getElementById('btn-close-success');

    if (form && successAlert) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect Form Values & DOM Errors elements
            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const subjectInput = document.getElementById('form-subject');
            const messageInput = document.getElementById('form-message');

            const nameErr = document.getElementById('name-error');
            const emailErr = document.getElementById('email-error');
            const subjectErr = document.getElementById('subject-error');
            const messageErr = document.getElementById('message-error');

            let isValid = true;

            // Name checks
            if (nameInput.value.trim() === '') {
                nameErr.classList.add('active');
                nameInput.classList.add('is-invalid');
                isValid = false;
            } else {
                nameErr.classList.remove('active');
                nameInput.classList.remove('is-invalid');
            }

            // Email validation regex check
            const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
            if (!emailPattern.test(emailInput.value.trim())) {
                emailErr.classList.add('active');
                emailInput.classList.add('is-invalid');
                isValid = false;
            } else {
                emailErr.classList.remove('active');
                emailInput.classList.remove('is-invalid');
            }

            // Subject choice check
            if (subjectInput.value === '') {
                subjectErr.classList.add('active');
                subjectInput.classList.add('is-invalid');
                isValid = false;
            } else {
                subjectErr.classList.remove('active');
                subjectInput.classList.remove('is-invalid');
            }

            // Message check
            if (messageInput.value.trim().length < 5) {
                messageErr.classList.add('active');
                messageInput.classList.add('is-invalid');
                isValid = false;
            } else {
                messageErr.classList.remove('active');
                messageInput.classList.remove('is-invalid');
            }

            if (isValid) {
                // Simulate message transmission
                const btnSubmit = form.querySelector('.btn-submit-form');
                btnSubmit.innerHTML = 'Sending <i class="fa-solid fa-spinner fa-spin-pulse"></i>';
                btnSubmit.style.opacity = '0.7';
                btnSubmit.disabled = true;

                setTimeout(() => {
                    successAlert.classList.add('active');
                    form.reset();
                    
                    // Reset button
                    btnSubmit.innerHTML = 'Send Message <i class="fa-regular fa-paper-plane"></i>';
                    btnSubmit.style.opacity = '1';
                    btnSubmit.disabled = false;
                }, 1500);
            }
        });

        if (closeAlertBtn) {
            closeAlertBtn.addEventListener('click', () => {
                successAlert.classList.remove('active');
            });
        }
    }


    // ==========================================
    // 8. INTERSECTION OBSERVER ANIMATIONS
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const observerOptions = {
            root: null,
            threshold: 0.15, // trigger when 15% is visible
            rootMargin: '0px 0px -50px 0px' // offset for bottom frame
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    obs.unobserve(entry.target); // Trigger only once
                }
            });
        }, observerOptions);

        revealElements.forEach(el => {
            observer.observe(el);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => {
            el.classList.add('revealed');
        });
    }

    // ==========================================
    // 9. PREMIUM LUXURY CUSTOM CURSOR SIMULATION
    // ==========================================
    const initCustomCursor = () => {
        // Dynamic touch device capability detection
        const isTouchDevice = () => {
            return ('ontouchstart' in window) || 
                   (navigator.maxTouchPoints > 0) || 
                   (navigator.msMaxTouchPoints > 0) ||
                   (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
        };

        if (isTouchDevice()) {
            return; // Exit silently on touch devices, keeping standard browser cursor
        }

        // Active class added to body so CSS knows to hide default cursor
        document.body.classList.add('custom-cursor-active');

        // Create and append cursor element
        const cursorEl = document.createElement('div');
        cursorEl.className = 'custom-cursor';
        document.body.appendChild(cursorEl);

        // Coordinates & interpolation variables
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        let vx = 0;
        let vy = 0;
        let hasMoved = false;

        // Tuning parameters for the physical spring-like interpolation
        const stiffness = 0.08; // spring coefficient: lower is looser/slower, higher is stiffer
        const damping = 0.78;   // friction coefficient: lower is more bouncy, higher is more sluggish

        // Track target mouse position
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!hasMoved) {
                hasMoved = true;
                currentX = mouseX;
                currentY = mouseY;
                cursorEl.style.opacity = '1';
            }
        });

        // Handle viewport hover states (fade in / out dynamically)
        document.addEventListener('mouseleave', () => {
            cursorEl.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            if (hasMoved) {
                cursorEl.style.opacity = '1';
            }
        });

        // Animation update loop with spring physics
        const updatePhysicsLoop = () => {
            if (hasMoved) {
                // Spring force calculation: acceleration = (target - current) * stiffness
                const ax = (mouseX - currentX) * stiffness;
                const ay = (mouseY - currentY) * stiffness;

                // Update velocity: velocity += acceleration
                vx += ax;
                vy += ay;

                // Apply damping/friction
                vx *= damping;
                vy *= damping;

                // Update current position
                currentX += vx;
                currentY += vy;

                // Apply dynamic styles using hardware-accelerated 3D transforms
                cursorEl.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
            }

            requestAnimationFrame(updatePhysicsLoop);
        };

        // Start the physics loop
        requestAnimationFrame(updatePhysicsLoop);

        // Hover effect selectors
        const hoverSelector = [
            'a',
            'button',
            '.btn',
            '.menu-item-card',
            '.review-card',
            '.gallery-item',
            '.menu-item-img',
            '.gallery-img',
            '.board-img',
            '.story-img',
            '.custom-vector-map',
            '.map-pin-pulse',
            '.dot',
            '.live-status-card',
            'input',
            'textarea',
            'select'
        ].join(', ');

        // Efficient Event Delegation to handle hover expansions
        document.addEventListener('mouseover', (e) => {
            const target = e.target;
            if (target && target.closest(hoverSelector)) {
                cursorEl.classList.add('hovering');
            }
        });

        document.addEventListener('mouseout', (e) => {
            const target = e.target;
            const relatedTarget = e.relatedTarget;
            
            const wasHovered = target && target.closest(hoverSelector);
            const stillHovered = relatedTarget && relatedTarget.closest(hoverSelector);

            if (wasHovered && !stillHovered) {
                cursorEl.classList.remove('hovering');
            }
        });
    };

    initCustomCursor();
});

