# Specification: Better Santa Rosa City — UI/UX Enhancement MVP

## 1. Assumptions Surfaced

1. **Static-First Civic Architecture Preserved:** The core zero-database static site architecture (Nuxt 4 + static JSON in `data/` + Pagefind 1.3+, ₱0/month runtime cost on Cloudflare Pages) established in the initial MVP is strictly preserved. No backend databases, server-side APIs, or CMS runtimes will be introduced.
2. **Framework & Dependencies:** Nuxt 4 (compatibilityVersion: 4), Vue 3 (`<script setup lang="ts">`), Tailwind CSS 3.4+ with `@tailwindcss/typography`, Lucide Vue Next, Zod 3.24+, Vitest 2.1+, and Vue Test Utils 2.4+.
3. **No Heavy Animation Frameworks:** Heavy 3D or animation runtimes (GSAP, Three.js, Lottie) are strictly prohibited. All animations, reveals, and transitions rely on lightweight CSS transitions/keyframes and native browser `IntersectionObserver` composables (`useScrollReveal.ts`, `useReducedMotion.ts`) to maintain Lighthouse 90+, LCP < 2.5s, CLS < 0.1, and INP < 200ms.
4. **Media Licensing Compliance:** 100% of photographic assets must be legally cleared (Wikimedia Commons CC BY-SA 4.0 / Public Domain / CC0) of Santa Rosa, Laguna. All media metadata is tracked in `data/media.json` and credited via `MediaCredit.vue` and the public `/about/media` page. No AI-hallucinated landmark images or uncredited web scraping.
5. **Cadastral & Map Integrity:** The 18-barangay SVG map (`CityMapSvg.vue`, `MapExplorer.vue`) is a topological civic navigation tool. It must always carry an explicit disclaimer: *"Simplified map for information purposes. Not official cadastral survey data."*
6. **Strict Non-Governmental Independence:** The platform is an independent community project and must never be presented as an official municipal portal or official seal. Disclaimers and source badges must clearly distinguish primary official records (COA, PSA, DBM, City Ordinances) from community curation.
7. **Anti-Slop Copy & Typography Rule:** Zero em-dashes (`—`) in user-facing UI copy per taste guidelines. Use hyphens, colons, or parentheses. Superlatives lacking verifiable methodology (e.g., "Luzon's richest city outside Metro Manila") are removed in favor of precise, sourced statements (e.g., "FY2024 Verified City Revenue: ₱6.251B").

---

## 2. Objective & Creative Vision

Transform the current MVP from a functional civic-data portal into a **polished civic-tech / editorial public-information platform** for Santa Rosa City, Laguna.

### Design Read & Creative Tone
* **Design Read:** Civic-information publication for Santa Rosa residents, researchers, and citizens, with an editorial data-journalism language, leaning toward custom Tailwind civic design tokens + Source Serif 4 + restrained CSS/IntersectionObserver motion.
* **Core Blend:** Modern Civic Technology + Editorial Data Journalism + Santa Rosa Heritage.
* **Dials:**
  * `DESIGN_VARIANCE: 6` (Structured editorial layout with varied media aspect ratios and asymmetric collage)
  * `MOTION_INTENSITY: 4` (Fluid CSS transitions, subtle count-ups, sticky nav compression, instant under `prefers-reduced-motion`)
  * `VISUAL_DENSITY: 4` (Airy, magazine-like section pacing with 96px–144px vertical chapter breaks)
* **What it MUST feel like:**
  * Trustworthy, local, editorial, spacious, clear, and unmistakably Santa Rosa, Laguna.
* **What it MUST NOT feel like:**
  * A generic government bureaucracy portal
  * A corporate SaaS dashboard
  * A startup landing page
  * A tourism brochure
  * A continuous wall of cards with 10–20px spacing

---

## 3. Capability Map & Chapter Architecture

### Capability Map

| Module ID | Responsibility | Depends On | Deliverables |
|---|---|---|---|
| `layout-shell-architecture` | Full-bleed chapter layout support in `layouts/default.vue`, sticky `CivicHeader`, reorganized `CivicFooter`, reusable `SectionHeader` | — | `layouts/default.vue`, `components/civic/CivicHeader.vue`, `components/civic/CivicFooter.vue`, `components/editorial/SectionHeader.vue` |
| `design-system-tokens` | Civic color palette tokens, section background classes (`.section-parchment`, `.section-white`, `.section-deep-green`, `.section-light-green`), container width tiers, restrained border radii, abstract rose emblem | — | `tailwind.config.ts`, `assets/css/main.css`, `public/images/bettersantarosacity-logo.svg` |
| `hero-civic-anchor` | Editorial civic hero with real landmark imagery, subtle map overlay, prominent search bar with rotating hints & ⌘K badge, quick filters | `layout-shell-architecture`, `design-system-tokens` | `components/civic/HeroSearch.vue`, `pages/index.vue` (Hero chapter) |
| `editorial-stats-today` | Open typographic layout for 4 key city facts (18 barangays, 5,543 ha, 2004 cityhood, 3 lakefront barangays) with count-up animation | `design-system-tokens` | `components/data/StatCard.vue`, `pages/index.vue` (Santa Rosa Today chapter) |
| `signature-map-explorer` | Interactive 18-barangay SVG map with 3 geographic zones, active barangay detail panel, accessible dropdown, cadastral disclaimer | `design-system-tokens` | `components/civic/CityMapSvg.vue`, `components/civic/MapExplorer.vue`, `pages/index.vue` (Explore chapter) |
| `money-data-storytelling` | Data journalism narrative ("How city revenue has changed"), big numbers, revenue trend chart, source & methodology indicators | `design-system-tokens` | `components/money/BudgetChart.vue`, `pages/index.vue` (City Money chapter) |
| `projects-building-city` | Editorial project stories with status indicators, implementing office, disclosed budget, source verification | `design-system-tokens` | `components/projects/ProjectCard.vue`, `pages/index.vue` (Projects chapter) |
| `history-bukol-timeline` | Deep Laguna Green editorial chapter, vertical timeline from 1571 to today paired with landmark photography, neutral factual copy | `design-system-tokens` | `components/civic/Timeline.vue`, `pages/index.vue` (History chapter) |
| `life-heritage-collage` | Asymmetrical editorial media strip with curated local photography and subtle image attribution | `design-system-tokens` | `components/civic/Collage.vue`, `pages/index.vue` (Heritage chapter) |
| `laws-services-downloads-trust` | Refactored Laws, Services, Data Downloads, and Data Trust chapters with explicit source badges and freshness stamps | `design-system-tokens` | `components/data/DataFreshness.vue`, `pages/index.vue` (Reference chapters) |
| `content-pages-alignment` | Visual consistency across subpages (`/explore`, `/barangays`, `/money`, `/projects`, `/government`, `/laws`, `/services`, `/data`, `/sources`, `/about/media`) | All modules | Subpage templates |
| `qa-accessibility-perf-validation` | Comprehensive test suite, responsive validation (320px–1440px), WCAG 2.1 AA check, static build & Pagefind index | All modules | `tests/unit/*.spec.ts`, Lighthouse 90+ |

**Build Order:** `design-system-tokens` → `layout-shell-architecture` → `hero-civic-anchor` → `editorial-stats-today` → `signature-map-explorer` → `money-data-storytelling` → `projects-building-city` → `history-bukol-timeline` → `life-heritage-collage` → `laws-services-downloads-trust` → `content-pages-alignment` → `qa-accessibility-perf-validation`.

---

## 4. Homepage Chapter Sequence & Background Alternation

The homepage ceases to be a single narrow column of cards. Instead, it renders as 10 distinct full-width chapters with generous vertical separation:

```text
┌────────────────────────────────────────────────────────────┐
│ HEADER — Sticky Civic Header (64-72px, logo + nav + ⌘K)   │
├────────────────────────────────────────────────────────────┤
│ 1. HERO — Warm Parchment                                   │
│    Local landmark photography + map overlay + search bar   │
├────────────────────────────────────────────────────────────┤
│ 2. SANTA ROSA TODAY — Clean White                          │
│    Open typographic statistics with count-up animations    │
├────────────────────────────────────────────────────────────┤
│ 3. EXPLORE SANTA ROSA — Light Laguna Green Tint            │
│    18-barangay interactive map + selected barangay panel   │
├────────────────────────────────────────────────────────────┤
│ 4. CITY MONEY — Warm Parchment                             │
│    Data journalism narrative on revenue + visual trend     │
├────────────────────────────────────────────────────────────┤
│ 5. BUILDING THE CITY — Clean White                         │
│    Editorial project stories with status & source tracking │
├────────────────────────────────────────────────────────────┤
│ 6. FROM BUKOL TO TODAY — Deep Laguna Green                 │
│    Historical vertical timeline paired with landmark media │
├────────────────────────────────────────────────────────────┤
│ 7. SANTA ROSA LIFE & HERITAGE — Warm Parchment             │
│    Asymmetrical editorial photo strip & cultural history   │
├────────────────────────────────────────────────────────────┤
│ 8. LAWS & SERVICES — Clean White                           │
│    Ordinances with verified labels + official shortcuts    │
├────────────────────────────────────────────────────────────┤
│ 9. DATA & DOWNLOADS — Warm Parchment                       │
│    Open data catalog + verified download links             │
├────────────────────────────────────────────────────────────┤
│ 10. DATA TRUST & SOURCES — Light Neutral                   │
│     Dataset verification registry + methodology + disclaimer│
├────────────────────────────────────────────────────────────┤
│ FOOTER — Charcoal Ground                                   │
│ Reorganized navigation, legal distinction, credits         │
└────────────────────────────────────────────────────────────┘
```

### Spacing Scale System
- **Desktop (>= 1024px):** `py-24 sm:py-28 lg:py-32` (96px–144px vertical chapter separation).
- **Tablet (768px - 1023px):** `py-18 md:py-24` (72px–96px).
- **Mobile (< 768px):** `py-14 sm:py-16` (56px–80px).
- **Container Widths:**
  - Standard container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` (1200px–1280px).
  - Editorial text measure: `max-w-3xl` (600px–760px).
  - Hero container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` (1200px–1400px).

---

## 5. Visual Design System & Design Tokens

### Color Palette

| Token Name | Hex Code | Role & Semantic Usage |
|---|---|---|
| `laguna-green` | `#164A3D` | Primary civic brand identity, major titles, dark section backgrounds, primary buttons |
| `rose-accent` | `#C96A73` | Decorative accents, active states, map highlights, timeline markers |
| `rose-accent-dark` | `#9E4A55` | Small text links and eyebrows on parchment (5.3:1 contrast ratio, WCAG AA compliant) |
| `laguna-blue` | `#5E9FA5` | Lakefront barangay markers, water overlays, geographic secondary accents |
| `heritage-gold` | `#D6A94B` | Historic landmarks, timeline era highlights, footer headings |
| `parchment` | `#F6F3EA` | Warm editorial backgrounds, card fills in dark sections, hero ground |
| `charcoal` | `#182421` | High-contrast body typography (>= 12:1 contrast against parchment/white), footer ground |
| `light-green` | `#EBF2EE` | Soft civic background tint for Map Explorer chapter |

### Typography Scale

- **Sans:** `Inter, Manrope, sans-serif` for interface labels, data points, buttons, navigation, and body copy.
- **Serif:** `Source Serif 4, Georgia, serif` for editorial headlines, chapter titles, big numerals, and quotes.
- **Hierarchy:**
  - Hero Headline: `text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-laguna-green leading-[1.1]`
  - Chapter Heading: `text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight`
  - Subheading / Lead: `text-lg sm:text-xl text-charcoal/75 leading-relaxed max-w-3xl`
  - Body Text: `text-base text-charcoal/80 leading-relaxed max-w-[65ch]`
  - Eyebrow / Meta: `text-xs font-semibold uppercase tracking-[0.2em]`

### Border Radius Discipline
- Large media containers: `rounded-2xl` (16px–24px)
- Cards & panels: `rounded-xl` (12px–16px)
- Interactive buttons: `rounded-lg` (8px–12px)
- Search inputs & fields: `rounded-xl` (10px–14px)
- Badges & pills: `rounded-full` (pills strictly reserved for status tags and search pills, not cards)

---

## 6. Component Architecture & Reusability

```text
components/
├── civic/
│   ├── CivicHeader.vue          # Sticky header with compressed scroll state, logo, nav, ⌘K trigger
│   ├── CivicFooter.vue          # Editorial footer with distinct disclaimer, sources, media links
│   ├── HeroSearch.vue           # Prominent search bar with rotating placeholders, ⌘K badge, quick pills
│   ├── MapExplorer.vue          # Split-view interactive 18-barangay map with active detail card
│   ├── CityMapSvg.vue           # Custom SVG topological map with 3 geographic zones & lakefront
│   ├── Timeline.vue             # Vertical historical timeline paired with landmark photography
│   ├── Collage.vue              # Asymmetrical editorial media strip with photo credits
│   ├── CountUp.vue              # Viewport-triggered numeric count-up with reduced-motion fallback
│   └── RoseMotif.vue            # Abstract geometric rose vector accent
├── editorial/
│   └── SectionHeader.vue        # Unified chapter heading component (eyebrow, title, description, theme)
├── data/
│   ├── StatCard.vue             # Open typographic stat display with CountUp animation
│   ├── SourceBadge.vue          # Tier 1 official vs community source indicator
│   ├── SourceCitation.vue       # Standardized source citation link with external arrow
│   ├── LastVerified.vue         # Verification date stamp
│   └── DataFreshness.vue        # Dataset freshness table
├── money/
│   └── BudgetChart.vue          # Revenue comparison bar chart with data labels
└── projects/
    ├── ProjectCard.vue          # Sourced project story card with category, status, and budget
    └── ProjectStatus.vue        # Accessible status badge (Planned, Ongoing, Completed, etc.)
```

### Reusable `<SectionHeader />` Contract
```vue
<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  theme?: 'light' | 'dark'
}>()
</script>
```

---

## 7. Commands

```bash
# Verify typecheck
pnpm run typecheck

# Run full Vitest unit & regression suite
pnpm test:run

# Build static site with data sync and sitemap generation
pnpm run build:prod

# Verify Pagefind search index
pnpm run index:search
```

---

## 8. Code Style & Conventions

```vue
<!-- components/editorial/SectionHeader.vue -->
<script setup lang="ts">
import RoseMotif from '~/components/civic/RoseMotif.vue'

withDefaults(defineProps<{
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  theme?: 'light' | 'dark'
}>(), {
  align: 'left',
  theme: 'light'
})
</script>

<template>
  <div
    :class="[
      'max-w-3xl space-y-3',
      align === 'center' ? 'mx-auto text-center' : 'text-left'
    ]"
  >
    <div
      v-if="eyebrow"
      :class="[
        'inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]',
        theme === 'dark' ? 'text-heritage-gold' : 'text-rose-accent-dark'
      ]"
    >
      <RoseMotif :size="14" :class="theme === 'dark' ? 'text-heritage-gold' : 'text-rose-accent'" />
      <span>{{ eyebrow }}</span>
    </div>

    <h2
      :class="[
        'font-serif text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl leading-tight',
        theme === 'dark' ? 'text-parchment' : 'text-laguna-green'
      ]"
    >
      {{ title }}
    </h2>

    <p
      v-if="description"
      :class="[
        'text-base leading-relaxed sm:text-lg',
        theme === 'dark' ? 'text-parchment/80' : 'text-charcoal/75'
      ]"
    >
      {{ description }}
    </p>
  </div>
</template>
```

---

## 9. Testing Strategy

1. **Unit & Component Testing (Vitest + Vue Test Utils + Happy DOM):**
   - Verify `SectionHeader.vue` renders light and dark themes, text alignment, and optional props.
   - Verify `StatCard.vue` provides open typographic presentation with `numericValue` count-up contracts.
   - Verify `MapExplorer.vue` and `CityMapSvg.vue` display the cadastral disclaimer and emit zone selections.
   - Verify `pages/index.vue` renders all 10 chapters with their respective background tokens and titles.
   - Verify history timeline removes unverified superlatives ("richest city outside Metro Manila") and presents source-backed facts.
2. **Regression Coverage:**
   - All existing 27 test files must pass with zero regressions.
   - SEO metadata, sitemap generation, and Pagefind indexing must remain intact.
3. **Accessibility Verification:**
   - Test `prefers-reduced-motion` compliance across all animated components.
   - Ensure all interactive controls have visible 2px focus rings (`focus-visible:outline-laguna-green`).
   - Touch targets must be >= 44x44px.

---

## 10. Boundaries

### Always Do:
- Work and commit on `feat/mvp-scaffold` or dedicated feature branches.
- Run `pnpm test:run` and `pnpm run typecheck` before finishing.
- Maintain source attribution on every statistic, budget figure, and project.
- Respect `prefers-reduced-motion: reduce`.
- Use legally cleared Wikimedia Commons assets with records in `data/media.json`.

### Ask First:
- Modifying underlying government JSON data structure in `data/*.json`.
- Adding new npm dependencies.
- Altering core URL slugs or sitemap paths.

### Never Do:
- Never start application servers, dev servers (`pnpm dev`), or watch processes.
- Never commit or push directly to `main` or `master`.
- Never invent government facts, budgets, laws, or project statuses.
- Never use AI to generate fake municipal seals or synthetic landmarks.
- Never use em-dashes (`—`) in user-facing UI copy.

---

## 11. Success Criteria

1. **Chapter Distinctness:** The homepage clearly presents 10 editorial chapters with distinctive background tones (`parchment`, `white`, `deep-green`, `light-green`) and generous vertical spacing (96px–144px desktop).
2. **Card Reduction:** Statistics ("Santa Rosa Today") are rendered with open editorial typography, not boxed inside generic dashboard cards.
3. **Search Prominence:** The Hero chapter features an unmissable search experience with rotating placeholders, ⌘K trigger, and quick filter pills.
4. **Interactive Map Polish:** The 18-barangay map features seamless zone highlighting and clear cadastral disclaimer notice.
5. **Data Journalism Money Story:** City revenue data highlights FY2024 (₱6.251B) with source-backed storytelling and trend charts.
6. **Timeline Refinement:** History timeline is set against a Deep Laguna Green background with neutral, sourced language.
7. **Test Green:** 100% of Vitest tests pass, typechecking passes, and static build succeeds without errors.
