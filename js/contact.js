document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Reset status
        formStatus.textContent = '';
        formStatus.className = '';
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };
        
        // Validate form
        const errors = [];
        if (!formData.name) errors.push('Name is required');
        if (!formData.email) errors.push('Email is required');
        if (!formData.message) errors.push('Message is required');
        
        if (formData.email && !isValidEmail(formData.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (errors.length > 0) {
            showErrors(errors);
            return;
        }
        
        // Show loading
        formStatus.textContent = 'Sending...';
        formStatus.className = 'form-status info';
        
        try {
            // Send to backend
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Success
                formStatus.textContent = 'Your message has been sent. We will contact you shortly!';
                formStatus.className = 'form-status success';
                contactForm.reset();
            } else {
                // API Error
                formStatus.textContent = data.error || 'Something went wrong. Please try again.';
                formStatus.className = 'form-status error';
            }
        } catch (error) {
            // Network Error
            console.error('Error submitting form:', error);
            formStatus.textContent = 'Unable to connect to server. Please try again later.';
            formStatus.className = 'form-status error';
        }
    });
    
    // Helpers
    function showErrors(errors) {
        formStatus.innerHTML = errors.map(error => `<div>${error}</div>`).join('');
        formStatus.className = 'form-status error';
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}); 