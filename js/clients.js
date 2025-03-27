/**
 * Clients Management Script
 * Handles the display and management of client information
 */

document.addEventListener('DOMContentLoaded', function() {
    // Display clients on the clients page
    displayClients();
});

/**
 * Display clients on the clients page
 * Retrieves clients from localStorage and renders them on the page
 */
function displayClients() {
    const clientsGrid = document.getElementById('clientsGrid');
    if (!clientsGrid) return; // Check if we're on the clients page
    
    // Get clients from localStorage
    const clients = JSON.parse(localStorage.getItem('clients')) || getDefaultClients();
    
    // Save default clients if none exist
    if (!localStorage.getItem('clients')) {
        localStorage.setItem('clients', JSON.stringify(clients));
    }
    
    // Create client card elements
    let html = '';
    clients.forEach(client => {
        html += `
            <div class="client-card">
                <div class="client-logo">
                    <img src="${client.logo || 'images/test.png'}" alt="${client.name} Logo">
                </div>
                <h3>${client.name}</h3>
                ${client.description ? `<p>${client.description}</p>` : ''}
            </div>
        `;
    });
    
    clientsGrid.innerHTML = html;
}

/**
 * Generate default clients based on the provided information
 * @returns {Array} Array of client objects
 */
function getDefaultClients() {
    return [
        {
            id: 1,
            name: "MMRDA",
            logo: "images/test.png",
            description: "Mumbai Metropolitan Region Development Authority"
        },
        {
            id: 2,
            name: "Indian Railways",
            logo: "images/test.png"
        },
        {
            id: 3,
            name: "Konkan Railway Corporation",
            logo: "images/test.png"
        },
        {
            id: 4,
            name: "Mumbai Port Trust",
            logo: "images/test.png"
        },
        {
            id: 5,
            name: "CIDCO",
            logo: "images/test.png",
            description: "City and Industrial Development Corporation"
        },
        {
            id: 6,
            name: "Mumbai Municipal Corporation",
            logo: "images/test.png"
        },
        {
            id: 7,
            name: "L&T Geostructure",
            logo: "images/test.png"
        },
        {
            id: 8,
            name: "Thane Municipal Corporation",
            logo: "images/test.png",
            description: "TMC"
        },
        {
            id: 9,
            name: "Navi Mumbai Municipal Corporation",
            logo: "images/test.png",
            description: "NMMC"
        },
        {
            id: 10,
            name: "Mumbai Railway Vikas Corporation Ltd.",
            logo: "images/test.png",
            description: "MRVCL"
        }
    ];
} 