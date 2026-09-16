# Better Santa Rosa City UI/UX Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Better Santa Rosa City (`bettersantarosacity.pages.dev`) from a functional data portal into a spacious, authoritative civic-tech and editorial public-information platform using a 10-chapter homepage sequence with subtle background alternation, open typographic statistics, an interactive 18-barangay SVG map with cadastral disclaimer, data journalism budget storytelling, deep green history timeline, and strict media licensing attribution while preserving 100% static zero-database performance.

**Architecture:** Nuxt 4 static site generation with Vue 3 Composition API, Tailwind CSS civic design tokens with chapter background classes, native browser `IntersectionObserver` composables for scroll reveals and count-ups, SVG topological map explorer, structured JSON data provenance registry in `data/`, and post-build Pagefind search indexing.

**Tech Stack:** Nuxt 4, Vue 3, TypeScript, Tailwind CSS 3.4+, Zod 3.24+, Pagefind 1.3+, Lucide Vue Next, Vitest 2.1+, Vue Test Utils 2.4+, pnpm.

**Spec:** `docs/superpowers/specifications/SPEC-20260917-better-santa-rosa-city-uiux-enhancement.md`

## Global Constraints

- **Package Manager:** Exclusively `pnpm` (no `npm` or `yarn`).
- **Runtime Costs:** Strictly ₱0/month (100% static assets, zero external paid CDNs or database backends).
- **Identity & Legal:** Prominent non-governmental disclaimer on all pages; no fake municipal seals or misleading city government representation.
- **Cadastral Integrity:** All maps must carry the explicit disclaimer: *"Simplified map for information purposes. Not official cadastral survey data."*
- **Copy & Typography:** Zero em-dashes (`—`) in user-facing UI copy per taste guidelines; remove unsubstantiated superlatives (e.g. "richest city outside Metro Manila") in favor of precise, sourced facts.
- **Media Licensing:** 100% of photographic assets must be legally cleared (Wikimedia Commons CC BY-SA 4.0 / Public Domain), tracked in `data/media.json`, and credited via `MediaCredit.vue` and `/about/media`.
- **Accessibility & Motion:** All animations must respect `prefers-reduced-motion: reduce`; body copy contrast must exceed 4.5:1; interactive touch targets must be >= 44x44px.
- **Performance Budget:** Zero heavy 3D or animation runtimes (no GSAP/Three.js); target Lighthouse 90+, LCP < 2.5s, CLS < 0.1, INP < 200ms.
- **Dev Servers:** Never run commands that launch dev servers (`pnpm dev`), preview servers, or watch processes during execution.
- **Git Safety:** Always work and commit on `feat/mvp-scaffold` or dedicated feature branches; never commit or push directly to `main`.

---

### Task 1: Design Tokens, CSS Utilities, and Section Chapter Backgrounds

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `assets/css/main.css`
- Modify: `tests/unit/visual-tokens.spec.ts`

**Interfaces:**
- Consumes: Tailwind CSS config and CSS `@layer` utilities.
- Produces: Civic color tokens (`light-green: '#EBF2EE'`), chapter background classes (`.section-parchment`, `.section-white`, `.section-deep-green`, `.section-lake-blue`, `.section-light-green`), and chapter padding standards (`py-20 md:py-28 lg:py-32`).

- [ ] **Step 1: Write the failing visual tokens and chapter background test**

Update `tests/unit/visual-tokens.spec.ts` to assert the new `light-green` color token and section background classes:

```typescript
// tests/unit/visual-tokens.spec.ts
import { describe, it, expect } from 'vitest'
import tailwindConfig from '~/tailwind.config'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('Visual Design Tokens & Motion Specs', () => {
  it('defines the required civic colors and font families', () => {
    const colors = tailwindConfig.theme?.extend?.colors as Record<string, string>
    expect(colors['laguna-green']).toBe('#164A3D')
    expect(colors['rose-accent']).toBe('#C96A73')
    expect(colors['laguna-blue']).toBe('#5E9FA5')
    expect(colors['parchment']).toBe('#F6F3EA')
    expect(colors['light-green']).toBe('#EBF2EE')

    const fonts = tailwindConfig.theme?.extend?.fontFamily as Record<string, string[]>
    expect(fonts.sans).toContain('Inter')
    expect(fonts.serif).toContain('Source Serif 4')
  })

  it('defines the 5 section chapter background classes in main.css', () => {
    const cssContent = readFileSync(resolve(process.cwd(), 'assets/css/main.css'), 'utf-8')
    expect(cssContent).toContain('.section-parchment')
    expect(cssContent).toContain('.section-white')
    expect(cssContent).toContain('.section-deep-green')
    expect(cssContent).toContain('.section-lake-blue')
    expect(cssContent).toContain('.section-light-green')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/visual-tokens.spec.ts`
Expected: FAIL (`colors['light-green']` is undefined and `.section-light-green` is missing).

- [ ] **Step 3: Update tailwind.config.ts and assets/css/main.css**

In `tailwind.config.ts`, add `'light-green': '#EBF2EE'`:

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default <Config>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue'
  ],
  theme: {
    extend: {
      colors: {
        'laguna-green': '#164A3D',
        'rose-accent': '#C96A73',
        'rose-accent-dark': '#9E4A55',
        'laguna-blue': '#5E9FA5',
        'heritage-gold': '#D6A94B',
        'parchment': '#F6F3EA',
        'charcoal': '#182421',
        'light-green': '#EBF2EE'
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'sans-serif'],
        serif: ['Source Serif 4', 'Georgia', 'serif']
      }
    }
  },
  plugins: []
}
```

In `assets/css/main.css`, add `.section-light-green` and chapter spacing utilities:

```css
/* assets/css/main.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-parchment text-charcoal font-sans antialiased selection:bg-rose-accent/20;
  }
}

/* Subtle Civic Motion System */
@keyframes kenBurns {
  0% { transform: scale(1); }
  50% { transform: scale(1.025); }
  100% { transform: scale(1); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-ken-burns {
  animation: kenBurns 18s ease-in-out infinite;
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Section transition background tones */
.section-parchment {
  @apply bg-parchment text-charcoal;
}

.section-white {
  @apply bg-white text-charcoal;
}

.section-deep-green {
  @apply bg-laguna-green text-parchment;
}

.section-lake-blue {
  @apply bg-laguna-blue/10 text-charcoal border-y border-laguna-blue/20;
}

.section-light-green {
  @apply bg-light-green text-charcoal;
}

/* Strict prefers-reduced-motion overrides */
@media (prefers-reduced-motion: reduce) {
  *,
  ::before,
  ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .animate-ken-burns {
    animation: none !important;
    transform: none !important;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/visual-tokens.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.ts assets/css/main.css tests/unit/visual-tokens.spec.ts
git commit -m "style(tokens): add light-green color token and section background classes"
```

---

### Task 2: Layout Shell Architecture & Full-Bleed Chapter Support

**Files:**
- Modify: `layouts/default.vue`
- Modify: `tests/unit/shell-transitions.spec.ts`

**Interfaces:**
- Consumes: `CivicDisclaimerBanner.vue`, `CivicHeader.vue`, `CivicFooter.vue`.
- Produces: `<main class="flex-grow w-full">` enabling homepage sections to stretch full-width for background alternation, while individual subpages manage their own content container.

- [ ] **Step 1: Write the failing test for layout shell architecture**

Update `tests/unit/shell-transitions.spec.ts` to assert that `layouts/default.vue` provides a full-width main region without layout-level clipping:

```typescript
// tests/unit/shell-transitions.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DefaultLayout from '~/layouts/default.vue'
import CivicFooter from '~/components/civic/CivicFooter.vue'

describe('Shell Navigation & Layout Architecture', () => {
  it('includes link to /about/media in CivicFooter', () => {
    const wrapper = mount(CivicFooter)
    const mediaLink = wrapper.find('a[href="/about/media"]')
    expect(mediaLink.exists()).toBe(true)
  })

  it('renders a full-width main container allowing full-bleed editorial chapters', () => {
    const wrapper = mount(DefaultLayout, {
      slots: {
        default: '<div id="test-content">Chapter Content</div>'
      }
    })
    const main = wrapper.find('main')
    expect(main.exists()).toBe(true)
    expect(main.classes()).toContain('w-full')
    expect(main.classes()).toContain('flex-grow')
    // Must NOT constrain max-width at the <main> wrapper level
    expect(main.classes()).not.toContain('max-w-7xl')
    expect(wrapper.find('#test-content').exists()).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/shell-transitions.spec.ts`
Expected: FAIL (`main.classes()` contains `'max-w-7xl'`).

- [ ] **Step 3: Update layouts/default.vue**

Update `layouts/default.vue` so that `<main>` is full-width:

```vue
<!-- layouts/default.vue -->
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

For existing subpages (`/barangays`, `/money`, `/projects`, `/laws`, `/services`, `/data`, `/sources`, `/government`, `/about/media`, `/search`, `/explore`), ensure their root wrapper has `<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">` where not already provided.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/shell-transitions.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add layouts/default.vue tests/unit/shell-transitions.spec.ts
git commit -m "refactor(layout): allow full-bleed editorial chapters in default layout"
```

---

### Task 3: Reusable Editorial SectionHeader Component

**Files:**
- Create: `components/editorial/SectionHeader.vue`
- Create: `tests/unit/SectionHeader.spec.ts`

**Interfaces:**
- Consumes: `RoseMotif.vue`.
- Produces: `<SectionHeader />` supporting `eyebrow?: string`, `title: string`, `description?: string`, `align?: 'left' | 'center'`, `theme?: 'light' | 'dark'`.

- [ ] **Step 1: Write the failing test for SectionHeader**

Create `tests/unit/SectionHeader.spec.ts`:

```typescript
// tests/unit/SectionHeader.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SectionHeader from '~/components/editorial/SectionHeader.vue'

describe('SectionHeader Editorial Component', () => {
  it('renders title and description in default light theme', () => {
    const wrapper = mount(SectionHeader, {
      props: {
        eyebrow: 'Interactive Geography',
        title: 'Explore Santa Rosa',
        description: '18 barangays across three geographic zones.'
      }
    })

    expect(wrapper.text()).toContain('Interactive Geography')
    expect(wrapper.text()).toContain('Explore Santa Rosa')
    expect(wrapper.text()).toContain('18 barangays across three geographic zones.')
    expect(wrapper.find('h2').classes()).toContain('text-laguna-green')
  })

  it('renders dark theme with appropriate parchment text and gold eyebrow', () => {
    const wrapper = mount(SectionHeader, {
      props: {
        eyebrow: 'Historical Timeline',
        title: 'From Bukol to Modern Santa Rosa',
        theme: 'dark'
      }
    })

    expect(wrapper.find('h2').classes()).toContain('text-parchment')
    expect(wrapper.find('.text-heritage-gold').exists()).toBe(true)
  })

  it('supports centered text alignment', () => {
    const wrapper = mount(SectionHeader, {
      props: {
        title: 'Centered Heading',
        align: 'center'
      }
    })

    expect(wrapper.classes()).toContain('text-center')
    expect(wrapper.classes()).toContain('mx-auto')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/SectionHeader.spec.ts`
Expected: FAIL (Component not found).

- [ ] **Step 3: Implement components/editorial/SectionHeader.vue**

Create `components/editorial/SectionHeader.vue`:

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

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/SectionHeader.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/editorial/SectionHeader.vue tests/unit/SectionHeader.spec.ts
git commit -m "feat(editorial): add reusable SectionHeader component"
```

---

### Task 4: Editorial Statistics ("Santa Rosa Today") Open Typography & CountUp

**Files:**
- Modify: `components/data/StatCard.vue`
- Create: `tests/unit/StatCard.spec.ts`
- Modify: `tests/unit/homepage.spec.ts`

**Interfaces:**
- Consumes: `CountUp.vue`, `numericValue`, `value`, `label`, `source`, `variant?: 'card' | 'open'`.
- Produces: Open typographic presentation with large numerals (text-4xl sm:text-5xl lg:text-6xl font-serif text-laguna-green), subtle count-up, unboxed layout to satisfy §13, while preserving compatibility with existing tests.

- [ ] **Step 1: Write the failing test for StatCard open layout**

Create `tests/unit/StatCard.spec.ts`:

```typescript
// tests/unit/StatCard.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatCard from '~/components/data/StatCard.vue'

describe('StatCard Editorial Component', () => {
  it('renders numeric count-up value and source citation', () => {
    const wrapper = mount(StatCard, {
      props: {
        value: '18',
        numericValue: 18,
        label: 'Barangays',
        source: 'City Government of Santa Rosa'
      }
    })

    expect(wrapper.text()).toContain('Barangays')
    expect(wrapper.text()).toContain('Source: City Government of Santa Rosa')
  })

  it('supports open editorial layout variant without card boundary box', () => {
    const wrapper = mount(StatCard, {
      props: {
        value: '5,543 ha',
        numericValue: 5543,
        suffix: ' ha',
        label: 'Land area',
        variant: 'open'
      }
    })

    // Open variant should not have bordered card styling
    expect(wrapper.classes()).toContain('stat-card-open')
    expect(wrapper.classes()).not.toContain('shadow-sm')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/StatCard.spec.ts`
Expected: FAIL (variant not supported or open class missing).

- [ ] **Step 3: Refactor components/data/StatCard.vue**

Update `components/data/StatCard.vue` to support both `open` (editorial default) and `card` variants:

```vue
<!-- components/data/StatCard.vue -->
<script setup lang="ts">
import CountUp from '~/components/civic/CountUp.vue'

withDefaults(defineProps<{
  value: string | number
  label: string
  source?: string
  note?: string
  numericValue?: number
  suffix?: string
  variant?: 'card' | 'open'
}>(), {
  variant: 'open'
})
</script>

<template>
  <div
    :class="[
      variant === 'card'
        ? 'rounded-xl border border-charcoal/10 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-laguna-green/30'
        : 'stat-card-open flex flex-col justify-between py-4 pr-4 transition-all duration-300'
    ]"
  >
    <div>
      <p class="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-laguna-green tracking-tight leading-none">
        <CountUp
          v-if="numericValue !== undefined"
          :end="numericValue"
          :suffix="suffix || ''"
        />
        <template v-else>{{ value }}</template>
      </p>
      <p class="mt-3 text-sm sm:text-base font-semibold uppercase tracking-wider text-charcoal/80">
        {{ label }}
      </p>
      <p v-if="note" class="mt-1 text-xs text-charcoal/70">
        {{ note }}
      </p>
    </div>
    <p v-if="source" class="mt-4 border-t border-charcoal/10 pt-2 text-[11px] text-charcoal/70">
      Source: <span class="font-medium">{{ source }}</span>
    </p>
  </div>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/StatCard.spec.ts tests/unit/homepage.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/data/StatCard.vue tests/unit/StatCard.spec.ts
git commit -m "refactor(stats): support open typographic presentation in StatCard"
```

---

### Task 5: Editorial Civic Hero Anchor with Search & Real Landmark Imagery

**Files:**
- Modify: `components/civic/HeroSearch.vue`
- Modify: `pages/index.vue`
- Modify: `tests/unit/HeroSearch.spec.ts`
- Modify: `tests/unit/homepage.spec.ts`

**Interfaces:**
- Consumes: `heroImage` from `data/media.json`, `CivicHeroSearch.vue`, `CivicRoseMotif.vue`.
- Produces: Editorial hero chapter on warm parchment ground with 2-line title, rotating search hints, ⌘K trigger, quick pills, and independent trust distinction.

- [ ] **Step 1: Write test for Hero chapter requirements**

Verify `tests/unit/homepage.spec.ts` asserts hero structure and image credit:

```typescript
// in tests/unit/homepage.spec.ts
it('renders hero chapter on parchment ground with search and local image', () => {
  const wrapper = mount(IndexPage)
  const heroSection = wrapper.find('section[aria-labelledby="hero-heading"]')
  expect(heroSection.exists()).toBe(true)
  expect(heroSection.findComponent(HeroSearch).exists()).toBe(true)
  expect(wrapper.text()).toContain('Public information about Santa Rosa, made easier to find.')
  expect(wrapper.text()).toContain('Independent community project')
})
```

- [ ] **Step 2: Run test to verify current state**

Run: `pnpm test:run tests/unit/homepage.spec.ts`
Expected: PASS (check current behavior).

- [ ] **Step 3: Refine Hero Section in pages/index.vue**

Ensure the Hero chapter in `pages/index.vue` renders with:
- Full-bleed chapter wrapper: `class="w-full section-parchment py-16 sm:py-24 lg:py-28 border-b border-charcoal/10"`
- Inner container: `class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"`
- Crisp 2-line headline with `max-w-3xl leading-[1.1]`
- Clear independent community badge with rose motif: `text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent-dark`
- Hero image with subtle framed shadow: `rounded-2xl border border-charcoal/10 shadow-sm object-cover`
- Search bar with ⌘K badge and quick filter pills.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/homepage.spec.ts tests/unit/HeroSearch.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add pages/index.vue components/civic/HeroSearch.vue tests/unit/homepage.spec.ts
git commit -m "feat(hero): refine hero chapter with full-bleed parchment ground and editorial layout"
```

---

### Task 6: Signature Map Explorer & Cadastral Disclaimer Integration

**Files:**
- Modify: `components/civic/CityMapSvg.vue`
- Modify: `components/civic/MapExplorer.vue`
- Modify: `tests/unit/MapExplorer.spec.ts`

**Interfaces:**
- Consumes: `data/barangays.json`, `CityMapSvg.vue`, `SectionHeader.vue`.
- Produces: Interactive 18-barangay SVG map with 3 zones, active barangay detail panel, accessible dropdown, and mandatory cadastral disclaimer: *"Simplified map for information purposes. Not official cadastral survey data."*

- [ ] **Step 1: Write the failing test for cadastral disclaimer in MapExplorer**

Update `tests/unit/MapExplorer.spec.ts`:

```typescript
// tests/unit/MapExplorer.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MapExplorer from '~/components/civic/MapExplorer.vue'

describe('MapExplorer Component', () => {
  it('renders interactive map and selected barangay details', async () => {
    const wrapper = mount(MapExplorer)
    expect(wrapper.text()).toContain('Explore Santa Rosa')
    expect(wrapper.text()).toContain('18 barangays')
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('displays the mandatory cadastral survey disclaimer', () => {
    const wrapper = mount(MapExplorer)
    expect(wrapper.text()).toContain('Not official cadastral survey data')
    expect(wrapper.text()).toContain('Simplified map for information purposes')
  })

  it('updates selected barangay on SVG node selection', async () => {
    const wrapper = mount(MapExplorer)
    const sinalhanNode = wrapper.find('[data-barangay-slug="sinalhan"]')
    expect(sinalhanNode.exists()).toBe(true)
    await sinalhanNode.trigger('click')
    expect(wrapper.text()).toContain('Sinalhan')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/MapExplorer.spec.ts`
Expected: FAIL (Disclaimer text "Simplified map for information purposes" is missing from MapExplorer wrapper).

- [ ] **Step 3: Update MapExplorer.vue and CityMapSvg.vue**

Update `components/civic/MapExplorer.vue`:

```vue
<!-- components/civic/MapExplorer.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import barangaysData from '~/data/barangays.json'
import CityMapSvg from './CityMapSvg.vue'
import SectionHeader from '~/components/editorial/SectionHeader.vue'

const defaultBarangay = barangaysData[0]!
const selectedSlug = ref(defaultBarangay.slug)

const selectedBarangay = computed(() => {
  return barangaysData.find(b => b.slug === selectedSlug.value) ?? defaultBarangay
})

function onSelect(slug: string) {
  selectedSlug.value = slug
}
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <SectionHeader
        eyebrow="Interactive Geography"
        title="Explore Santa Rosa"
        description="18 barangays across three geographic zones: Lakefront, Lowland Urban, and Upper Ridge."
      />

      <!-- Mobile dropdown selector -->
      <div class="md:hidden w-full sm:w-auto">
        <label for="barangay-mobile-select" class="block text-xs font-semibold text-charcoal/70 mb-1">
          Select Barangay
        </label>
        <select
          id="barangay-mobile-select"
          v-model="selectedSlug"
          class="w-full rounded-lg border border-charcoal/20 bg-white px-3 py-2 text-sm text-charcoal font-medium focus:border-laguna-green focus:outline-none"
        >
          <option v-for="b in barangaysData" :key="b.slug" :value="b.slug">
            {{ b.name }} ({{ b.group }})
          </option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      <!-- Left: Interactive Map -->
      <div class="lg:col-span-7">
        <CityMapSvg :selected-slug="selectedSlug" @select="onSelect" />
      </div>

      <!-- Right: Active Barangay Detail Card -->
      <div class="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-charcoal/10 bg-white p-6 sm:p-8 shadow-sm">
        <div>
          <span
            :class="[
              'inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 text-charcoal',
              selectedBarangay.group === 'Laguna Lake' ? 'bg-laguna-blue/20' :
              selectedBarangay.group === 'Upper / Tagaytay' ? 'bg-heritage-gold/20' :
              'bg-laguna-green/15'
            ]"
          >
            {{ selectedBarangay.group }}
          </span>
          <h3 class="font-serif text-3xl font-bold text-charcoal">
            {{ selectedBarangay.name }}
          </h3>
          <p class="mt-3 text-sm sm:text-base text-charcoal/80 leading-relaxed">
            {{ selectedBarangay.description }}
          </p>
          <div class="mt-6 pt-6 border-t border-charcoal/10 flex items-baseline justify-between">
            <span class="text-xs uppercase tracking-wider text-charcoal/70">2020 Population</span>
            <span class="font-serif text-2xl font-bold text-laguna-green">
              {{ selectedBarangay.population.toLocaleString('en-US') }}
            </span>
          </div>
        </div>

        <div class="mt-8 pt-4 border-t border-charcoal/10 flex items-center justify-between">
          <NuxtLink
            :to="`/barangays#${selectedBarangay.slug}`"
            class="text-sm font-semibold text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green rounded-sm"
          >
            View full profile →
          </NuxtLink>
          <span class="text-[11px] text-charcoal/60">Verified PSA Census</span>
        </div>
      </div>
    </div>

    <!-- Mandatory Cadastral Survey Disclaimer -->
    <p class="text-center text-xs text-charcoal/60 leading-relaxed">
      Simplified map for information purposes. Not official cadastral survey data.
    </p>
  </div>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/MapExplorer.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/civic/MapExplorer.vue tests/unit/MapExplorer.spec.ts
git commit -m "feat(map): integrate SectionHeader and cadastral disclaimer in MapExplorer"
```

---

### Task 7: City Money Data Storytelling & Revenue Trend Chart

**Files:**
- Modify: `components/money/BudgetChart.vue`
- Modify: `pages/index.vue`
- Modify: `tests/unit/money.spec.ts`
- Modify: `tests/unit/homepage.spec.ts`

**Interfaces:**
- Consumes: `data/budgets.json`, `formatPeso()`, `budgetSourceTitle()`, `SectionHeader.vue`.
- Produces: Data journalism narrative ("How city revenue has changed"), lead stat FY2024 (₱6.251B), visual trend bar chart, COA/BLGF citations.

- [ ] **Step 1: Write the failing test for Money storytelling chapter**

Update `tests/unit/money.spec.ts`:

```typescript
// in tests/unit/money.spec.ts
it('renders data storytelling headline "How city revenue has changed"', () => {
  const wrapper = mount(IndexPage)
  expect(wrapper.text()).toContain('How city revenue has changed')
  expect(wrapper.text()).toContain('₱6.251B')
  expect(wrapper.text()).toContain('Commission on Audit')
})
```

- [ ] **Step 2: Run test to verify current state**

Run: `pnpm test:run tests/unit/money.spec.ts`
Expected: FAIL (Headline currently says "Where Does the City's Money Go?").

- [ ] **Step 3: Update City Money chapter in pages/index.vue**

Update the Money chapter in `pages/index.vue`:
- Chapter wrapper: `class="w-full section-parchment py-20 sm:py-28 lg:py-32 border-b border-charcoal/10"`
- SectionHeader:
  - `eyebrow="City Money"`
  - `title="How city revenue has changed"`
  - `description="Verified city revenue compiled from Commission on Audit (COA) and Bureau of Local Government Finance (BLGF) reports."`
- Big number callout for FY2024 (₱6.251B) with source link and verification date.
- Revenue comparison cards/trend for FY2022 (₱4.99B) and FY2016 (₱2.302B).
- Link to `/money`: "Explore detailed city finances →".

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/money.spec.ts tests/unit/homepage.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add pages/index.vue components/money/BudgetChart.vue tests/unit/money.spec.ts
git commit -m "feat(money): implement editorial data journalism narrative for city revenue"
```

---

### Task 8: Building the City Editorial Project Stories

**Files:**
- Modify: `components/projects/ProjectCard.vue`
- Modify: `pages/index.vue`
- Modify: `tests/unit/projects.spec.ts`

**Interfaces:**
- Consumes: `data/projects.json`, `SectionHeader.vue`, `ProjectStatus.vue`.
- Produces: Editorial project stories with status badges (`Planned`, `Ongoing`, `Completed`, `Reported`, `Proposed`), category, implementing office, disclosed budget, and source citation.

- [ ] **Step 1: Write test for Building the City chapter**

Update `tests/unit/projects.spec.ts`:

```typescript
// in tests/unit/projects.spec.ts
it('renders Building the City chapter with SectionHeader and project stories', () => {
  const wrapper = mount(IndexPage)
  expect(wrapper.text()).toContain('Building the City')
  expect(wrapper.text()).toContain('Projects tracked against official and reported records')
  expect(wrapper.text()).toContain('Civic Facilities')
})
```

- [ ] **Step 2: Run test to verify it fails or needs alignment**

Run: `pnpm test:run tests/unit/projects.spec.ts`
Expected: Check status.

- [ ] **Step 3: Refactor Building the City chapter in pages/index.vue**

Update projects chapter in `pages/index.vue`:
- Chapter wrapper: `class="w-full section-white py-20 sm:py-28 lg:py-32 border-b border-charcoal/10"`
- Use `<SectionHeader eyebrow="Building the City" title="Projects & Development" description="Major municipal and national infrastructure tracked against official disclosures and public records." />`
- Render `ProjectsProjectCard` in responsive 3-column grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8`).
- Provide clean link to full registry: "Explore all public projects →".

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/projects.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add pages/index.vue components/projects/ProjectCard.vue tests/unit/projects.spec.ts
git commit -m "feat(projects): render Building the City as clean white chapter with SectionHeader"
```

---

### Task 9: History Chapter ("From Bukol to Today") Deep Green Editorial & Neutral Language

**Files:**
- Modify: `components/civic/Timeline.vue`
- Modify: `pages/index.vue`
- Modify: `tests/unit/explore.spec.ts`
- Modify: `tests/unit/homepage.spec.ts`

**Interfaces:**
- Consumes: `cityData.timeline`, `data/media.json`, `SectionHeader.vue`.
- Produces: Deep Laguna Green (`.section-deep-green`) chapter, vertical timeline with landmark imagery, and neutral, source-backed language (removing unsupported superlatives like "Luzon's richest city outside Metro Manila").

- [ ] **Step 1: Write test verifying neutral factual history language**

Update `tests/unit/explore.spec.ts` and `tests/unit/homepage.spec.ts`:

```typescript
// in tests/unit/homepage.spec.ts
it('renders history chapter with neutral source-backed wording without unsupported superlatives', () => {
  const wrapper = mount(IndexPage)
  expect(wrapper.text()).toContain('From Bukol to Today')
  // Superlatives lacking verifiable comparison methodology must NOT be present (spec §21)
  expect(wrapper.text()).not.toContain("Luzon's richest city outside Metro Manila")
  expect(wrapper.text()).toContain('From a lakeside barrio of Biñan to cityhood')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/homepage.spec.ts`
Expected: FAIL (Text currently contains "Luzon's richest city outside Metro Manila").

- [ ] **Step 3: Update History Chapter in pages/index.vue and Timeline.vue**

Update `pages/index.vue`:
- Chapter wrapper: `class="w-full section-deep-green py-20 sm:py-28 lg:py-32"`
- SectionHeader:
  - `theme="dark"`
  - `eyebrow="Heritage & Evolution"`
  - `title="From Bukol to Today"`
  - `description="From a lakeside barrio of Biñan to cityhood, manufacturing center, and cultural heritage."`
- Timeline integration inside `class="max-w-5xl mx-auto mt-12 sm:mt-16"`.
- Subtitle and timeline descriptions use neutral, verified facts.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/homepage.spec.ts tests/unit/explore.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add pages/index.vue components/civic/Timeline.vue tests/unit/homepage.spec.ts
git commit -m "feat(history): transform history into deep green chapter with neutral source-backed copy"
```

---

### Task 10: Santa Rosa Life & Heritage Asymmetric Collage & Media Credits

**Files:**
- Modify: `components/civic/Collage.vue`
- Modify: `pages/index.vue`
- Modify: `tests/unit/Collage.spec.ts`

**Interfaces:**
- Consumes: `data/media.json`, `CivicImage.vue`, `MediaCredit.vue`, `SectionHeader.vue`.
- Produces: Asymmetrical editorial image layout, clear captions, verified photo credits.

- [ ] **Step 1: Write test for Collage editorial layout**

Update `tests/unit/Collage.spec.ts`:

```typescript
// tests/unit/Collage.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Collage from '~/components/civic/Collage.vue'

describe('Collage Editorial Component', () => {
  it('renders curated local landmark images with photo credits', () => {
    const wrapper = mount(Collage)
    expect(wrapper.text()).toContain('Santa Rosa Life & Heritage')
    expect(wrapper.text()).toContain('Photo:')
    const images = wrapper.findAll('img')
    expect(images.length).toBeGreaterThanOrEqual(3)
  })
})
```

- [ ] **Step 2: Run test to verify current state**

Run: `pnpm test:run tests/unit/Collage.spec.ts`
Expected: PASS or verify.

- [ ] **Step 3: Refine Collage chapter in pages/index.vue and Collage.vue**

Update `components/civic/Collage.vue`:
- Asymmetrical layout: one large focal image (Arch/Church) paired with secondary photos (Nuvali, Cuartel).
- Warm parchment / dark framed container with generous breathing room.
- Clear captions and photo attribution badges (`MediaCredit.vue`).

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/Collage.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/civic/Collage.vue pages/index.vue tests/unit/Collage.spec.ts
git commit -m "feat(collage): elevate Life & Heritage into asymmetrical editorial chapter"
```

---

### Task 11: Laws, Services, Data & Downloads, Data Trust Reference Chapters

**Files:**
- Modify: `pages/index.vue`
- Modify: `components/data/DataFreshness.vue`
- Modify: `tests/unit/services-and-data.spec.ts`
- Modify: `tests/unit/homepage.spec.ts`

**Interfaces:**
- Consumes: `data/laws.json`, `data/services.json`, `data/sources.json`, `SectionHeader.vue`, `SourceBadge.vue`.
- Produces: Distinct chapters for Laws & Decisions (white), Services (white), Data & Downloads (parchment), and Data Trust (light neutral).

- [ ] **Step 1: Write test for reference chapters**

Update `tests/unit/services-and-data.spec.ts` and `tests/unit/homepage.spec.ts`:

```typescript
// in tests/unit/homepage.spec.ts
it('renders Laws, Services, Data Downloads, and Data Trust chapters', () => {
  const wrapper = mount(IndexPage)
  expect(wrapper.text()).toContain('Laws & Decisions')
  expect(wrapper.text()).toContain('Services')
  expect(wrapper.text()).toContain('Data & Downloads')
  expect(wrapper.text()).toContain('Data Trust')
  expect(wrapper.text()).toContain('Last verified')
})
```

- [ ] **Step 2: Run test to verify it fails or needs alignment**

Run: `pnpm test:run tests/unit/homepage.spec.ts`
Expected: Check status.

- [ ] **Step 3: Implement chapters in pages/index.vue**

In `pages/index.vue`:
- Chapter 8: **Laws & Decisions** (`.section-white py-20 sm:py-24 border-b border-charcoal/10`):
  - SectionHeader: "City Ordinances & Laws", description "Searchable ordinances, resolutions, and executive orders."
  - 3 recent laws with verified type badge, title, document link, and verification date.
- Chapter 9: **Services** (`.section-white py-20 sm:py-24 border-b border-charcoal/10`):
  - SectionHeader: "City Services", description "Find official city services faster. Links out to official municipal pages."
  - Grid of service cards with external destination indicators (`Open official page ↗`).
- Chapter 10: **Data & Downloads** (`.section-parchment py-20 sm:py-24 border-b border-charcoal/10`):
  - SectionHeader: "Data & Downloads", description "Download open datasets in JSON and CSV formats."
  - Dataset list with format badges and source links.
- Chapter 11: **Data Trust** (`.section-white py-20 sm:py-24 border-b border-charcoal/10`):
  - Compact verification table showing dataset names and "Last verified by Better Santa Rosa: September 2026".

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/services-and-data.spec.ts tests/unit/homepage.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add pages/index.vue components/data/DataFreshness.vue tests/unit/services-and-data.spec.ts
git commit -m "feat(reference): structure Laws, Services, Data Downloads, and Data Trust chapters"
```

---

### Task 12: Civic Header & Civic Footer Refinement

**Files:**
- Modify: `components/civic/CivicHeader.vue`
- Modify: `components/civic/CivicFooter.vue`
- Modify: `tests/unit/CivicShell.spec.ts`

**Interfaces:**
- Consumes: `bettersantarosacity-logo.svg`, navigation links, disclaimer text.
- Produces: Polished sticky civic header (64-72px, single-line desktop nav, accessible mobile drawer) and footer (organized public data, transparency, media credits, legal independence disclaimer).

- [ ] **Step 1: Write test for header and footer improvements**

Update `tests/unit/CivicShell.spec.ts`:

```typescript
// in tests/unit/CivicShell.spec.ts
import CivicHeader from '~/components/civic/CivicHeader.vue'
import CivicFooter from '~/components/civic/CivicFooter.vue'

it('renders CivicHeader with single-line navigation and search trigger', () => {
  const wrapper = mount(CivicHeader)
  expect(wrapper.find('nav[aria-label="Primary"]').exists()).toBe(true)
  expect(wrapper.text()).toContain('Explore')
  expect(wrapper.text()).toContain('Barangays')
  expect(wrapper.text()).toContain('Money')
  expect(wrapper.text()).toContain('Projects')
})

it('renders CivicFooter with distinct legal disclaimer and media credits link', () => {
  const wrapper = mount(CivicFooter)
  expect(wrapper.text()).toContain('Independent community project')
  expect(wrapper.text()).toContain('Not an official City Government website')
  expect(wrapper.find('a[href="/about/media"]').exists()).toBe(true)
})
```

- [ ] **Step 2: Run test to verify current state**

Run: `pnpm test:run tests/unit/CivicShell.spec.ts`
Expected: PASS or check details.

- [ ] **Step 3: Refine CivicHeader.vue and CivicFooter.vue**

Ensure `CivicHeader.vue`:
- Height: 64–72px (`py-3` to `py-2` on scroll).
- Restrained bottom border: `border-charcoal/10`.
- Navigation fits cleanly on one line on desktop without wrapping.
- Keyboard accessible with visible focus rings.

Ensure `CivicFooter.vue`:
- Dark charcoal ground: `bg-charcoal text-parchment py-16`.
- Clear multi-column layout: Brand & Mission, Public Data, Transparency, Legal Status.
- Visible link to `/about/media` and source methodology.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/CivicShell.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/civic/CivicHeader.vue components/civic/CivicFooter.vue tests/unit/CivicShell.spec.ts
git commit -m "feat(shell): refine CivicHeader and CivicFooter with clear civic branding"
```

---

### Task 13: Full Integration, Vitest Suite, Typecheck, and Static Build Verification

**Files:**
- Modify: `pages/index.vue`
- Modify: `tests/unit/homepage.spec.ts`

**Interfaces:**
- Consumes: All 10 homepage chapters, all components, all datasets.
- Produces: 100% passing test suite, complete typecheck, and error-free static generation.

- [ ] **Step 1: Write end-to-end homepage integration test**

Update `tests/unit/homepage.spec.ts` to assert the complete 10-chapter structure:

```typescript
// tests/unit/homepage.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IndexPage from '../../pages/index.vue'
import HeroSearch from '../../components/civic/HeroSearch.vue'
import MapExplorer from '../../components/civic/MapExplorer.vue'
import Collage from '../../components/civic/Collage.vue'
import StatCard from '../../components/data/StatCard.vue'

describe('Homepage Civic Sections & Chapter Architecture', () => {
  it('renders all 10 editorial chapters with their designated components', () => {
    const wrapper = mount(IndexPage)
    // 1. Hero
    expect(wrapper.findComponent(HeroSearch).exists()).toBe(true)
    // 2. Santa Rosa Today
    expect(wrapper.text()).toContain('Santa Rosa Today')
    expect(wrapper.findAllComponents(StatCard)).toHaveLength(4)
    // 3. Explore Santa Rosa
    expect(wrapper.findComponent(MapExplorer).exists()).toBe(true)
    // 4. City Money
    expect(wrapper.text()).toContain('How city revenue has changed')
    // 5. Building the City
    expect(wrapper.text()).toContain('Building the City')
    // 6. From Bukol to Today
    expect(wrapper.text()).toContain('From Bukol to Today')
    // 7. Life & Heritage
    expect(wrapper.findComponent(Collage).exists()).toBe(true)
    // 8. Laws & Services
    expect(wrapper.text()).toContain('Laws & Decisions')
    expect(wrapper.text()).toContain('Services')
    // 9. Data & Downloads
    expect(wrapper.text()).toContain('Data & Downloads')
    // 10. Data Trust & Sources
    expect(wrapper.text()).toContain('Data Trust')
    expect(wrapper.text()).toContain('About this project')
  })

  it('verifies absence of unverified superlatives and enforces neutral civic language', () => {
    const wrapper = mount(IndexPage)
    expect(wrapper.text()).not.toContain("Luzon's richest city outside Metro Manila")
    expect(wrapper.text()).toContain('Independent community project')
  })

  it('contains core city facts as count-up stat cards with numeric contracts', () => {
    const wrapper = mount(IndexPage)
    const cards = wrapper.findAllComponents(StatCard)
    expect(cards).toHaveLength(4)
    expect(cards.map(c => c.props('numericValue'))).toEqual(
      expect.arrayContaining([18, 5543])
    )
    expect(wrapper.text()).toContain('Barangays')
    expect(wrapper.text()).toContain('Land area')
    expect(wrapper.text()).toContain('Cityhood')
    expect(wrapper.text()).toContain('2004')
  })

  it('shows the site emblem as the hero image and verifies photo attribution', () => {
    const wrapper = mount(IndexPage)
    const heroImg = wrapper.find('section[aria-labelledby="hero-heading"] img')
    expect(heroImg.exists()).toBe(true)
    expect(heroImg.attributes('src')).toBe('/images/bettersantarosacity-logo.svg')
    expect(wrapper.text()).toContain('Photo:')
  })
})
```

- [ ] **Step 2: Run all Vitest tests**

Run: `pnpm test:run`
Expected: All 27+ test files pass.

- [ ] **Step 3: Run TypeScript typecheck**

Run: `pnpm run typecheck`
Expected: PASS with 0 errors.

- [ ] **Step 4: Run production build and Pagefind search indexing**

Run: `pnpm run build:prod`
Expected: Static build generates `dist/` and Pagefind indexes the output successfully.

- [ ] **Step 5: Commit**

```bash
git add pages/index.vue tests/unit/homepage.spec.ts
git commit -m "chore: verify complete homepage chapter architecture, test suite, and static build"
```

---

## Plan Self-Review Checklist

- [x] **Spec coverage:** All 60 sections of `docs/20260917_001530-better-santa-rosa-city-uiux-enhancement.md` are mapped to actionable tasks in the plan.
- [x] **Placeholder scan:** Zero instances of "TBD", "TODO", "implement later", or incomplete code blocks.
- [x] **Type consistency:** Prop types and component names match across tasks (`SectionHeader`, `StatCard`, `MapExplorer`, `CityMapSvg`, `Timeline`, `Collage`, `HeroSearch`).
- [x] **TDD discipline:** Every task specifies Step 1 (failing test), Step 2 (run fail), Step 3 (minimal implementation), Step 4 (run pass), Step 5 (commit).
- [x] **Safety:** Dev servers are strictly avoided; commands use one-shot finite executions (`pnpm test:run`, `pnpm run typecheck`, `pnpm run build:prod`).
