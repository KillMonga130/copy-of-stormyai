// API Base URL
const API_URL = 'http://localhost:3000/api';

// State
let currentCampaign = null;

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const view = item.dataset.view;
        switchView(view);
    });
});

function switchView(viewName) {
    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-view="${viewName}"]`).classList.add('active');
    
    // Update view
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(`${viewName}-view`).classList.add('active');
    
    // Load data for view
    if (viewName === 'campaigns') {
        loadCampaigns();
    } else if (viewName === 'analytics') {
        loadAnalytics();
    }
}

// Platform selector
let selectedPlatform = 'youtube';

// Load platform status and render buttons dynamically
async function loadPlatforms() {
    try {
        const response = await fetch(`${API_URL}/platforms/status`);
        const platforms = await response.json();
        
        const container = document.getElementById('platform-buttons');
        const buttons = [];
        
        // Add individual platform buttons
        for (const [key, platform] of Object.entries(platforms)) {
            if (!platform.active && platform.quality === 'none') continue; // Skip completely inactive
            
            let badge = '';
            if (platform.quality === 'full' && platform.active) {
                badge = '<span class="platform-badge working">Active</span>';
            } else if (platform.quality === 'limited') {
                badge = '<span class="platform-badge limited">Limited</span>';
            } else if (!platform.active) {
                badge = '<span class="platform-badge inactive">Setup Required</span>';
            }
            
            buttons.push(`
                <button class="platform-btn ${key === 'youtube' ? 'active' : ''}" data-platform="${key}">
                    <span>${platform.name}</span>
                    ${badge}
                </button>
            `);
        }
        
        // Add "All Platforms" button
        buttons.push(`
            <button class="platform-btn" data-platform="all">
                <span>All Platforms</span>
            </button>
        `);
        
        container.innerHTML = buttons.join('');
        
        // Add click handlers
        document.querySelectorAll('.platform-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.platform-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedPlatform = btn.dataset.platform;
            });
        });
        
    } catch (error) {
        console.error('Failed to load platforms:', error);
    }
}

// Load platforms on init
loadPlatforms();

// Loading state helper
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.dataset.originalText = button.textContent;
        button.textContent = 'Searching...';
        button.disabled = true;
        button.classList.add('btn-loading');
    } else {
        button.textContent = button.dataset.originalText;
        button.disabled = false;
        button.classList.remove('btn-loading');
    }
}

// Search functionality
document.getElementById('search-btn').addEventListener('click', performSearch);
document.getElementById('search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

async function performSearch() {
    const query = document.getElementById('search-input').value;
    
    if (!query.trim()) {
        showNotification('Please enter a search query', 'error');
        return;
    }
    
    const searchBtn = document.getElementById('search-btn');
    const resultsContainer = document.getElementById('search-results');
    
    // Show loading skeleton
    resultsContainer.innerHTML = `
        <div class="loading-skeleton">
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
        </div>
    `;
    
    setButtonLoading(searchBtn, true);
    
    const platform = selectedPlatform;
    const minFollowers = document.getElementById('min-followers').value;
    const maxFollowers = document.getElementById('max-followers').value;
    const country = document.getElementById('country-filter').value;
    
    try {
        const response = await fetch(`${API_URL}/search/creators`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query,
                platform,
                minFollowers,
                maxFollowers,
                country
            })
        });
        
        if (!response.ok) throw new Error('Search failed');
        
        const data = await response.json();
        displayResults(data.results, data.source, data.platforms);
    } catch (error) {
        console.error('Search error:', error);
        resultsContainer.innerHTML = `
            <div class="empty-state">
                <p class="empty-state-text">Search failed. Please try again.</p>
            </div>
        `;
        showNotification('Search failed. Please try again.', 'error');
    } finally {
        setButtonLoading(searchBtn, false);
    }
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('notification-show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('notification-show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function displayResults(creators, source = 'unknown', platforms = []) {
    const resultsContainer = document.getElementById('search-results');
    
    if (creators.length === 0) {
        resultsContainer.innerHTML = '<div class="empty-state"><p class="empty-state-text">No creators found. Try different search terms.</p></div>';
        return;
    }
    
    const sourceIndicator = source === 'real' 
        ? `<div class="results-info">Showing ${creators.length} results from live data</div>`
        : '<div class="results-info results-info-mock">Showing sample data. Search YouTube for live results.</div>';
    
    resultsContainer.innerHTML = sourceIndicator + creators.map(creator => `
        <div class="creator-card">
            <div class="creator-header">
                <img src="${creator.profileImage}" alt="${creator.displayName}" class="creator-avatar">
                <div class="creator-info">
                    <div class="creator-name">${creator.displayName}</div>
                    <div class="creator-username">@${creator.username}</div>
                </div>
            </div>
            <div class="creator-bio">${creator.bio}</div>
            <div class="creator-tags">
                <span class="tag">${creator.platform}</span>
                <span class="tag">${creator.niche}</span>
                <span class="tag">${creator.country}</span>
                ${creator.verified ? '<span class="tag tag-verified">Verified</span>' : ''}
            </div>
            <div class="creator-stats">
                <div class="creator-stat">
                    <div class="creator-stat-label">Followers</div>
                    <div class="creator-stat-value">${formatNumber(creator.followerCount)}</div>
                </div>
                <div class="creator-stat">
                    <div class="creator-stat-label">Engagement</div>
                    <div class="creator-stat-value">${creator.engagementRate}%</div>
                </div>
                <div class="creator-stat">
                    <div class="creator-stat-label">Avg Views</div>
                    <div class="creator-stat-value">${formatNumber(creator.avgViews)}</div>
                </div>
            </div>
            <div class="creator-actions">
                <button class="btn btn-primary btn-small" onclick="addToCampaign('${creator.id}')">Add to Campaign</button>
                <button class="btn btn-secondary btn-small" onclick="viewProfile('${creator.id}')">View Profile</button>
            </div>
        </div>
    `).join('');
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Campaign functionality
document.getElementById('new-campaign-btn').addEventListener('click', () => {
    document.getElementById('campaign-modal').classList.add('active');
});

document.querySelector('#campaign-modal .modal-close').addEventListener('click', () => {
    document.getElementById('campaign-modal').classList.remove('active');
});

document.getElementById('campaign-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    setButtonLoading(submitBtn, true);
    
    const name = document.getElementById('campaign-name').value;
    const description = document.getElementById('campaign-description').value;
    const budget = document.getElementById('campaign-budget').value;
    
    try {
        const response = await fetch(`${API_URL}/campaigns`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                description,
                budget: parseFloat(budget),
                targetCriteria: {}
            })
        });
        
        if (!response.ok) throw new Error('Campaign creation failed');
        
        const campaign = await response.json();
        document.getElementById('campaign-modal').classList.remove('active');
        document.getElementById('campaign-form').reset();
        loadCampaigns();
        showNotification('Campaign created successfully');
    } catch (error) {
        console.error('Campaign creation error:', error);
        showNotification('Failed to create campaign. Please try again.', 'error');
    } finally {
        setButtonLoading(submitBtn, false);
    }
});

async function loadCampaigns() {
    try {
        const response = await fetch(`${API_URL}/campaigns`);
        const campaigns = await response.json();
        displayCampaigns(campaigns);
    } catch (error) {
        console.error('Load campaigns error:', error);
    }
}

function displayCampaigns(campaigns) {
    const container = document.getElementById('campaigns-list');
    
    if (campaigns.length === 0) {
        container.innerHTML = '<div class="empty-state">No campaigns yet. Create your first campaign to get started.</div>';
        return;
    }
    
    container.innerHTML = campaigns.map(campaign => `
        <div class="campaign-card">
            <div class="campaign-header">
                <div>
                    <div class="campaign-name">${campaign.name}</div>
                    <div class="campaign-description">${campaign.description || 'No description'}</div>
                </div>
                <span class="campaign-status">${campaign.status}</span>
            </div>
            <div class="campaign-meta">
                <span>Budget: $${campaign.budget.toLocaleString()}</span>
                <span>Creators: ${campaign.creators.length}</span>
                <span>Created: ${new Date(campaign.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
    `).join('');
}

async function addToCampaign(creatorId) {
    const campaigns = await fetch(`${API_URL}/campaigns`).then(r => r.json());
    
    if (campaigns.length === 0) {
        showNotification('Please create a campaign first.', 'error');
        return;
    }
    
    // For simplicity, add to the first campaign
    const campaign = campaigns[0];
    
    try {
        const response = await fetch(`${API_URL}/campaigns/${campaign.id}/creators`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ creatorId })
        });
        
        if (!response.ok) throw new Error('Failed to add creator');
        
        showNotification('Creator added to campaign');
    } catch (error) {
        console.error('Add to campaign error:', error);
        showNotification('Failed to add creator to campaign.', 'error');
    }
}

function viewProfile(creatorId) {
    alert(`Profile view for creator ${creatorId} - Full profile page would open here`);
}

// Analytics functionality
async function loadAnalytics() {
    try {
        const campaigns = await fetch(`${API_URL}/campaigns`).then(r => r.json());
        displayAnalytics(campaigns);
    } catch (error) {
        console.error('Load analytics error:', error);
    }
}

function displayAnalytics(campaigns) {
    const container = document.getElementById('analytics-content');
    
    if (campaigns.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>📊 No Campaign Data Yet</h3>
                <p>Create campaigns and add creators to see analytics here.</p>
            </div>
        `;
        return;
    }
    
    // Calculate overall stats
    const totalCampaigns = campaigns.length;
    const totalCreators = campaigns.reduce((sum, c) => sum + c.creators.length, 0);
    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
    const totalReach = campaigns.reduce((sum, c) => {
        return sum + c.creators.reduce((s, cr) => s + (cr.followerCount || 0), 0);
    }, 0);
    
    container.innerHTML = `
        <div class="analytics-grid">
            <div class="analytics-card">
                <div class="analytics-card-label">Total Campaigns</div>
                <div class="analytics-card-value">${totalCampaigns}</div>
            </div>
            <div class="analytics-card">
                <div class="analytics-card-label">Total Creators</div>
                <div class="analytics-card-value">${totalCreators}</div>
            </div>
            <div class="analytics-card">
                <div class="analytics-card-label">Total Budget</div>
                <div class="analytics-card-value">$${totalBudget.toLocaleString()}</div>
            </div>
            <div class="analytics-card">
                <div class="analytics-card-label">Total Reach</div>
                <div class="analytics-card-value">${formatNumber(totalReach)}</div>
            </div>
        </div>
        
        <div class="analytics-section">
            <h2 class="analytics-section-title">Campaign Breakdown</h2>
            ${campaigns.map(campaign => {
                const reach = campaign.creators.reduce((sum, cr) => sum + (cr.followerCount || 0), 0);
                const avgEngagement = campaign.creators.length > 0 
                    ? (campaign.creators.reduce((sum, cr) => sum + (cr.engagementRate || 0), 0) / campaign.creators.length).toFixed(2)
                    : 0;
                
                return `
                    <div class="analytics-campaign">
                        <div class="analytics-campaign-header">
                            <div class="analytics-campaign-name">${campaign.name}</div>
                            <div class="analytics-campaign-status">${campaign.status}</div>
                        </div>
                        <div class="analytics-campaign-stats">
                            <div class="analytics-stat">
                                <span class="analytics-stat-label">Creators:</span>
                                <span class="analytics-stat-value">${campaign.creators.length}</span>
                            </div>
                            <div class="analytics-stat">
                                <span class="analytics-stat-label">Budget:</span>
                                <span class="analytics-stat-value">$${campaign.budget.toLocaleString()}</span>
                            </div>
                            <div class="analytics-stat">
                                <span class="analytics-stat-label">Reach:</span>
                                <span class="analytics-stat-value">${formatNumber(reach)}</span>
                            </div>
                            <div class="analytics-stat">
                                <span class="analytics-stat-label">Avg Engagement:</span>
                                <span class="analytics-stat-value">${avgEngagement}%</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Initial load - show clean empty state
document.getElementById('search-results').innerHTML = `
    <div class="empty-state">
        <p class="empty-state-text">Enter a search query to find creators</p>
    </div>
`;
