# Specification: Better Santa Rosa City — Full MVP Implementation Update (v2.0)

**Date:** 2026-09-17  
**Type:** Major Product Specification & Architecture Update (UPDATE / NEW_FEATURE)  
**Status:** Approved for Implementation Planning  
**Source Document:** `docs/20260917_205700-better-santa-rosa-city-update.md`

---

## 1. Executive Summary & Product Vision

**Product Statement:**  
Better Santa Rosa City is an independent, source-first civic information portal that makes public information about Santa Rosa, Laguna easier to find, understand, and verify.

**Core User Journey:**  
1. **Discover:** Find civic information via Pagefind global search, quick-search tags, and structured directories.
2. **Understand:** Read neutral, plain-language summaries and view verified visualizations.
3. **Verify:** Check primary source links, publication dates, and verification timestamps.

**Product Pillars:**
- **ARCH:** Identity (Santa Rosa Arch / Bantayang Bato is locked; design philosophy: *Old roots. New city.*)
- **SEARCH:** Discovery (Global Pagefind search with `Cmd+K` / `Ctrl+K`)
- **EXPLORE:** Understanding (Barangays, Places, History, Map)
- **SANTA ROSA NOW:** Current Information (Weather, Live Traffic architecture, City Updates)
- **RECORDS:** Verification (Government, Finances, Projects, Laws, Services, Data)
- **SOURCES:** Trust (Source badges, Data freshness, Image provenance, Methodology, Corrections)

**What the Project is NOT:**
- NOT an official government website or municipal affiliate
- NOT a political campaign or advocacy platform
- NOT a replacement for official city government services
- NOT a commercial business or tourism directory
- NOT a social network or news reporting organization

---

## 2. Capability Map (Phase 0)

| Module ID | Responsibility | Depends On |
|---|---|---|
| `trust-and-sources` | Enhanced SourceBadge (`OFFICIAL`, `PRIMARY`, `SECONDARY`, `BETTER SANTA ROSA`), DataFreshness component, `/about/methodology` page, and corrections link | — |
| `places-directory` | Places schema (`PlaceSchema`), dataset (`data/places.json`), `/places` directory page, and `/places/[slug]` detail pages | `trust-and-sources` |
| `city-updates` | City Updates schema (`CityUpdateSchema`), curated dataset (`data/updates.json`), `/updates` directory, `/updates/[slug]` detail pages, and homepage latest updates component | `trust-and-sources` |
| `traffic-and-now` | Live Traffic architecture (authorized provider or fallback), weather failure states, and the integrated "Santa Rosa Now" section | `city-updates` |
| `finances-refactor` | Route migration `/money` -> `/finances` with backwards-compatible redirects, Revenue vs. Budget disclaimer, and bar chart storytelling | `trust-and-sources` |
| `navigation-and-shell` | Restructured 6-pillar navigation (`Explore`, `Government`, `Finances`, `Projects`, `Records`, `Search`) with desktop menus and accessible mobile drawer | `places-directory`, `city-updates`, `finances-refactor` |
| `homepage-editorial` | 12 editorial chapters on homepage with visual separation (96-144px desktop spacing, distinct background grounds, chapter headers) and Santa Rosa Now integration | `traffic-and-now`, `places-directory`, `finances-refactor` |
| `search-and-seo` | Sitemap generator update (`generate-sitemap.mjs`), `sync-public-data.mjs` data mirroring, structured data (JSON-LD), and Pagefind indexing | `navigation-and-shell`, `homepage-editorial` |

**Build Order:**  
`trust-and-sources` → `places-directory`, `city-updates`, `finances-refactor` → `traffic-and-now` → `navigation-and-shell` → `homepage-editorial` → `search-and-seo`

---

## 3. Technology Stack & Architectural Constraints

| Layer | Technology | Version / Configuration | Purpose |
|---|---|---|---|
| **Framework** | Nuxt 4 | `compatibilityVersion: 4` | Static Site Generation (SSG) with Nitro static preset |
| **View Engine** | Vue 3 | Composition API (`<script setup lang="ts">`) | Reactive UI components |
| **Language** | TypeScript | Strict mode (`strict: true`) | Full type safety across schemas, routes, and composables |
| **Styling** | Tailwind CSS | v3.4+ with custom civic color tokens | Visual design system and chapter grounds |
| **Data Validation** | Zod | v3.24+ | Schema validation for all JSON datasets in `data/` |
| **Search Engine** | Pagefind | v1.3+ | Post-build static full-text indexing over `dist/` |
| **Maps** | MapLibre GL / OpenStreetMap | v5.24.0 / OSM | Client-side map exploration and geographic context |
| **Icons** | Lucide Vue Next | v0.475.0 | Accessible, lightweight SVG icons |
| **Testing** | Vitest & VTU | Vitest 2.1+, Vue Test Utils 2.4+, happy-dom | Unit tests, data integrity, and component behavior |
| **Hosting** | Cloudflare Pages | `cloudflare-pages-static` | Edge static delivery (₱0/month runtime cost, zero database) |

---

## 4. Design System & Visual Style

### Color Tokens
- **Laguna Green (Primary):** `#164A3D` — Deep civic green
- **Terracotta / Rose Accent:** `#C96A73` — Highlights and badges
- **Rose Accent Dark (AA text):** `#9E4A55` — High-contrast text on light grounds (5.3:1)
- **Laguna Blue:** `#5E9FA5` — Water, lakefront, and data visualizations
- **Heritage Gold:** `#D6A94B` — Historical milestones and badges
- **Warm Parchment (Ground):** `#F6F3EA` — Editorial backgrounds
- **Light Green (Ground):** `#EBF2EE` — Soft tinted ground for explore chapters
- **Charcoal (Text):** `#182421` — High-contrast readable body text

### Typography Hierarchy
- Primary UI: `Inter`, `Manrope`, `sans-serif`
- Editorial & Chapter Headings: `Source Serif 4`, `Georgia`, `serif`
- Numerical Metrics, Dates, Hotlines: Monospace stack (`ui-monospace`, `monospace`)

### Visual Separation Rules
- The homepage must NOT feel like one continuous block of content.
- Vertical chapter separation: 96–144px (`py-24` to `py-36`) on desktop; 56–80px (`py-14` to `py-20`) on mobile.
- Alternate full-bleed ground tones: `section-parchment`, `section-white`, `section-light-green`, `section-deep-green`.
- Avoid cards for every section; reserve cards for scanning multiple discrete entities (e.g., barangays, updates, places).

---

## 5. Module Specifications

### Module 1: `trust-and-sources`
1. **SourceBadge Component (`components/data/SourceBadge.vue`):**
   - Props:
     - `type`: `'official' | 'primary' | 'secondary' | 'community'`
     - `organization`?: string
     - `date`?: string
     - `url`?: string
   - Visual Badges:
     - `OFFICIAL`: Emerald/Laguna green tint — City Government of Santa Rosa or official agency
     - `PRIMARY`: Blue/Laguna blue tint — Direct government document, ordinance, COA report
     - `SECONDARY`: Gray/Charcoal tint — Docslib, PhilAtlas, Wikipedia, media report
     - `BETTER SANTA ROSA`: Gold/Heritage gold tint — Project summary or curation
   - Outbound link: `[Original source →]` with accessible rel attributes (`noopener noreferrer`).
2. **DataFreshness Component (`components/data/DataFreshness.vue`):**
   - Tracks datasets including new `places` and `updates`.
   - Distinctly renders `publishedAt`, `updatedAt`, and `lastVerified`.
3. **Methodology Page (`pages/about/methodology.vue`):**
   - Route: `/about/methodology`
   - Covers 9 core principles:
     1. Source collection
     2. Primary-source preference
     3. Secondary-source handling
     4. Verification process
     5. Data freshness model
     6. Corrections policy ("Found an error?" with mailto / GitHub link)
     7. Missing information handling ("Data not available in the source reviewed")
     8. Image licensing & Media credits
     9. Independence from government & political neutrality

### Module 2: `places-directory`
1. **Schema (`types/civic.ts`):**
   ```typescript
   export const PlaceCategoryEnum = z.enum([
     'Landmark',
     'Attraction',
     'Heritage',
     'Nature',
     'Recreation',
     'Civic'
   ])

   export const PlaceSchema = z.object({
     id: z.string(),
     title: z.string(),
     slug: z.string(),
     category: PlaceCategoryEnum,
     barangay: z.string(),
     location: z.string(),
     description: z.string(),
     historicalContext: z.string().optional(),
     whyItMatters: z.string().optional(),
     images: z.array(z.string()).default([]),
     sources: z.array(z.string()),
     officialUrl: z.string().url().optional(),
     lastVerified: z.string()
   })

   export type Place = z.infer<typeof PlaceSchema>
   ```
2. **Dataset (`data/places.json`):**
   - Documented civic and heritage places:
     - Santa Rosa Arch (Bantayang Bato) (Landmark, Balibago/Poblacion corridor)
     - Cuartel de Santo Domingo (Heritage, Santo Domingo)
     - Santa Rosa City Hall & Civic Complex (Civic, Tagapo/City proper)
     - Museo de Santa Rosa (Heritage, Poblacion)
     - Enchanted Kingdom (Attraction/Recreation, Balibago)
     - Laguna de Bay Lakeshore (Nature, Aplaya/Sinalhan/Caingin)
3. **Components & Pages:**
   - Component: `components/places/PlaceCard.vue`
   - List Page: `pages/places/index.vue` with category filtering, search, and count
   - Detail Page: `pages/places/[slug].vue` with description, why it matters, historical context, location, sources, and verification status

### Module 3: `city-updates`
1. **Schema (`types/civic.ts`):**
   ```typescript
   export const UpdateCategoryEnum = z.enum([
     'emergency',
     'traffic',
     'roads',
     'public-services',
     'events',
     'government',
     'infrastructure',
     'community',
     'other'
   ])

   export const UpdateSourceTypeEnum = z.enum([
     'official-portal',
     'official-facebook',
     'city-ordinance',
     'advisory',
     'secondary'
   ])

   export const CityUpdateSchema = z.object({
     id: z.string(),
     title: z.string(),
     slug: z.string(),
     date: z.string(),
     category: UpdateCategoryEnum,
     sourceType: UpdateSourceTypeEnum,
     sourceOrganization: z.string(),
     sourceUrl: z.string().url(),
     status: z.enum(['published', 'archived']).default('published'),
     summary: z.string(),
     content: z.string().optional(),
     lastVerified: z.string()
   })

   export type CityUpdate = z.infer<typeof CityUpdateSchema>
   ```
2. **Dataset (`data/updates.json`):**
   - Curated official city advisories (traffic notices, road closures, tax/business permit deadlines, disaster preparedness advisories).
   - Strict source attribution (e.g. City Government of Santa Rosa official announcements).
3. **Components & Pages:**
   - Component: `components/updates/UpdateCard.vue`
   - List Page: `pages/updates/index.vue` (chronological list, category tabs, source badges, search)
   - Detail Page: `pages/updates/[slug].vue` (full summary, official advisory disclaimer, outbound source link)

### Module 4: `traffic-and-now`
1. **Santa Rosa Now Architecture:**
   - Combines three live/current information widgets:
     1. **Live Weather:** Open-Meteo current condition, temperature (°C), humidity, wind, and update time. Graceful fallback banner if API fails: *"Live weather is temporarily unavailable."*
     2. **Live Traffic:** Map centered on Santa Rosa (14.3122° N, 121.1114° E).
        - Explicit accessibility text: Normal, Slow, Heavy (never color alone).
        - Source attribution: Traffic data provider attribution and timestamp.
        - Fallback/Error state: When live traffic data is unavailable or unconfigured, display clearly labeled *"Live traffic data is temporarily unavailable"* or authoritative external traffic advisory link.
        - Road Watch architecture data contract prepared for road closures and flooding.
     3. **Latest City Updates:** Displays 3–5 recent official advisories with category badge and outbound source link.
2. **Component:** `components/civic/SantaRosaNow.vue`

### Module 5: `finances-refactor`
1. **Route Migration:**
   - Primary route: `/finances` and `/finances/budget`
   - Backwards compatibility: `/money/index.vue` and `/money/budget.vue` maintain redirects to `/finances` and `/finances/budget`.
2. **Data Presentation & Disclaimer:**
   - Enforce prominent disclaimer: *"Revenue is not the same as the city's appropriation budget or total expenditure."*
   - Display verified revenue records:
     - FY2024: ₱6.251B (COA / LGU Full Disclosure)
     - FY2022: ₱4.99B (COA)
     - FY2016: ₱2.302B (BLGF)
   - Use discrete bar chart rather than continuous line to prevent misleading interpolation between non-consecutive years.

### Module 6: `navigation-and-shell`
1. **Restructured Header Navigation (`components/civic/CivicHeader.vue`):**
   - **Primary 6 Pillars:**
     1. `Explore` (Sublinks: Barangays, Places, History, Map)
     2. `Government` (Sublinks: Officials, Departments, Services, City Updates)
     3. `Finances` (Sublinks: Revenue, Budget, Expenditure, Procurement)
     4. `Projects` (City Projects)
     5. `Records` (Sublinks: Laws, Data, Sources)
     6. `Search` (Cmd+K Global Search trigger)
   - Desktop dropdown/popover menus or clear grouped secondary navigation.
   - Mobile navigation drawer organized into the 6 pillars with direct touch targets >= 44×44px.

### Module 7: `homepage-editorial`
1. **12 Distinct Editorial Chapters (`pages/index.vue`):**
   - **Chapter 1: Hero** (Bantayang Bato Arch emblem, "Public information about Santa Rosa, made easier to find.", quick-search tags, global search)
   - **Chapter 2: Santa Rosa Today** (18 Barangays, 5,543 ha Land Area, 2004 Cityhood, 3 Lakefront barangays, with sources)
   - **Chapter 3: Santa Rosa Now** (Weather + Live Traffic architecture + City Updates)
   - **Chapter 4: Explore Santa Rosa** (Interactive Map Explorer, 3 geographic zones, Places teaser)
   - **Chapter 5: City Finances** (Verified revenue storytelling, ₱6.251B FY2024, bar chart, Revenue ≠ Budget disclaimer)
   - **Chapter 6: Projects** (Featured civic complex project, capital projects directory teaser)
   - **Chapter 7: History** (Interactive timeline: "From Bukol to Modern Santa Rosa", 1571 to 2025)
   - **Chapter 8: Heritage & Places** (Curated landmark photo highlights and places teaser)
   - **Chapter 9: Laws & Public Records** (City ordinances, resolutions, executive orders)
   - **Chapter 10: Services** (Task-oriented civic tasks with official outbound links)
   - **Chapter 11: Data Trust** (Dataset | Source | Verified table, transparency registry)
   - **Chapter 12: About & Sources** (Mission, non-governmental disclaimer, methodology, media credits, corrections)
2. **Visual Rhythm:**
   - 96–144px vertical chapter spacing on desktop (`py-24` to `py-36`).
   - 56–80px on mobile (`py-14` to `py-20`).
   - Full-bleed chapter grounds: `section-parchment`, `section-white`, `section-light-green`, `section-deep-green`.

### Module 8: `search-and-seo`
1. **Sitemap Generation (`scripts/generate-sitemap.mjs`):**
   - Add static routes: `/about/methodology`, `/finances`, `/finances/budget`, `/places`, `/updates`.
   - Add dynamic routes: `/places/${p.slug}`, `/updates/${u.slug}`.
2. **Public Data Sync (`scripts/sync-public-data.mjs`):**
   - Sync `places.json` and `updates.json` into `public/data/`.
3. **Structured Data:**
   - JSON-LD schemas for `WebSite`, `Dataset`, `Place`, and `Article` where applicable.

---

## 6. Execution Commands

```bash
# Package install
pnpm install

# Test execution
pnpm test:run

# Lint and typecheck
pnpm typecheck

# Full production build & search index verification
pnpm build:prod
```

---

## 7. Project Boundaries

- **Always Do:**
  - Verify all 18 barangays and official records against verified sources.
  - Maintain the persistent non-governmental disclaimer on every page.
  - Provide fallback states for dynamic components (weather, traffic).
  - Respect `prefers-reduced-motion` for all visual animations.
  - Validate all JSON files against Zod schemas in `tests/unit/data-integrity.spec.ts`.
- **Ask First:**
  - Introducing any paid external API keys or paid traffic providers.
  - Modifying the locked Santa Rosa Arch brand mark.
- **Never Do:**
  - Commit secrets or private API tokens to the repository.
  - Scrape Google Maps or Waze without authorization.
  - Conflate city revenue with the total city budget.
  - Use em-dashes (`—`) in user-facing UI copy per taste guidelines.
  - Introduce server-side databases or background workers for MVP.
  - Perform unauthorized git commits or pushes to protected branches.

---

## 8. Success Criteria

1. [ ] All 12 editorial chapters render on the homepage with clear visual ground separation.
2. [ ] Santa Rosa Now section is functional with Weather, Live Traffic architecture (with fallback), and latest City Updates.
3. [ ] `/places` and `/places/[slug]` are fully functional and backed by `data/places.json`.
4. [ ] `/updates` and `/updates/[slug]` are fully functional and backed by `data/updates.json`.
5. [ ] `/finances` route is active with Revenue vs. Budget disclaimer, and `/money` redirects seamlessly.
6. [ ] `/about/methodology` documents source criteria, freshness, and the corrections process.
7. [ ] Navigation reflects the 6 core pillars with accessible mobile navigation.
8. [ ] `pnpm test:run` passes 100% of unit and data integrity tests.
9. [ ] `pnpm build:prod` generates static assets and indexes all routes in Pagefind without error.
