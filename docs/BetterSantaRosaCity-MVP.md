# Better Santa Rosa City — MVP Specification

**Project:** BetterSantaRosaCity.org  
**Purpose:** Independent, community-maintained public-information and transparency portal for Santa Rosa City, Laguna  
**Status:** MVP / v1.0  
**Primary stack:** Nuxt 4 + Tailwind CSS + Nuxt Content + Pagefind  
**Hosting:** Cloudflare Pages preferred; GitHub Pages/Netlify acceptable  
**Database:** None for MVP  
**Cost target:** ₱0/month excluding domain

---

## 1. Product Definition

Better Santa Rosa City is an independent civic-information website that makes public information about the City of Santa Rosa, Laguna easier to discover, understand, compare, and navigate.

It is **not an official City Government of Santa Rosa website** and must never present itself as one.

The MVP should act as a public-information discovery layer over authoritative sources such as:

- Santa Rosa City Government
- COA
- DBM
- Philippine government open-data/public records
- Other clearly identified authoritative sources

The site should link users back to original documents and official services whenever appropriate.

### Core product promise

> **Public information about Santa Rosa, made easier to find and understand.**

Internal design philosophy:

> **Old roots. New city.**

Do not use that phrase as an official city slogan.

---

# 2. MVP Goals

The MVP must prove five things:

1. Citizens can quickly find information about Santa Rosa government.
2. Public information can be presented in a much more understandable way than raw government documents.
3. Every important claim/data point has source attribution.
4. The site can work completely without a database.
5. The architecture can later evolve into a community-powered civic platform.

---

# 3. Non-Goals for MVP

Do NOT build these yet:

- User accounts
- Citizen login
- Comments
- Community moderation system
- Real-time citizen reports
- Messaging
- Online payments
- Government service replacement
- Full procurement database ingestion
- Automated government scraping
- AI chatbot
- Complex admin dashboard
- PostgreSQL/Supabase backend
- Custom CMS
- Notifications
- Social network features

These can be future phases.

---

# 4. Technology Architecture

## Frontend

- Nuxt 4
- Vue 3
- TypeScript
- Tailwind CSS
- Nuxt UI if useful
- Nuxt Content for structured editorial content
- Vue components for data visualizations
- Leaflet + OpenStreetMap for maps
- Chart.js or ECharts for charts
- Pagefind for static search

## Content/Data

Use Git-managed files.

Recommended structure:

```text
/content
  /pages
  /officials
  /barangays
  /departments
  /ordinances
  /budgets
  /projects
  /procurement
  /sources

/data
  city.json
  barangays.json
  officials.json
  departments.json
  projects.json
  budgets.json
  sources.json
```

Use Markdown for human-readable editorial pages.

Use JSON/YAML for structured datasets.

## Hosting

Preferred:

```text
GitHub
   ↓
Nuxt static build
   ↓
Pagefind indexing
   ↓
Cloudflare Pages
   ↓
Citizens
```

No runtime server should be required for the MVP.

---

# 5. Design Direction

The website must NOT look like a generic Philippine government website.

Avoid:

- Huge government seal as hero
- Blue Bootstrap-style government layouts
- Excessive rounded cards
- Generic stock photos
- Glassmorphism
- Neon gradients
- Excessive animations
- Dense administrative tables everywhere
- Dashboard overload
- Fake official-looking branding

## Visual identity

The visual language should combine:

- modern civic technology
- editorial/data journalism
- Santa Rosa heritage
- Laguna/nature
- modern urban development

Recommended balance:

- 60% modern civic-tech
- 20% editorial/data journalism
- 10% Santa Rosa heritage
- 10% geographic/nature identity

## Color palette

Primary:

```text
Deep Laguna Green   #164A3D
Rose Accent         #C96A73
Laguna Blue         #5E9FA5
Heritage Gold       #D6A94B
Warm Parchment      #F6F3EA
Charcoal            #182421
```

Do not use every color everywhere.

Suggested modes:

### Modern City

- White
- Deep green
- Charcoal
- Gold

### Heritage

- Parchment
- Deep green
- Muted rose
- Gold

### Nature / Future

- Off-white
- Laguna blue
- Green

## Typography

Use a modern sans-serif for UI.

Suggested:

- Inter
- Geist
- Manrope

Optional editorial serif:

- Source Serif 4

Headings should feel editorial and confident, not corporate.

---

# 6. Santa Rosa Identity

The design should feel specific to Santa Rosa.

Use these motifs carefully:

## Rose

Santa Rosa is named after Saint Rose of Lima.

Do not use literal rose clip-art.

Instead use:

- abstract rose geometry
- line-art rose
- rose-like radial patterns
- subtle rose details in illustrations

## Map

A simplified Santa Rosa map should become a recurring design motif.

Use it for:

- homepage visual
- barangay exploration
- project map
- decorative section backgrounds

## 18 Barangays

Santa Rosa has 18 barangays.

This should become a major information architecture element.

The site should eventually allow:

> Explore Santa Rosa → Explore all 18 barangays

## Laguna Lake

Three barangays have Laguna Lake frontage:

- Aplaya
- Sinalhan
- Caingin

Use Laguna blue subtly in map/nature sections.

## Heritage

Potential historical narrative:

```text
Barrio Bukol
   ↓
Santa Rosa municipality
   ↓
Agricultural / fishing community
   ↓
Industrialization
   ↓
Modern urban growth
   ↓
Cityhood in 2004
   ↓
Santa Rosa today
```

## Modern identity

Santa Rosa is also associated with:

- manufacturing
- industrial parks
- Enchanted Kingdom
- Nuvali
- SLEX
- major commercial development
- Metro Manila growth corridor

The design should communicate both heritage and modern development.

---

# 7. Brand Positioning

Better Santa Rosa should NOT attempt to replace:

https://santarosacity.gov.ph/

Instead:

### Official Santa Rosa City website

Provides:

- official announcements
- government services
- forms
- payments
- departments
- official documents
- official government information

### Better Santa Rosa

Provides:

- discovery
- organization
- explanations
- searchable public information
- visualizations
- comparisons
- source aggregation
- easier access to public records

Position it as:

> **The public-information layer for Santa Rosa.**

---

# 8. Main Navigation

Desktop navigation:

```text
Explore
Government
Money
Projects
Laws
Services
Data
About
```

Global search should always be highly visible.

Mobile:

```text
Home
Explore
Search
Projects
More
```

---

# 9. Required MVP Pages

## 9.1 Homepage

Route:

```text
/
```

The homepage is the most important page.

### Section 1 — Hero

Headline:

> **Public information about Santa Rosa, made easier to find.**

Supporting text:

> Explore the people, projects, budgets, laws, services and public records of Santa Rosa City.

Large search box:

```text
Search Santa Rosa...
```

Examples:

```text
Search budgets
Search projects
Search ordinances
Search officials
Search barangays
```

Small trust statement:

> Independent community project • Sources linked to original documents

---

### Section 2 — Santa Rosa Today

Show a small set of verified city facts.

Example:

```text
18
Barangays

5,543 ha
Land area

2004
Cityhood

3
Laguna Lake barangays
```

Every number must have a source.

Include:

> View city profile →

---

### Section 3 — Explore Santa Rosa

Large visual map.

Heading:

> **Explore Santa Rosa**

Subheading:

> 18 barangays. One city. Many stories.

Interactive map:

- show 18 barangays
- hover/click barangay
- link to barangay profile
- use OpenStreetMap/Leaflet

Do not attempt highly precise cadastral boundaries in MVP unless authoritative GIS data is available.

---

### Section 4 — Where Does the City's Money Go?

Introductory budget visualization.

Show:

- annual budget
- major expenditure categories
- year selector if multiple years are available

Example:

```text
City Budget
₱X.XB

Personnel
XX%

Services
XX%

Capital Outlay
XX%
```

Only display figures backed by source documents.

CTA:

> Explore city finances →

---

### Section 5 — Building the City

Project showcase.

Cards/list:

- project name
- location
- status
- category
- estimated/approved cost if available
- source

Status:

```text
Planned
Ongoing
Completed
Unknown
```

CTA:

> Explore projects →

---

### Section 6 — Laws & Decisions

Show searchable/recent:

- ordinances
- resolutions
- executive orders
- local policies

Example:

> Find a city ordinance →

---

### Section 7 — Services

Do not duplicate government forms.

Provide categorized links:

```text
Business
Taxes
Permits
Civil Registry
Health
Social Services
Citizen's Charter
Online Services
```

Each service should clearly indicate:

> Official government service

and link to the official destination.

---

### Section 8 — From Bukol to Modern Santa Rosa

Small visual timeline.

Show:

- historical origin
- municipality
- industrialization
- cityhood
- modern Santa Rosa

CTA:

> Discover Santa Rosa's history →

---

### Section 9 — Data Freshness

Show:

```text
Last checked:
September 2026
```

But the implementation should store freshness per dataset.

Example:

```text
Budget data
Last verified: 2026-08-20

Officials
Last verified: 2026-09-01

Projects
Last verified: 2026-08-15
```

Never imply that the entire site is equally current.

---

### Section 10 — About

Short explanation:

> Better Santa Rosa is an independent, community-maintained public-information project. It is not affiliated with or operated by the City Government of Santa Rosa.

Links:

- methodology
- sources
- contribute
- official city website

---

# 10. City Profile

Route:

```text
/explore
```

or:

```text
/about-santa-rosa
```

Content:

- history
- geography
- cityhood
- population
- land area
- 18 barangays
- Laguna Lake
- economy
- industrial development
- tourism
- major landmarks

Use authoritative sources.

---

# 11. Barangays

Route:

```text
/barangays
```

Show all 18 barangays.

Group visually if useful:

### Laguna Lake

- Aplaya
- Sinalhan
- Caingin

### Lowland Urban

- Balibago
- Dila
- Dita
- Malitlit
- Macabling
- Malusak
- Pooc
- Market Area
- Ibaba
- Labas
- Kanluran
- Tagapo

### Upper / Tagaytay side

- Santo Domingo
- Don Jose
- Pulong Santa Cruz

Each barangay gets:

```text
/barangays/{slug}
```

MVP barangay profile:

- name
- map location
- short description
- available public statistics
- known projects
- source links

Do not fabricate missing statistics.

---

# 12. Government Directory

Route:

```text
/government
```

Sections:

- Mayor
- Vice Mayor
- City Council / Sangguniang Panlungsod
- Departments
- Offices

Official information should be clearly sourced.

Official vs community presentation must be distinguishable.

Possible cards:

```text
Office
Purpose
Contact
Official website/page
Source
Last verified
```

---

# 13. Money / Budget

Route:

```text
/money
```

Subpages:

```text
/money/budget
/money/revenue
/money/expenditures
/money/procurement
```

MVP should prioritize budget.

## Budget page

Display:

- fiscal year
- total budget
- major categories
- visual chart
- downloadable/source documents
- source date
- methodology note

Avoid making political judgments.

Do not label spending as:

- wasteful
- corrupt
- suspicious

unless reporting verified findings from authoritative sources and clearly attributing them.

---

# 14. Projects

Route:

```text
/projects
```

Filters:

```text
Status
Barangay
Category
Year
```

Project card:

```text
Project name
Location
Barangay
Status
Year
Cost
Source
```

Project detail:

```text
/projects/{slug}
```

Include:

- description
- location
- map if possible
- status
- budget/cost
- implementing office
- timeline
- source documents
- last verified date

If data is incomplete, explicitly show:

> Information unavailable in the source reviewed.

Never fill gaps with assumptions.

---

# 15. Laws

Route:

```text
/laws
```

Categories:

- Ordinances
- Resolutions
- Executive Orders
- Other local issuances

Search/filter:

```text
Year
Type
Keyword
Number
```

Detail page:

```text
/laws/{slug}
```

Show:

- title
- number
- date
- summary
- document
- source
- related topics

Summaries should be neutral and clearly marked as Better Santa Rosa summaries.

---

# 16. Procurement

Route:

```text
/procurement
```

MVP can initially be a curated explorer rather than a complete database.

Fields:

```text
Procurement title
Agency/office
Category
Date
Amount
Status
Source
```

Clearly communicate coverage:

> This section contains selected publicly available procurement records and is not necessarily a complete representation of all city procurement.

Future version can ingest PhilGEPS/other sources.

---

# 17. Services

Route:

```text
/services
```

Categories:

- Business
- Permits
- Taxes
- Civil Registry
- Health
- Social Services
- Citizen's Charter
- Online Services

Every external government destination should be marked:

> Official source

Do not recreate transactional services.

---

# 18. Data & Downloads

Route:

```text
/data
```

This is a major differentiator.

Provide downloadable:

- barangay data
- officials
- budget data
- projects
- ordinances
- source registry

Formats:

```text
JSON
CSV
Markdown
PDF links where applicable
```

Each dataset should include:

```text
Dataset name
Description
Coverage
Last updated
Source
License/usage note if known
```

---

# 19. Universal Search

Route:

```text
/search
```

Use **Pagefind**.

Requirements:

- search all generated public pages
- fast browser-side search
- no API
- no database
- no Algolia
- mobile-friendly
- highlight matched text
- group/filter results by content type where possible

Search categories:

```text
All
Officials
Barangays
Projects
Laws
Budget
Services
Pages
```

The search should feel like the central product feature.

---

# 20. Sources & Methodology

Route:

```text
/sources
```

Explain:

### Source hierarchy

Prefer:

1. Official Santa Rosa City Government
2. Philippine national government agencies
3. COA
4. DBM
5. Official government datasets
6. Established institutional/academic sources
7. Reputable secondary sources

Every factual dataset should record its source.

Example schema:

```json
{
  "source": "Santa Rosa City Government",
  "title": "2026 Annual Budget",
  "url": "https://...",
  "publishedAt": "2026-01-01",
  "accessedAt": "2026-09-01"
}
```

---

# 21. Data Model

Use simple structures.

## Official

```json
{
  "name": "",
  "position": "",
  "office": "",
  "term": "",
  "photo": "",
  "bio": "",
  "contact": "",
  "officialUrl": "",
  "source": "",
  "lastVerified": ""
}
```

## Barangay

```json
{
  "name": "",
  "slug": "",
  "group": "",
  "description": "",
  "latitude": null,
  "longitude": null,
  "source": "",
  "lastVerified": ""
}
```

## Project

```json
{
  "name": "",
  "slug": "",
  "description": "",
  "barangay": "",
  "category": "",
  "status": "",
  "year": "",
  "budget": null,
  "location": "",
  "latitude": null,
  "longitude": null,
  "implementingOffice": "",
  "sources": [],
  "lastVerified": ""
}
```

## Budget

```json
{
  "year": 2026,
  "total": null,
  "categories": [],
  "source": "",
  "documentUrl": "",
  "lastVerified": ""
}
```

## Law

```json
{
  "type": "ordinance",
  "number": "",
  "title": "",
  "date": "",
  "summary": "",
  "documentUrl": "",
  "source": "",
  "lastVerified": ""
}
```

---

# 22. Source Attribution UI

Every important data visualization/card must make source context easy to see.

Recommended pattern:

```text
₱2.4B
City Budget

FY 2026

Source: City Government of Santa Rosa
Last verified: Aug 20, 2026
View original document →
```

Do not hide sources behind a generic footer.

For summaries:

```text
Better Santa Rosa summary
Based on: Official Ordinance No. XXXX
```

---

# 23. Trust & Transparency Rules

The project itself must be transparent.

Every dataset should answer:

- Where did this come from?
- When was it last checked?
- What period does it cover?
- Is it complete?
- Who maintains this page?

Use labels:

```text
Official source
Community presentation
External source
Last verified
Coverage
```

Never imply official endorsement.

---

# 24. Error / Missing Data Handling

Never invent data.

If a source does not provide something:

```text
Data not available in the source reviewed.
```

If a link is broken:

```text
Original source currently unavailable.
```

If information may be outdated:

```text
Needs verification
```

Provide:

> Report incorrect information

This can initially be a mailto/contact link or simple external form.

No backend required.

---

# 25. About / Disclaimer

The site must prominently state:

> Better Santa Rosa City is an independent, community-maintained public-information project. It is not affiliated with, operated by, or endorsed by the City Government of Santa Rosa, Laguna.

Also explain:

- information is compiled from public sources
- official sources remain authoritative
- Better Santa Rosa organizes/summarizes information for accessibility
- users should verify important information with the original source

---

# 26. Accessibility

Minimum requirements:

- semantic HTML
- keyboard navigation
- visible focus states
- good color contrast
- alt text
- accessible buttons
- responsive typography
- reduced-motion support
- screen-reader-friendly navigation
- charts should have textual summaries

Do not rely on color alone to communicate status.

---

# 27. Performance

Target:

- static generation wherever possible
- minimal client-side JavaScript
- optimized images
- lazy-load maps/charts
- no huge hero video
- Pagefind loaded only when search is used
- good Core Web Vitals
- mobile-first

Target:

```text
Lighthouse Performance: 90+
Accessibility: 95+
Best Practices: 95+
SEO: 95+
```

These are targets, not reasons to delay launch.

---

# 28. SEO

Every content page should have:

- unique title
- meta description
- canonical URL
- OpenGraph metadata
- structured headings
- internal links
- descriptive URLs
- sitemap
- robots.txt

Examples:

```text
/barangays/balibago
/projects/...
/laws/...
/government/...
/money/budget
```

Use structured data where appropriate.

Potential schema:

- Organization
- GovernmentOrganization where appropriate
- Article
- Dataset
- BreadcrumbList

Do not falsely identify Better Santa Rosa as the government organization.

---

# 29. Analytics

Use a privacy-conscious analytics solution.

Prefer:

- Cloudflare Web Analytics

Optionally:

- Google Analytics

Track useful events:

```text
search
search_result_click
project_view
budget_view
source_click
official_service_click
barangay_view
dataset_download
```

Do not collect unnecessary personal information.

---

# 30. MVP Content Strategy

Do NOT wait until every government dataset is available.

Launch with high-quality, limited coverage.

Recommended initial content:

### Core

- city profile
- 18 barangays
- current officials
- major departments
- current/recent budget information
- selected projects
- selected ordinances
- major government services
- source/methodology page

Quality is more important than quantity.

---

# 31. Suggested MVP Dataset Priority

## Priority 1

1. City profile
2. Barangays
3. Officials
4. Departments
5. Budget
6. Services
7. Sources

## Priority 2

8. Projects
9. Ordinances
10. Procurement

## Priority 3

11. Historical timeline
12. Open datasets
13. More detailed financial analysis
14. Project map enrichment

---

# 32. Homepage UX

The homepage should feel like a public-information search engine.

Desired emotional progression:

### First impression

> “That's Santa Rosa.”

### After a few seconds

> “This isn't the usual government website.”

### After searching

> “I can actually find information here.”

### After exploring money/projects

> “I can understand where the city's money and projects are going.”

### After exploring sources

> “I can verify this myself.”

---

# 33. Responsive Design

Mobile is a first-class experience.

Mobile homepage order:

```text
Hero
↓
Search
↓
Santa Rosa Today
↓
Explore Barangays
↓
Budget
↓
Projects
↓
Services
↓
Laws
↓
History
↓
Sources
```

Avoid oversized desktop-only visualizations.

---

# 34. Components

Create reusable components.

Suggested:

```text
CivicHeader
CivicFooter
GlobalSearch
PagefindSearch
SourceBadge
SourceCitation
LastVerified
DataCard
StatCard
SectionHeader
ProjectCard
ProjectStatus
OfficialCard
BarangayCard
BarangayGrid
BudgetChart
ProjectMap
Timeline
DocumentCard
ServiceCard
FilterBar
EmptyState
DataFreshness
DisclaimerBanner
```

---

# 35. Status System

Project statuses:

```text
Planned
Ongoing
Completed
Cancelled
Unknown
```

Use accessible labels and icons, not color alone.

---

# 36. Data Freshness

Implement a reusable freshness component.

Example:

```text
Last verified 12 days ago
```

Optional states:

```text
Fresh
Needs review
Outdated
Unknown
```

Do not automatically claim freshness based only on page build date.

---

# 37. Development Workflow

The AI coding agent MUST follow:

## Step 1 — Understand

Inspect:

- repository
- existing files
- Nuxt version
- package manager
- deployment configuration

Do not rewrite an existing project blindly.

## Step 2 — Plan

Create:

```text
docs/superpowers/
```

Use:

```text
docs/superpowers/plan.md
```

Classify work as:

```text
NEW
UPDATE
BUG
```

## Step 3 — Implement

Prefer small vertical slices.

Example:

```text
Homepage shell
↓
Content model
↓
Barangays
↓
Search
↓
Budget
↓
Projects
↓
Sources
```

## Step 4 — Test

Use TDD where practical:

```text
RED
↓
GREEN
↓
REFACTOR
```

## Step 5 — QA

Check:

- mobile
- desktop
- accessibility
- links
- SEO
- source attribution
- no fabricated data
- build
- Pagefind indexing
- Lighthouse
- broken images
- console errors

Do not commit/push/delete branches unless explicitly instructed by the user.

---

# 38. AI Agent Safety Rules

The orchestrator must never:

- invent government statistics
- invent officials
- invent project costs
- imply government affiliation
- scrape aggressively
- bypass website restrictions
- copy copyrighted site content wholesale
- present AI-generated claims as facts
- hide source URLs
- remove disclaimers
- add a database without approval
- add paid services when free alternatives exist

When uncertain:

> Stop and ask for clarification rather than fabricate.

---

# 39. Future Architecture

The MVP is intentionally static.

Possible future additions:

```text
MVP
 │
 ├── Static content
 ├── Pagefind
 ├── Maps
 └── Charts
      ↓
Phase 2
 ├── Community corrections
 ├── Citizen reports
 ├── Missing-data requests
 ├── Document submissions
 └── moderation
      ↓
Phase 3
 ├── PostgreSQL
 ├── API
 ├── authenticated contributors
 ├── automated ingestion
 └── notifications
```

Potential future infrastructure:

- Cloudflare Workers
- Cloudflare D1
- Cloudflare R2
- PostgreSQL/Neon
- Turnstile

Do not add these until the product needs them.

---

# 40. Recommended Folder Structure

```text
/
├── assets/
├── components/
│   ├── civic/
│   ├── data/
│   ├── government/
│   ├── projects/
│   └── search/
├── content/
│   ├── pages/
│   ├── officials/
│   ├── barangays/
│   ├── departments/
│   ├── laws/
│   └── projects/
├── data/
│   ├── city.json
│   ├── barangays.json
│   ├── officials.json
│   ├── departments.json
│   ├── budgets.json
│   ├── projects.json
│   └── sources.json
├── docs/
│   └── superpowers/
│       └── plan.md
├── pages/
│   ├── index.vue
│   ├── barangays/
│   ├── government/
│   ├── money/
│   ├── projects/
│   ├── laws/
│   ├── services/
│   ├── data/
│   └── sources.vue
├── public/
└── app.vue
```

Adjust to Nuxt 4 conventions if the repository already has an established structure.

---

# 41. MVP Definition of Done

The MVP is complete when:

## Product

- [ ] Homepage is polished
- [ ] Site clearly states it is independent
- [ ] Santa Rosa identity is visible without looking like official government branding
- [ ] Search works
- [ ] City profile works
- [ ] 18 barangays are represented
- [ ] Government directory works
- [ ] Budget section works
- [ ] Projects section works
- [ ] Laws section works
- [ ] Services directory works
- [ ] Sources/methodology works

## Data

- [ ] Important claims have sources
- [ ] Important datasets have last-verified dates
- [ ] No fabricated information
- [ ] Missing information is clearly marked
- [ ] Official links are preserved

## Technical

- [ ] Nuxt static build succeeds
- [ ] Pagefind indexes content
- [ ] No database required
- [ ] Mobile responsive
- [ ] Accessibility reviewed
- [ ] SEO metadata implemented
- [ ] sitemap generated
- [ ] robots.txt configured
- [ ] OpenGraph metadata configured
- [ ] broken links checked
- [ ] console errors resolved

## Performance

- [ ] Images optimized
- [ ] Maps/charts lazy-loaded where practical
- [ ] unnecessary JavaScript minimized
- [ ] Lighthouse targets reasonably met

## Deployment

- [ ] GitHub repository configured
- [ ] Cloudflare Pages deployment configured
- [ ] custom domain configured
- [ ] HTTPS working
- [ ] production build verified

---

# 42. Final Product Principle

The website should answer three questions exceptionally well:

### 1. “What is happening in Santa Rosa?”

Through:

- projects
- announcements/context
- government information

### 2. “Where does public money go?”

Through:

- budgets
- expenditures
- procurement
- projects

### 3. “Where can I verify this?”

Through:

- source links
- original documents
- last verified dates
- methodology

The MVP succeeds if a citizen can go from:

> “I heard the city is doing something.”

to:

> “I found the information.”

to:

> “I understand it.”

to:

> “I can verify the original source.”

That is the core of Better Santa Rosa City.
