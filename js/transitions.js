// js/transitions.js

document.addEventListener('DOMContentLoaded', () => {
    const transitionPanel = document.getElementById('page-transition-panel');
    const allLinks = document.querySelectorAll('a'); // Get all links initially

    // --- Page Load Animation ---

    // Add initial state class immediately
    document.body.classList.add('page-loading');

    // Function to run the "reveal" animation on page load
    const revealPage = () => {
        if (!transitionPanel) return;

        // Ensure panel starts covering the screen before animation
        transitionPanel.classList.add('is-active');

        // Short delay to ensure CSS applies and transition triggers
        setTimeout(() => {
            // Remove loading state from body (allows content visibility)
            document.body.classList.remove('page-loading');
            // Optional: Add class to fade in body content if using that CSS
            // document.body.classList.add('page-loaded');

            // Start sliding the panel out
            transitionPanel.classList.add('is-leaving');
            transitionPanel.classList.remove('is-active');

            // Reset panel after animation finishes
            transitionPanel.addEventListener('transitionend', () => {
                transitionPanel.classList.remove('is-leaving');
            }, { once: true });

        }, 50); // Small delay (milliseconds)
    };

    // Start the reveal animation
    revealPage();


    // --- Navigation Link Handling ---

    allLinks.forEach(link => {
        // Check if the link is internal and not a hash link or special protocol
        const url = link.href;
        const isInternal = url.startsWith(window.location.origin) || url.startsWith('/') || !url.includes(':');
        const isHashLink = link.getAttribute('href')?.startsWith('#');
        const isDownload = link.hasAttribute('download');
        const isTargetBlank = link.target === '_blank';

        if (isInternal && !isHashLink && !isDownload && !isTargetBlank && url !== window.location.href) {
            link.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent immediate navigation

                if (!transitionPanel) {
                    // Fallback if panel doesn't exist
                    window.location.href = url;
                    return;
                }

                // Start the "cover" animation
                transitionPanel.classList.add('is-active');

                // Wait for the panel to cover the screen
                transitionPanel.addEventListener('transitionend', () => {
                    // Navigate to the new page *after* the screen is covered
                    window.location.href = url;
                }, { once: true });

                // Failsafe timeout in case transitionend doesn't fire
                setTimeout(() => {
                    window.location.href = url;
                }, 800); // Slightly longer than transition duration
            });
        }
    });
});