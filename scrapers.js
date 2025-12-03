const axios = require('axios');
const cheerio = require('cheerio');

// TikTok Scraper (using unofficial API)
async function searchTikTokCreators(query, maxResults = 20) {
  try {
    console.log(`🎵 Fetching TikTok data for: "${query}"`);
    
    // Using TikTok's web search (scraping approach)
    const searchUrl = `https://www.tiktok.com/api/search/user/full/?keyword=${encodeURIComponent(query)}`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.tiktok.com/'
      }
    });
    
    if (!response.data || !response.data.user_list) {
      return [];
    }
    
    return response.data.user_list.slice(0, maxResults).map(item => {
      const user = item.user_info;
      const stats = user.stats || {};
      
      const followerCount = stats.follower_count || 0;
      const videoCount = stats.video_count || 1;
      const totalLikes = stats.heart_count || 0;
      const avgLikes = Math.floor(totalLikes / videoCount);
      const engagementRate = followerCount > 0 
        ? ((avgLikes / followerCount) * 100).toFixed(2)
        : '0.00';
      
      return {
        id: user.uid,
        platform: 'TikTok',
        username: user.unique_id,
        displayName: user.nickname,
        bio: user.signature || 'No bio available',
        profileImage: user.avatar_larger || user.avatar_medium,
        profileUrl: `https://tiktok.com/@${user.unique_id}`,
        followerCount: followerCount,
        totalPosts: videoCount,
        totalViews: totalLikes, // TikTok uses likes instead of views
        engagementRate: parseFloat(engagementRate),
        avgViews: avgLikes,
        country: user.region || 'Unknown',
        niche: extractNiche(user.nickname, user.signature),
        verified: user.verified || false,
        email: null,
        isReal: true
      };
    });
  } catch (error) {
    console.error('TikTok API Error:', error.message);
    return [];
  }
}

// Instagram Scraper (using public endpoints)
async function searchInstagramCreators(query, maxResults = 20) {
  try {
    console.log(`📸 Fetching Instagram data for: "${query}"`);
    
    // Instagram public search endpoint
    const searchUrl = `https://www.instagram.com/web/search/topsearch/?query=${encodeURIComponent(query)}`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    
    if (!response.data || !response.data.users) {
      return [];
    }
    
    const results = [];
    for (const item of response.data.users.slice(0, maxResults)) {
      const user = item.user;
      
      // Get detailed profile info
      try {
        const profileUrl = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${user.username}`;
        const profileResponse = await axios.get(profileUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'X-IG-App-ID': '936619743392459'
          }
        });
        
        const profile = profileResponse.data.data.user;
        const followerCount = profile.edge_followed_by?.count || 0;
        const mediaCount = profile.edge_owner_to_timeline_media?.count || 1;
        
        results.push({
          id: user.pk,
          platform: 'Instagram',
          username: user.username,
          displayName: user.full_name || user.username,
          bio: profile.biography || 'No bio available',
          profileImage: user.profile_pic_url,
          profileUrl: `https://instagram.com/${user.username}`,
          followerCount: followerCount,
          totalPosts: mediaCount,
          totalViews: 0, // Not available publicly
          engagementRate: 0, // Would need post data
          avgViews: 0,
          country: 'Unknown',
          niche: extractNiche(user.full_name, profile.biography),
          verified: user.is_verified || false,
          email: null,
          isReal: true
        });
      } catch (err) {
        // If detailed fetch fails, use basic data
        results.push({
          id: user.pk,
          platform: 'Instagram',
          username: user.username,
          displayName: user.full_name || user.username,
          bio: 'Profile details unavailable',
          profileImage: user.profile_pic_url,
          profileUrl: `https://instagram.com/${user.username}`,
          followerCount: 0,
          totalPosts: 0,
          totalViews: 0,
          engagementRate: 0,
          avgViews: 0,
          country: 'Unknown',
          niche: 'General',
          verified: user.is_verified || false,
          email: null,
          isReal: true
        });
      }
    }
    
    return results;
  } catch (error) {
    console.error('Instagram API Error:', error.message);
    return [];
  }
}

// Twitch Scraper (using Twitch API)
async function searchTwitchCreators(query, maxResults = 20) {
  try {
    console.log(`🎮 Fetching Twitch data for: "${query}"`);
    
    const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
    const TWITCH_ACCESS_TOKEN = process.env.TWITCH_ACCESS_TOKEN;
    
    if (!TWITCH_CLIENT_ID || !TWITCH_ACCESS_TOKEN) {
      console.log('⚠️ Twitch API credentials not configured');
      return [];
    }
    
    const searchUrl = `https://api.twitch.tv/helix/search/channels?query=${encodeURIComponent(query)}&first=${maxResults}`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${TWITCH_ACCESS_TOKEN}`
      }
    });
    
    if (!response.data || !response.data.data) {
      return [];
    }
    
    return response.data.data.map(channel => {
      return {
        id: channel.id,
        platform: 'Twitch',
        username: channel.broadcaster_login,
        displayName: channel.display_name,
        bio: channel.title || 'No description available',
        profileImage: channel.thumbnail_url,
        profileUrl: `https://twitch.tv/${channel.broadcaster_login}`,
        followerCount: 0, // Need separate API call
        totalPosts: 0,
        totalViews: 0,
        engagementRate: 0,
        avgViews: 0,
        country: 'Unknown',
        niche: channel.game_name || 'Gaming',
        verified: channel.is_partner || false,
        email: null,
        isReal: true
      };
    });
  } catch (error) {
    console.error('Twitch API Error:', error.message);
    return [];
  }
}

// Twitter/X Scraper (using public search)
async function searchTwitterCreators(query, maxResults = 20) {
  try {
    console.log(`🐦 Fetching Twitter data for: "${query}"`);
    
    // Twitter's public search (requires scraping or API v2)
    // For now, returning empty - would need Twitter API v2 credentials
    console.log('⚠️ Twitter API not yet implemented (requires API v2 credentials)');
    return [];
  } catch (error) {
    console.error('Twitter API Error:', error.message);
    return [];
  }
}

// LinkedIn Scraper (very limited without auth)
async function searchLinkedInCreators(query, maxResults = 20) {
  try {
    console.log(`💼 Fetching LinkedIn data for: "${query}"`);
    
    // LinkedIn requires authentication for API access
    // Public scraping is against ToS and very difficult
    console.log('⚠️ LinkedIn API not yet implemented (requires OAuth)');
    return [];
  } catch (error) {
    console.error('LinkedIn API Error:', error.message);
    return [];
  }
}

// Helper function to extract niche from text
function extractNiche(title, description) {
  const text = ((title || '') + ' ' + (description || '')).toLowerCase();
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

module.exports = {
  searchTikTokCreators,
  searchInstagramCreators,
  searchTwitchCreators,
  searchTwitterCreators,
  searchLinkedInCreators
};
