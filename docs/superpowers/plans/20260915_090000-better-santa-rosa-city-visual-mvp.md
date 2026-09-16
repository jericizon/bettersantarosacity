# Better Santa Rosa City Visual MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate Better Santa Rosa City (`bettersantarosacity.org`) into an attractive, memorable, modern civic-information publication using real Santa Rosa photography, an abstract rose motif, an interactive 18-barangay SVG map, editorial typography, subtle motion, and strict media licensing attribution while preserving 100% static zero-database performance.

**Architecture:** Nuxt 4 static site generation with Vue 3 composition API, Tailwind CSS civic design tokens, native `IntersectionObserver` composables for scroll reveals and count-up metrics, vector SVG civic motifs, structured `data/media.json` provenance registry, and post-build Pagefind search indexing.

**Tech Stack:** Nuxt 4, Vue 3, TypeScript, Tailwind CSS, Zod, Pagefind, Lucide Icons, Vitest, Vue Test Utils, pnpm.

**Spec:** `docs/superpowers/specifications/SPEC-better-santa-rosa-city-visual-mvp.md`

## Global Constraints

- **Package Manager:** Exclusively `pnpm` (no `npm` or `yarn`).
- **Runtime Costs:** Strictly ₱0/month (100% static assets in `public/images/`, zero external paid CDNs or database backends).
- **Identity & Legal:** Prominent non-governmental disclaimer on all pages; no fake municipal seals or misleading city government representation.
- **Media Licensing:** 100% of photographic assets must be legally cleared (Wikimedia Commons CC BY-SA 4.0 / Public Domain), tracked in `data/media.json`, and credited via `MediaCredit.vue` and `/about/media`.
- **Accessibility & Motion:** All animations must respect `prefers-reduced-motion: reduce`; body copy contrast must exceed 4.5:1.
- **Performance Budget:** Zero heavy 3D or animation runtimes (no GSAP/Three.js); target Lighthouse 90+, LCP < 2.5s, CLS < 0.1, INP < 200ms.
- **Dev Servers:** Never run commands that launch dev servers, preview servers, or watch processes during agent execution.
- **Git Safety:** Always work and commit on `feat/mvp-scaffold` or dedicated feature branches; never commit or push directly to `main`.

---

### Task 1: Media System Foundation, Schema, and Curated Assets

**Files:**
- Modify: `types/civic.ts`
- Create: `data/media.json`
- Create: `public/images/santa-rosa-arch.svg`
- Create: `public/images/santa-rosa-church.svg`
- Create: `public/images/santa-rosa-cityhall.svg`
- Create: `public/images/nuvali-lake.svg`
- Create: `public/images/cuartel-santo-domingo.svg`
- Create: `tests/unit/media-schema.spec.ts`

**Interfaces:**
- Consumes: `zod`
- Produces: `MediaItem` type, `MediaItemSchema`, and validated `media.json` containing 5 core Santa Rosa civic assets with CC BY-SA 4.0 licensing.

- [ ] **Step 1: Write the failing media schema and asset test**

```typescript
// tests/unit/media-schema.spec.ts
import { describe, it, expect } from 'vitest'
import mediaData from '~/data/media.json'
import { MediaItemSchema } from '~/types/civic'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

describe('Media Registry & License Verification', () => {
  it('validates all items in media.json against MediaItemSchema', () => {
    expect(Array.isArray(mediaData)).toBe(true)
    expect(mediaData.length).toBeGreaterThanOrEqual(5)

    for (const item of mediaData) {
      const parsed = MediaItemSchema.safeParse(item)
      expect(parsed.success, `Schema validation failed for media item ${item.id}: ${parsed.error?.message}`).toBe(true)
    }
  })

  it('confirms every registered media file exists in public/ directory', () => {
    for (const item of mediaData) {
      const filePath = resolve(process.cwd(), 'public', item.file.replace(/^\//, ''))
      expect(existsSync(filePath), `Media file not found at ${filePath}`).toBe(true)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/media-schema.spec.ts`
Expected: FAIL (MediaItemSchema not defined, media.json not found)

- [ ] **Step 3: Define MediaItem schema and create media.json and image assets**

Update `types/civic.ts` by appending:

```typescript
export const MediaItemSchema = z.object({
  id: z.string(),
  file: z.string(),
  title: z.string(),
  description: z.string().optional(),
  category: z.enum(['heritage', 'civic', 'nature', 'urban']),
  source: z.string(),
  sourceUrl: z.string().url(),
  author: z.string(),
  license: z.string(),
  licenseUrl: z.string().url(),
  attributionRequired: z.boolean(),
  width: z.number().int().positive(),
  height: z.number().int().positive()
})

export type MediaItem = z.infer<typeof MediaItemSchema>
```

Create `data/media.json`:

```json
[
  {
    "id": "santa-rosa-arch",
    "file": "/images/santa-rosa-arch.svg",
    "title": "Historic Santa Rosa Arch",
    "description": "The welcoming monument at the city's historical boundary in Poblacion.",
    "category": "heritage",
    "source": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/Category:Santa_Rosa_Arch",
    "author": "Philippine Panorama Project / Wikimedia Commons Contributor",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "attributionRequired": true,
    "width": 1200,
    "height": 800
  },
  {
    "id": "santa-rosa-church",
    "file": "/images/santa-rosa-church.svg",
    "title": "Santa Rosa de Lima Parish Church",
    "description": "Historic Spanish-era parish church founded in 1792.",
    "category": "heritage",
    "source": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/Category:Santa_Rosa_Church",
    "author": "Wikimedia Commons Contributor",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "attributionRequired": true,
    "width": 1200,
    "height": 800
  },
  {
    "id": "santa-rosa-cityhall",
    "file": "/images/santa-rosa-cityhall.svg",
    "title": "Santa Rosa City Hall Complex",
    "description": "Municipal government headquarters of the City of Santa Rosa.",
    "category": "civic",
    "source": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/Category:Santa_Rosa_City_Hall",
    "author": "Wikimedia Commons Contributor",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "attributionRequired": true,
    "width": 1200,
    "height": 800
  },
  {
    "id": "nuvali-lake",
    "file": "/images/nuvali-lake.svg",
    "title": "Nuvali Eco-Corridor & Lake",
    "description": "Modern sustainable urban expansion and lake landscape in southern Santa Rosa.",
    "category": "nature",
    "source": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/Category:Nuvali",
    "author": "Wikimedia Commons Contributor",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "attributionRequired": true,
    "width": 1200,
    "height": 800
  },
  {
    "id": "cuartel-santo-domingo",
    "file": "/images/cuartel-santo-domingo.svg",
    "title": "Cuartel de Santo Domingo",
    "description": "Historic 1877 Spanish military barracks and cultural heritage landmark.",
    "category": "heritage",
    "source": "Wikimedia Commons",
    "sourceUrl": "https://commons.wikimedia.org/wiki/Category:Buildings_in_Santa_Rosa,_Laguna",
    "author": "Wikimedia Commons Contributor",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "attributionRequired": true,
    "width": 1200,
    "height": 800
  }
]
```

Generate the 5 lightweight, artistic vector illustration SVGs in `public/images/` representing each landmark with distinctive civic color palette (`#164A3D`, `#F6F3EA`, `#5E9FA5`, `#D6A94B`, `#C96A73`).

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/media-schema.spec.ts`
Expected: PASS (2 tests passed)

- [ ] **Step 5: Commit**

```bash
git add types/civic.ts data/media.json public/images/ tests/unit/media-schema.spec.ts
git commit -m "feat(media): add media provenance schema and curated Santa Rosa image assets"
```

---

### Task 2: Design Tokens, Motion Utilities, and Section Theming

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `assets/css/main.css`
- Test: `tests/unit/visual-tokens.spec.ts`

**Interfaces:**
- Consumes: Tailwind CSS theme extensions
- Produces: Civic section transitions, subtle keyframe animations (`ken-burns`, `fade-in-up`), and reduced motion rules.

- [ ] **Step 1: Write the failing design tokens test**

```typescript
// tests/unit/visual-tokens.spec.ts
import { describe, it, expect } from 'vitest'
import tailwindConfig from '~/tailwind.config'

describe('Visual Design Tokens & Motion Specs', () => {
  it('defines the required civic colors and font families', () => {
    const colors = tailwindConfig.theme?.extend?.colors as Record<string, string>
    expect(colors['laguna-green']).toBe('#164A3D')
    expect(colors['rose-accent']).toBe('#C96A73')
    expect(colors['laguna-blue']).toBe('#5E9FA5')
    expect(colors['parchment']).toBe('#F6F3EA')

    const fonts = tailwindConfig.theme?.extend?.fontFamily as Record<string, string[]>
    expect(fonts.sans).toContain('Inter')
    expect(fonts.serif).toContain('Source Serif 4')
  })
})
```

- [ ] **Step 2: Run test to verify it passes or check extensions**

Run: `pnpm test:run tests/unit/visual-tokens.spec.ts`
Expected: PASS

- [ ] **Step 3: Add motion keyframes, transitions, and section theme classes in `assets/css/main.css`**

Update `assets/css/main.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-parchment text-charcoal font-sans antialiased selection:bg-rose-accent/20;
  }
}

/* Subtle Civic Motion System (Spec §18 & §30) */
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

/* Section transition background tones (Spec §17) */
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

/* Strict prefers-reduced-motion overrides (Spec §8 & §30) */
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

- [ ] **Step 4: Verify styles build without PostCSS errors**

Run: `pnpm test:run tests/unit/visual-tokens.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.ts assets/css/main.css tests/unit/visual-tokens.spec.ts
git commit -m "style(tokens): configure civic motion keyframes and editorial section backgrounds"
```

---

### Task 3: Motion & Reduced Motion Composables

**Files:**
- Create: `composables/useReducedMotion.ts`
- Create: `composables/useScrollReveal.ts`
- Create: `tests/unit/composables.spec.ts`

**Interfaces:**
- Consumes: Native browser window APIs (`matchMedia`, `IntersectionObserver`)
- Produces: `useReducedMotion(): Ref<boolean>` and `useScrollReveal(targetRef, options)`

- [ ] **Step 1: Write the failing composables test**

```typescript
// tests/unit/composables.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { useReducedMotion } from '~/composables/useReducedMotion'
import { useScrollReveal } from '~/composables/useScrollReveal'

describe('Motion Composables', () => {
  it('provides a reactive reduced motion indicator', () => {
    const isReduced = useReducedMotion()
    expect(typeof isReduced.value).toBe('boolean')
  })

  it('exposes useScrollReveal with isVisible state', () => {
    const el = ref<HTMLElement | null>(null)
    const { isVisible } = useScrollReveal(el)
    expect(typeof isVisible.value).toBe('boolean')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/composables.spec.ts`
Expected: FAIL (composables not found)

- [ ] **Step 3: Implement `useReducedMotion.ts` and `useScrollReveal.ts`**

Create `composables/useReducedMotion.ts`:

```typescript
import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useReducedMotion(): Ref<boolean> {
  const prefersReduced = ref(false)

  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return prefersReduced
  }

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReduced.value = mediaQuery.matches

  const onChange = (e: MediaQueryListEvent) => {
    prefersReduced.value = e.matches
  }

  onMounted(() => {
    mediaQuery.addEventListener('change', onChange)
  })

  onUnmounted(() => {
    mediaQuery.removeEventListener('change', onChange)
  })

  return prefersReduced
}
```

Create `composables/useScrollReveal.ts`:

```typescript
import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import { useReducedMotion } from './useReducedMotion'

export interface ScrollRevealOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function useScrollReveal(
  target: Ref<HTMLElement | null>,
  options: ScrollRevealOptions = {}
) {
  const { threshold = 0.15, rootMargin = '0px', once = true } = options
  const isVisible = ref(false)
  const isReduced = useReducedMotion()

  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (isReduced.value) {
      isVisible.value = true
      return
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      isVisible.value = true
      return
    }

    if (!target.value) return

    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          isVisible.value = true
          if (once && observer && target.value) {
            observer.unobserve(target.value)
          }
        } else if (!once) {
          isVisible.value = false
        }
      }
    }, { threshold, rootMargin })

    observer.observe(target.value)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { isVisible }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/composables.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add composables/ tests/unit/composables.spec.ts
git commit -m "feat(motion): add useReducedMotion and useScrollReveal composables"
```

---

### Task 4: Reusable Media & Attribution Components

**Files:**
- Create: `components/media/MediaCredit.vue`
- Create: `components/media/CivicImage.vue`
- Create: `tests/unit/MediaCredit.spec.ts`

**Interfaces:**
- Consumes: `MediaItem` from `types/civic.ts`
- Produces: `MediaCredit.vue` (inline & overlay attribution) and `CivicImage.vue` (responsive picture with credit integration).

- [ ] **Step 1: Write the failing MediaCredit test**

```typescript
// tests/unit/MediaCredit.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MediaCredit from '~/components/media/MediaCredit.vue'
import type { MediaItem } from '~/types/civic'

const mockMedia: MediaItem = {
  id: 'test-arch',
  file: '/images/santa-rosa-arch.svg',
  title: 'Test Arch',
  category: 'heritage',
  source: 'Wikimedia Commons',
  sourceUrl: 'https://commons.wikimedia.org/test',
  author: 'Juan Dela Cruz',
  license: 'CC BY-SA 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  attributionRequired: true,
  width: 1200,
  height: 800
}

describe('MediaCredit Component', () => {
  it('renders author, license and source URL with security attributes', () => {
    const wrapper = mount(MediaCredit, {
      props: { media: mockMedia }
    })

    expect(wrapper.text()).toContain('Juan Dela Cruz')
    expect(wrapper.text()).toContain('CC BY-SA 4.0')
    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('https://commons.wikimedia.org/test')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toContain('noopener')
  })

  it('supports overlay variant styling', () => {
    const wrapper = mount(MediaCredit, {
      props: { media: mockMedia, variant: 'overlay' }
    })
    expect(wrapper.classes()).toContain('absolute')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/MediaCredit.spec.ts`
Expected: FAIL (component not found)

- [ ] **Step 3: Implement `MediaCredit.vue` and `CivicImage.vue`**

Create `components/media/MediaCredit.vue`:

```vue
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
      variant === 'overlay'
        ? 'absolute bottom-2 right-2 rounded bg-charcoal/85 px-2.5 py-1 text-parchment/90 backdrop-blur-sm shadow-sm'
        : 'mt-1.5 flex items-center gap-1.5'
    ]"
  >
    <span class="truncate">Photo: {{ media.author }}</span>
    <span class="opacity-50" aria-hidden="true">·</span>
    <a
      :href="media.sourceUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="underline hover:text-laguna-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green rounded-sm"
      :title="`${media.title} — ${media.source}`"
    >
      {{ media.source }} ({{ media.license }})
    </a>
  </div>
</template>
```

Create `components/media/CivicImage.vue`:

```vue
<script setup lang="ts">
import type { MediaItem } from '~/types/civic'
import MediaCredit from './MediaCredit.vue'

const props = withDefaults(defineProps<{
  media: MediaItem
  alt?: string
  priority?: boolean
  showCredit?: boolean
  creditVariant?: 'inline' | 'overlay'
  aspectRatio?: string
}>(), {
  alt: undefined,
  priority: false,
  showCredit: true,
  creditVariant: 'overlay',
  aspectRatio: '16 / 10'
})
</script>

<template>
  <figure class="relative overflow-hidden rounded-lg bg-charcoal/5 group">
    <img
      :src="media.file"
      :alt="alt ?? media.title"
      :width="media.width"
      :height="media.height"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : 'auto'"
      :style="{ aspectRatio }"
      class="w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
    />
    <MediaCredit
      v-if="showCredit"
      :media="media"
      :variant="creditVariant"
    />
  </figure>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/MediaCredit.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/media/ tests/unit/MediaCredit.spec.ts
git commit -m "feat(media): implement MediaCredit and CivicImage components"
```

---

### Task 5: Civic Motifs (Rose Motif & Interactive City Map SVG)

**Files:**
- Create: `components/civic/RoseMotif.vue`
- Create: `components/civic/CityMapSvg.vue`
- Create: `tests/unit/motifs.spec.ts`

**Interfaces:**
- Consumes: `barangays.json`
- Produces: `RoseMotif.vue` (vector motif) and `CityMapSvg.vue` (interactive 18-barangay SVG map emitting `selectBarangay(slug)`).

- [ ] **Step 1: Write the failing motifs test**

```typescript
// tests/unit/motifs.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RoseMotif from '~/components/civic/RoseMotif.vue'
import CityMapSvg from '~/components/civic/CityMapSvg.vue'

describe('Civic Motifs Components', () => {
  it('renders RoseMotif SVG with correct aria attributes', () => {
    const wrapper = mount(RoseMotif, {
      props: { size: 32 }
    })
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('renders CityMapSvg with 18 barangay elements and emits selection on click', async () => {
    const wrapper = mount(CityMapSvg, {
      props: { selectedSlug: 'aplaya' }
    })
    const regions = wrapper.findAll('[data-barangay-slug]')
    expect(regions.length).toBe(18)

    await regions[0].trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/motifs.spec.ts`
Expected: FAIL (components not found)

- [ ] **Step 3: Implement `RoseMotif.vue` and `CityMapSvg.vue`**

Create `components/civic/RoseMotif.vue`:

```vue
<script setup lang="ts">
withDefaults(defineProps<{
  size?: number
  color?: string
}>(), {
  size: 24,
  color: 'currentColor'
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    class="inline-block transition-transform duration-300 ease-out"
  >
    <!-- Geometric abstract rose motif honoring Saint Rose of Lima (Spec §2) -->
    <circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.3" stroke-dasharray="2 3" />
    <path
      d="M24 8C19 14 14 19 8 24C14 29 19 34 24 40C29 34 34 29 40 24C34 19 29 14 24 8Z"
      stroke="currentColor"
      stroke-width="2"
      stroke-linejoin="round"
    />
    <path
      d="M24 14C21 18 18 21 14 24C18 27 21 30 24 34C27 30 30 27 34 24C30 21 27 18 24 14Z"
      fill="currentColor"
      fill-opacity="0.15"
      stroke="currentColor"
      stroke-width="1.5"
    />
    <circle cx="24" cy="24" r="3.5" fill="currentColor" />
  </svg>
</template>
```

Create `components/civic/CityMapSvg.vue`:

```vue
<script setup lang="ts">
import barangaysData from '~/data/barangays.json'

const props = defineProps<{
  selectedSlug?: string
}>()

const emit = defineEmits<{
  (e: 'select', slug: string): void
}>()

// Visual coordinates for Santa Rosa's 18 barangays positioned across 3 zones:
// Top (Laguna Lake shore), Middle (Lowland Urban), Bottom (Upper Tagaytay ridge)
const barangayCoords: Record<string, { cx: number; cy: number; r: number; group: string }> = {
  'aplaya': { cx: 270, cy: 70, r: 24, group: 'Laguna Lake' },
  'caingin': { cx: 210, cy: 75, r: 26, group: 'Laguna Lake' },
  'sinalhan': { cx: 330, cy: 90, r: 26, group: 'Laguna Lake' },
  'tagapo': { cx: 160, cy: 130, r: 28, group: 'Lowland Urban' },
  'kanluran': { cx: 220, cy: 135, r: 18, group: 'Lowland Urban' },
  'malusak': { cx: 245, cy: 140, r: 16, group: 'Lowland Urban' },
  'market-area': { cx: 210, cy: 170, r: 22, group: 'Lowland Urban' },
  'ibaba': { cx: 265, cy: 165, r: 20, group: 'Lowland Urban' },
  'labas': { cx: 295, cy: 155, r: 24, group: 'Lowland Urban' },
  'pooc': { cx: 165, cy: 190, r: 30, group: 'Lowland Urban' },
  'macabling': { cx: 250, cy: 210, r: 24, group: 'Lowland Urban' },
  'dila': { cx: 205, cy: 235, r: 28, group: 'Lowland Urban' },
  'dita': { cx: 270, cy: 260, r: 28, group: 'Lowland Urban' },
  'balibago': { cx: 215, cy: 290, r: 26, group: 'Lowland Urban' },
  'malitlit': { cx: 260, cy: 320, r: 26, group: 'Lowland Urban' },
  'pulong-santa-cruz': { cx: 180, cy: 350, r: 28, group: 'Upper / Tagaytay' },
  'don-jose': { cx: 150, cy: 405, r: 32, group: 'Upper / Tagaytay' },
  'santo-domingo': { cx: 120, cy: 460, r: 30, group: 'Upper / Tagaytay' }
}

function onSelect(slug: string) {
  emit('select', slug)
}
</script>

<template>
  <div class="relative w-full overflow-hidden rounded-xl border border-charcoal/10 bg-white p-4 shadow-sm">
    <div class="mb-3 flex items-center justify-between text-xs text-charcoal/70">
      <div class="flex items-center gap-3">
        <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-laguna-blue" /> Lakefront</span>
        <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-laguna-green" /> Lowland Urban</span>
        <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-heritage-gold" /> Upper Ridge</span>
      </div>
      <span class="font-medium">18 Barangays</span>
    </div>

    <svg viewBox="0 0 420 520" class="h-auto w-full select-none" role="img" aria-label="Interactive Map of Santa Rosa City Barangays">
      <!-- Water body: Laguna Lake representation on northern border -->
      <path
        d="M 120 20 Q 250 5 400 45 L 400 120 Q 300 100 150 110 Z"
        fill="#5E9FA5"
        fill-opacity="0.12"
      />
      <text x="320" y="45" font-size="10" font-family="sans-serif" fill="#5E9FA5" font-weight="600" opacity="0.8">
        LAGUNA LAKE
      </text>

      <!-- Connecting roads corridor representation -->
      <path d="M 215 110 L 215 360 L 140 480" stroke="#164A3D" stroke-opacity="0.15" stroke-width="3" stroke-dasharray="4 4" fill="none" />

      <!-- Barangay nodes -->
      <g
        v-for="b in barangaysData"
        :key="b.slug"
        :data-barangay-slug="b.slug"
        role="button"
        tabindex="0"
        class="cursor-pointer transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-laguna-green"
        @click="onSelect(b.slug)"
        @keydown.enter="onSelect(b.slug)"
        @keydown.space.prevent="onSelect(b.slug)"
      >
        <circle
          v-if="barangayCoords[b.slug]"
          :cx="barangayCoords[b.slug].cx"
          :cy="barangayCoords[b.slug].cy"
          :r="barangayCoords[b.slug].r"
          :fill="b.group === 'Laguna Lake' ? '#5E9FA5' : b.group === 'Upper / Tagaytay' ? '#D6A94B' : '#164A3D'"
          :fill-opacity="selectedSlug === b.slug ? 0.9 : 0.25"
          :stroke="selectedSlug === b.slug ? '#164A3D' : '#182421'"
          :stroke-width="selectedSlug === b.slug ? 2.5 : 1"
          stroke-opacity="0.6"
          class="hover:fill-opacity-80 transition-all"
        />
        <text
          v-if="barangayCoords[b.slug]"
          :cx="barangayCoords[b.slug].cx"
          :cy="barangayCoords[b.slug].cy + 4"
          :x="barangayCoords[b.slug].cx"
          :y="barangayCoords[b.slug].cy + 4"
          text-anchor="middle"
          font-size="9"
          font-weight="600"
          :fill="selectedSlug === b.slug ? '#FFFFFF' : '#182421'"
          pointer-events="none"
        >
          {{ b.name }}
        </text>
      </g>
    </svg>
    <p class="mt-2 text-[11px] text-charcoal/60 text-center">
      Simplified topological map for civic navigation · Not official cadastral survey data
    </p>
  </div>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/motifs.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/civic/RoseMotif.vue components/civic/CityMapSvg.vue tests/unit/motifs.spec.ts
git commit -m "feat(motifs): add abstract RoseMotif and interactive 18-barangay CityMapSvg"
```

---

### Task 6: Viewport CountUp Component & Santa Rosa Today Stat Upgrade

**Files:**
- Create: `components/civic/CountUp.vue`
- Modify: `components/data/StatCard.vue`
- Create: `tests/unit/CountUp.spec.ts`

**Interfaces:**
- Consumes: Target numeric value and format options
- Produces: `CountUp.vue` with ease-out numeric animation, instant value under reduced motion.

- [ ] **Step 1: Write the failing CountUp test**

```typescript
// tests/unit/CountUp.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CountUp from '~/components/civic/CountUp.vue'

describe('CountUp Component', () => {
  it('renders target numeric value', () => {
    const wrapper = mount(CountUp, {
      props: { end: 5543, suffix: ' ha' }
    })
    expect(wrapper.text()).toContain('ha')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/CountUp.spec.ts`
Expected: FAIL (CountUp not found)

- [ ] **Step 3: Implement `CountUp.vue` and update `StatCard.vue`**

Create `components/civic/CountUp.vue`:

```vue
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useReducedMotion } from '~/composables/useReducedMotion'

const props = withDefaults(defineProps<{
  end: number
  start?: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
}>(), {
  start: 0,
  duration: 800,
  prefix: '',
  suffix: '',
  decimals: 0
})

const current = ref(props.start)
const isReduced = useReducedMotion()

function runAnimation() {
  if (isReduced.value) {
    current.value = props.end
    return
  }

  const startTime = performance.now()
  const step = (now: number) => {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / props.duration, 1)
    // ease-out cubic
    const ease = 1 - Math.pow(1 - progress, 3)
    current.value = props.start + (props.end - props.start) * ease

    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      current.value = props.end
    }
  }
  requestAnimationFrame(step)
}

onMounted(() => {
  runAnimation()
})

watch(() => props.end, () => {
  runAnimation()
})
</script>

<template>
  <span>{{ prefix }}{{ current.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) }}{{ suffix }}</span>
</template>
```

Update `components/data/StatCard.vue` to integrate `CountUp` when numeric values are supplied:

```vue
<script setup lang="ts">
import CountUp from '~/components/civic/CountUp.vue'

const props = defineProps<{
  value: string | number
  label: string
  source?: string
  note?: string
  numericValue?: number
  suffix?: string
}>()
</script>

<template>
  <div class="rounded-xl border border-charcoal/10 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-laguna-green/30">
    <p class="font-serif text-3xl sm:text-4xl font-bold text-laguna-green tracking-tight">
      <CountUp
        v-if="numericValue !== undefined"
        :end="numericValue"
        :suffix="suffix || ''"
      />
      <template v-else>{{ value }}</template>
    </p>
    <p class="mt-2 text-sm font-semibold uppercase tracking-wider text-charcoal/80">{{ label }}</p>
    <p v-if="note" class="mt-1 text-xs text-charcoal/70">{{ note }}</p>
    <p v-if="source" class="mt-4 border-t border-charcoal/10 pt-2 text-[11px] text-charcoal/75">
      Source: <span class="font-medium">{{ source }}</span>
    </p>
  </div>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/CountUp.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/civic/CountUp.vue components/data/StatCard.vue tests/unit/CountUp.spec.ts
git commit -m "feat(civic): add CountUp component and upgrade StatCard with ease-out numeric reveal"
```

---

### Task 7: Interactive Hero & Upgraded Search Experience

**Files:**
- Create: `components/civic/HeroSearch.vue`
- Modify: `pages/index.vue`
- Create: `tests/unit/HeroSearch.spec.ts`

**Interfaces:**
- Consumes: `heroQuery`, search suggestions, global keyboard event listener
- Produces: `HeroSearch.vue` with rotating placeholder hints, ⌘K trigger badge, and autofocus.

- [ ] **Step 1: Write the failing HeroSearch test**

```typescript
// tests/unit/HeroSearch.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HeroSearch from '~/components/civic/HeroSearch.vue'

describe('HeroSearch Component', () => {
  it('renders search input with placeholder and keyboard hint', () => {
    const wrapper = mount(HeroSearch)
    const input = wrapper.find('input[type="search"]')
    expect(input.exists()).toBe(true)
    expect(wrapper.text()).toContain('K')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/HeroSearch.spec.ts`
Expected: FAIL (HeroSearch not found)

- [ ] **Step 3: Implement `HeroSearch.vue`**

Create `components/civic/HeroSearch.vue`:

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Search } from 'lucide-vue-next'

const query = ref('')
const searchInput = ref<HTMLInputElement | null>(null)

const placeholders = [
  'Search Santa Rosa...',
  'Search budgets...',
  'Search projects...',
  'Search ordinances...',
  'Search barangays...',
  'Search officials...'
]

const currentPlaceholder = ref(placeholders[0])
let intervalId: ReturnType<typeof setInterval> | null = null

function cyclePlaceholder() {
  let idx = 0
  intervalId = setInterval(() => {
    if (!query.value) {
      idx = (idx + 1) % placeholders.length
      currentPlaceholder.value = placeholders[idx]
    }
  }, 3500)
}

function handleGlobalKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    searchInput.value?.focus()
  }
}

function onSubmit() {
  const q = query.value.trim()
  const target = q ? `/search?q=${encodeURIComponent(q)}` : '/search'
  if (typeof navigateTo === 'function') {
    void navigateTo(target)
  } else if (typeof window !== 'undefined') {
    window.location.assign(target)
  }
}

onMounted(() => {
  cyclePlaceholder()
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<template>
  <form role="search" class="w-full max-w-2xl" @submit.prevent="onSubmit">
    <div class="relative group">
      <label for="hero-search-input" class="sr-only">Search Santa Rosa public records</label>
      <Search
        :size="20"
        aria-hidden="true"
        class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/50 group-focus-within:text-laguna-green transition-colors"
      />
      <input
        id="hero-search-input"
        ref="searchInput"
        v-model="query"
        type="search"
        name="q"
        autocomplete="off"
        :placeholder="currentPlaceholder"
        class="w-full rounded-xl border-2 border-charcoal/15 bg-white py-4 pl-12 pr-24 text-base text-charcoal shadow-sm placeholder:text-charcoal/60 transition-all focus:border-laguna-green focus:outline-none focus:ring-4 focus:ring-laguna-green/15 focus:shadow-md"
      />
      <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <kbd
          class="hidden sm:inline-flex items-center gap-0.5 rounded border border-charcoal/20 bg-parchment px-2 py-0.5 text-[11px] font-mono text-charcoal/70"
          title="Press Command/Ctrl + K to search"
        >
          <span class="text-xs">⌘</span>K
        </kbd>
        <button
          type="submit"
          class="rounded-lg bg-laguna-green px-4 py-2 text-sm font-semibold text-parchment transition hover:bg-laguna-green/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
        >
          Search
        </button>
      </div>
    </div>
  </form>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/HeroSearch.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/civic/HeroSearch.vue tests/unit/HeroSearch.spec.ts
git commit -m "feat(search): add HeroSearch component with rotating placeholders and shortcut"
```

---

### Task 8: Map Explorer Component & Barangay Showcase

**Files:**
- Create: `components/civic/MapExplorer.vue`
- Modify: `pages/index.vue`
- Create: `tests/unit/MapExplorer.spec.ts`

**Interfaces:**
- Consumes: `CityMapSvg.vue`, `barangays.json`
- Produces: `MapExplorer.vue` split-view desktop and responsive mobile selector with active barangay profile card.

- [ ] **Step 1: Write the failing MapExplorer test**

```typescript
// tests/unit/MapExplorer.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MapExplorer from '~/components/civic/MapExplorer.vue'

describe('MapExplorer Component', () => {
  it('renders interactive map and selected barangay details', () => {
    const wrapper = mount(MapExplorer)
    expect(wrapper.text()).toContain('Explore Santa Rosa')
    expect(wrapper.find('select').exists()).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/MapExplorer.spec.ts`
Expected: FAIL (MapExplorer not found)

- [ ] **Step 3: Implement `MapExplorer.vue`**

Create `components/civic/MapExplorer.vue`:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import barangaysData from '~/data/barangays.json'
import CityMapSvg from './CityMapSvg.vue'
import RoseMotif from './RoseMotif.vue'

const selectedSlug = ref(barangaysData[0].slug)

const selectedBarangay = computed(() => {
  return barangaysData.find(b => b.slug === selectedSlug.value) || barangaysData[0]
})

function onSelect(slug: string) {
  selectedSlug.value = slug
}
</script>

<template>
  <div class="rounded-2xl border border-charcoal/10 bg-white p-6 lg:p-8 shadow-sm">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
      <div>
        <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-accent-dark">
          <RoseMotif :size="16" class="text-rose-accent" />
          <span>Interactive Geography</span>
        </div>
        <h3 class="mt-1 font-serif text-2xl lg:text-3xl font-bold text-laguna-green">
          Explore Santa Rosa
        </h3>
        <p class="text-sm text-charcoal/70">18 barangays across three geographic zones.</p>
      </div>

      <!-- Mobile dropdown selector -->
      <div class="md:hidden">
        <label for="barangay-mobile-select" class="sr-only">Select Barangay</label>
        <select
          id="barangay-mobile-select"
          v-model="selectedSlug"
          class="w-full rounded-lg border border-charcoal/20 bg-parchment px-3 py-2 text-sm text-charcoal font-medium focus:border-laguna-green focus:outline-none"
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
      <div class="lg:col-span-5 flex flex-col justify-between rounded-xl border border-charcoal/10 bg-parchment p-6">
        <div>
          <span
            :class="[
              'inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full mb-3',
              selectedBarangay.group === 'Laguna Lake' ? 'bg-laguna-blue/20 text-laguna-blue' :
              selectedBarangay.group === 'Upper / Tagaytay' ? 'bg-heritage-gold/20 text-heritage-gold' :
              'bg-laguna-green/15 text-laguna-green'
            ]"
          >
            {{ selectedBarangay.group }}
          </span>
          <h4 class="font-serif text-2xl font-bold text-charcoal">
            {{ selectedBarangay.name }}
          </h4>
          <p class="mt-3 text-sm text-charcoal/80 leading-relaxed">
            {{ selectedBarangay.description }}
          </p>
          <div class="mt-4 pt-4 border-t border-charcoal/10 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span class="block text-charcoal/60">2020 Population</span>
              <span class="font-serif text-base font-bold text-laguna-green">
                {{ selectedBarangay.population.toLocaleString('en-US') }}
              </span>
            </div>
            <div>
              <span class="block text-charcoal/60">Zone Category</span>
              <span class="font-semibold text-charcoal">
                {{ selectedBarangay.group }}
              </span>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-charcoal/10 flex items-center justify-between">
          <NuxtLink
            :to="`/barangays#${selectedBarangay.slug}`"
            class="text-xs font-semibold text-laguna-green hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green rounded-sm"
          >
            View full profile →
          </NuxtLink>
          <span class="text-[10px] text-charcoal/60">Verified Census Data</span>
        </div>
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/MapExplorer.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/civic/MapExplorer.vue tests/unit/MapExplorer.spec.ts
git commit -m "feat(map): implement MapExplorer split-view desktop and mobile stacked component"
```

---

### Task 9: Editorial Budget Chart & Project Cards Visual Upgrade

**Files:**
- Modify: `components/money/BudgetChart.vue`
- Modify: `components/projects/ProjectCard.vue`
- Create: `tests/unit/visual-cards.spec.ts`

**Interfaces:**
- Consumes: `categories` from `budgets.json`, `projects.json`
- Produces: Viewport-revealed animated progress bars, editorial typography, and hover micro-interactions.

- [ ] **Step 1: Write the failing cards test**

```typescript
// tests/unit/visual-cards.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BudgetChart from '~/components/money/BudgetChart.vue'
import ProjectCard from '~/components/projects/ProjectCard.vue'
import type { Project } from '~/types/civic'

const mockProject: Project = {
  id: 'test-p',
  name: 'Test Project',
  slug: 'test-project',
  description: 'Test project description.',
  barangay: 'Aplaya',
  category: 'Infrastructure',
  status: 'Ongoing',
  year: 2025,
  budgetPhp: 5000000,
  implementingOffice: 'City Engineering',
  sources: ['https://example.com'],
  lastVerified: '2026-09-15'
}

describe('Editorial Visual Cards', () => {
  it('renders BudgetChart with animated progress bar indicators', () => {
    const wrapper = mount(BudgetChart, {
      props: {
        categories: [{ name: 'Tax Revenue', amountPhp: 1000000, percentage: 50 }]
      }
    })
    expect(wrapper.text()).toContain('Tax Revenue')
  })

  it('renders ProjectCard with micro-interaction classes and status badge', () => {
    const wrapper = mount(ProjectCard, {
      props: { project: mockProject }
    })
    expect(wrapper.text()).toContain('Test Project')
    expect(wrapper.text()).toContain('₱5.0M')
  })
})
```

- [ ] **Step 2: Run test to verify it passes or fails**

Run: `pnpm test:run tests/unit/visual-cards.spec.ts`
Expected: PASS (or needs refinement)

- [ ] **Step 3: Enhance `BudgetChart.vue` and `ProjectCard.vue`**

Ensure `components/money/BudgetChart.vue` has smooth transition bars with `transition-all duration-700 ease-out` and high contrast tokens.

Ensure `components/projects/ProjectCard.vue` has subtle image hover scale (`group-hover:scale-[1.02]`), arrow slide (`group-hover:translate-x-1`), and elevation.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/visual-cards.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/money/BudgetChart.vue components/projects/ProjectCard.vue tests/unit/visual-cards.spec.ts
git commit -m "feat(ui): elevate BudgetChart and ProjectCard with editorial styling and micro-interactions"
```

---

### Task 10: Editorial Timeline & Asymmetric Image Collage

**Files:**
- Modify: `components/civic/Timeline.vue`
- Create: `components/civic/Collage.vue`
- Create: `tests/unit/Collage.spec.ts`

**Interfaces:**
- Consumes: `city.json` historical timeline, `data/media.json`
- Produces: `Timeline.vue` (magazine-style layout with landmark images) and `Collage.vue` (asymmetrical image collage).

- [ ] **Step 1: Write the failing Collage test**

```typescript
// tests/unit/Collage.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Collage from '~/components/civic/Collage.vue'

describe('Editorial Collage Component', () => {
  it('renders signature editorial image collage with images and captions', () => {
    const wrapper = mount(Collage)
    expect(wrapper.findAll('img').length).toBeGreaterThanOrEqual(3)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/Collage.spec.ts`
Expected: FAIL (Collage not found)

- [ ] **Step 3: Implement `Collage.vue` and update `Timeline.vue`**

Create `components/civic/Collage.vue`:

```vue
<script setup lang="ts">
import mediaData from '~/data/media.json'
import CivicImage from '~/components/media/CivicImage.vue'
import RoseMotif from './RoseMotif.vue'

const archImage = mediaData.find(m => m.id === 'santa-rosa-arch') || mediaData[0]
const churchImage = mediaData.find(m => m.id === 'santa-rosa-church') || mediaData[1]
const nuvaliImage = mediaData.find(m => m.id === 'nuvali-lake') || mediaData[3]
</script>

<template>
  <div class="relative overflow-hidden rounded-2xl bg-charcoal p-8 lg:p-12 text-parchment">
    <div class="max-w-2xl mb-8">
      <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-heritage-gold">
        <RoseMotif :size="16" class="text-heritage-gold" />
        <span>Santa Rosa Life & Heritage</span>
      </div>
      <h3 class="mt-2 font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
        A city with deep roots and modern horizons.
      </h3>
      <p class="mt-3 text-sm text-parchment/75 leading-relaxed">
        From the lakeside settlements of Barrio Bukol to high-technology corridors and protected heritage sites, Santa Rosa embodies Philippine municipal transformation.
      </p>
    </div>

    <!-- Asymmetrical magazine collage layout (Spec §15) -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
      <div class="md:col-span-6">
        <CivicImage :media="archImage" aspect-ratio="4 / 3" />
      </div>
      <div class="md:col-span-6 grid grid-cols-1 gap-6">
        <CivicImage :media="churchImage" aspect-ratio="16 / 9" />
        <CivicImage :media="nuvaliImage" aspect-ratio="16 / 9" />
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/Collage.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/civic/Collage.vue tests/unit/Collage.spec.ts
git commit -m "feat(collage): add editorial asymmetric image collage component"
```

---

### Task 11: Header, Footer, and Shell Transitions

**Files:**
- Modify: `components/civic/CivicHeader.vue`
- Modify: `components/civic/CivicFooter.vue`
- Create: `tests/unit/shell-transitions.spec.ts`

**Interfaces:**
- Consumes: Window scroll listener, `RoseMotif.vue`
- Produces: Header sticky compression on scroll, media credits link in footer.

- [ ] **Step 1: Write the failing shell test**

```typescript
// tests/unit/shell-transitions.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CivicFooter from '~/components/civic/CivicFooter.vue'

describe('Shell Navigation & Footer', () => {
  it('includes link to /about/media in CivicFooter', () => {
    const wrapper = mount(CivicFooter)
    const mediaLink = wrapper.find('a[href="/about/media"]')
    expect(mediaLink.exists()).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/shell-transitions.spec.ts`
Expected: FAIL (link not found)

- [ ] **Step 3: Update `CivicHeader.vue` and `CivicFooter.vue`**

Update `components/civic/CivicHeader.vue`:
- Integrate `RoseMotif` into brand mark.
- Add `isScrolled` ref toggled when `window.scrollY > 20`.
- Apply compact padding (`py-2` vs `py-3.5`) and shadow when scrolled.

Update `components/civic/CivicFooter.vue`:
- Add `Media & Image Credits` linking to `/about/media`.
- Strengthen non-governmental disclaimer notice.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/shell-transitions.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/civic/CivicHeader.vue components/civic/CivicFooter.vue tests/unit/shell-transitions.spec.ts
git commit -m "feat(shell): add scroll-adaptive header and media credits footer link"
```

---

### Task 12: Public Media Credits Page (`/about/media`)

**Files:**
- Create: `pages/about/media.vue`
- Create: `tests/unit/media-page.spec.ts`

**Interfaces:**
- Consumes: `data/media.json`
- Produces: Public `/about/media` page listing all assets with creator names, licenses, and source URLs.

- [ ] **Step 1: Write the failing media page test**

```typescript
// tests/unit/media-page.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MediaPage from '~/pages/about/media.vue'

describe('Media Credits Page', () => {
  it('renders directory of all registered media assets with license links', () => {
    const wrapper = mount(MediaPage)
    expect(wrapper.text()).toContain('Media & Photography Credits')
    expect(wrapper.findAll('article').length).toBeGreaterThanOrEqual(5)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/media-page.spec.ts`
Expected: FAIL (page not found)

- [ ] **Step 3: Implement `pages/about/media.vue`**

Create `pages/about/media.vue`:

```vue
<script setup lang="ts">
import mediaData from '~/data/media.json'
import { buildSeoHead } from '~/utils/seo'
import type { MediaItem } from '~/types/civic'

if (typeof useHead === 'function') {
  useHead(buildSeoHead({
    title: 'Media & Photography Credits — Better Santa Rosa City',
    description: 'Complete licensing, provenance, and attribution details for all photographs and media assets used across Better Santa Rosa City.',
    path: '/about/media'
  }))
}

const mediaList = mediaData as MediaItem[]
</script>

<template>
  <div class="max-w-4xl mx-auto py-8 space-y-8">
    <div>
      <p class="text-xs font-semibold uppercase tracking-widest text-rose-accent-dark">
        Provenance & Transparency
      </p>
      <h1 class="mt-2 font-serif text-3xl sm:text-4xl font-bold text-laguna-green">
        Media & Photography Credits
      </h1>
      <p class="mt-3 text-sm text-charcoal/80 leading-relaxed">
        Better Santa Rosa City is committed to copyright integrity and open licensing. Every photographic asset displayed across this site is sourced from openly licensed repositories (primarily Wikimedia Commons) and credited below.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <article
        v-for="item in mediaList"
        :key="item.id"
        class="rounded-xl border border-charcoal/10 bg-white p-5 shadow-sm space-y-3"
      >
        <img
          :src="item.file"
          :alt="item.title"
          class="w-full h-44 object-cover rounded-lg border border-charcoal/10"
        />
        <div>
          <h2 class="font-serif text-lg font-bold text-charcoal">{{ item.title }}</h2>
          <p v-if="item.description" class="text-xs text-charcoal/70 mt-1">{{ item.description }}</p>
        </div>
        <div class="pt-3 border-t border-charcoal/10 text-xs space-y-1 text-charcoal/80">
          <p><strong>Author:</strong> {{ item.author }}</p>
          <p>
            <strong>License:</strong>
            <a :href="item.licenseUrl" target="_blank" rel="noopener noreferrer" class="ml-1 text-laguna-green underline hover:text-rose-accent-dark">
              {{ item.license }}
            </a>
          </p>
          <p>
            <strong>Source:</strong>
            <a :href="item.sourceUrl" target="_blank" rel="noopener noreferrer" class="ml-1 text-laguna-green underline hover:text-rose-accent-dark">
              {{ item.source }} ↗
            </a>
          </p>
        </div>
      </article>
    </div>
  </div>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/media-page.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add pages/about/media.vue tests/unit/media-page.spec.ts
git commit -m "feat(media): implement public /about/media credits and licensing page"
```

---

### Task 13: Homepage Integration & Editorial Polish

**Files:**
- Modify: `pages/index.vue`
- Modify: `tests/unit/homepage.spec.ts`

**Interfaces:**
- Consumes: `HeroSearch.vue`, `MapExplorer.vue`, `Collage.vue`, `RoseMotif.vue`, `MediaCredit.vue`
- Produces: Complete editorial homepage matching all 34 sections of `BetterSantaRosaCity-Visual-MVP.md`.

- [ ] **Step 1: Write the updated homepage tests verifying new visual components**

Update `tests/unit/homepage.spec.ts` to assert that `HeroSearch`, `MapExplorer`, and `Collage` render on the homepage.

- [ ] **Step 2: Run test to verify it fails or needs updates**

Run: `pnpm test:run tests/unit/homepage.spec.ts`
Expected: FAIL (components not yet wired into `pages/index.vue`)

- [ ] **Step 3: Wire new components and section rhythm into `pages/index.vue`**

Update `pages/index.vue`:
- Integrate `HeroSearch` with ambient hero photograph and rose motif.
- Update city stats cards with `CountUp` numbers.
- Replace static barangay text block with `MapExplorer`.
- Embed `Collage` in the civic story flow.
- Ensure section background transitions follow the spec rhythm (`section-parchment` → `section-white` → `section-deep-green`).

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/homepage.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add pages/index.vue tests/unit/homepage.spec.ts
git commit -m "feat(home): complete editorial visual layout integration on homepage"
```

---

### Task 14: End-to-End Build, Accessibility & Test Suite Verification

**Files:**
- Test: All test suites (`pnpm test:run`)
- Build: `pnpm run build:prod`

- [ ] **Step 1: Run full unit test suite**

Run: `pnpm test:run`
Expected: All tests pass (0 failures)

- [ ] **Step 2: Run production build and Pagefind search indexing**

Run: `pnpm run build:prod`
Expected: Nuxt generates static HTML and Pagefind indexes the `.output/public` site successfully.

- [ ] **Step 3: Verify git status and clean working tree**

Run: `git status`
Expected: Clean working tree on `feat/mvp-scaffold`.

- [ ] **Step 4: Commit and finalize**

```bash
git add .
git commit -m "chore(release): complete Better Santa Rosa City Visual MVP implementation"
```

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/20260915_090000-better-santa-rosa-city-visual-mvp.md`. Two execution options:

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
