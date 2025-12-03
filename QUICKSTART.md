# Quick Start Guide

## What You Have Now

✅ **Enhanced Landing Page** with:
- Pricing section (4 tiers: Free, Starter, Professional, Enterprise)
- Signup modal with registration form
- Demo request modal
- FAQ section
- Fully responsive design

✅ **Working Prototype/MVP** with:
- Creator search with 100 mock profiles
- Campaign management
- Analytics dashboard
- REST API backend

## Running the Application

The server is already running! Open your browser:

### Landing Page
**URL**: http://localhost:3000

Features:
- Click "Get started" or "Request demo" to see the modals
- Browse the pricing section
- Check out the FAQ

### Dashboard
**URL**: http://localhost:3000/dashboard

Features:
1. **Search Tab** (default):
   - Try searching: "tech", "fitness", "gaming"
   - Use filters: platform, follower count, country
   - Click "Add to Campaign" on any creator

2. **Campaigns Tab**:
   - Click "New Campaign" to create a campaign
   - View all your campaigns

3. **Analytics Tab**:
   - View mock analytics data

## Testing the API

You can test the API directly:

### Search Creators
```bash
curl -X POST http://localhost:3000/api/search/creators \
  -H "Content-Type: application/json" \
  -d '{"query": "tech", "platform": "youtube"}'
```

### Create Campaign
```bash
curl -X POST http://localhost:3000/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{"name": "Summer Campaign", "description": "Q3 influencer push", "budget": 5000}'
```

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123", "fullName": "Test User", "company": "Test Co"}'
```

## What's Next?

### Immediate Enhancements
1. **Add Authentication**: Implement JWT-based login
2. **Persistent Database**: Replace in-memory storage with SQLite or PostgreSQL
3. **Email Integration**: Add real email sending via Postmark/SendGrid
4. **Real Data**: Integrate with YouTube/TikTok APIs

### Production Path
See `TECHNICAL_SPEC.md` for the full production architecture:
- Rust backend for performance
- Next.js frontend for better UX
- Meilisearch for semantic search
- OpenAI for AI features
- PostgreSQL + Redis for data
- Kubernetes deployment

## Stopping the Server

Press `Ctrl+C` in the terminal where the server is running.

## Troubleshooting

### Port Already in Use
If port 3000 is taken, edit `.env`:
```
PORT=3001
```

### Dependencies Missing
```bash
npm install
```

### Server Not Starting
Check that Node.js 16+ is installed:
```bash
node --version
```

## File Structure

```
public/
├── index.html          # Landing page
├── dashboard.html      # Dashboard app
├── styles.css          # Landing styles
├── dashboard.css       # Dashboard styles
├── script.js           # Landing scripts
└── dashboard.js        # Dashboard logic

server.js               # Express API server
package.json            # Dependencies
.env                    # Configuration
```

## Key Features Demonstrated

### 1. Natural Language Search
The search understands queries like:
- "tech YouTubers"
- "fitness influencers"
- "gaming streamers"

### 2. Smart Filtering
Combine multiple filters:
- Platform (YouTube, TikTok, etc.)
- Follower range (10K-100K, etc.)
- Country (US, UK, etc.)

### 3. Campaign Management
- Create campaigns with budgets
- Add creators to campaigns
- Track campaign status

### 4. Mock Data
100 realistic creator profiles with:
- Profile images
- Follower counts
- Engagement rates
- Platform info
- Niches (Tech, Fashion, Gaming, etc.)

## Design System

All UI follows a consistent design system:
- **Spacing**: 8px grid (8, 16, 24, 32, 40, 48px)
- **Colors**: Minimal palette (#0066ff primary)
- **Typography**: Inter font family
- **Radius**: 8px everywhere
- **Shadows**: Subtle elevation

## Next Development Steps

1. **Week 1**: Add user authentication and sessions
2. **Week 2**: Implement persistent database
3. **Week 3**: Add email outreach functionality
4. **Week 4**: Integrate real platform APIs
5. **Week 5+**: Follow TECHNICAL_SPEC.md phases

Enjoy building! 🚀
