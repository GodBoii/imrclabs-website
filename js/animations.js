/**
 * IMRC - Animations JavaScript
 * Version: 1.0
 * 
 * Special animations for the landing page and throughout the site
 */

document.addEventListener('DOMContentLoaded', function() {
    // Only apply these advanced animations on larger screens
    if (window.innerWidth > 768) {
        initHeroAnimations();
        initParallaxEffects();
        initParticles();
    }
    gsap.registerPlugin(ScrollTrigger);
    initScrollReveal();
    initHeroStrataParallax();
});

/**
 * Hero Section: Layered Earth Strata Parallax using GSAP ScrollTrigger
 */
function initHeroStrataParallax() {
    // Select the layers
    const layers = gsap.utils.toArray(".hero-layer");
    if (!layers.length) return; // Exit if no layers found

    // Create a GSAP Timeline attached to ScrollTrigger
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero",       // Element that triggers the animation
            start: "top top",       // When the top of ".hero" hits the top of the viewport
            end: "bottom top",      // When the bottom of ".hero" hits the top of the viewport
            scrub: true,            // Smoothly scrubs animation based on scroll position (true or a number like 1)
            // markers: true,       // Uncomment for debugging ScrollTrigger start/end points
        }
    });

    // Define the parallax speeds for each layer
    // Higher positive yPercent means it moves down faster (appears faster scrolling up)
    // Adjust these values to get the desired depth effect
    const speeds = {
        layer1: 50, // Optional Overlay - Fastest
        layer2: 40, // Soil - Fast
        layer3: 25, // Clay - Moderate
        layer4: 10  // Rock - Slowest (Deepest)
    };

    // Add animations to the timeline for each layer
    layers.forEach(layer => {
        let speed;
        if (layer.classList.contains('layer-1')) speed = speeds.layer1;
        else if (layer.classList.contains('layer-2')) speed = speeds.layer2;
        else if (layer.classList.contains('layer-3')) speed = speeds.layer3;
        else if (layer.classList.contains('layer-4')) speed = speeds.layer4;
        else speed = 0; // Default if class is missing

        if (speed > 0) {
            tl.to(layer, {
                yPercent: speed, // Move layer down by this percentage of its height
                ease: "none"     // Linear easing for direct scrub correlation
            }, 0); // The '0' makes all layer animations start at the same time in the timeline
        }
    });

    // Optional: Animate hero text slightly differently if needed
    // Example: Make text move up slightly slower than scroll
    // tl.to(".hero-content", {
    //     yPercent: -5, // Moves up slower than the scroll
    //     ease: "none"
    // }, 0);

     // Add initial text animations (run once on load, not tied to scroll scrub)
     gsap.from(".hero-content h1", { opacity: 0, y: 30, duration: 1, delay: 0.5 });
     gsap.from(".hero-content h2", { opacity: 0, y: 30, duration: 1, delay: 0.8 });
     gsap.from(".hero-cta", { opacity: 0, y: 30, duration: 1, delay: 1.1 });

}

/**
 * Special animations for the hero section
 */
function initHeroAnimations() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Create a subtle floating effect for hero content
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent) {
        // Add floating animation
        let floatY = 0;
        let floatDirection = 1;
        
        function floatAnimation() {
            floatY += 0.05 * floatDirection;
            
            // Reverse direction at limits
            if (floatY > 10) {
                floatDirection = -1;
            } else if (floatY < -10) {
                floatDirection = 1;
            }
            
            heroContent.style.transform = `translateY(${floatY * 0.15}px)`;
            requestAnimationFrame(floatAnimation);
        }
        
        // Start the animation
        requestAnimationFrame(floatAnimation);
    }
    
    // Add an interactive effect where the hero background slightly follows mouse movement
    hero.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        hero.style.backgroundPosition = `${50 + mouseX * 10}% ${50 + mouseY * 10}%`;
    });
}

/**
 * Parallax scrolling effects
 */
function initParallaxEffects() {
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;

        // Parallax effect for the hero section background image
        const hero = document.querySelector('.hero');
        if (hero) {
            // Apply a slower scroll to the main background image
            // The 'background-position' might conflict with the 'moveGrid' animation
            // Let's adjust the background position directly instead of backgroundPositionY
            let offset = scrollTop * 0.4; // Adjust multiplier for desired parallax speed
            hero.style.backgroundPosition = `center ${50 + offset}px`;
             // Or keep simpler Y offset: hero.style.backgroundPositionY = `${offset}px`; Choose one.
        }

        // Subtle parallax for other sections (Keep this if you like it)
        const sections = document.querySelectorAll('.cta-section, .why-choose-us');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollTop + window.innerHeight > sectionTop &&
                scrollTop < sectionTop + sectionHeight) {
                const scrollProgress = (scrollTop + window.innerHeight - sectionTop) /
                                      (window.innerHeight + sectionHeight);
                // Adjust background position based on scroll progress
                 section.style.backgroundPositionY = `${50 + (scrollProgress * -10)}%`; // Example: moves up
            }
        });
    });
}

function initScrollReveal() {
    const elementsToReveal = document.querySelectorAll('.service-card, .service-category-card, .feature, .client-logo, .project-card, .section-header, .value-card, .leader-profile, .team-description, .client-card, .testimonial, .office-card, .project-detail, .service-subcategory');

    // Ensure reveal styles are injected (only once)
    if (!document.querySelector('style[data-reveal-style]')) {
        const style = document.createElement('style');
        style.setAttribute('data-reveal-style', 'true');
        style.textContent = `
            .reveal-hidden {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease-out, transform 0.6s ease-out;
            }
            .reveal-visible {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                entry.target.classList.remove('reveal-hidden');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    elementsToReveal.forEach(el => {
        el.classList.add('reveal-hidden');
        observer.observe(el);
    });
}
/**
 * Create particle effect in the hero section
 */
function initParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Create a canvas element for particles
    const canvas = document.createElement('canvas');
    canvas.classList.add('particles-canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    hero.appendChild(canvas);
    
    // Set canvas size
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
    
    // Get the drawing context
    const ctx = canvas.getContext('2d');
    
    // Create particles
    const particles = [];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            color: 'rgba(255, 255, 255, ' + (Math.random() * 0.3 + 0.2) + ')',
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25
        });
    }
    
    // Draw and animate particles
    function animateParticles() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            // Move particles
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Wrap around edges
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        }
        
        // Connect particles with lines if they're close enough
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                
                // Calculate distance between particles
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Draw line if particles are close
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    
                    // Line opacity based on distance
                    const opacity = 0.15 * (1 - distance / 100);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.stroke();
                }
            }
        }
        
        // Continue animation
        requestAnimationFrame(animateParticles);
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    });
    
    // Start animation
    animateParticles();
}

/**
 * Add appear animation class to CSS
 */
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .service-card, .service-category-card, .feature, .client-logo, .project-card, .section-header {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .appear {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
});
