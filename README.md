# Stormy AI - Influencer Marketing Platform

An AI-powered influencer marketing platform with natural language search, automated outreach, and campaign management.

## Features

### Landing Page
- Clean, professional design with pricing section (4 tiers)
- Signup and demo request modals
- Fully responsive layout
- FAQ section

### Dashboard (REAL DATA!)
- **Creator Search**: Search REAL creators across multiple platforms
  - ✅ **YouTube**: FULLY WORKING with real data (20M+ creators)
  - ⚠️ **TikTok**: Partial support via web scraping
  - ⚠️ **Instagram**: Partial support via public endpoints
  - ⏳ **Twitch**: Ready (needs API setup)
  - ⏳ **Twitter/X**: Ready (needs API setup)
  - ⏳ **LinkedIn**: Ready (needs OAuth)
  - Natural language search
  - Advanced filtering (followers, country, platform)
  - Real subscriber counts, engagement rates, view counts
  - Live data indicators (🔴 LIVE badges)
- **Campaign Management**: Create and manage campaigns
- **Analytics Dashboard**: View campaign performance metrics

### Multi-Platform Integration
- Real-time data from YouTube API
- Web scraping for TikTok and Instagram
- Extensible architecture for more platforms
- Smart fallback to mock data when APIs unavailable

## Tech Stack

### Current Prototype
- **Backend**: Node.js + Express
- **Frontend**: Vanilla JavaScript (no framework)
- **Database**: In-memory (for prototype)
- **Styling**: CSS with design system

### Production (from Technical Spec)
- **Backend**: Rust + Axum
- **Frontend**: Next.js 14 + TypeScript
- **Database**: PostgreSQL + Redis
- **Search**: Meilisearch
- **AI**: OpenAI API

## Getting Started

### Prerequisites
- Node.js 16+ installed

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
copy .env.example .env
```

3. Start the server:
```bash
npm start
```

4. Open your browser:
- Landing page: http://localhost:3000
- Dashboard: http://localhost:3000/dashboard

### Development Mode

For auto-restart on file changes:
```bash
npm run dev
```

## Project Structure

```
stormy-ai/
├── public/                 # Static files
│   ├── index.html         # Landing page
│   ├── styles.css         # Landing page styles
│   ├── script.js          # Landing page scripts
│   ├── dashboard.html     # Dashboard app
│   ├── dashboard.css      # Dashboard styles
│   ├── dashboard.js       # Dashboard logic
│   └── favicon.svg        # Favicon
├── server.js              # Express server
├── package.json           # Dependencies
├── .env.example           # Environment template
├── TECHNICAL_SPEC.md      # Full technical specification
└── README.md              # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user

### Search
- `POST /api/search/creators` - Search creators with filters

### Campaigns
- `POST /api/campaigns` - Create campaign
- `GET /api/campaigns` - List campaigns
- `POST /api/campaigns/:id/creators` - Add creator to campaign

### Creators
- `GET /api/creators/:id` - Get creator details

## Design System

Built with premium, intentional design principles - no "vibe coded" patterns.

### Foundation
- **Spacing**: 8-point system (8px, 16px, 24px, 32px, 40px, 48px, 64px, 80px, 96px)
- **Typography**: Inter font family with consistent scale and line heights
- **Colors**: Minimal palette focused on clarity and hierarchy
- **Border Radius**: Consistent 8px across all components
- **Shadows**: Single elevation style for depth

### UX Principles
- **Loading States**: Every async action shows clear feedback
- **Notifications**: Toast system for success/error messages
- **Form Validation**: Real-time validation with visual feedback
- **Accessibility**: Keyboard navigation, focus trapping, ARIA labels
- **Consistency**: All components share the same design language

### What We Avoid
- ❌ Purple gradients (unless brand-specific)
- ❌ Sparkle emojis as UI elements
- ❌ Aggressive hover animations
- ❌ Fake testimonials
- ❌ Non-functional social icons
- ❌ Generic taglines
- ❌ Missing loading states
- ❌ Inconsistent spacing/radiuses

## Next Steps

### Phase 1: Enhanced Prototype
- [ ] Add user authentication (JWT)
- [ ] Implement persistent database (SQLite/PostgreSQL)
- [ ] Add email outreach functionality
- [ ] Integrate real platform APIs

### Phase 2: Production Features
- [ ] Migrate to Rust backend
- [ ] Implement Meilisearch for semantic search
- [ ] Add OpenAI integration for AI features
- [ ] Build Next.js frontend
- [ ] Add payment integration (Stripe)

### Phase 3: Advanced Features
- [ ] AI negotiation agent
- [ ] Autonomous campaign mode
- [ ] Real-time analytics
- [ ] Webhook integrations

## Contributing

This is a prototype/MVP. See TECHNICAL_SPEC.md for the full production architecture.

## License

MIT
