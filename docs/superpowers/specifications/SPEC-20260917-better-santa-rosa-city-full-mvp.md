# Specification: Better Santa Rosa City — Full MVP

**Date:** 2026-09-17  
**Type:** Full Product Specification (FULL_MVP)  
**Status:** Approved for Implementation Planning  
**Source Document:** `docs/20260917_151400-better-santa-rosa-city-full-mvp.md`

---

## 1. Executive Summary & Product Vision

**Core Promise:** Public information about Santa Rosa, made easier to find, understand, and verify.  
**Design Philosophy:** *Old roots. New city.*  
**Primary Brand Anchor:** The historic **Santa Rosa Arch / Bantayang Bato** (not a rose).  
**Core User Journey:** DISCOVER → UNDERSTAND → VERIFY.

Better Santa Rosa City (`betterSantaRosaCity.org` / `bettersantarosacity.pages.dev`) is an independent, community-maintained civic intelligence and open-data public information layer over public records for Santa Rosa City, Laguna. It is strictly non-governmental, is not affiliated with or endorsed by the City Government of Santa Rosa, and does not replace official municipal services.

### Fundamental Values
1. **Facts Before Opinions:** Data-first, neutral data journalism. No political editorializing, rankings, scores, or candidate commentary.
2. **Source-First Verification:** Every material factual claim, budget figure, project status, ordinance, and demographic metric must cite its primary official source (COA, PSA, DBM, City Ordinances, Official City Directory) and disclose a `lastVerified` date.
3. **Preserve Source Definitions:** Never conflate city revenue with total budget, appropriations with actual spending, or proposals with ongoing/completed projects. When data is absent from reviewed sources, state: *"Data not available in the source reviewed."*
4. **Static-First & Cost-Effective:** 100% static site generation deployed to Cloudflare Pages (₱0/month runtime cost, zero database, zero server API dependencies).
5. **Anti-Slop Copy Standard:** Zero em-dashes (`—`) in user-facing UI copy. Use hyphens, colons, or parentheses. Remove unsubstantiated superlatives in favor of sourced metrics.

---

## 2. MVP Scope & Boundaries

### Included in Full MVP
- **Brand & Visual Identity System:** Santa Rosa Arch horizontal logo, stacked logo, standalone mark, monochrome variants, favicon.
- **Global Shell:** Sticky responsive header (`CivicHeader.vue`) with navigation, emergency hotline flash ticker (`HotlineTicker.vue`), non-governmental disclaimer banner (`DisclaimerBanner.vue`), search dialog with global `Cmd+K`/`Ctrl+K` trigger, and accessible multi-column footer (`CivicFooter.vue`).
- **Dynamic Weather Ambience Hero:** Live Open-Meteo conditions for Santa Rosa (lat 14.3122, lon 121.1114) powering an ambient particle/cloud layer with draggable/throwable characters, fog veil, and dev-only scene switcher.
- **Homepage (10 Editorial Chapters):** Hero, Santa Rosa Today, Explore Santa Rosa Map Teaser, City Money, Building the City, From Bukol to Today History Teaser, Life & Heritage Collage, Laws & Services, Data Downloads, and Data Trust & Sources.
- **Complete Route Surface (14 Route Destinations):**
  1. `/` — Homepage
  2. `/explore` — Interactive 18-barangay topological map with 3 geographic zones
  3. `/barangays` & `/barangays/[slug]` — Complete directory of all 18 barangays with PSA census data
  4. `/government` — Executive, Legislative, Departments, Citizen's Charter, and transparency resources
  5. `/money` & `/money/budget` — City revenue data storytelling (₱6.251B FY2024, FY2016-2024 trends)
  6. `/projects` & `/projects/[slug]` — Capital projects with verified status, timeline, cost, and implementing office
  7. `/history` — Dedicated timeline route: *"From Bukol to Modern Santa Rosa"* (1571 to 2025)
  8. `/laws` & `/laws/[slug]` — City ordinances, resolutions, and executive orders with plain-language summaries
  9. `/services` — Task-oriented directory with outbound official government CTAs
  10. `/data` — Open civic data catalog with CSV/JSON/PDF download access
  11. `/sources` — Data trust hierarchy, verification registry table, and methodology
  12. `/about` — Dedicated About page: mission, non-government disclaimer, corrections mechanism, and team philosophy
  13. `/about/media` — Photography credits, licensing provenance (CC BY-SA / CC0), and author attribution
  14. `/search` — Static full-text search powered by Pagefind
- **SEO & Discoverability:** Dynamic `sitemap.xml`, `robots.txt`, OpenGraph metadata, JSON-LD structured data (`WebSite`, `GovernmentOrganization`, `Dataset`).
- **Accessibility & Motion:** WCAG 2.2 AA target, minimum 44×44px touch targets, full keyboard navigation, `prefers-reduced-motion` compliance across all animations.

### Excluded from MVP
- User authentication, profiles, accounts, or user-submitted comments.
- Political endorsements, candidate grading, or municipal performance rankings.
- AI chatbots, hallucinated summaries, or ungrounded synthetic text.
- External database backends (PostgreSQL, Supabase, Firebase) or runtime server APIs.
- Payment gateways or transaction handling.

---

## 3. Technology Stack & Architectural Constraints

| Layer | Technology | Version / Configuration | Purpose |
|---|---|---|---|
| **Framework** | Nuxt 4 | `compatibilityVersion: 4` | Static Site Generation (SSG) with Nitro static preset |
| **View Engine** | Vue 3 | Composition API (`<script setup lang="ts">`) | Reactive UI components |
| **Language** | TypeScript | Strict mode (`strict: true`) | Type safety across schemas, routes, and components |
| **Styling** | Tailwind CSS | v3.4+ with `@tailwindcss/typography` | Civic design tokens, chapter grounds, fluid responsive layout |
| **Data Validation** | Zod | v3.24+ | Schema enforcement for all JSON content in `data/` |
| **Search Engine** | Pagefind | v1.3+ | Post-build static full-text indexing over `dist/` |
| **Map Rendering** | MapLibre GL / SVG | v5.24.0 / SVG vector layer | 18-barangay topological civic navigation |
| **Icons** | Lucide Vue Next | v0.475.0 | Accessible, lightweight SVG iconography |
| **Testing** | Vitest & VTU | Vitest 2.1+, Vue Test Utils 2.4+, happy-dom | Unit tests, schema integrity, and component behavior |
| **Hosting** | Cloudflare Pages | `cloudflare-pages-static` | Edge static delivery (₱0/month, unlimited bandwidth) |

---

## 4. Brand & Design System

### Palette Tokens
```typescript
// tailwind.config.ts
colors: {
  'laguna-green': '#164A3D',     // Deep civic green (primary)
  'heritage-gold': '#D6A94B',    // Accent for historical markers, key stats, badges
  'rose-accent': '#C96A73',      // Subtle rose accent for emergency, highlights, tags
  'rose-accent-dark': '#9E4A55', // AA-compliant rose for small text on light grounds
  'laguna-blue': '#5E9FA5',      // Lakefront and data visualizations
  'parchment': '#F6F3EA',        // Warm editorial background
  'light-green': '#EBF2EE',      // Soft tinted ground for explore sections
  'charcoal': '#182421'          // High-contrast primary body text
}
```

### Typography
- **Primary Body & Interface:** `Inter`, `sans-serif`
- **Editorial Headings & Big Figures:** `Source Serif 4`, `serif`
- **Tabular Data, Hotlines & Years:** Monospace font stack (`ui-monospace`, `monospace`)

### Section Ground Classes
- `.section-parchment`: Warm editorial parchment ground (`#F6F3EA`)
- `.section-white`: Crisp white ground (`#FFFFFF`)
- `.section-deep-green`: Deep Laguna Green ground (`#164A3D`, text `#F6F3EA`)
- `.section-light-green`: Soft light green tint (`#EBF2EE`)

---

## 5. Current Codebase Gap Analysis

An audit of the current repository against `docs/20260917_151400-better-santa-rosa-city-full-mvp.md` identifies the following delta:

| Feature / Requirement | Current State | Required Full MVP Action |
|---|---|---|
| **Dedicated `/about` Route** | Missing (`pages/about/media.vue` exists, but no `pages/about/index.vue`). | Create `pages/about/index.vue` with mission, non-government disclaimer, data methodology, corrections submission guide, and media credits link. |
| **Dedicated `/history` Route** | Missing (History timeline only exists as a section on homepage). | Create `pages/history/index.vue` with full interactive editorial timeline (1571 to 2025), historical context, sources, and mobile vertical layout. |
| **Global `Cmd+K` / `Ctrl+K` Shortcut** | Header has button linking to `/search`, but no global keyboard event listener. | Add a global keyboard listener composable or layout integration that opens search from any page. |
| **Government Transparency & Charters** | `/government` covers Officials and Departments, but Citizen's Charter and Transparency Seal references are minimal. | Add Citizen's Charter links and Freedom of Information / Transparency resources section to `pages/government/index.vue`. |
| **Sitemap Completeness** | `scripts/generate-sitemap.mjs` is missing `/about`, `/about/media`, and `/history`. | Update `STATIC_ROUTES` in `generate-sitemap.mjs` and regenerate `public/sitemap.xml`. |
| **Brand Assets Structure** | Logo PNG is integrated into header; brand guidelines specify horizontal, stacked, and standalone marks. | Provide standalone brand mark components/assets in `public/images/brand/` and document them on `/about`. |
| **Corrections Mechanism** | Missing from UI. | Add a structured "Submit a Correction" component/section on `/about` (linking to GitHub issue template / mailto with prefilled subject). |

---

## 6. Route & Component Specifications

### 6.1. `/history` — From Bukol to Modern Santa Rosa
- **File:** `pages/history/index.vue`
- **Page Title:** `History of Santa Rosa City · From Bukol to Modern Day`
- **Content Source:** `data/city.json` (`timeline` array with 11 milestones: 1571, 1688, 1792, 1898, 1935, 1945, 1993, 2004, 2019, 2024, 2025).
- **Features:**
  - Hero header with historical overview ("From Barrio Bukol to Laguna's premier industrial and commercial hub").
  - Filterable/jumpable eras: *Spanish Era (1571-1898)*, *Revolution & Republic (1898-1945)*, *Modern Era (1993-2025)*.
  - Reusable `Timeline.vue` component with landmark media links.
  - Source citations linking to City Government historical records and the 2025 Voluntary Local Review.
  - SEO JSON-LD structured data (`Article` / `HistoricalEvent`).

### 6.2. `/about` — About Better Santa Rosa City & Corrections
- **File:** `pages/about/index.vue`
- **Page Title:** `About Better Santa Rosa City · Civic Transparency & Methodology`
- **Sections:**
  1. **Mission & Vision:** Making municipal records accessible, readable, and verifiable.
  2. **Non-Governmental Independence Disclaimer:** Clear statement that this site is not operated by or affiliated with the City Government of Santa Rosa.
  3. **Methodology & Data Principles:** Facts before opinions, source-first policy, definition preservation.
  4. **Corrections & Feedback:** Public guide on how citizens and researchers can submit corrections for outdated or incorrect records via GitHub or direct mail.
  5. **Quick Links:** Navigation to `/about/media`, `/sources`, `/data`, and official government portals.

### 6.3. `/government` — Citizen's Charter & Transparency Seal
- **File:** `pages/government/index.vue`
- **Additions:**
  - A new "Transparency & Citizen's Charter" section below Executive, Legislative, and Departments.
  - Links to official Anti-Red Tape Authority (ARTA) Citizen's Charters.
  - Full Disclosure Policy portal links (DILG FDPP portal for Santa Rosa).
  - Explicit reminder that transactions occur exclusively on official city platforms.

### 6.4. Global Search Keyboard Shortcut (`Cmd+K` / `Ctrl+K`)
- **Files:** `composables/useSearchShortcut.ts` or `layouts/default.vue`
- **Behavior:**
  - Pressing `Cmd+K` (macOS) or `Ctrl+K` (Windows/Linux) or `/` anywhere on the site navigates to `/search` (focusing the search input) or opens the search interface.
  - Visible keyboard badge (`⌘K`) in `CivicHeader.vue` and `HeroSearch.vue`.

### 6.5. Sitemap & Verification Pipeline
- **File:** `scripts/generate-sitemap.mjs`
- **Changes:**
  - Add `/about`, `/about/media`, `/history` to `STATIC_ROUTES`.
  - Ensure `pnpm build:prod` outputs all routes to `public/sitemap.xml` and prerenders them into `dist/`.

---

## 7. Quality Assurance & Acceptance Criteria

### Functional QA
- All 14 routes compile, prerender without SSR hydration errors, and return status 200.
- All internal navigation links (`CivicHeader`, `CivicFooter`, contextual CTA buttons) resolve to valid routes.
- Emergency hotline ticker continues scrolling at banner top, tap-to-call links work, and motion pauses on hover/focus.
- Weather banner renders across all 8 WMO conditions without layout shifts or console errors.
- Pagefind search index covers all prerendered static pages.

### Content & Attribution QA
- Zero em-dashes (`—`) in user-facing UI copy.
- Every dataset page links to its primary source and shows an ISO `lastVerified` date.
- All media assets have active attribution on `/about/media`.
- Independent disclaimer is permanently visible in the footer and disclaimer banner.

### Accessibility & Performance QA
- Touch targets for all interactive links and buttons are at least 44×44px.
- Heading hierarchy follows valid semantic sequence (`h1` → `h2` → `h3`).
- All animations are suppressed when `prefers-reduced-motion: reduce` is active.
- Mobile viewport test (320px, 375px, 390px) verifies zero horizontal page scrolling.
- Full test suite passes: `pnpm vitest run` (100% pass) and `pnpm nuxt typecheck` clean.
