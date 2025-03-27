# IMRC - Indian Material Research Center Website

A modern, responsive, and feature-rich website built for the Indian Material Research Center (IMRC), showcasing their material testing and research services. This project utilizes vanilla HTML, CSS, and JavaScript for the frontend, coupled with a Python Flask backend for contact form processing.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Browser Compatibility](#browser-compatibility)
- [Performance and Animations](#performance-and-animations)
- [Credits](#credits)

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

-   **Responsive Design**: Adapts seamlessly across desktops, laptops, tablets, and mobile devices.
-   **Modern UI/UX**: Clean, professional design using CSS variables, a well-defined color scheme, and intuitive navigation.
-   **Smooth Page Transitions**: Full-screen slide transitions between page loads for a fluid experience.
-   **Engaging Animations**:
    -   Scroll-triggered "appear" animations for various elements (using Intersection Observer).
    *   Advanced hero section animations (on larger screens): subtle floating text, background parallax, interactive mouse-follow effect, and a canvas-based particle system.
-   **Comprehensive Service Display**: Detailed, categorized listing of all testing services offered by IMRC.
-   **Project Showcase**: Dedicated page featuring detailed descriptions, metadata, services provided, and image galleries for key projects.
-   **Client Showcase**: Displays client logos in categorized grids, along with client testimonials.
-   **Interactive Contact Form**:
    *   Client-side validation using JavaScript.
    *   Asynchronous submission to a backend API.
    *   Real-time status updates (sending, success, error).
    *   Backend processing via Python Flask (sends email notification).
-   **Google Maps Integration**: Embedded maps showing Head Office and Branch Office locations on the Contact page.
-   **Dedicated 404 Page**: Custom "Page Not Found" page for better user experience.
-   **Basic SEO**: Includes relevant meta descriptions and keywords in page headers.
-   **Modular Codebase**: Well-structured HTML, modular CSS (`@import` structure), and separated JavaScript files based on functionality.

## Project Structure
```
imrc/
├── index.html # Home page
├── about.html # About page
├── services.html # Services page
├── projects.html # Projects page
├── clients.html # Clients page
├── contact.html # Contact page
├── 404.html # Page Not Found page
├── css/
│ ├── style.css # Main stylesheet (imports others)
│ ├── base.css # Base styles, variables, resets
│ ├── components/
│ │ ├── buttons.css
│ │ ├── cards.css
│ │ ├── footer.css
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
├── js/
│ ├── main.js # Core functionality (nav, scroll effects)
│ ├── animations.js # Advanced animations (hero, particles, parallax)
│ ├── contact.js # Contact form specific logic (validation, fetch API)
│ └── transitions.js # Page transition logic
├── images/ # Image assets (e.g., test.png)
├── python/ # Backend for contact form
│ ├── server.py # Flask server application
│ └── requirements.txt # Python dependencies
├── context.txt # Source text content (reference)
├── plan.txt # Project Implementation Summary (this file)
└── README.md # Project README (this file)
```


## Setup and Installation

### Frontend

The frontend is built with vanilla HTML, CSS, and JavaScript. No build tools are required.

1.  Clone this repository:
    ```bash
    git clone <repository-url>
    cd imrc
    ```
2.  Open any of the `.html` files (e.g., `index.html`) directly in a web browser.

### Backend (Contact Form Processing)

The contact form relies on a Python Flask backend to send email notifications.

1.  **Prerequisites:** Ensure you have Python 3.6+ and `pip` installed.
2.  **Navigate to Backend Directory:**
    ```bash
    cd python
    ```
3.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Set Environment Variable:** The backend requires the email password to send notifications. Set it as an environment variable for security (replace `your_actual_yahoo_app_password` with an App Password if using Yahoo Mail with 2FA):
    *   Linux/macOS:
        ```bash
        export EMAIL_PASSWORD='your_actual_yahoo_app_password'
        ```
    *   Windows (Command Prompt):
        ```cmd
        set EMAIL_PASSWORD=your_actual_yahoo_app_password
        ```
    *   Windows (PowerShell):
        ```powershell
        $env:EMAIL_PASSWORD='your_actual_yahoo_app_password'
        ```
    *Note: If `EMAIL_PASSWORD` is not set, the server will run in development mode and print the email content to the console instead of sending it.*
5.  **Run the Server:**
    ```bash
    python server.py
    ```
    The server will start, typically on `http://localhost:5000`. The contact form frontend (`contact.js`) is configured to send requests to this address.

## Browser Compatibility

The website is designed and tested to be compatible with the latest versions of modern web browsers:
- Chrome
- Firefox
- Safari
- Edge
- Opera

## Performance and Animations

-   **CSS:** Modular structure using `@import`, CSS variables for theming, and optimized selectors.
-   **JavaScript:** Code is separated into logical files. Scroll effects use the efficient `IntersectionObserver`. Advanced animations (`animations.js`) are conditionally loaded only on screens wider than 768px to improve performance on mobile.
-   **Page Transitions:** Hardware-accelerated CSS transforms are used for smooth slide transitions.
-   **Images:** Standard image loading; further optimization (e.g., responsive images, modern formats like WebP) could be implemented if needed.

## Credits

-   **Font Awesome**: Icons used throughout the site.
-   **Google Maps**: Used for embedding office location maps.
-   **Flask**: Python microframework for the backend API.
-   **Flask-CORS**: Handles Cross-Origin Resource Sharing for the API.

---

© 2023 Indian Material Research Center. All rights reserved.