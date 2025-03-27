/**
 * script.js
 * Main JavaScript functionality for IMRC Labs website
 *
 * This file handles:
 * - Navigation functionality (mobile toggle, dropdowns)
 * - Form validation
 * - Animations and intersection observers
 * - Automatic client logo scrolling
 * - Back to Top button functionality
 */

// DOM elements
const navLinks = document.querySelector('.nav-links');
const burger = document.querySelector('.burger');
let isMenuOpen = false;

/**
 * Document Ready Function
 * Initializes all necessary functionality when the document is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Create DOM elements
    createBackToTopButton();
    createMenuOverlay();
    
    // Initialize components
    initMobileMenu();
    initScrollEvents();
    initFormValidation();
    initSmoothScrolling();
    initScrollAnimations();
    initServicesToggle();
    
    // Initialize features based on page elements
    const logoSlider = document.querySelector('.logo-slider');
    if (logoSlider) scrollLogos();
    
    // Add touch events for mobile devices
    if ('ontouchstart' in window) {
        addTouchInteractions();
    }
});

/**
 * Create Back to Top Button
 * Dynamically creates and appends the back to top button
 */
function createBackToTopButton() {
    const backToTop = document.createElement('div');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.setAttribute('role', 'button');
    backToTop.setAttribute('tabindex', '0');
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Keyboard accessibility
    backToTop.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
    
    document.body.appendChild(backToTop);
}

/**
 * Create Menu Overlay
 * Creates the overlay that appears behind the mobile menu
 */
function createMenuOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    
    overlay.addEventListener('click', () => {
        if (isMenuOpen) {
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            isMenuOpen = false;
        }
    });
    
    document.body.appendChild(overlay);
}

/**
 * Initialize Scroll Events
 * Handles scroll-based events like navbar styling and back-to-top button
 */
function initScrollEvents() {
    const nav = document.querySelector('nav');
    const backToTop = document.querySelector('.back-to-top');
    const scrollThreshold = 200;
    
    window.addEventListener('scroll', debounce(() => {
        // Add shadow to navbar on scroll
        if (window.scrollY > 10) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Show/hide back to top button
        if (window.scrollY > scrollThreshold) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, 10));
}

/**
 * Initialize Mobile Menu
 * Sets up the mobile menu toggle and dropdown functionality
 */
function initMobileMenu() {
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.querySelector('.menu-overlay');
    
    // Toggle mobile menu
    if (burger) {
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            overlay?.classList.toggle('active');
            isMenuOpen = !isMenuOpen;
            
            // ARIA attributes for accessibility
            burger.setAttribute('aria-expanded', isMenuOpen);
        });
    }

    // Desktop menu behavior - direct links for main items with submenus
    if (window.innerWidth > 1024) {
        // Handle Services menu hover
        const servicesMenuItem = document.querySelector('.nav-links > li > a[href="services.html"]');
        if (servicesMenuItem) {
            const parentLi = servicesMenuItem.parentElement;
            const dropdown = parentLi.querySelector('.dropdown');
            
            if (dropdown) {
                parentLi.addEventListener('mouseenter', () => {
                    dropdown.style.opacity = '1';
                    dropdown.style.visibility = 'visible';
                    dropdown.style.transform = 'translateY(0)';
                    dropdown.style.pointerEvents = 'all';
                });
                
                parentLi.addEventListener('mouseleave', () => {
                    dropdown.style.opacity = '';
                    dropdown.style.visibility = '';
                    dropdown.style.transform = '';
                    dropdown.style.pointerEvents = '';
                });
            }
        }
        
        // Handle submenu hover effects
        document.querySelectorAll('.has-submenu').forEach(submenuItem => {
            const submenu = submenuItem.querySelector('.submenu');
            if (submenu) {
                submenuItem.addEventListener('mouseenter', () => {
                    submenu.style.opacity = '1';
                    submenu.style.visibility = 'visible';
                    submenu.style.transform = 'translateX(0)';
                    submenu.style.pointerEvents = 'all';
                });
                
                submenuItem.addEventListener('mouseleave', () => {
                    submenu.style.opacity = '';
                    submenu.style.visibility = '';
                    submenu.style.transform = '';
                    submenu.style.pointerEvents = '';
                });
            }
        });
    } 
    // Mobile menu behavior - toggle submenus
    else {
        // Handle main menu items with dropdowns
        document.querySelectorAll('.nav-links > li > a').forEach(link => {
            const parentLi = link.parentElement;
            const dropdown = parentLi.querySelector('.dropdown');
            
            if (dropdown) {
                link.addEventListener('click', (e) => {
                    if (link.getAttribute('href') !== '#') {
                        return; // Allow navigation for links with real hrefs
                    }
                    
                    e.preventDefault();
                    
                    // Close any other open dropdowns
                    document.querySelectorAll('.dropdown.show').forEach(openDropdown => {
                        if (openDropdown !== dropdown) {
                            openDropdown.classList.remove('show');
                        }
                    });
                    
                    // Toggle current dropdown
                    dropdown.classList.toggle('show');
                    link.setAttribute('aria-expanded', dropdown.classList.contains('show'));
                });
            }
        });
        
        // Handle submenu toggles
        document.querySelectorAll('.has-submenu > a').forEach(link => {
            const submenu = link.nextElementSibling;
            
            if (submenu) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Toggle submenu
                    submenu.classList.toggle('show');
                    link.setAttribute('aria-expanded', submenu.classList.contains('show'));
                });
            }
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !e.target.closest('.nav-links') && !e.target.closest('.burger')) {
            navLinks.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            isMenuOpen = false;
        }
    });
}

/**
 * Initialize Form Validation
 * Sets up form validation for contact forms
 */
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', validateForm);
    }
}

/**
 * Add Touch Interactions
 * Adds touch-specific interactions for mobile devices
 */
function addTouchInteractions() {
    // Replace hover effects with touch events for service items
    const serviceItems = document.querySelectorAll('.service-item, .main-service-category');
    
    serviceItems.forEach(item => {
        item.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        }, { passive: true });
        
        item.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 300);
        }, { passive: true });
    });
}

/**
 * Initialize Smooth Scrolling
 * Adds smooth scrolling for all internal links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (isMenuOpen) {
                    navLinks.classList.remove('active');
                    document.querySelector('.menu-overlay').classList.remove('active');
                    isMenuOpen = false;
                }
                
                // Scroll to the target
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL hash without causing a page jump
                window.history.pushState(null, null, this.getAttribute('href'));
            }
        });
    });
}

/**
 * Validate Contact Form
 * Validates the contact form and prevents submission if invalid
 */
function validateForm(event) {
    const form = event.target;
    const fullName = form.querySelector('#fullName');
    const email = form.querySelector('#email');
    const subject = form.querySelector('#subject');
    const message = form.querySelector('#message');
    let isValid = true;
    
    // Reset previous validation messages
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    
    // Validate Full Name
    if (!fullName.value.trim()) {
        showValidationError(fullName, 'Please enter your full name');
        isValid = false;
    }
    
    // Validate Email
    if (!validateEmail(email.value.trim())) {
        showValidationError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate Subject
    if (!subject.value.trim()) {
        showValidationError(subject, 'Please enter a subject');
        isValid = false;
    }
    
    // Validate Message
    if (!message.value.trim() || message.value.trim().length < 10) {
        showValidationError(message, 'Please enter a message (at least 10 characters)');
        isValid = false;
    }
    
    if (!isValid) {
        event.preventDefault();
        return false;
    }
    
    // If using AJAX submission, uncomment and implement this
    /*
    event.preventDefault();
    const formData = new FormData(form);
    
    fetch('contact_form.py', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showFormMessage('Your message has been sent successfully!', 'success');
            form.reset();
        } else {
            showFormMessage('There was a problem sending your message. Please try again.', 'error');
        }
    })
    .catch(error => {
        showFormMessage('There was a network error. Please try again.', 'error');
        console.error(error);
    });
    */
    
    return true;
}

/**
 * Show Validation Error
 * Displays error message for form validation
 */
function showValidationError(inputElement, message) {
    // Add error class to input
    inputElement.classList.add('is-invalid');
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Insert error message after input
    inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
    
    // Focus the first invalid input
    if (!document.querySelector('.is-invalid:focus')) {
        inputElement.focus();
    }
}

/**
 * Show Form Message
 * Displays form submission success/error messages
 */
function showFormMessage(message, type) {
    const messageElement = document.getElementById('formMessage');
    
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = 'form-message';
        messageElement.classList.add(type);
        messageElement.style.display = 'block';
        
        // Scroll to message
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageElement.style.opacity = '0';
            setTimeout(() => {
                messageElement.style.display = 'none';
                messageElement.style.opacity = '1';
            }, 500);
        }, 5000);
    }
}

/**
 * Validate Email
 * Validates email format
 */
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

/**
 * Initialize Scroll Animations
 * Sets up intersection observers for scroll-based animations
 */
function initScrollAnimations() {
    // Add animate-on-scroll class to all sections
    document.querySelectorAll('section, .hero-content, .service-item, .main-service-category').forEach(element => {
        if (!element.classList.contains('animate-on-scroll')) {
            element.classList.add('animate-on-scroll');
        }
    });
    
    // Initialize intersection observer for animations
    const animationObserver = new IntersectionObserver(handleIntersection, {
        rootMargin: '0px',
        threshold: 0.15
    });
    
    // Observe all elements with the animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        animationObserver.observe(element);
    });
}

/**
 * Handle Intersection
 * Callback for intersection observer
 */
function handleIntersection(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Stop observing element after it's animated
            observer.unobserve(entry.target);
        }
    });
}

/**
 * Scroll Logos
 * Creates infinite scrolling effect for client logos
 */
function scrollLogos() {
    const logoSlider = document.querySelector('.logo-slider');
    
    if (logoSlider) {
        const logos = logoSlider.querySelector('.logos');
        
        // Clone logos for infinite scrolling effect
        if (logos && logos.children.length > 0) {
            const clone = logos.cloneNode(true);
            logoSlider.appendChild(clone);
            
            // Only animate if not on a device that prefers reduced motion
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                animateLogos();
            }
        }
    }
}

/**
 * Animate Logos
 * Controls the animation of logos in the slider
 */
function animateLogos() {
    const logoSlider = document.querySelector('.logo-slider');
    const speed = 0.5; // pixels per frame
    let position = 0;
    
    function step() {
        // Reset position when first set of logos is fully moved out
        const firstLogoSet = logoSlider.querySelector('.logos');
        if (position <= -firstLogoSet.offsetWidth) {
            position = 0;
        }
        
        // Move logos
        position -= speed;
        logoSlider.style.transform = `translateX(${position}px)`;
        
        // Request next frame
        requestAnimationFrame(step);
    }
    
    // Start animation
    requestAnimationFrame(step);
}

/**
 * Debounce Function
 * Limits how often a function can be called
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

/**
 * Initialize Services Toggle
 * Shows/hides sub-services when toggle button is clicked
 */
function initServicesToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-services');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetGrid = document.getElementById(targetId);
            
            if (!targetGrid) return;
            
            // Toggle active class on the target grid
            targetGrid.classList.toggle('active');
            
            // Update button text
            if (targetGrid.classList.contains('active')) {
                this.textContent = 'Hide Services';
            } else {
                this.textContent = 'View Services';
            }
        });
    });
}