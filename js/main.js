document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navContainer = document.querySelector('.nav-container');
    const soundButton = document.querySelector('.sound-button');
    const roarSound = document.getElementById('roarSound');
    let canPlaySound = true;

    // Preload the roar sound if it exists
    if (roarSound) {
        roarSound.load();
    }

    // Sound handling
    function playRoar() {
        if (roarSound && canPlaySound) {
            roarSound.currentTime = 0;
            const playPromise = roarSound.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        // Visual feedback
                        soundButton.classList.add('active');
                        setTimeout(() => {
                            soundButton.classList.remove('active');
                        }, 200);

                        // Cooldown
                        canPlaySound = false;
                        setTimeout(() => {
                            canPlaySound = true;
                        }, 2000);
                    })
                    .catch(error => {
                        console.log("Audio playback prevented:", error);
                    });
            }
        }
    }

    // Sound button click handler
    if (soundButton) {
        soundButton.addEventListener('click', (e) => {
            e.preventDefault();
            playRoar();
        });
    }

    // Mobile Menu Toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Change icon
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            navMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu) {
                    navMenu.classList.remove('active');
                    const icon = mobileMenuBtn.querySelector('i');
                    if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-times');
                    }
                }
            }
        });
    });

    // Stats Counter Animation
    function animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const startTime = performance.now();
            const duration = 2000; // 2 seconds
            
            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                const easeOutQuad = progress * (2 - progress);
                const current = Math.round(easeOutQuad * target);
                
                stat.textContent = current.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }
            
            requestAnimationFrame(update);
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger stats animation only once when stats section is visible
                if (entry.target.classList.contains('stats') && 
                    !entry.target.classList.contains('animated')) {
                    animateStats();
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });

    // Form Handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form validation
            const email = this.querySelector('#email').value;
            const name = this.querySelector('#name').value;
            const business = this.querySelector('#business').value;
            const message = this.querySelector('#message').value;

            // Simple email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }

            // Length validations
            if (name.length < 2) {
                alert('Please enter your name');
                return;
            }

            if (business.length < 2) {
                alert('Please enter your business name');
                return;
            }

            if (message.length < 10) {
                alert('Please enter a detailed message (minimum 10 characters)');
                return;
            }

            // Collect form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => formObject[key] = value);

            // Here you would typically send the form data to your server
            console.log('Form data:', formObject);
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }

    // YouTube Video Lazy Loading
    const videoIframe = document.querySelector('.video-embed iframe');
    if (videoIframe && videoIframe.dataset.src) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    videoIframe.src = videoIframe.dataset.src;
                    videoObserver.unobserve(videoIframe);
                }
            });
        }, {
            rootMargin: '50px'
        });

        videoObserver.observe(videoIframe);
    }

    // Background Parallax Effect
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateBackgroundPosition() {
        const hero = document.querySelector('.hero');
        if (hero) {
            const speed = 0.5;
            const yPos = -(lastScrollY * speed);
            hero.style.backgroundPosition = `center ${yPos}px`;
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateBackgroundPosition();
                ticking = false;
            });
            ticking = true;
        }
    });
});