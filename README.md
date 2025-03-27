# IMRC - Indian Material Research Center Website

A modern, responsive, and visually appealing website for the Indian Material Research Center (IMRC), a leading organization specializing in material testing and research.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Backend](#backend)
- [Browser Compatibility](#browser-compatibility)
- [Performance Optimization](#performance-optimization)
- [Credits](#credits)

## Overview

This website serves as the digital platform for IMRC, presenting their services, projects, clients, and contact information in a user-friendly interface. The website features a modern design, responsive layout, and smooth animations to provide a superior user experience.

### Company Information

**Indian Material Research Center (IMRC)**
- Established: 2013
- Headquarters: Kharghar, Navi Mumbai
- Branch Office: Vikhroli East, Mumbai
- Specializes in: Material testing, Geotechnical Investigation, NDT, and more
- Contact: imrc.analysis@yahoo.in | +91 9819446242 / +91 7972209934

## Features

- **Responsive Design**: Fully responsive layout that adapts to all screen sizes (mobile, tablet, laptop, desktop)
- **Modern UI**: Clean and professional design with a color scheme that inspires trust and precision
- **Animated Elements**: Subtle animations for enhanced user experience
- **Interactive Elements**: Dynamic navigation, form validation, accordions, and more
- **Performance Optimized**: Fast loading, optimized images, and efficient code
- **Contact Form**: Client-side validated form with backend integration capability
- **Google Maps Integration**: Office locations displayed with embedded Google Maps
- **SEO Friendly**: Proper meta tags, structured content, and semantic HTML

## Project Structure

```
imrc/
├── index.html               # Home page
├── about.html               # About page
├── services.html            # Services page
├── projects.html            # Projects page
├── clients.html             # Clients page
├── contact.html             # Contact page
├── css/
│   └── style.css            # Main stylesheet
├── js/
│   ├── main.js              # Main JavaScript functionality
│   └── animations.js        # Animation specific JavaScript
├── images/                  # Image assets
└── python/                  # Backend for contact form
    ├── server.py            # Flask server
    └── requirements.txt     # Python dependencies
```

## Setup and Installation

### Frontend

The website is built with vanilla HTML, CSS, and JavaScript, requiring no build tools or dependencies. To run the website locally:

1. Clone this repository
2. Open any of the HTML files in a web browser

### Backend (Optional)

The contact form backend is built with Flask. To set up:

1. Install Python 3.6+
2. Navigate to the python directory
3. Install dependencies: `pip install -r requirements.txt`
4. Set environment variables:
   ```
   export EMAIL_PASSWORD=your_email_password
   export PORT=5000  # Optional, defaults to 5000
   ```
5. Run the server: `python server.py`

## Browser Compatibility

The website is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## Performance Optimization

- **Image Optimization**: All images are optimized for web
- **CSS Efficiency**: Minimized CSS redundancy
- **JavaScript Performance**: Non-blocking scripts, efficient DOM manipulation
- **Animation Performance**: Hardware-accelerated animations for smooth performance
- **Responsive Images**: Appropriate image sizes for different screen resolutions

## Credits

- **Font Awesome**: Icons used throughout the site
- **Google Fonts**: Typography
- **Google Maps**: Office location embeds

---

© 2023 Indian Material Research Center. All rights reserved. 