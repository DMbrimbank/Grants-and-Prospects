# BTS Grants & Partnerships Platform — Complete Design Brief
## For Lovable Implementation

---

## 🎯 USER JOURNEY & PERSONAS

### Primary User: BTS Grants & Partnerships Manager
**Goals:**
- Discover 50+ fundable grant opportunities per month
- Identify strategic corporate partnership prospects
- Generate professional proposals and outreach emails in minutes
- Track all outreach and conversions in one place
- Monitor pipeline value and conversion metrics

**User Flows:**

```
🏠 DASHBOARD (Entry Point)
    ↓
    ├─→ 📊 View metrics & pipeline health
    ├─→ 🔔 See recent activity & deadlines
    └─→ 🚀 Quick jump to Priority actions
    
📋 GRANTS (Grant Discovery)
    ├─→ 🔍 Search/filter 18+ real Australian grants
    ├─→ ⭐ See fit score & deadline urgency
    ├─→ 💰 View funding amount & organization
    └─→ 📝 Generate proposal → export → submit
    
🤝 PROSPECTING (Partnership Scout) ⭐ PRIORITY
    ├─→ 🏢 Browse 180+ company prospects (grid view)
    ├─→ 🎯 Filter by tier (Tier 1-4), sector, program fit
    ├─→ 🔐 Click card → expand → see full details
    ├─→ 📧 Generate personalized cold email
    └─→ 📞 Log contact & track follow-ups
    
✨ GENERATE PROPOSAL (Content Creation)
    ├─→ 💰 Grant Proposal Mode
    │   ├─→ Select grant
    │   ├─→ Enter BTS program focus & outcome
    │   └─→ AI generates full proposal
    │
    └─→ 📧 Prospecting Email Mode
        ├─→ Select company
        ├─→ Enter collaboration ideas
        └─→ AI generates cold outreach email
    
📞 CONTACTS (Relationship Tracking)
    ├─→ 📋 Log all outreach (calls, emails, meetings)
    ├─→ 📅 Set follow-up reminders
    ├─→ 🔄 Track pipeline stage
    └─→ 📊 View conversion metrics
```

---

## 🔗 SYSTEM ARCHITECTURE & DATA FLOW

### What's Connected (Backend Services)

```
┌─────────────────────────────────────────────────────┐
│          USER INTERFACE (Lovable/React)             │
│  Dashboard | Grants | Prospecting | Proposals       │
└─────────────────────┬───────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
    ┌────────┐  ┌─────────┐  ┌──────────┐
    │ REST   │  │ Claude  │  │ Database │
    │ APIs   │  │ API     │  │ (SQLite) │
    └────────┘  └─────────┘  └──────────┘
        │             │             │
        └─────────────┼─────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
   ┌──────────────┐         ┌────────────────┐
   │ Opportunities│         │ Companies      │
   │ (Grants)     │         │ (180+ list)    │
   └──────────────┘         └────────────────┘
```

### Data Connected & How It Flows

**1. GRANT OPPORTUNITIES**
- **Source**: 18 real Australian government grants + foundations
- **Fields**: Title, organization, funding amount, deadline, fit score, status
- **Operations**: 
  - `/api/opportunities` - Fetch all grants
  - Filter by status: not_contacted → researching → prepared → applied → active
  - Sync with contacts when proposal generated

**2. COMPANY PROSPECTS**
- **Source**: 180+ Australian companies (ASX-listed + strategically selected)
- **Organization**: 4 Business Tiers (Tier 1: Google, Amazon, etc. → Tier 4: Regional)
- **Enrichment**: Each company linked to 2-5 relevant BTS programs
- **Fields**: Name, sector, tier, CSR focus, email, location, funding capacity, aligned BTS programs
- **Operations**:
  - `/api/companies` - Fetch with filters (tier, sector)
  - Tier-based discovery (start with Tier 1 → cascade down)
  - Daily 9am auto-discovery adds new prospects

**3. PROPOSAL GENERATION**
- **Trigger**: User clicks "Generate Proposal" or "Generate Email"
- **API Call**: 
  - `/api/proposals/generate` (grants) - Claude creates full proposal
  - `/api/proposals/generate-email` (prospecting) - Claude creates cold email
- **Context**: Claude receives grant details + BTS program info → generates customized output
- **Export**: User can copy, download as .docx, or share

**4. CONTACT TRACKING**
- **Trigger**: User logs interaction (call, email, meeting)
- **API Call**: `/api/contacts` - Store contact record
- **Linked To**: 
  - Which grant/company was contacted
  - Stage in pipeline
  - Next follow-up date (AI-suggested)
- **Reporting**: Dashboard shows contact volume, conversion rate, pipeline stage breakdown

**5. DAILY PROSPECT DISCOVERY (Automated)**
- **Schedule**: 9am daily
- **Trigger**: Claude API calls `/api/admin/trigger-discovery`
- **Process**:
  1. Claude analyzes BTS programs + sectors
  2. Generates 20-30 new company prospects (realistic Australia-based)
  3. Stores in `/api/companies/discover`
  4. Shows on dashboard as "New prospects found"
- **No manual intervention needed** - runs automatically

---

## 📱 PAGE BREAKDOWN & INTERACTIONS

### PAGE 1: DASHBOARD (Home)
**Purpose**: Executive overview of pipeline health, quick actions, recent activity

**Layout**:
```
┌─────────────────────────────────────────────┐
│  DASHBOARD                      [Time: 9am]  │
├─────────────────────────────────────────────┤
│                                             │
│  📊 KEY METRICS (Large, Visual Cards)       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ 64 Total │ │ 12       │ │ $5.55M   │   │
│  │Oppor     │ │ Active   │ │ Potential│   │
│  └──────────┘ └──────────┘ └──────────┘   │
│                                             │
│  🚀 QUICK ACTIONS (3 Large Buttons)         │
│  [🔍 Add Opportunity] [✨ Generate]         │
│  [📞 Log Contact]                           │
│                                             │
│  📈 OPPORTUNITY STATUS PIE CHART            │
│  (Visual donut chart with legend)           │
│  - Not Contacted: 24 (Gray)                │
│  - Researching: 12 (Orange)                │
│  - Prepared: 8 (Blue)                      │
│  - Applied: 15 (Green)                     │
│  - Active: 5 (Dark Green)                  │
│                                             │
│  💰 FUNDING TRAJECTORY (Bar Chart)          │
│  (Last 6 months, trending up)              │
│  Jan→Feb→Mar→Apr→May→Jun                    │
│                                             │
└─────────────────────────────────────────────┘
```

**Interactions**:
- Hover over metric cards → show tooltip with details
- Click "Add Opportunity" → open modal with grant entry form
- Click chart segments → filter opportunities by that status
- Quick action buttons → jump directly to those pages

**Visual Design**:
- Large, bold typography for metrics (36px for numbers)
- Soft shadows on cards (1-2px blur)
- Smooth gradient backgrounds (light blue → light purple)
- Icons + text for all buttons
- Color-coded status legend matches prospecting page

**Images/Media**:
- BTS logo in top-left corner
- Subtle background pattern (grid or waves)
- Animated chart transitions on page load

---

### PAGE 2: GRANTS (Grant Discovery)
**Purpose**: Browse, filter, and manage 18+ real Australian grant opportunities

**Layout**:
```
┌─────────────────────────────────────────────┐
│  GRANTS & FUNDING OPPORTUNITIES             │
├─────────────────────────────────────────────┤
│                                             │
│  🔍 SEARCH & FILTERS (Top)                  │
│  [Search term_________] [By Status ▼]      │
│  [By Fit Score ▼] [By Deadline ▼]          │
│                                             │
│  📋 GRANT CARDS (Vertical List/Stack)       │
│  ┌─────────────────────────────────┐        │
│  │ 🏛️ TITLE: Australian Tech Fund   │        │
│  │ Organization: Innovation Aus     │        │
│  │ 💰 $250,000 | ⏰ 30 Jun 2026      │        │
│  │ ⭐ Fit: 8/10 | Status: Prepared  │        │
│  │ [View Details] [Generate Proposal]       │
│  └─────────────────────────────────┘        │
│                                             │
│  ┌─────────────────────────────────┐        │
│  │ 🏛️ TITLE: Digital Skills Grant   │        │
│  │ Organization: Victorian Govt    │        │
│  │ 💰 $180,000 | ⏰ 15 Aug 2026      │        │
│  │ ⭐ Fit: 7/10 | Status: Applied   │        │
│  │ [View Details] [Generate Proposal]       │
│  └─────────────────────────────────┘        │
│                                             │
└─────────────────────────────────────────────┘
```

**Interactions**:
- Type in search → filter grants by title/org in real-time
- Click status filter → show only that status
- Hover over fit score → tooltip explains calculation
- Click "View Details" → modal opens with full grant info + deadline urgency (red if <30 days)
- Click "Generate Proposal" → jumps to Proposal Generator with grant pre-selected

**Visual Design**:
- Card-based layout, consistent spacing (16px gap)
- Status badges: Amber/Orange/Blue/Green based on pipeline stage
- Fit score as star rating (visual ⭐⭐⭐ format)
- Deadline warning: RED text if <30 days (urgency indicator)
- Hover effect: Slight lift (2-3px shadow increase), background lightens

**Images/Media**:
- Government/organization logos (small, 40px square)
- Deadline clock icon
- Fit score stars (SVG icons)

---

### PAGE 3: PROSPECTING ⭐ PRIORITY (Partnership Scout)
**Purpose**: Browse 180+ company prospects, filter by tier/sector, find strategic partners

**Layout - TIER FILTER PILLS (Top):**
```
┌─────────────────────────────────────────────┐
│  PROSPECTING - FIND STRATEGIC PARTNERS      │
├─────────────────────────────────────────────┤
│                                             │
│  BUSINESS TIER FILTERS (Pill Buttons):      │
│  [🥇 Tier 1: Tech Giants] [🥈 Tier 2]       │
│  [🥉 Tier 3: SME] [4️⃣ Tier 4: Regional]    │
│                                             │
│  SECTOR FILTERS (Secondary):                │
│  [All] [🔧 Tech] [🏥 Health] [🌱 Sustain]  │
│  [📱 Communications] [💼 Finance]           │
│                                             │
│  🔍 Search: [_________________]             │
│                                             │
```

**Layout - COMPANY GRID (Main):**
```
┌─────────────────────────────────────────────┐
│  COMPANY CARDS (2-3 Column Grid)            │
│                                             │
│  ┌──────────────┐  ┌──────────────┐        │
│  │              │  │              │        │
│  │   [Logo]     │  │   [Logo]     │        │
│  │              │  │              │        │
│  │ Google       │  │ Microsoft    │        │
│  │ 🥇 Tier 1    │  │ 🥇 Tier 1    │        │
│  │ [3 Programs] │  │ [4 Programs] │        │
│  │ Location: CA │  │ Location: WA │        │
│  │              │  │              │        │
│  │ [Click to    │  │ [Click to    │        │
│  │  expand]     │  │  expand]     │        │
│  └──────────────┘  └──────────────┘        │
│                                             │
│  ┌──────────────┐  ┌──────────────┐        │
│  │   [Logo]     │  │   [Logo]     │        │
│  │ Amazon       │  │ BHP Billiton │        │
│  │ 🥇 Tier 1    │  │ 🥇 Tier 1    │        │
│  │ [2 Programs] │  │ [3 Programs] │        │
│  │ Location: TX │  │ Location: AU │        │
│  └──────────────┘  └──────────────┘        │
│                                             │
└─────────────────────────────────────────────┘
```

**Tier Pills Visual Design:**
- Tier 1: GOLD background (#fcd34d) with white text, bold
- Tier 2: SILVER background (#cbd5e1) with dark text
- Tier 3: BRONZE background (#92400e) with white text
- Tier 4: GRAY background (#6b7280) with white text
- Active tier: Border highlight (2px solid border in primary color)
- Hover: Slight background darken, cursor pointer

**Company Card (Collapsed State):**
```
┌───────────────────────┐
│      [Company Logo]   │  ← 60x60px
│    (100x100 card)     │
│                       │
│   Company Name        │ ← 14px bold
│   🥇 Tier 1           │ ← Colored badge
│                       │
│   [AI, Health, CSR]   │ ← Tag pills
│   📍 Location         │
│                       │
│  Click to Explore →   │ ← Hover hint
└───────────────────────┘
```

**Company Card (Expanded State - Modal or Side Panel):**
```
┌─────────────────────────────────────────────┐
│  [Close X]                                  │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │      [Large Company Logo 150x150]    │  │
│  │                                      │  │
│  │      GOOGLE AUSTRALIA                │  │
│  │      🥇 Tier 1 | Tech | Sydney       │  │
│  │      ⭐ Fit Score: 8.5/10             │  │
│  │                                      │  │
│  │  🎯 ALIGNED BTS PROGRAMS:            │  │
│  │  [🔵 AI Academy] [🟣 GenIUS]         │  │
│  │  [🟢 Communication] [🟠 Job Ready]   │  │
│  │                                      │  │
│  │  💼 COMPANY INFO:                    │  │
│  │  Size: 1000+ employees               │  │
│  │  Sector: Technology                  │  │
│  │  Website: google.com.au              │  │
│  │                                      │  │
│  │  CSR FOCUS:                          │  │
│  │  Education, digital inclusion,       │  │
│  │  STEM workforce development          │  │
│  │                                      │  │
│  │  📧 EMAIL CONTACT:                   │  │
│  │  partnerships@google.com.au          │  │
│  │                                      │  │
│  │  FUNDING CAPACITY:                   │  │
│  │  🟢 High ($500k+) | Track record: ✅│  │
│  │                                      │  │
│  │  📝 COLLABORATION IDEAS:             │  │
│  │  - Internship sponsorship            │  │
│  │  - Equipment donation                │  │
│  │  - Employee mentorship program       │  │
│  │                                      │  │
│  │  [📧 Generate Email] [📞 Log Contact]  │
│  │  [❤️ Save] [📋 Add Note]              │  │
│  └──────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

**Interactions**:
- Click tier pill → filter to that tier only (active state highlighted)
- Click sector filter → AND filtering (show only companies in that sector + tier)
- Type in search → real-time filter by company name
- Hover over card → slight lift, shadow increase, cursor changes to pointer
- Click card → smooth modal/panel open with full details
- Click "Generate Email" → pre-populates email generator with company name
- Click "Log Contact" → opens contact log modal
- Click "Save" → adds to favorites (heart icon turns red)

**Visual Design**:
- Grid layout (responsive: 1 col mobile, 2 col tablet, 3 col desktop)
- Company cards: Clean white background, 8px border-radius
- Tier badge: Positioned top-right, with icon
- Program tags: Colorful pills (each program has unique color)
- Hover: Smooth transition (0.2s), shadow lifts 2-3px
- Modal/Panel: Smooth fade-in, semi-transparent overlay background

**Program Tag Colors:**
- AI Academy: #3b82f6 (Blue)
- GenIUS: #a855f7 (Purple)
- Communication: #10b981 (Green)
- Job Readiness: #f59e0b (Orange)
- Health: #ef4444 (Red)
- Sustainability: #14b8a6 (Teal)

**Images/Media:**
- Company logos (60x60px for grid, 150x150px for expanded)
- Tier badge icons (🥇 🥈 🥉 4️⃣)
- Location pin icon (📍)
- Program icons/colors (5-6 different colored tag badges)
- "Fit score" visual indicator (stars or progress bar)

---

### PAGE 4: GENERATE PROPOSAL (Content Creation)
**Purpose**: AI-powered proposal and email generation

**Layout - MODE SELECTOR:**
```
┌─────────────────────────────────────────────┐
│  GENERATE PROPOSAL & OUTREACH               │
├─────────────────────────────────────────────┤
│                                             │
│  📌 SELECT MODE:                            │
│  [💰 Grant Proposal] [📧 Prospecting Email]  │
│                                             │
│  (Large buttons, toggle between modes)      │
│                                             │
```

**Layout - GRANT PROPOSAL MODE (Left Panel):**
```
┌──────────────────────────────────────────────┐
│  GRANT PROPOSAL GENERATOR                    │
├──────────────────────────────────────────────┤
│                                              │
│  STEP 1: SELECT GRANT                        │
│  [Dropdown: Choose a grant...]  ▼            │
│  Selected: Australian Tech Fund              │
│                                              │
│  STEP 2: BTS PROGRAM FOCUS *                 │
│  [Dropdown: AI Academy, GenIUS, etc.] ▼      │
│  Selected: AI Academy                        │
│                                              │
│  STEP 3: REQUESTED AMOUNT *                  │
│  [$________] (e.g., $150,000)                │
│                                              │
│  STEP 4: TARGET OUTCOME *                    │
│  [Large textarea________________________]      │
│  (What do you want to achieve?)              │
│  [________________]                         │
│                                              │
│  [✨ Generate Proposal] (Loading spinner)    │
│                                              │
└──────────────────────────────────────────────┘
```

**Layout - PROSPECTING EMAIL MODE (Left Panel):**
```
┌──────────────────────────────────────────────┐
│  PROSPECTING EMAIL GENERATOR                 │
├──────────────────────────────────────────────┤
│                                              │
│  STEP 1: SELECT COMPANY                      │
│  [Dropdown: Choose a company...] ▼           │
│  Selected: Google Australia                  │
│                                              │
│  STEP 2: COLLABORATION IDEAS *               │
│  [Large textarea________________________]      │
│  (Sponsorship, mentorship, internships?)     │
│  [________________]                         │
│                                              │
│  STEP 3: CONTACT NAME (Optional)             │
│  [John Smith_______________]                │
│                                              │
│  [📧 Generate Email] (Loading spinner)      │
│                                              │
└──────────────────────────────────────────────┘
```

**Layout - RESULT PANEL (Right Side):**
```
┌──────────────────────────────────────────────┐
│  GENERATED PROPOSAL / EMAIL                  │
├──────────────────────────────────────────────┤
│                                              │
│  [Scrollable text area]                      │
│  ┌────────────────────────────────────────┐  │
│  │ [Proposal/Email Content from Claude]  │  │
│  │                                        │  │
│  │ Dear Hiring Manager,                  │  │
│  │                                        │  │
│  │ Google Australia is perfectly aligned │  │
│  │ with BTS's AI Academy program...      │  │
│  │ [... continues ...]                   │  │
│  │                                        │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ACTION BUTTONS (Bottom):                    │
│  [📋 Copy to Clipboard]                      │
│  [📄 Download as Word] (Grant only)          │
│  [📧 Send Email] (Email only)                │
│  [💾 Save to Contacts]                       │
│                                              │
└──────────────────────────────────────────────┘
```

**Interactions**:
- Click mode button → smooth transition, form changes, result clears
- Type into form fields → form validates in real-time
- Click "Generate" → loading spinner appears (1-3 second delay to simulate AI)
- Result appears with fade-in animation
- Click "Copy" → tooltip shows "Copied!" then fades
- Click "Download as Word" → browser download (.docx file)
- Click "Send Email" → opens email composer

**Visual Design**:
- Split layout: Form (40%) | Result (60%)
- Form inputs: Clean, with labels + placeholders
- Loading state: Spinning icon + "Generating..." text
- Result text: Monospace font (code-like), light gray background
- Buttons: Large, colorful, with icons
- Mode buttons: Active mode = bright blue, inactive = gray

**Images/Media:**
- Loading spinner animation (rotating circle)
- Grant/company logos in dropdowns
- Copy icon, download icon, email icon
- Tooltip animations

---

### PAGE 5: CONTACTS (Relationship Tracking)
**Purpose**: Log all outreach, track follow-ups, monitor conversion pipeline

**Layout:**
```
┌─────────────────────────────────────────────┐
│  CONTACTS & OUTREACH TRACKING               │
├─────────────────────────────────────────────┤
│                                             │
│  📌 FILTERS:                                │
│  [By Stage ▼] [By Type ▼] [By Date ▼]      │
│  [Search contact_________]                  │
│                                             │
│  📞 CONTACT LOG (Timeline View):            │
│  ┌──────────────────────────────────┐      │
│  │ 📧 Google Australia               │      │
│  │ Contact: John Smith               │      │
│  │ Type: Email | Date: 18 May 2026   │      │
│  │ Stage: Follow-up | Next: 25 May   │      │
│  │ [View] [Edit] [Delete]            │      │
│  └──────────────────────────────────┘      │
│                                             │
│  ┌──────────────────────────────────┐      │
│  │ 📞 Microsoft Australia             │      │
│  │ Contact: Sarah Johnson             │      │
│  │ Type: Call | Date: 15 May 2026    │      │
│  │ Stage: Active Conversation         │      │
│  │ Next: 22 May                       │      │
│  │ [View] [Edit] [Delete]            │      │
│  └──────────────────────────────────┘      │
│                                             │
│  [+ Add New Contact]                        │
│                                             │
└─────────────────────────────────────────────┘
```

**Interactions**:
- Click "Add New Contact" → modal opens with form
- Click "[Edit]" → edit contact details
- Filter by stage → show only active/warm/cold contacts
- Click contact → expand to show full details + notes + history

---

## 🎨 VISUAL DESIGN SYSTEM

### Color Palette
```
PRIMARY ACTIONS: #0EA5E9 (Cyan/Sky Blue)
SUCCESS STATE: #10b981 (Emerald Green)
WARNING/URGENCY: #f59e0b (Amber) or #ef4444 (Red if <30 days)
SECONDARY: #8b5cf6 (Purple)

TIER COLORS:
- Tier 1: #fcd34d (Gold)
- Tier 2: #cbd5e1 (Silver)
- Tier 3: #92400e (Bronze)
- Tier 4: #6b7280 (Gray)

PROGRAM COLORS:
- AI Academy: #3b82f6 (Blue)
- GenIUS: #a855f7 (Purple)
- Communication: #10b981 (Green)
- Job Readiness: #f59e0b (Orange)
- Health: #ef4444 (Red)
- Sustainability: #14b8a6 (Teal)

NEUTRAL:
- Background: #ffffff (white) or #f9fafb (light gray)
- Text: #111827 (dark gray) for headers, #4b5563 for body
- Borders: #e5e7eb (light gray)
```

### Typography
- **Headers (H1)**: 32px, bold, dark gray
- **Section Headers (H2)**: 24px, semibold, dark gray
- **Card Titles**: 16px, semibold
- **Body Text**: 14px, regular, medium gray
- **Labels**: 12px, medium, uppercase, light gray
- **Monospace (Code/Proposal)**: 13px, Monaco/Courier

### Spacing & Layout
- **Base Unit**: 8px grid (all spacing multiples of 8)
- **Card Padding**: 16-20px
- **Gap Between Cards**: 16px
- **Section Margin**: 32px vertical
- **Container Max Width**: 1200px
- **Mobile Padding**: 12px (all sides)

### Interactive Elements
- **Button Padding**: 12px 20px (medium), 14px 28px (large)
- **Border Radius**: 8px (cards), 6px (buttons), 4px (inputs)
- **Hover States**: 
  - Cards: +2px shadow lift, background 1% darker
  - Buttons: 5% darker color, 0.2s transition
  - Text links: Underline appears, color brightens
- **Active States**: 
  - Buttons: Bright border/background (primary color)
  - Filter pills: Border highlight + check icon
- **Disabled States**: 50% opacity, cursor: not-allowed
- **Loading States**: Spinner animation, "Loading..." text, button disabled

### Shadows & Depth
- **Subtle**: 0px 1px 2px rgba(0,0,0,0.05)
- **Card**: 0px 2px 8px rgba(0,0,0,0.08)
- **Hover**: 0px 4px 12px rgba(0,0,0,0.12)
- **Modal**: 0px 10px 30px rgba(0,0,0,0.15)

---

## 🎬 INTERACTION & ANIMATION SPECS

### Page Transitions
- **Fade-in**: 0.3s ease-out on page load
- **Slide-up**: Cards/modals slide up from bottom (0.2s ease-out)
- **Scale**: Buttons scale 0.95x → 1x on hover (0.1s)

### Loading States
- **Spinner**: Rotating circle, 1.5s rotation
- **Skeleton**: Gray placeholder bars pulse (1s opacity fade)
- **Progress**: If multi-step, show step indicator (1/3, 2/3, 3/3)

### Feedback
- **Copy to Clipboard**: Toast notification "Copied!" (2s fade)
- **Form Validation**: Red error text below field, field gets 1px red border
- **Success**: Green checkmark icon + "Success!" toast
- **Errors**: Red background modal with error message

### Micro-interactions
- **Tier Filter**: When clicked, add ripple effect + scale 1.05x
- **Card Expansion**: Smooth height transition (0.3s), content fades in
- **Tag Selection**: When clicked, background color highlights (0.15s)

---

## 📊 KEY FEATURES & WORKFLOWS

### Feature 1: Instant Proposal Generation
**User**: Clicks "Generate Proposal" with grant details filled
**System**:
1. Sends request to `/api/proposals/generate` with context
2. Claude API (3.5 Sonnet) generates 500-800 word proposal
3. Result appears in 1-3 seconds
4. User can copy, download, edit, or regenerate

**Success Indicator**: Generated proposal matches grant requirements + BTS programs

### Feature 2: Tier-Based Company Browsing
**User**: Starts with Tier 1 (Google, Amazon, Microsoft)
**System**:
1. Shows 30-40 Tier 1 companies in grid
2. User filters by sector (Tech, Health, Sustainability)
3. Clicks company → sees aligned BTS programs with fit score
4. Can generate outreach email in 1 click

**Success Indicator**: User can browse 180+ companies without friction

### Feature 3: Automated Daily Prospect Discovery
**System**: Every day at 9am
1. Claude API generates 20-30 new prospects
2. Stores in database with tier + programs
3. Dashboard shows "10 new prospects found today"
4. User can review, add, or ignore

**Success Indicator**: Database grows 20-30 companies/day (600+/month)

### Feature 4: Contact Pipeline Tracking
**User**: Logs every outreach (call, email, meeting)
**System**:
1. Records contact date, method, company/grant
2. AI suggests follow-up date (3, 7, 14 days based on type)
3. Dashboard shows conversion funnel (contacted → interested → active)
4. Reports on conversion rate

**Success Indicator**: User sees pipeline value ($5.55M) breakdown by stage

---

## 🖼️ IMAGES & MEDIA REQUIREMENTS

### Company Logos (Prospecting Page)
- **Size**: 60x60px (grid), 150x150px (expanded)
- **Format**: PNG with transparent background
- **Source**: Use company official logos OR generic colored squares with company initials
- **Fallback**: If no logo available, show gradient bg with company name

### Government/Organization Logos (Grants Page)
- **Size**: 40x40px
- **Format**: PNG transparent
- **Examples**: Department of Education, Innovation Australia, State Government seals

### Icons (Throughout)
- **Style**: Clean line icons, 2px stroke weight
- **Icons Needed**: 
  - Grant icon 💰
  - Company icon 🏢
  - Contact icon 📞
  - Email icon 📧
  - Location icon 📍
  - Calendar/Deadline ⏰
  - Checkmark ✅
  - Star (fit score) ⭐
  - Tier badges (🥇🥈🥉)

### Hero/Background Images
- **Dashboard**: Soft gradient (blue → purple → white)
- **Prospecting**: Subtle grid or wave pattern
- **Proposals**: Minimalist background (white or off-white)

### Visual Indicators
- **Fit Score**: Stars (1-5) OR progress bar (0-100%)
- **Status Badges**: Colored pills with text (Prepared, Applied, etc.)
- **Tier Badges**: Colored circles with tier number (1, 2, 3, 4)
- **Program Tags**: Small colored pills with text

---

## 💻 TECHNICAL INTEGRATION POINTS

### APIs Connected to UI
1. **Dashboard**: `/api/opportunities/summary` → Metrics
2. **Grants**: `/api/opportunities` → Grant list
3. **Prospecting**: `/api/companies?tier=1&sector=tech` → Company list
4. **Proposals**: 
   - `/api/proposals/generate` (POST) → Grant proposals
   - `/api/proposals/generate-email` (POST) → Prospecting emails
5. **Contacts**: `/api/contacts` (GET/POST) → Contact log
6. **Daily Discovery**: `/api/admin/trigger-discovery` (POST) → New prospects

### Real-Time Updates
- **New Prospects**: Refresh companies list every 5 min (or on page focus)
- **Daily Discovery**: At 9am, dashboard shows "New prospects found" notification
- **Contact Log**: New contacts appear immediately after logging

### Authentication
- **Current**: Solo user (no login required)
- **Future**: Add JWT-based login with email/password

---

## 📱 RESPONSIVE DESIGN BREAKPOINTS

### Mobile (320px - 768px)
- Single column layouts
- Hamburger menu for navigation
- Bottom sheet modals instead of center modals
- Stacked buttons (vertical)

### Tablet (768px - 1024px)
- Two-column grids
- Side navigation collapse to icons
- Horizontal scrolling for charts

### Desktop (1024px+)
- Three-column grids
- Full navigation sidebar
- Side-by-side panels (form + result)

---

## ✨ AESTHETIC ENHANCEMENTS

### Micro-Interactions Worth Including
1. **Floating Action Buttons**: "Generate Proposal" floats bottom-right on scroll
2. **Confetti Animation**: When proposal generated successfully
3. **Typing Effect**: As Claude generates text, show character-by-character animation
4. **Progress Ring**: Show generation progress (1-100%) instead of generic spinner
5. **Parallax Scrolling**: Dashboard metrics cards move slightly on scroll
6. **Card Flip**: On hover, company card flips to show more info (CSS 3D)
7. **Toast Notifications**: Slide in from top-right, auto-dismiss after 2s

### Visual Polish
1. **Gradient Text**: Company names use subtle gradient (blue → purple)
2. **Glassmorphism Cards**: Semi-transparent background with blur effect
3. **Smooth Corners**: All cards have consistent 8px border-radius
4. **Consistent Spacing**: 8px grid throughout
5. **Color Transitions**: Hover states smoothly transition over 0.15-0.2s
6. **Icons with Text**: Every button has icon + label for clarity

---

## 🎯 SUCCESS CRITERIA FOR LOVABLE REDESIGN

✅ **Prospecting Page**
- Grid layout (2-3 columns) for company cards
- Tier filters work (Tier 1→4 toggles)
- Expanded view shows all details + aligned programs
- Generate email button works
- Responsive on mobile

✅ **Dashboard**
- Large metric cards with visual hierarchy
- Charts render and are interactive
- Quick action buttons visible and clickable
- Animations smooth and professional

✅ **Generate Proposal**
- Mode toggle works (Grant ↔ Email)
- Form inputs validate
- Generate button triggers API call
- Results appear with fade-in animation
- Copy/Download buttons functional

✅ **Grants Page**
- Cards display with fit score + deadline
- Filters work (status, fit score, deadline)
- Search filters in real-time
- Generate proposal pre-populates company

✅ **Overall**
- Loading states visible with spinners
- Hover/active states on all interactive elements
- Consistent color scheme throughout
- Responsive design on mobile/tablet/desktop
- No broken links or API calls

---

## 🚀 IMPLEMENTATION PRIORITY

**High Priority (Do First):**
1. Prospecting grid layout + tier filters
2. Dashboard metrics + charts
3. Generate Proposal mode toggle + API integration

**Medium Priority (Do Second):**
4. Grants list + filters
5. Company card expanded view
6. Contact log

**Low Priority (Nice to Have):**
7. Advanced animations (confetti, typing effect)
8. Email composer integration
9. Advanced fit score visualization

---

**This brief provides enough detail for Lovable to recreate the entire system with professional design, beautiful interactions, and responsive layouts. All technical connections and data flows are documented.**
