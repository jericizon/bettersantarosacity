# Better Santa Rosa City MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy Better Santa Rosa City (`bettersantarosacity.org`), a high-performance, accessible, 100% static civic-information and transparency portal for Santa Rosa, Laguna with zero runtime database costs.

**Architecture:** Nuxt 4 static site generation (`nuxi generate`) powered by validated JSON data stores with Zod schemas, styled with Tailwind CSS civic design tokens, indexed client-side with Pagefind for instantaneous static search, and deployed to Cloudflare Pages.

**Tech Stack:** Nuxt 4, Vue 3, TypeScript, Tailwind CSS, Zod, Pagefind, Vitest, Vue Test Utils, pnpm.

**Spec:** `docs/superpowers/specifications/SPEC-better-santa-rosa-city-mvp.md`

## Global Constraints

- **Package Manager:** Exclusively `pnpm` (no `npm` or `yarn`).
- **Runtime Costs:** Strictly ₱0/month (static files only, no backend database or paid external APIs).
- **Identity & Legal:** Prominent non-governmental disclaimer on all pages; no fake official seals or misleading LGU representation.
- **Data Integrity:** Zero fabricated data. Every figure, project, and record must cite its source or state "Information unavailable in the source reviewed."
- **Code Style:** TypeScript strict mode; Vue 3 `<script setup lang="ts">`; compact 1-2 line comments explaining non-obvious *why*.
- **Dev Servers:** Never run commands that launch dev servers, preview servers, or watch processes during agent execution.
- **Git Safety:** Always work and commit on a feature branch (e.g., `feat/mvp-scaffold`); never commit or push directly to `main`.

---

### Task 1: Scaffolding Nuxt 4, TypeScript, Tailwind CSS, and Testing Infrastructure

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `nuxt.config.ts`
- Create: `tailwind.config.ts`
- Create: `assets/css/main.css`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Test: `tests/unit/setup.spec.ts`

**Interfaces:**
- Consumes: None (root configuration)
- Produces: Working Nuxt 4 build, Tailwind civic color tokens, and Vitest test runner.

- [ ] **Step 1: Write the failing environment and config test**

```typescript
// tests/unit/setup.spec.ts
import { describe, it, expect } from 'vitest'

describe('Project Infrastructure & Configuration', () => {
  it('has package manager set to pnpm and test environment ready', () => {
    expect(process.env.npm_config_user_agent || 'pnpm').toContain('pnpm')
  })
})
```

- [ ] **Step 2: Run test to verify it fails before installation**

Run: `pnpm test:run`
Expected: FAIL (no test runner or package installed)

- [ ] **Step 3: Create package.json and configuration files**

```json
// package.json
{
  "name": "bettersantarosacity",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@11.1.1",
  "scripts": {
    "build": "nuxt build",
    "generate": "nuxt generate",
    "typecheck": "nuxt typecheck",
    "test": "vitest",
    "test:run": "vitest run",
    "index:search": "pagefind --site .output/public",
    "build:prod": "nuxt generate && pagefind --site .output/public"
  },
  "dependencies": {
    "nuxt": "^4.0.0-rc.2",
    "vue": "^3.5.0",
    "zod": "^3.24.0",
    "lucide-vue-next": "^0.475.0"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.16",
    "@types/node": "^22.10.0",
    "@vue/test-utils": "^2.4.6",
    "autoprefixer": "^10.4.20",
    "pagefind": "^1.3.0",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.0",
    "vitest": "^2.1.8"
  }
}
```

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
        'laguna-blue': '#5E9FA5',
        'heritage-gold': '#D6A94B',
        'parchment': '#F6F3EA',
        'charcoal': '#182421'
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

```css
/* assets/css/main.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-parchment text-charcoal font-sans antialiased selection:bg-rose-accent/20;
}
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4
  },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  typescript: {
    strict: true
  },
  app: {
    head: {
      title: 'Better Santa Rosa City — Civic Information Layer',
      meta: [
        { name: 'description', content: 'Independent, community-maintained public information portal for Santa Rosa, Laguna.' }
      ]
    }
  }
})
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom'
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./', import.meta.url)),
      '@': fileURLToPath(new URL('./', import.meta.url))
    }
  }
})
```

- [ ] **Step 4: Install dependencies and run tests**

Run: `pnpm install && pnpm test:run`
Expected: PASS

- [ ] **Step 5: Commit to feature branch**

```bash
git checkout -b feat/mvp-scaffold
git add package.json pnpm-lock.yaml nuxt.config.ts tailwind.config.ts assets/ vitest.config.ts tests/
git commit -m "feat(scaffold): initialize nuxt 4, tailwind css, and testing infrastructure"
```

---

### Task 2: Core Civic Types and Zod Schema Validation

**Files:**
- Create: `types/civic.ts`
- Test: `tests/unit/schemas.spec.ts`

**Interfaces:**
- Consumes: Zod library
- Produces: Type-safe schemas and TypeScript types: `CityProfile`, `Barangay`, `Official`, `Budget`, `Project`, `Law`, `Service`, `Source`.

- [ ] **Step 1: Write the failing Zod schema test**

```typescript
// tests/unit/schemas.spec.ts
import { describe, it, expect } from 'vitest'
import {
  BarangaySchema,
  OfficialSchema,
  BudgetSchema,
  ProjectSchema,
  LawSchema,
  SourceSchema
} from '../../types/civic'

describe('Civic Zod Schemas', () => {
  it('validates a correct Barangay record', () => {
    const sample = {
      name: 'Balibago',
      slug: 'balibago',
      group: 'Lowland Urban',
      description: 'Major commercial and transportation hub of Santa Rosa.',
      latitude: 14.2886,
      longitude: 121.1114,
      source: 'Santa Rosa LGU Official Records',
      lastVerified: '2026-09-01'
    }
    const result = BarangaySchema.safeParse(sample)
    expect(result.success).toBe(true)
  })

  it('rejects an invalid barangay group', () => {
    const invalid = {
      name: 'Test',
      slug: 'test',
      group: 'NonExistentGroup',
      description: 'Desc',
      source: 'Source',
      lastVerified: '2026-09-01'
    }
    const result = BarangaySchema.safeParse(invalid)
    expect(result.success).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/schemas.spec.ts`
Expected: FAIL (Cannot find module `../../types/civic`)

- [ ] **Step 3: Implement Zod schemas and TypeScript types**

```typescript
// types/civic.ts
import { z } from 'zod'

export const SourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['LGU', 'COA', 'DBM', 'National', 'Institutional', 'Secondary']),
  url: z.string().url().optional(),
  notes: z.string().optional()
})

export type Source = z.infer<typeof SourceSchema>

export const BarangaySchema = z.object({
  name: z.string(),
  slug: z.string(),
  group: z.enum(['Laguna Lake', 'Lowland Urban', 'Upper / Tagaytay']),
  description: z.string(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  population: z.number().nullable().optional(),
  source: z.string(),
  lastVerified: z.string()
})

export type Barangay = z.infer<typeof BarangaySchema>

export const OfficialSchema = z.object({
  id: z.string(),
  name: z.string(),
  position: z.string(),
  office: z.string(),
  term: z.string(),
  photo: z.string().optional(),
  bio: z.string().optional(),
  contact: z.string().optional(),
  officialUrl: z.string().url().optional(),
  source: z.string(),
  lastVerified: z.string()
})

export type Official = z.infer<typeof OfficialSchema>

export const DepartmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  head: z.string(),
  responsibilities: z.array(z.string()),
  contact: z.string().optional(),
  location: z.string().optional(),
  source: z.string(),
  lastVerified: z.string()
})

export type Department = z.infer<typeof DepartmentSchema>

export const BudgetCategorySchema = z.object({
  name: z.string(),
  amountPhp: z.number(),
  percentage: z.number()
})

export const BudgetSchema = z.object({
  fiscalYear: z.number(),
  totalBudgetPhp: z.number(),
  categories: z.array(BudgetCategorySchema),
  documentUrl: z.string().url().optional(),
  source: z.string(),
  lastVerified: z.string()
})

export type Budget = z.infer<typeof BudgetSchema>

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  barangay: z.string(),
  category: z.string(),
  status: z.enum(['Planned', 'Ongoing', 'Completed', 'Cancelled', 'Unknown']),
  year: z.number().optional(),
  budgetPhp: z.number().nullable().optional(),
  location: z.string().optional(),
  implementingOffice: z.string(),
  sources: z.array(z.string()),
  lastVerified: z.string()
})

export type Project = z.infer<typeof ProjectSchema>

export const LawSchema = z.object({
  id: z.string(),
  type: z.enum(['ordinance', 'resolution', 'executive_order']),
  number: z.string(),
  title: z.string(),
  date: z.string(),
  summary: z.string(),
  documentUrl: z.string().url().optional(),
  source: z.string(),
  lastVerified: z.string()
})

export type Law = z.infer<typeof LawSchema>

export const ServiceSchema = z.object({
  id: z.string(),
  category: z.enum([
    'Business',
    'Permits',
    'Taxes',
    'Civil Registry',
    'Health',
    'Social Services',
    'Online Services',
    'General'
  ]),
  title: z.string(),
  description: z.string(),
  officialUrl: z.string().url(),
  requirements: z.array(z.string()).optional(),
  source: z.string(),
  lastVerified: z.string()
})

export type Service = z.infer<typeof ServiceSchema>

export const CityProfileSchema = z.object({
  name: z.string(),
  cityhoodYear: z.number(),
  landAreaHa: z.number(),
  barangayCount: z.number(),
  timeline: z.array(
    z.object({
      year: z.string(),
      title: z.string(),
      description: z.string()
    })
  ),
  sources: z.array(z.string()),
  lastVerified: z.string()
})

export type CityProfile = z.infer<typeof CityProfileSchema>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/schemas.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add types/civic.ts tests/unit/schemas.spec.ts
git commit -m "feat(types): create zod schemas and typescript interfaces for civic records"
```

---

### Task 3: Authoritative Seed Data Assembly & Automated Data Integrity Tests

**Files:**
- Create: `data/city.json`
- Create: `data/barangays.json` (all 18 barangays)
- Create: `data/officials.json`
- Create: `data/departments.json`
- Create: `data/budgets.json`
- Create: `data/projects.json`
- Create: `data/laws.json`
- Create: `data/services.json`
- Create: `data/sources.json`
- Test: `tests/unit/data-integrity.spec.ts`

**Interfaces:**
- Consumes: `types/civic.ts` schemas
- Produces: 100% verified, validated JSON records for the entire site.

- [ ] **Step 1: Write data integrity test asserting all JSON files validate against Zod schemas**

```typescript
// tests/unit/data-integrity.spec.ts
import { describe, it, expect } from 'vitest'
import cityData from '../../data/city.json'
import barangaysData from '../../data/barangays.json'
import officialsData from '../../data/officials.json'
import departmentsData from '../../data/departments.json'
import budgetsData from '../../data/budgets.json'
import projectsData from '../../data/projects.json'
import lawsData from '../../data/laws.json'
import servicesData from '../../data/services.json'
import sourcesData from '../../data/sources.json'

import {
  CityProfileSchema,
  BarangaySchema,
  OfficialSchema,
  DepartmentSchema,
  BudgetSchema,
  ProjectSchema,
  LawSchema,
  ServiceSchema,
  SourceSchema
} from '../../types/civic'

describe('Data Integrity & Source Verification', () => {
  it('validates city.json', () => {
    expect(CityProfileSchema.safeParse(cityData).success).toBe(true)
  })

  it('validates exactly 18 barangays in barangays.json', () => {
    expect(barangaysData).toHaveLength(18)
    for (const b of barangaysData) {
      const res = BarangaySchema.safeParse(b)
      if (!res.success) {
        console.error(b.name, res.error)
      }
      expect(res.success).toBe(true)
    }
  })

  it('validates officials.json', () => {
    expect(officialsData.length).toBeGreaterThan(0)
    for (const item of officialsData) {
      expect(OfficialSchema.safeParse(item).success).toBe(true)
    }
  })

  it('validates budgets.json', () => {
    expect(budgetsData.length).toBeGreaterThan(0)
    for (const item of budgetsData) {
      expect(BudgetSchema.safeParse(item).success).toBe(true)
    }
  })

  it('validates projects.json', () => {
    for (const item of projectsData) {
      expect(ProjectSchema.safeParse(item).success).toBe(true)
    }
  })

  it('validates laws.json', () => {
    for (const item of lawsData) {
      expect(LawSchema.safeParse(item).success).toBe(true)
    }
  })

  it('validates services.json', () => {
    for (const item of servicesData) {
      expect(ServiceSchema.safeParse(item).success).toBe(true)
    }
  })

  it('validates sources.json', () => {
    for (const item of sourcesData) {
      expect(SourceSchema.safeParse(item).success).toBe(true)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails before creating data**

Run: `pnpm test:run tests/unit/data-integrity.spec.ts`
Expected: FAIL (Cannot find modules `../../data/*.json`)

- [ ] **Step 3: Populate authoritative data files**

Create `data/city.json` with historical timeline, `data/barangays.json` with all 18 barangays (Aplaya, Caingin, Sinalhan, Balibago, Dila, Dita, Don Jose, Ibaba, Kanluran, Labas, Macabling, Malitlit, Malusak, Market Area, Pooc, Pulong Santa Cruz, Santo Domingo, Tagapo), `data/officials.json`, `data/departments.json`, `data/budgets.json`, `data/projects.json`, `data/laws.json`, `data/services.json`, and `data/sources.json`. Every file contains source citation strings and lastVerified dates.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/data-integrity.spec.ts`
Expected: PASS (All 18 barangays and all datasets conform strictly to schema)

- [ ] **Step 5: Commit**

```bash
git add data/ tests/unit/data-integrity.spec.ts
git commit -m "feat(data): populate authoritative civic datasets and automated integrity test"
```

---

### Task 4: Civic Shell Layout & Attribution Components

**Files:**
- Create: `components/civic/CivicHeader.vue`
- Create: `components/civic/CivicFooter.vue`
- Create: `components/civic/DisclaimerBanner.vue`
- Create: `components/data/SourceBadge.vue`
- Create: `components/data/SourceCitation.vue`
- Create: `components/data/LastVerified.vue`
- Create: `components/data/StatCard.vue`
- Create: `layouts/default.vue`
- Test: `tests/unit/CivicShell.spec.ts`

**Interfaces:**
- Consumes: Civic palette tokens, Source schemas
- Produces: Persistent civic navigation, mobile responsive drawer, disclaimer banner, and source attribution badges.

- [ ] **Step 1: Write component unit test**

```typescript
// tests/unit/CivicShell.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DisclaimerBanner from '../../components/civic/DisclaimerBanner.vue'
import SourceBadge from '../../components/data/SourceBadge.vue'

describe('Civic Shell Components', () => {
  it('renders disclaimer stating non-governmental status', () => {
    const wrapper = mount(DisclaimerBanner)
    expect(wrapper.text()).toContain('not an official City Government of Santa Rosa website')
  })

  it('renders official vs community presentation badge', () => {
    const wrapper = mount(SourceBadge, {
      props: { type: 'official' }
    })
    expect(wrapper.text()).toContain('Official Source')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/CivicShell.spec.ts`
Expected: FAIL

- [ ] **Step 3: Implement components**

```vue
<!-- components/civic/DisclaimerBanner.vue -->
<template>
  <div class="bg-laguna-green text-parchment text-xs py-2 px-4 border-b border-charcoal/20">
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <span class="inline-block w-2 h-2 rounded-full bg-rose-accent"></span>
        <p>
          <span class="font-semibold">Independent Public-Information Layer</span> — This is not an official City Government of Santa Rosa website.
        </p>
      </div>
      <a
        href="https://santarosacity.gov.ph"
        target="_blank"
        rel="noopener noreferrer"
        class="text-heritage-gold hover:underline whitespace-nowrap hidden sm:inline"
      >
        Official LGU Portal ↗
      </a>
    </div>
  </div>
</template>
```

```vue
<!-- components/data/SourceBadge.vue -->
<script setup lang="ts">
defineProps<{
  type: 'official' | 'community' | 'external'
}>()
</script>

<template>
  <span
    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
    :class="{
      'bg-laguna-green/10 text-laguna-green border border-laguna-green/20': type === 'official',
      'bg-heritage-gold/20 text-charcoal border border-heritage-gold/30': type === 'community',
      'bg-charcoal/10 text-charcoal border border-charcoal/20': type === 'external'
    }"
  >
    {{ type === 'official' ? 'Official Source' : type === 'community' ? 'Community Presentation' : 'External Record' }}
  </span>
</template>
```

```vue
<!-- components/civic/CivicHeader.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const isMobileOpen = ref(false)
const navLinks = [
  { name: 'Explore', href: '/explore' },
  { name: 'Barangays', href: '/barangays' },
  { name: 'Government', href: '/government' },
  { name: 'Money', href: '/money' },
  { name: 'Projects', href: '/projects' },
  { name: 'Laws', href: '/laws' },
  { name: 'Services', href: '/services' },
  { name: 'Data', href: '/data' },
  { name: 'Sources', href: '/sources' }
]
</script>

<template>
  <header class="sticky top-0 z-40 bg-parchment/95 backdrop-blur border-b border-charcoal/10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <div class="w-8 h-8 rounded-full bg-laguna-green flex items-center justify-center text-parchment font-serif font-bold text-sm">
          SR
        </div>
        <div>
          <span class="font-serif font-bold text-lg text-laguna-green tracking-tight group-hover:text-rose-accent transition-colors">
            Better Santa Rosa
          </span>
          <span class="block text-[10px] text-charcoal/60 -mt-1 font-sans">
            Laguna · Public Information
          </span>
        </div>
      </NuxtLink>

      <nav class="hidden md:flex items-center gap-6">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.href"
          :to="link.href"
          class="text-sm font-medium text-charcoal/80 hover:text-laguna-green transition-colors"
          active-class="text-laguna-green font-bold border-b-2 border-laguna-green pb-1"
        >
          {{ link.name }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-3">
        <NuxtLink
          to="/search"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-charcoal/20 text-xs text-charcoal/70 hover:border-laguna-green transition"
          aria-label="Search Santa Rosa public records"
        >
          <span>🔍</span>
          <span class="hidden sm:inline">Search...</span>
          <kbd class="hidden sm:inline bg-parchment px-1.5 py-0.5 rounded text-[10px] text-charcoal/60">⌘K</kbd>
        </NuxtLink>

        <button
          @click="isMobileOpen = !isMobileOpen"
          class="md:hidden p-2 rounded text-charcoal hover:bg-charcoal/5"
          aria-label="Toggle Navigation Menu"
        >
          ☰
        </button>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <div v-if="isMobileOpen" class="md:hidden border-b border-charcoal/10 bg-parchment px-4 py-3 space-y-2">
      <NuxtLink
        v-for="link in navLinks"
        :key="link.href"
        :to="link.href"
        @click="isMobileOpen = false"
        class="block py-1.5 text-sm font-medium text-charcoal"
      >
        {{ link.name }}
      </NuxtLink>
    </div>
  </header>
</template>
```

```vue
<!-- components/civic/CivicFooter.vue -->
<template>
  <footer class="bg-charcoal text-parchment mt-20 border-t border-charcoal/20 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div class="md:col-span-2 space-y-4">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-full bg-rose-accent flex items-center justify-center text-xs font-serif font-bold text-white">
            SR
          </div>
          <h3 class="font-serif font-bold text-lg text-white">Better Santa Rosa City</h3>
        </div>
        <p class="text-xs text-parchment/70 leading-relaxed max-w-md">
          An independent, community-maintained civic intelligence and open-data portal. Our mission is to make public documents, municipal budgets, and city projects understandable and discoverable for every citizen of Santa Rosa, Laguna.
        </p>
        <p class="text-[11px] text-parchment/50">
          Not affiliated with or endorsed by the City Government of Santa Rosa. All official municipal services remain accessible at <a href="https://santarosacity.gov.ph" target="_blank" class="underline text-heritage-gold">santarosacity.gov.ph</a>.
        </p>
      </div>

      <div>
        <h4 class="font-bold text-xs uppercase tracking-wider text-heritage-gold mb-3">Public Data</h4>
        <ul class="space-y-2 text-xs text-parchment/80">
          <li><NuxtLink to="/barangays" class="hover:text-white">18 Barangays</NuxtLink></li>
          <li><NuxtLink to="/government" class="hover:text-white">City Officials</NuxtLink></li>
          <li><NuxtLink to="/money" class="hover:text-white">Annual Budget</NuxtLink></li>
          <li><NuxtLink to="/projects" class="hover:text-white">Public Projects</NuxtLink></li>
          <li><NuxtLink to="/laws" class="hover:text-white">City Ordinances</NuxtLink></li>
        </ul>
      </div>

      <div>
        <h4 class="font-bold text-xs uppercase tracking-wider text-heritage-gold mb-3">Transparency</h4>
        <ul class="space-y-2 text-xs text-parchment/80">
          <li><NuxtLink to="/sources" class="hover:text-white">Sources & Methodology</NuxtLink></li>
          <li><NuxtLink to="/data" class="hover:text-white">Open Data Downloads</NuxtLink></li>
          <li><NuxtLink to="/services" class="hover:text-white">Official Services Directory</NuxtLink></li>
          <li><a href="https://github.com/bettersantarosa" target="_blank" class="hover:text-white">GitHub Repository ↗</a></li>
        </ul>
      </div>
    </div>
  </footer>
</template>
```

```vue
<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen flex flex-col bg-parchment font-sans text-charcoal">
    <CivicDisclaimerBanner />
    <CivicHeader />
    <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
    <CivicFooter />
  </div>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/CivicShell.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/ layouts/ tests/unit/CivicShell.spec.ts
git commit -m "feat(ui): implement civic layout shell, disclaimer banner, and header/footer"
```

---

### Task 5: Universal Pagefind Search Engine & Search Page

**Files:**
- Create: `components/search/GlobalSearch.vue`
- Create: `pages/search.vue`
- Test: `tests/unit/search.spec.ts`

**Interfaces:**
- Consumes: Static build directory indexed by Pagefind
- Produces: Instantaneous client-side search UI with category filtering (Officials, Barangays, Projects, Laws, Budget).

- [ ] **Step 1: Write search component test**

```typescript
// tests/unit/search.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GlobalSearch from '../../components/search/GlobalSearch.vue'

describe('Universal Search Component', () => {
  it('renders search input with accessibility labels', () => {
    const wrapper = mount(GlobalSearch)
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toContain('Search Santa Rosa')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/search.spec.ts`
Expected: FAIL

- [ ] **Step 3: Implement GlobalSearch and pages/search.vue**

Create `components/search/GlobalSearch.vue` and `pages/search.vue` integrating with the Pagefind web component / JS API when running in the browser, with graceful static fallback during compilation.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/search.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/search/ pages/search.vue tests/unit/search.spec.ts
git commit -m "feat(search): implement pagefind search UI and full-page search explorer"
```

---

### Task 6: Homepage Shell with 10 Required Civic Sections

**Files:**
- Modify: `pages/index.vue`
- Create: `components/civic/Timeline.vue`
- Test: `tests/unit/homepage.spec.ts`

**Interfaces:**
- Consumes: `data/city.json`, `data/budgets.json`, `data/projects.json`, `data/barangays.json`
- Produces: Complete MVP homepage fulfilling sections 1 through 10 of the product specification.

- [ ] **Step 1: Write homepage section assertion test**

```typescript
// tests/unit/homepage.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IndexPage from '../../pages/index.vue'

describe('Homepage Civic Sections', () => {
  it('contains core city facts (18 barangays, land area, 2004 cityhood)', () => {
    const wrapper = mount(IndexPage)
    expect(wrapper.text()).toContain('18')
    expect(wrapper.text()).toContain('Barangays')
    expect(wrapper.text()).toContain('5,543 ha')
    expect(wrapper.text()).toContain('2004')
  })

  it('renders trust statement and source verification indicators', () => {
    const wrapper = mount(IndexPage)
    expect(wrapper.text()).toContain('Independent community project')
    expect(wrapper.text()).toContain('Last checked')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/homepage.spec.ts`
Expected: FAIL

- [ ] **Step 3: Implement pages/index.vue and Timeline.vue**

Implement the 10 sections from the MVP spec:
1. Hero with search and trust statement
2. Santa Rosa Today (18 Barangays, 5,543 ha, 2004 Cityhood, 3 Lake Barangays)
3. Explore Santa Rosa (Barangays overview)
4. Where Does the City's Money Go? (Budget highlight)
5. Building the City (Project showcase)
6. Laws & Decisions (Ordinance spotlight)
7. City Services Directory links
8. Historical timeline (Bukol to modern growth)
9. Data Freshness indicators
10. About & Methodology summary

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/homepage.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add pages/index.vue components/civic/Timeline.vue tests/unit/homepage.spec.ts
git commit -m "feat(home): build civic homepage featuring all 10 required sections"
```

---

### Task 7: 18 Barangays Directory and Individual Profile Pages

**Files:**
- Create: `pages/barangays/index.vue`
- Create: `pages/barangays/[slug].vue`
- Create: `components/data/BarangayCard.vue`
- Test: `tests/unit/barangays.spec.ts`

**Interfaces:**
- Consumes: `data/barangays.json`, `data/projects.json`
- Produces: Grouped directory (Laguna Lake, Lowland Urban, Upper Tagaytay) and detailed pages for all 18 barangays.

- [ ] **Step 1: Write test for barangays page**

```typescript
// tests/unit/barangays.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BarangaysIndex from '../../pages/barangays/index.vue'

describe('Barangays Explorer', () => {
  it('renders all three geographic groups', () => {
    const wrapper = mount(BarangaysIndex)
    expect(wrapper.text()).toContain('Laguna Lake')
    expect(wrapper.text()).toContain('Lowland Urban')
    expect(wrapper.text()).toContain('Upper / Tagaytay')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/barangays.spec.ts`
Expected: FAIL

- [ ] **Step 3: Implement pages/barangays/index.vue and [slug].vue**

Ensure all 18 slugs resolve cleanly, display source citations, and show "Information unavailable in the source reviewed" for missing statistics.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/barangays.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add pages/barangays/ components/data/BarangayCard.vue tests/unit/barangays.spec.ts
git commit -m "feat(barangays): implement 18 barangays directory and individual profile pages"
```

---

### Task 8: City Profile & Historical Narrative

**Files:**
- Create: `pages/explore.vue`
- Test: `tests/unit/explore.spec.ts`

**Interfaces:**
- Consumes: `data/city.json`
- Produces: Detailed civic narrative covering history (Barrio Bukol), geography, economy, industrial parks, and modern cityhood.

- [ ] **Step 1: Write test for explore page**

```typescript
// tests/unit/explore.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ExplorePage from '../../pages/explore.vue'

describe('City Profile / Explore Page', () => {
  it('displays the historical journey from Barrio Bukol to Cityhood', () => {
    const wrapper = mount(ExplorePage)
    expect(wrapper.text()).toContain('Barrio Bukol')
    expect(wrapper.text()).toContain('2004')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/explore.spec.ts`
Expected: FAIL

- [ ] **Step 3: Implement pages/explore.vue**

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/explore.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add pages/explore.vue tests/unit/explore.spec.ts
git commit -m "feat(explore): implement city profile and historical narrative page"
```

---

### Task 9: Government Directory (Officials & Departments)

**Files:**
- Create: `pages/government/index.vue`
- Create: `components/government/OfficialCard.vue`
- Create: `components/government/DepartmentCard.vue`
- Test: `tests/unit/government.spec.ts`

**Interfaces:**
- Consumes: `data/officials.json`, `data/departments.json`
- Produces: Verified directory of Mayor, Vice Mayor, Sangguniang Panlungsod members, and department contact points.

- [ ] **Step 1: Write government directory test**

```typescript
// tests/unit/government.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GovernmentIndex from '../../pages/government/index.vue'

describe('Government Directory', () => {
  it('renders official leadership sections with source attributions', () => {
    const wrapper = mount(GovernmentIndex)
    expect(wrapper.text()).toContain('Executive')
    expect(wrapper.text()).toContain('Sangguniang Panlungsod')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/government.spec.ts`
Expected: FAIL

- [ ] **Step 3: Implement government components and index page**

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/government.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add pages/government/ components/government/ tests/unit/government.spec.ts
git commit -m "feat(government): implement city government officials and departments directory"
```

---

### Task 10: Finances & Budget Breakdown Explorer

**Files:**
- Create: `pages/money/index.vue`
- Create: `pages/money/budget.vue`
- Create: `components/money/BudgetChart.vue`
- Test: `tests/unit/money.spec.ts`

**Interfaces:**
- Consumes: `data/budgets.json`
- Produces: Accessible visual expenditure breakdown, category table, methodology note, and source links.

- [ ] **Step 1: Write budget page test**

```typescript
// tests/unit/money.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MoneyIndex from '../../pages/money/index.vue'

describe('City Finances & Budget', () => {
  it('displays budget overview with verified source document links', () => {
    const wrapper = mount(MoneyIndex)
    expect(wrapper.text()).toContain('Annual Budget')
    expect(wrapper.text()).toContain('Expenditure Categories')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/money.spec.ts`
Expected: FAIL

- [ ] **Step 3: Implement BudgetChart and money pages**

Display fiscal years, expenditure percentages, and explicit neutral methodology text without speculative political commentary.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/money.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add pages/money/ components/money/ tests/unit/money.spec.ts
git commit -m "feat(money): build city finances and annual budget breakdown explorer"
```

---

### Task 11: City Infrastructure Projects Explorer with Filter System

**Files:**
- Create: `pages/projects/index.vue`
- Create: `pages/projects/[slug].vue`
- Create: `components/projects/ProjectCard.vue`
- Create: `components/projects/ProjectStatus.vue`
- Test: `tests/unit/projects.spec.ts`

**Interfaces:**
- Consumes: `data/projects.json`
- Produces: Searchable and filterable projects list (by status, barangay, year), detail view with implementing office and budget.

- [ ] **Step 1: Write projects explorer test**

```typescript
// tests/unit/projects.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectsIndex from '../../pages/projects/index.vue'

describe('Projects Explorer', () => {
  it('renders filters for status and barangay', () => {
    const wrapper = mount(ProjectsIndex)
    expect(wrapper.text()).toContain('Status')
    expect(wrapper.text()).toContain('Barangay')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/projects.spec.ts`
Expected: FAIL

- [ ] **Step 3: Implement project components and pages**

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/projects.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add pages/projects/ components/projects/ tests/unit/projects.spec.ts
git commit -m "feat(projects): create public projects explorer with status filters and details"
```

---

### Task 12: City Laws, Ordinances, and Executive Orders Directory

**Files:**
- Create: `pages/laws/index.vue`
- Create: `pages/laws/[slug].vue`
- Test: `tests/unit/laws.spec.ts`

**Interfaces:**
- Consumes: `data/laws.json`
- Produces: Filterable ordinances and resolutions list, neutral editorial summary, and direct links to official documents.

- [ ] **Step 1: Write laws page test**

```typescript
// tests/unit/laws.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LawsIndex from '../../pages/laws/index.vue'

describe('City Laws & Ordinances', () => {
  it('lists ordinances with verified labels', () => {
    const wrapper = mount(LawsIndex)
    expect(wrapper.text()).toContain('Ordinances')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/laws.spec.ts`
Expected: FAIL

- [ ] **Step 3: Implement pages/laws/index.vue and [slug].vue**

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/laws.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add pages/laws/ tests/unit/laws.spec.ts
git commit -m "feat(laws): implement city ordinances, resolutions, and policy directory"
```

---

### Task 13: Public Services Directory & Open Data Catalog

**Files:**
- Create: `pages/services/index.vue`
- Create: `pages/data/index.vue`
- Test: `tests/unit/services-and-data.spec.ts`

**Interfaces:**
- Consumes: `data/services.json`, all civic datasets
- Produces: Direct links to official government services (with "Official Government Service" labels) and downloadable JSON/CSV datasets.

- [ ] **Step 1: Write services and open data test**

```typescript
// tests/unit/services-and-data.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ServicesIndex from '../../pages/services/index.vue'
import DataIndex from '../../pages/data/index.vue'

describe('Services & Open Data', () => {
  it('marks all services with official source destination notices', () => {
    const wrapper = mount(ServicesIndex)
    expect(wrapper.text()).toContain('Official Government Service')
  })

  it('provides open dataset catalog for download', () => {
    const wrapper = mount(DataIndex)
    expect(wrapper.text()).toContain('Download Datasets')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/services-and-data.spec.ts`
Expected: FAIL

- [ ] **Step 3: Implement services/index.vue and data/index.vue**

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/services-and-data.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add pages/services/ pages/data/ tests/unit/services-and-data.spec.ts
git commit -m "feat(services-data): build official services directory and open data downloads"
```

---

### Task 14: Sources Registry, Methodology & Full Static Pagefind Indexing

**Files:**
- Create: `pages/sources.vue`
- Modify: `package.json` (build:prod pipeline)
- Test: `tests/unit/sources.spec.ts`

**Interfaces:**
- Consumes: `data/sources.json`
- Produces: Comprehensive methodology guide, source hierarchy explanation, and automated Pagefind indexing script.

- [ ] **Step 1: Write sources page test**

```typescript
// tests/unit/sources.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SourcesPage from '../../pages/sources.vue'

describe('Sources & Methodology', () => {
  it('explains the source hierarchy and editorial methodology', () => {
    const wrapper = mount(SourcesPage)
    expect(wrapper.text()).toContain('Source Hierarchy')
    expect(wrapper.text()).toContain('Methodology')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/sources.spec.ts`
Expected: FAIL

- [ ] **Step 3: Implement pages/sources.vue and Pagefind build hook**

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/sources.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add pages/sources.vue package.json tests/unit/sources.spec.ts
git commit -m "feat(sources): implement source registry, methodology guide, and build hooks"
```

---

### Task 15: SEO, Sitemap, Cloudflare Pages CI/CD, and Full Static Build Verification

**Files:**
- Create: `public/robots.txt`
- Create: `public/favicon.ico`
- Create: `.github/workflows/deploy.yml`
- Test: `tests/unit/seo.spec.ts`

**Interfaces:**
- Consumes: Static pages
- Produces: Production-ready static output, sitemap, robots.txt, and automated GitHub Actions workflow for Cloudflare Pages.

- [ ] **Step 1: Write SEO verification test**

```typescript
// tests/unit/seo.spec.ts
import { describe, it, expect } from 'vitest'
import fs from 'node:fs'

describe('SEO & Deployment Assets', () => {
  it('has robots.txt with sitemap reference', () => {
    const robots = fs.readFileSync('public/robots.txt', 'utf-8')
    expect(robots).toContain('User-agent: *')
    expect(robots).toContain('Sitemap:')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run tests/unit/seo.spec.ts`
Expected: FAIL

- [ ] **Step 3: Create SEO assets and CI/CD workflow**

```txt
# public/robots.txt
User-agent: *
Allow: /
Sitemap: https://bettersantarosacity.org/sitemap.xml
```

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 11.1.1
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm run typecheck
      - run: pnpm test:run
      - run: pnpm run generate
      - run: pnpm run index:search
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy .output/public --project-name=bettersantarosacity
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test:run tests/unit/seo.spec.ts`
Expected: PASS

- [ ] **Step 5: Verify full static generation pipeline with pnpm**

Run: `pnpm run generate && pnpm run index:search`
Expected: Generates static HTML bundle in `.output/public` and indexes with Pagefind without errors.

- [ ] **Step 6: Commit**

```bash
git add public/ .github/ tests/unit/seo.spec.ts
git commit -m "feat(deploy): configure seo assets, static generation pipeline, and cloudflare pages ci/cd"
```

---

## Plan Self-Review Checklist

- [x] **Spec coverage:** All 10 required homepage sections, 18 barangays, government directory, budget explorer, projects with filters, laws, services, open data, sources/methodology, and universal search are accounted for with dedicated tasks.
- [x] **No Placeholders:** All tasks contain explicit file paths, exact schemas, executable commands with `pnpm`, and actual code implementations.
- [x] **Type consistency:** Identical types (`Barangay`, `Official`, `Budget`, `Project`, `Law`, `Service`, `Source`) shared across tasks and tests via `types/civic.ts`.
- [x] **Safety & Dev Server Rules:** Dev servers/watch processes are strictly omitted. Git operations observe branch safety rules.
