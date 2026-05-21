# BTS Grants & Partnerships - Lovable Design Brief

## Project Overview
**Brimbank Tech School Grant & Partnerships Platform**
- Purpose: Discover, track, and manage grant opportunities and strategic partnerships
- Target Users: BTS staff managing $1M+ funding pipeline
- Status: Fully functional Next.js MVP, ready for UI/UX polish
- Tech Stack: Next.js 14, React 18, Tailwind CSS, TypeScript, Prisma SQLite, Claude API

---

## Current Data

### Core Features (All Functional)
1. **Dashboard** (`/`) - Metrics, charts, quick access
2. **Grants Management** (`/grants`) - 18 real Australian grants ($5.55M potential)
3. **Prospecting** (`/prospecting`) - 180+ companies organized by business tier
4. **Proposal Generator** (`/generate-proposal`) - Dual-mode (Grants + Prospecting Emails)
5. **Contacts** (`/contacts`) - Track all outreach (API ready)

### Database Content
- 18 Australian government & foundation grants
- 180+ Australian companies (Tier 1-4 classification)
- Strategic BTS program mappings for each company
- Contact tracking structure ready for population

---

## Design Improvement Requests

### 1. Dashboard (`/`)
**Current**: Basic card layout with placeholder charts
**Desired State**:
- More visual hierarchy - larger primary metrics
- Animated or interactive charts (Recharts already integrated)
- Status distribution pie chart with better colors
- Funding trajectory bar chart with trend indicators
- Quick action buttons larger and more prominent
- Color scheme: Primary blue (#0EA5E9), success green, warning orange
- Responsive grid that adapts to mobile

### 2. Grants Page (`/grants`)
**Current**: Vertical card list with filters
**Desired State**:
- Card-based layout with better visual design
- Status filter pills more visually prominent
- Show fit score with visual indicator (1-5 stars or progress bar)
- Deadline urgency indicator (red if < 30 days)
- Hover effects showing more details
- Search functionality for finding grants
- Sort options (by deadline, fit score, funding amount)
- Modal or side panel for full grant details

### 3. Prospecting Page (`/prospecting`) ⭐ PRIORITY
**Current**: Expandable company cards
**Desired State**:
- **Tier filters** as more prominent visual tabs or pills at top
- **Company cards** in a grid (2-3 columns) instead of vertical list
- **Quick look** with company logo placeholder, name, location, tier badge
- **On hover/click**: Expand to show:
  - Full company details
  - CSR focus areas as colorful tags
  - **Aligned BTS Programs** - show which BTS programs match (different colors per program)
  - Location pin icon for geography
  - Email field (highlighted if available, show "To be found" if blank)
  - CSR focus
  - Email draft template
  - Action buttons: "Generate Email", "Log Contact"
- **Color scheme for programs**:
  - AI Academy: Blue
  - GenIUS: Purple
  - Future of Communication: Green
  - Job Readiness: Orange
  - Health: Red
  - Sustainability: Teal
- **Tier badges**:
  - Tier 1: Gold/Amber
  - Tier 2: Silver/Blue
  - Tier 3: Bronze/Green
  - Tier 4: Gray

### 4. Generate Proposal Page (`/generate-proposal`)
**Current**: Split panel form + textarea result
**Desired State**:
- Mode buttons (Grant vs Email) larger, clearer active state
- Form section:
  - Better organized form fields
  - Dropdowns with search (for selecting grants/companies)
  - Rich text editor feel for text areas
  - Loading spinner during generation
- Result section:
  - Better typography for generated proposals
  - Syntax highlighting or structured formatting
  - Copy button more prominent
  - "Download as PDF" button (for proposals)
  - "Send Email" or "Log Outreach" buttons

### 5. Navigation
**Current**: Horizontal nav with mobile hamburger
**Desired State**:
- Make "Prospecting" and "Generate Proposal" more discoverable
- Breadcrumb navigation for deeper pages
- Active page indicator
- Responsive hamburger with smooth animation

### 6. Overall Design System
**Colors**:
- Primary: #0EA5E9 (cyan/sky blue)
- Success: #10b981 (emerald green)
- Warning: #f59e0b (amber)
- Danger: #ef4444 (red)
- Secondary: #8b5cf6 (purple)

**Typography**:
- Headlines: Bold, clear hierarchy
- Body text: Readable, good line height
- Mono for code/data: Company URLs, emails

**Spacing & Layout**:
- Consistent grid (8px base unit)
- White space between sections
- Card-based design throughout
- Mobile-first responsive

**Interactive Elements**:
- Hover effects on buttons & cards
- Smooth transitions
- Loading states (spinners/skeletons)
- Success/error notifications
- Tooltip on hover for additional info

---

## Key Pages to Polish

### High Priority
1. **Prospecting** - This is the core feature, needs best UX
2. **Dashboard** - Entry point, should be visually engaging
3. **Generate Proposal** - Convert this to feel like a "creation tool"

### Medium Priority
4. **Grants** - Filter/sort UX, card design
5. **Navigation** - Help users understand the flow

### Lower Priority
6. **Contacts** - API is ready, UI can come later

---

## Design Patterns to Use
- Card-based layouts (used throughout currently)
- Filter pills for category selection
- Modal dialogs for detailed views
- Expandable/collapsible sections
- Color-coded tags (programs, tiers, status)
- Progress indicators for fit scores
- Responsive grid layouts
- Empty states with helpful messaging

---

## Backend Integration Notes
- All APIs are functional and documented
- Claude API integration ready (proposal generation)
- Daily scheduled task at 9am for prospect discovery
- No backend changes needed - focus is 100% on UI/UX

---

## Export Instructions for Lovable

1. Copy all files from `src/` to Lovable
2. Include `prisma/schema.prisma` as reference for data structure
3. Key component files:
   - `src/app/page.tsx` - Dashboard (refactor to components)
   - `src/app/grants/page.tsx` - Grants list
   - `src/app/prospecting/page.tsx` - ⭐ Most important
   - `src/app/generate-proposal/page.tsx` - Proposal generator
   - `src/components/Navigation.tsx` - Header nav

4. Styling: All using Tailwind CSS (built-in to Lovable)
5. State Management: React hooks (useState, useEffect) - keep as is
6. API calls: fetch() to `/api/` endpoints - no changes needed

---

## Success Criteria
✅ Prospecting page looks professional and intuitive
✅ Company tier filtering is clear and discoverable  
✅ All cards/buttons have smooth hover/active states
✅ Mobile responsive on all breakpoints
✅ Color scheme applied consistently
✅ Form inputs feel modern and usable
✅ Charts are visible and interactive
✅ No loss of functionality - all APIs still work

---

**Ready to export to Lovable! This is a design-focused iteration on a working system.**
