// Fetch data from JSON file
async function loadSecurityControls() {
    try {
        const response = await fetch('data/controls.json');
        return await response.json();
    } catch (error) {
        console.error('Error loading security controls:', error);
        return null;
    }
}

// Create cloud background
function createClouds() {
    const cloudBg = document.getElementById('cloudBackground');
    for (let i = 0; i < 20; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        
        // Random size
        const size = Math.random() * 200 + 50;
        cloud.style.width = `${size}px`;
        cloud.style.height = `${size * 0.6}px`;
        
        // Random position
        cloud.style.left = `${Math.random() * 100}%`;
        cloud.style.top = `${Math.random() * 100}%`;
        
        // Random opacity
        cloud.style.opacity = Math.random() * 0.5 + 0.3;
        
        // Random animation
        const duration = Math.random() * 60 + 60;
        cloud.style.animationDuration = `${duration}s`;
        
        cloudBg.appendChild(cloud);
    }
}

// Generate tabs from data
function generateTabs(categories) {
    const tabsContainer = document.getElementById('tabsContainer');
    tabsContainer.innerHTML = '';
    
    categories.forEach(category => {
        const tab = document.createElement('div');
        tab.className = 'tab';
        tab.setAttribute('data-tab', category.id);
        tab.textContent = category.name;
        tabsContainer.appendChild(tab);
    });
    
    // Set first tab as active
    if (categories.length > 0) {
        tabsContainer.firstChild.classList.add('active');
    }
}

// Generate content from data
function generateContent(categories) {
    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = '';
    
    categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.id = category.id;
        
        const heading = document.createElement('h2');
        heading.textContent = category.name;
        categoryDiv.appendChild(heading);
        
        const subtitle = document.createElement('p');
        subtitle.textContent = category.description;
        categoryDiv.appendChild(subtitle);
        
        category.domains.forEach(domain => {
            const domainDiv = document.createElement('div');
            domainDiv.className = 'security-domain';
            
            const domainHeading = document.createElement('h3');
            
            // Add icon if available
            if (domain.icon) {
                const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                iconSvg.setAttribute('fill', 'none');
                iconSvg.setAttribute('viewBox', '0 0 24 24');
                iconSvg.setAttribute('stroke', 'currentColor');
                iconSvg.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${domain.icon}" />`;
                domainHeading.appendChild(iconSvg);
            }
            
            domainHeading.appendChild(document.createTextNode(domain.name));
            domainDiv.appendChild(domainHeading);
            
            const controlsGrid = document.createElement('div');
            controlsGrid.className = 'controls-grid';
            
            domain.controls.forEach(control => {
                const controlCard = document.createElement('div');
                controlCard.className = 'control-card';
                
                const controlHeading = document.createElement('h4');
                controlHeading.textContent = control.name;
                controlCard.appendChild(controlHeading);
                
                const controlList = document.createElement('ul');
                control.items.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    controlList.appendChild(li);
                });
                controlCard.appendChild(controlList);
                
                if (control.maturity) {
                    const maturityDiv = document.createElement('div');
                    maturityDiv.className = 'maturity-level';
                    
                    control.maturity.forEach(level => {
                        const span = document.createElement('span');
                        span.className = `maturity-${level.toLowerCase()}`;
                        span.textContent = level;
                        maturityDiv.appendChild(span);
                    });
                    
                    controlCard.appendChild(maturityDiv);
                }
                
                controlsGrid.appendChild(controlCard);
            });
            
            domainDiv.appendChild(controlsGrid);
            categoryDiv.appendChild(domainDiv);
        });
        
        contentArea.appendChild(categoryDiv);
    });
    
    // Set first category as active
    if (categories.length > 0) {
        document.getElementById(categories[0].id).classList.add('active');
    }
}

// Initialize tab functionality
function initTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            document.querySelectorAll('.tab').forEach(t => {
                t.classList.remove('active');
            });
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Hide all categories
            document.querySelectorAll('.category').forEach(cat => {
                cat.classList.remove('active');
            });
            
            // Show selected category
            const categoryId = tab.getAttribute('data-tab');
            document.getElementById(categoryId).classList.add('active');
        });
    });
}

// Initialize search functionality
function initSearch() {
    document.getElementById('searchBox').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm.length < 3) {
            // Show all if search term is too short
            document.querySelectorAll('.control-card').forEach(el => {
                el.style.display = 'block';
            });
            return;
        }
        
        document.querySelectorAll('.control-card').forEach(el => {
            const text = el.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                el.style.display = 'block';
            } else {
                el.style.display = 'none';
            }
        });
    });
}

// Main initialization function
async function init() {
    createClouds();
    
    const securityData = await loadSecurityControls();
    if (securityData) {
        generateTabs(securityData.categories);
        generateContent(securityData.categories);
        initTabs();
        initSearch();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
