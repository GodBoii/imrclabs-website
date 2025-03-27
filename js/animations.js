/**
 * IMRC - Advanced Animations & Transitions
 * Version: 2.0
 * Using GSAP for superior animation performance and control
 */

// Import GSAP via CDN in HTML file
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>

// Global animation settings
const ANIMATION_SETTINGS = {
  staggerAmount: 0.08,
  baseEase: "power3.out",
  baseDuration: 0.8,
  revealOffset: "20%"
};

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Register GSAP plugins
  if (window.gsap) {
    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }
    
    // Initialize all animations
    initPageTransitions();
    initHeroSection();
    initRevealAnimations();
    initParallaxEffects();
    initPanelTransitions();
    initParticleSystem();
    
    // Add animation controls for accessibility
    setupAnimationControls();
  } else {
    console.warn('GSAP library not loaded. Animations will not work.');
  }
});

/**
 * Page Transition System
 * Creates smooth transitions between pages
 */
function initPageTransitions() {
  // Create transition overlay
  const overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';
  document.body.appendChild(overlay);
  
  // Set initial state
  gsap.set(overlay, { 
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'var(--primary-color)',
    zIndex: 9999,
    opacity: 0,
    pointerEvents: 'none'
  });
  
  // Add transition to all internal links
  document.querySelectorAll('a').forEach(link => {
    // Only apply to internal links
    if (link.hostname === window.location.hostname && 
        !link.href.includes('#') && 
        !link.target && 
        !link.classList.contains('no-transition')) {
      
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = this.href;
        
        // Play exit animation
        gsap.timeline()
          .to(overlay, { 
            opacity: 1, 
            duration: 0.5,
            ease: "power2.inOut", 
            onStart: () => {
              overlay.style.pointerEvents = 'all';
            }
          })
          .to(document.documentElement, {
            '--clip-amount': '100%',
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
              window.location.href = target;
            }
          });
      });
    }
  });
  
  // Play enter animation when page loads
  if (document.readyState === 'complete') {
    playEntranceAnimation();
  } else {
    window.addEventListener('load', playEntranceAnimation);
  }
  
  // Entrance animation function
  function playEntranceAnimation() {
    gsap.timeline()
      .set(document.documentElement, {
        '--clip-amount': '100%',
      })
      .set(overlay, { 
        opacity: 1,
        pointerEvents: 'all'
      })
      .to(document.documentElement, {
        '--clip-amount': '0%',
        duration: 0.8,
        ease: "power2.inOut",
        delay: 0.2
      })
      .to(overlay, { 
        opacity: 0, 
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          overlay.style.pointerEvents = 'none';
        }
      });
  }
}

/**
 * Hero Section Animations
 * Create dynamic 3D and parallax effects for the hero section
 */
function initHeroSection() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  const heroContent = hero.querySelector('.hero-content');
  const heroTitle = hero.querySelector('h1');
  const heroSubtitle = hero.querySelector('h2');
  const ctas = hero.querySelectorAll('.hero-cta a');
  
  // Create a 3D container for hero content
  gsap.set(heroContent, { 
    perspective: 1000,
    transformStyle: "preserve-3d"
  });
  
  // Initial animation timeline
  const heroTimeline = gsap.timeline({
    defaults: { 
      ease: ANIMATION_SETTINGS.baseEase,
      duration: ANIMATION_SETTINGS.baseDuration
    }
  });
  
  // Animate hero elements in sequence
  heroTimeline
    .from(heroTitle, { 
      y: 50, 
      opacity: 0,
      rotationX: 15,
      transformOrigin: "bottom center"
    })
    .from(heroSubtitle, { 
      y: 30, 
      opacity: 0,
      rotationX: 10,
      transformOrigin: "top center"
    }, "-=0.4")
    .from(ctas, { 
      y: 30, 
      opacity: 0,
      stagger: ANIMATION_SETTINGS.staggerAmount,
      scale: 0.9
    }, "-=0.3");
  
  // Add 3D tilt effect based on mouse movement
  if (window.innerWidth > 768) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / rect.width;
      const mouseY = (e.clientY - rect.top) / rect.height;
      
      // Calculate rotation values
      const rotX = 5 * (0.5 - mouseY);
      const rotY = 5 * (mouseX - 0.5);
      
      // Apply smooth rotation
      gsap.to(heroContent, {
        rotationX: rotX,
        rotationY: rotY,
        duration: 1,
        ease: "power1.out"
      });
    });
    
    // Reset rotation when mouse leaves
    hero.addEventListener('mouseleave', () => {
      gsap.to(heroContent, {
        rotationX: 0,
        rotationY: 0,
        duration: 1.5,
        ease: "elastic.out(1, 0.8)"
      });
    });
  }
}

/**
 * Reveal Animations for Content Sections
 * Apply staggered reveal animations to section content
 */
function initRevealAnimations() {
  // Sections to animate
  const sections = document.querySelectorAll('.section-header, .services-grid, .features-grid, .clients-logo-grid, .projects-grid');
  
  sections.forEach(section => {
    // Get all direct children to animate
    const items = section.children;
    
    // Create staggered animation for children
    ScrollTrigger.create({
      trigger: section,
      start: "top 85%",
      onEnter: () => {
        gsap.fromTo(
          items, 
          { 
            y: 40, 
            opacity: 0,
            scale: 0.95,
            transformOrigin: "center bottom" 
          },
          { 
            y: 0, 
            opacity: 1,
            scale: 1,
            duration: ANIMATION_SETTINGS.baseDuration,
            ease: ANIMATION_SETTINGS.baseEase,
            stagger: ANIMATION_SETTINGS.staggerAmount,
            overwrite: "auto"
          }
        );
      },
      once: false
    });
  });
  
  // Special animation for service cards
  const serviceCards = document.querySelectorAll('.service-card');
  
  serviceCards.forEach((card, index) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: "top 85%"
      }
    });
    
    // Get card elements
    const icon = card.querySelector('.service-icon');
    const title = card.querySelector('h3');
    const description = card.querySelector('p');
    const link = card.querySelector('a');
    
    // Create reveal sequence
    tl.from(card, { 
      opacity: 0, 
      y: 30, 
      duration: ANIMATION_SETTINGS.baseDuration,
      ease: ANIMATION_SETTINGS.baseEase
    })
    .from(icon, { 
      scale: 0,
      rotation: -15,
      duration: 0.6,
      ease: "back.out(1.5)"
    }, "-=0.4")
    .from([title, description, link], { 
      opacity: 0, 
      y: 20,
      stagger: 0.1,
      duration: 0.6
    }, "-=0.3");
  });
}

/**
 * Parallax Scrolling Effects
 * Add depth to the website through parallax scrolling
 */
function initParallaxEffects() {
  // Create parallax for background sections
  const sections = document.querySelectorAll('.hero, .cta-section, .why-choose-us');
  
  sections.forEach(section => {
    // Create a background wrapper if it doesn't exist
    let bgWrapper = section.querySelector('.bg-parallax');
    
    if (!bgWrapper) {
      // Get the computed background
      const bg = window.getComputedStyle(section).backgroundImage;
      
      if (bg && bg !== 'none') {
        // Remove the background from the section
        section.style.backgroundImage = 'none';
        section.style.position = 'relative';
        section.style.overflow = 'hidden';
        
        // Create the parallax background element
        bgWrapper = document.createElement('div');
        bgWrapper.className = 'bg-parallax';
        bgWrapper.style.backgroundImage = bg;
        bgWrapper.style.position = 'absolute';
        bgWrapper.style.top = 0;
        bgWrapper.style.left = 0;
        bgWrapper.style.width = '100%';
        bgWrapper.style.height = '120%';
        bgWrapper.style.backgroundSize = 'cover';
        bgWrapper.style.backgroundPosition = 'center';
        bgWrapper.style.zIndex = '-1';
        
        // Add it to the section
        section.insertBefore(bgWrapper, section.firstChild);
      }
    }
    
    if (bgWrapper) {
      // Create parallax effect
      gsap.to(bgWrapper, {
        y: "20%",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }
  });
  
  // Add parallax to content elements
  const contentElements = document.querySelectorAll('.value-card, .project-card, .feature');
  
  contentElements.forEach(element => {
    gsap.to(element, {
      y: -20,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    });
  });
  
  // Create subtle floating animation for icons
  const icons = document.querySelectorAll('.service-icon i, .feature-icon i, .value-icon i');
  
  icons.forEach(icon => {
    gsap.to(icon, {
      y: -8,
      duration: 1.5 + Math.random(),
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: Math.random()
    });
  });
}

/**
 * Panel Transitions System
 * Create smooth transitions between content panels and sections
 */
function initPanelTransitions() {
  // Add class to identify panels
  document.querySelectorAll('section:not(.hero)').forEach(section => {
    section.classList.add('transition-panel');
  });
  
  // Create advanced transitions between panels
  const panels = document.querySelectorAll('.transition-panel');
  
  panels.forEach(panel => {
    // Add clip-path properties for transitions
    gsap.set(panel, {
      clipPath: 'polygon(0 0, 100% 5%, 100% 100%, 0 95%)',
      opacity: 0.3
    });
    
    // Animate panel when it enters viewport
    ScrollTrigger.create({
      trigger: panel,
      start: "top 85%",
      end: "bottom top",
      onEnter: () => {
        gsap.to(panel, {
          clipPath: 'polygon(0 0, 100% 0%, 100% 100%, 0 100%)',
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out'
        });
      },
      onLeaveBack: () => {
        gsap.to(panel, {
          clipPath: 'polygon(0 0, 100% 5%, 100% 100%, 0 95%)',
          opacity: 0.3,
          duration: 1,
          ease: 'power2.in'
        });
      }
    });
    
    // Add hover effect if panel has a hover-panel class
    if (panel.classList.contains('hover-panel')) {
      panel.addEventListener('mouseenter', () => {
        gsap.to(panel, {
          clipPath: 'polygon(0 1%, 100% 0%, 100% 99%, 0 100%)',
          duration: 0.4,
          ease: 'power1.out'
        });
      });
      
      panel.addEventListener('mouseleave', () => {
        gsap.to(panel, {
          clipPath: 'polygon(0 0, 100% 0%, 100% 100%, 0 100%)',
          duration: 0.4,
          ease: 'power1.out'
        });
      });
    }
  });
  
  // Apply animated borders to cards
  document.querySelectorAll('.service-card, .client-card, .project-card, .value-card').forEach(card => {
    // Add border container
    const border = document.createElement('div');
    border.className = 'animated-border';
    
    // Position the border
    gsap.set(border, {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 1,
      background: 'linear-gradient(90deg, transparent, var(--primary-color), transparent)',
      opacity: 0
    });
    
    // Ensure card has position relative
    if (window.getComputedStyle(card).position === 'static') {
      card.style.position = 'relative';
    }
    
    card.appendChild(border);
    
    // Add hover animation
    card.addEventListener('mouseenter', () => {
      gsap.to(border, {
        opacity: 0.2,
        duration: 0.3,
        ease: 'power1.out'
      });
      
      gsap.fromTo(border, 
        { backgroundPosition: '-100% 0' },
        { 
          backgroundPosition: '200% 0',
          duration: 1.5,
          ease: 'none',
          repeat: -1
        }
      );
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(border, {
        opacity: 0,
        duration: 0.3,
        ease: 'power1.in',
        onComplete: () => {
          gsap.killTweensOf(border, { backgroundPosition: true });
        }
      });
    });
  });
}

/**
 * Advanced Particle System
 * Create interactive particle effects for hero section
 */
function initParticleSystem() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  
  // Create canvas for particles
  const canvas = document.createElement('canvas');
  canvas.className = 'particles-canvas';
  gsap.set(canvas, {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 0
  });
  
  hero.appendChild(canvas);
  
  // Set canvas size
  canvas.width = hero.offsetWidth;
  canvas.height = hero.offsetHeight;
  
  // Get drawing context
  const ctx = canvas.getContext('2d');
  
  // Particle settings
  const particleSettings = {
    count: 70,
    minSize: 1,
    maxSize: 3,
    minSpeed: 0.2,
    maxSpeed: 0.6,
    connectionDistance: 150,
    color: 'var(--primary-color)'
  };
  
  // Create particles
  const particles = [];
  
  for (let i = 0; i < particleSettings.count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * (particleSettings.maxSize - particleSettings.minSize) + particleSettings.minSize,
      speedX: (Math.random() - 0.5) * (particleSettings.maxSpeed - particleSettings.minSpeed) + particleSettings.minSpeed,
      speedY: (Math.random() - 0.5) * (particleSettings.maxSpeed - particleSettings.minSpeed) + particleSettings.minSpeed
    });
  }
  
  // Mouse interaction
  let mouseX = null;
  let mouseY = null;
  
  hero.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });
  
  hero.addEventListener('mouseleave', () => {
    mouseX = null;
    mouseY = null;
  });
  
  // Animation loop
  function drawParticles() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      // Update position
      p.x += p.speedX;
      p.y += p.speedY;
      
      // Boundary check
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      
      // Mouse interaction
      if (mouseX !== null && mouseY !== null) {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Repel particles within a certain radius
        if (dist < 80) {
          const angle = Math.atan2(dy, dx);
          const force = (80 - dist) / 80;
          
          p.x -= Math.cos(angle) * force * 2;
          p.y -= Math.sin(angle) * force * 2;
        }
      }
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = particleSettings.color;
      ctx.fill();
    }
    
    // Draw connections
    ctx.strokeStyle = particleSettings.color;
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < particleSettings.connectionDistance) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.globalAlpha = 1 - (dist / particleSettings.connectionDistance);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
    
    // Continue animation
    requestAnimationFrame(drawParticles);
  }
  
  // Handle resize
  window.addEventListener('resize', () => {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  });
  
  // Start animation
  drawParticles();
}

/**
 * Animation Controls for Accessibility
 * Allow users to control or disable animations
 */
function setupAnimationControls() {
  // Create control button
  const controlBtn = document.createElement('button');
  controlBtn.className = 'animation-control';
  controlBtn.setAttribute('aria-label', 'Toggle animations');
  controlBtn.innerHTML = '<i class="fas fa-film"></i>';
  
  // Style the button
  gsap.set(controlBtn, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1000,
    padding: '10px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    opacity: 0.7
  });
  
  // Add to body
  document.body.appendChild(controlBtn);
  
  // Check if animations should be disabled
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Initialize state based on user preference or saved setting
  let animationsDisabled = localStorage.getItem('animationsDisabled') === 'true' || prefersReducedMotion;
  
  // Apply initial state
  if (animationsDisabled) {
    disableAnimations();
    controlBtn.classList.add('disabled');
  }
  
  // Toggle animations on click
  controlBtn.addEventListener('click', () => {
    animationsDisabled = !animationsDisabled;
    localStorage.setItem('animationsDisabled', animationsDisabled);
    
    if (animationsDisabled) {
      disableAnimations();
      controlBtn.classList.add('disabled');
    } else {
      enableAnimations();
      controlBtn.classList.remove('disabled');
    }
  });
  
  // Function to disable animations
  function disableAnimations() {
    // Add class to body
    document.body.classList.add('reduced-motion');
    
    // Pause all GSAP animations
    gsap.globalTimeline.pause();
    
    // Disable scroll triggers
    if (ScrollTrigger) {
      ScrollTrigger.getAll().forEach(trigger => {
        trigger.disable(false, false);
      });
    }
    
    // Set CSS variables
    document.documentElement.style.setProperty('--transition-speed', '0s');
  }
  
  // Function to enable animations
  function enableAnimations() {
    // Remove class from body
    document.body.classList.remove('reduced-motion');
    
    // Resume GSAP animations
    gsap.globalTimeline.resume();
    
    // Enable scroll triggers
    if (ScrollTrigger) {
      ScrollTrigger.getAll().forEach(trigger => {
        trigger.enable();
      });
    }
    
    // Reset CSS variables
    document.documentElement.style.setProperty('--transition-speed', '0.3s');
  }
}
