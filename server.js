const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const {
  searchTikTokCreators,
  searchInstagramCreators,
  searchTwitchCreators,
  searchTwitterCreators,
  searchLinkedInCreators
} = require('./scrapers');

const app = express();
const PORT = process.env.PORT || 3000;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory database (for prototype)
const db = {
  users: [],
  campaigns: [],
  creators: [], // Will be populated with real data
  cachedCreators: generateMockCreators() // Fallback mock data
};

// Mock data generator
function generateMockCreators() {
  const platforms = ['YouTube', 'TikTok', 'LinkedIn', 'Instagram', 'Twitch'];
  const niches = ['Tech', 'Fashion', 'Fitness', 'Gaming', 'Business', 'Food', 'Travel', 'Beauty'];
  const countries = ['US', 'UK', 'Canada', 'Australia', 'Germany'];
  
  const creators = [];
  for (let i = 1; i <= 100; i++) {
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const niche = niches[Math.floor(Math.random() * niches.length)];
    const followers = Math.floor(Math.random() * 1000000) + 10000;
    
    creators.push({
      id: `creator-${i}`,
      platform,
      username: `${niche.toLowerCase()}creator${i}`,
      displayName: `${niche} Creator ${i}`,
      bio: `${niche} content creator on ${platform}. Sharing tips and insights.`,
      profileImage: `https://ui-avatars.com/api/?name=${niche}+Creator+${i}&background=random`,
      followerCount: followers,
      engagementRate: (Math.random() * 10 + 1).toFixed(2),
      avgViews: Math.floor(followers * (Math.random() * 0.1 + 0.05)),
      country: countries[Math.floor(Math.random() * countries.length)],
      niche,
      email: `${niche.toLowerCase()}creator${i}@example.com`,
      verified: Math.random() > 0.7
    });
  }
  return creators;
}

// YouTube API Integration
async function searchYouTubeCreators(query, maxResults = 20) {
  try {
    // Search for channels
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    if (!searchData.items || searchData.items.length === 0) {
      return [];
    }
    
    // Get channel IDs
    const channelIds = searchData.items.map(item => item.snippet.channelId).join(',');
    
    // Get detailed channel statistics
    const statsUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${channelIds}&key=${YOUTUBE_API_KEY}`;
    const statsResponse = await fetch(statsUrl);
    const statsData = await statsResponse.json();
    
    // Transform to our format
    return statsData.items.map(channel => {
      const stats = channel.statistics;
      const snippet = channel.snippet;
      const subscriberCount = parseInt(stats.subscriberCount || 0);
      const viewCount = parseInt(stats.viewCount || 0);
      const videoCount = parseInt(stats.videoCount || 1);
      const avgViews = Math.floor(viewCount / videoCount);
      
      // Calculate engagement rate (simplified)
      const engagementRate = subscriberCount > 0 
        ? ((avgViews / subscriberCount) * 100).toFixed(2)
        : '0.00';
      
      return {
        id: channel.id,
        platform: 'YouTube',
        username: snippet.customUrl || channel.id,
        displayName: snippet.title,
        bio: snippet.description?.substring(0, 200) || 'No description available',
        profileImage: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url,
        profileUrl: `https://youtube.com/channel/${channel.id}`,
        followerCount: subscriberCount,
        totalPosts: videoCount,
        totalViews: viewCount,
        engagementRate: parseFloat(engagementRate),
        avgViews: avgViews,
        country: snippet.country || 'Unknown',
        niche: extractNiche(snippet.title, snippet.description),
        verified: true, // YouTube channels are verified
        email: null, // Not available via API
        isReal: true // Flag to indicate real data
      };
    });
  } catch (error) {
    console.error('YouTube API Error:', error);
    return [];
  }
}

function extractNiche(title, description) {
  const text = (title + ' ' + description).toLowerCase();
  const niches = {
    'tech': ['tech', 'technology', 'coding', 'programming', 'software', 'developer'],
    'gaming': ['gaming', 'game', 'gamer', 'esports', 'gameplay', 'streamer'],
    'fitness': ['fitness', 'workout', 'gym', 'health', 'exercise', 'bodybuilding'],
    'fashion': ['fashion', 'style', 'beauty', 'makeup', 'clothing'],
    'business': ['business', 'entrepreneur', 'startup', 'marketing', 'finance'],
    'food': ['food', 'cooking', 'recipe', 'chef', 'kitchen'],
    'travel': ['travel', 'adventure', 'tourism', 'explore'],
    'education': ['education', 'learning', 'tutorial', 'course', 'teach']
  };
  
  for (const [niche, keywords] of Object.entries(niches)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return niche.charAt(0).toUpperCase() + niche.slice(1);
    }
  }
  
  return 'General';
}

// Routes
app.post('/api/auth/register', (req, res) => {
  const { email, password, fullName, company } = req.body;
  
  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  
  const user = {
    id: `user-${Date.now()}`,
    email,
    fullName,
    company,
    planTier: 'free',
    creditsRemaining: 25,
    createdAt: new Date().toISOString()
  };
  
  db.users.push(user);
  res.json({ message: 'User registered successfully', user });
});

app.post('/api/search/creators', async (req, res) => {
  const { query, platform, minFollowers, maxFollowers, country } = req.body;
  
  let results = [];
  let realDataFetched = false;
  
  // Fetch real data based on platform
  if (query) {
    const platformLower = (platform || 'all').toLowerCase();
    
    // YouTube
    if (platformLower === 'youtube' || platformLower === 'all') {
      console.log(`🔍 Fetching YouTube data for: "${query}"`);
      const youtubeResults = await searchYouTubeCreators(query);
      results = [...results, ...youtubeResults];
      if (youtubeResults.length > 0) realDataFetched = true;
    }
    
    // TikTok
    if (platformLower === 'tiktok' || platformLower === 'all') {
      const tiktokResults = await searchTikTokCreators(query);
      results = [...results, ...tiktokResults];
      if (tiktokResults.length > 0) realDataFetched = true;
    }
    
    // Instagram
    if (platformLower === 'instagram' || platformLower === 'all') {
      const instagramResults = await searchInstagramCreators(query);
      results = [...results, ...instagramResults];
      if (instagramResults.length > 0) realDataFetched = true;
    }
    
    // Twitch
    if (platformLower === 'twitch' || platformLower === 'all') {
      const twitchResults = await searchTwitchCreators(query);
      results = [...results, ...twitchResults];
      if (twitchResults.length > 0) realDataFetched = true;
    }
    
    // Twitter
    if (platformLower === 'twitter' || platformLower === 'x' || platformLower === 'all') {
      const twitterResults = await searchTwitterCreators(query);
      results = [...results, ...twitterResults];
      if (twitterResults.length > 0) realDataFetched = true;
    }
    
    // LinkedIn
    if (platformLower === 'linkedin' || platformLower === 'all') {
      const linkedinResults = await searchLinkedInCreators(query);
      results = [...results, ...linkedinResults];
      if (linkedinResults.length > 0) realDataFetched = true;
    }
  }
  
  // If no real data found, use mock data
  if (!realDataFetched) {
    console.log('📦 Using mock data');
    results = [...db.cachedCreators];
    
    // Filter by platform
    if (platform && platform !== 'all') {
      results = results.filter(c => c.platform.toLowerCase() === platform.toLowerCase());
    }
    
    // Simple text search on mock data
    if (query) {
      const searchTerm = query.toLowerCase();
      results = results.filter(c => 
        c.displayName.toLowerCase().includes(searchTerm) ||
        c.bio.toLowerCase().includes(searchTerm) ||
        c.niche.toLowerCase().includes(searchTerm)
      );
    }
  }
  
  // Apply filters to all results
  if (minFollowers) {
    results = results.filter(c => c.followerCount >= parseInt(minFollowers));
  }
  if (maxFollowers) {
    results = results.filter(c => c.followerCount <= parseInt(maxFollowers));
  }
  if (country && country !== 'all') {
    results = results.filter(c => c.country === country);
  }
  
  // Sort by follower count
  results.sort((a, b) => b.followerCount - a.followerCount);
  
  res.json({
    results: results.slice(0, 20),
    total: results.length,
    source: realDataFetched ? 'real' : 'mock',
    platforms: [...new Set(results.map(r => r.platform))]
  });
});

app.get('/api/creators/:id', async (req, res) => {
  // Try to find in cached results first
  let creator = db.cachedCreators.find(c => c.id === req.params.id);
  
  // If not found and looks like a YouTube channel ID, fetch from API
  if (!creator && req.params.id.startsWith('UC')) {
    try {
      const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${req.params.id}&key=${YOUTUBE_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const channel = data.items[0];
        const stats = channel.statistics;
        const snippet = channel.snippet;
        
        creator = {
          id: channel.id,
          platform: 'YouTube',
          username: snippet.customUrl || channel.id,
          displayName: snippet.title,
          bio: snippet.description || 'No description available',
          profileImage: snippet.thumbnails?.high?.url,
          profileUrl: `https://youtube.com/channel/${channel.id}`,
          followerCount: parseInt(stats.subscriberCount || 0),
          totalPosts: parseInt(stats.videoCount || 0),
          totalViews: parseInt(stats.viewCount || 0),
          country: snippet.country || 'Unknown',
          verified: true,
          isReal: true
        };
      }
    } catch (error) {
      console.error('Error fetching creator:', error);
    }
  }
  
  if (!creator) {
    return res.status(404).json({ error: 'Creator not found' });
  }
  
  res.json(creator);
});

app.post('/api/campaigns', (req, res) => {
  const { name, description, budget, targetCriteria } = req.body;
  
  const campaign = {
    id: `campaign-${Date.now()}`,
    name,
    description,
    budget,
    targetCriteria,
    status: 'draft',
    createdAt: new Date().toISOString(),
    creators: []
  };
  
  db.campaigns.push(campaign);
  res.json(campaign);
});

app.get('/api/campaigns', (req, res) => {
  res.json(db.campaigns);
});

app.post('/api/campaigns/:id/creators', (req, res) => {
  const { creatorId } = req.body;
  const campaign = db.campaigns.find(c => c.id === req.params.id);
  
  if (!campaign) {
    return res.status(404).json({ error: 'Campaign not found' });
  }
  
  const creator = db.creators.find(c => c.id === creatorId);
  if (!creator) {
    return res.status(404).json({ error: 'Creator not found' });
  }
  
  if (!campaign.creators.find(c => c.id === creatorId)) {
    campaign.creators.push({
      ...creator,
      status: 'pending',
      addedAt: new Date().toISOString()
    });
  }
  
  res.json(campaign);
});

// Serve dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Stormy AI prototype running on http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
});
