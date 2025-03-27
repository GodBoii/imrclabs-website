/**
 * Admin Dashboard JavaScript
 * Handles admin dashboard functionality including real-time statistics
 * and management of projects, clients, messages and certificates
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }
    
    // Set admin name
    const adminEmail = localStorage.getItem('adminEmail');
    document.getElementById('adminName').textContent = adminEmail ? adminEmail.split('@')[0] : 'Admin';
    
    // Initialize dashboard counters
    updateCounters();
    
    // Display recent activity
    updateRecentActivity();
    
    // Load existing data
    displayMessages();
    displayProjects();
    displayClients();
    displayCertificates();
    
    // Handle forms
    initForms();
    
    // Set up logout
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Set up navigation
    setupNavigation();
});

/**
 * Update dashboard counters with real data
 */
function updateCounters() {
    // Projects counter
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    document.getElementById('projectCount').textContent = projects.length;
    
    // Clients counter
    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    document.getElementById('clientCount').textContent = clients.length;
    
    // Messages counter
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    const unreadMessages = messages.filter(msg => !msg.read).length;
    document.getElementById('messageCount').textContent = unreadMessages;
    
    // Certificates counter
    const certificates = JSON.parse(localStorage.getItem('certificates')) || [];
    document.getElementById('certificateCount').textContent = certificates.length;
}

/**
 * Update recent activity feed
 */
function updateRecentActivity() {
    const activityContainer = document.getElementById('recentActivity');
    if (!activityContainer) return;
    
    // Clear existing content
    activityContainer.innerHTML = '';
    
    const activities = [];
    
    // Get 3 most recent messages
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    messages.slice(0, 3).forEach(msg => {
        activities.push({
            type: 'message',
            text: `New message from ${msg.name}: "${msg.subject}"`,
            date: new Date(msg.date)
        });
    });
    
    // Get 3 most recent projects
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    projects.slice(0, 3).forEach(project => {
        activities.push({
            type: 'project',
            text: `Project added: ${project.name}`,
            date: new Date(project.id) // Using ID as timestamp
        });
    });
    
    // Sort by date (newest first)
    activities.sort((a, b) => b.date - a.date);
    
    // Display activities or fallback message
    if (activities.length > 0) {
        activities.slice(0, 5).forEach(activity => {
            const li = document.createElement('li');
            li.textContent = activity.text;
            
            // Add icon based on type
            const icon = document.createElement('i');
            icon.className = activity.type === 'message' 
                ? 'fas fa-envelope' 
                : 'fas fa-project-diagram';
            icon.style.marginRight = '10px';
            li.prepend(icon);
            
            activityContainer.appendChild(li);
        });
    } else {
        activityContainer.innerHTML = '<li>No recent activity to display.</li>';
    }
}

/**
 * Display messages from localStorage
 */
function displayMessages() {
    const messagesList = document.getElementById('messagesList');
    if (!messagesList) return;
    
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    
    if (messages.length === 0) {
        messagesList.innerHTML = '<p>No messages yet.</p>';
        return;
    }
    
    let html = '';
    messages.forEach((msg, index) => {
        const date = new Date(msg.date).toLocaleString();
        html += `
            <div class="message-card ${msg.read ? 'read' : 'unread'}">
                <div class="message-header">
                    <h3>${msg.subject}</h3>
                    <span class="message-date">${date}</span>
                </div>
                <p><strong>From:</strong> ${msg.name} (${msg.email})</p>
                <p><strong>Phone:</strong> ${msg.phone}</p>
                <div class="message-body">
                    <p>${msg.message}</p>
                </div>
                <div class="message-actions">
                    <button class="btn btn-primary" onclick="markAsRead(${index})">
                        ${msg.read ? 'Mark as Unread' : 'Mark as Read'}
                    </button>
                    <button class="btn btn-danger" onclick="deleteMessage(${index})">Delete</button>
                </div>
            </div>
        `;
    });
    
    messagesList.innerHTML = html;
}

/**
 * Mark a message as read/unread
 * @param {number} index - Index of the message
 */
function markAsRead(index) {
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    if (index >= 0 && index < messages.length) {
        messages[index].read = !messages[index].read;
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        displayMessages();
        updateCounters();
        updateRecentActivity();
    }
}

/**
 * Delete a message
 * @param {number} index - Index of the message
 */
function deleteMessage(index) {
    if (confirm('Are you sure you want to delete this message?')) {
        const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        if (index >= 0 && index < messages.length) {
            messages.splice(index, 1);
            localStorage.setItem('contactMessages', JSON.stringify(messages));
            displayMessages();
            updateCounters();
            updateRecentActivity();
        }
    }
}

/**
 * Display clients from localStorage
 */
function displayClients() {
    const clientsList = document.getElementById('clientsList');
    if (!clientsList) return;
    
    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    
    if (clients.length === 0) {
        clientsList.innerHTML = '<p>No clients added yet.</p>';
        return;
    }
    
    let html = '<div class="clients-admin-grid">';
    clients.forEach((client, index) => {
        html += `
            <div class="client-admin-card" data-id="${client.id}">
                <button class="delete-btn" onclick="deleteClient(${client.id})">
                    <i class="fas fa-trash-alt"></i> Delete
                </button>
                <img src="${client.logo || '../images/test.png'}" alt="${client.name}">
                <h3>${client.name}</h3>
                ${client.description ? `<p>${client.description}</p>` : ''}
            </div>
        `;
    });
    html += '</div>';
    
    clientsList.innerHTML = html;
}

/**
 * Delete a client
 * @param {number} id - ID of the client to delete
 */
function deleteClient(id) {
    if (confirm('Are you sure you want to delete this client?')) {
        let clients = JSON.parse(localStorage.getItem('clients')) || [];
        clients = clients.filter(client => client.id !== id);
        localStorage.setItem('clients', JSON.stringify(clients));
        displayClients();
        updateCounters();
    }
}

/**
 * Display certificates from localStorage
 */
function displayCertificates() {
    const certificatesList = document.getElementById('certificatesList');
    if (!certificatesList) return;
    
    const certificates = JSON.parse(localStorage.getItem('certificates')) || [];
    
    if (certificates.length === 0) {
        certificatesList.innerHTML = '<p>No certificates added yet.</p>';
        return;
    }
    
    let html = '<div class="certificates-grid">';
    certificates.forEach((cert, index) => {
        html += `
            <div class="certificate-card" data-id="${cert.id}">
                <button class="delete-btn" onclick="deleteCertificate(${cert.id})">
                    <i class="fas fa-trash-alt"></i> Delete
                </button>
                <img src="${cert.image || '../images/test.png'}" alt="${cert.name}">
                <h3>${cert.name}</h3>
                <p>${cert.description}</p>
            </div>
        `;
    });
    html += '</div>';
    
    certificatesList.innerHTML = html;
}

/**
 * Delete a certificate
 * @param {number} id - ID of the certificate to delete
 */
function deleteCertificate(id) {
    if (confirm('Are you sure you want to delete this certificate?')) {
        let certificates = JSON.parse(localStorage.getItem('certificates')) || [];
        certificates = certificates.filter(cert => cert.id !== id);
        localStorage.setItem('certificates', JSON.stringify(certificates));
        displayCertificates();
        updateCounters();
    }
}

/**
 * Initialize forms with event listeners
 */
function initForms() {
    // Project form
    const projectForm = document.getElementById('addProjectForm');
    if (projectForm) {
        projectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addProject();
        });
    }
    
    // Client form
    const clientForm = document.getElementById('addClientForm');
    if (clientForm) {
        clientForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addClient();
        });
    }
    
    // Certificate form
    const certificateForm = document.getElementById('addCertificateForm');
    if (certificateForm) {
        certificateForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addCertificate();
        });
    }
    
    // Settings form
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Settings updated successfully! (Note: This is a demo, no actual changes are saved)');
        });
    }
}

/**
 * Add a new project
 */
function addProject() {
    const projectName = document.getElementById('projectName').value;
    const clientName = document.getElementById('clientName').value;
    const projectYear = document.getElementById('projectYear').value;
    const projectDescription = document.getElementById('projectDescription').value;
    const projectImageInput = document.getElementById('projectImage');
    
    let projectImage = '';
    
    // Handle image upload if file is selected
    if (projectImageInput.files && projectImageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            projectImage = e.target.result;
            saveProject(projectName, clientName, projectYear, projectDescription, projectImage);
        };
        reader.readAsDataURL(projectImageInput.files[0]);
    } else {
        // No image selected, proceed with default
        saveProject(projectName, clientName, projectYear, projectDescription, projectImage);
    }
}

/**
 * Save project to localStorage
 */
function saveProject(name, client, year, description, image) {
    const project = {
        id: Date.now(),
        name: name,
        client: client,
        year: year,
        description: description,
        image: image || ''
    };
    
    // Save to localStorage
    let projects = JSON.parse(localStorage.getItem('projects')) || [];
    projects.push(project);
    localStorage.setItem('projects', JSON.stringify(projects));
    
    // Reset form
    document.getElementById('addProjectForm').reset();
    
    // Update UI
    displayProjects();
    updateCounters();
    updateRecentActivity();
    
    alert('Project added successfully!');
}

/**
 * Display projects from localStorage
 */
function displayProjects() {
    const projectsList = document.getElementById('projectsList');
    if (!projectsList) return;
    
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    
    if (projects.length === 0) {
        projectsList.innerHTML = '<p>No projects added yet.</p>';
        return;
    }
    
    let html = '<div class="projects-admin-list">';
    
    projects.forEach(project => {
        html += `
            <div class="project-admin-entry" data-id="${project.id}">
                <div class="project-admin-image">
                    <img src="${project.image || '../images/test.png'}" alt="${project.name}">
                </div>
                <div class="project-admin-content">
                    <h3>${project.name}</h3>
                    <p><strong>Client:</strong> ${project.client}</p>
                    <p><strong>Year:</strong> ${project.year}</p>
                    <p>${project.description}</p>
                    <button class="delete-btn" onclick="deleteProject(${project.id})">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    projectsList.innerHTML = html;
}

/**
 * Add a new client
 */
function addClient() {
    const clientName = document.getElementById('clientFullName').value;
    const clientDescription = document.getElementById('clientDescription').value;
    const clientLogoInput = document.getElementById('clientLogo');
    
    let clientLogo = '';
    
    // Handle logo upload if file is selected
    if (clientLogoInput.files && clientLogoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            clientLogo = e.target.result;
            saveClient(clientName, clientDescription, clientLogo);
        };
        reader.readAsDataURL(clientLogoInput.files[0]);
    } else {
        // No logo selected, proceed with default
        saveClient(clientName, clientDescription, clientLogo);
    }
}

/**
 * Save client to localStorage
 */
function saveClient(name, description, logo) {
    const client = {
        id: Date.now(),
        name: name,
        description: description,
        logo: logo || ''
    };
    
    // Save to localStorage
    let clients = JSON.parse(localStorage.getItem('clients')) || [];
    clients.push(client);
    localStorage.setItem('clients', JSON.stringify(clients));
    
    // Reset form
    document.getElementById('addClientForm').reset();
    
    // Update UI
    displayClients();
    updateCounters();
    
    alert('Client added successfully!');
}

/**
 * Add a new certificate
 */
function addCertificate() {
    const certificateName = document.getElementById('certificateName').value;
    const certificateDescription = document.getElementById('certificateDescription').value;
    const certificateImageInput = document.getElementById('certificateImage');
    
    let certificateImage = '';
    
    // Handle image upload if file is selected
    if (certificateImageInput.files && certificateImageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            certificateImage = e.target.result;
            saveCertificate(certificateName, certificateDescription, certificateImage);
        };
        reader.readAsDataURL(certificateImageInput.files[0]);
    } else {
        // Certificate image is required
        alert('Please select a certificate image.');
    }
}

/**
 * Save certificate to localStorage
 */
function saveCertificate(name, description, image) {
    const certificate = {
        id: Date.now(),
        name: name,
        description: description,
        image: image
    };
    
    // Save to localStorage
    let certificates = JSON.parse(localStorage.getItem('certificates')) || [];
    certificates.push(certificate);
    localStorage.setItem('certificates', JSON.stringify(certificates));
    
    // Reset form
    document.getElementById('addCertificateForm').reset();
    
    // Update UI
    displayCertificates();
    updateCounters();
    
    alert('Certificate added successfully!');
}

/**
 * Set up navigation between dashboard sections
 */
function setupNavigation() {
    const navLinks = document.querySelectorAll('.admin-menu a[data-section]');
    const sections = document.querySelectorAll('.admin-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected section, hide others
            sections.forEach(section => {
                if (section.id === targetSection) {
                    section.classList.remove('hidden');
                } else {
                    section.classList.add('hidden');
                }
            });
            
            // Update header title
            document.querySelector('.admin-header h1').textContent = this.querySelector('span').textContent;
        });
    });
}

/**
 * Log out the user
 */
function logout() {
    if (confirm('Are you sure you want to log out?')) {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminEmail');
        window.location.href = 'login.html';
    }
} 