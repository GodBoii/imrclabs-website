# IMRC Website Animation System

This document provides guidance on how to use the advanced animation system implemented in the IMRC website. The animation system leverages GSAP (GreenSock Animation Platform) along with custom CSS and JavaScript to create a smooth, engaging user experience.

## Table of Contents

1. [Animation Libraries](#animation-libraries)
2. [CSS Animation Classes](#css-animation-classes)
3. [Transition Panel System](#transition-panel-system)
4. [3D Card Effects](#3d-card-effects)
5. [Page Transitions](#page-transitions)
6. [Particle System](#particle-system)
7. [Scroll-Triggered Animations](#scroll-triggered-animations)
8. [Accessibility Considerations](#accessibility-considerations)
9. [Troubleshooting](#troubleshooting)

## Animation Libraries

The animation system uses the following libraries:

- **GSAP Core** - Powers the animation engine
- **ScrollTrigger** - Controls animations based on scroll position

These are loaded in the header:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
```

## CSS Animation Classes

The following CSS classes can be added to elements to apply animations:

### Reveal Animations

- `.fade-in` - Simple fade in animation
- `.slide-in` - Slide in from right
- `.slide-in.from-left` - Slide in from left
- `.scale-in` - Scale up animation
- `.reveal-on-scroll` - Triggers when element comes into view

### Text Effects

- `.text-gradient` - Applies an animated gradient to text
- `.animate-text` - Fade and slide up animation for text
- `.animate-text-delay` - Same as above but with a slight delay

### Interactive Effects

- `.transition-panel` - Applies a clip-path animation when scrolling
- `.hover-panel` - Adds subtle hover effects to panels
- `.card-3d-container` - Container for 3D card effect

Example:

```html
<div class="feature slide-in from-left">
    <div class="feature-icon">
        <i class="fas fa-certificate"></i>
    </div>
    <h3>Title</h3>
    <p>Description</p>
</div>
```

## Transition Panel System

The transition panel system creates smooth transitions between sections as the user scrolls.

To create a transition panel:

1. Add the `transition-panel` class to a section
2. Optionally add `hover-panel` for hover effects

```html
<section class="services-overview transition-panel">
    <!-- Content -->
</section>
```

## 3D Card Effects

The 3D card system creates dynamic, interactive cards with depth.

To create a 3D card:

1. Add `card-3d-container` to the card container
2. Inside, add `card-3d` to the card itself
3. Use `card-3d-layer-1`, `card-3d-layer-2`, etc. for content at different depths

```html
<div class="service-card card-3d-container">
    <div class="card-3d">
        <div class="service-icon card-3d-layer-1">
            <i class="fas fa-flask"></i>
        </div>
        <div class="card-3d-layer-2">
            <h3>Material Testing</h3>
            <p>Description here</p>
        </div>
        <div class="card-3d-layer-3">
            <a href="#" class="read-more">Learn More</a>
        </div>
    </div>
</div>
```

## Page Transitions

Page transitions create a smooth animation between pages:

1. The system automatically detects internal links
2. It applies a transition overlay when navigating
3. Links with `no-transition` class will skip the animation

To disable transition for a specific link:

```html
<a href="page.html" class="no-transition">Link Text</a>
```

## Particle System

The particle system creates an interactive background with moving dots and connections. It's automatically applied to the hero section.

Key features:
- Interactive particles that respond to mouse movement
- Connections between nearby particles
- Automatically adapts to screen size

No additional HTML is required as the system injects the canvas automatically.

## Scroll-Triggered Animations

Scroll-triggered animations activate elements as they come into view:

1. Elements with animation classes are initially hidden
2. When they enter the viewport, they animate in
3. The timing is staggered for a more natural feel

Example:

```html
<div class="clients-logo-grid">
    <div class="client-logo fade-in">Client 1</div>
    <div class="client-logo fade-in">Client 2</div>
    <div class="client-logo fade-in">Client 3</div>
</div>
```

## Accessibility Considerations

The animation system includes accessibility features:

1. Animations respect the user's `prefers-reduced-motion` setting
2. A toggle button allows users to disable animations
3. Critical content is always accessible even without animations

To further enhance accessibility:

```html
<div class="animation-optional" aria-label="Decorative animation that can be skipped">
    <!-- Purely decorative animation content -->
</div>
```

## Troubleshooting

Common issues and solutions:

### Animations not working

- Check browser console for errors
- Verify GSAP scripts are loaded correctly
- Ensure elements have the correct animation classes

### Performance issues

- Reduce the number of animated elements
- Simplify 3D effects on mobile devices
- Use the `will-change` CSS property sparingly

### Conflicts with other scripts

- Load GSAP before other scripts
- Check for JavaScript errors in the console
- Ensure custom animations don't compete with GSAP

For more complex issues, refer to the [GSAP documentation](https://greensock.com/docs/). 