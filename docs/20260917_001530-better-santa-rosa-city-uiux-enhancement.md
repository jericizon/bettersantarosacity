# Better Santa Rosa City — UI/UX Improvement MVP

## Project

Improve the existing **Better Santa Rosa City** website:

**Production:** https://bettersantarosacity.pages.dev/

This is an existing Nuxt 4 civic-information website. Do **not** blindly rebuild the application.

First inspect the existing codebase, components, pages, content, data structures, assets, responsive behavior, and current design.

The objective is to transform the current MVP from a functional civic-information website into a **polished civic-tech / editorial public-information platform**.

The website should feel:

> **Modern civic technology + editorial data journalism + Santa Rosa heritage**

It must **not** feel like:

- a generic government website
- a corporate SaaS dashboard
- a tourism website
- a generic blog
- a startup landing page
- a collection of disconnected cards
- an overly animated website

The core product idea remains:

> **Public information about Santa Rosa, made easier to find and understand.**

---

# 1. IMPORTANT — PRESERVE THE EXISTING PRODUCT

Do not throw away the existing implementation.

Before modifying anything:

1. Inspect the current repository.
2. Identify:
   - Nuxt version
   - Vue components
   - layouts
   - Tailwind configuration
   - content/data structure
   - existing pages
   - existing image assets
   - map implementation
   - charts
   - search
   - SEO configuration
   - responsive behavior
3. Reuse good existing components.
4. Refactor only where necessary.
5. Preserve existing content and source attribution.
6. Do not invent government data.
7. Do not invent projects, laws, officials, budgets, statistics, or historical facts.
8. Do not remove useful existing information simply to make the site visually simpler.

The main task is **UI/UX transformation and information presentation**, not rebuilding the data architecture.

---

# 2. PRIMARY UX CHANGE — STOP MAKING THE HOMEPAGE FEEL LIKE ONE LONG DOCUMENT

The current homepage contains many useful sections, but the page should no longer visually feel like:

```text
Hero
↓
text
↓
cards
↓
text
↓
cards
↓
text
↓
cards
↓
footer
```

Instead, treat the homepage as a sequence of **distinct editorial chapters**.

The user should clearly feel that they are moving through separate pieces of information.

For example:

```text
┌──────────────────────────────────────┐
│ HERO                                 │
│ Discover Santa Rosa                 │
└──────────────────────────────────────┘

        generous spacing

┌──────────────────────────────────────┐
│ SANTA ROSA TODAY                     │
│ Key city facts                       │
└──────────────────────────────────────┘

        generous spacing

┌──────────────────────────────────────┐
│ EXPLORE SANTA ROSA                   │
│ Interactive barangay map             │
└──────────────────────────────────────┘

        generous spacing

┌──────────────────────────────────────┐
│ CITY MONEY                            │
│ Budget/revenue data storytelling     │
└──────────────────────────────────────┘

        generous spacing

┌──────────────────────────────────────┐
│ BUILDING THE CITY                   │
│ Projects and development             │
└──────────────────────────────────────┘

        generous spacing

┌──────────────────────────────────────┐
│ FROM BUKOL TO TODAY                  │
│ Historical timeline                  │
└──────────────────────────────────────┘

        generous spacing

┌──────────────────────────────────────┐
│ LAWS + SERVICES + DATA               │
└──────────────────────────────────────┘

        generous spacing

┌──────────────────────────────────────┐
│ VERIFY / SOURCES                     │
└──────────────────────────────────────┘
```

Each chapter should have a distinct visual identity while still belonging to the same design system.

---

# 3. SECTION SEPARATION SYSTEM

Create a consistent section architecture.

Every major homepage section should have:

- clear top spacing
- clear bottom spacing
- section label
- section title
- short explanation
- content area
- optional supporting visual
- optional source indicator

Use generous vertical spacing.

Recommended desktop:

```css
section {
  padding-top: 7rem;
  padding-bottom: 7rem;
}
```

Allow different sections to use approximately:

```text
96px–144px vertical separation
```

depending on importance.

Tablet:

```text
72px–96px
```

Mobile:

```text
56px–80px
```

Do not mechanically apply the exact same spacing everywhere.

Use visual hierarchy.

---

# 4. SECTION BACKGROUNDS

Do not keep every section on the same white background.

Use subtle alternation.

Example:

```text
Hero
↓
Warm parchment background

Santa Rosa Today
↓
White

Explore Santa Rosa
↓
Very light green

Money
↓
Warm parchment

Projects
↓
White

History
↓
Deep green / dark editorial section

Laws / Services / Data
↓
White

Sources
↓
Light neutral background
```

The background changes should be subtle.

Do NOT use:

- loud gradients
- neon backgrounds
- excessive colored blocks
- glassmorphism
- overly saturated UI

The purpose is to establish **content separation**, not decoration.

---

# 5. USE MAXIMUM CONTENT WIDTH PROPERLY

The existing website should not allow text and cards to stretch unnecessarily across the entire screen.

Create a consistent content container.

Recommended:

```text
max-width: 1200px–1280px
margin: auto
padding-left/right: 24px–32px
```

For editorial sections, allow narrower text widths:

```text
600px–760px
```

For data/map sections:

```text
1100px–1200px
```

For hero:

```text
1200px–1400px
```

Do not make every section use exactly the same width.

This creates a more editorial layout.

---

# 6. GLOBAL SPACING IMPROVEMENT

Review the entire application for cramped layouts.

Increase spacing between:

- section headings
- paragraphs
- cards
- data points
- images
- navigation elements
- buttons
- source metadata
- chart labels
- map controls
- timeline entries

Avoid:

```text
Heading
paragraph
card
card
card
```

with only 10–20px between everything.

Prefer:

```text
Section label

Large heading

Description

        32–48px

Content
```

Use spacing intentionally to indicate relationships.

---

# 7. VISUAL DESIGN DIRECTION

Use the existing Better Santa Rosa visual identity but refine it.

Primary palette:

```text
Deep Laguna Green   #164A3D
Rose Accent          #C96A73
Laguna Blue          #5E9FA5
Heritage Gold        #D6A94B
Warm Parchment       #F6F3EA
Charcoal             #182421
```

Do not use every color everywhere.

Suggested usage:

```text
Green
→ primary identity
→ major headings
→ navigation
→ dark sections

Rose
→ subtle accent
→ links
→ active states
→ selected map elements

Blue
→ geographic/water-related content
→ secondary accents

Gold
→ heritage/history
→ small highlights

Parchment
→ editorial backgrounds

Charcoal
→ body text
```

---

# 8. TYPOGRAPHY

The website should feel editorial.

Use a modern sans-serif for the interface:

- Inter
- Manrope
- Geist

Optional editorial serif:

- Source Serif 4

Suggested hierarchy:

```text
Hero:
64–80px desktop
42–52px tablet
36–44px mobile

Major section heading:
42–56px desktop
34–42px tablet
30–36px mobile

Subheading:
18–22px

Body:
16–18px

Metadata:
13–14px
```

Do not make everything huge.

Typography should create hierarchy naturally.

---

# 9. NAVIGATION

Keep the current primary navigation concept:

```text
Explore
Barangays
Government
Money
Projects
Laws
Services
Data
Sources
```

Improve the navigation visually.

Desktop:

- clean horizontal navigation
- strong logo
- restrained height
- subtle bottom border
- sticky navigation if appropriate

Mobile:

- compact header
- accessible menu
- clear search access

The navigation should feel like a publication/information platform rather than a government bureaucracy portal.

---

# 10. HERO REDESIGN

The hero should become the visual anchor of the site.

Current concept:

> Santa Rosa City, Laguna  
> Public information about Santa Rosa, made easier to find.

Keep this message.

But improve the presentation.

Recommended composition:

```text
┌───────────────────────────────────────────────┐
│                                               │
│       REAL SANTA ROSA IMAGE                  │
│                                               │
│     subtle map-line overlay                  │
│                                               │
│  Santa Rosa City, Laguna                     │
│                                               │
│  Public information about Santa Rosa,        │
│  made easier to find.                        │
│                                               │
│  [ Search everything in Santa Rosa... ]      │
│                                               │
└───────────────────────────────────────────────┘
```

Use a real local image whenever possible.

Potential subjects:

- Santa Rosa City skyline
- Santa Rosa Arch
- Santa Rosa de Lima Church
- city streets
- Laguna lakefront
- modern Santa Rosa development

Use real source-backed images.

Do not fabricate recognizable landmarks with AI.

Decorative AI imagery may be used only for abstract branding elements.

---

# 11. HERO IMAGE TREATMENT

The image should not overpower the text.

Use:

- subtle dark/green overlay where needed
- controlled contrast
- large typography
- restrained border radius
- subtle map-line graphics

Do not:

- use excessive blur
- make the image look fake
- use generic city stock photos
- use an obviously AI-generated Santa Rosa landmark

Hero should immediately communicate:

> "This is Santa Rosa."

---

# 12. LOGO REFINEMENT

Inspect the existing AI-generated logo.

If it contains too many elements such as:

- lions
- arch
- sun
- hills
- lake
- seal-like composition

simplify it.

The logo should not resemble an official government seal.

Preferred direction:

```text
Abstract rose
+
map/road line
+
subtle civic identity
```

It should work at:

- desktop
- mobile
- favicon
- social preview

Avoid official-looking emblems.

---

# 13. SANTA ROSA TODAY

Transform the statistics section into a strong editorial introduction.

Current data includes:

- 18 barangays
- 5,543 hectares
- 2004 cityhood
- 3 lakefront barangays

Display them with large typography.

Example:

```text
SANTA ROSA TODAY

18
Barangays

5,543
Hectares

2004
Cityhood

3
Lakefront barangays
```

Use generous spacing.

Do not put each number into a generic dashboard card.

Instead use typography and layout.

Add subtle count-up animation when entering viewport.

Animation:

```text
600–900ms
ease-out
```

Respect:

```css
prefers-reduced-motion
```

---

# 14. EXPLORE SANTA ROSA — SIGNATURE SECTION

Make the map one of the most visually distinctive parts of the website.

The user should immediately understand:

> Santa Rosa has 18 barangays distributed across different geographic areas.

Recommended composition:

```text
EXPLORE SANTA ROSA

18 barangays.
One city.

┌──────────────────────┬────────────────────┐
│                      │                    │
│      MAP             │  SELECTED AREA     │
│                      │                    │
│   18 barangays       │  Aplaya            │
│                      │  Lakefront         │
│                      │                    │
│                      │  Population        │
│                      │  15,858            │
│                      │                    │
└──────────────────────┴────────────────────┘
```

Map requirements:

- Leaflet/OpenStreetMap
- 18 barangays
- hover
- click
- selected state
- mobile responsive
- accessible alternative list
- clear legend

Important:

The map must clearly state:

> Simplified map for information purposes. Not official cadastral survey data.

Do not imply cadastral accuracy.

---

# 15. MAP VISUAL DESIGN

The map should feel integrated into the website.

Avoid default-looking Leaflet styling.

Customize:

- colors
- borders
- hover states
- selected barangay
- labels
- controls

Use the Better Santa Rosa palette.

The map can use:

```text
green
blue
rose
neutral gray
```

but keep it restrained.

The map should become a recognizable part of the brand.

---

# 16. MONEY / CITY FINANCES

Current section:

> Where Does the City's Money Go?

Keep the factual approach.

Current known information includes:

- FY2024 city revenue: ₱6.251B
- FY2022: ₱4.99B
- FY2016: ₱2.302B

Do not turn these into sensational claims.

Avoid statements such as:

> "The richest city..."

unless a clear methodology and comparable official dataset supports it.

Prefer:

> **City Revenue Over Time**

or:

> **How City Revenue Has Changed**

Present the information visually.

Example:

```text
CITY MONEY

How city revenue has changed

₱6.251B
FY2024

        ↑

₱4.99B
FY2022

        ↑

₱2.302B
FY2016
```

Then provide a chart.

Use:

- Chart.js
- ECharts
- SVG

Chart should be readable before decorative.

Include:

- source
- fiscal year
- verification date
- methodology

---

# 17. DATA STORYTELLING

Do not turn the money section into a generic dashboard.

It should feel like a data-journalism article.

Use:

```text
Big number
↓
short explanation
↓
visual trend
↓
source
```

This hierarchy is important.

---

# 18. BUILDING THE CITY — PROJECTS

Current project cards are useful but text-heavy.

Transform projects into editorial project stories.

Instead of:

```text
[card]
Title
paragraph
source
```

use:

```text
IMAGE

PROJECT CATEGORY

Project name

Short explanation

Status

Source
```

Use real project imagery where available.

Possible imagery:

- official renderings
- DPWH project photos
- city infrastructure
- roads
- bridges
- public buildings

Never create fake project images that could be mistaken for actual government plans.

AI-generated images may only be used when clearly marked as conceptual artwork.

---

# 19. PROJECT STATUS

Use clear labels:

```text
Planned
Ongoing
Completed
Reported
Proposed
```

But only when the source supports the status.

Do not infer status.

---

# 20. HISTORY — FROM BUKOL TO TODAY

This section has strong content and should become a major editorial feature.

Current timeline:

```text
1571
1688
1792
1898
1935
1945
1993
2004
2019
2024
2025
```

Improve presentation.

Desktop:

```text
                ● 1571
                │
                │
                ● 1688
                │
                │
                ● 1792
                │
                │
                ● 1898
                │
                ...
```

Pair timeline events with historical imagery.

Use subtle scroll progression.

For example:

- timeline line grows as user scrolls
- active year highlighted
- corresponding image changes
- event text fades/enters

Keep animation subtle.

Mobile should become a clean vertical timeline.

---

# 21. HISTORY LANGUAGE

Use neutral, source-backed wording.

Avoid unsupported superlatives.

For example, avoid:

> "Luzon's richest city outside Metro Manila"

unless the site clearly defines:

- metric
- year
- comparison population
- source
- methodology

Prefer:

> "Record city revenue"

when referring specifically to a documented revenue figure.

The civic platform should prioritize precision over sensationalism.

---

# 22. SANTA ROSA LIFE & HERITAGE

Do not make this a generic image gallery.

Instead use a curated editorial image strip.

Example:

```text
SANTA ROSA LIFE & HERITAGE

A city shaped by heritage,
industry, nature and everyday life.

┌─────────────┐
│             │
│ large image │
│             │
└─────────────┘

     ┌─────────────┐
     │ smaller img │
     └─────────────┘

                 ┌──────────────┐
                 │ large image  │
                 └──────────────┘
```

Use asymmetrical editorial layouts.

Fewer images.

Larger images.

Better captions.

---

# 23. IMAGE SOURCES AND CREDITS

Use real local imagery from sources that permit reuse.

Preferred source:

**Wikimedia Commons**

Potential categories:

- Santa Rosa, Laguna
- Buildings in Santa Rosa, Laguna
- Philippine Panorama Project / Santa Rosa, Laguna

For every image, inspect the individual file page.

Do NOT assume every Wikimedia image has the same license.

Record metadata in:

```text
/data/media.json
```

Example:

```json
{
  "id": "santa-rosa-church-01",
  "file": "/images/santa-rosa-church.jpg",
  "title": "Santa Rosa de Lima Church",
  "source": "Wikimedia Commons",
  "sourceUrl": "...",
  "author": "...",
  "license": "CC BY-SA 4.0",
  "licenseUrl": "...",
  "attributionRequired": true
}
```

Create:

```text
/about/media
```

containing complete image credits.

On the page itself, use a subtle:

> Image credit

interaction or compact attribution.

Do not put large distracting copyright text beneath every image.

---

# 24. SOURCE BADGES

Create a consistent source indicator system.

Examples:

```text
OFFICIAL SOURCE
COA
DBM
PSA
DPWH
BETTER SANTA ROSA
SECONDARY SOURCE
```

Use subtle badges.

Example:

```text
OFFICIAL SOURCE
Commission on Audit
```

or:

```text
SOURCE
PSA 2020 Census
```

The visual system should help users understand:

> Where did this information come from?

without overwhelming the content.

---

# 25. SOURCE HIERARCHY

Use the following hierarchy:

### Tier 1 — Primary

- Santa Rosa City Government
- COA
- DBM
- PSA
- DPWH
- Official national government sources
- Official laws / gazettes / records

### Tier 2 — Reliable secondary

Clearly attribute.

### Tier 3 — Other references

Only use when necessary.

Never present secondary information as if it came directly from government.

---

# 26. LAWS & DECISIONS

Improve the existing list.

Instead of many dense cards:

```text
Law title
long description
source
```

use:

```text
TYPE
Ordinance

TITLE

Short explanation

YEAR

Source
```

Possible filters:

```text
All
Ordinances
Resolutions
Executive Orders
```

Keep filters lightweight.

Do not create a complex application dashboard.

---

# 27. SERVICES

The goal is not to reproduce the official city website.

Position this section as:

> **Find official city services faster.**

Use shortcut links to:

- official website
- eServices
- online forms
- payments
- citizen's charter
- permits
- other official services

Clearly indicate external destinations.

Example:

```text
Official City Service
Open official website →
```

---

# 28. DATA

Improve the data section into:

> **Data & Downloads**

Provide:

- datasets
- downloadable files
- source
- date
- last verified
- format

Example:

```text
Barangay information
PSA
2020
CSV / JSON

City revenue
COA / BLGF
FY2024
CSV / JSON
```

Keep it simple.

---

# 29. DATA TRUST / FRESHNESS

Turn the current "Data Freshness" section into a compact trust layer.

Example:

```text
DATA TRUST

Dataset                 Verified

Barangays               Sep 2026
City Revenue            Sep 2026
Projects                Sep 2026
History                 Sep 2026
```

Use clear dates.

Do not imply that the underlying government dataset itself was created on that date.

Use:

> Last verified by Better Santa Rosa

when appropriate.

---

# 30. SEARCH SHOULD FEEL LIKE THE CORE PRODUCT

Search is one of the most important features.

The product promise is:

> Make public information easier to find.

Therefore search should feel prominent.

Hero:

```text
Search Santa Rosa public information...

[____________________________] 🔍
```

Support:

- barangays
- officials
- government departments
- laws
- projects
- money
- services
- data
- sources

Use Pagefind.

Do not introduce Algolia unless there is a compelling reason.

Future enhancement:

```text
Ctrl + K
```

or:

```text
⌘ + K
```

to open a command/search palette.

Do not overbuild this for MVP if Pagefind already works well.

---

# 31. SECTION TRANSITIONS

Use subtle transitions between sections.

Possible techniques:

### Background transitions

```text
white
↓
parchment
↓
white
↓
light green
↓
dark green
```

### Decorative divider

Use:

- thin line
- map-line motif
- small rose mark
- subtle geometric pattern

Do not use giant decorative separators.

---

# 32. SECTION INTRODUCTION COMPONENT

Create a reusable component:

```text
<SectionHeader />
```

Possible API:

```ts
{
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
  theme?: 'light' | 'dark'
}
```

Example:

```text
EXPLORE SANTA ROSA

18 barangays. One city.

Explore the neighborhoods that make up
Santa Rosa City.
```

This makes all sections visually consistent.

---

# 33. CARD USAGE

Reduce card dependency.

Cards should be used when they improve grouping.

Do not put every piece of content inside a rounded rectangle.

Avoid:

```text
┌─────────┐
│ Card    │
└─────────┘

┌─────────┐
│ Card    │
└─────────┘

┌─────────┐
│ Card    │
└─────────┘
```

Prefer editorial compositions.

Use cards for:

- projects
- search results
- datasets
- specific government resources

Use open layouts for:

- statistics
- history
- hero
- money storytelling
- map
- major narratives

---

# 34. BORDER RADIUS

Use restrained radius.

Suggested:

```text
Large media:
16–24px

Cards:
12–16px

Buttons:
8–12px

Inputs:
10–14px
```

Do not make every element pill-shaped.

---

# 35. SHADOWS

Use shadows sparingly.

Prefer:

```text
border
background contrast
spacing
```

over:

```text
large drop shadows
```

The website should feel editorial and mature.

---

# 36. MICROINTERACTIONS

Implement subtle interaction feedback.

Examples:

### Buttons

- small color transition
- slight translateY(-1px)

### Images

```text
scale 1.00 → 1.03
```

on hover.

### Links

- underline animation
- color transition

### Map

- smooth selected state

### Cards

- very subtle elevation

No:

- bouncing
- spinning
- excessive spring physics
- particles
- 3D effects

---

# 37. SCROLL ANIMATION

Use simple CSS/IntersectionObserver animations.

Suggested:

```text
opacity: 0 → 1
transform: translateY(16px) → translateY(0)
```

Duration:

```text
400–700ms
```

Stagger:

```text
50–100ms
```

Do not animate every single element.

Only animate meaningful entrances.

---

# 38. REDUCED MOTION

Always support:

```css
@media (prefers-reduced-motion: reduce)
```

When enabled:

- disable scroll animations
- disable count-up
- disable image zoom
- disable timeline animation
- use instant transitions

Accessibility takes priority over visual effects.

---

# 39. MOBILE EXPERIENCE

Do not simply shrink desktop.

Design mobile layouts intentionally.

Hero:

```text
image
↓
heading
↓
description
↓
search
```

Map:

```text
map
↓
selected barangay
```

Timeline:

```text
year
│
event
│
image
│
year
│
event
```

Projects:

```text
image
title
description
source
```

Stats:

```text
18
Barangays

5,543
Hectares

2004
Cityhood
```

Avoid horizontal overflow.

---

# 40. RESPONSIVE SPACING

Desktop:

```text
section: 96–144px
container padding: 32px
content gaps: 32–64px
```

Tablet:

```text
section: 72–96px
container padding: 24px
```

Mobile:

```text
section: 56–80px
container padding: 20px
```

Hero may use larger spacing.

---

# 41. ACCESSIBILITY

Ensure:

- semantic HTML
- correct heading hierarchy
- keyboard navigation
- visible focus states
- accessible buttons
- accessible map alternative
- alt text for meaningful images
- empty alt for decorative images
- sufficient contrast
- screen-reader-friendly source metadata

Do not use color alone to communicate status.

---

# 42. PERFORMANCE

Target:

```text
Lighthouse Performance: 90+
LCP: <2.5s
CLS: <0.1
INP: <200ms
```

Optimize images.

Use:

- WebP/AVIF where appropriate
- responsive image sizes
- lazy loading
- explicit image dimensions
- optimized hero image
- avoid huge original photographs

Do not load animation libraries unless genuinely necessary.

Prefer:

- CSS
- IntersectionObserver
- SVG
- native browser APIs

---

# 43. SEO

Preserve and improve SEO.

Each major content page should have:

- title
- meta description
- canonical URL
- Open Graph metadata
- Twitter/X metadata
- structured data where appropriate

Homepage should target concepts such as:

```text
Santa Rosa City Laguna
Santa Rosa Laguna public information
Santa Rosa barangays
Santa Rosa government
Santa Rosa budget
Santa Rosa projects
Santa Rosa ordinances
```

Do not keyword-stuff.

---

# 44. HOMEPAGE FINAL STRUCTURE

The improved homepage should roughly follow:

```text
HEADER
│
├── HERO
│   ├── Local image
│   ├── Identity
│   ├── Search
│   └── Quick links
│
│
├── SANTA ROSA TODAY
│   └── Large city facts
│
│
├── EXPLORE SANTA ROSA
│   ├── 18-barangay map
│   └── Selected barangay information
│
│
├── CITY MONEY
│   ├── Revenue highlights
│   ├── Chart
│   └── Source/methodology
│
│
├── BUILDING THE CITY
│   ├── Project imagery
│   └── Project information
│
│
├── FROM BUKOL TO TODAY
│   └── Interactive history timeline
│
│
├── LAWS & DECISIONS
│
│
├── SERVICES
│
│
├── DATA & DOWNLOADS
│
│
├── DATA TRUST
│
│
└── SOURCES / ABOUT / DISCLAIMER
```

Each major section must visually feel like its own chapter.

---

# 45. SECTION SPACING IS A PRIORITY

This is one of the most important changes.

The site should breathe.

Bad:

```text
Hero
small gap
Section
small gap
Section
small gap
Section
```

Good:

```text
Hero

        LARGE VISUAL BREAK

Santa Rosa Today

        LARGE VISUAL BREAK

Explore Santa Rosa

        LARGE VISUAL BREAK

City Money
```

Whitespace is part of the design.

Do not be afraid of empty space.

---

# 46. VISUAL RHYTHM

The page should alternate between:

```text
Text-heavy
↓
Visual
↓
Data
↓
Visual
↓
Editorial
↓
Interactive
↓
Reference
```

Avoid:

```text
Card
Card
Card
Card
Card
Card
```

throughout the entire homepage.

---

# 47. TRUST DESIGN

The site is an independent public-information project.

Maintain a persistent but unobtrusive distinction:

> **Independent public-information layer**

And:

> **This is not an official City Government of Santa Rosa website.**

Do not make the disclaimer visually dominant after the user has understood it.

It should remain accessible without making the entire website feel defensive.

---

# 48. FOOTER

Improve the footer.

Recommended:

```text
BETTER SANTA ROSA CITY

Public information about Santa Rosa,
made easier to find and understand.

Independent community project.

Explore
Barangays
Government
Money
Projects
Laws
Services
Data

Sources
Methodology
Media Credits
GitHub
Official City Website

Not an official City Government website.
```

Include:

- last updated information
- source methodology
- media credits
- official city website
- GitHub

---

# 49. CONTENT INTEGRITY

Never:

- invent numbers
- invent sources
- invent citations
- invent government projects
- invent official statements
- fabricate historical facts
- make secondary sources look official
- imply affiliation with City Government

If information cannot be verified:

```text
Data not available in the source reviewed.
```

Use this instead of guessing.

---

# 50. DATA ATTRIBUTION

Important data should display:

```text
Source: Commission on Audit
Last verified: September 15, 2026
```

or equivalent.

Source metadata should be reusable.

Create reusable components where useful:

```text
<SourceBadge />
<SourceAttribution />
<LastVerified />
<Disclaimer />
```

---

# 51. COMPONENT ARCHITECTURE

Where practical, create reusable components such as:

```text
components/
├── site/
│   ├── SiteHeader.vue
│   ├── SiteFooter.vue
│   └── SearchBar.vue
│
├── editorial/
│   ├── SectionHeader.vue
│   ├── EditorialImage.vue
│   └── Timeline.vue
│
├── data/
│   ├── StatBlock.vue
│   ├── SourceBadge.vue
│   ├── SourceAttribution.vue
│   ├── DataFreshness.vue
│   └── DataChart.vue
│
├── map/
│   ├── BarangayMap.vue
│   └── BarangayPanel.vue
│
└── projects/
    └── ProjectFeature.vue
```

Do not create components unnecessarily.

---

# 52. DATA / MEDIA STRUCTURE

If not already present, consider:

```text
data/
├── barangays.json
├── projects.json
├── laws.json
├── finances.json
├── sources.json
└── media.json
```

Keep data separate from presentation.

---

# 53. IMAGE SELECTION RULES

Use local Santa Rosa imagery whenever possible.

Good:

- Santa Rosa City Hall
- Santa Rosa Arch
- Santa Rosa de Lima Church
- Laguna lakefront
- local roads
- recognizable local infrastructure
- local neighborhoods
- industrial/modern city areas
- heritage locations

Avoid:

- Santa Rosa, California
- generic Manila skyline
- generic Philippine government stock photos
- fake AI government buildings
- unrelated Laguna locations
- tourist imagery that doesn't represent Santa Rosa

---

# 54. IMAGE GENERATION RULES

AI-generated images may be used for:

- abstract brand backgrounds
- map-inspired graphics
- decorative patterns
- conceptual illustrations

Do NOT use AI-generated imagery as factual representations of:

- government buildings
- actual projects
- actual roads
- actual historical events
- city officials
- government facilities

If conceptual artwork is used, clearly label it:

> Conceptual illustration

---

# 55. DO NOT OVERDESIGN

The final design should communicate:

> "This is a serious public-information project."

not:

> "Look how many animations we can make."

The strongest design element should be:

**information clarity.**

---

# 56. IMPLEMENTATION WORKFLOW

Follow this workflow.

## Phase 1 — Audit

Inspect:

- current homepage
- all existing components
- design tokens
- responsive behavior
- current images
- map
- search
- data
- source attribution

Document problems before changing them.

## Phase 2 — Design System

Refine:

- colors
- typography
- spacing
- container widths
- section architecture
- buttons
- cards
- badges
- source metadata

## Phase 3 — Homepage

Implement:

1. Hero
2. Santa Rosa Today
3. Barangay map
4. Money
5. Projects
6. History
7. Laws
8. Services
9. Data
10. Trust
11. Sources

## Phase 4 — Responsive

Test:

- 375px
- 390px
- 430px
- 768px
- 1024px
- 1280px
- 1440px+
 
## Phase 5 — Accessibility

Run keyboard and screen-reader checks.

## Phase 6 — Performance

Run Lighthouse.

## Phase 7 — Content Integrity

Verify:

- source links
- image credits
- dates
- data
- disclaimers

---

# 57. QA CHECKLIST

Before declaring the work complete:

### Visual

- [ ] Sections have clear separation.
- [ ] Homepage no longer feels like one continuous document.
- [ ] Spacing feels generous.
- [ ] Typography has clear hierarchy.
- [ ] No unnecessary cards.
- [ ] Images are meaningful.
- [ ] Santa Rosa identity is obvious.
- [ ] Logo does not resemble an official seal.

### UX

- [ ] Search is prominent.
- [ ] Navigation works.
- [ ] Map works.
- [ ] Mobile navigation works.
- [ ] Timeline works.
- [ ] External links are clear.
- [ ] Source information is easy to find.

### Accessibility

- [ ] Keyboard navigation works.
- [ ] Focus states are visible.
- [ ] Images have appropriate alt text.
- [ ] Contrast passes.
- [ ] Reduced motion works.
- [ ] Map has accessible alternative.

### Performance

- [ ] Images optimized.
- [ ] No unnecessary JavaScript.
- [ ] No layout shift.
- [ ] Hero loads efficiently.
- [ ] Lighthouse checked.

### Data

- [ ] No fabricated information.
- [ ] Important claims have sources.
- [ ] Verification dates are shown.
- [ ] Secondary sources are clearly identified.
- [ ] Media credits are complete.

---

# 58. IMPORTANT DEVELOPMENT RULES

Do not:

- commit
- push
- delete branches
- modify git history

unless explicitly instructed.

Do not introduce a backend/database simply to implement the visual redesign.

Keep the architecture static-first.

Do not replace working technologies without a strong reason.

Do not install large animation frameworks just for visual effects.

---

# 59. FINAL DESIGN TEST

After implementation, open the actual website at desktop and mobile sizes.

Ask:

### First impression

> Does this immediately feel like Santa Rosa?

### Second impression

> Does this feel like a modern civic-information publication rather than a government portal?

### Third impression

> Can I immediately search for something?

### Fourth impression

> Can I understand where information comes from?

### Fifth impression

> Does the page have breathing room?

### Sixth impression

> Do the sections feel like distinct chapters rather than one continuous wall of content?

If the answer to the last question is no, increase:

- section spacing
- background differentiation
- typography hierarchy
- visual dividers
- image usage
- content grouping

---

# 60. SUCCESS CRITERIA

The redesign is successful when the existing site feels transformed without losing its information architecture.

The user should experience:

```text
"That's Santa Rosa."

        ↓

"This isn't the usual government website."

        ↓

"I can find information here."

        ↓

"I can understand the data."

        ↓

"I can see where the information came from."

        ↓

"I can verify it myself."
```

The website should be **beautiful because the information is presented beautifully**, not because it contains excessive visual effects.

# FINAL PRINCIPLE

> **Do not make Better Santa Rosa City fancy. Make it clear, local, trustworthy, spacious, editorial, and unmistakably Santa Rosa.**