document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navContainer = document.querySelector('.nav-container');

    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });

    // Logo roar sound effect with cooldown
    const logo = document.querySelector('.logo');
    const roarSound = document.getElementById('roarSound');
    let canPlaySound = true;

    logo.addEventListener('click', (e) => {
        if (canPlaySound) {
            e.preventDefault();
            roarSound.currentTime = 0;
            roarSound.play()
                .catch(error => console.log("Audio playback prevented:", error));
            
            // Visual feedback
            logo.style.transform = 'scale(1.1)';
            setTimeout(() => {
                logo.style.transform = 'scale(1)';
            }, 200);

            // Cooldown
            canPlaySound = false;
            setTimeout(() => {
                canPlaySound = true;
            }, 2000);
        }
    });

    // Navbar background change on scroll
    function updateNavBackground() {
        if (window.scrollY > 50) {
            navContainer.classList.add('scrolled');
        } else {
            navContainer.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateNavBackground);
    updateNavBackground(); // Initial check

    // Smooth Scrolling for Navigation Links
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
                navMenu.classList.remove('active');
            }
        });
    });

    // Animate Stats Counter
    function animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
            let current = 0;
            let startTime = null;

            function updateCount(timestamp) {
                if (!startTime) startTime = timestamp;
                const progress = timestamp - startTime;

                if (progress < duration) {
                    current = (progress / duration) * target;
                    stat.textContent = Math.round(current).toLocaleString();
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target.toLocaleString();
                }
            }

            requestAnimationFrame(updateCount);
        });
    }

    // Scroll Animation with Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger stats animation when stats section becomes visible
                if (entry.target.classList.contains('stats')) {
                    animateStats();
                    // Disconnect observer after animation starts
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });

    // Form Submission Handler with validation
    const contactForm = document.querySelector('.contact-form');
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic form validation
        const email = this.querySelector('#email').value;
        const name = this.querySelector('#name').value;
        const business = this.querySelector('#business').value;
        const message = this.querySelector('#message').value;

        if (!validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        if (name.length < 2) {
            alert('Please enter your name.');
            return;
        }

        if (business.length < 2) {
            alert('Please enter your business name.');
            return;
        }

        if (message.length < 10) {
            alert('Please enter a detailed message (at least 10 characters).');
            return;
        }

        // Collect form data
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => formObject[key] = value);

        // Here you would typically send the form data to your server
        console.log('Form submitted:', formObject);
        
        // Show success message
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });

    // Prevent form submission on Enter key
    contactForm.addEventListener('keypress', function(e) {
        if (e.keyCode === 13 || e.which === 13) {
            const isTextField = e.target.tagName === 'TEXTAREA';
            if (!isTextField) {
                e.preventDefault();
            }
        }
    });

    // YouTube Video Lazy Loading
    const videoIframe = document.querySelector('.video-embed iframe');
    if (videoIframe) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !videoIframe.src.includes('youtube')) {
                    videoIframe.src = videoIframe.dataset.src;
                    videoObserver.unobserve(videoIframe);
                }
            });
        }, {
            rootMargin: '50px'
        });

        videoIframe.dataset.src = videoIframe.src;
        videoIframe.removeAttribute('src');
        videoObserver.observe(videoIframe);
    }
});
