# IMRC - Indian Material Research Center Website

A modern, responsive, and feature-rich website built for the Indian Material Research Center (IMRC), showcasing their material testing and research services. This project utilizes vanilla HTML, CSS, and JavaScript for the frontend, coupled with a Python Flask backend for contact form processing.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Browser Compatibility](#browser-compatibility)
- [Performance and Animations](#performance-and-animations)
- [Dependencies & Credits](#dependencies--credits)
- [Copyright](#copyright)

## Overview

This website serves as the primary digital platform for IMRC. It presents the company's extensive services, notable projects, prestigious clients, and contact information through a clean, professional, and interactive user interface. The site incorporates smooth page transitions and engaging animations to enhance user experience.

### Company Information (from website content)

**Indian Material Research Center (IMRC)**
- **Established:** 2013
- **Headquarters:** Plot No. G-75/76, Sector-12, Kharghar, Navi Mumbai - 410210
- **Branch Office:** Vikhroli East, Mumbai - 400083
- **Specializes in:** Geotechnical, Geophysical, Geological Investigations, Traffic Surveys, Non-Destructive Testing (NDT), Pavement Design, Concrete Mix Design, Material Testing (Soil, Rock, Building Materials, Chemicals), Engineering & Structural Assessments.
- **Contact:** imrc.analysis@yahoo.in | +91 9819446242 / +91 7972209934

## Features

-   **Responsive Design**: Adapts seamlessly across desktops, laptops, tablets, and mobile devices (verified via CSS media queries).
-   **Modern UI/UX**: Clean, professional design using CSS variables (`base.css`), a well-defined color scheme, and intuitive navigation (`navigation.css`).
-   **Smooth Page Transitions**: Full-screen slide transitions between page loads (`transitions.js`, `components/transitions.css`).
-   **Engaging Animations**:
    -   **Scroll-Triggered Reveals**: Elements fade/slide into view on scroll using `IntersectionObserver` (`animations.js - initScrollReveal`).
    -   **Advanced Hero Animations (Desktop)**: Utilizes GSAP and ScrollTrigger (`animations.js`) for:
        *   Layered strata parallax effect (`initHeroStrataParallax`).
        *   Subtle text floating/movement (`initHeroAnimations`).
        *   Background parallax (`initParallaxEffects`).
        *   Canvas-based particle system (`initParticles`).
        *   Animated grid overlay (`home.css`).
-   **Comprehensive Service Display**: Detailed, categorized listing of all testing services (`services.html`) grouped into logical sections (`services-main-category`, `service-subcategory`, `chemical-group`).
-   **Project Showcase**: Dedicated page (`projects.html`) featuring detailed descriptions, metadata (client, year, location), services provided, and image galleries (`project-detail`, `gallery-container`).
-   **Client Showcase**:
    *   Dedicated page (`clients.html`) displaying client names/logos in categorized grids (`client-category`, `clients-grid`, `client-card`).
    *   Client testimonials (`testimonial`).
    *   Homepage horizontal scroll for featured clients (`index.html`, `horizontal-scroll.css`).
-   **Homepage Horizontal Scrollers**: Interactive scroll containers for 'Recent Projects' and 'Our Valued Clients' with button and mouse-wheel controls (`index.html`, `horizontal-scroll.css`, `main.js`).
-   **Interactive Contact Form**: (`contact.html`, `contact.js`, `server.py`)
    *   Client-side validation.
    *   Asynchronous submission using Fetch API to a backend.
    *   Real-time status updates (Sending, Success, Error) via `formStatus` element.
    *   Backend processing via Python Flask (sends email notification).
-   **Google Maps Integration**: Embedded maps showing Head Office and Branch Office locations (`contact.html`).
-   **Dedicated 404 Page**: Custom "Page Not Found" page (`404.html`).
-   **SEO Basics**:
    *   Relevant meta descriptions and keywords in page headers.
    *   `robots.txt` allowing indexing and pointing to sitemap.
    *   `sitemap.xml` listing key pages.
-   **Modular Codebase**:
    *   Well-structured HTML.
    *   Modular CSS using `@import` (`style.css` importing base, components, pages).
    *   Separated JavaScript files based on functionality (`main.js`, `animations.js`, `contact.js`, `transitions.js`).

## Project Structure
```
imrc/
├── 404.html
├── about.html
├── clients.html
├── contact.html
├── index.html
├── projects.html
├── README.md # This file
├── robots.txt
├── services.html
├── sitemap.xml
├── css/
│ ├── base.css
│ ├── style.css # Main stylesheet (imports others)
│ ├── components/
│ │ ├── buttons.css
│ │ ├── cards.css
│ │ ├── footer.css
│ │ ├── horizontal-scroll.css
│ │ ├── layout.css
│ │ ├── navigation.css
│ │ └── transitions.css
│ └── pages/
│ ├── about.css
│ ├── clients.css
│ ├── contact.css
│ ├── home.css
│ ├── projects.css
│ └── services.css
├── images/
│ └── test.png # Placeholder image
├── js/
│ ├── animations.js # Advanced animations (hero, particles, parallax, scroll reveal, GSAP)
│ ├── contact.js # Contact form logic (validation, fetch API)
│ ├── main.js # Core functionality (nav, basic scroll effects, horizontal scroll controls)
│ └── transitions.js # Page transition logic
└── python/ # Backend for contact form
├── server.py # Flask server application
└── requirements.txt # Python dependencies
```


## Setup and Installation

### Frontend

The frontend is built with vanilla HTML, CSS, and JavaScript. No build tools are required.

1.  Clone this repository:
    ```bash
    git clone <repository-url>
    cd <repository-folder-name>
    ```
2.  Open any of the `.html` files (e.g., `index.html`) directly in a modern web browser.

### Backend (Contact Form Processing)

The contact form (`contact.html`) relies on the Python Flask backend (`python/server.py`) to send email notifications.

1.  **Prerequisites:** Ensure you have Python 3.6+ and `pip` installed.
2.  **Navigate to Backend Directory:**
    ```bash
    cd python
    ```
3.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Set Environment Variable:** The backend requires the sender email's password to send notifications. Set it as an environment variable for security. **Important:** If using Gmail/Yahoo with 2FA, you'll likely need an "App Password". Replace `your_actual_email_app_password` below.
    *   **Linux/macOS:**
        ```bash
        export EMAIL_PASSWORD='your_actual_email_app_password'
        ```
    *   **Windows (Command Prompt):**
        ```cmd
        set EMAIL_PASSWORD=your_actual_email_app_password
        ```
    *   **Windows (PowerShell):**
        ```powershell
        $env:EMAIL_PASSWORD='your_actual_email_app_password'
        ```
    *   _Note: If `EMAIL_PASSWORD` is not set, the server will run but print the email content to the console instead of sending it (useful for development)._
5.  **Run the Server:**
    ```bash
    python server.py
    ```
    The server will start, typically on `http://localhost:5000`. The frontend `contact.js` file is configured to send requests to this address.

## Browser Compatibility

The website is designed and tested to be compatible with the latest versions of modern web browsers:
- Chrome
- Firefox
- Safari
- Edge
- Opera

Internet Explorer is not supported.

## Performance and Animations

-   **CSS:** Modular structure using `@import`, CSS variables for theming, and optimized selectors.
-   **JavaScript:** Code is separated into logical files. Scroll effects use the efficient `IntersectionObserver`. Advanced animations (`animations.js` using GSAP/ScrollTrigger) are conditionally initialized only on screens wider than 768px to improve performance on mobile.
-   **Page Transitions:** Hardware-accelerated CSS transforms are used for smooth slide transitions.
-   **Images:** Uses standard image loading. Further optimization (e.g., responsive images via `<picture>` or `srcset`, modern formats like WebP, lazy loading) could be implemented. Currently uses placeholder `images/test.png`.

## Dependencies & Credits

-   **Font Awesome**: Icons used throughout the site.
-   **Google Maps**: Used for embedding office location maps.
-   **GSAP (GreenSock Animation Platform)**: Used for advanced hero animations (`animations.js`).
-   **ScrollTrigger (GSAP Plugin)**: Used for scroll-based animations (`animations.js`).
-   **Flask**: Python microframework for the backend API (`python/server.py`).
-   **Flask-CORS**: Handles Cross-Origin Resource Sharing for the API (`python/server.py`).

## Copyright

© 2023 Indian Material Research Center. All rights reserved.
Designed and developed by Prajwal Ghadge.