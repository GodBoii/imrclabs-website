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
});

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
    // Add parallax effect to sections with background
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        
        // Parallax effect for the hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            // Apply a slower scroll to the background
            hero.style.backgroundPositionY = `${scrollTop * 0.5}px`;
        }
        
        // Subtle parallax for other sections
        const sections = document.querySelectorAll('.cta-section, .why-choose-us');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // Check if section is in view
            if (scrollTop + window.innerHeight > sectionTop && 
                scrollTop < sectionTop + sectionHeight) {
                
                // Calculate how far through the section we've scrolled
                const scrollProgress = (scrollTop + window.innerHeight - sectionTop) / 
                                      (window.innerHeight + sectionHeight);
                
                // Apply subtle movement
                section.style.backgroundPositionY = `${50 + (scrollProgress * 10)}%`;
            }
        });
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
        .service-card, .feature, .client-logo, .project-card, .section-header {
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
