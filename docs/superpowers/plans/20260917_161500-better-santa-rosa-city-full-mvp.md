# Better Santa Rosa City Full MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the Full MVP for Better Santa Rosa City (`betterSantaRosaCity.org`), delivering the complete 14-route surface (adding dedicated `/history` and `/about` pages), global `Cmd+K` search keyboard shortcuts, Citizen's Charter transparency resources on `/government`, sitemap completeness, and full brand system assets while preserving 100% static zero-database performance.

**Architecture:** Nuxt 4 static site generation (SSG) with Vue 3 Composition API, strict TypeScript, Tailwind CSS civic design tokens, Zod-validated data registries in `data/`, native browser `IntersectionObserver` composables for reveals and count-ups, Pagefind post-build search indexing, and Cloudflare Pages static hosting.

**Tech Stack:** Nuxt 4 (`compatibilityVersion: 4`), Vue 3, TypeScript 5.7+, Tailwind CSS 3.4+, Zod 3.24+, Pagefind 1.3+, Lucide Vue Next, Vitest 2.1+, Vue Test Utils 2.4+, pnpm.

**Spec:** `docs/superpowers/specifications/SPEC-20260917-better-santa-rosa-city-full-mvp.md`

## Global Constraints

- **Package Manager:** Exclusively `pnpm` (no `npm` or `yarn`).
- **Runtime Costs:** Strictly ₱0/month (100% static assets, zero external paid CDNs or database backends).
- **Identity & Legal:** Prominent non-governmental disclaimer on all pages; no fake municipal seals or misleading city government representation.
- **Cadastral Integrity:** All maps must carry the explicit disclaimer: *"Simplified map for information purposes. Not official cadastral survey data."*
- **Copy & Typography:** Zero em-dashes (`—`) in user-facing UI copy per taste guidelines; remove unsubstantiated superlatives in favor of sourced metrics.
- **Media Licensing:** 100% of photographic assets must be legally cleared (Wikimedia Commons CC BY-SA 4.0 / Public Domain / CC0), tracked in `data/media.json`, and credited via `MediaCredit.vue` and `/about/media`.
- **Accessibility & Motion:** All animations must respect `prefers-reduced-motion: reduce`; body copy contrast must exceed 4.5:1; interactive touch targets must be >= 44x44px.
- **Performance Budget:** Zero heavy 3D or animation runtimes (no GSAP/Three.js); target Lighthouse 90+, LCP < 2.5s, CLS < 0.1, INP < 200ms.
- **Dev Servers:** Never run commands that launch dev servers (`pnpm dev`), preview servers, or watch processes during execution.
- **Git Safety:** Always follow conventional commit standards without attribution footers; do not push or commit to protected branches.

---

### Task 1: Dedicated `/history` Route ("From Bukol to Modern Santa Rosa")

**Files:**
- Create: `pages/history/index.vue`
- Test: `tests/unit/history.spec.ts`

**Interfaces:**
- Consumes: `data/city.json` (`timeline`, `sources`, `lastVerified`), `components/civic/Timeline.vue`, `components/data/SourceBadge.vue`, `components/data/LastVerified.vue`, `utils/seo.ts`.
- Produces: Dedicated `/history` route with historical overview, era jump navigation, historical timeline with landmark media, source citations, and JSON-LD structured data.

- [ ] **Step 1: Write the failing test for the history route**

Create `tests/unit/history.spec.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import cityData from '~/data/city.json'
import HistoryPage from '~/pages/history/index.vue'

describe('History Page (/history)', () => {
  it('renders the page title and historical overview', () => {
    const wrapper = mount(HistoryPage, {
      global: {
        stubs: {
          CivicTimeline: true,
          CivicRoseMotif: true,
          DataSourceBadge: true,
          DataLastVerified: true,
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    expect(wrapper.find('h1').text()).toContain('From Bukol to Modern Santa Rosa')
    expect(wrapper.text()).toContain('1571')
    expect(wrapper.text()).toContain('2025')
  })

  it('renders all 11 chronological milestones from city.json', () => {
    const wrapper = mount(HistoryPage, {
      global: {
        stubs: {
          CivicTimeline: true,
          CivicRoseMotif: true,
          DataSourceBadge: true,
          DataLastVerified: true,
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    expect(cityData.timeline.length).toBe(11)
    for (const item of cityData.timeline) {
      expect(wrapper.text()).toContain(item.year)
    }
  })

  it('includes sources and verification metadata', () => {
    const wrapper = mount(HistoryPage, {
      global: {
        stubs: {
          CivicTimeline: true,
          CivicRoseMotif: true,
          DataSourceBadge: true,
          DataLastVerified: true,
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    expect(wrapper.text()).toContain('City Government of Santa Rosa')
    expect(wrapper.text()).toContain(cityData.lastVerified)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/unit/history.spec.ts`  
Expected: FAIL (`Cannot find module '~/pages/history/index.vue'`).

- [ ] **Step 3: Implement `pages/history/index.vue`**

Create `pages/history/index.vue`:

```vue
<script setup lang="ts">
import cityData from '~/data/city.json'
import CivicTimeline from '~/components/civic/Timeline.vue'
import CivicRoseMotif from '~/components/civic/RoseMotif.vue'
import DataSourceBadge from '~/components/data/SourceBadge.vue'
import DataLastVerified from '~/components/data/LastVerified.vue'
import { buildSeoHead } from '~/utils/seo'

if (typeof useHead === 'function') {
  useHead(buildSeoHead({
    title: 'History of Santa Rosa City · From Bukol to Modern Day',
    description: 'Historical timeline of Santa Rosa, Laguna from Barrio Bukol in 1571 to 2004 cityhood and modern civic development.',
    path: '/history',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'History of Santa Rosa City: From Bukol to Modern Day',
      description: 'Historical timeline and public records of Santa Rosa City, Laguna.',
      datePublished: '2026-09-15',
      dateModified: cityData.lastVerified,
      author: {
        '@type': 'Organization',
        name: 'Better Santa Rosa City'
      }
    }
  }))
}

const timeline = cityData.timeline
const sources = cityData.sources
const lastVerified = cityData.lastVerified
</script>

<template>
  <div data-pagefind-filter="type:history" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
    <!-- Header -->
    <header class="max-w-3xl space-y-4">
      <p class="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent-dark">
        <CivicRoseMotif :size="16" class="text-rose-accent" />
        Santa Rosa City, Laguna
      </p>
      <h1 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-laguna-green leading-tight">
        From Bukol to Modern Santa Rosa
      </h1>
      <div class="flex flex-wrap items-center gap-2">
        <DataSourceBadge type="official" />
      </div>
      <p class="text-base sm:text-lg leading-relaxed text-charcoal/80">
        Over 450 years of civic history: from an agrarian lakeside settlement named Barrio Bukol, to emancipation as a municipality in 1792, through revolutionary sacrifice, post-war rebirth, and transformation into a premier economic center.
      </p>
      <DataLastVerified :date="lastVerified" :show-state="false" />
    </header>

    <!-- Historical Timeline Chapter -->
    <section aria-label="Chronological Timeline" class="rounded-2xl border border-charcoal/10 bg-white p-6 sm:p-12 shadow-sm">
      <CivicTimeline :items="timeline" theme="light" />
    </section>

    <!-- Source Notes -->
    <section aria-labelledby="history-sources-heading" class="rounded-xl border border-charcoal/10 bg-parchment p-6 sm:p-8 space-y-4">
      <h2 id="history-sources-heading" class="font-serif text-xl font-bold text-laguna-green">
        Sources and Historical References
      </h2>
      <p class="text-sm text-charcoal/70 leading-relaxed">
        Timeline entries are drawn directly from official municipal publications, the 2025 Voluntary Local Review, Republic Acts, and verified archival records.
      </p>
      <ul class="space-y-2 text-xs text-charcoal/80 list-disc pl-5">
        <li v-for="(source, idx) in sources" :key="idx">
          {{ source }}
        </li>
      </ul>
    </section>
  </div>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/unit/history.spec.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add pages/history/index.vue tests/unit/history.spec.ts
git commit -m "feat(history): add dedicated /history route with chronological timeline"
```

---

### Task 2: Dedicated `/about` Route (Mission, Disclaimer, Methodology & Corrections)

**Files:**
- Create: `pages/about/index.vue`
- Modify: `components/civic/CivicFooter.vue`
- Test: `tests/unit/about.spec.ts`

**Interfaces:**
- Consumes: `components/data/SourceBadge.vue`, `components/civic/RoseMotif.vue`, `utils/seo.ts`.
- Produces: Dedicated `/about` route covering non-governmental independence, data principles, corrections workflow, and direct links to `/about/media` and `/sources`.

- [ ] **Step 1: Write the failing test for the about route**

Create `tests/unit/about.spec.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AboutPage from '~/pages/about/index.vue'

describe('About Page (/about)', () => {
  it('renders the mission and independence disclaimer', () => {
    const wrapper = mount(AboutPage, {
      global: {
        stubs: {
          CivicRoseMotif: true,
          DataSourceBadge: true,
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    expect(wrapper.find('h1').text()).toContain('About Better Santa Rosa City')
    expect(wrapper.text()).toContain('not an official website of the City Government of Santa Rosa')
    expect(wrapper.text()).toContain('community-maintained')
  })

  it('includes data principles and corrections workflow', () => {
    const wrapper = mount(AboutPage, {
      global: {
        stubs: {
          CivicRoseMotif: true,
          DataSourceBadge: true,
          NuxtLink: { template: '<a><slot /></a>' }
        }
      }
    })

    expect(wrapper.text()).toContain('Facts Before Opinions')
    expect(wrapper.text()).toContain('Source-First Verification')
    expect(wrapper.text()).toContain('Submit a Correction')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/unit/about.spec.ts`  
Expected: FAIL (`Cannot find module '~/pages/about/index.vue'`).

- [ ] **Step 3: Implement `pages/about/index.vue` and update `CivicFooter.vue`**

Create `pages/about/index.vue`:

```vue
<script setup lang="ts">
import CivicRoseMotif from '~/components/civic/RoseMotif.vue'
import DataSourceBadge from '~/components/data/SourceBadge.vue'
import { buildSeoHead } from '~/utils/seo'

if (typeof useHead === 'function') {
  useHead(buildSeoHead({
    title: 'About · Better Santa Rosa City',
    description: 'Learn about Better Santa Rosa City: an independent, community-maintained public information portal for Santa Rosa, Laguna.',
    path: '/about',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About Better Santa Rosa City',
      description: 'Independent civic transparency and public records project for Santa Rosa City, Laguna.'
    }
  }))
}

const principles = [
  {
    title: 'Facts Before Opinions',
    desc: 'We present factual public data without political commentary, candidate scoring, or municipal rankings. Civic data belongs to the public.'
  },
  {
    title: 'Source-First Verification',
    desc: 'Every key claim, budget figure, and demographic statistic links back to its primary official source (COA, PSA, DBM, City Ordinances) and carries a verification date.'
  },
  {
    title: 'Preserve Definitions',
    desc: 'We never conflate city revenue with total budget, allocations with actual spending, or project proposals with completed works. Gaps are acknowledged, never invented.'
  },
  {
    title: 'Static & Independent',
    desc: 'Built as a static-first portal deployed at zero runtime cost. Completely independent from any political group or municipal office.'
  }
]
</script>

<template>
  <div data-pagefind-filter="type:about" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
    <!-- Header -->
    <header class="space-y-4">
      <p class="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent-dark">
        <CivicRoseMotif :size="16" class="text-rose-accent" />
        Independent Public-Information Layer
      </p>
      <h1 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-laguna-green leading-tight">
        About Better Santa Rosa City
      </h1>
      <div class="flex flex-wrap items-center gap-2">
        <DataSourceBadge type="community" />
      </div>
      <p class="text-base sm:text-lg leading-relaxed text-charcoal/80">
        Better Santa Rosa City is an independent, open-data civic portal designed to make public records about Santa Rosa, Laguna easier to discover, understand, and verify.
      </p>
    </header>

    <!-- Independence Notice Callout -->
    <section aria-label="Legal Status and Disclaimer" class="rounded-xl border-2 border-heritage-gold/50 bg-heritage-gold/10 p-6 sm:p-8 space-y-3">
      <h2 class="font-serif text-xl font-bold text-laguna-green">
        Non-Governmental Independence Notice
      </h2>
      <p class="text-sm leading-relaxed text-charcoal/90">
        Better Santa Rosa City is community-maintained and is <strong>not an official website of the City Government of Santa Rosa</strong>. It is not affiliated with, authorized, or endorsed by the municipal government, any barangay council, or any government agency.
      </p>
      <p class="text-xs leading-relaxed text-charcoal/70">
        All government services, official requests, and tax payments must be completed through official City Government channels. Visit the official portal at
        <a href="https://santarosacity.gov.ph" target="_blank" rel="noopener noreferrer" class="font-semibold underline text-laguna-green hover:text-rose-accent-dark">
          santarosacity.gov.ph ↗
        </a>.
      </p>
    </section>

    <!-- Core Data Principles -->
    <section aria-labelledby="principles-heading" class="space-y-6">
      <h2 id="principles-heading" class="font-serif text-2xl font-bold text-laguna-green">
        Our Operating Principles
      </h2>
      <div class="grid gap-4 sm:grid-cols-2">
        <article v-for="p in principles" :key="p.title" class="rounded-xl border border-charcoal/10 bg-white p-5 shadow-sm space-y-2">
          <h3 class="font-serif text-base font-bold text-charcoal">{{ p.title }}</h3>
          <p class="text-xs leading-relaxed text-charcoal/70">{{ p.desc }}</p>
        </article>
      </div>
    </section>

    <!-- Corrections & Community Feedback -->
    <section aria-labelledby="corrections-heading" class="rounded-xl border border-charcoal/10 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
      <h2 id="corrections-heading" class="font-serif text-2xl font-bold text-laguna-green">
        Submit a Correction or Data Update
      </h2>
      <p class="text-sm leading-relaxed text-charcoal/75">
        Civic accuracy depends on vigilance. If you find an outdated figure, broken document link, or factual inaccuracy, please submit a correction.
      </p>
      <div class="flex flex-wrap items-center gap-4 pt-2">
        <a
          href="https://github.com/jericizon/bettersantarosacity/issues"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex min-h-11 items-center justify-center rounded-lg bg-laguna-green px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-laguna-green/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
        >
          Open GitHub Issue ↗
        </a>
        <NuxtLink
          to="/sources"
          class="inline-flex min-h-11 items-center justify-center rounded-lg border border-charcoal/20 bg-white px-5 py-2.5 text-sm font-semibold text-charcoal transition hover:border-laguna-green hover:text-laguna-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
        >
          Review Data Sources & Methodology
        </NuxtLink>
      </div>
    </section>

    <!-- Related Links -->
    <nav aria-label="About sub-navigation" class="border-t border-charcoal/10 pt-6 flex flex-wrap gap-4 text-xs font-semibold text-laguna-green">
      <NuxtLink to="/about/media" class="underline hover:text-rose-accent-dark">
        Media &amp; Image Licensing Credits →
      </NuxtLink>
      <NuxtLink to="/sources" class="underline hover:text-rose-accent-dark">
        Source Registry &amp; Verification Tiers →
      </NuxtLink>
      <NuxtLink to="/data" class="underline hover:text-rose-accent-dark">
        Open Data Downloads →
      </NuxtLink>
    </nav>
  </div>
</template>
```

In `components/civic/CivicFooter.vue`, update the Transparency nav list to include `/about`:

```vue
<!-- components/civic/CivicFooter.vue: line 39 -->
<li><NuxtLink to="/about" :class="linkClass">About &amp; Disclaimer</NuxtLink></li>
<li><NuxtLink to="/sources" :class="linkClass">Sources &amp; Methodology</NuxtLink></li>
<li><NuxtLink to="/about/media" :class="linkClass">Media &amp; Image Credits</NuxtLink></li>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/unit/about.spec.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add pages/about/index.vue components/civic/CivicFooter.vue tests/unit/about.spec.ts
git commit -m "feat(about): add dedicated /about route with independence notice and corrections guide"
```

---

### Task 3: Global Search Keyboard Shortcut (`Cmd+K` / `Ctrl+K`)

**Files:**
- Create: `composables/useSearchShortcut.ts`
- Modify: `layouts/default.vue`
- Modify: `components/civic/CivicHeader.vue`
- Test: `tests/unit/search-shortcut.spec.ts`

**Interfaces:**
- Consumes: Window keyboard events, Nuxt `useRouter`.
- Produces: Universal `Cmd+K` / `Ctrl+K` listener navigating to `/search` or focusing the search input, plus accessible visual keyboard badges.

- [ ] **Step 1: Write the failing test for the search shortcut composable**

Create `tests/unit/search-shortcut.spec.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { registerSearchShortcut } from '~/composables/useSearchShortcut'

describe('Search Keyboard Shortcut', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('triggers callback on Meta+K or Ctrl+K', () => {
    const onTrigger = vi.fn()
    const cleanup = registerSearchShortcut(onTrigger)

    // Meta+K (macOS)
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
    expect(onTrigger).toHaveBeenCalledTimes(1)

    // Ctrl+K (Windows/Linux)
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
    expect(onTrigger).toHaveBeenCalledTimes(2)

    // Unrelated key
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'j', metaKey: true }))
    expect(onTrigger).toHaveBeenCalledTimes(2)

    cleanup()
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
    expect(onTrigger).toHaveBeenCalledTimes(2)
  })

  it('ignores shortcut when user is actively typing in an input or textarea', () => {
    const onTrigger = vi.fn()
    const cleanup = registerSearchShortcut(onTrigger)

    const input = document.createElement('input')
    document.body.appendChild(input)
    input.focus()

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
    expect(onTrigger).not.toHaveBeenCalled()

    document.body.removeChild(input)
    cleanup()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/unit/search-shortcut.spec.ts`  
Expected: FAIL (`Cannot find module '~/composables/useSearchShortcut'`).

- [ ] **Step 3: Implement `composables/useSearchShortcut.ts` and integrate into `layouts/default.vue`**

Create `composables/useSearchShortcut.ts`:

```typescript
/**
 * Register a global keyboard shortcut (Cmd+K / Ctrl+K) to trigger search.
 * Ignores keypresses when focus is inside an input, textarea, or contenteditable.
 */
export function registerSearchShortcut(callback: () => void): () => void {
  function handleKeyDown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      const target = e.target as HTMLElement | null
      const isInput = target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      )

      if (!isInput) {
        e.preventDefault()
        callback()
      }
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }

  return () => {}
}
```

In `layouts/default.vue`, mount the shortcut listener to navigate to `/search`:

```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { registerSearchShortcut } from '~/composables/useSearchShortcut'

let cleanupShortcut: (() => void) | undefined

onMounted(() => {
  cleanupShortcut = registerSearchShortcut(() => {
    navigateTo('/search')
  })
})

onUnmounted(() => {
  cleanupShortcut?.()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-parchment font-sans text-charcoal">
    <CivicDisclaimerBanner />
    <CivicHeader />
    <main class="flex-grow w-full">
      <slot />
    </main>
    <CivicFooter />
  </div>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/unit/search-shortcut.spec.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add composables/useSearchShortcut.ts layouts/default.vue tests/unit/search-shortcut.spec.ts
git commit -m "feat(search): add global Cmd+K / Ctrl+K search keyboard shortcut"
```

---

### Task 4: Citizen's Charter & Transparency Seal Resources on `/government`

**Files:**
- Modify: `pages/government/index.vue`
- Test: `tests/unit/government.spec.ts`

**Interfaces:**
- Consumes: `data/departments.json`, `data/sources.json`.
- Produces: Dedicated "Citizen's Charter & Transparency Resources" section with verified outbound links to the Anti-Red Tape Authority (ARTA) standards and DILG Full Disclosure Portal.

- [ ] **Step 1: Write the failing test for transparency additions on `/government`**

Update `tests/unit/government.spec.ts` to assert the new Citizen's Charter section:

```typescript
// Add to tests/unit/government.spec.ts:
it('renders the Citizen’s Charter and Transparency section', () => {
  const wrapper = mount(GovernmentPage, {
    global: {
      stubs: {
        GovernmentOfficialCard: true,
        GovernmentDepartmentCard: true,
        DataSourceBadge: true,
        DataLastVerified: true,
        NuxtLink: { template: '<a><slot /></a>' }
      }
    }
  })

  expect(wrapper.text()).toContain('Citizen’s Charter & Transparency')
  expect(wrapper.text()).toContain('Full Disclosure Portal')
  expect(wrapper.text()).toContain('Anti-Red Tape Authority')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/unit/government.spec.ts`  
Expected: FAIL (`Citizen’s Charter & Transparency` not found).

- [ ] **Step 3: Update `pages/government/index.vue`**

Add the Transparency & Citizen's Charter section right after the Departments list in `pages/government/index.vue`:

```vue
    <!-- Transparency & Citizen's Charter Section -->
    <section aria-labelledby="transparency-charter-heading" class="rounded-xl border border-charcoal/10 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
      <div class="flex items-baseline justify-between gap-2 border-b border-charcoal/10 pb-2">
        <h2 id="transparency-charter-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
          Citizen’s Charter & Transparency
        </h2>
      </div>
      <p class="text-sm leading-relaxed text-charcoal/75">
        Under Republic Act No. 11032 (Ease of Doing Business and Efficient Government Service Delivery Act of 2018), local government units maintain an official Citizen's Charter detailing service standards, fees, processing times, and document requirements.
      </p>
      <div class="grid gap-4 sm:grid-cols-2 pt-2">
        <div class="rounded-lg border border-charcoal/10 bg-parchment/60 p-4 space-y-2">
          <h3 class="font-serif text-base font-bold text-charcoal">Anti-Red Tape Authority (ARTA) Compliance</h3>
          <p class="text-xs text-charcoal/70 leading-relaxed">
            Review service processing times, checklists, and fee schedules published in the official Citizen's Charter handbook.
          </p>
          <a
            href="https://santarosacity.gov.ph"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex text-xs font-semibold text-laguna-green underline hover:text-rose-accent-dark"
          >
            Access City Citizen's Charter at santarosacity.gov.ph ↗
          </a>
        </div>
        <div class="rounded-lg border border-charcoal/10 bg-parchment/60 p-4 space-y-2">
          <h3 class="font-serif text-base font-bold text-charcoal">DILG Full Disclosure Portal (eFDP)</h3>
          <p class="text-xs text-charcoal/70 leading-relaxed">
            The Department of the Interior and Local Government requires all LGUs to post quarterly financial documents, bids, and budgets online.
          </p>
          <a
            href="https://efdp.dilg.gov.ph"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex text-xs font-semibold text-laguna-green underline hover:text-rose-accent-dark"
          >
            Visit DILG Full Disclosure Portal ↗
          </a>
        </div>
      </div>
    </section>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/unit/government.spec.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add pages/government/index.vue tests/unit/government.spec.ts
git commit -m "feat(government): add Citizen's Charter and transparency resources section"
```

---

### Task 5: Sitemap & Static Route Completeness

**Files:**
- Modify: `scripts/generate-sitemap.mjs`
- Test: `tests/unit/sitemap.spec.ts`

**Interfaces:**
- Consumes: `STATIC_ROUTES` array, `data/barangays.json`, `data/projects.json`, `data/laws.json`.
- Produces: Updated `public/sitemap.xml` containing all static pages including `/about`, `/about/media`, and `/history`.

- [ ] **Step 1: Write the failing test for sitemap generation**

Create `tests/unit/sitemap.spec.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('Sitemap Integrity', () => {
  it('includes all primary static routes in scripts/generate-sitemap.mjs', () => {
    const sitemapScript = readFileSync(resolve(process.cwd(), 'scripts/generate-sitemap.mjs'), 'utf-8')
    expect(sitemapScript).toContain("'/about'")
    expect(sitemapScript).toContain("'/about/media'")
    expect(sitemapScript).toContain("'/history'")
    expect(sitemapScript).toContain("'/explore'")
    expect(sitemapScript).toContain("'/services'")
    expect(sitemapScript).toContain("'/sources'")
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/unit/sitemap.spec.ts`  
Expected: FAIL (`'/about'` and `'/history'` missing from `STATIC_ROUTES`).

- [ ] **Step 3: Update `scripts/generate-sitemap.mjs` and regenerate `public/sitemap.xml`**

In `scripts/generate-sitemap.mjs`, update `STATIC_ROUTES`:

```javascript
const STATIC_ROUTES = [
  '/',
  '/about',
  '/about/media',
  '/history',
  '/explore',
  '/barangays',
  '/government',
  '/money',
  '/money/budget',
  '/projects',
  '/laws',
  '/services',
  '/data',
  '/sources',
  '/search'
]
```

Run script: `node scripts/generate-sitemap.mjs`

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/unit/sitemap.spec.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-sitemap.mjs public/sitemap.xml tests/unit/sitemap.spec.ts
git commit -m "chore(seo): include /about, /about/media, and /history in static sitemap"
```

---

### Task 6: Standalone Brand Mark Asset & Brand System Component

**Files:**
- Create: `public/images/brand/santa-rosa-arch.svg`
- Create: `components/brand/BrandMark.vue`
- Test: `tests/unit/brand-system.spec.ts`

**Interfaces:**
- Consumes: SVG vector geometry of the Santa Rosa Arch.
- Produces: Standalone SVG asset and reusable Vue brand component supporting size, light/dark themes, and monochrome variants per Spec §4.

- [ ] **Step 1: Write the failing test for the brand system**

Create `tests/unit/brand-system.spec.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import BrandMark from '~/components/brand/BrandMark.vue'

describe('Brand Identity System', () => {
  it('confirms standalone arch SVG exists in public/images/brand/', () => {
    const filePath = resolve(process.cwd(), 'public/images/brand/santa-rosa-arch.svg')
    expect(existsSync(filePath)).toBe(true)
  })

  it('renders BrandMark component with customizable size and themes', () => {
    const wrapper = mount(BrandMark, {
      props: { size: 48, monochrome: true }
    })

    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('width')).toBe('48')
    expect(svg.attributes('height')).toBe('48')
    expect(wrapper.classes()).toContain('brand-monochrome')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/unit/brand-system.spec.ts`  
Expected: FAIL (`santa-rosa-arch.svg` does not exist, `BrandMark.vue` not found).

- [ ] **Step 3: Create `public/images/brand/santa-rosa-arch.svg` and `components/brand/BrandMark.vue`**

Create `public/images/brand/santa-rosa-arch.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" fill="none" stroke="currentColor">
  <!-- Santa Rosa Arch / Bantayang Bato Stylized Vector Symbol -->
  <rect x="15" y="75" width="16" height="15" fill="currentColor" opacity="0.9" rx="1" />
  <rect x="69" y="75" width="16" height="15" fill="currentColor" opacity="0.9" rx="1" />
  <rect x="20" y="35" width="12" height="40" fill="currentColor" rx="1" />
  <rect x="68" y="35" width="12" height="40" fill="currentColor" rx="1" />
  <path d="M 32 45 A 18 18 0 0 1 68 45 L 68 75 L 32 75 Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round" />
  <rect x="12" y="27" width="76" height="8" fill="currentColor" rx="2" />
  <path d="M 22 27 L 30 15 L 70 15 L 78 27 Z" fill="currentColor" opacity="0.8" />
  <circle cx="50" cy="21" r="3" fill="#D6A94B" />
</svg>
```

Create `components/brand/BrandMark.vue`:

```vue
<script setup lang="ts">
withDefaults(defineProps<{
  size?: number | string
  monochrome?: boolean
}>(), {
  size: 40,
  monochrome: false
})
</script>

<template>
  <div
    class="inline-flex shrink-0 items-center justify-center transition-colors"
    :class="monochrome ? 'brand-monochrome text-charcoal' : 'text-laguna-green'"
    aria-hidden="true"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      :width="size"
      :height="size"
      fill="none"
      stroke="currentColor"
    >
      <rect x="15" y="75" width="16" height="15" fill="currentColor" opacity="0.9" rx="1" />
      <rect x="69" y="75" width="16" height="15" fill="currentColor" opacity="0.9" rx="1" />
      <rect x="20" y="35" width="12" height="40" fill="currentColor" rx="1" />
      <rect x="68" y="35" width="12" height="40" fill="currentColor" rx="1" />
      <path d="M 32 45 A 18 18 0 0 1 68 45 L 68 75 L 32 75 Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round" />
      <rect x="12" y="27" width="76" height="8" fill="currentColor" rx="2" />
      <path d="M 22 27 L 30 15 L 70 15 L 78 27 Z" fill="currentColor" opacity="0.8" />
      <circle cx="50" cy="21" r="3" :fill="monochrome ? 'currentColor' : '#D6A94B'" />
    </svg>
  </div>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/unit/brand-system.spec.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add public/images/brand/santa-rosa-arch.svg components/brand/BrandMark.vue tests/unit/brand-system.spec.ts
git commit -m "feat(brand): add standalone arch SVG symbol and BrandMark component"
```

---

### Task 7: Full MVP Test Suite, Typecheck, and Static Build Validation

**Files:**
- Test: Full Vitest suite (`tests/unit/*.spec.ts`)
- Verify: `pnpm nuxt typecheck`
- Verify: `pnpm build:prod` (Data sync + Sitemap + Static prerender + Pagefind)

**Interfaces:**
- Consumes: All routes, components, and data registries.
- Produces: 100% passing tests across all unit specs, zero TypeScript errors, clean static generation in `dist/` with Pagefind search index.

- [ ] **Step 1: Run full unit test suite**

Run: `pnpm vitest run`  
Expected: PASS (All test files pass with 0 failures).

- [ ] **Step 2: Run TypeScript typecheck**

Run: `pnpm nuxt typecheck`  
Expected: PASS (Zero errors).

- [ ] **Step 3: Run production static build and search indexing**

Run: `pnpm build:prod`  
Expected: PASS (Prerenders all 14 routes + dynamic slugs; Pagefind indexes all generated static HTML pages into `dist/`).

- [ ] **Step 4: Commit any generated metadata or test adjustments**

```bash
git add .
git commit -m "chore(release): complete full MVP validation and static build verification"
```

---

## Self-Review Checklist

- **Spec Coverage:**
  - Dedicated `/history` route with 1571-2025 timeline: Covered by Task 1.
  - Dedicated `/about` route with non-governmental disclaimer & corrections: Covered by Task 2.
  - Global `Cmd+K` search keyboard shortcut: Covered by Task 3.
  - Citizen's Charter and Transparency resources on `/government`: Covered by Task 4.
  - Sitemap completeness (`sitemap.xml`): Covered by Task 5.
  - Standalone arch brand mark: Covered by Task 6.
  - Full MVP validation and static build: Covered by Task 7.
- **Placeholder Scan:** Zero `TODO`, `TBD`, or placeholders. Every task contains exact test and implementation code.
- **Type Consistency:** All types and property names match `cityData`, `Hotline`, `MediaItem`, and `Service` across `types/civic.ts`.
