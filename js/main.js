/**
 * IMRC - Main JavaScript
 * Version: 2.0 - Enhanced with modern interactions
 */

// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile navigation
    initMobileNav();
    
    // Initialize any interactive elements
    initInteractiveElements();
    
    // Initialize 3D card effects
    init3DCards();
    
    // Initialize scroll reveal effects that aren't handled by GSAP
    initScrollReveal();
});

/**
 * Mobile Navigation Toggle with advanced animations
 */
function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            
            // If GSAP is available, use it for smoother animations
            if (window.gsap) {
                if (navMenu.classList.contains('active')) {
                    // Close menu with GSAP
                    gsap.to(navMenu, {
                        x: '100%',
                        opacity: 0,
                        duration: 0.3,
                        ease: 'power2.inOut',
                        onComplete: () => {
                            navMenu.classList.remove('active');
                        }
                    });
                } else {
                    // First set initial state
                    gsap.set(navMenu, {
                        x: '100%',
                        opacity: 0
                    });
                    
                    // Then add active class and animate in
                    navMenu.classList.add('active');
                    gsap.to(navMenu, {
                        x: '0%',
                        opacity: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
                
                // Toggle the hamburger icon with GSAP
                const spans = navToggle.querySelectorAll('span');
                if (navToggle.classList.contains('active')) {
                    gsap.to(spans[0], {
                        rotation: 45,
                        y: 6,
                        duration: 0.3
                    });
                    gsap.to(spans[1], {
                        opacity: 0,
                        duration: 0.3
                    });
                    gsap.to(spans[2], {
                        rotation: -45,
                        y: -6,
                        duration: 0.3
                    });
                } else {
                    gsap.to(spans, {
                        rotation: 0,
                        y: 0,
                        opacity: 1,
                        duration: 0.3
                    });
                }
            } else {
                // Fallback to CSS transitions
                navMenu.classList.toggle('active');
                
                // Toggle the hamburger icon
                const spans = navToggle.querySelectorAll('span');
                if (navToggle.classList.contains('active')) {
                    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                    spans[1].style.opacity = '0';
                    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
                } else {
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        });
    }
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(event.target) && 
            !navToggle.contains(event.target)) {
            
            if (window.gsap) {
                // Close with GSAP animation
                gsap.to(navMenu, {
                    x: '100%',
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        navMenu.classList.remove('active');
                        navToggle.classList.remove('active');
                        
                        // Reset toggle icon
                        const spans = navToggle.querySelectorAll('span');
                        gsap.to(spans, {
                            rotation: 0,
                            y: 0,
                            opacity: 1,
                            duration: 0.3
                        });
                    }
                });
            } else {
                // Fallback to regular toggle
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        }
    });
    
    // Close mobile nav when window is resized above mobile breakpoint
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            
            if (window.gsap) {
                // Reset with GSAP
                gsap.set(navMenu, {
                    x: '0%',
                    opacity: 1
                });
                
                // Reset toggle icon
                const spans = navToggle.querySelectorAll('span');
                gsap.to(spans, {
                    rotation: 0,
                    y: 0,
                    opacity: 1,
                    duration: 0.3
                });
            } else {
                // Regular reset
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        }
    });
}

/**
 * Interactive Elements
 */
function initInteractiveElements() {
    // Add contact form validation if on contact page
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
            let valid = true;
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            
            if (!name.value.trim()) {
                valid = false;
                name.classList.add('error');
                showErrorMessage(name);
            } else {
                name.classList.remove('error');
                hideErrorMessage(name);
            }
            
            if (!email.value.trim() || !isValidEmail(email.value)) {
                valid = false;
                email.classList.add('error');
                showErrorMessage(email);
            } else {
                email.classList.remove('error');
                hideErrorMessage(email);
            }
            
            if (!message.value.trim()) {
                valid = false;
                message.classList.add('error');
                showErrorMessage(message);
            } else {
                message.classList.remove('error');
                hideErrorMessage(message);
            }
            
            if (valid) {
                // Show loading state
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission (replace with actual API call)
                setTimeout(() => {
                    if (window.gsap) {
                        // Animate form elements out first
                        gsap.to(contactForm.querySelectorAll('.form-group'), {
                            y: -20,
                            opacity: 0,
                            stagger: 0.05,
                            duration: 0.3,
                            onComplete: () => {
                                // Show success message
                                contactForm.innerHTML = '<div class="success-message"><h3>Thank you for your message!</h3><p>We will get back to you as soon as possible.</p></div>';
                                
                                // Animate success message in
                                gsap.from('.success-message', {
                                    y: 30,
                                    opacity: 0,
                                    duration: 0.5,
                                    ease: 'back.out(1.2)'
                                });
                            }
                        });
                    } else {
                        // Fallback
                        contactForm.innerHTML = '<div class="success-message"><h3>Thank you for your message!</h3><p>We will get back to you as soon as possible.</p></div>';
                    }
                }, 1500);
            }
        });
        
        // Add real-time validation feedback
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateInput(this);
                }
            });
        });
    }
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!window.gsap) return; // Skip if GSAP not available
            
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Create ripple element
            const ripple = document.createElement('span');
            ripple.className = 'btn-ripple';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            // Animate ripple
            gsap.to(ripple, {
                scale: 10,
                opacity: 0,
                duration: 0.6,
                ease: 'power1.out',
                onComplete: () => {
                    ripple.remove();
                }
            });
        });
    });
}

/**
 * 3D Card Effects
 */
function init3DCards() {
    // Find all 3D cards
    const cards = document.querySelectorAll('.card-3d');
    
    cards.forEach(card => {
        const container = card.closest('.card-3d-container');
        
        if (!container) return;
        
        // Add tilt effect
        container.addEventListener('mousemove', e => {
            if (window.innerWidth <= 768) return; // Skip on mobile
            
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Convert to normalized coordinates (-1 to 1)
            const xNorm = (x / rect.width) * 2 - 1;
            const yNorm = (y / rect.height) * 2 - 1;
            
            if (window.gsap) {
                gsap.to(card, {
                    rotationY: xNorm * 10,
                    rotationX: yNorm * -10,
                    duration: 0.5,
                    ease: 'power2.out'
                });
                
                // Parallax effect for layers
                const layers = card.querySelectorAll('[class*="card-3d-layer"]');
                layers.forEach(layer => {
                    const depth = parseFloat(layer.className.match(/layer-(\d+)/)[1]) || 1;
                    const moveX = xNorm * depth * 5;
                    const moveY = yNorm * depth * 5;
                    
                    gsap.to(layer, {
                        x: moveX,
                        y: moveY,
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                });
            } else {
                // Fallback to direct manipulation
                card.style.transform = `rotateX(${yNorm * -10}deg) rotateY(${xNorm * 10}deg)`;
            }
        });
        
        // Reset on mouse leave
        container.addEventListener('mouseleave', () => {
            if (window.gsap) {
                gsap.to(card, {
                    rotationY: 0,
                    rotationX: 0,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.7)'
                });
                
                // Reset layers
                const layers = card.querySelectorAll('[class*="card-3d-layer"]');
                layers.forEach(layer => {
                    gsap.to(layer, {
                        x: 0,
                        y: 0,
                        duration: 0.6,
                        ease: 'elastic.out(1, 0.7)'
                    });
                });
            } else {
                card.style.transform = 'rotateX(0) rotateY(0)';
            }
        });
    });
}

/**
 * Scroll Reveal for elements with reveal-on-scroll class
 */
function initScrollReveal() {
    // Only run if IntersectionObserver is available
    if (!('IntersectionObserver' in window) || window.ScrollTrigger) return;
    
    const elements = document.querySelectorAll('.reveal-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing after the element appears
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Utility Functions
 */
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}

function validateInput(input) {
    let isValid = true;
    
    if (input.id === 'name' && !input.value.trim()) {
        isValid = false;
    } else if (input.id === 'email' && (!input.value.trim() || !isValidEmail(input.value))) {
        isValid = false;
    } else if (input.id === 'message' && !input.value.trim()) {
        isValid = false;
    }
    
    if (isValid) {
        input.classList.remove('error');
        hideErrorMessage(input);
    } else {
        input.classList.add('error');
        showErrorMessage(input);
    }
}

function showErrorMessage(input) {
    const errorElement = input.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.style.display = 'block';
        errorElement.style.opacity = '1';
    }
}

function hideErrorMessage(input) {
    const errorElement = input.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.style.opacity = '0';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 300);
    }
}

// Add loaded class to document to avoid FOUC (Flash of Unstyled Content)
document.documentElement.classList.add('js-loaded');
