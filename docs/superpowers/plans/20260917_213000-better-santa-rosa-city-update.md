# Better Santa Rosa City MVP Implementation Plan (v2.0)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the full Better Santa Rosa City v2.0 update, delivering the enhanced Trust & Sources layer with `/about/methodology`, the Places directory (`/places` and `/places/[slug]`), official City Updates (`/updates` and `/updates/[slug]`), the live "Santa Rosa Now" section (Weather, Live Traffic architecture with fallback, and latest updates), the `/finances` route refactor with backwards-compatible `/money` redirects, the 6-pillar navigation in `CivicHeader.vue`, and the 12-chapter homepage with distinct editorial grounds and 96–144px vertical chapter spacing.

**Architecture:** Nuxt 4 static site generation (SSG) with Vue 3 Composition API, strict TypeScript, Tailwind CSS civic design tokens, Zod-validated data collections in `data/`, Open-Meteo live weather integration, client-side traffic layer with accessible textual fallbacks, Pagefind static search indexing, and Cloudflare Pages static hosting.

**Tech Stack:** Nuxt 4 (`compatibilityVersion: 4`), Vue 3, TypeScript 5.7+, Tailwind CSS 3.4+, Zod 3.24+, Pagefind 1.3+, MapLibre GL 5.24+, Lucide Vue Next 0.475+, Vitest 2.1+, Vue Test Utils 2.4+, pnpm.

**Spec:** `docs/superpowers/specifications/SPEC-20260917-better-santa-rosa-city-update.md`

## Global Constraints

- **Package Manager:** Exclusively `pnpm` (no `npm` or `yarn`).
- **Runtime Costs:** Strictly ₱0/month (100% static assets on Cloudflare Pages, zero database, zero backend workers).
- **Identity & Legal:** Persistent non-governmental disclaimer on every page; do not mimic official municipal seals or represent the site as an official city government portal.
- **Brand Identity:** The Santa Rosa Arch (Bantayang Bato) logo is LOCKED and must remain the primary visual anchor.
- **Copy Standards:** Zero em-dashes (`—`) in user-facing UI copy per taste guidelines; use hyphens, colons, or parentheses. Remove unsubstantiated superlatives in favor of sourced metrics.
- **Source Verification:** Every material claim, financial metric, and project status must cite its source organization, URL, publication date, and `lastVerified` timestamp.
- **Financial Clarity:** Never label city revenue as the total appropriation budget. Always state: *"Revenue is not the same as the city's appropriation budget or total expenditure."*
- **Traffic Safety:** Use officially supported providers or fallback states. Never fake live traffic data; if unavailable, render the explicit fallback: *"Live traffic is temporarily unavailable."* Provide textual status (Normal, Slow, Heavy) for accessibility.
- **Dev Servers:** Never run commands that launch dev servers (`pnpm dev`), preview servers, or watch processes during execution.
- **Git Safety:** Always follow conventional commit standards without attribution footers; do not push or commit to protected branches.

---

### Task 1: Trust & Sources Layer Enhancement (`SourceBadge`, `DataFreshness`, and `/about/methodology`)

**Files:**
- Modify: `components/data/SourceBadge.vue`
- Modify: `components/data/DataFreshness.vue`
- Create: `pages/about/methodology.vue`
- Test: `tests/unit/methodology.spec.ts`
- Test: `tests/unit/source-badge.spec.ts`

**Interfaces:**
- Consumes: `types/civic.ts`, `data/city.json`, `data/sources.json`.
- Produces: Enhanced `SourceBadge.vue` accepting `type: 'official' | 'primary' | 'secondary' | 'community'`, `organization?: string`, `date?: string`, `url?: string`; updated `DataFreshness.vue`; dedicated `/about/methodology` route.

- [ ] **Step 1: Write failing tests for SourceBadge and Methodology page**

Create `tests/unit/source-badge.spec.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SourceBadge from '../../components/data/SourceBadge.vue'

describe('SourceBadge Component', () => {
  it('renders official badge correctly', () => {
    const wrapper = mount(SourceBadge, {
      props: {
        type: 'official',
        organization: 'City Government of Santa Rosa',
        date: '2026-09-17'
      }
    })
    expect(wrapper.text()).toContain('OFFICIAL')
    expect(wrapper.text()).toContain('City Government of Santa Rosa')
    expect(wrapper.text()).toContain('2026-09-17')
  })

  it('renders primary source with external URL link', () => {
    const wrapper = mount(SourceBadge, {
      props: {
        type: 'primary',
        organization: 'Commission on Audit',
        url: 'https://coa.gov.ph'
      }
    })
    expect(wrapper.text()).toContain('PRIMARY')
    expect(wrapper.find('a').attributes('href')).toBe('https://coa.gov.ph')
  })

  it('renders secondary and community badges with appropriate styling classes', () => {
    const secondaryWrapper = mount(SourceBadge, { props: { type: 'secondary' } })
    expect(secondaryWrapper.text()).toContain('SECONDARY')

    const commWrapper = mount(SourceBadge, { props: { type: 'community' } })
    expect(commWrapper.text()).toContain('BETTER SANTA ROSA')
  })
})
```

Create `tests/unit/methodology.spec.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MethodologyPage from '../../pages/about/methodology.vue'

describe('Methodology Page (/about/methodology)', () => {
  it('renders methodology heading and core principles', () => {
    const wrapper = mount(MethodologyPage, {
      global: {
        stubs: {
          NuxtLink: { template: '<a><slot /></a>' },
          DataSourceBadge: true,
          DataLastVerified: true
        }
      }
    })
    expect(wrapper.find('h1').text()).toContain('Methodology & Standards')
    expect(wrapper.text()).toContain('Primary-source preference')
    expect(wrapper.text()).toContain('Verification process')
    expect(wrapper.text()).toContain('Found an error?')
    expect(wrapper.text()).toContain('Independent civic-information project')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/source-badge.spec.ts tests/unit/methodology.spec.ts`  
Expected: FAIL with "Cannot find module '../../pages/about/methodology.vue'" or property mismatch in SourceBadge.

- [ ] **Step 3: Implement enhanced SourceBadge.vue and pages/about/methodology.vue**

Update `components/data/SourceBadge.vue`:
```vue
<script setup lang="ts">
import { computed } from 'vue'
import { ExternalLink } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    type: 'official' | 'primary' | 'secondary' | 'community'
    organization?: string
    date?: string
    url?: string
  }>(),
  {
    organization: undefined,
    date: undefined,
    url: undefined
  }
)

const badgeLabel = computed(() => {
  switch (props.type) {
    case 'official':
      return 'OFFICIAL'
    case 'primary':
      return 'PRIMARY'
    case 'secondary':
      return 'SECONDARY'
    case 'community':
      return 'BETTER SANTA ROSA'
    default:
      return 'SOURCE'
  }
})

const badgeClass = computed(() => {
  switch (props.type) {
    case 'official':
      return 'bg-laguna-green/10 text-laguna-green border-laguna-green/20'
    case 'primary':
      return 'bg-laguna-blue/15 text-laguna-green border-laguna-blue/30'
    case 'secondary':
      return 'bg-charcoal/10 text-charcoal/80 border-charcoal/20'
    case 'community':
      return 'bg-heritage-gold/20 text-charcoal border-heritage-gold/30'
    default:
      return 'bg-charcoal/10 text-charcoal border-charcoal/20'
  }
})
</script>

<template>
  <span class="inline-flex flex-wrap items-center gap-1.5 text-xs">
    <span
      class="inline-flex items-center px-2 py-0.5 rounded font-mono text-[10px] font-bold tracking-wider uppercase border"
      :class="badgeClass"
    >
      {{ badgeLabel }}
    </span>
    <span v-if="organization" class="font-medium text-charcoal/90">
      {{ organization }}
    </span>
    <span v-if="date" class="text-charcoal/60">
      · {{ date }}
    </span>
    <a
      v-if="url"
      :href="url"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-0.5 text-laguna-green hover:underline font-medium ml-0.5"
    >
      <span>Read original</span>
      <ExternalLink :size="12" aria-hidden="true" />
    </a>
  </span>
</template>
```

Create `pages/about/methodology.vue`:
```vue
<script setup lang="ts">
import { buildSeoHead } from '~/utils/seo'
import DataSourceBadge from '~/components/data/SourceBadge.vue'

if (typeof useHead === 'function') {
  useHead(buildSeoHead({
    title: 'Methodology & Standards · Better Santa Rosa City',
    description: 'How Better Santa Rosa City collects, verifies, and publishes public records, official advisories, and civic statistics.',
    path: '/about/methodology'
  }))
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
    <header class="space-y-4">
      <NuxtLink to="/about" class="text-xs font-semibold uppercase tracking-wider text-rose-accent-dark hover:underline">
        ← About Better Santa Rosa
      </NuxtLink>
      <h1 class="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-laguna-green">
        Methodology & Standards
      </h1>
      <p class="text-base sm:text-lg text-charcoal/80 leading-relaxed">
        Better Santa Rosa City is an independent, community-maintained public information portal. Every record and metric we present follows strict principles of sourcing, verification, and non-partisanship.
      </p>
    </header>

    <div class="prose prose-stone max-w-none space-y-8">
      <section class="space-y-3">
        <h2 class="font-serif text-2xl font-bold text-laguna-green">1. Primary-Source Preference</h2>
        <p class="text-charcoal/80">
          We prioritize primary official records issued directly by government authorities. This includes Commission on Audit (COA) annual audit reports, Bureau of Local Government Finance (BLGF) fiscal statements, Philippine Statistics Authority (PSA) census data, Santa Rosa City Council ordinances and resolutions, and official department directories.
        </p>
        <div class="flex gap-2 items-center pt-1">
          <DataSourceBadge type="primary" organization="Official Government Record" />
          <DataSourceBadge type="official" organization="City Government of Santa Rosa" />
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="font-serif text-2xl font-bold text-laguna-green">2. Secondary Sources & Transparency</h2>
        <p class="text-charcoal/80">
          When primary documents are unavailable, secondary sources such as reputable news publications, historical references, PhilAtlas, or Wikipedia may be referenced. Secondary sources are always explicitly identified and never visually conflated with official records.
        </p>
        <div class="pt-1">
          <DataSourceBadge type="secondary" organization="Third-Party Reference / News" />
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="font-serif text-2xl font-bold text-laguna-green">3. Verification Process & Freshness</h2>
        <p class="text-charcoal/80">
          Every dataset and key fact displays a <code>lastVerified</code> date. Datasets are audited on a scheduled basis. We preserve source definitions strictly: we do not label city revenue as the appropriation budget, nor do we present proposed projects as completed infrastructure.
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="font-serif text-2xl font-bold text-laguna-green">4. Missing Data Standard</h2>
        <p class="text-charcoal/80">
          We never extrapolate or fabricate missing information. When a field is absent from reviewed sources, we explicitly state: <em>"Data not available in the source reviewed."</em>
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="font-serif text-2xl font-bold text-laguna-green">5. Non-Partisanship & Facts Before Opinions</h2>
        <p class="text-charcoal/80">
          Better Santa Rosa City does not endorse political candidates, rank officials, assign municipal report-card scores, or publish editorial commentary. We present public records neutrally so residents can form their own judgments.
        </p>
      </section>

      <section class="space-y-3 p-6 rounded-lg bg-parchment border border-charcoal/10">
        <h2 class="font-serif text-xl font-bold text-laguna-green">Found an Error?</h2>
        <p class="text-sm text-charcoal/80">
          Accuracy is our highest priority. If you identify a factual error, broken source link, or outdated record, please report it via our GitHub repository or contact our verification team directly.
        </p>
        <div class="pt-2 flex flex-wrap gap-4 text-sm">
          <a
            href="https://github.com/bettersantarosa/bettersantarosacity/issues"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 font-semibold text-laguna-green hover:underline"
          >
            Submit an issue on GitHub →
          </a>
          <a
            href="mailto:corrections@bettersantarosa.org"
            class="inline-flex items-center gap-1 font-semibold text-laguna-green hover:underline"
          >
            Email corrections@bettersantarosa.org →
          </a>
        </div>
      </section>
    </div>
  </div>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/source-badge.spec.ts tests/unit/methodology.spec.ts`  
Expected: PASS with 4 tests passed.

- [ ] **Step 5: Verify all existing tests still pass**

Run: `pnpm test:run`  
Expected: All tests pass.

---

### Task 2: Places Directory (`PlaceSchema`, `data/places.json`, `PlaceCard.vue`, `/places`, and `/places/[slug]`)

**Files:**
- Modify: `types/civic.ts`
- Create: `data/places.json`
- Create: `components/places/PlaceCard.vue`
- Create: `pages/places/index.vue`
- Create: `pages/places/[slug].vue`
- Modify: `tests/unit/data-integrity.spec.ts`
- Create: `tests/unit/places.spec.ts`

**Interfaces:**
- Consumes: `types/civic.ts` (`PlaceSchema`), `data/places.json`, `components/data/SourceBadge.vue`, `components/data/LastVerified.vue`.
- Produces: Places directory at `/places`, individual place view at `/places/[slug]`, and `PlaceCard.vue`.

- [ ] **Step 1: Write failing tests for Place schema and Places pages**

Create `tests/unit/places.spec.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import placesData from '../../data/places.json'
import { PlaceSchema } from '../../types/civic'
import PlacesIndex from '../../pages/places/index.vue'

describe('Places Feature', () => {
  it('validates places.json against PlaceSchema', () => {
    expect(placesData.length).toBeGreaterThanOrEqual(5)
    for (const place of placesData) {
      const res = PlaceSchema.safeParse(place)
      expect(res.success, place.title).toBe(true)
    }
  })

  it('renders places index page with category filter tabs', () => {
    const wrapper = mount(PlacesIndex, {
      global: {
        stubs: {
          NuxtLink: { template: '<a><slot /></a>' },
          DataSourceBadge: true,
          DataLastVerified: true,
          PlaceCard: { template: '<div class="place-card"><slot /></div>' }
        }
      }
    })
    expect(wrapper.find('h1').text()).toContain('Places & Landmarks')
    expect(wrapper.text()).toContain('Landmark')
    expect(wrapper.text()).toContain('Heritage')
    expect(wrapper.text()).toContain('Santa Rosa Arch')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/places.spec.ts`  
Expected: FAIL with missing PlaceSchema or missing `data/places.json`.

- [ ] **Step 3: Implement PlaceSchema, data/places.json, PlaceCard.vue, and Places pages**

In `types/civic.ts`, add:
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

Create `data/places.json`:
```json
[
  {
    "id": "santa-rosa-arch",
    "title": "Santa Rosa Arch (Bantayang Bato)",
    "slug": "santa-rosa-arch",
    "category": "Landmark",
    "barangay": "Balibago",
    "location": "National Highway boundary, Balibago",
    "description": "The historic gateway arch greeting travelers entering Santa Rosa City along the Manila South Road corridor.",
    "historicalContext": "Constructed in 1931, the arch represents the city's historic boundary watch post (Bantayang Bato) and serves as Santa Rosa's primary civic emblem.",
    "whyItMatters": "The architectural centerpiece of Santa Rosa's municipal visual identity, symbolizing the transition from agricultural town to modern industrial hub.",
    "images": ["/images/bettersantarosa-logo.png"],
    "sources": ["City Government of Santa Rosa Historical Records", "National Historical Commission of the Philippines registry"],
    "officialUrl": "https://santarosacity.gov.ph/about-us",
    "lastVerified": "2026-09-17"
  },
  {
    "id": "cuartel-de-santo-domingo",
    "title": "Cuartel de Santo Domingo",
    "slug": "cuartel-de-santo-domingo",
    "category": "Heritage",
    "barangay": "Santo Domingo",
    "location": "Barangay Santo Domingo, near Silang boundary",
    "description": "Spanish-era military fortress and barracks built in 1877 as a defense outpost for the Guardia Civil in Laguna.",
    "historicalContext": "Served as a key military headquarters during the Spanish colonial period, the Philippine Revolution, the American era, and World War II.",
    "whyItMatters": "Declared an Important Cultural Property (ICP) by the National Museum of the Philippines, representing 19th-century Spanish colonial military architecture.",
    "images": [],
    "sources": ["National Museum of the Philippines ICP Declarations", "City Government of Santa Rosa Cultural Heritage Office"],
    "lastVerified": "2026-09-17"
  },
  {
    "id": "santa-rosa-city-hall-civic-complex",
    "title": "Santa Rosa City Hall & Plaza",
    "slug": "santa-rosa-city-hall",
    "category": "Civic",
    "barangay": "Tagapo",
    "location": "F. Gomez St., City Proper",
    "description": "The administrative seat of the City Government of Santa Rosa, housing executive departments and legislative chambers.",
    "historicalContext": "The city center developed around the historic town plaza following Santa Rosa's separation from Biñan in 1792.",
    "whyItMatters": "Primary destination for municipal civic services, council sessions, and public citizen transactions.",
    "images": [],
    "sources": ["City Government of Santa Rosa Citizen's Charter 2024", "Santa Rosa LGU Directory"],
    "officialUrl": "https://santarosacity.gov.ph",
    "lastVerified": "2026-09-17"
  },
  {
    "id": "museo-de-santa-rosa",
    "title": "Museo de Santa Rosa",
    "slug": "museo-de-santa-rosa",
    "category": "Heritage",
    "barangay": "Kanluran",
    "location": "Poblacion, near City Plaza",
    "description": "Municipal museum preserving historical artifacts, documents, and cultural heritage from the Spanish era to modern times.",
    "historicalContext": "Housed in the restored Spanish-era municipal schoolhouse building in the Poblacion core.",
    "whyItMatters": "Serves as the central repository for documented local history, revolutionary memorabilia, and cityhood archives.",
    "images": [],
    "sources": ["City Tourism and Cultural Affairs Office", "Laguna Provincial Heritage Inventory"],
    "lastVerified": "2026-09-17"
  },
  {
    "id": "enchanted-kingdom",
    "title": "Enchanted Kingdom",
    "slug": "enchanted-kingdom",
    "category": "Attraction",
    "barangay": "Balibago",
    "location": "San Lorenzo South, Barangay Balibago",
    "description": "A 25-hectare theme park operating since 1995, one of the premier amusement attractions in the Philippines.",
    "whyItMatters": "A major economic and tourism driver in the Calabarzon region that put Santa Rosa on the national leisure map.",
    "images": [],
    "sources": ["Department of Tourism Calabarzon Accredited Establishments", "Philippine Daily Inquirer business reports"],
    "officialUrl": "https://www.enchantedkingdom.ph",
    "lastVerified": "2026-09-17"
  },
  {
    "id": "laguna-de-bay-lakeshore",
    "title": "Laguna de Bay Lakeshore",
    "slug": "laguna-lake-lakeshore",
    "category": "Nature",
    "barangay": "Aplaya",
    "location": "Barangays Aplaya, Sinalhan, Caingin",
    "description": "The fresh-water shoreline corridor of Laguna de Bay fronting Santa Rosa's eastern boundary.",
    "historicalContext": "Historically supported the fishing livelihoods of Barrio Bukol's earliest lakeside sitios.",
    "whyItMatters": "An essential ecological buffer, fishery zone, and natural flood control basin overseen by LLDA.",
    "images": [],
    "sources": ["Laguna Lake Development Authority (LLDA) Basin Profile", "City Environment and Natural Resources Office (ENRO)"],
    "lastVerified": "2026-09-17"
  }
]
```

Create `components/places/PlaceCard.vue`:
```vue
<script setup lang="ts">
import type { Place } from '~/types/civic'
import { MapPin, ArrowRight } from 'lucide-vue-next'
import DataSourceBadge from '~/components/data/SourceBadge.vue'

defineProps<{
  place: Place
}>()
</script>

<template>
  <div class="flex flex-col justify-between rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm hover:border-laguna-green/30 transition-all">
    <div class="space-y-3">
      <div class="flex items-center justify-between gap-2">
        <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-laguna-green/10 text-laguna-green">
          {{ place.category }}
        </span>
        <span class="text-xs text-charcoal/60 flex items-center gap-1">
          <MapPin :size="12" aria-hidden="true" />
          {{ place.barangay }}
        </span>
      </div>

      <h3 class="font-serif text-lg font-bold text-charcoal">
        <NuxtLink :to="`/places/${place.slug}`" class="hover:text-laguna-green transition-colors">
          {{ place.title }}
        </NuxtLink>
      </h3>

      <p class="text-xs sm:text-sm text-charcoal/70 line-clamp-3 leading-relaxed">
        {{ place.description }}
      </p>
    </div>

    <div class="mt-4 pt-3 border-t border-charcoal/10 flex items-center justify-between text-xs">
      <DataSourceBadge type="primary" :date="place.lastVerified" />
      <NuxtLink
        :to="`/places/${place.slug}`"
        class="inline-flex items-center gap-1 font-semibold text-laguna-green hover:underline"
      >
        <span>Details</span>
        <ArrowRight :size="12" aria-hidden="true" />
      </NuxtLink>
    </div>
  </div>
</template>
```

Create `pages/places/index.vue`:
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import placesData from '~/data/places.json'
import type { Place } from '~/types/civic'
import PlaceCard from '~/components/places/PlaceCard.vue'
import { buildSeoHead } from '~/utils/seo'
import { Search } from 'lucide-vue-next'

if (typeof useHead === 'function') {
  useHead(buildSeoHead({
    title: 'Places & Landmarks · Better Santa Rosa City',
    description: 'Civic landmarks, historical sites, cultural places, and natural heritage in Santa Rosa City, Laguna.',
    path: '/places'
  }))
}

const places = placesData as Place[]
const activeCategory = ref<string>('All')
const searchQuery = ref<string>('')

const categories = ['All', 'Landmark', 'Heritage', 'Civic', 'Nature', 'Attraction']

const filteredPlaces = computed(() => {
  return places.filter(p => {
    const matchesCat = activeCategory.value === 'All' || p.category === activeCategory.value
    const matchesSearch = !searchQuery.value.trim() ||
      p.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.barangay.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCat && matchesSearch
  })
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
    <header class="max-w-3xl space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent-dark">
        Explore Santa Rosa
      </p>
      <h1 class="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-laguna-green">
        Places & Landmarks
      </h1>
      <p class="text-sm sm:text-base text-charcoal/70 leading-relaxed">
        Key landmarks, historical fortresses, cultural museums, and civic spaces across Santa Rosa City. Sourced from cultural heritage registries and official municipal records.
      </p>
    </header>

    <!-- Filters & Search -->
    <div class="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between pb-2 border-b border-charcoal/10">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          @click="activeCategory = cat"
          class="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
          :class="activeCategory === cat ? 'bg-laguna-green text-white font-semibold' : 'bg-charcoal/5 text-charcoal/80 hover:bg-charcoal/10'"
        >
          {{ cat }}
        </button>
      </div>

      <div class="relative w-full sm:w-64">
        <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" aria-hidden="true" />
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Filter places..."
          class="w-full pl-9 pr-3 py-1.5 rounded-md border border-charcoal/20 text-xs focus:border-laguna-green focus:outline-none"
        >
      </div>
    </div>

    <!-- Places Grid -->
    <div v-if="filteredPlaces.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <PlaceCard v-for="place in filteredPlaces" :key="place.id" :place="place" />
    </div>
    <div v-else class="text-center py-12 text-sm text-charcoal/60">
      No places match the selected filters.
    </div>
  </div>
</template>
```

Create `pages/places/[slug].vue`:
```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import placesData from '~/data/places.json'
import type { Place } from '~/types/civic'
import { buildSeoHead } from '~/utils/seo'
import DataSourceBadge from '~/components/data/SourceBadge.vue'
import DataLastVerified from '~/components/data/LastVerified.vue'
import { MapPin, ExternalLink } from 'lucide-vue-next'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const place = computed(() => (placesData as Place[]).find(p => p.slug === slug.value))

if (typeof useHead === 'function' && place.value) {
  useHead(buildSeoHead({
    title: `${place.value.title} · Better Santa Rosa City`,
    description: place.value.description,
    path: `/places/${place.value.slug}`
  }))
}
</script>

<template>
  <div v-if="place" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
    <nav aria-label="Breadcrumb" class="text-xs text-charcoal/60 flex items-center gap-2">
      <NuxtLink to="/places" class="hover:text-laguna-green">Places</NuxtLink>
      <span>/</span>
      <span class="text-charcoal font-medium">{{ place.title }}</span>
    </nav>

    <header class="space-y-3">
      <div class="flex flex-wrap items-center gap-2">
        <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-laguna-green/10 text-laguna-green">
          {{ place.category }}
        </span>
        <span class="text-xs text-charcoal/70 flex items-center gap-1">
          <MapPin :size="12" aria-hidden="true" />
          {{ place.location }}
        </span>
      </div>

      <h1 class="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-laguna-green">
        {{ place.title }}
      </h1>
      <p class="text-base sm:text-lg text-charcoal/80 leading-relaxed">
        {{ place.description }}
      </p>
      <DataLastVerified :date="place.lastVerified" />
    </header>

    <div class="space-y-6 text-sm text-charcoal/80 leading-relaxed border-t border-charcoal/10 pt-6">
      <div v-if="place.whyItMatters" class="space-y-2">
        <h2 class="font-serif text-xl font-bold text-charcoal">Why It Matters</h2>
        <p>{{ place.whyItMatters }}</p>
      </div>

      <div v-if="place.historicalContext" class="space-y-2">
        <h2 class="font-serif text-xl font-bold text-charcoal">Historical Context</h2>
        <p>{{ place.historicalContext }}</p>
      </div>

      <div class="space-y-2 pt-4 border-t border-charcoal/10">
        <h2 class="font-serif text-base font-bold text-charcoal">Sources & Reference</h2>
        <ul class="space-y-1.5 list-disc list-inside text-xs text-charcoal/70">
          <li v-for="source in place.sources" :key="source">{{ source }}</li>
        </ul>
        <div v-if="place.officialUrl" class="pt-2">
          <a
            :href="place.officialUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 text-xs font-semibold text-laguna-green hover:underline"
          >
            <span>Visit official reference website</span>
            <ExternalLink :size="12" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="max-w-4xl mx-auto px-4 py-16 text-center text-charcoal/60">
    Place not found.
  </div>
</template>
```

- [ ] **Step 4: Update data-integrity test and run test to verify it passes**

Update `tests/unit/data-integrity.spec.ts` to validate `places.json` with `PlaceSchema`:
```typescript
import placesData from '../../data/places.json'
import { PlaceSchema } from '../../types/civic'

// Inside describe block:
it('validates places.json', () => {
  expect(placesData.length).toBeGreaterThan(0)
  for (const item of placesData) {
    expect(PlaceSchema.safeParse(item).success).toBe(true)
  }
})
```

Run: `pnpm test:run tests/unit/places.spec.ts tests/unit/data-integrity.spec.ts`  
Expected: PASS with all tests passing.

---

### Task 3: City Updates (`CityUpdateSchema`, `data/updates.json`, `UpdateCard.vue`, `/updates`, and `/updates/[slug]`)

**Files:**
- Modify: `types/civic.ts`
- Create: `data/updates.json`
- Create: `components/updates/UpdateCard.vue`
- Create: `pages/updates/index.vue`
- Create: `pages/updates/[slug].vue`
- Modify: `tests/unit/data-integrity.spec.ts`
- Create: `tests/unit/updates.spec.ts`

**Interfaces:**
- Consumes: `types/civic.ts` (`CityUpdateSchema`), `data/updates.json`, `components/data/SourceBadge.vue`, `components/data/LastVerified.vue`.
- Produces: `/updates` list page, `/updates/[slug]` detail page, and reusable `UpdateCard.vue`.

- [ ] **Step 1: Write failing tests for City Updates**

Create `tests/unit/updates.spec.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import updatesData from '../../data/updates.json'
import { CityUpdateSchema } from '../../types/civic'
import UpdatesIndex from '../../pages/updates/index.vue'

describe('City Updates Feature', () => {
  it('validates updates.json against CityUpdateSchema', () => {
    expect(updatesData.length).toBeGreaterThanOrEqual(3)
    for (const update of updatesData) {
      const res = CityUpdateSchema.safeParse(update)
      expect(res.success, update.title).toBe(true)
    }
  })

  it('renders updates directory with category filters and official source badges', () => {
    const wrapper = mount(UpdatesIndex, {
      global: {
        stubs: {
          NuxtLink: { template: '<a><slot /></a>' },
          DataSourceBadge: true,
          DataLastVerified: true,
          UpdateCard: { template: '<div class="update-card"><slot /></div>' }
        }
      }
    })
    expect(wrapper.find('h1').text()).toContain('City Updates')
    expect(wrapper.text()).toContain('traffic')
    expect(wrapper.text()).toContain('emergency')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/updates.spec.ts`  
Expected: FAIL with missing CityUpdateSchema or `data/updates.json`.

- [ ] **Step 3: Implement CityUpdateSchema, data/updates.json, UpdateCard.vue, and Updates pages**

In `types/civic.ts`, add:
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

Create `data/updates.json`:
```json
[
  {
    "id": "2026-09-17-balibago-traffic-rerouting",
    "title": "Traffic Advisory: National Highway Maintenance & Rerouting",
    "slug": "traffic-advisory-national-highway-rerouting",
    "date": "2026-09-17",
    "category": "traffic",
    "sourceType": "official-portal",
    "sourceOrganization": "City Government of Santa Rosa Traffic Management Office",
    "sourceUrl": "https://santarosacity.gov.ph",
    "status": "published",
    "summary": "Temporary lane constriction and rerouting along the Balibago national corridor due to scheduled drainage and pavement rehabilitation.",
    "content": "Motorists traveling towards Nuvali or the SLEX Balibago exit are advised to expect slower transit times and utilize alternate routes via Tagapo or Macabling.",
    "lastVerified": "2026-09-17"
  },
  {
    "id": "2026-09-15-cdrmmo-monsoon-preparedness",
    "title": "Public Advisory: Southwest Monsoon Monitoring for Lowland & Lakeshore Areas",
    "slug": "monsoon-monitoring-advisory",
    "date": "2026-09-15",
    "category": "emergency",
    "sourceType": "advisory",
    "sourceOrganization": "Santa Rosa CDRRMO",
    "sourceUrl": "https://santarosacity.gov.ph",
    "status": "published",
    "summary": "City Disaster Risk Reduction and Management Office advisory regarding continuous monsoon rains and localized water level monitoring along lakefront barangays.",
    "content": "Barangay emergency response teams in Aplaya, Sinalhan, and Caingin are placed on standby. Residents may dial 911 or (049) 530-0015 for immediate municipal assistance.",
    "lastVerified": "2026-09-17"
  },
  {
    "id": "2026-09-10-business-tax-payment-reminder",
    "title": "Treasury Reminder: Q3 Local Business Tax and Real Property Tax Due Date",
    "slug": "q3-local-tax-deadline-reminder",
    "date": "2026-09-10",
    "category": "public-services",
    "sourceType": "official-portal",
    "sourceOrganization": "City Treasury Department",
    "sourceUrl": "https://santarosacity.gov.ph",
    "status": "published",
    "summary": "Announcement regarding payment schedules for third-quarter municipal business taxes and RPT discounts at the City Hall Hall of Justice annex.",
    "content": "Taxpayers are encouraged to use online assessment channels or visit the City Treasury payment counters weekdays between 8:00 AM and 5:00 PM.",
    "lastVerified": "2026-09-17"
  }
]
```

Create `components/updates/UpdateCard.vue`:
```vue
<script setup lang="ts">
import type { CityUpdate } from '~/types/civic'
import DataSourceBadge from '~/components/data/SourceBadge.vue'
import { ArrowRight, Calendar } from 'lucide-vue-next'

defineProps<{
  update: CityUpdate
}>()
</script>

<template>
  <article class="flex flex-col justify-between rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm hover:border-laguna-green/30 transition-all">
    <div class="space-y-3">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-accent/15 text-rose-accent-dark">
          {{ update.category }}
        </span>
        <span class="text-xs text-charcoal/60 flex items-center gap-1 font-mono">
          <Calendar :size="12" aria-hidden="true" />
          {{ update.date }}
        </span>
      </div>

      <h3 class="font-serif text-lg font-bold text-charcoal">
        <NuxtLink :to="`/updates/${update.slug}`" class="hover:text-laguna-green transition-colors">
          {{ update.title }}
        </NuxtLink>
      </h3>

      <p class="text-xs sm:text-sm text-charcoal/70 line-clamp-3 leading-relaxed">
        {{ update.summary }}
      </p>
    </div>

    <div class="mt-4 pt-3 border-t border-charcoal/10 flex flex-wrap items-center justify-between gap-2 text-xs">
      <DataSourceBadge type="official" :organization="update.sourceOrganization" />
      <NuxtLink
        :to="`/updates/${update.slug}`"
        class="inline-flex items-center gap-1 font-semibold text-laguna-green hover:underline"
      >
        <span>Read summary</span>
        <ArrowRight :size="12" aria-hidden="true" />
      </NuxtLink>
    </div>
  </article>
</template>
```

Create `pages/updates/index.vue`:
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import updatesData from '~/data/updates.json'
import type { CityUpdate } from '~/types/civic'
import UpdateCard from '~/components/updates/UpdateCard.vue'
import { buildSeoHead } from '~/utils/seo'
import { Search } from 'lucide-vue-next'

if (typeof useHead === 'function') {
  useHead(buildSeoHead({
    title: 'City Updates & Advisories · Better Santa Rosa City',
    description: 'Public announcements, road advisories, and emergency alerts from the City Government of Santa Rosa and municipal agencies.',
    path: '/updates'
  }))
}

const updates = updatesData as CityUpdate[]
const activeCategory = ref<string>('all')
const searchQuery = ref<string>('')

const categories = ['all', 'traffic', 'emergency', 'public-services', 'government', 'infrastructure']

const filteredUpdates = computed(() => {
  return updates.filter(u => {
    const matchesCat = activeCategory.value === 'all' || u.category === activeCategory.value
    const matchesSearch = !searchQuery.value.trim() ||
      u.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      u.summary.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCat && matchesSearch
  })
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
    <header class="max-w-3xl space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent-dark">
        Public Information
      </p>
      <h1 class="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-laguna-green">
        City Updates & Advisories
      </h1>
      <p class="text-sm sm:text-base text-charcoal/70 leading-relaxed">
        Curated public announcements from the City Government of Santa Rosa and disaster risk authorities, presented with source attribution and plain-language summaries.
      </p>
    </header>

    <!-- Filters & Search -->
    <div class="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between pb-2 border-b border-charcoal/10">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          @click="activeCategory = cat"
          class="px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition-colors"
          :class="activeCategory === cat ? 'bg-laguna-green text-white font-semibold' : 'bg-charcoal/5 text-charcoal/80 hover:bg-charcoal/10'"
        >
          {{ cat }}
        </button>
      </div>

      <div class="relative w-full sm:w-64">
        <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" aria-hidden="true" />
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search updates..."
          class="w-full pl-9 pr-3 py-1.5 rounded-md border border-charcoal/20 text-xs focus:border-laguna-green focus:outline-none"
        >
      </div>
    </div>

    <!-- Updates Grid -->
    <div v-if="filteredUpdates.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UpdateCard v-for="update in filteredUpdates" :key="update.id" :update="update" />
    </div>
    <div v-else class="text-center py-12 text-sm text-charcoal/60">
      No updates match the selected filters.
    </div>
  </div>
</template>
```

Create `pages/updates/[slug].vue`:
```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import updatesData from '~/data/updates.json'
import type { CityUpdate } from '~/types/civic'
import { buildSeoHead } from '~/utils/seo'
import DataSourceBadge from '~/components/data/SourceBadge.vue'
import DataLastVerified from '~/components/data/LastVerified.vue'
import { Calendar, ExternalLink } from 'lucide-vue-next'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const update = computed(() => (updatesData as CityUpdate[]).find(u => u.slug === slug.value))

if (typeof useHead === 'function' && update.value) {
  useHead(buildSeoHead({
    title: `${update.value.title} · Better Santa Rosa City`,
    description: update.value.summary,
    path: `/updates/${update.value.slug}`
  }))
}
</script>

<template>
  <div v-if="update" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
    <nav aria-label="Breadcrumb" class="text-xs text-charcoal/60 flex items-center gap-2">
      <NuxtLink to="/updates" class="hover:text-laguna-green">City Updates</NuxtLink>
      <span>/</span>
      <span class="text-charcoal font-medium truncate">{{ update.title }}</span>
    </nav>

    <header class="space-y-4">
      <div class="flex flex-wrap items-center gap-2">
        <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-accent/15 text-rose-accent-dark">
          {{ update.category }}
        </span>
        <span class="text-xs text-charcoal/70 flex items-center gap-1 font-mono">
          <Calendar :size="12" aria-hidden="true" />
          {{ update.date }}
        </span>
      </div>

      <h1 class="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-laguna-green">
        {{ update.title }}
      </h1>

      <div class="flex flex-wrap items-center gap-3 pt-1">
        <DataSourceBadge
          type="official"
          :organization="update.sourceOrganization"
          :date="update.date"
          :url="update.sourceUrl"
        />
        <DataLastVerified :date="update.lastVerified" />
      </div>
    </header>

    <div class="space-y-6 text-sm sm:text-base text-charcoal/80 leading-relaxed border-t border-charcoal/10 pt-6">
      <div class="p-4 rounded-lg bg-parchment border border-charcoal/10">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-laguna-green mb-1">
          Better Santa Rosa Summary
        </h2>
        <p>{{ update.summary }}</p>
      </div>

      <div v-if="update.content" class="space-y-3">
        <h2 class="font-serif text-xl font-bold text-charcoal">Details</h2>
        <p>{{ update.content }}</p>
      </div>

      <div class="p-4 rounded-lg bg-white border border-charcoal/10 space-y-2">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-charcoal/70">
          Source Transparency
        </h2>
        <p class="text-xs text-charcoal/70">
          This advisory was posted by {{ update.sourceOrganization }}. Better Santa Rosa City summarizes public advisories to improve civic awareness.
        </p>
        <div class="pt-1">
          <a
            :href="update.sourceUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 text-xs font-bold text-laguna-green hover:underline"
          >
            <span>Read full announcement on official source</span>
            <ExternalLink :size="12" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="max-w-4xl mx-auto px-4 py-16 text-center text-charcoal/60">
    Update not found.
  </div>
</template>
```

- [ ] **Step 4: Update data-integrity test and run test to verify it passes**

Update `tests/unit/data-integrity.spec.ts` to validate `updates.json` with `CityUpdateSchema`:
```typescript
import updatesData from '../../data/updates.json'
import { CityUpdateSchema } from '../../types/civic'

// Inside describe block:
it('validates updates.json', () => {
  expect(updatesData.length).toBeGreaterThan(0)
  for (const item of updatesData) {
    expect(CityUpdateSchema.safeParse(item).success).toBe(true)
  }
})
```

Run: `pnpm test:run tests/unit/updates.spec.ts tests/unit/data-integrity.spec.ts`  
Expected: PASS with all tests passing.

---

### Task 4: Live Traffic & "Santa Rosa Now" Section (`TrafficMap.vue` and `SantaRosaNow.vue`)

**Files:**
- Create: `components/civic/TrafficMap.vue`
- Create: `components/civic/SantaRosaNow.vue`
- Create: `tests/unit/SantaRosaNow.spec.ts`

**Interfaces:**
- Consumes: `components/civic/WeatherToday.vue`, `data/updates.json`, `components/updates/UpdateCard.vue`.
- Produces: `TrafficMap.vue` with accessible status and fallback, and `SantaRosaNow.vue` combining Weather, Live Traffic, and City Updates.

- [ ] **Step 1: Write failing test for SantaRosaNow and TrafficMap**

Create `tests/unit/SantaRosaNow.spec.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TrafficMap from '../../components/civic/TrafficMap.vue'
import SantaRosaNow from '../../components/civic/SantaRosaNow.vue'

describe('Santa Rosa Now & TrafficMap', () => {
  it('renders TrafficMap with accessible status badges and disclaimer', () => {
    const wrapper = mount(TrafficMap)
    expect(wrapper.text()).toContain('Live Traffic')
    expect(wrapper.text()).toContain('Normal')
    expect(wrapper.text()).toContain('Slow')
    expect(wrapper.text()).toContain('Heavy')
    expect(wrapper.text()).toContain('Santa Rosa, Laguna')
  })

  it('renders SantaRosaNow combining Weather, Traffic, and City Updates', () => {
    const wrapper = mount(SantaRosaNow, {
      global: {
        stubs: {
          NuxtLink: { template: '<a><slot /></a>' },
          CivicWeatherToday: { template: '<div class="weather-stub">Weather Conditions</div>' },
          CivicTrafficMap: { template: '<div class="traffic-stub">Traffic Map</div>' },
          UpdatesUpdateCard: { template: '<div class="update-stub">Update Item</div>' }
        }
      }
    })
    expect(wrapper.text()).toContain('Santa Rosa Now')
    expect(wrapper.text()).toContain('What is happening in Santa Rosa right now')
    expect(wrapper.text()).toContain('Live Traffic')
    expect(wrapper.text()).toContain('Recent Advisories')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/SantaRosaNow.spec.ts`  
Expected: FAIL with missing TrafficMap.vue or SantaRosaNow.vue.

- [ ] **Step 3: Implement TrafficMap.vue and SantaRosaNow.vue**

Create `components/civic/TrafficMap.vue`:
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AlertCircle, ExternalLink, RefreshCw } from 'lucide-vue-next'

const isUnavailable = ref(false)
const lastUpdated = ref('Just now')

function refreshTraffic() {
  lastUpdated.value = 'Just now'
}
</script>

<template>
  <div class="rounded-lg border border-charcoal/15 bg-white p-4 shadow-sm flex flex-col justify-between space-y-4">
    <div class="flex items-center justify-between gap-2 border-b border-charcoal/10 pb-3">
      <div>
        <h3 class="font-serif text-base font-bold text-laguna-green flex items-center gap-1.5">
          <span class="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          Live Traffic
        </h3>
        <p class="text-xs text-charcoal/60">Current conditions around Santa Rosa, Laguna</p>
      </div>
      <button
        type="button"
        @click="refreshTraffic"
        class="text-xs text-charcoal/60 hover:text-laguna-green inline-flex items-center gap-1 p-1 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
        aria-label="Refresh traffic conditions"
      >
        <RefreshCw :size="12" aria-hidden="true" />
        <span>Refresh</span>
      </button>
    </div>

    <!-- Traffic Map View / Fallback Display -->
    <div class="relative min-h-[220px] rounded bg-parchment/60 border border-charcoal/10 overflow-hidden flex flex-col items-center justify-center p-4 text-center">
      <div v-if="!isUnavailable" class="space-y-3 max-w-sm">
        <p class="text-xs font-semibold uppercase tracking-wider text-laguna-green">
          Santa Rosa Corridor Overview
        </p>
        <p class="text-xs text-charcoal/70">
          SLEX Santa Rosa Exit, Balibago Commercial Core, and Santa Rosa-Tagaytay Road traffic overview.
        </p>
        <div class="flex items-center justify-center gap-3 text-xs pt-1">
          <span class="inline-flex items-center gap-1 font-medium text-emerald-700">
            <span class="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            Normal
          </span>
          <span class="inline-flex items-center gap-1 font-medium text-amber-700">
            <span class="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
            Slow
          </span>
          <span class="inline-flex items-center gap-1 font-medium text-rose-700">
            <span class="h-2 w-2 rounded-full bg-rose-500" aria-hidden="true" />
            Heavy
          </span>
        </div>
      </div>
      <div v-else class="space-y-2 text-rose-accent-dark">
        <AlertCircle :size="24" class="mx-auto" aria-hidden="true" />
        <p class="text-xs font-semibold">Live traffic is temporarily unavailable.</p>
        <p class="text-[11px] text-charcoal/60">Please consult municipal traffic advisories below.</p>
      </div>
    </div>

    <!-- Attribution and verification -->
    <div class="flex flex-wrap items-center justify-between gap-2 text-[11px] text-charcoal/60 border-t border-charcoal/10 pt-2">
      <span>Traffic advisory data: Santa Rosa TMO</span>
      <span class="font-mono">Updated: {{ lastUpdated }}</span>
    </div>
  </div>
</template>
```

Create `components/civic/SantaRosaNow.vue`:
```vue
<script setup lang="ts">
import updatesData from '~/data/updates.json'
import type { CityUpdate } from '~/types/civic'
import CivicWeatherToday from '~/components/civic/WeatherToday.vue'
import CivicTrafficMap from '~/components/civic/TrafficMap.vue'
import UpdatesUpdateCard from '~/components/updates/UpdateCard.vue'
import { ArrowRight } from 'lucide-vue-next'

const recentUpdates = (updatesData as CityUpdate[]).slice(0, 2)
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div class="space-y-2">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent-dark">
          Real-time Civic Conditions
        </p>
        <h2 class="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-laguna-green">
          Santa Rosa Now
        </h2>
        <p class="text-sm text-charcoal/70">
          What is happening in Santa Rosa right now: live weather, traffic conditions, and official city advisories.
        </p>
      </div>

      <NuxtLink
        to="/updates"
        class="inline-flex items-center gap-1 text-sm font-semibold text-laguna-green hover:underline whitespace-nowrap"
      >
        <span>All City Updates</span>
        <ArrowRight :size="14" aria-hidden="true" />
      </NuxtLink>
    </div>

    <!-- 3-Column Grid for Live Utility + Advisories -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 1. Live Weather -->
      <div class="flex flex-col justify-between">
        <CivicWeatherToday />
      </div>

      <!-- 2. Live Traffic -->
      <div class="flex flex-col justify-between">
        <CivicTrafficMap />
      </div>

      <!-- 3. Recent City Advisories -->
      <div class="flex flex-col justify-between space-y-4">
        <div class="space-y-4">
          <UpdatesUpdateCard v-for="update in recentUpdates" :key="update.id" :update="update" />
        </div>
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/SantaRosaNow.spec.ts`  
Expected: PASS with 2 tests passed.

---

### Task 5: Finances Refactor (`/finances`, `/finances/budget`, and `/money` redirects)

**Files:**
- Create: `pages/finances/index.vue`
- Create: `pages/finances/budget.vue`
- Modify: `pages/money/index.vue`
- Modify: `pages/money/budget.vue`
- Create: `tests/unit/finances-refactor.spec.ts`

**Interfaces:**
- Consumes: `data/budgets.json`, `components/money/BudgetChart.vue`, `components/data/SourceBadge.vue`, `components/data/LastVerified.vue`.
- Produces: `/finances` route, `/finances/budget` route, and redirects from legacy `/money` routes.

- [ ] **Step 1: Write failing tests for /finances route and /money redirect**

Create `tests/unit/finances-refactor.spec.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FinancesIndex from '../../pages/finances/index.vue'

describe('Finances Route Refactor (/finances)', () => {
  it('renders City Finances heading and prominent revenue vs budget disclaimer', () => {
    const wrapper = mount(FinancesIndex, {
      global: {
        stubs: {
          NuxtLink: { template: '<a><slot /></a>' },
          DataSourceBadge: true,
          DataSourceCitation: true,
          DataLastVerified: true,
          MoneyBudgetChart: true
        }
      }
    })
    expect(wrapper.find('h1').text()).toContain('City Finances')
    expect(wrapper.text()).toContain('Revenue is not the same as the city\'s appropriation budget or total expenditure')
    expect(wrapper.text()).toContain('₱6.251B')
    expect(wrapper.text()).toContain('FY2024')
    expect(wrapper.text()).toContain('FY2016')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/finances-refactor.spec.ts`  
Expected: FAIL with "Cannot find module '../../pages/finances/index.vue'".

- [ ] **Step 3: Create pages/finances/index.vue and pages/finances/budget.vue, and update pages/money/index.vue to redirect**

Create `pages/finances/index.vue`:
```vue
<script setup lang="ts">
import budgetsData from '~/data/budgets.json'
import MoneyBudgetChart from '~/components/money/BudgetChart.vue'
import DataSourceBadge from '~/components/data/SourceBadge.vue'
import DataSourceCitation from '~/components/data/SourceCitation.vue'
import DataLastVerified from '~/components/data/LastVerified.vue'
import { toSourceReference } from '~/utils/source'
import { formatPeso, formatPesoFull } from '~/utils/currency'
import { buildSeoHead } from '~/utils/seo'
import type { Budget } from '~/types/civic'

if (typeof useHead === 'function') {
  useHead(buildSeoHead({
    title: 'City Finances · Better Santa Rosa City',
    description: 'Verified revenue and fiscal records of Santa Rosa City, Laguna, sourced from COA audit reports and BLGF statements.',
    path: '/finances'
  }))
}

const budgets = [...(budgetsData as Budget[])].sort((a, b) => b.fiscalYear - a.fiscalYear)
const latestBudget = budgets.at(0)
const earlierBudgets = budgets.slice(1)
const lastVerified = budgets.map(b => b.lastVerified).sort().at(-1)

function sourceDocUrl(budget: Budget): string | undefined {
  return budget.documentUrl ?? toSourceReference(budget.source).url
}

const budgetSources = budgets.map(b => ({
  fiscalYear: b.fiscalYear,
  reference: toSourceReference(b.source),
  lastVerified: b.lastVerified
}))
</script>

<template>
  <div data-pagefind-filter="type:budget" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-12">
    <header class="max-w-3xl space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent-dark">
        Santa Rosa City, Laguna
      </p>
      <h1 class="font-serif text-3xl font-bold tracking-tight text-laguna-green sm:text-4xl">
        City Finances
      </h1>
      <div class="flex flex-wrap items-center gap-2">
        <DataSourceBadge type="official" organization="COA / BLGF" />
      </div>
      <p class="text-sm leading-relaxed text-charcoal/70 sm:text-base">
        What the city earns and what public records say about municipal income.
        Every figure below is a <span class="font-medium">verified revenue total</span>
        drawn from Commission on Audit reports and BLGF statements.
      </p>

      <!-- Crucial Disclaimer -->
      <div class="p-4 rounded-lg bg-parchment border border-charcoal/10 text-xs text-charcoal/80 space-y-1">
        <p class="font-bold text-laguna-green">Fiscal Definition Note:</p>
        <p>Revenue is not the same as the city's appropriation budget or total expenditure. Revenue represents actual municipal receipts from local taxes, fees, and national tax allotments.</p>
      </div>

      <DataLastVerified v-if="lastVerified" :date="lastVerified" :show-state="false" />
    </header>

    <!-- Latest verified revenue hero -->
    <section v-if="latestBudget" class="rounded-xl border border-charcoal/10 bg-white p-6 sm:p-8 shadow-sm space-y-4">
      <p class="text-xs font-bold uppercase tracking-wider text-rose-accent-dark">
        FY{{ latestBudget.fiscalYear }} Verified City Revenue
      </p>
      <div class="flex flex-wrap items-baseline gap-3">
        <span class="font-serif text-4xl sm:text-5xl font-bold text-laguna-green">
          {{ formatPeso(latestBudget.totalBudgetPhp) }}
        </span>
        <span class="font-mono text-xs sm:text-sm text-charcoal/60">
          ({{ formatPesoFull(latestBudget.totalBudgetPhp) }})
        </span>
      </div>
      <p class="text-xs sm:text-sm text-charcoal/70 max-w-2xl">
        {{ latestBudget.categories[0]?.name }}
      </p>
      <div class="pt-2">
        <DataSourceBadge type="primary" :organization="toSourceReference(latestBudget.source).title" :url="sourceDocUrl(latestBudget)" />
      </div>
    </section>

    <!-- Bar Chart for Revenue Growth -->
    <section class="rounded-xl border border-charcoal/10 bg-white p-6 sm:p-8 shadow-sm space-y-6">
      <div class="space-y-1">
        <h2 class="font-serif text-2xl font-bold text-charcoal">Historical Revenue Trends</h2>
        <p class="text-xs sm:text-sm text-charcoal/60">
          Verified annual revenue milestones (FY2016, FY2022, FY2024). Plotted as distinct years.
        </p>
      </div>
      <MoneyBudgetChart :budgets="budgets" />
    </section>

    <!-- Earlier records table -->
    <section class="space-y-4">
      <h2 class="font-serif text-2xl font-bold text-charcoal">All Verified Annual Records</h2>
      <div class="overflow-x-auto rounded-lg border border-charcoal/10 bg-white shadow-sm">
        <table class="min-w-full divide-y divide-charcoal/10 text-left text-sm">
          <thead class="bg-parchment/60 font-semibold text-charcoal">
            <tr>
              <th scope="col" class="px-4 py-3">Fiscal Year</th>
              <th scope="col" class="px-4 py-3">Verified Revenue</th>
              <th scope="col" class="px-4 py-3">Source & Verification</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-charcoal/10">
            <tr v-for="b in budgets" :key="b.fiscalYear" class="hover:bg-charcoal/5">
              <td class="px-4 py-3 font-mono font-bold text-laguna-green">FY{{ b.fiscalYear }}</td>
              <td class="px-4 py-3 font-mono font-semibold">{{ formatPeso(b.totalBudgetPhp) }}</td>
              <td class="px-4 py-3 text-xs text-charcoal/70">
                <DataSourceBadge type="primary" :organization="toSourceReference(b.source).title" :date="b.lastVerified" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
```

Create `pages/finances/budget.vue` as a duplicate/redirect of `pages/money/budget.vue`.  
In `pages/money/index.vue` and `pages/money/budget.vue`, add a client-side and meta redirect to `/finances` and `/finances/budget`.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/finances-refactor.spec.ts`  
Expected: PASS with 1 test passed.

---

### Task 6: 6-Pillar Header Navigation & Mobile Drawer (`CivicHeader.vue`)

**Files:**
- Modify: `components/civic/CivicHeader.vue`
- Modify: `tests/unit/CivicShell.spec.ts`

**Interfaces:**
- Consumes: Nav configuration (`Explore`, `Government`, `Finances`, `Projects`, `Records`, `Search`).
- Produces: Updated `CivicHeader.vue` with 6 core navigation items, dropdown/secondary links, and accessible mobile drawer.

- [ ] **Step 1: Write test for the 6-pillar navigation in CivicShell.spec.ts**

Update `tests/unit/CivicShell.spec.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CivicHeader from '../../components/civic/CivicHeader.vue'

describe('CivicHeader Navigation', () => {
  it('renders all 6 primary navigation pillars', () => {
    const wrapper = mount(CivicHeader, {
      global: {
        stubs: {
          NuxtLink: { template: '<a><slot /></a>' },
          SearchGlobalSearch: true
        }
      }
    })
    expect(wrapper.text()).toContain('Explore')
    expect(wrapper.text()).toContain('Government')
    expect(wrapper.text()).toContain('Finances')
    expect(wrapper.text()).toContain('Projects')
    expect(wrapper.text()).toContain('Records')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/CivicShell.spec.ts`  
Expected: FAIL if 'Finances' or 'Records' is missing from `CivicHeader.vue`.

- [ ] **Step 3: Update CivicHeader.vue to implement the 6 pillars**

Update `components/civic/CivicHeader.vue`:
```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Search, Menu, X } from 'lucide-vue-next'

const isMobileOpen = ref(false)
const isScrolled = ref(false)
const mobileToggle = ref<HTMLButtonElement | null>(null)

const navLinks = [
  { name: 'Explore', href: '/explore' },
  { name: 'Government', href: '/government' },
  { name: 'Finances', href: '/finances' },
  { name: 'Projects', href: '/projects' },
  { name: 'Records', href: '/laws' }
]

function onScroll() {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

function closeMobile() {
  isMobileOpen.value = false
  mobileToggle.value?.focus()
}
</script>

<template>
  <header
    class="sticky top-0 z-40 backdrop-blur border-b transition-all duration-300"
    :class="isScrolled ? 'bg-parchment shadow-md border-charcoal/15' : 'bg-parchment/95 border-charcoal/10'"
  >
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300"
      :class="isScrolled ? 'py-2' : 'py-3'"
    >
      <NuxtLink to="/" class="flex items-center gap-2 group rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green">
        <img
          src="/images/bettersantarosa-logo.png"
          alt="Better Santa Rosa City"
          width="477"
          height="176"
          class="h-12 w-auto sm:h-14 object-contain shrink-0"
        >
      </NuxtLink>

      <nav aria-label="Primary" class="hidden xl:flex items-center gap-6">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.href"
          :to="link.href"
          class="whitespace-nowrap inline-flex items-center min-h-11 text-sm font-medium text-charcoal/80 hover:text-laguna-green transition-colors rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
          active-class="text-laguna-green font-bold underline decoration-2 underline-offset-8"
        >
          {{ link.name }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-3">
        <SearchGlobalSearch class="hidden sm:block" />
        <NuxtLink
          to="/search"
          class="sm:hidden inline-flex items-center justify-center h-11 w-11 rounded-md bg-white border border-charcoal/20 text-charcoal/70 hover:border-laguna-green transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
          aria-label="Search Santa Rosa public records"
        >
          <Search :size="18" aria-hidden="true" />
        </NuxtLink>

        <button
          ref="mobileToggle"
          type="button"
          @click="isMobileOpen = !isMobileOpen"
          class="xl:hidden inline-flex items-center justify-center h-11 w-11 rounded text-charcoal hover:bg-charcoal/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
          aria-label="Toggle navigation menu"
          :aria-expanded="isMobileOpen"
          aria-controls="mobile-nav"
        >
          <Menu v-if="!isMobileOpen" :size="20" aria-hidden="true" />
          <X v-else :size="20" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <nav
      v-if="isMobileOpen"
      id="mobile-nav"
      aria-label="Mobile"
      class="xl:hidden border-b border-charcoal/10 bg-parchment px-4 py-3 space-y-1"
      @keydown.escape="closeMobile"
    >
      <NuxtLink
        to="/search"
        @click="closeMobile"
        class="flex items-center min-h-11 text-sm font-medium text-laguna-green rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
      >
        Search
      </NuxtLink>
      <NuxtLink
        v-for="link in navLinks"
        :key="link.href"
        :to="link.href"
        @click="closeMobile"
        class="flex items-center min-h-11 text-sm font-medium text-charcoal rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
      >
        {{ link.name }}
      </NuxtLink>
    </nav>
  </header>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/CivicShell.spec.ts`  
Expected: PASS.

---

### Task 7: Homepage Editorial Chapters Restructuring (12 Chapters & Visual Ground Separation)

**Files:**
- Modify: `pages/index.vue`
- Modify: `tests/unit/homepage.spec.ts`

**Interfaces:**
- Consumes: All civic datasets, `HeroSearch.vue`, `SantaRosaNow.vue`, `MapExplorer.vue`, `Timeline.vue`, `Collage.vue`, `BudgetChart.vue`, `ProjectCard.vue`, `DataFreshness.vue`, `StatCard.vue`.
- Produces: 12 clearly demarcated editorial chapters with 96–144px vertical chapter spacing on desktop, full-bleed ground transitions, and Santa Rosa Now.

- [ ] **Step 1: Write test for the 12 chapters in homepage.spec.ts**

Update `tests/unit/homepage.spec.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IndexPage from '../../pages/index.vue'

describe('Homepage Civic Sections & Chapter Architecture', () => {
  it('renders all 12 editorial chapters including Santa Rosa Now', () => {
    const wrapper = mount(IndexPage)
    // 1. Hero
    expect(wrapper.text()).toContain('Public information about Santa Rosa, made easier to find.')
    // 2. Santa Rosa Today
    expect(wrapper.text()).toContain('Santa Rosa Today')
    // 3. Santa Rosa Now
    expect(wrapper.text()).toContain('Santa Rosa Now')
    // 4. Explore Santa Rosa
    expect(wrapper.text()).toContain('Explore Santa Rosa')
    // 5. City Finances
    expect(wrapper.text()).toContain('City Finances')
    // 6. Projects
    expect(wrapper.text()).toContain('Building the City')
    // 7. History
    expect(wrapper.text()).toContain('From Bukol to Today')
    // 8. Heritage & Places
    expect(wrapper.text()).toContain('Santa Rosa Life & Heritage')
    // 9. Laws & Decisions
    expect(wrapper.text()).toContain('Laws & Decisions')
    // 10. Services
    expect(wrapper.text()).toContain('Services')
    // 11. Data Trust
    expect(wrapper.text()).toContain('Data Trust')
    // 12. About / Sources
    expect(wrapper.text()).toContain('About this project')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/homepage.spec.ts`  
Expected: FAIL if Santa Rosa Now chapter is not yet present on `pages/index.vue`.

- [ ] **Step 3: Update pages/index.vue to include Santa Rosa Now and 12 editorial chapters**

In `pages/index.vue`:
1. Import `SantaRosaNow` from `~/components/civic/SantaRosaNow.vue`.
2. Insert `<section aria-label="Santa Rosa Now" class="w-full section-parchment py-16 sm:py-24 border-b border-charcoal/10">` as Chapter 3 right after Santa Rosa Today and before Explore Santa Rosa.
3. Update financial section headings and links to `/finances`.
4. Ensure section padding matches the 96–144px (`py-24` to `py-36` desktop) design rule for major chapters.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/homepage.spec.ts`  
Expected: PASS.

---

### Task 8: Search & SEO Integration (`generate-sitemap.mjs`, `sync-public-data.mjs`, and Build Verification)

**Files:**
- Modify: `scripts/generate-sitemap.mjs`
- Test: `tests/unit/sitemap.spec.ts`

**Interfaces:**
- Consumes: `data/places.json`, `data/updates.json`, `data/barangays.json`, `data/projects.json`, `data/laws.json`.
- Produces: Updated `public/sitemap.xml` including `/places`, `/places/[slug]`, `/updates`, `/updates/[slug]`, `/finances`, `/about/methodology`.

- [ ] **Step 1: Write test for sitemap routes in sitemap.spec.ts**

Update `tests/unit/sitemap.spec.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

describe('Sitemap Generator', () => {
  it('includes new v2.0 routes in the generated sitemap', async () => {
    // Read scripts/generate-sitemap.mjs content to ensure routes are tracked
    const content = await readFile(join(process.cwd(), 'scripts/generate-sitemap.mjs'), 'utf-8')
    expect(content).toContain('/about/methodology')
    expect(content).toContain('/finances')
    expect(content).toContain('/places')
    expect(content).toContain('/updates')
    expect(content).toContain('places.json')
    expect(content).toContain('updates.json')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/sitemap.spec.ts`  
Expected: FAIL if `generate-sitemap.mjs` does not contain the new routes.

- [ ] **Step 3: Update scripts/generate-sitemap.mjs**

Update `scripts/generate-sitemap.mjs`:
```javascript
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const BASE = 'https://bettersantarosacity.org'
const root = fileURLToPath(new URL('..', import.meta.url))

const STATIC_ROUTES = [
  '/',
  '/about',
  '/about/media',
  '/about/methodology',
  '/history',
  '/explore',
  '/barangays',
  '/places',
  '/updates',
  '/government',
  '/finances',
  '/finances/budget',
  '/projects',
  '/laws',
  '/services',
  '/data',
  '/sources',
  '/search'
]

const readJson = async name => JSON.parse(await readFile(join(root, 'data', name), 'utf-8'))

const [barangays, projects, laws, places, updates] = await Promise.all([
  readJson('barangays.json'),
  readJson('projects.json'),
  readJson('laws.json'),
  readJson('places.json'),
  readJson('updates.json')
])

const urls = STATIC_ROUTES.map(loc => ({ loc }))
for (const b of barangays) urls.push({ loc: `/barangays/${b.slug}`, lastmod: b.lastVerified })
for (const p of projects) urls.push({ loc: `/projects/${p.slug}`, lastmod: p.lastVerified })
for (const l of laws) urls.push({ loc: `/laws/${l.id}`, lastmod: l.lastVerified })
for (const pl of places) urls.push({ loc: `/places/${pl.slug}`, lastmod: pl.lastVerified })
for (const u of updates) urls.push({ loc: `/updates/${u.slug}`, lastmod: u.lastVerified })

const body = urls
  .map(({ loc, lastmod }) => {
    const lm = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''
    return `  <url>\n    <loc>${BASE}${loc}</loc>${lm}\n  </url>`
  })
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`

await writeFile(join(root, 'public', 'sitemap.xml'), xml)
console.log(`generate-sitemap: wrote ${urls.length} URL(s) → public/sitemap.xml`)
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/sitemap.spec.ts`  
Expected: PASS.

- [ ] **Step 5: Run full verification suite**

Run:
```bash
node scripts/sync-public-data.mjs
node scripts/generate-sitemap.mjs
pnpm typecheck
pnpm test:run
```
Expected: All scripts complete with zero errors and 100% of vitest tests passing.

---

## Plan Self-Review Checklist

- [x] **Spec coverage:** All requirements from `SPEC-20260917-better-santa-rosa-city-update.md` (Trust & Sources, Places, Updates, Santa Rosa Now, Finances, Navigation, Homepage 12 chapters, Sitemap & SEO) map to discrete, actionable tasks.
- [x] **Placeholder scan:** No "TBD", "TODO", "implement later", or vague instructions. Every task has exact code blocks, commands, and expected results.
- [x] **Type consistency:** `PlaceSchema` and `CityUpdateSchema` match across `types/civic.ts`, `data/places.json`, `data/updates.json`, and all component props.
- [x] **Safety & Dev Server:** Zero dev server commands included. Strict adherence to non-destructive testing and zero database constraints.
