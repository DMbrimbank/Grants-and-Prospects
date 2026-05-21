# BTS Grant & Partnerships Hub

A comprehensive platform for Brimbank Tech School to discover, track, and manage grants, tenders, and partnerships. Powered by Claude AI for intelligent proposal generation.

## Features

🎯 **Grant Discovery** - Search and track grant opportunities from Australian public databases
💼 **Partnership Management** - Identify and manage potential corporate partners
📝 **AI Proposal Generator** - Claude-powered automatic grant proposal creation
📊 **Dashboard Analytics** - Track funding pipeline, ROI, and success metrics
📞 **Contact Management** - Log outreach and track relationships
💾 **Export to Word** - Generate professional Word documents for submissions

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

```bash
# Generate Prisma client
npx prisma generate

# Create and seed database
npx prisma db push
npx prisma db seed
```

### 3. Configure API Keys

Edit `.env` and add your Claude API key:

```
ANTHROPIC_API_KEY=sk_YOUR_KEY_HERE
```

Get your key from: https://console.anthropic.com

### 4. Start Dev Server

```bash
npm run dev
```

Visit http://localhost:3000

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   ├── opportunities/    # Opportunities management
│   ├── contacts/         # Contact tracking
│   ├── generate-proposal/# AI proposal generator
│   └── page.tsx          # Dashboard
├── components/           # Reusable UI components
└── lib/                  # Utilities
```

## Key Pages

- **Dashboard** (`/`) - Overview of funding pipeline and metrics
- **Opportunities** (`/opportunities`) - Browse all grants/partnerships
- **Generate Proposal** (`/generate-proposal`) - AI-powered proposal creation
- **Contacts** (`/contacts`) - Outreach and relationship tracking

## API Endpoints

- `GET /api/opportunities` - List opportunities
- `POST /api/opportunities` - Create new opportunity
- `GET /api/opportunities/summary` - Dashboard metrics
- `POST /api/proposals/generate` - Generate proposal with Claude
- `POST /api/proposals/export-docx` - Export to Word document

## Database Schema

- **Opportunity** - Grants, partnerships, tenders
- **Contact** - Outreach interactions and follow-ups
- **BtsProgram** - BTS program reference data
- **Company** - Potential partner companies
- **ProposalTemplate** - Reusable proposal templates

## Initial Data

Database is seeded with:
- ✅ 3-5 sample grants ($200k+ range)
- ✅ 5 synthetic partner companies (for testing)
- ✅ BTS program reference data

## Next Steps

1. Review the dashboard and add your first grant opportunity
2. Test the proposal generator with sample grants
3. Configure your Claude API key for full functionality
4. Replace synthetic companies with real prospects
5. Connect to public grant databases (Grants.gov.au, Philanthropy Australia, etc.)

## Tech Stack

- **Frontend:** Next.js 14 + React + TypeScript
- **Styling:** Tailwind CSS
- **Database:** SQLite (Prisma ORM)
- **AI:** Claude API (Anthropic SDK)
- **Exports:** docx library for Word documents
- **Charts:** Recharts for data visualization

## Environment Variables

```
DATABASE_URL          # SQLite database path
ANTHROPIC_API_KEY     # Claude API key
NEXTAUTH_SECRET       # Session encryption (for auth)
NODE_ENV              # development/production
```

## Development Notes

- Database uses SQLite for simplicity (upgrade to PostgreSQL for production)
- All API routes are server-side only
- Claude API calls are made server-side for security
- Single-user application (auth to be added later if needed)

## Roadmap

- [ ] Grant database crawlers (automatic updates)
- [ ] Partnership company research automation
- [ ] Contact follow-up reminder system
- [ ] Advanced ROI calculation
- [ ] Bulk operations and batch processing
- [ ] Multi-user support with authentication
- [ ] Integration with external grant databases
- [ ] Email notification system

## Support

For questions or issues, contact: brimbank.tech@vu.edu.au
