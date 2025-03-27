/**
 * IMRC - Main JavaScript
 * Version: 1.0
 */

// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile navigation
    initMobileNav();
    
    // Add scroll effects
    initScrollEffects();
    
    // Initialize any interactive elements
    initInteractiveElements();
    
    // Get all scroll control buttons
    const scrollBtns = document.querySelectorAll('.scroll-btn');
    
    scrollBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Find the closest scroll container
            const scrollContainer = this.closest('.container').querySelector('.scroll-container');
            // Determine scroll direction and amount
            const direction = this.dataset.direction;
            const scrollAmount = scrollContainer.clientWidth * 0.75; // Scroll 75% of container width
            
            if (direction === 'left') {
                scrollContainer.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            } else {
                scrollContainer.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add mouse wheel scrolling for horizontal containers
    const scrollContainers = document.querySelectorAll('.scroll-container');
    
    scrollContainers.forEach(container => {
        container.addEventListener('wheel', function(e) {
            if (e.deltaY !== 0) {
                e.preventDefault();
                this.scrollLeft += e.deltaY;
            }
        }, { passive: false });
    });
});

/**
 * Mobile Navigation Toggle
 */
function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
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
        });
    }
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(event.target) && 
            !navToggle.contains(event.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Close mobile nav when window is resized above mobile breakpoint
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

/**
 * Scroll Effects - Add animations when elements come into view
 */
function initScrollEffects() {
    // Get all elements that should be animated on scroll
    const elements = document.querySelectorAll('.service-card, .service-category-card, .feature, .client-logo, .project-card, .section-header');
    
    // Create an Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                // Stop observing after the element appears
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2 // When at least 20% of the element is visible
    });
    
    // Start observing each element
    elements.forEach(element => {
        observer.observe(element);
    });
    
    // Scroll to section when clicking on navigation links
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only handle links to sections on the same page
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Offset for the fixed header
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const navMenu = document.querySelector('.nav-menu');
                    const navToggle = document.getElementById('navToggle');
                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        navToggle.classList.remove('active');
                    }
                }
            }
        });
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
            } else {
                name.classList.remove('error');
            }
            
            if (!email.value.trim() || !isValidEmail(email.value)) {
                valid = false;
                email.classList.add('error');
            } else {
                email.classList.remove('error');
            }
            
            if (!message.value.trim()) {
                valid = false;
                message.classList.add('error');
            } else {
                message.classList.remove('error');
            }
            
            if (valid) {
                // Normally we would submit the form here
                // For demo purposes, show a success message
                contactForm.innerHTML = '<div class="success-message"><h3>Thank you for your message!</h3><p>We will get back to you as soon as possible.</p></div>';
            }
        });
    }
}

/**
 * Utility Functions
 */
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}

// Add CSS class to avoid FOUC (Flash of Unstyled Content)
document.documentElement.classList.add('js-loaded');
