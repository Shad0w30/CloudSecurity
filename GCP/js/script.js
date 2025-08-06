// GCP-specific JavaScript can go here
// Most functionality is inherited from common.js

// Initialize GCP-specific elements
document.addEventListener('DOMContentLoaded', function() {
    // Set metadata from JSON
    const versionElement = document.getElementById('versionNumber');
    const dateElement = document.getElementById('updateDate');
    
    if (versionElement && dateElement) {
        loadSecurityControls().then(data => {
            versionElement.textContent = data.metadata.version;
            dateElement.textContent = data.metadata.lastUpdated;
        });
    }
});
