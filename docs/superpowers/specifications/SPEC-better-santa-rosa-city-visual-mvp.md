# Spec: Better Santa Rosa City Visual MVP

## 1. Assumptions Surfaced
1. **Existing Architecture Preserved:** The core zero-database static site architecture (Nuxt 4 + static JSON + Pagefind, ₱0/month runtime cost on Cloudflare Pages) established in `SPEC-better-santa-rosa-city-mvp.md` is strictly preserved. No backend databases or server-side APIs are introduced.
2. **Framework & Stack:** Nuxt 4, Vue 3 (`<script setup lang="ts">`), Tailwind CSS 3.4+, Zod 3.24+, Pagefind 1.3+, Lucide Vue Next, and Vitest.
3. **No Heavy Animation Engines:** GSAP, Three.js, or heavy canvas libraries will NOT be bundled. All animations, reveals, and transitions rely on lightweight CSS keyframes/transitions and native browser `IntersectionObserver` composables to meet Lighthouse 90+ and LCP < 2.5s.
4. **Media Licensing Compliance:** Only legally cleared images (Wikimedia Commons CC BY-SA 4.0 / Public Domain / CC0) of Santa Rosa, Laguna with complete attribution metadata in `data/media.json` and a public `/about/media` page are permitted. No web scraper copies or uncredited images.
5. **Interactive Map Motif:** An SVG-based topological and interactive map of Santa Rosa's 18 barangays and 3 geographic zones (Laguna Lake, Lowland Urban, Upper / Tagaytay) will provide spatial storytelling without presenting decorative vectors as certified survey data.
6. **Accessibility & Reduced Motion:** All visual motion strictly honors `prefers-reduced-motion: reduce`. All text-over-image layouts maintain WCAG 2.1 AA contrast ratios (4.5:1 body, 3:1 large headers).

---

## 2. Objective & Creative Vision
Enhance the Better Santa Rosa City MVP (`bettersantarosacity.org`) from a functional data portal into a distinctive, visually compelling **modern civic-information publication for Santa Rosa, Laguna**.

### Visual Blend Formula
* **50% Modern Civic Technology:** Clean layout, typographic hierarchy, responsive grids, data clarity, high trust.
* **20% Editorial / Data Journalism:** Rich article-style compositions, prominent lead figures, alternating timeline layouts, magazine-quality section transitions.
* **15% Santa Rosa Heritage:** Historical narrative from Barrio Bukol (1792) to modern cityhood (2004), Cuartel de Santo Domingo, Church of Santa Rosa de Lima.
* **10% Local Geography & Nature:** Laguna Lake shoreline, lakeside barangays, lowland agricultural corridors, Tagaytay foothill ridge.
* **5% Purposeful Micro-Interactions:** Subtle hover zooms, rotating search placeholders, viewport count-ups, sticky navigation compression.

### Tone Contract
* **Must feel:** Trustworthy, modern, local, editorial, informative, human, slightly premium, calm, data-driven.
* **Must NOT feel:** Corporate-government, sterile, bureaucratic, childish, flashy, crypto/Web3-like, or SaaS-template-like.

---

## 3. Capability Map

| Module ID | Responsibility | Depends On | Deliverables |
|---|---|---|---|
| `visual-tokens` | Civic color palette extensions, typography stack (Inter + Source Serif 4), section background system, motion timing tokens | — | `tailwind.config.ts`, `assets/css/main.css` |
| `media-system` | Media schema, curated Santa Rosa image assets, license registry, `MediaCredit` component, `/about/media` attribution page | `visual-tokens` | `data/media.json`, `types/civic.ts`, `components/media/MediaCredit.vue`, `components/media/CivicImage.vue`, `pages/about/media.vue` |
| `motifs-graphics` | Abstract geometric rose SVG motif (Saint Rose of Lima) and interactive Santa Rosa 18-barangay SVG map with zone highlighting | `visual-tokens` | `components/civic/RoseMotif.vue`, `components/civic/CityMapSvg.vue`, `components/civic/MapExplorer.vue` |
| `motion-engine` | Native `IntersectionObserver` scroll reveals, number count-up composable/component, reduced-motion guards | `visual-tokens` | `composables/useScrollReveal.ts`, `composables/useReducedMotion.ts`, `components/civic/CountUp.vue` |
| `hero-experience` | Editorial civic hero with real Santa Rosa photography, ambient slow motion, rotating search hints, ⌘K trigger | `media-system`, `motifs-graphics`, `motion-engine` | `components/civic/HeroSearch.vue`, `pages/index.vue` hero section |
| `editorial-homepage` | Redesigned homepage sections: Santa Rosa Today count-up stats, Map Explorer, Editorial Budget Chart, Project Cards with hover micro-interactions, Bukol-to-Cityhood magazine timeline, Asymmetric Image Collage | `motifs-graphics`, `motion-engine`, `media-system` | `pages/index.vue`, `components/money/BudgetChart.vue`, `components/civic/Collage.vue` |
| `shell-navigation` | Adaptive sticky header (scroll height/blur/shadow compression), mobile slide-down drawer, enhanced footer with media attribution | `visual-tokens`, `motifs-graphics` | `components/civic/CivicHeader.vue`, `components/civic/CivicFooter.vue` |
| `content-pages-visual` | Visual elevation across `/explore`, `/barangays`, `/money`, `/projects`, `/government`, `/laws`, `/services`, `/sources` | `media-system`, `editorial-homepage` | `pages/explore.vue`, `pages/barangays/*.vue`, `pages/projects/*.vue`, `pages/money/*.vue` |
| `perf-accessibility-qa` | Responsive breakpoints (320px–1440px), WCAG 2.1 AA audit, image preload/aspect-ratios, Vitest regression tests | All modules | Test suite, Lighthouse 90+ audit |

Build Order: `visual-tokens` → `media-system` → `motifs-graphics` → `motion-engine` → `hero-experience` → `editorial-homepage` → `shell-navigation` → `content-pages-visual` → `perf-accessibility-qa`.

---

## 4. Commands

```bash
# Install dependencies
pnpm install

# Run type-checking
pnpm run typecheck

# Run unit and visual regression tests
pnpm test:run

# Build static site with data sync and sitemap generation
pnpm run build:prod

# Pagefind search indexing verification
pnpm run index:search
```

---

## 5. Project Structure

```text
bettersantarosacity/
├── assets/
│   └── css/
│       └── main.css                    # Tailwind directives, font-face, motion utility classes
├── components/
│   ├── civic/
│   │   ├── CityMapSvg.vue              # Scalable 18-barangay SVG map with 3 zones & tooltips
│   │   ├── CivicFooter.vue             # Editorial civic footer with media link & disclaimer
│   │   ├── CivicHeader.vue             # Scroll-responsive sticky header & mobile drawer
│   │   ├── Collage.vue                 # Asymmetrical magazine-style image collage
│   │   ├── CountUp.vue                 # Viewport-triggered numeric count-up
│   │   ├── DisclaimerBanner.vue        # Prominent non-governmental notice
│   │   ├── HeroSearch.vue              # Primary search with rotating placeholders & ⌘K badge
│   │   ├── MapExplorer.vue             # Split-view desktop / stacked mobile barangay map explorer
│   │   ├── RoseMotif.vue               # Geometric vector rose motif (accent only)
│   │   └── Timeline.vue                # Editorial historical magazine timeline
│   ├── data/
│   │   ├── BarangayCard.vue            # Enhanced barangay card with zone color indicator
│   │   ├── DataFreshness.vue           # Verification metadata badge
│   │   ├── LastVerified.vue            # Timestamp provenance indicator
│   │   ├── SourceBadge.vue             # Source authority badge
│   │   ├── SourceCitation.vue          # Enhanced citation link
│   │   └── StatCard.vue                # Editorial statistic card with count-up
│   ├── media/
│   │   ├── CivicImage.vue              # Optimized responsive image with skeleton & attribution
│   │   └── MediaCredit.vue             # Subtle inline or floating photo credit badge
│   ├── money/
│   │   └── BudgetChart.vue             # Viewport animated revenue breakdown bar chart
│   └── projects/
│       ├── ProjectCard.vue             # Editorial project card with photo, budget, micro-hover
│       └── ProjectStatus.vue           # Semantic status indicator
├── composables/
│   ├── useReducedMotion.ts             # Reactive prefers-reduced-motion hook
│   └── useScrollReveal.ts              # Native IntersectionObserver viewport observer
├── data/
│   ├── barangays.json                  # 18 barangays with geographic groups & population
│   ├── budgets.json                    # Verified COA/BLGF revenue data
│   ├── city.json                       # Verified Santa Rosa municipal facts
│   ├── media.json                      # Image registry with licenses, creators, and URLs
│   ├── projects.json                   # City infrastructure initiatives
│   └── sources.json                    # Authoritative citations repository
├── pages/
│   ├── about/
│   │   └── media.vue                   # Public media credits and copyright licensing directory
│   ├── explore.vue                     # City profile, geographic narrative & history
│   ├── index.vue                       # Homepage: Hero, Today, Map, Budget, Projects, Heritage, Collage
│   └── ... (existing pages)
├── public/
│   └── images/
│       ├── santa-rosa-arch.jpg         # Hero/Heritage: Historic Santa Rosa Arch
│       ├── santa-rosa-church.jpg       # Heritage: Santa Rosa de Lima Parish Church
│       ├── santa-rosa-cityhall.jpg     # Civic: Santa Rosa City Hall complex
│       ├── nuvali-lake.jpg             # Nature/Modern: Nuvali lake & green corridor
│       └── cuartel-santo-domingo.jpg   # Heritage: Spanish-era Cuartel de Santo Domingo
└── tests/
    └── unit/
        ├── visual-components.spec.ts   # Tests for RoseMotif, CountUp, MediaCredit, CityMapSvg
        └── ... (existing test files)
```

---

## 6. Code Style & Standards

### Vue 3 `<script setup lang="ts">` Pattern
All components adhere strictly to Vue 3 composition API, strong typing via TypeScript interfaces, semantic HTML tags, and accessible ARIA bindings.

```vue
<!-- Example: components/media/MediaCredit.vue -->
<script setup lang="ts">
import type { MediaItem } from '~/types/civic'

const props = withDefaults(defineProps<{
  media: MediaItem
  variant?: 'inline' | 'overlay'
}>(), {
  variant: 'inline'
})
</script>

<template>
  <div
    :class="[
      'text-[11px] font-sans text-charcoal/70 transition-opacity',
      variant === 'overlay' ? 'absolute bottom-2 right-2 rounded bg-charcoal/80 px-2 py-0.5 text-parchment/90 backdrop-blur-sm' : 'mt-1'
    ]"
  >
    <span>Photo: {{ media.author }}</span>
    <span class="mx-1.5 opacity-50">·</span>
    <a
      :href="media.sourceUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="underline hover:text-laguna-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green rounded-sm"
    >
      {{ media.source }} ({{ media.license }})
    </a>
  </div>
</template>
```

### Design Token Conventions
* **Colors:** Only semantic Tailwind classes: `bg-laguna-green`, `text-charcoal`, `bg-parchment`, `text-rose-accent-dark`, `border-charcoal/10`. No arbitrary hex values in component classes.
* **Typography:** `font-serif` (`Source Serif 4`) for editorial headings, pull-quotes, and historical timelines; `font-sans` (`Inter` / `Manrope`) for all body copy, statistics, UI labels, and search fields.
* **Micro-interactions:** Strict duration scale (`150ms` fast buttons, `250ms` cards, `500ms` section reveals). Transitions use `ease-out`.

---

## 7. Testing Strategy
* **Framework:** Vitest + `@vue/test-utils` + `happy-dom`.
* **Media & Schema Integrity:** Validate that all items in `data/media.json` conform to the Zod `MediaItemSchema` and that referenced image files exist in `public/images/`.
* **Component Testing:**
  - `MediaCredit.vue`: Renders author, license, and outbound link with `rel="noopener noreferrer"`.
  - `CountUp.vue`: Renders start value, updates to target value, respects reduced-motion flag immediately.
  - `CityMapSvg.vue`: Renders all 18 barangay SVG zones with accessible labels and emits selection events.
  - `HeroSearch.vue`: Renders keyboard shortcut indicator (`⌘K`), handles placeholder interval cycle cleanly, cleans up timers on unmount.
  - `CivicHeader.vue`: Reacts to window scroll state changes by toggling compact classes.
* **Regression Protection:** Ensure all 15 existing test suites (27 tests) remain green without regressions.

---

## 8. Boundaries

### Always Do
* Verify contrast ratios: Body copy on `bg-parchment` must exceed 4.5:1; headings on dark greens/blues must exceed 4.5:1.
* Honor `prefers-reduced-motion`: Instantly set animated counters to final numbers, disable image zoom/pans, and use zero-duration or simple opacity transitions.
* Credit every photograph: Image credit component or attribution link must accompany every photograph.
* Set explicit `width` and `height` (and `aspect-ratio`) attributes on all images to eliminate Cumulative Layout Shift (CLS < 0.1).
* Maintain clear non-governmental disclaimers on header, footer, and homepage.

### Ask First
* Introducing external third-party CDN scripts or image hosting services.
* Adding any external npm package larger than 20kB.

### Never Do
* Never commit 5MB–10MB raw camera photos (all images must be properly resized and optimized).
* Never display official Santa Rosa municipal seals, logos, or flags as decorative brand icons.
* Never use decorative animated canvas particles, floating 3D elements, or bouncy cartoon easing.
* Never fabricate historical data or city statistics; all numbers must cite real sources.

---

## 9. Success Criteria

| Criterion | Target | Verification Method |
|---|---|---|
| **Lighthouse Performance** | ≥ 90 on mobile & desktop | Chrome DevTools / Lighthouse CLI |
| **Cumulative Layout Shift (CLS)** | < 0.1 | Web Vitals audit |
| **Largest Contentful Paint (LCP)** | < 2.5s | Web Vitals audit with hero preloaded |
| **Interaction to Next Paint (INP)** | < 200ms | Input responsiveness test |
| **Media Provenance** | 100% of images in `data/media.json` with source & license | Zod schema unit test |
| **Media Credits Page** | `/about/media` lists all assets with live source links | Automated test & manual check |
| **WCAG 2.1 AA** | Zero color-contrast or missing-alt violations | Axe-core accessibility scan |
| **Reduced Motion** | Zero unexpected animation when `prefers-reduced-motion` active | Vitest component unit tests |
| **Search Engine Continuity** | Pagefind client search operates seamlessly | `pnpm run build:prod` & verification |

---

## 10. Open Questions & Resolution
* *Q: Should we use Leaflet/OpenStreetMap for the homepage map or a lightweight SVG map?*
  **A: SVG Map First.** A custom, lightweight SVG map of Santa Rosa's 18 barangays and 3 topographic zones provides instant load times (0 external network requests, zero bundle bloat, perfect styling consistency with Tailwind tokens). Leaflet can remain an optional progressive enhancement on detail pages.
* *Q: How should image files be stored for the MVP?*
  **A: `public/images/`.** Local optimized WebP/JPEG files in `public/images/` committed to git keep the architecture 100% static and zero-cost, avoiding external CDN or Cloudflare R2 complexity for the MVP.
