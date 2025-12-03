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
    }
}

// Search functionality
document.getElementById('search-btn').addEventListener('click', performSearch);
document.getElementById('search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

async function performSearch() {
    const query = document.getElementById('search-input').value;
    const platform = document.getElementById('platform-filter').value;
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
        
        const data = await response.json();
        displayResults(data.results, data.source, data.platforms);
    } catch (error) {
        console.error('Search error:', error);
        alert('Search failed. Please try again.');
    }
}

function displayResults(creators, source = 'unknown', platforms = []) {
    const resultsContainer = document.getElementById('search-results');
    
    if (creators.length === 0) {
        resultsContainer.innerHTML = '<div class="empty-state">No creators found. Try adjusting your filters.</div>';
        return;
    }
    
    const platformList = platforms.length > 0 ? platforms.join(', ') : 'multiple platforms';
    const sourceIndicator = source === 'real' 
        ? `<div style="padding: 12px; background: #10b981; color: white; border-radius: 8px; margin-bottom: 16px; font-weight: 500;">✓ Showing REAL data from ${platformList}</div>`
        : '<div style="padding: 12px; background: #f59e0b; color: white; border-radius: 8px; margin-bottom: 16px; font-weight: 500;">⚠️ Showing mock data (search with a query for real data)</div>';
    
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
                ${creator.verified ? '<span class="tag">✓ Verified</span>' : ''}
                ${creator.isReal ? '<span class="tag" style="background: #10b981; color: white; border: none;">🔴 LIVE</span>' : ''}
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
        
        const campaign = await response.json();
        document.getElementById('campaign-modal').classList.remove('active');
        document.getElementById('campaign-form').reset();
        loadCampaigns();
        alert('Campaign created successfully!');
    } catch (error) {
        console.error('Campaign creation error:', error);
        alert('Failed to create campaign. Please try again.');
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
        alert('Please create a campaign first.');
        return;
    }
    
    // For simplicity, add to the first campaign
    const campaign = campaigns[0];
    
    try {
        await fetch(`${API_URL}/campaigns/${campaign.id}/creators`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ creatorId })
        });
        
        alert('Creator added to campaign!');
    } catch (error) {
        console.error('Add to campaign error:', error);
        alert('Failed to add creator to campaign.');
    }
}

function viewProfile(creatorId) {
    alert(`Profile view for creator ${creatorId} - Full profile page would open here`);
}

// Initial load - show empty state instead of mock data
document.getElementById('search-results').innerHTML = `
    <div class="empty-state">
        <h3>🔍 Search for Creators</h3>
        <p>Enter a search query above to find real influencers from YouTube, TikTok, Instagram, and more!</p>
        <p style="margin-top: 16px; color: #10b981; font-weight: 500;">✓ YouTube integration active - search to see real data!</p>
    </div>
`;
