/**
 * projects.js
 * Handles project management functionality for IMRC Labs website
 * 
 * This file includes:
 * - Admin authentication (login/logout)
 * - Project management (add/display projects)
 * - LocalStorage interaction for project data persistence
 */

/**
 * Check Login Status
 * Verifies if user is logged in before allowing access to admin dashboard
 * Redirects to login page if not authenticated
 */
function checkLoginStatus() {
    const loggedIn = localStorage.getItem('loggedIn');
    if (!loggedIn) {
        window.location.href = 'login.html'; // Redirect to login page if not logged in
    }
}
  
/**
 * Admin Login
 * Authenticates user with simple email/password verification
 * Note: In production, this should use server-side authentication
 */
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginMessage = document.getElementById('loginMessage'); // Get the message element

    // Simple authentication (replace with secure server-side auth in production)
    if (email === 'prajwalghadge2005@gmail.com' && password === 'password') {
        localStorage.setItem('loggedIn', 'true');
        window.location.href = 'dashboard.html';
    } else {
        loginMessage.textContent = 'Invalid credentials. Please try again.'; // Display error message
        loginMessage.style.color = 'red'; // Set error message color
    }
}
  
/**
 * Admin Logout
 * Ends user session and redirects to login page
 */
function logout() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'login.html';
}

/**
 * Add Project
 * Creates a new project entry and saves it to localStorage
 * Validates input fields and displays the updated project list
 */
function addProject() {
    // Get project details from form
    const projectName = document.getElementById('projectName').value;
    const clientName = document.getElementById('clientName').value;
    const projectYear = document.getElementById('projectYear').value;
    const projectDescription = document.getElementById('projectDescription').value;

    // Validate required fields
    if (!projectName || !clientName || !projectYear) {
        document.getElementById('addProjectMessage').textContent = "Enter All Details";
        alert('Please fill in all fields.');
        return;
    }
    document.getElementById('addProjectMessage').textContent = "";
    
    // Create project object
    const project = {
        name: projectName,
        client: clientName,
        year: projectYear,
        description: projectDescription
    };

    // Save to localStorage
    let projects = JSON.parse(localStorage.getItem('projects')) || [];
    projects.push(project);
    localStorage.setItem('projects', JSON.stringify(projects));

    // Clear the form fields
    document.getElementById('projectName').value = '';
    document.getElementById('clientName').value = '';
    document.getElementById('projectYear').value = '';
    document.getElementById('projectDescription').value = '';

    // Update displayed projects
    displayProjects();
}
  
/**
 * Display Projects
 * Retrieves projects from localStorage and renders them on the projects page
 * Creates HTML elements for each project entry
 */
function displayProjects() {
    const projectsList = document.getElementById('projectsList');
    if (!projectsList) return; // Check if we're on the projects page
    
    // Clear existing projects
    projectsList.innerHTML = ''; 
    
    // Get projects from localStorage
    const projects = JSON.parse(localStorage.getItem('projects')) || getDefaultProjects();
    
    // Save default projects if none exist
    if (!localStorage.getItem('projects')) {
        localStorage.setItem('projects', JSON.stringify(projects));
    }
    
    // Check if we're on the admin page
    const isAdminPage = window.location.href.includes('admin');
    
    // Create project entry elements
    projects.forEach((project, index) => {
        const projectEntry = document.createElement('div');
        projectEntry.classList.add('project-entry');
        
        if (isAdminPage) {
            // Admin dashboard view
            projectEntry.innerHTML = `
                <div class="project-admin-entry">
                    <div class="project-admin-image">
                        <img src="${project.image || '../images/test.png'}" alt="${project.name}">
                    </div>
                    <div class="project-admin-content">
                        <h3>${project.name}</h3>
                        <p><strong>Client:</strong> ${project.client}</p>
                        <p><strong>Year:</strong> ${project.year || 'N/A'}</p>
                        <p><strong>Description:</strong> ${project.description}</p>
                        <div class="project-actions">
                            <button class="btn btn-danger delete-project" data-index="${index}">Delete Project</button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Regular projects page view
            projectEntry.innerHTML = `
                <img src="${project.image || 'images/test.png'}" alt="${project.name}">
                <h3>${project.name}</h3>
                <p><strong>Client:</strong> ${project.client}</p>
                <p><strong>Year:</strong> ${project.year || 'N/A'}</p>
                <p><strong>Description:</strong> ${project.description}</p>
            `;
        }
        
        projectsList.appendChild(projectEntry);
    });
    
    // Add event listeners to delete buttons if on admin page
    if (isAdminPage) {
        const deleteButtons = document.querySelectorAll('.delete-project');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                deleteProject(index);
            });
        });
    }
}

/**
 * Delete Project
 * Removes a project from localStorage and updates the display
 * @param {number} index - The index of the project to delete
 */
function deleteProject(index) {
    // Get projects from localStorage
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    
    // Confirm deletion
    if (confirm('Are you sure you want to delete this project?')) {
        // Remove the project at the specified index
        projects.splice(index, 1);
        
        // Save updated projects to localStorage
        localStorage.setItem('projects', JSON.stringify(projects));
        
        // Update the projects display
        displayProjects();
        
        // Update project count on dashboard
        updateDashboardCounts();
    }
}

/**
 * Update Dashboard Counts
 * Updates the counts displayed on the admin dashboard
 */
function updateDashboardCounts() {
    const projectCountEl = document.getElementById('projectCount');
    if (projectCountEl) {
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        projectCountEl.textContent = projects.length;
    }
    
    const clientCountEl = document.getElementById('clientCount');
    if (clientCountEl) {
        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        clientCountEl.textContent = clients.length;
    }
    
    const messageCountEl = document.getElementById('messageCount');
    if (messageCountEl) {
        const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        const unreadCount = messages.filter(msg => !msg.read).length;
        messageCountEl.textContent = unreadCount;
    }
    
    const certificateCountEl = document.getElementById('certificateCount');
    if (certificateCountEl) {
        const certificates = JSON.parse(localStorage.getItem('certificates')) || [];
        certificateCountEl.textContent = certificates.length;
    }
}

/**
 * Generate default projects based on the provided information
 * @returns {Array} Array of project objects
 */
function getDefaultProjects() {
    return [
        {
            id: 1,
            name: "High-Speed Rail Project - Geotechnical Investigation",
            client: "Confidential Client",
            year: "2023",
            description: "IMRC Labs conducted a comprehensive geotechnical investigation for a segment of the Mumbai-Ahmedabad High-Speed Rail project. This included soil testing, borehole logging, and analysis to determine the safe bearing capacity of the soil for the proposed rail infrastructure. Our findings provided critical data for the project's foundation design, ensuring the long-term stability and safety of the high-speed rail line.",
            image: "images/test.png"
        },
        {
            id: 2,
            name: "Floating Solar Power Projects",
            client: "Confidential Client",
            year: "2022",
            description: "IMRC Labs provided material testing and quality assurance services for floating solar power projects in Odisha and Jharkhand. This involved testing the durability and performance of materials used in the construction of the floating platforms.",
            image: "images/test.png"
        },
        {
            id: 3,
            name: "Structural Audits & Material Testing",
            client: "Various Clients",
            year: "2021-2023",
            description: "IMRC Labs has conducted numerous structural audits and material testing projects for bridges, highways, and commercial buildings across India. Our services help clients assess the condition of their structures and ensure their continued safety and serviceability.",
            image: "images/test.png"
        }
    ];
}

/**
 * Initialize Page-Specific Functionality
 * Checks current page and initializes appropriate functions
 */
if (window.location.pathname.includes('admin/dashboard.html')) {
    checkLoginStatus(); // Ensure user is logged in for dashboard access
} else if(window.location.pathname.includes('admin/login.html')) {
    // Login page - no initialization needed
} else if (window.location.pathname.includes('projects.html')) {
    displayProjects(); // Display projects on projects page
}

document.addEventListener('DOMContentLoaded', function() {
    // Display projects on the projects page
    displayProjects();
});