# BETTER SANTA ROSA CITY
# Full MVP Implementation Plan
# Version: 2.0
# Status: Implementation Specification

---

# 0. ORCHESTRATOR INSTRUCTION

You are the lead AI software orchestrator responsible for improving and completing the existing
Better Santa Rosa City civic-information website.

Live website:

https://bettersantarosacity.pages.dev/

Project identity:

Better Santa Rosa City

Purpose:

> Public information about Santa Rosa, made easier to find and understand.

Core product definition:

> Better Santa Rosa City is an independent, source-first civic information portal that makes
> public information about Santa Rosa easier to find, understand, and verify.

The project is NOT:

- an official government website
- affiliated with the City Government of Santa Rosa
- a political campaign
- a political advocacy platform
- a replacement for the official city website
- a commercial tourism directory
- a social network
- a news organization

The website is an independent public-information layer over publicly available information.

---

# 1. PRIMARY PRODUCT PRINCIPLES

Every implementation decision must follow these principles.

## 1.1 Discover → Understand → Verify

The primary user journey is:

1. Discover information
2. Understand the context
3. Verify against the original source

---

## 1.2 Facts before opinions

Do not introduce:

- political opinions
- political persuasion
- rankings of officials
- "best" politicians
- "worst" politicians
- speculative claims
- unsupported allegations
- sensational language
- editorial political judgments

When information is contested:

- present the documented claim
- identify the source
- distinguish fact from interpretation
- provide relevant opposing documentation where appropriate

---

## 1.3 Source-first

Important information must have:

- source organization
- source type
- source URL
- publication date where available
- last verified date

Prefer primary sources.

Primary sources include:

- Santa Rosa City Government
- City Government departments
- Commission on Audit
- Department of Budget and Management
- Bureau of Local Government Finance
- Philippine Statistics Authority
- DPWH
- national government agencies
- official project documents
- official ordinances/resolutions
- official government datasets

Secondary sources may be used where primary documentation is unavailable.

Examples:

- reputable news organizations
- historical references
- Wikipedia
- PhilAtlas
- document mirrors

Secondary sources must be clearly identified.

---

## 1.4 Never fabricate

If information cannot be verified:

DO NOT invent it.

Use:

> Data not available in the source reviewed.

or:

> Information not yet verified by Better Santa Rosa City.

---

## 1.5 Independent identity

The website must always make it clear that:

> Better Santa Rosa City is an independent, community-maintained project.

Use a persistent but non-intrusive disclaimer.

Suggested wording:

> Better Santa Rosa City is an independent civic-information project and is not affiliated with
> or operated by the City Government of Santa Rosa.

---

# 2. CURRENT STACK

Preserve the existing technology unless there is a compelling technical reason to change it.

Expected stack:

- Nuxt 4
- Vue 3
- TypeScript
- Tailwind CSS
- Nuxt Content
- Pagefind
- Leaflet
- OpenStreetMap
- Chart.js or ECharts where appropriate
- Cloudflare Pages

Architecture:

STATIC-FIRST.

Do NOT introduce a database for the MVP unless technically necessary.

---

# 3. INFRASTRUCTURE PRINCIPLES

Prefer:

- static generation
- Markdown content
- JSON/YAML structured data
- Git-managed content
- Cloudflare Pages
- client-side map functionality
- free/open services where legally and technically appropriate

Avoid introducing paid infrastructure unless necessary.

Do not create:

- unnecessary API servers
- unnecessary databases
- background workers
- queues
- authentication
- user accounts

for the MVP.

---

# 4. BRAND IDENTITY

The current Santa Rosa Arch-based logo is LOCKED.

Do not redesign the logo.

The Santa Rosa Arch is the primary visual identity.

Brand concept:

> The Arch = Santa Rosa
> The map/information elements = public information
> The gateway = access to civic information

Internal design philosophy:

> Old roots. New city.

This is an internal design direction, not an official city slogan.

---

# 5. DESIGN SYSTEM

## Colors

Primary:

Deep Laguna Green
#164A3D

Accent:

Rose / Terracotta
#C96A73

Secondary:

Laguna Blue
#5E9FA5

Heritage Gold
#D6A94B

Background:

Warm Parchment
#F6F3EA

Text:

Charcoal
#182421

Use colors sparingly.

Do not create a neon-gradient aesthetic.

---

# 6. TYPOGRAPHY

Primary UI font:

- Inter
OR
- Geist
OR
- Manrope

Editorial/history headings may use:

- Source Serif 4

Use typography to create hierarchy.

Avoid:

- oversized text everywhere
- excessive uppercase text
- overly decorative typography

---

# 7. VISUAL STYLE

Desired visual combination:

- modern civic technology
- editorial journalism
- data visualization
- Santa Rosa heritage
- Laguna nature
- subtle Philippine/local identity
- restrained motion

Avoid:

- generic government portal appearance
- Bootstrap-like card grids
- excessive rounded cards
- glassmorphism
- neon gradients
- excessive shadows
- generic stock photos
- excessive animation
- giant government seals

---

# 8. HOMEPAGE INFORMATION ARCHITECTURE

The homepage should remain a strong SEO/discovery page.

However, sections must feel like distinct editorial chapters.

Recommended order:

1. Hero
2. Santa Rosa Today
3. Santa Rosa Now
4. Explore Santa Rosa
5. City Finances
6. Projects
7. History
8. Heritage & Places
9. Laws & Public Records
10. Services
11. Data Trust
12. About / Sources

---

# 9. SECTION SEPARATION

The current website must NOT feel like one continuous block of content.

Major sections should have visual separation.

Desktop:

approximately 96–144px vertical spacing between major chapters.

Mobile:

approximately 56–80px.

Use:

- background changes
- typography changes
- horizontal rules
- section labels
- full-width imagery
- different content compositions

Do NOT use a card for every section.

Cards should be used only where they improve information scanning.

---

# 10. HERO

Hero purpose:

Immediately explain what the website is.

Primary heading:

> Santa Rosa City, Laguna

Primary message:

> Public information about Santa Rosa, made easier to find.

Supporting text:

> Explore the people, projects, budgets, laws, services and public records of Santa Rosa City.

Primary interaction:

GLOBAL SEARCH.

Search placeholder:

> Search Santa Rosa public information...

Quick searches:

- Budgets
- Projects
- Ordinances
- Officials
- Barangays
- Services

Include:

- current Arch logo
- Santa Rosa photography where appropriate
- subtle map/geographic line graphics
- restrained animation

Do not overwhelm the hero.

---

# 11. GLOBAL SEARCH

Search is one of the defining product features.

Use Pagefind.

Search across:

- barangays
- officials
- projects
- laws
- services
- history
- places
- data
- city updates

Future-ready interaction:

CTRL+K / CMD+K.

Search result should show:

- title
- category
- short excerpt
- source
- relevant date

Example:

SEARCH

> road closure

Results:

CITY UPDATE
Road Closure Advisory

Official City Government of Santa Rosa

Sep 17, 2026

[Read more]

---

# 12. SANTA ROSA TODAY

Purpose:

Give visitors a fast factual overview.

Display large editorial statistics rather than generic cards.

Examples:

18
Barangays

5,543 ha
Land area

2004
Cityhood

3
Lakefront barangays

Every statistic must have:

- source
- source link
- last verified date

Do not imply all statistics are current if their source year differs.

---

# 13. SANTA ROSA NOW

NEW MAJOR MVP FEATURE.

Purpose:

Answer:

> What is happening in Santa Rosa right now?

This section combines:

1. Weather
2. Live Traffic
3. City Updates

---

# 14. WEATHER

Use a legitimate public weather API/service.

Existing Open-Meteo integration may be retained.

Show:

- temperature
- weather condition
- humidity
- wind
- update time

Example:

SANTA ROSA NOW

Weather

28°C
Partly cloudy

Humidity 78%
Wind 9 km/h

Updated 8:20 PM

Do not make weather the dominant feature.

Weather is a live utility, not civic content.

Clearly distinguish:

LIVE CONDITIONS

from:

CITY FACTS.

---

# 15. LIVE TRAFFIC

## Goal

Provide a useful traffic map centered on Santa Rosa City.

The feature should be implemented using an officially supported traffic data source/API or traffic visualization service.

Do NOT:

- scrape Google Maps
- scrape Waze
- scrape traffic websites
- create an unofficial traffic API
- redistribute proprietary traffic data without authorization

---

## Preferred implementation

Evaluate officially supported traffic APIs/services.

Potential implementation:

Google Maps Platform traffic layer/API.

Alternative:

another provider with appropriate API/license.

The implementation must verify current pricing, quota, attribution and usage terms before deployment.

---

## UI

Section:

> Live Traffic

Description:

> Current traffic conditions around Santa Rosa, Laguna.

Map:

- centered on Santa Rosa
- responsive
- mobile friendly
- zoom controls
- traffic visualization
- attribution required by provider

Legend:

🟢 Normal

🟡 Slow

🔴 Heavy

If provider uses different terminology/colors, follow provider requirements.

---

## Traffic source transparency

Display:

> Traffic data provided by [provider].

Include:

> Last updated: [timestamp]

Do not claim the traffic data is generated by Better Santa Rosa.

---

# 16. SANTA ROSA ROAD WATCH

Future-ready architecture.

Not necessarily full community reporting in first MVP.

Prepare content model for:

- road closure
- accident
- flooding
- construction
- obstruction
- road condition

Potential future report:

COMMUNITY REPORT

Road obstruction

Santa Rosa–Tagaytay Road

Reported 8 minutes ago

2 confirmations

[View map]

For MVP, do not build complex social functionality unless explicitly required.

---

# 17. CITY UPDATES

NEW MVP FEATURE.

Purpose:

Aggregate official public announcements in a structured format.

Do NOT call this:

> Better Santa Rosa News

Preferred name:

> City Updates

Description:

> Recent public announcements from the City Government of Santa Rosa.

---

# 18. CITY UPDATE SOURCES

Potential sources:

- official Santa Rosa City Government website
- official City Government Facebook page
- official department pages
- official government documents

Every update must identify the source.

Example:

CITY UPDATE

Road Closure Advisory

Temporary closure at [location].

OFFICIAL CITY SOURCE

Posted by the City Government of Santa Rosa

Sep 17, 2026

[Read original →]

---

# 19. CITY UPDATE CONTENT MODEL

Create:

content/updates/

Example:

content/updates/2026-09-17-road-closure.md

Frontmatter:

---
title: "Road Closure Advisory"
date: "2026-09-17"
category: "traffic"
sourceType: "official-facebook"
sourceOrganization: "City Government of Santa Rosa"
sourceUrl: "ORIGINAL_SOURCE_URL"
status: "published"
lastVerified: "2026-09-17"
---

Body:

Better Santa Rosa summary.

---

# 20. CITY UPDATE CATEGORIES

Use:

- emergency
- traffic
- roads
- public-services
- events
- government
- infrastructure
- community
- other

Allow filtering.

---

# 21. FACEBOOK CONTENT RULES

Do not automatically scrape/re-host all Facebook content.

For MVP:

- manually curate
- summarize
- link to original post
- preserve source attribution

Images from official Facebook posts should not automatically be downloaded and re-hosted unless rights/licensing/permission is clear.

Prefer:

> Read original post →

For automation later, investigate official APIs and applicable Meta terms.

---

# 22. CITY UPDATES HOMEPAGE

Display:

3–5 latest updates.

Example:

CITY UPDATES

Sep 17
🚧 Road Closure Advisory

Temporary road closure...

Official City Government

[Read original →]

Sep 16
🌧 Public Advisory

...

[View all updates →]

---

# 23. /UPDATES PAGE

Create:

/updates

Features:

- chronological list
- category filters
- source type
- search
- date
- original source link

Individual:

/updates/[slug]

---

# 24. EXPLORE SANTA ROSA

This should become one of the site's strongest sections.

Purpose:

> Understand the city geographically, historically and culturally.

Include:

- Barangays
- Places
- Landmarks
- Attractions
- History
- Geography
- Laguna Lake
- city map

---

# 25. EXPLORE NAVIGATION

Recommended:

Explore

- Barangays
- Places
- History
- Map

Do not make this a commercial tourism portal.

---

# 26. BARANGAYS

Santa Rosa has 18 barangays.

Maintain the existing data structure.

Group geographically:

Lakefront:

- Aplaya
- Sinalhan
- Caingin

Lowland Urban:

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

Upper Ridge / Tagaytay side:

- Santo Domingo
- Don Jose
- Pulong Santa Cruz

Verify current authoritative grouping before publishing.

---

# 27. BARANGAY PAGES

Each:

/barangays/[slug]

Should support:

- name
- geographic classification
- population
- area where available
- factual description
- location
- related places
- related projects
- public services
- sources
- last verified

Do not invent missing information.

---

# 28. BARANGAY MAP

Important rule:

Do not fabricate official administrative boundaries.

Current site correctly states that a future authoritative GIS layer should be used.

Until authoritative GIS data is available:

Use a map with:

- approximate location markers
- major roads
- Laguna Lake
- landmarks
- city-level geography

Clearly label:

> Approximate locations. Not official cadastral or administrative boundary data.

---

# 29. PLACES

NEW / EXPANDED MVP AREA.

Create:

/places

Individual:

/places/[slug]

Categories:

- Landmarks
- Attractions
- Heritage
- Nature
- Recreation
- Civic places

Do not become a commercial business directory.

---

# 30. PLACE RECORD MODEL

Each place may contain:

---
title:
slug:
category:
barangay:
location:
description:
historicalContext:
whyItMatters:
images:
sources:
officialUrl:
lastVerified:
---

Only publish information that can be reasonably sourced.

---

# 31. SANTA ROSA ARCH

The Santa Rosa Arch should be prominently associated with the site's visual identity.

Use the current approved logo.

The actual landmark can also appear in:

- hero
- Explore
- History
- Heritage

Do not imply ownership or official endorsement.

---

# 32. CITY FINANCES

Rename navigation concept:

Money → Finances

Page:

/money

or preferably:

/finances

If changing route, implement redirect from:

/money → /finances

---

# 33. FINANCE CONTENT

Current verified figures should be treated as source-backed revenue data, not automatically as budgets.

Current known figures:

FY2024:
₱6.251B verified city revenue

FY2022:
₱4.99B

FY2016:
₱2.302B

These figures must retain their exact source definitions.

Do not label them simply:

> City Budget

unless the source actually represents an appropriation budget.

---

# 34. FINANCE PRESENTATION

Use editorial data storytelling.

Example:

CITY FINANCES

Verified city revenue

₱6.251B

FY2024

Then:

FY2016
₱2.302B

FY2022
₱4.99B

FY2024
₱6.251B

Use:

- chart
- source
- methodology
- verification date

Avoid dashboard aesthetics.

---

# 35. FINANCE DISCLAIMER

Clearly explain:

> Revenue is not the same as the city's appropriation budget or total expenditure.

If expenditure data becomes available later, add separate categories:

Revenue
Budget
Expenditure
Procurement

Do not mix them.

---

# 36. PROJECTS

Page:

/projects

Purpose:

> Track documented public projects affecting Santa Rosa.

Current documented projects should remain.

Do not artificially increase project count.

---

# 37. PROJECT MODEL

Each project:

---
title:
slug:
status:
location:
barangay:
description:
agency:
estimatedCost:
actualCost:
startDate:
targetCompletion:
completionDate:
images:
documents:
sources:
lastVerified:
---

Status:

- Announced
- Planned
- Ongoing
- Completed
- Delayed
- Cancelled
- Unknown

Only use status where supported.

---

# 38. PROJECT UI

Prefer editorial layouts.

Featured project:

Large image

PROJECT STATUS

Santa Rosa Civic Complex

Location

Status

Cost

Source

Then smaller projects.

Avoid generic 3-column card grids.

---

# 39. PROJECT TIMELINE

Where information exists:

ANNOUNCED
↓
PLANNED
↓
PROCUREMENT
↓
ONGOING
↓
COMPLETED

Do not create stages that aren't documented.

---

# 40. HISTORY

Keep:

> From Bukol to Modern Santa Rosa

but ensure every major historical claim is source-backed.

Timeline may include:

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

Verify all dates and claims against the source before final publication.

---

# 41. HISTORY DESIGN

Use an interactive editorial timeline.

Desktop:

year rail + content panel.

Mobile:

vertical timeline.

Each event:

YEAR

Title

Short factual explanation

Image if available

Sources

Optional:

[Read sources]

---

# 42. AVOID UNSUPPORTED SUPERLATIVES

Do not use:

> Richest city in Luzon outside Metro Manila

unless a clearly defined authoritative methodology directly supports that exact claim.

Prefer:

> Record city revenue

only when supported by the relevant source.

Or:

> FY2024 verified city revenue reached ₱6.251B.

---

# 43. HERITAGE & LIFE

Page/section:

> Santa Rosa Life & Heritage

Use fewer, larger images.

Prefer:

- Santa Rosa Arch
- heritage streets
- Laguna Lake
- historic areas
- city landmarks
- public spaces
- contemporary Santa Rosa

Avoid generic tourism stock photography.

---

# 44. IMAGE SYSTEM

Every image should have:

- source
- author where required
- license where applicable
- attribution

Do not clutter every image with large legal text.

Use:

> Image credit ⓘ

and keep complete attribution in:

/about/media

---

# 45. MEDIA PAGE

Maintain:

/about/media

Include:

- image
- photographer/creator
- source
- license
- original URL
- usage notes

Make the attribution page comprehensive.

---

# 46. LAWS & PUBLIC RECORDS

Page:

/laws

Categories:

- Ordinances
- Resolutions
- Executive Orders
- Other public records

Each record:

- title
- document number
- date
- summary
- source
- original document URL
- last verified

---

# 47. SOURCE QUALITY

Prioritize official documents.

If a document is only available from:

- Docslib
- iDoc
- document mirror
- third-party archive

label it:

> Secondary document copy

and continue searching for the original official source.

Do not present a document mirror as an official government website.

---

# 48. SERVICES

Services should be task-oriented.

Instead of only:

> Government Services

use:

Start a business
Pay/check property taxes
Find permits
Request civil documents
Find contact information
Check online services

Every service should link to the official destination.

Do not duplicate official government forms unless necessary.

---

# 49. DATA

Page:

/data

Include:

- downloadable datasets where legally/publicly available
- data definitions
- source
- date
- methodology
- file format

Static files can be stored in the repository.

---

# 50. DATA TRUST

Rename/position this as:

> Data Trust

or:

> Data & Sources

Purpose:

Tell visitors exactly where information came from.

Example:

| Dataset | Source | Verified |
|---|---|---|
| Population | PSA | 2026-09-15 |
| City Revenue | COA/BLGF | 2026-09-15 |
| Barangays | Official references | 2026-09-15 |

---

# 51. SOURCE BADGES

Introduce visual source classifications.

OFFICIAL

Official government source.

PRIMARY

Original government document/dataset.

SECONDARY

Third-party reporting/reference.

BETTER SANTA ROSA

Summary/interpretation prepared by the project.

Example:

[OFFICIAL]
City Government of Santa Rosa

or:

[SECONDARY]
Wikipedia

Never make secondary material visually appear equivalent to an official source.

---

# 52. SOURCE COMPONENT

Create reusable component:

<SourceBadge />

Props:

- type
- organization
- date
- url

Example:

OFFICIAL

City Government of Santa Rosa

Sep 17, 2026

[Original source →]

---

# 53. VERIFICATION COMPONENT

Create:

<DataFreshness />

Example:

Last verified by Better Santa Rosa

September 17, 2026

Source published:
September 15, 2026

---

# 54. NAVIGATION

Current navigation contains too many primary items.

Move toward:

Explore
Government
Finances
Projects
Records
Search

Secondary navigation can contain:

Explore:
- Barangays
- Places
- History
- Map

Government:
- Officials
- Departments
- Services
- City Updates

Finances:
- Revenue
- Budget
- Expenditure
- Procurement

Records:
- Laws
- Data
- Sources

If changing navigation significantly, preserve all existing routes.

---

# 55. MOBILE NAVIGATION

Mobile must provide:

- compact header
- logo
- menu button
- search access

Search should be easy to reach.

Do not force users through multiple menus.

---

# 56. SEARCH UX

Implement:

- search icon
- keyboard shortcut
- full-screen/mobile search
- result categories
- highlighted terms

Potential command palette:

Search everything

Barangays
Projects
Laws
Services
Updates
Places
Data

---

# 57. ACCESSIBILITY

Must meet practical WCAG 2.2 AA principles.

Ensure:

- keyboard navigation
- visible focus states
- semantic headings
- alt text
- accessible buttons
- sufficient contrast
- no information conveyed only by color
- map alternatives
- reduced-motion support

Traffic:

Do not rely solely on red/yellow/green.

Provide text:

Normal
Slow
Heavy

---

# 58. RESPONSIVE DESIGN

Test:

Mobile:

320px
375px
390px
430px

Tablet:

768px
1024px

Desktop:

1280px
1440px
1920px

Check:

- horizontal overflow
- navigation
- maps
- charts
- image cropping
- typography
- tables
- source links
- footer

---

# 59. ANIMATION

Use subtle animation only.

Examples:

- hero entrance
- section reveal
- map marker transitions
- timeline progression
- hover states

Use CSS/IntersectionObserver where appropriate.

Respect:

prefers-reduced-motion

Do not animate everything.

---

# 60. PERFORMANCE

Target:

- fast first render
- static HTML where possible
- optimized images
- lazy-loaded below-fold images
- responsive image sizes
- minimal JavaScript
- avoid unnecessary client-side hydration

Map and traffic components may be client-only where required.

Do not make the entire homepage dependent on client-side APIs.

---

# 61. SEO

Every major page requires:

- unique title
- meta description
- canonical URL
- Open Graph metadata
- Twitter/X metadata
- proper H1
- semantic headings

Create sitemap.

Create robots.txt.

Use structured data where appropriate:

- WebSite
- Article for individual updates where appropriate
- Dataset for data pages where appropriate
- BreadcrumbList

Do not falsely identify the site as an official government organization.

---

# 62. SEO PAGE STRUCTURE

Important routes:

/
 
/explore

/barangays

/barangays/[slug]

/places

/places/[slug]

/updates

/updates/[slug]

/government

/finances

/projects

/laws

/services

/data

/sources

/about

/about/media

/about/methodology

---

# 63. ABOUT PAGE

Clearly explain:

What is Better Santa Rosa?

Why it exists.

Who maintains it.

How sources are selected.

How data is verified.

What the project does not represent.

Include:

Official City Government website

[Official website →]

---

# 64. METHODOLOGY PAGE

Create:

/about/methodology

Explain:

1. Source collection
2. Primary-source preference
3. Secondary-source handling
4. Verification
5. Data freshness
6. Corrections
7. Missing information
8. Image licensing
9. Independence from government

---

# 65. CORRECTIONS POLICY

Add:

> Found an error?

Provide a lightweight contact/report mechanism.

For MVP, this can be:

- email link
- GitHub issue
- simple protected form if already available

Do not introduce accounts.

---

# 66. CONTENT ARCHITECTURE

Use Nuxt Content.

Recommended:

content/
├── updates/
├── barangays/
├── places/
├── projects/
├── laws/
├── services/
├── history/
├── data/
├── sources/
└── pages/

---

# 67. STRUCTURED DATA

Where useful, create structured data files:

data/
├── barangays.json
├── city-facts.json
├── traffic.json
├── places.json
└── finance.json

However, do not duplicate the same source of truth unnecessarily.

Prefer Nuxt Content when the information requires editorial prose.

---

# 68. COMPONENT ARCHITECTURE

Build/reuse components such as:

AppHeader
AppFooter
SearchBar
SearchCommand
SectionHeader
SourceBadge
SourceCard
VerificationBadge
DataFreshness
StatBlock
DataChart
PlaceCard
BarangayCard
ProjectCard
UpdateCard
Timeline
MapView
TrafficMap
WeatherWidget
StatusBadge
ImageCredit
DisclaimerBanner
Breadcrumbs

---

# 69. TRAFFIC COMPONENT ARCHITECTURE

Create:

TrafficMap.vue

Responsibilities:

- initialize map/provider
- load traffic layer
- show attribution
- show loading state
- show unavailable state
- expose update timestamp

Do not put provider credentials directly in source code if the provider requires secret credentials.

Public browser keys may be used only where provider explicitly supports them.

---

# 70. TRAFFIC FAILURE STATES

If traffic provider fails:

Show:

> Live traffic is temporarily unavailable.

Do not show fake traffic status.

If no traffic data exists:

> Traffic data is not currently available for this area.

---

# 71. WEATHER FAILURE STATES

If weather API fails:

> Live weather is temporarily unavailable.

Do not show stale data as live.

---

# 72. CITY UPDATE FAILURE STATES

If no updates are available:

> No recent city updates have been added.

Do not fabricate.

---

# 73. CONTENT DATES

Every live/current item must have a date.

Avoid:

> Current

unless there is a mechanism to establish currentness.

Prefer:

> Published Sep 17, 2026

and:

> Last verified Sep 17, 2026

---

# 74. DATA FRESHNESS MODEL

Use:

publishedAt
updatedAt
lastVerified

Do not confuse these.

Example:

Published:
Sep 10, 2026

Last verified:
Sep 17, 2026

---

# 75. OFFICIAL FACEBOOK SOURCE MODEL

For official Facebook announcements:

sourceType:

official-facebook

sourceOrganization:

City Government of Santa Rosa

sourceUrl:

original Facebook post

Do not present the summary as if it was written by the city.

Use:

> Better Santa Rosa summary

and:

> Read original post

---

# 76. POLITICAL / GOVERNMENT CONTENT

Government information is allowed and important.

However:

- remain factual
- do not rank officials
- do not endorse candidates
- do not recommend political choices
- do not use loaded political language
- do not infer motives
- do not predict election outcomes

Officials can be documented by:

- position
- term
- official source
- public responsibilities
- documented actions

---

# 77. GOVERNMENT PAGE

Page:

/government

Include:

- city government structure
- mayor
- vice mayor
- council
- departments
- official contact channels

Use current authoritative sources.

Do not turn this into political commentary.

---

# 78. CITY UPDATES VS NEWS

Do NOT call Better Santa Rosa's content:

> News

unless it is clearly a third-party news article.

Preferred:

> City Updates

Reason:

Better Santa Rosa organizes official public information rather than positioning itself as a news organization.

---

# 79. THIRD-PARTY NEWS

If third-party reporting is included:

label:

REPORTING

Organization

Publication date

[Read original]

Do not rewrite reporting in a way that changes its meaning.

---

# 80. MAP STRATEGY

Use:

Leaflet + OpenStreetMap

for:

- barangays
- places
- landmarks
- projects
- geographic context

Traffic provider can be separate.

Do not claim OSM provides traffic data.

---

# 81. MAP ATTRIBUTION

Always preserve required:

OpenStreetMap attribution.

Also preserve provider-specific attribution.

---

# 82. TOURISM BALANCE

Places and attractions are useful.

But Better Santa Rosa is not a tourism website.

Do not make:

> Top 10 Santa Rosa attractions

the primary homepage concept.

Instead:

> Places in Santa Rosa

with factual civic/heritage context.

---

# 83. DATA VISUALIZATION RULES

Charts must:

- have clear units
- show source
- show year
- avoid misleading scales
- avoid unnecessary decoration
- work on mobile
- provide textual alternative

Never visually imply trends that the underlying data cannot support.

---

# 84. FINANCE CHART RULE

For revenue data:

Y-axis:

₱ billions

X-axis:

Fiscal year

Do not connect years with a line if missing years could imply continuous data.

Bar chart may be more appropriate.

---

# 85. PROJECT IMAGES

Use:

- official renderings
- government project images
- properly licensed images
- credited photographs

If conceptual:

> Artist's perspective

Do not imply a rendering represents completed construction.

---

# 86. IMAGE OPTIMIZATION

Use:

- WebP/AVIF where appropriate
- responsive sizes
- lazy loading
- meaningful alt text

Do not put critical hero imagery behind excessive client-side loading.

---

# 87. CONTENT QUALITY CHECK

Every content entry must answer:

1. What is it?
2. When did it happen?
3. Where did the information come from?
4. When was it last verified?
5. Is the source primary or secondary?

If these cannot be answered:

flag the content for review.

---

# 88. ORCHESTRATOR WORKFLOW

Before coding:

1. Inspect current repository.
2. Inspect current deployed website.
3. Identify current architecture.
4. Identify what already exists.
5. Do not rebuild existing working features unnecessarily.
6. Create an implementation plan.
7. Identify affected routes/components/content.
8. Identify risks.

---

# 89. TASK CLASSIFICATION

For every task classify:

BUG
UPDATE
NEW FEATURE
REFACTOR
CONTENT
DESIGN

Examples:

Live traffic:

NEW FEATURE

Navigation restructuring:

UPDATE / DESIGN

Fix incorrect source:

BUG / CONTENT

---

# 90. TDD WORKFLOW

For logic-heavy functionality:

RED
→ write failing test

GREEN
→ implement minimal solution

REFACTOR
→ clean implementation

Then:

QA

For pure visual changes, perform visual QA instead of forcing artificial unit tests.

---

# 91. SECURITY CHECK

Before completing any feature verify:

- no exposed secrets
- no private API keys
- no unnecessary user data
- no insecure external HTML
- safe external links
- proper rel attributes where needed
- sanitized content
- rate limiting if public forms are introduced

---

# 92. DATA OWNERSHIP CHECK

For every new data source:

Ask:

Who owns this data?

Is redistribution permitted?

Is API use permitted?

Is attribution required?

Can the data legally be cached?

Can images be re-hosted?

Never assume:

> Publicly visible = free to scrape/re-publish.

---

# 93. EXTERNAL API CHECK

Before adding any API:

verify:

- current API documentation
- pricing
- free tier
- quotas
- attribution
- commercial-use restrictions
- caching rules
- redistribution rules
- rate limits
- API key requirements

For traffic specifically:

DO NOT implement until provider terms are verified.

---

# 94. GIT RULES

The AI agent must NOT:

- git commit
- git push
- delete branches
- rewrite git history

unless explicitly instructed by the user.

The orchestrator may inspect:

git status
git diff
git log

but must not modify repository history.

---

# 95. NO UNNECESSARY REWRITES

Do not replace:

- Nuxt
- Tailwind
- Nuxt Content
- Pagefind
- existing working components

unless necessary.

Prefer incremental improvements.

---

# 96. PHASED IMPLEMENTATION

## PHASE 1 — AUDIT

Inspect:

- current repository
- routes
- components
- content
- assets
- styles
- SEO
- deployment config

Compare against:

https://bettersantarosacity.pages.dev/

Output:

- architecture map
- current feature inventory
- missing features
- duplication
- technical debt

Do not code yet.

---

# 97. PHASE 2 — DESIGN SYSTEM / VISUAL POLISH

Implement:

- stronger section separation
- typography hierarchy
- editorial layouts
- spacing
- source badges
- verification indicators
- improved cards
- improved image treatment
- navigation cleanup

Preserve current content.

---

# 98. PHASE 3 — NAVIGATION

Refactor navigation toward:

Explore
Government
Finances
Projects
Records
Search

Maintain compatibility with existing URLs.

Implement redirects if route names change.

---

# 99. PHASE 4 — SANTA ROSA NOW

Implement:

Weather
+
City Updates
+
Traffic architecture

First build the shared section.

Example:

SANTA ROSA NOW

┌──────────────┬──────────────┬──────────────┐
│ WEATHER      │ TRAFFIC      │ CITY UPDATES │
│ 28°C         │ 🟡 Slow      │ 3 recent     │
│ Updated      │ Live         │ Official     │
└──────────────┴──────────────┴──────────────┘

---

# 100. PHASE 5 — CITY UPDATES

Implement:

/updates

/updates/[slug]

Content collection.

Filtering.

Source badges.

Original-source links.

Date.

Last verified.

Homepage latest updates.

---

# 101. PHASE 6 — LIVE TRAFFIC

Research approved provider.

Do not assume provider.

Verify:

- API
- traffic coverage
- Santa Rosa coverage
- pricing
- attribution
- quotas
- usage rights

Then implement.

If no appropriate provider is available within acceptable cost/terms:

DO NOT FAKE THE FEATURE.

Instead provide a clearly labeled:

> Traffic information

with appropriate external navigation links if permitted.

---

# 102. PHASE 7 — EXPLORE

Improve:

- barangays
- places
- landmarks
- map
- history

Create stronger editorial layout.

---

# 103. PHASE 8 — FINANCES

Rename Money concept.

Improve:

- terminology
- chart
- source hierarchy
- methodology
- explanatory copy

Ensure revenue ≠ budget.

---

# 104. PHASE 9 — PROJECTS

Improve:

- status
- timeline
- sources
- images
- metadata
- related barangay
- related documents

Do not invent projects.

---

# 105. PHASE 10 — SOURCE/TRUST SYSTEM

Implement:

SourceBadge
DataFreshness
ImageCredit
Methodology
Media

Ensure consistent usage throughout site.

---

# 106. PHASE 11 — SEARCH

Audit Pagefind indexing.

Ensure all meaningful content is searchable.

Exclude:

- navigation
- repetitive footer
- source boilerplate

where appropriate.

Add search shortcut.

---

# 107. PHASE 12 — SEO

Audit:

- titles
- descriptions
- canonical
- sitemap
- robots
- OG
- structured data
- breadcrumbs

Check every major route.

---

# 108. PHASE 13 — PERFORMANCE

Run:

- Lighthouse
- mobile performance check
- image audit
- JavaScript bundle audit
- network request audit

Optimize only where useful.

---

# 109. PHASE 14 — ACCESSIBILITY

Run:

- keyboard test
- screen-reader semantic inspection
- contrast
- focus states
- reduced motion
- map accessibility
- mobile navigation

---

# 110. PHASE 15 — FINAL QA

Test:

HOME
EXPLORE
BARANGAYS
PLACES
UPDATES
GOVERNMENT
FINANCES
PROJECTS
LAWS
SERVICES
DATA
SOURCES
ABOUT
MEDIA

Test:

- desktop
- tablet
- mobile

---

# 111. CONTENT QA

Verify:

- all dates
- all source URLs
- all statistics
- all project statuses
- all official links
- all image credits

No broken sources.

No fabricated data.

No unsupported claims.

---

# 112. LINK QA

Check all:

internal links
external links
official sources
Facebook links
map links
image source links

External government links must work.

---

# 113. TRAFFIC QA

Traffic must show:

- loading state
- loaded state
- unavailable state
- attribution
- update timestamp
- mobile usability

Never display fake traffic.

---

# 114. WEATHER QA

Weather must show:

- current data
- timestamp
- source
- failure state

Never show an old response as current without identifying its age.

---

# 115. CITY UPDATE QA

Every update must have:

- title
- date
- source
- source URL
- source organization
- category
- summary
- last verified

---

# 116. VISUAL QA

Check:

- section spacing
- typography
- image proportions
- card consistency
- hover states
- mobile spacing
- navigation
- footer
- map height
- chart sizing

The site should feel:

> editorial civic technology

not:

> generic government dashboard.

---

# 117. FINAL UX GOAL

The visitor should experience:

STEP 1

> That's Santa Rosa.

STEP 2

> This isn't the usual government website.

STEP 3

> I can find information here.

STEP 4

> I can see what's happening now.

STEP 5

> I can understand the city's money/projects/history.

STEP 6

> I can verify where this information came from.

---

# 118. FINAL PRODUCT STRUCTURE

The final MVP should conceptually contain three major pillars:

## EXPLORE

Understand Santa Rosa.

Includes:

- Barangays
- Places
- History
- Geography
- Heritage
- Map

---

## SANTA ROSA NOW

Know what is happening.

Includes:

- Weather
- Live Traffic
- City Updates
- Road Watch architecture

---

## RECORDS

Verify information.

Includes:

- Government
- Finances
- Projects
- Laws
- Services
- Data
- Sources

---

# 119. TRUST LAYER

Across everything:

Sources

Verification dates

Source classifications

Methodology

Media credits

Corrections

This is not merely an About-page feature.

It is part of the product.

---

# 120. SUCCESS CRITERIA

The MVP is complete when:

[ ] Homepage has strong editorial section separation

[ ] Arch-based branding is preserved

[ ] Global search works

[ ] Explore experience is cohesive

[ ] 18 barangays are accessible

[ ] Places/landmarks are accessible

[ ] History is source-backed

[ ] Santa Rosa Now exists

[ ] Weather works or fails gracefully

[ ] City Updates works

[ ] Official sources are clearly labeled

[ ] Live traffic is implemented only through an authorized provider OR intentionally deferred

[ ] Finances clearly distinguish revenue from budget

[ ] Projects have source/status metadata

[ ] Laws identify original/secondary sources

[ ] Services link to official destinations

[ ] Data Trust exists

[ ] Media credits are centralized

[ ] Methodology exists

[ ] Search indexes all meaningful content

[ ] SEO metadata is complete

[ ] Mobile layout works

[ ] Accessibility passes basic WCAG checks

[ ] Performance is acceptable

[ ] No fabricated information exists

[ ] No exposed secrets exist

[ ] No unauthorized scraping exists

[ ] No political persuasion/ranking exists

[ ] No git commit/push was performed without explicit instruction

---

# 121. DEFINITION OF DONE

A feature is NOT complete merely because it renders.

It is complete only when:

1. Implementation works.
2. Content is source-backed.
3. UX is responsive.
4. Accessibility is considered.
5. Failure states exist.
6. External source requirements are respected.
7. SEO is considered.
8. Performance is acceptable.
9. Security is checked.
10. QA has been performed.

---

# 122. ORCHESTRATOR OUTPUT REQUIREMENT

Before implementing:

Provide:

1. Current architecture
2. Existing components to reuse
3. Existing routes
4. Existing content collections
5. Proposed changes
6. New components
7. New routes
8. Data/content changes
9. External services required
10. Risks
11. Implementation order

Then implement in phases.

After each phase report:

- files changed
- functionality added
- tests performed
- QA performed
- remaining issues

Do not silently make major architectural decisions.

---

# 123. IMPORTANT FINAL RULE

Do not optimize for:

> More features.

Optimize for:

> Better information architecture + better source transparency + better usability + better visual storytelling.

The website should remain lightweight, fast, independent and trustworthy.

The final product should feel like:

> A modern civic information layer for Santa Rosa.

Not:

> A copy of the city government website.

---

# FINAL PRODUCT STATEMENT

Better Santa Rosa City is an independent, source-first civic information portal that makes public information about Santa Rosa easier to find, understand, and verify.

ARCH = identity

SEARCH = discovery

EXPLORE = understanding

SANTA ROSA NOW = current information

RECORDS = verification

SOURCES = trust