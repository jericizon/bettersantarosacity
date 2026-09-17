# Better Santa Rosa City — Full MVP Specification

> Independent civic transparency / public-information portal for Santa Rosa City, Laguna.

## 1. Product

**Core promise:** Public information about Santa Rosa, made easier to find and understand.

**Design philosophy:** Old roots. New city.

Better Santa Rosa City is an independent, community-maintained public-information layer over public records. It is not an official City Government website, is not affiliated with or endorsed by the city government, and does not replace official services.

### Core journey

DISCOVER → UNDERSTAND → VERIFY

### MVP goals

- Make civic information easy to discover.
- Present public data in an editorial/data-journalism style.
- Link important claims to primary sources.
- Make data definitions and verification dates visible.
- Provide useful mobile-first UX.
- Stay static-first and inexpensive to operate.

---

## 2. MVP Scope

### Include

- Homepage
- Global search
- Barangay directory and detail pages
- Government overview
- Money / city finances
- Projects
- Laws & decisions
- Services directory
- Data & downloads
- History
- Sources / methodology
- Media credits
- About / disclaimer
- Responsive UX
- Accessibility
- SEO / sitemap / robots.txt / OpenGraph
- Pagefind search

### Do not include

- User accounts
- Comments/forums
- Political rankings or ratings
- Candidate scoring
- AI chatbot
- Complex CMS
- Custom backend
- Database
- Payments
- Notifications
- Unnecessary admin dashboard

---

## 3. Stack

- Nuxt 4
- Vue 3
- TypeScript
- Tailwind CSS
- Nuxt Content
- Pagefind
- Leaflet + OpenStreetMap
- Chart.js or ECharts
- Cloudflare Pages
- Git-managed Markdown / JSON / YAML

No database for MVP.

Use Cloudflare Workers/R2/Turnstile only when a concrete future requirement justifies them.

---

## 4. Brand

### Primary identity

The **Santa Rosa Arch / Bantayang Bato** is the primary identity anchor.

Do not use a rose as the primary symbol.

Logo system:

1. Horizontal primary logo
2. Stacked logo
3. Standalone arch symbol
4. Monochrome logo
5. Simplified favicon/small-size symbol

The arch should remain recognizable at small sizes.

### Palette

| Token | Hex | Use |
|---|---|---|
| Deep Laguna Green | `#164A3D` | Primary |
| Heritage Gold | `#D6A94B` | Heritage accent |
| Muted Terracotta/Rose | `#C96A73` | Accent |
| Laguna Blue | `#5E9FA5` | Water/data |
| Warm Parchment | `#F6F3EA` | Editorial background |
| Charcoal | `#182421` | Text |

### Typography

Primary: Inter, Geist, or Manrope.

Optional editorial accent: Source Serif 4.

### Visual character

Modern civic-tech + editorial publication + Santa Rosa heritage + data journalism.

Avoid:

- Generic government portal aesthetics
- Giant official seals
- Tourism-logo aesthetics
- Excessive cards
- Glassmorphism
- Neon gradients
- Glossy 3D
- Excessive animation
- Bootstrap-like layouts

---

## 5. Global UX

The homepage remains one SEO-friendly page, but major sections must feel like separate editorial chapters.

### Spacing

- Desktop: 96–144px between major sections
- Tablet: 72–96px
- Mobile: 56–80px

Use whitespace, dividers, background changes, large typography, imagery, and different compositions.

### Desired emotional progression

“That's Santa Rosa.” → “This isn't the usual government website.” → “I can find information here.” → “I can understand the data.” → “I can verify it.”

---

# 6. Homepage

## 01 — Hero

Eyebrow:

**SANTA ROSA CITY, LAGUNA**

Headline:

**Public information about Santa Rosa, made easier to find.**

Description:

**Explore the people, projects, budgets, laws, services and public records of Santa Rosa City.**

Primary interaction:

**Search everything**

Quick links:

- Budgets
- Projects
- Ordinances
- Officials
- Barangays

Trust line:

**Independent community project · Sources linked to original documents**

Use a real Santa Rosa image, subtle map-line treatment, strong typography, and a prominent search field.

---

## 02 — Independent Notice

Keep the site's independent status visible near the top:

> **Independent public-information project**
>
> Better Santa Rosa City is community-maintained and is not an official website of the City Government of Santa Rosa.

Link to About.

---

## 03 — Santa Rosa Today

Use editorial typography instead of generic statistic cards.

Known baseline:

- 18 barangays
- 5,543 hectares
- Cityhood in 2004
- 3 Laguna Lake barangays

Lakefront barangays:

- Aplaya
- Sinalhan
- Caingin

Presentation:

```text
18
BARANGAYS

5,543
HECTARES

2004
CITYHOOD

3
LAKEFRONT BARANGAYS
```

Every figure needs a source.

---

## 04 — Explore Santa Rosa

Make this a signature feature.

### Geographic groups

**Lakefront**

Aplaya, Sinalhan, Caingin

**Lowland Urban**

Balibago, Dila, Dita, Malitlit, Macabling, Malusak, Pooc, Market Area, Ibaba, Labas, Kanluran, Tagapo

**Upper / Tagaytay-side**

Santo Domingo, Don Jose, Pulong Santa Cruz

### Desktop

Large interactive Leaflet/OpenStreetMap visualization beside a barangay list and selected-information panel.

Interaction:

- Hover
- Click
- Selected state
- Keyboard-accessible list
- Mobile list-first fallback

Always label:

> Simplified reference map — not official cadastral survey data.

Do not claim precise boundaries unless an authoritative dataset supports them.

---

# 7. Barangays

Routes:

```text
/barangays
/barangays/[slug]
```

Each page:

- Name
- Geographic zone
- Factual overview
- Population where sourced
- Public facilities where sourced
- Projects
- Relevant public records
- Sources
- Last verified

Example known baseline:

Aplaya 2020 PSA census population: 15,858.

Missing data must say:

> Data not available in the source reviewed.

---

# 8. Government

Route:

`/government`

Include:

- City Government overview
- Departments/offices
- Citizen's Charter
- Transparency resources
- Official links
- Officials only where current official sources support them

For officials, show factual sourced information only:

- Name
- Position
- Current status/term where documented
- Official source

Do not add political ratings, rankings, approval indicators, or unsupported characterizations.

---

# 9. Money

Route:

`/money`

Treat this as data storytelling, not a dashboard.

### Current baseline

- FY2024 city revenue: **₱6.251B**
- FY2022: **₱4.99B**
- FY2016: **₱2.302B**
- Existing project content records FY2024 as last verified on **2026-09-15**

Preserve the source's exact definition of revenue.

Do not equate revenue with:

- total budget
- total spending
- appropriations
- available cash

### Presentation

Large figure + explanation + trend chart + source + methodology.

Example:

```text
WHERE DOES THE CITY'S MONEY GO?

₱6.251B
FY2024 CITY REVENUE

[trend visualization]

FY2016 ───── FY2022 ───── FY2024

Source
Last verified
Methodology
```

Every chart needs:

- Title
- Period
- Unit
- Source
- Last verified

---

# 10. Projects

Routes:

```text
/projects
/projects/[slug]
```

Present projects as editorial stories rather than dense cards.

Categories may include:

- Infrastructure
- Flood control
- Civic facilities
- Smart city / digital initiatives
- Public spaces
- Transportation

Only show project status when explicitly supported by a source.

Possible labels:

- Planned
- Proposed
- Ongoing
- Completed
- Reported

Never infer completion from an old announcement.

For conceptual images:

> Artist's perspective / conceptual rendering

Project detail fields:

- Title
- Location
- Category
- Status
- Description
- Timeline
- Funding/cost where sourced
- Implementing agency
- Source documents
- Images
- Last verified

---

# 11. History

Route:

`/history`

Title:

**From Bukol to Modern Santa Rosa**

Existing timeline:

1571 → 1688 → 1792 → 1898 → 1935 → 1945 → 1993 → 2004 → 2019 → 2024 → 2025

Each entry:

- Year/date
- Title
- Short factual explanation
- Source
- Image where useful

Desktop can use an interactive editorial timeline; mobile should use a vertical timeline.

Respect `prefers-reduced-motion`.

Avoid unsupported comparative claims such as “richest city in Luzon outside Metro Manila.” When the source concerns revenue, prefer precise wording such as **record city revenue** unless an exact comparative methodology is documented.

---

# 12. Laws & Decisions

Routes:

```text
/laws
/laws/[slug]
```

Types:

- Ordinances
- Resolutions
- Executive Orders
- Other public issuances

Each entry:

- Document number
- Title
- Date
- Type
- Plain-language summary
- Official source
- Document link

Source priority:

1. Official City Government document
2. Official government repository
3. National government repository
4. Credible secondary copy
5. Archive / third-party copy

If a third-party copy is used:

> Third-party document copy

Do not make it look like the official original.

---

# 13. Services

Route:

`/services`

Make services task-oriented.

Examples:

- Start a business
- Get permits
- Pay or check property taxes
- Request civil documents
- Find city forms
- Contact a department
- Check government announcements
- Access online payments
- Find Citizen's Charter information

Do not duplicate official workflows.

Primary CTA:

**Open official service →**

Clearly identify official City Government destinations.

---

# 14. Data & Downloads

Route:

`/data`

Possible datasets:

- Barangays
- Population
- City finances
- Projects
- Laws
- Public officials
- Historical events
- Other verified public datasets

Dataset card:

```text
DATASET NAME

Description

FORMAT
CSV / JSON / XLSX / PDF / source document

PERIOD
2024

LAST VERIFIED
Date

SOURCE
Official source

DOWNLOAD / VIEW
```

Do not publish transformed data without documenting the transformation.

---

# 15. Data Trust

Route:

`/sources` or dedicated trust section.

Headline:

**Data Trust**

Subheadline:

**Know where the information comes from.**

Table fields:

| Dataset | Source | Period | Last verified | Review status |
|---|---|---|---|---|

Use “Verified” only when Better Santa Rosa actually reviewed the cited source and confirmed the displayed value against it.

It does not mean independently audited or permanently guaranteed.

---

# 16. Source System

Every important factual claim should have a source.

### Source hierarchy

**Official source**

Examples: City Government, COA, DBM, PSA, DPWH, other government agencies.

**Secondary source**

Use only when necessary and label it.

**Better Santa Rosa summary**

Clearly indicate when the site is summarizing rather than reproducing an original document.

### Reusable components

- `SourceBadge.vue`
- `SourceCard.vue`
- `LastVerified.vue`

Example source card:

```text
SOURCE
Official source

Organization
Document/page title
Published date
Last checked by Better Santa Rosa

View original →
```

---

# 17. Media

Route:

`/about/media`

Create:

`data/media.json`

Each image record should include:

```json
{
  "id": "santa-rosa-arch-01",
  "title": "Santa Rosa Arch",
  "creator": "Creator",
  "source": "Wikimedia Commons",
  "license": "CC BY-SA 4.0",
  "url": "SOURCE_URL",
  "usedOn": ["home", "history"]
}
```

Inspect individual image licenses before use.

Use compact “Image credit” UI instead of large credit text beneath every image.

Never present AI-generated imagery as documentary evidence.

---

# 18. Search

Use **Pagefind**.

Placeholder:

**Search everything**

Search across:

- Barangays
- Projects
- Laws
- Services
- Data
- History
- Sources

Result:

```text
TITLE
TYPE
Excerpt
Source
```

Future enhancement:

- Ctrl+K
- Cmd+K

---

# 19. Navigation

Desktop:

```text
Logo
Explore
Barangays
Government
Money
Projects
Laws
Services
Data
Sources
Search
```

Mobile:

- Compact logo
- Search
- Menu drawer

Do not bury important sections under excessive nested menus.

---

# 20. Visual Section Rhythm

Recommended homepage flow:

```text
HERO
dark / image-led

SANTA ROSA TODAY
warm parchment

EXPLORE SANTA ROSA
white

CITY MONEY
deep green editorial

PROJECTS
warm neutral

HISTORY
image-led / parchment

LAWS
white

SERVICES
light neutral

DATA & DOWNLOADS
white

DATA TRUST
deep green or white

ABOUT / SOURCES
parchment

FOOTER
```

Use background changes as editorial chapters, not as a mechanical pattern.

---

# 21. Imagery

Prioritize real Santa Rosa imagery:

- Santa Rosa Arch
- streets and urban environment
- Laguna Lake
- heritage areas
- public buildings
- infrastructure
- public spaces
- local landscapes

Avoid generic stock government photography.

AI-generated visuals may be decorative but must never be presented as documentary evidence.

---

# 22. Animation

Use restrained motion:

- image hover 1.00 → 1.03
- opacity transitions
- small transforms
- statistic count-up
- timeline progression
- map hover states
- search transitions

Avoid:

- bouncing
- spinning logos
- excessive parallax
- constant scroll animation
- 3D effects

Respect `prefers-reduced-motion`.

---

# 23. Accessibility

Target WCAG 2.2 AA where practical.

Requirements:

- Semantic HTML
- Keyboard navigation
- Visible focus
- Strong contrast
- Correct heading hierarchy
- Alt text
- Form labels
- Accessible map alternative
- No information conveyed by color alone
- Reduced-motion support

The barangay map must always have an accessible text/list alternative.

---

# 24. Responsive UX

Mobile-first.

Priority:

1. Search
2. Navigation
3. Key facts
4. Barangay discovery
5. Data
6. Projects
7. Services
8. Sources

Do not merely shrink desktop layouts.

For complex tables:

- responsive stacking where possible;
- horizontal scroll where necessary.

---

# 25. SEO

Global:

- Title template
- Description
- Canonical
- OpenGraph
- Social metadata
- Favicon
- Sitemap
- robots.txt

Homepage title:

**Better Santa Rosa City — Public Information & Civic Data**

Homepage description:

**Public information about Santa Rosa City, Laguna — budgets, projects, barangays, laws, services, history and public records.**

Potential structured data:

- WebSite
- Organization
- Dataset
- BreadcrumbList
- Article where appropriate

Do not identify Better Santa Rosa as a government organization.

---

# 26. Content Architecture

```text
content/
├── index.md
├── barangays/
├── government/
├── money/
├── projects/
├── laws/
├── services/
├── data/
├── history/
└── about/
    ├── index.md
    ├── methodology.md
    ├── sources.md
    └── media.md

data/
├── barangays.json
├── finances.json
├── projects.json
├── laws.json
├── services.json
├── officials.json
├── media.json
└── sources.json
```

Important civic data should have one source of truth and be referenced by components.

---

# 27. Data Model

Example finance record:

```json
{
  "metric": "City revenue",
  "fiscalYear": 2024,
  "value": 6251000000,
  "currency": "PHP",
  "source": "SOURCE_ID",
  "lastVerified": "YYYY-MM-DD",
  "definition": "Exact source definition"
}
```

Example source:

```json
{
  "id": "source-coa-2024",
  "organization": "Commission on Audit",
  "type": "official",
  "title": "Source document title",
  "url": "ORIGINAL_SOURCE_URL",
  "publishedDate": "YYYY-MM-DD",
  "accessedDate": "YYYY-MM-DD"
}
```

Do not duplicate important URLs/definitions across many files.

---

# 28. Content Rules

### Never fabricate

Use:

> Data not available in the source reviewed.

when necessary.

### Preserve definitions

Do not silently turn:

- revenue into budget;
- allocation into spending;
- proposal into completed project;
- announcement into implementation.

### Prefer primary sources

Official document → government dataset → agency source → credible secondary source → archive/third-party copy.

### Date changing information

Officials, project status, financial data, and service links should have verification dates where relevant.

### Attribute claims

When a source makes a contested or interpretive claim, identify the source rather than adopting it as Better Santa Rosa's own conclusion.

---

# 29. About / Disclaimer

Route:

`/about`

Suggested text:

> Better Santa Rosa City is an independent, community-maintained public-information project designed to make public records about Santa Rosa easier to discover, understand, and verify.

Disclaimer:

> Better Santa Rosa City is an independent community-maintained project. It is not an official website of the City Government of Santa Rosa and is not affiliated with or endorsed by the city government.
>
> Information is compiled from publicly available sources and linked to original documents where available. Data may change, be corrected, or become outdated. Users should consult the original source for authoritative and current information.

---

# 30. Corrections

Optional MVP form:

> Found an outdated or incorrect detail?

> Submit a correction

If implemented:

- Cloudflare Turnstile
- rate limiting
- minimal personal-data collection
- explicit purpose
- privacy-conscious handling

No accounts required.

---

# 31. Components

Suggested reusable components:

```text
components/
├── brand/
│   ├── Logo.vue
│   ├── BrandMark.vue
│   └── Wordmark.vue
├── layout/
│   ├── SiteHeader.vue
│   ├── SiteFooter.vue
│   ├── Section.vue
│   └── PageHeader.vue
├── search/
│   ├── SearchBox.vue
│   ├── SearchResults.vue
│   └── SearchCommand.vue
├── source/
│   ├── SourceBadge.vue
│   ├── SourceCard.vue
│   └── LastVerified.vue
├── data/
│   ├── Stat.vue
│   ├── DataTable.vue
│   └── DataFreshness.vue
├── barangays/
│   ├── BarangayMap.vue
│   ├── BarangayList.vue
│   └── BarangayCard.vue
├── projects/
│   ├── ProjectCard.vue
│   └── ProjectStatus.vue
├── laws/
│   └── LawCard.vue
├── services/
│   └── ServiceCard.vue
├── history/
│   └── HistoryTimeline.vue
└── media/
    ├── EditorialImage.vue
    └── ImageCredit.vue
```

---

# 32. Routes

```text
/
/barangays
/barangays/[slug]
/government
/money
/projects
/projects/[slug]
/laws
/laws/[slug]
/services
/data
/history
/sources
/about
/about/media
```

---

# 33. Implementation Workflow

## Phase 1 — Audit

Inspect before modifying:

- routes
- components
- content
- assets
- logo
- Tailwind/CSS
- data
- existing source links

Do not rebuild working features unnecessarily.

## Phase 2 — Design system

Implement:

- brand tokens
- typography
- spacing
- buttons
- links
- badges
- source components
- sections
- image treatment

## Phase 3 — Global shell

Implement:

- navbar
- mobile navigation
- footer
- search
- independent notice
- favicon
- metadata

## Phase 4 — Homepage

Refactor into editorial chapters:

Hero → Today → Barangays → Money → Projects → History → Laws → Services → Data → Trust.

## Phase 5 — Detail pages

Implement barangays, projects, laws, money, history, services, data.

## Phase 6 — Search

Integrate Pagefind and test exact/partial searches.

## Phase 7 — Trust layer

Implement source registry, source cards, verification dates, methodology, media registry.

## Phase 8 — Accessibility

Keyboard, focus, contrast, semantics, map alternative, reduced motion.

## Phase 9 — SEO

Metadata, canonical, sitemap, robots, OpenGraph, structured data.

## Phase 10 — Performance

Audit images, JavaScript, hydration, layout shift, and map/chart loading.

---

# 34. Performance Targets

- Lighthouse Performance: 90+
- LCP: < 2.5s
- CLS: < 0.1
- INP: < 200ms

Requirements:

- responsive optimized images
- lazy-load below-fold media
- avoid oversized hero assets
- avoid unnecessary client-side JS
- SSR/static rendering where appropriate
- lazy-load maps/charts when possible

---

# 35. QA

## Functional

- [ ] Navigation works
- [ ] Mobile menu works
- [ ] Search works
- [ ] Barangay map/list works
- [ ] Barangay pages work
- [ ] Project pages work
- [ ] Law pages work
- [ ] Services links work
- [ ] Source links work
- [ ] Sitemap works
- [ ] robots.txt works

## Content

- [ ] Major factual claims have sources
- [ ] Primary sources preferred
- [ ] No fabricated numbers
- [ ] No unsupported project status
- [ ] Historical dates sourced
- [ ] Definitions preserved
- [ ] Verification dates present
- [ ] Missing data clearly identified
- [ ] Independent status is clear

## Accessibility

- [ ] Keyboard navigation
- [ ] Focus states
- [ ] Search accessible
- [ ] Map alternative
- [ ] Heading hierarchy
- [ ] Alt text
- [ ] Contrast
- [ ] Reduced motion

## Responsive

Test:

- [ ] 320px+
- [ ] 375px
- [ ] 390px
- [ ] 768px
- [ ] 1024px
- [ ] 1280px+

Check:

- [ ] No horizontal overflow
- [ ] Tables usable
- [ ] Map usable
- [ ] Navigation usable

## Performance

- [ ] Lighthouse 90+
- [ ] LCP <2.5s
- [ ] CLS <0.1
- [ ] INP <200ms
- [ ] Images optimized
- [ ] JS minimized where practical

---

# 36. AI Coding-Agent Rules

Workflow:

```text
AUDIT
↓
PLAN
↓
IMPLEMENT
↓
TEST
↓
QA
↓
FIX
↓
FINAL AUDIT
```

Classify each change:

- BUG
- UPDATE
- NEW FEATURE
- REFACTOR
- CONTENT
- DESIGN

Use TDD where practical:

```text
RED → GREEN → REFACTOR → QA
```

For every civic-data feature, check:

- Who owns the data?
- Is it public?
- Is the source authoritative?
- Is it derived data?
- Could the UI imply official endorsement?
- Could it expose private/personal information?

---

# 37. Git Rules

Do not:

- commit
- push
- delete branches
- reset history
- force push

unless explicitly instructed.

---

# 38. Definition of Done

### Brand

- [ ] Updated Santa Rosa Arch logo integrated
- [ ] Horizontal logo is primary
- [ ] Stacked version available
- [ ] Standalone arch available
- [ ] Monochrome works
- [ ] Favicon works
- [ ] Small-size mark remains recognizable

### UX

- [ ] Homepage feels like distinct editorial chapters
- [ ] Search is prominent
- [ ] Barangay discovery is easy
- [ ] Mobile experience is intentional
- [ ] Sources are easy to verify

### Content

- [ ] Existing verified content migrated
- [ ] No unsupported claims
- [ ] No fabricated values
- [ ] Source metadata normalized
- [ ] Data freshness displayed

### Technical

- [ ] Nuxt build passes
- [ ] TypeScript passes
- [ ] Lint passes
- [ ] Tests pass
- [ ] Pagefind works
- [ ] Sitemap works
- [ ] Responsive QA passes
- [ ] Accessibility QA passes
- [ ] Performance targets met or documented

---

# 39. Final Product Definition

> **Better Santa Rosa City is an independent, source-first civic information portal that makes public information about Santa Rosa easier to find, understand, and verify.**

The **Santa Rosa Arch** is the primary visual identity.

**Search** is the primary product interaction.

**Sources** are the primary trust mechanism.

**Facts before opinions** is the content principle.
