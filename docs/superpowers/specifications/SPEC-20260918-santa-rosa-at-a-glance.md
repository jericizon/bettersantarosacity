# Specification: Rework "Santa Rosa Now" into "Santa Rosa at a Glance"

**Document ID:** `SPEC-20260918-santa-rosa-at-a-glance`  
**Date:** 2026-09-18  
**Type:** Major Editorial & Architecture Update (UPDATE / REFACTOR)  
**Status:** Approved for Implementation Planning  
**Target Application:** Better Santa Rosa City (`https://bettersantarosacity.pages.dev/`)  
**Repository Working Branch:** `feat/mvp-scaffold`

---

## 1. Executive Summary & Context

### 1.1 Product Statement
Better Santa Rosa City is an independent, community-maintained civic information portal that makes public information about Santa Rosa, Laguna easier to find, understand, and verify.

### 1.2 Core Product Principles
- **Core User Journey:** `DISCOVER → UNDERSTAND → VERIFY`
- **Identity & Legal Independence:** The site is explicitly NOT the official City Government website and is not operated by or affiliated with the City Government of Santa Rosa.
- **Editorial Feel:** The homepage feels like a modern civic-tech and editorial/data-journalism publication, anchored in Santa Rosa's heritage (the Santa Rosa Arch / Bantayang Bato) and Laguna Lake geography.
- **Source-First Integrity:** Every material claim and statistic cites its original source, publication date, and verification timestamp. No unverified assertions, no fabricated facts, and no speculative claims.

---

## 2. Objective & Rationale for Rework

### 2.1 The Problem
The current homepage Chapter 3, titled "City Updates & Conditions" / "Santa Rosa Now", presents a "Recent City Updates" feed displaying three city advisory cards (traffic rerouting, monsoon monitoring, and local tax deadline reminder).

While these advisory cards were created as plausible seed content citing `santarosacity.gov.ph`, their presence on the homepage introduces a serious user perception problem:
1. **Implied Real-Time Feed:** A homepage feed titled "Recent City Updates" strongly implies that Better Santa Rosa operates a live or continuously synchronized news/announcement feed from the city government.
2. **Maintenance Reality:** Better Santa Rosa is a 100% static, community-maintained civic information portal. It does not possess an automated scraping pipeline or official municipal API feed for daily news or breaking announcements.
3. **Trust Risk:** Better Santa Rosa should never compete with Facebook or official city communication channels on speed. Presenting seed updates as if they are fresh or live announcements violates the site's source-first commitment and risks misleading residents.

### 2.2 The Solution: "Santa Rosa at a Glance"
Replace the homepage "City Updates & Conditions" / "Santa Rosa Now" section with a stable, highly useful editorial introduction to the city: **"SANTA ROSA AT A GLANCE"**.

This new section:
- Answers the fundamental question: *"What is Santa Rosa?"* in 5 to 10 seconds.
- Presents verified, immutable civic facts about Santa Rosa's geography, administrative structure, and history.
- Serves as the primary editorial gateway connecting the user directly into the site's major exploration pillars (`/barangays`, `/places`, `/explore`, `/history`).
- Does NOT look like a generic SaaS or dashboard card grid; instead, it adopts an editorial magazine and data-journalism aesthetic with high typographic contrast and generous whitespace.
- Moves the dynamic Open-Meteo weather component into an independent, clearly identified "Current Weather" chapter, completely decoupled from municipal advisories.
- Retains the underlying `/updates` directory (`/updates`, `/updates/[slug]`) and navigation links for future curated official-source disclosures without displaying an active feed on the homepage.

---

## 3. Homepage Information Architecture After Rework

The homepage transitions from the previous 12-chapter layout to a refined 12-chapter narrative sequence that cleanly separates **stable civic identity**, **geographic exploration**, **current weather observations**, and **deep public records**:

```
Chapter 1: HERO
   ↳ Search, civic purpose, and ambient weather background

Chapter 2: SANTA ROSA AT A GLANCE (NEW)
   ↳ Quick factual identity: 18 barangays, 5,543 ha, 2004 cityhood, 3 lakeshore barangays
   ↳ "Explore the City" editorial navigation: Barangays, Places, Map, History

Chapter 3: EXPLORE SANTA ROSA
   ↳ Interactive MapLibre / SVG map explorer with barangay selection

Chapter 4: CURRENT WEATHER (DECOUPLED)
   ↳ Clean, standalone Open-Meteo weather observation & 3-day forecast
   ↳ Explicitly marked as independent meteorological data, not municipal advisory

Chapter 5: CITY FINANCES
   ↳ Verified revenue trends (COA/BLGF), revenue vs. budget disclaimer, and chart

Chapter 6: BUILDING THE CITY
   ↳ Tracked municipal and national public infrastructure projects

Chapter 7: FROM BUKOL TO TODAY
   ↳ Historical timeline from 1571 lakeside barrio to modern lone congressional district

Chapter 8: SANTA ROSA LIFE & HERITAGE
   ↳ Asymmetric photo collage and direct entry point to /places

Chapter 9: LAWS & DECISIONS
   ↳ Recent city ordinances and legislative issuances

Chapter 10: SERVICES
   ↳ Categorized municipal services and Citizen's Charter guidance

Chapter 11: DATA & DOWNLOADS
   ↳ Open datasets catalog with mirrored JSON and generated CSV downloads

Chapter 12: DATA TRUST
   ↳ Dataset freshness registry, methodology link, and independent project disclaimer
```

### Ground Tone Alternation Pattern
To ensure visual separation and rhythm without visual monotony, full-bleed ground tones alternate across all 12 chapters:

| Chapter | Section | Background Tone Class | Border / Division |
|---|---|---|---|
| 1 | Hero | `section-parchment` + deep-green banner | Natural hero boundary |
| 2 | Santa Rosa at a Glance | `section-white` | `border-b border-charcoal/10` |
| 3 | Explore Santa Rosa | `section-light-green` | `border-b border-charcoal/10` |
| 4 | Current Weather | `section-white` | `border-b border-charcoal/10` |
| 5 | City Finances | `section-parchment` | `border-b border-charcoal/10` |
| 6 | Building the City | `section-white` | `border-b border-charcoal/10` |
| 7 | From Bukol to Today | `section-deep-green` | Full-bleed dark transition |
| 8 | Santa Rosa Life & Heritage | `section-parchment` | `border-b border-charcoal/10` |
| 9 | Laws & Decisions | `section-white` | `border-b border-charcoal/10` |
| 10 | Services | `section-white` | Sub-chapter transition |
| 11 | Data & Downloads | `section-parchment` | `border-b border-charcoal/10` |
| 12 | Data Trust | `section-white` | `border-b border-charcoal/10` |

---

## 4. Section Specification: "Santa Rosa at a Glance"

### 4.1 Section Identity & Typography
- **HTML Container:** `<section ref="glanceSection" aria-labelledby="glance-heading" class="w-full section-white py-20 sm:py-28 lg:py-32 border-b border-charcoal/10">`
- **Eyebrow:**
  - Text: `SANTA ROSA AT A GLANCE`
  - Style: `text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent-dark inline-flex items-center gap-2`
  - Motif: Includes the existing small `RoseMotif` or `BrandMark` subtle icon.
- **Heading:**
  - Text: `Santa Rosa at a Glance`
  - Element: `<h2 id="glance-heading" class="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-laguna-green leading-tight">`
- **Description:**
  - Text: `A quick look at the city: its people, places, geography and history.`
  - Style: `text-base sm:text-lg text-charcoal/75 leading-relaxed max-w-2xl`
  - Rule: Zero em-dashes (`—`) in UI copy; use colon (`:`) or middle dot (`·`).

### 4.2 Primary Content: Four Verified Editorial Statistics
All statistics must be derived from existing verified datasets in `data/city.json` and `data/barangays.json`. No figures may be invented or hard-coded without source attribution.

```
+-----------------------------------------------------------------------------------+
|  18                         5,543 ha                     2004                     3                       |
|  BARANGAYS                  LAND AREA                    CITYHOOD                 LAKESHORE BARANGAYS     |
|  Subdivisions across city   Total municipal area         Plebiscite (RA 9264)     Aplaya, Sinalhan, Caingin|
|  Source: City Govt About Us Source: City Govt About Us   Source: RA No. 9264      Source: City Govt About Us|
+-----------------------------------------------------------------------------------+
```

#### Detailed Stat Contracts:
1. **Barangays:**
   - Display Value: `18` (animated via `CountUp :end="18"`)
   - Label: `BARANGAYS` (`text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-charcoal/80`)
   - Context Note: `18 administrative barangays across the city`
   - Source: `City Government of Santa Rosa · About Us`
   - Raw Data Source: `cityData.barangayCount`
2. **Land Area:**
   - Display Value: `5,543 ha` (animated via `CountUp :end="5543" suffix=" ha"`)
   - Label: `LAND AREA`
   - Context Note: `Total municipal territory in Laguna`
   - Source: `City Government of Santa Rosa · About Us`
   - Raw Data Source: `cityData.landAreaHa`
3. **Cityhood:**
   - Display Value: `2004` (rendered static; never format as a currency or comma-separated number)
   - Label: `CITYHOOD`
   - Context Note: `Chartered as a city under Republic Act No. 9264`
   - Source: `Republic Act No. 9264 (July 10, 2004)`
   - Raw Data Source: `cityData.cityhoodYear`
4. **Lakeshore Barangays:**
   - Display Value: `3` (animated via `CountUp :end="3"`)
   - Label: `LAKESHORE BARANGAYS`
   - Context Note: `Aplaya, Sinalhan, and Caingin along Laguna de Bay`
   - Source: `City Government of Santa Rosa · About Us`
   - Raw Data Source: Computed from `barangaysData.filter(b => b.group === 'Laguna Lake').length`

#### Design & Typography Guidelines for Statistics:
- **Display Scale:** Numbers rendered in `font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-laguna-green tracking-tight leading-none`.
- **Labels:** Subordinated uppercase typography with wide tracking (`tracking-[0.18em]`).
- **Dividers:** Clean editorial rules (`border-y border-charcoal/10` or vertical dividing rules on `lg` breakpoints) rather than heavy card borders.
- **Anti-Slop Prohibitions:**
  - Strictly NO neon glow, gradient backgrounds, or glassmorphism.
  - Strictly NO drop-shadow card spam.
  - Strictly NO icon-bloat inside statistic containers.
  - Feel like a respected data-journalism piece (e.g. *The Economist*, *Financial Times*, *ProPublica*).

### 4.3 Subtle Santa Rosa Visual Identity Element
- In keeping with Better Santa Rosa's brand anchor, the section incorporates a subtle visual reference to the **Santa Rosa Arch (Bantayang Bato)** or **Laguna Lake contour**.
- Implementation: Reuses `components/brand/BrandMark.vue` or a delicate SVG arch motif with `monochrome` styling, positioned with low opacity (`opacity-10` to `opacity-15`) as an editorial watermark or header accent.
- Accessibility: Marked with `aria-hidden="true"` so screen readers ignore decorative vector elements.

### 4.4 Explore the City Navigation Block
Positioned directly below the statistics grid, this block guides residents and visitors into the site's primary discovery destinations:

- **Block Heading:**
  - Eyebrow: `EXPLORE THE CITY` (`text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent-dark`)
  - Title: `Explore Santa Rosa by Area, Place & History` (`font-serif text-2xl sm:text-3xl font-bold text-laguna-green`)
- **Navigation Cards / Panels (4 Pillars):**
  1. **Barangays:**
     - Title: `Barangays`
     - Description: `Explore Santa Rosa's 18 barangays.`
     - Route: `/barangays`
     - Action Label: `Browse barangays →`
  2. **Places & Landmarks:**
     - Title: `Places & Landmarks`
     - Description: `Discover notable places, landmarks and attractions around the city.`
     - Route: `/places`
     - Action Label: `Explore places →`
     - Note: Civic discovery only; strictly NO "Top 10" or tourism rating lists.
  3. **City Map:**
     - Title: `City Map`
     - Description: `See Santa Rosa by barangay and geographic area.`
     - Route: `/explore` (with canonical `/map` redirect support)
     - Action Label: `Open map explorer →`
  4. **History & Heritage:**
     - Title: `History & Heritage`
     - Description: `Trace Santa Rosa from Barrio Bukol to the modern city.`
     - Route: `/history`
     - Action Label: `Read city history →`

#### Interactive & Accessibility Standards for Explore Cards:
- Grid layout: 1 column on mobile, 2 columns on tablet (`sm:`), 4 columns on desktop (`lg:`).
- Touch target: Whole card or primary link exceeds 44×44px interactive minimum.
- Focus states: Prominent, high-contrast focus rings (`focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-laguna-green`).
- Hover states: Subtle elevation (`hover:border-laguna-green/40 hover:shadow-md transition-all duration-200`).

---

## 5. Current Weather Chapter Specification

### 5.1 Decoupled Weather Presentation
The existing `CivicWeatherToday.vue` component is preserved in full and extracted from the retired Santa Rosa Now section into its own dedicated homepage chapter (Chapter 4).

### 5.2 Specifications:
- **Location:** Positioned as Chapter 4, immediately following Chapter 3 ("Explore Santa Rosa") and preceding Chapter 5 ("City Finances").
- **Ground Tone:** Full-bleed `section-white py-16 sm:py-20 lg:py-24 border-b border-charcoal/10`.
- **Chapter Header:**
  - Eyebrow: `LOCAL WEATHER` (`text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent-dark`)
  - Title: `Santa Rosa Weather Today` (`font-serif text-2xl sm:text-3xl font-bold text-laguna-green`)
  - Description: `Current meteorological conditions and 3-day forecast from Open-Meteo.`
- **Attribution & Disclaimer:**
  - Clearly identifies Open-Meteo API as the provider (CC BY 4.0).
  - Explicitly states: *"Current conditions, not a city government advisory."*
  - Displays the runtime `updatedAt` timestamp (e.g. `Updated 2:15 PM`).

---

## 6. Route & City Updates Handling

### 6.1 Homepage Updates Removal
- `components/civic/SantaRosaNow.vue` is retired and removed from `pages/index.vue`.
- The three seed city update cards are completely removed from the homepage.
- No dynamic announcement feed, placeholder text, or "advisories unavailable" widgets will be rendered on the homepage.

### 6.2 Underlying Routes Retained
- The `/updates` index route (`pages/updates/index.vue`) and dynamic detail route (`pages/updates/[slug].vue`) remain active.
- `data/updates.json` remains validated by `CityUpdateSchema` in `data-integrity.spec.ts`.
- Navigation links in `CivicHeader.vue` (under Government > City Updates) and `CivicFooter.vue` remain active and functional.
- Sitemap generator (`scripts/generate-sitemap.mjs`) continues to include `/updates` and its slugs.

### 6.3 `/map` Canonical Redirect
- To support users following references to `/map`, `public/_redirects` will be updated to include `/map /explore 301`.
- The internal explore card links directly to the canonical `/explore` route.

---

## 7. Accessibility, Performance & Quality Standards

### 7.1 Accessibility Requirements
- **Semantic Structure:** Semantic `<section>`, proper heading progression (`h2` for chapter titles, `h3` for stat cards and explore cards).
- **Contrast Ratios:**
  - `text-laguna-green` (#164A3D) on white: 9.4:1 (exceeds WCAG AAA 7:1)
  - `text-charcoal` (#182421) on white: 14.8:1 (exceeds WCAG AAA)
  - `text-rose-accent-dark` (#9E4A55) on white: 5.3:1 (exceeds WCAG AA 4.5:1)
- **Reduced Motion:** All `useScrollReveal` transitions and `CountUp` animations respect `prefers-reduced-motion: reduce`.
- **Screen Reader Support:** All decorative icons (`RoseMotif`, `BrandMark`, `ArrowRight`) carry `aria-hidden="true"`.

### 7.2 Zero Em-Dash Standard
All user-facing copy in new components must strictly avoid em-dashes (`—`). Use colons (`:`), hyphens (`-`), or middle dots (`·`) instead.

### 7.3 Performance & Static Build Constraints
- 100% static generation via `nuxt generate`. Zero runtime database, zero SSR server requirements.
- Zero added external dependencies or bundle overhead.
- Target Lighthouse performance score: 95+.

---

## 8. Verification & Acceptance Criteria

1. **Section Heading & Copy:**
   - Section displays eyebrow `SANTA ROSA AT A GLANCE`.
   - Heading displays `Santa Rosa at a Glance`.
   - Description matches `A quick look at the city: its people, places, geography and history.`
2. **Four Verified Statistics:**
   - `18` Barangays (`cityData.barangayCount`)
   - `5,543 ha` Land area (`cityData.landAreaHa`)
   - `2004` Cityhood (`cityData.cityhoodYear`)
   - `3` Lakeshore barangays (Aplaya, Sinalhan, Caingin)
   - Every stat renders its verified source attribution.
3. **Explore Navigation:**
   - Displays all 4 explore destinations: Barangays (`/barangays`), Places & Landmarks (`/places`), City Map (`/explore`), History & Heritage (`/history`).
   - Touch targets meet or exceed 44×44px.
4. **Decoupled Weather Chapter:**
   - Renders `CivicWeatherToday` with Open-Meteo attribution and runtime timestamp.
   - Positioned as standalone Chapter 4.
5. **No Homepage City Updates Feed:**
   - Homepage contains zero city advisory cards, zero traffic references, and zero real-time claims.
6. **Regression Protection:**
   - All 134+ existing unit tests pass.
   - `pnpm typecheck` returns zero errors.
   - `pnpm build:prod` generates cleanly with 53 sitemap URLs and Pagefind indexing.
   - Ground tones alternate cleanly across all 12 chapters.
