/**
 * Certificates Management Script
 * Handles the display of certificate information
 */

document.addEventListener('DOMContentLoaded', function() {
    // Display certificates on the certificates page
    displayCertificates();
    
    // Close modal when clicking on the overlay
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('certificate-modal')) {
            document.body.removeChild(e.target);
            document.body.style.overflow = 'auto';
        }
    });
});

/**
 * Display certificates on the certificates page
 * Retrieves certificates from localStorage and renders them on the page
 */
function displayCertificates() {
    const certificatesContainer = document.getElementById('certificatesContainer');
    if (!certificatesContainer) return; // Check if we're on the certificates page
    
    // Add default NABL certificate if not present
    const certificates = getNABLCertificate();
    
    // Create certificates grid
    const certGrid = document.createElement('div');
    certGrid.className = 'certificates-grid';
    certificatesContainer.appendChild(certGrid);
    
    // Create certificate elements
    certificates.forEach(cert => {
        const certDiv = document.createElement('div');
        certDiv.className = 'certificate-card';
        
        certDiv.innerHTML = `
            <div class="certificate-image">
                <img src="${cert.image || 'images/test.png'}" alt="${cert.name}" class="certificate-thumbnail">
            </div>
            <h3>${cert.name}</h3>
            <p>${cert.description}</p>
        `;
        
        // Add click listener to show larger image
        const img = certDiv.querySelector('.certificate-thumbnail');
        img.addEventListener('click', function() {
            showLargeImage(cert.image || 'images/test.png', cert.name);
        });
        
        certGrid.appendChild(certDiv);
    });
    
    // Additional certificates from localStorage
    const additionalCerts = JSON.parse(localStorage.getItem('certificates')) || [];
    
    // Add any additional certificates
    additionalCerts.forEach(cert => {
        const certDiv = document.createElement('div');
        certDiv.className = 'certificate-card';
        
        certDiv.innerHTML = `
            <div class="certificate-image">
                <img src="${cert.image || 'images/test.png'}" alt="${cert.name}" class="certificate-thumbnail">
            </div>
            <h3>${cert.name}</h3>
            <p>${cert.description}</p>
        `;
        
        // Add click listener to show larger image
        const img = certDiv.querySelector('.certificate-thumbnail');
        img.addEventListener('click', function() {
            showLargeImage(cert.image || 'images/test.png', cert.name);
        });
        
        certGrid.appendChild(certDiv);
    });
}

/**
 * Show Large Image View
 * Creates a modal to display a larger version of the certificate image
 * @param {string} imageSrc - The source of the image to display
 * @param {string} name - The name of the certificate
 */
function showLargeImage(imageSrc, name) {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'certificate-modal';
    
    // Create modal content
    modal.innerHTML = `
        <div class="certificate-modal-content">
            <span class="close-modal">&times;</span>
            <h3>${name}</h3>
            <img src="${imageSrc}" alt="${name}">
        </div>
    `;
    
    // Add close button functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    });
    
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
    
    // Add to document
    document.body.appendChild(modal);
}

/**
 * Get NABL Certificate
 * Returns the default NABL certificate for the certificates page
 * @returns {Array} - Array containing the NABL certificate object
 */
function getNABLCertificate() {
    return [
        {
            name: "NABL Accreditation",
            description: "IMRC Labs is a government-approved laboratory accredited as per ISO/IEC 17025 by the National Accreditation Board for Testing and Calibration Laboratories (NABL). This accreditation demonstrates our technical competence and commitment to providing accurate and reliable testing services.",
            image: "images/test.png"
        }
    ];
} 