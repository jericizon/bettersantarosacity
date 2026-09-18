# Implementation Plan: Rework "Santa Rosa Now" into "Santa Rosa at a Glance"

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage "City Updates & Conditions" / "Santa Rosa Now" advisory feed with a stable, high-impact editorial section titled "Santa Rosa at a Glance" featuring verified city statistics and civic exploration links, while decoupling the Open-Meteo weather component into an independent "Current Weather" chapter.

**Architecture:** Nuxt 4 static site generation (SSG) with Vue 3 Composition API, strict TypeScript, Tailwind CSS civic design tokens, Zod-validated data collections in `data/`, Open-Meteo client-side weather integration, Pagefind static search indexing, and Cloudflare Pages static hosting.

**Tech Stack:** Nuxt 4 (`compatibilityVersion: 4`), Vue 3, TypeScript 5.7+, Tailwind CSS 3.4+, Zod 3.24+, Pagefind 1.3+, Lucide Vue Next 0.475+, Vitest 2.1+, Vue Test Utils 2.4+, pnpm.

**Spec Reference:** `docs/superpowers/specifications/SPEC-20260918-santa-rosa-at-a-glance.md`

---

## Global Constraints

- **Package Manager:** Exclusively `pnpm` (no `npm` or `yarn`).
- **Runtime Costs:** Strictly ₱0/month (100% static assets on Cloudflare Pages, zero database, zero backend workers).
- **Identity & Legal:** Persistent non-governmental disclaimer on every page; do not mimic official municipal seals or represent the site as an official city government portal.
- **Brand Identity:** The Santa Rosa Arch (Bantayang Bato) is the primary visual anchor; include a subtle arch watermark/motif in the section.
- **Copy Standards:** Zero em-dashes (`—`) in user-facing UI copy per taste guidelines; use hyphens, colons, or middle dots. Remove unsubstantiated superlatives in favor of sourced metrics.
- **Source Verification:** Every statistic must cite its source organization and verification reference. Do not invent or hard-code unverified numbers.
- **No Real-Time Claims:** Do not use "Real-time", "Live", "Breaking", "Latest", "Current updates", or "Happening now" for this section.
- **Dev Servers:** Never run commands that launch dev servers (`pnpm dev`), preview servers, or watch processes during execution.
- **Git Safety:** Always follow Conventional Commits format (`refactor(home): ...`, `feat(home): ...`) without attribution footers; do not push or commit to protected branches.

---

## Task Breakdown

### Task 1: Create "Santa Rosa at a Glance" Component (`SantaRosaAtAGlance.vue`)

**Files:**
- Create: `components/home/SantaRosaAtAGlance.vue`
- Create: `tests/unit/SantaRosaAtAGlance.spec.ts`

**Interfaces:**
- Consumes: `data/city.json`, `data/barangays.json`, `components/civic/CountUp.vue`, `components/civic/RoseMotif.vue`, `components/brand/BrandMark.vue`.
- Emits: Self-contained Vue 3 component rendering the editorial statistics grid (18 Barangays, 5,543 ha, 2004 Cityhood, 3 Lakeshore Barangays) with source citations, subtle arch element, and 4 Explore navigation cards (`/barangays`, `/places`, `/explore`, `/history`).

- [ ] **Step 1: Write failing unit test for `SantaRosaAtAGlance`**

Create `tests/unit/SantaRosaAtAGlance.spec.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SantaRosaAtAGlance from '../../components/home/SantaRosaAtAGlance.vue'

describe('SantaRosaAtAGlance Component', () => {
  it('renders section eyebrow, heading, and concise editorial description', () => {
    const wrapper = mount(SantaRosaAtAGlance, {
      global: {
        stubs: {
          NuxtLink: { template: '<a><slot /></a>' },
          CountUp: { template: '<span class="count-up-stub"><slot /></span>' },
          BrandMark: { template: '<div class="brand-mark-stub" />' },
          RoseMotif: { template: '<span class="rose-motif-stub" />' }
        }
      }
    })

    expect(wrapper.text()).toContain('SANTA ROSA AT A GLANCE')
    expect(wrapper.text()).toContain('Santa Rosa at a Glance')
    expect(wrapper.text()).toContain('A quick look at the city: its people, places, geography and history.')
  })

  it('displays four verified city facts with correct values, labels, and sources', () => {
    const wrapper = mount(SantaRosaAtAGlance, {
      global: {
        stubs: {
          NuxtLink: { template: '<a><slot /></a>' },
          CountUp: { template: '<span class="count-up-stub">{{ $attrs.end }}</span>' },
          BrandMark: { template: '<div class="brand-mark-stub" />' },
          RoseMotif: { template: '<span class="rose-motif-stub" />' }
        }
      }
    })

    const text = wrapper.text()
    // 1. Barangays
    expect(text).toContain('18')
    expect(text).toContain('BARANGAYS')
    // 2. Land Area
    expect(text).toContain('5,543')
    expect(text).toContain('LAND AREA')
    // 3. Cityhood
    expect(text).toContain('2004')
    expect(text).toContain('CITYHOOD')
    // 4. Lakeshore Barangays
    expect(text).toContain('3')
    expect(text).toContain('LAKESHORE BARANGAYS')

    // Sources
    expect(text).toContain('City Government of Santa Rosa')
    expect(text).toContain('Republic Act No. 9264')
  })

  it('renders the 4 Explore the City navigation links with proper destinations', () => {
    const wrapper = mount(SantaRosaAtAGlance, {
      global: {
        stubs: {
          NuxtLink: {
            props: ['to'],
            template: '<a :href="to"><slot /></a>'
          },
          CountUp: { template: '<span class="count-up-stub" />' },
          BrandMark: { template: '<div class="brand-mark-stub" />' },
          RoseMotif: { template: '<span class="rose-motif-stub" />' }
        }
      }
    })

    expect(wrapper.text()).toContain('EXPLORE THE CITY')

    const links = wrapper.findAll('a')
    const hrefs = links.map(l => l.attributes('href'))

    expect(hrefs).toContain('/barangays')
    expect(hrefs).toContain('/places')
    expect(hrefs).toContain('/explore')
    expect(hrefs).toContain('/history')

    expect(wrapper.text()).toContain('Explore Santa Rosa\'s 18 barangays.')
    expect(wrapper.text()).toContain('Discover notable places, landmarks and attractions around the city.')
    expect(wrapper.text()).toContain('See Santa Rosa by barangay and geographic area.')
    expect(wrapper.text()).toContain('Trace Santa Rosa from Barrio Bukol to the modern city.')
  })

  it('contains zero em-dashes and no real-time or traffic claims', () => {
    const wrapper = mount(SantaRosaAtAGlance, {
      global: {
        stubs: {
          NuxtLink: { template: '<a><slot /></a>' },
          CountUp: { template: '<span class="count-up-stub" />' },
          BrandMark: { template: '<div class="brand-mark-stub" />' },
          RoseMotif: { template: '<span class="rose-motif-stub" />' }
        }
      }
    })

    const text = wrapper.text()
    expect(text).not.toContain('—')
    expect(text).not.toContain('Real-time')
    expect(text).not.toContain('Live traffic')
    expect(text).not.toContain('Traffic')
    expect(text).not.toContain('Recent Advisories')
  })
})
```

- [ ] **Step 2: Run test to confirm failure**
```bash
pnpm test:run tests/unit/SantaRosaAtAGlance.spec.ts
```
Expected: FAIL due to missing `components/home/SantaRosaAtAGlance.vue`.

- [ ] **Step 3: Implement `components/home/SantaRosaAtAGlance.vue`**

Create `components/home/SantaRosaAtAGlance.vue`:
```vue
<script setup lang="ts">
import cityData from '~/data/city.json'
import barangaysData from '~/data/barangays.json'
import CountUp from '~/components/civic/CountUp.vue'
import RoseMotif from '~/components/civic/RoseMotif.vue'
import BrandMark from '~/components/brand/BrandMark.vue'
import { ArrowRight, MapPin, Landmark, Compass, History } from 'lucide-vue-next'

// Lakefront barangays count and names (Aplaya, Sinalhan, Caingin)
const lakeBarangays = barangaysData.filter(b => b.group === 'Laguna Lake')
const lakeBarangayCount = lakeBarangays.length

const stats = [
  {
    value: String(cityData.barangayCount),
    numericValue: cityData.barangayCount,
    label: 'BARANGAYS',
    context: '18 administrative subdivisions across the city',
    source: 'City Government of Santa Rosa · About Us'
  },
  {
    value: `${cityData.landAreaHa.toLocaleString('en-US')} ha`,
    numericValue: cityData.landAreaHa,
    suffix: ' ha',
    label: 'LAND AREA',
    context: 'Total municipal land area in Laguna',
    source: 'City Government of Santa Rosa · About Us'
  },
  {
    value: String(cityData.cityhoodYear),
    label: 'CITYHOOD',
    context: 'Plebiscite ratification under Republic Act No. 9264',
    source: 'Republic Act No. 9264 (July 10, 2004)'
  },
  {
    value: String(lakeBarangayCount),
    numericValue: lakeBarangayCount,
    label: 'LAKESHORE BARANGAYS',
    context: 'Aplaya, Sinalhan, and Caingin along Laguna de Bay',
    source: 'City Government of Santa Rosa · About Us'
  }
]

const exploreLinks = [
  {
    title: 'Barangays',
    description: 'Explore Santa Rosa\'s 18 barangays.',
    to: '/barangays',
    icon: MapPin,
    action: 'Browse barangays'
  },
  {
    title: 'Places & Landmarks',
    description: 'Discover notable places, landmarks and attractions around the city.',
    to: '/places',
    icon: Landmark,
    action: 'Explore places'
  },
  {
    title: 'City Map',
    description: 'See Santa Rosa by barangay and geographic area.',
    to: '/explore',
    icon: Compass,
    action: 'Open map explorer'
  },
  {
    title: 'History & Heritage',
    description: 'Trace Santa Rosa from Barrio Bukol to the modern city.',
    to: '/history',
    icon: History,
    action: 'Read city history'
  }
]
</script>

<template>
  <div class="relative space-y-12 sm:space-y-16">
    <!-- Subtle Background Arch Motif (Decorative Watermark) -->
    <div
      class="pointer-events-none absolute -right-6 -top-10 opacity-[0.04] sm:opacity-[0.06] text-laguna-green hidden sm:block"
      aria-hidden="true"
    >
      <BrandMark :size="280" monochrome />
    </div>

    <!-- Section Header -->
    <div class="max-w-3xl space-y-3">
      <div class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent-dark">
        <RoseMotif :size="14" class="text-rose-accent" />
        <span>SANTA ROSA AT A GLANCE</span>
      </div>

      <h2
        id="glance-heading"
        class="font-serif text-3xl font-bold tracking-tight text-laguna-green sm:text-4xl lg:text-5xl leading-tight"
      >
        Santa Rosa at a Glance
      </h2>

      <p class="text-base sm:text-lg leading-relaxed text-charcoal/75">
        A quick look at the city: its people, places, geography and history.
      </p>
    </div>

    <!-- Editorial Statistics (Magazine Layout with Generous Whitespace) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-8 border-y border-charcoal/10 py-8 sm:py-10">
      <div
        v-for="(stat, idx) in stats"
        :key="stat.label"
        class="flex flex-col justify-between"
        :class="{ 'lg:border-r lg:border-charcoal/10 lg:pr-6': idx < stats.length - 1 }"
      >
        <div>
          <p class="font-serif text-5xl sm:text-6xl font-bold tracking-tight text-laguna-green leading-none">
            <CountUp
              v-if="stat.numericValue !== undefined"
              :end="stat.numericValue"
              :suffix="stat.suffix || ''"
            />
            <template v-else>{{ stat.value }}</template>
          </p>
          <p class="mt-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-charcoal/80">
            {{ stat.label }}
          </p>
          <p class="mt-1 text-xs text-charcoal/70 leading-relaxed">
            {{ stat.context }}
          </p>
        </div>

        <p class="mt-5 border-t border-charcoal/10 pt-2 text-[11px] text-charcoal/60 leading-tight">
          Source: <span class="font-medium text-charcoal/80">{{ stat.source }}</span>
        </p>
      </div>
    </div>

    <!-- Explore the City Navigation Area -->
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-charcoal/10 pb-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent-dark">
            EXPLORE THE CITY
          </p>
          <h3 class="font-serif text-xl sm:text-2xl font-bold text-laguna-green mt-1">
            Explore Santa Rosa by Area, Place &amp; History
          </h3>
        </div>
        <p class="text-xs text-charcoal/60 max-w-md">
          Independent civic and geographic exploration across Santa Rosa's communities.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <NuxtLink
          v-for="item in exploreLinks"
          :key="item.to"
          :to="item.to"
          class="group flex flex-col justify-between rounded-xl border border-charcoal/10 bg-white p-5 sm:p-6 shadow-sm transition-all duration-200 hover:border-laguna-green/40 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-laguna-green"
        >
          <div class="space-y-3">
            <div class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-light-green/80 text-laguna-green group-hover:bg-laguna-green group-hover:text-white transition-colors duration-200">
              <component :is="item.icon" :size="18" aria-hidden="true" />
            </div>

            <h4 class="font-serif text-lg font-bold text-charcoal group-hover:text-laguna-green transition-colors">
              {{ item.title }}
            </h4>

            <p class="text-xs sm:text-sm text-charcoal/70 leading-relaxed">
              {{ item.description }}
            </p>
          </div>

          <div class="mt-5 pt-3 border-t border-charcoal/10 flex items-center justify-between text-xs font-semibold text-laguna-green">
            <span>{{ item.action }}</span>
            <ArrowRight :size="14" class="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 4: Run test to confirm green**
```bash
pnpm test:run tests/unit/SantaRosaAtAGlance.spec.ts
```
Expected: PASS with 4/4 passing tests.

---

### Task 2: Homepage Chapter Integration & Weather Decoupling (`pages/index.vue`)

**Files:**
- Modify: `pages/index.vue`
- Retire: `components/civic/SantaRosaNow.vue` (delete or keep as deprecated alias if needed; remove from index)

**Interfaces:**
- Consumes: `components/home/SantaRosaAtAGlance.vue`, `components/civic/WeatherToday.vue`, `components/editorial/SectionHeader.vue`.
- Replaces: Chapter 2 ("Santa Rosa Today") and Chapter 3 ("Santa Rosa Now") with:
  - **Chapter 2:** `SantaRosaAtAGlance.vue` on `section-white`
  - **Chapter 3:** `CivicMapExplorer.vue` on `section-light-green`
  - **Chapter 4:** `CivicWeatherToday.vue` on `section-white`
  - **Chapter 5:** `City Finances` on `section-parchment`
- Preserves 12 distinct chapters with alternating grounds and vertical spacing.

- [ ] **Step 1: Update `pages/index.vue` imports and section refs**

In `pages/index.vue`:
Replace:
```typescript
import CivicSantaRosaNow from '~/components/civic/SantaRosaNow.vue'
import DataStatCard from '~/components/data/StatCard.vue'
```
With:
```typescript
import HomeSantaRosaAtAGlance from '~/components/home/SantaRosaAtAGlance.vue'
import CivicWeatherToday from '~/components/civic/WeatherToday.vue'
```

Update scroll reveal refs:
```typescript
const glanceSection = ref<HTMLElement | null>(null)
const exploreSection = ref<HTMLElement | null>(null)
const weatherSection = ref<HTMLElement | null>(null)
const financesSection = ref<HTMLElement | null>(null)
```

- [ ] **Step 2: Update template chapters in `pages/index.vue`**

Replace Chapters 2 and 3:
```vue
    <!-- 2 — Santa Rosa at a Glance: clean-white editorial snapshot of verified
         city facts and civic exploration links (spec §4). -->
    <section
      ref="glanceSection"
      aria-labelledby="glance-heading"
      class="w-full section-white py-20 sm:py-28 lg:py-32 border-b border-charcoal/10"
      :class="revealClass(glanceVisible)"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HomeSantaRosaAtAGlance />
      </div>
    </section>

    <!-- 3 — Explore Santa Rosa: full-bleed chapter on the light-green ground
         reserved for the interactive map (spec §4). -->
    <section
      ref="exploreSection"
      aria-label="Explore Santa Rosa"
      class="w-full overflow-x-clip section-light-green py-20 sm:py-28 lg:py-32 border-b border-charcoal/10"
      :class="revealClass(exploreVisible)"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CivicMapExplorer />
        <NuxtLink
          to="/barangays"
          class="mt-8 inline-block rounded-sm text-sm font-semibold text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
        >
          Browse all 18 barangays →
        </NuxtLink>
      </div>
    </section>

    <!-- 4 — Current Weather: independent meteorological observations chapter
         on clean white, clearly citing Open-Meteo as independent from
         city government advisories (spec §5). -->
    <section
      ref="weatherSection"
      aria-label="Current Weather"
      class="w-full section-white py-16 sm:py-20 lg:py-24 border-b border-charcoal/10"
      :class="revealClass(weatherVisible)"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CivicWeatherToday />
      </div>
    </section>
```

- [ ] **Step 3: Remove `components/civic/SantaRosaNow.vue`**

Delete `components/civic/SantaRosaNow.vue` to ensure no dead traffic or advisory code remains in the component tree.

- [ ] **Step 4: Verify ground tone rhythm across all 12 chapters in `pages/index.vue`**
- Ch 1 (Hero): `section-parchment`
- Ch 2 (At a Glance): `section-white`
- Ch 3 (Explore): `section-light-green`
- Ch 4 (Weather): `section-white`
- Ch 5 (Finances): `section-parchment`
- Ch 6 (Projects): `section-white`
- Ch 7 (Timeline): `section-deep-green`
- Ch 8 (Collage): `section-parchment`
- Ch 9 (Laws): `section-white`
- Ch 10 (Services): `section-white`
- Ch 11 (Downloads): `section-parchment`
- Ch 12 (Trust): `section-white`

---

### Task 3: Route Redirect Support for `/map`

**Files:**
- Modify: `public/_redirects`

**Interfaces:**
- Ensures any user entering `/map` is seamlessly redirected to `/explore` (301 status on Cloudflare Pages static).

- [ ] **Step 1: Update `public/_redirects`**

Ensure `public/_redirects` contains:
```
/money /finances 301
/money/budget /finances/budget 301
/map /explore 301
```

---

### Task 4: Test Suite Updates & Chapter Architecture Verification

**Files:**
- Modify: `tests/unit/homepage.spec.ts`
- Remove: `tests/unit/SantaRosaNow.spec.ts` (replaced by `tests/unit/SantaRosaAtAGlance.spec.ts`)

**Interfaces:**
- Asserts all 12 chapters are present in `pages/index.vue`.
- Asserts `SantaRosaAtAGlance` and `WeatherToday` components are rendered.
- Asserts presence of `Santa Rosa at a Glance` and `Current Weather`.
- Asserts ground tone classes across chapters.
- Confirms zero em-dashes and no "Recent City Updates" or "Real-time" copy on the homepage.

- [ ] **Step 1: Update `tests/unit/homepage.spec.ts`**

Update `tests/unit/homepage.spec.ts` to assert the new chapter structure:
```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IndexPage from '../../pages/index.vue'
import HeroSearch from '../../components/civic/HeroSearch.vue'
import SantaRosaAtAGlance from '../../components/home/SantaRosaAtAGlance.vue'
import MapExplorer from '../../components/civic/MapExplorer.vue'
import WeatherToday from '../../components/civic/WeatherToday.vue'
import Collage from '../../components/civic/Collage.vue'
import Timeline from '../../components/civic/Timeline.vue'

describe('Homepage Civic Sections & Chapter Architecture', () => {
  it('renders all 12 editorial chapters including Santa Rosa at a Glance and Current Weather', () => {
    const wrapper = mount(IndexPage)
    // 1. Hero
    expect(wrapper.findComponent(HeroSearch).exists()).toBe(true)
    expect(wrapper.text()).toContain('Public information about Santa Rosa, made easier to find.')
    // 2. Santa Rosa at a Glance
    expect(wrapper.findComponent(SantaRosaAtAGlance).exists()).toBe(true)
    expect(wrapper.text()).toContain('Santa Rosa at a Glance')
    expect(wrapper.text()).toContain('EXPLORE THE CITY')
    // 3. Explore Santa Rosa
    expect(wrapper.findComponent(MapExplorer).exists()).toBe(true)
    expect(wrapper.text()).toContain('Explore Santa Rosa')
    // 4. Current Weather
    expect(wrapper.findComponent(WeatherToday).exists()).toBe(true)
    expect(wrapper.text()).toContain('Current weather · Santa Rosa')
    // 5. City Finances
    expect(wrapper.text()).toContain('City Finances')
    // 6. Projects
    expect(wrapper.text()).toContain('Building the City')
    // 7. History
    expect(wrapper.text()).toContain('From Bukol to Today')
    // 8. Heritage & Places
    expect(wrapper.findComponent(Collage).exists()).toBe(true)
    expect(wrapper.text()).toContain('Santa Rosa Life & Heritage')
    // 9. Laws & Decisions
    expect(wrapper.text()).toContain('Laws & Decisions')
    // 10. Services
    expect(wrapper.text()).toContain('Services')
    // 11. Data & Downloads + Data Trust
    expect(wrapper.text()).toContain('Data & Downloads')
    expect(wrapper.text()).toContain('Data Trust')
    // 12. About / Sources
    expect(wrapper.text()).toContain('About this project')
  })

  it('pins each editorial chapter section to its designated full-bleed ground tone', () => {
    const wrapper = mount(IndexPage)
    const chapters: [string, string][] = [
      ['section[aria-labelledby="glance-heading"]', 'section-white'],
      ['section[aria-label="Explore Santa Rosa"]', 'section-light-green'],
      ['section[aria-label="Current Weather"]', 'section-white'],
      ['section[aria-label="City Finances"]', 'section-parchment'],
      ['section[aria-label="Building the City"]', 'section-white'],
      ['section[aria-label="From Bukol to Today"]', 'section-deep-green'],
      ['section[aria-label="Santa Rosa Life & Heritage"]', 'section-parchment'],
      ['section[aria-label="Laws & Decisions"]', 'section-white'],
      ['section[aria-label="Services"]', 'section-white'],
      ['section[aria-label="Data & Downloads"]', 'section-parchment'],
      ['section[aria-label="Data Trust"]', 'section-white']
    ]
    for (const [selector, tone] of chapters) {
      const chapter = wrapper.find(selector)
      expect(chapter.exists(), selector).toBe(true)
      expect(chapter.classes(), selector).toContain('w-full')
      expect(chapter.classes(), selector).toContain(tone)
    }
  })
})
```

- [ ] **Step 2: Delete `tests/unit/SantaRosaNow.spec.ts`**
Remove `tests/unit/SantaRosaNow.spec.ts` since the component has been replaced by `SantaRosaAtAGlance.spec.ts`.

- [ ] **Step 3: Run the full test suite**
```bash
pnpm test:run
```
Expected: All 46 test files and 134+ tests pass.

- [ ] **Step 4: Run typecheck**
```bash
pnpm typecheck
```
Expected: Clean exit code 0 with zero TypeScript errors.

- [ ] **Step 5: Run production build and Pagefind verification**
```bash
pnpm build:prod
```
Expected:
- 110 routes prerendered successfully.
- Pagefind indexes all generated static pages.
- Sitemap contains 53 URLs.
- `dist/index.html` contains:
  - "SANTA ROSA AT A GLANCE"
  - "Santa Rosa at a Glance"
  - "A quick look at the city: its people, places, geography and history."
  - "18" and "BARANGAYS"
  - "5,543 ha" and "LAND AREA"
  - "2004" and "CITYHOOD"
  - "3" and "LAKESHORE BARANGAYS"
  - "EXPLORE THE CITY"
  - "Current weather · Santa Rosa"
  - Zero occurrences of "Real-time Civic Conditions", "Recent City Updates", "Recent Advisories", or "Traffic".

---

## Execution Handoff

Plan is saved and ready for execution via `superpowers:subagent-driven-development` or inline execution with approval checkpoints.
