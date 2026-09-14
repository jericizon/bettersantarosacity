# Spec: Better Santa Rosa City MVP

## 1. Objective & Product Vision
Better Santa Rosa City (`bettersantarosacity.org`) is an independent, community-maintained civic-information and transparency portal for the City of Santa Rosa, Laguna. The platform acts as a modern, accessible public-information discovery layer over authoritative government records (Santa Rosa LGU, COA, DBM, PhilGEPS, and national open datasets).

### Key Product Pillars
1. **Public Information Layer**: Synthesizes and clarifies complex civic data without replacing official transactional services.
2. **Strict Provenance & Source Attribution**: Every figure, project, and official record must explicitly cite its authoritative source and last-verified date.
3. **Zero-Database Architecture**: Operates 100% as a statically generated site (Nuxt 4 + Nuxt Content / static JSON + Pagefind), deployable to Cloudflare Pages for ₱0/month runtime cost.
4. **Distinct Non-Governmental Identity**: Combines modern civic-tech aesthetics (60%), data journalism (20%), Santa Rosa heritage (10%), and Laguna lake geography (10%) while never mimicking official government seals or misrepresenting municipal affiliation.
5. **Universal Static Search**: Client-side, fast full-text indexing with Pagefind across all pages and datasets without external APIs.

---

## 2. Capability Map

| Module ID | Responsibility | Depends On | Output Pages / Artifacts |
|---|---|---|---|
| `core-shell` | Design system, Nuxt 4 setup, Tailwind tokens, civic layout, header, footer, disclaimers | — | App layout, root theme, UI tokens |
| `schema-data` | TypeScript & Zod schemas for civic data; static JSON seed files (18 barangays, officials, budget, projects, laws, services, sources) | — | `data/*.json`, `types/*.ts`, schema tests |
| `search-engine` | Pagefind static indexing setup, client-side search UI component, keyboard shortcuts, modal & `/search` page | `core-shell`, `schema-data` | `/search`, `GlobalSearch.vue` |
| `city-profile` | Santa Rosa facts, land area (5,543 ha), 2004 cityhood, Bukol-to-modern historical timeline | `core-shell`, `schema-data` | `/explore`, `/about-santa-rosa` |
| `barangays` | 18 barangay directory, geographic grouping (Laguna Lake, Lowland Urban, Upper Tagaytay), individual profile pages | `core-shell`, `schema-data` | `/barangays`, `/barangays/[slug]` |
| `government` | Executive (Mayor, Vice Mayor), Legislative (City Council), Department directory, office contacts, source attribution | `core-shell`, `schema-data` | `/government` |
| `money-budget` | Annual budget breakdown, expenditure categories, source document links, neutral presentation | `core-shell`, `schema-data` | `/money`, `/money/budget` |
| `projects` | City infrastructure projects explorer, status badges (Planned, Ongoing, Completed, Unknown), cost, location, filters | `core-shell`, `schema-data` | `/projects`, `/projects/[slug]` |
| `laws-policies` | Ordinances, resolutions, executive orders directory, neutral summary view, source links | `core-shell`, `schema-data` | `/laws`, `/laws/[slug]` |
| `services` | Categorized directory linking to official government transactions with clear "Official service" disclaimers | `core-shell`, `schema-data` | `/services` |
| `open-data` | Public download portal for JSON/CSV datasets, data coverage indicators, citation guide | `schema-data` | `/data` |
| `provenance` | Source registry, methodology guide, `SourceBadge`, `SourceCitation`, and `DataFreshness` components | `core-shell`, `schema-data` | `/sources`, reusable citation components |
| `seo-perf` | Nuxt SEO, dynamic sitemap, robots.txt, OpenGraph, WCAG 2.1 AA accessibility audit, build verification | All modules | Static build, metadata, robots.txt |

---

## 3. Tech Stack & Dependencies

- **Framework**: Nuxt 4 (Vue 3, Vite, TypeScript strictly typed)
- **Package Manager**: `pnpm` (v11+)
- **Styling**: Tailwind CSS (with `@tailwindcss/typography` for editorial layouts)
- **Data & Validation**: Zod (for runtime validation of static JSON datasets and TypeScript type inference)
- **Search**: Pagefind (post-build static search indexer)
- **Charts / Visualizations**: Chart.js or Unovis / Vue lightweight charts for budget breakdown
- **Maps**: Leaflet + OpenStreetMap (client-only lazy-loaded)
- **Icons**: Lucide Icons (`lucide-vue-next` or Nuxt Icon)
- **Testing**: Vitest + `@vue/test-utils` for unit and component testing
- **Deployment**: Static output (`nuxi generate`) targeting Cloudflare Pages

---

## 4. Commands (using pnpm)

```bash
# Package Installation
pnpm install

# Type-checking and Linting
pnpm run typecheck
pnpm run lint

# Unit & Schema Validation Tests
pnpm test
pnpm test:run

# Build & Static Site Generation
pnpm run generate

# Pagefind Indexing (runs on .output/public)
pnpm run index:search
# or as postgenerate script:
# pnpm dlx pagefind --site .output/public

# Build & Index Verification (Production Build Pipeline)
pnpm run build:prod # runs generate && index:search

# Local Static Preview (User-managed, NOT run automatically by agent)
# pnpm run preview
```

---

## 5. Project Structure

```text
bettersantarosacity/
├── .github/
│   └── workflows/
│       └── deploy.yml              # Cloudflare Pages CI/CD workflow
├── app.vue                         # Root Nuxt entrypoint
├── assets/
│   └── css/
│       └── main.css                # Tailwind directives & design tokens
├── components/
│   ├── civic/
│   │   ├── CivicHeader.vue         # Navigation, search trigger, mobile drawer
│   │   ├── CivicFooter.vue         # Site links, legal disclaimer, sources
│   │   ├── DisclaimerBanner.vue    # Prominent non-governmental notice
│   │   └── Timeline.vue            # Barrio Bukol to modern growth
│   ├── data/
│   │   ├── SourceBadge.vue         # "Official Source" / "Community Presentation"
│   │   ├── SourceCitation.vue      # Inline & card source citation links
│   │   ├── LastVerified.vue        # Relative & ISO verification date
│   │   ├── StatCard.vue            # Verified city facts (18 barangays, land area)
│   │   └── DataFreshness.vue       # Dataset freshness indicator
│   ├── government/
│   │   ├── OfficialCard.vue        # Official profile with term, office, sources
│   │   └── DepartmentCard.vue      # Office contact & responsibilities
│   ├── projects/
│   │   ├── ProjectCard.vue         # Card with status, budget, barangay
│   │   ├── ProjectStatus.vue       # Status pill with accessible icons
│   │   └── ProjectFilter.vue       # Filter by status, barangay, year
│   ├── money/
│   │   └── BudgetChart.vue         # Breakdown of city expenditures
│   └── search/
│       ├── GlobalSearch.vue        # Search input with keyboard shortcut (Cmd+K)
│       └── SearchModal.vue         # Pagefind dialog overlay
├── content/                        # Nuxt Content / Editorial markdown
│   ├── pages/
│   │   ├── about.md
│   │   └── methodology.md
├── data/                           # Structured static JSON datasets
│   ├── city.json                   # Verified core city metrics & timeline
│   ├── barangays.json              # 18 barangays metadata & coordinates
│   ├── officials.json              # Mayor, Vice Mayor, Sangguniang Panlungsod
│   ├── departments.json            # City departments and contact points
│   ├── budgets.json                # Budget summaries & expenditure categories
│   ├── projects.json               # Capital & public works projects
│   ├── laws.json                   # Ordinances, resolutions, policies
│   ├── services.json               # City services & official external links
│   └── sources.json                # Authoritative source registry
├── pages/
│   ├── index.vue                   # Civic homepage & search hub
│   ├── explore.vue                 # City profile & historical narrative
│   ├── barangays/
│   │   ├── index.vue               # 18 Barangays directory
│   │   └── [slug].vue              # Barangay profile page
│   ├── government/
│   │   └── index.vue               # Officials & departments directory
│   ├── money/
│   │   ├── index.vue               # Financial overview & budget visualizer
│   │   └── budget.vue              # Detailed annual budget explorer
│   ├── projects/
│   │   ├── index.vue               # Searchable & filterable projects list
│   │   └── [slug].vue              # Project details & document links
│   ├── laws/
│   │   ├── index.vue               # Searchable city ordinances & resolutions
│   │   └── [slug].vue              # Ordinance summary & document link
│   ├── services/
│   │   └── index.vue               # Directory of public services & official links
│   ├── data/
│   │   └── index.vue               # Open data downloads (JSON/CSV)
│   ├── sources.vue                 # Sources registry & editorial methodology
│   └── search.vue                  # Dedicated full-page Pagefind search
├── server/                         # Nitro static endpoints (if needed for CSV gen)
├── tests/
│   ├── unit/
│   │   ├── schemas.spec.ts         # Zod validation against all data/*.json
│   │   └── components.spec.ts      # Component rendering & accessibility tests
├── types/
│   └── civic.ts                    # Zod schemas & inferred TypeScript interfaces
├── nuxt.config.ts                  # Nuxt 4 configuration, modules, SEO, Pagefind
├── package.json
├── pnpm-lock.yaml
├── tailwind.config.ts              # Custom civic color palette & typography
└── tsconfig.json
```

---

## 6. Design System & Tokens

### Palette
```css
/* Custom Civic Palette */
--color-laguna-green: #164A3D; /* Primary brand & deep accents */
--color-rose-accent:   #C96A73; /* Subtle civic identity / highlight */
--color-laguna-blue:  #5E9FA5; /* Lakeshore / nature / infrastructure */
--color-heritage-gold:#D6A94B; /* Civic history & badge accents */
--color-parchment:    #F6F3EA; /* Backgrounds & editorial cards */
--color-charcoal:     #182421; /* High-contrast text & borders */
--color-surface-white:#FFFFFF;
```

### Typography
- Primary Sans: `Inter` / `Manrope` for UI, data tables, and search controls.
- Editorial Serif: `Source Serif 4` for narrative historical sections and long-form methodology text.

### Code Style Conventions
- **TypeScript**: Strict mode enabled (`strict: true`). No `any` types.
- **Vue SFCs**: `<script setup lang="ts">` with typed props via `defineProps<{ ... }>()`.
- **Validation**: Every JSON file in `data/` must conform to an exported Zod schema in `types/civic.ts`.
- **Comments**: 1-2 lines maximum explaining non-obvious *why*. Never narrate obvious syntax.

```vue
<!-- Example: components/data/SourceCitation.vue -->
<script setup lang="ts">
import type { SourceReference } from '~/types/civic'

const props = defineProps<{
  source: SourceReference
  verifiedDate?: string
}>()
</script>

<template>
  <div class="inline-flex items-center gap-1.5 text-xs text-charcoal/80 bg-parchment px-2 py-1 rounded border border-charcoal/10">
    <span class="font-medium text-laguna-green">{{ source.title }}</span>
    <span v-if="verifiedDate" class="text-charcoal/60">· Verified {{ verifiedDate }}</span>
    <a
      v-if="source.url"
      :href="source.url"
      target="_blank"
      rel="noopener noreferrer"
      class="text-rose-accent hover:underline inline-flex items-center ml-0.5"
      aria-label="View original official document (opens in new tab)"
    >
      ↗
    </a>
  </div>
</template>
```

---

## 7. Data Models & Schemas (Zod)

All datasets in `data/*.json` are validated against strict Zod definitions:

1. **CityProfile**: `name`, `province`, `cityhoodYear` (2004), `barangayCount` (18), `landAreaHa` (5543), `timeline` (Array of events), `sources`.
2. **Barangay**: `name`, `slug`, `group` (`'Laguna Lake' | 'Lowland Urban' | 'Upper / Tagaytay'`), `description`, `latitude`, `longitude`, `source`, `lastVerified`.
3. **Official**: `name`, `position`, `office`, `term`, `officialUrl`, `source`, `lastVerified`.
4. **Budget**: `fiscalYear`, `totalBudgetPhp`, `categories` (`{ name: string, amountPhp: number, percentage: number }[]`), `documentUrl`, `source`, `lastVerified`.
5. **Project**: `name`, `slug`, `barangay`, `category`, `status` (`'Planned' | 'Ongoing' | 'Completed' | 'Unknown'`), `costPhp`, `implementingOffice`, `source`, `lastVerified`.
6. **Law**: `type` (`'ordinance' | 'resolution' | 'executive_order'`), `number`, `title`, `date`, `summary`, `documentUrl`, `source`, `lastVerified`.
7. **Service**: `category` (`'Business' | 'Taxes' | 'Permits' | 'Civil Registry' | 'Health' | 'Social Services' | 'Online Services'`), `title`, `description`, `officialUrl`, `lastVerified`.
8. **Source**: `id`, `name`, `type` (`'LGU' | 'COA' | 'DBM' | 'National' | 'Institutional'`), `url`, `notes`.

---

## 8. Boundaries & Safety Rules

- **Always**:
  - Display the prominent non-governmental disclaimer in the header/footer and on key editorial pages.
  - Link directly to original government documents where available.
  - Show "Data not available in the source reviewed" instead of fabricating missing information.
  - Validate all data files with automated Vitest schema tests.
  - Maintain WCAG 2.1 AA color contrast and visible keyboard focus states.
- **Ask First**:
  - Adding any database (PostgreSQL, Supabase, D1, etc.).
  - Introducing server-side runtime compute dependencies.
  - Modifying high-level project scope or deleting data files.
- **Never**:
  - Launch or start background dev servers (`pnpm dev`, `nuxt dev`, etc.) as part of agent tool calls.
  - Commit to restricted branches (`main`, `master`, `develop`, `staging`).
  - Claim official affiliation with the Santa Rosa City Government.
  - Invent, guess, or hallucinate budgetary figures, projects, or council ordinances.
  - Use aggressive web scraping that violates terms or creates denial-of-service risks.

---

## 9. Success Criteria (Definition of Done)

- [ ] Repository initialized cleanly with `pnpm` and Nuxt 4 configuration.
- [ ] Tailwind CSS configured with civic tokens and verified WCAG contrast.
- [ ] All 18 Santa Rosa barangays accurately represented with verified data points.
- [ ] 100% of data in `data/*.json` passes automated Zod schema validation tests in Vitest.
- [ ] Universal search index generated by Pagefind during static build (`pnpm run generate && pnpm run index:search`).
- [ ] Zero runtime server required — completely deployable to static hosting (Cloudflare Pages).
- [ ] All 10 major pages (Home, Explore, Barangays, Government, Money, Projects, Laws, Services, Data, Sources) fully functional.
- [ ] Clear disclaimer displayed on every page verifying non-governmental status.
- [ ] Zero TypeScript errors (`pnpm run typecheck` exits 0).
- [ ] Automated tests pass with 100% test success rate.

---

## 10. Open Questions & Surface Assumptions

### Assumptions Made
1. **No Backend Database**: The entire site is static and reads from version-controlled JSON files.
2. **Package Manager**: All commands, lockfiles, and dependencies strictly use `pnpm`.
3. **Data Accuracy over Volume**: The MVP launches with a curated, verified subset of actual public data (e.g., 2024–2026 published ordinances, verified department listings, approved budget highlights) rather than unverified bulk data.
4. **Git Branching**: Development occurs on a feature branch (e.g. `feat/mvp-scaffold`) rather than direct commits to `main`.
