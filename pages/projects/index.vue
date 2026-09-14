<script setup lang="ts">
import { computed, ref } from 'vue'
import projectsData from '~/data/projects.json'
import ProjectsProjectCard from '~/components/projects/ProjectCard.vue'
import DataSourceBadge from '~/components/data/SourceBadge.vue'
import DataLastVerified from '~/components/data/LastVerified.vue'
import type { Project } from '~/types/civic'

// Auto-imports are Nuxt-only; the guard keeps this page mountable under plain Vitest.
if (typeof useHead === 'function') {
  useHead({
    title: 'City Projects — Better Santa Rosa City',
    meta: [
      {
        name: 'description',
        content: 'Infrastructure and civic projects in Santa Rosa City, Laguna — filterable by status, barangay, category and year, each traced to its cited source.'
      }
    ]
  })
}

const projects = projectsData as Project[]

const PROJECT_STATUSES: Project['status'][] = [
  'Planned',
  'Ongoing',
  'Completed',
  'Cancelled',
  'Unknown'
]

// Bonus: ?status=<Status> deep-links a preselected filter when the value is valid.
const queryStatus = typeof useRoute === 'function' ? useRoute().query.status : null
const initialStatus: Project['status'] | '' =
  typeof queryStatus === 'string' && (PROJECT_STATUSES as string[]).includes(queryStatus)
    ? (queryStatus as Project['status'])
    : ''

const selectedStatus = ref<Project['status'] | ''>(initialStatus)
const selectedBarangay = ref('')
const selectedCategory = ref('')
const selectedYear = ref('')

// Barangay options are the values as they appear in the data — including honest
// markers like "Citywide" and "Multiple barangays", never normalized away.
const barangayOptions = [...new Set(projects.map(p => p.barangay))].sort((a, b) => a.localeCompare(b))
const categoryOptions = [...new Set(projects.map(p => p.category))].sort((a, b) => a.localeCompare(b))
const yearOptions = [...new Set(
  projects.map(p => p.year).filter((y): y is number => y != null)
)].sort((a, b) => b - a)

const filteredProjects = computed(() =>
  projects.filter(p =>
    (selectedStatus.value === '' || p.status === selectedStatus.value) &&
    (selectedBarangay.value === '' || p.barangay === selectedBarangay.value) &&
    (selectedCategory.value === '' || p.category === selectedCategory.value) &&
    (selectedYear.value === '' || String(p.year) === selectedYear.value)
  )
)

const hasActiveFilters = computed(() =>
  selectedStatus.value !== '' ||
  selectedBarangay.value !== '' ||
  selectedCategory.value !== '' ||
  selectedYear.value !== ''
)

function clearFilters() {
  selectedStatus.value = ''
  selectedBarangay.value = ''
  selectedCategory.value = ''
  selectedYear.value = ''
}

const lastVerified = projects.map(p => p.lastVerified).sort().at(-1)
</script>

<template>
  <div data-pagefind-filter="type:projects" class="flex flex-col gap-12">
    <header class="max-w-3xl space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent">
        Santa Rosa City, Laguna
      </p>
      <h1 class="font-serif text-3xl font-bold tracking-tight text-laguna-green sm:text-4xl">
        City Projects
      </h1>
      <div class="flex flex-wrap items-center gap-2">
        <DataSourceBadge type="external" />
      </div>
      <p class="text-sm leading-relaxed text-charcoal/70 sm:text-base">
        Infrastructure and civic projects traced to public records and verified
        reporting. Coverage is limited to what the cited sources support —
        undisclosed costs and unverified details are labeled, never filled in.
      </p>
      <DataLastVerified v-if="lastVerified" :date="lastVerified" :show-state="false" />
    </header>

    <!-- Filter bar — client-side over the embedded dataset -->
    <section aria-labelledby="filters-heading">
      <h2 id="filters-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
        Filter projects
      </h2>
      <form class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" @submit.prevent>
        <div>
          <label for="filter-status" class="text-xs font-semibold uppercase tracking-wide text-charcoal/60">
            Status
          </label>
          <select
            id="filter-status"
            v-model="selectedStatus"
            class="mt-1 w-full rounded-md border border-charcoal/20 bg-white py-2 px-3 text-sm text-charcoal focus:border-laguna-green focus:outline-none focus:ring-2 focus:ring-laguna-green/30"
          >
            <option value="">All statuses</option>
            <option v-for="s in PROJECT_STATUSES" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
        <div>
          <label for="filter-barangay" class="text-xs font-semibold uppercase tracking-wide text-charcoal/60">
            Barangay
          </label>
          <select
            id="filter-barangay"
            v-model="selectedBarangay"
            class="mt-1 w-full rounded-md border border-charcoal/20 bg-white py-2 px-3 text-sm text-charcoal focus:border-laguna-green focus:outline-none focus:ring-2 focus:ring-laguna-green/30"
          >
            <option value="">All barangays</option>
            <option v-for="b in barangayOptions" :key="b" :value="b">{{ b }}</option>
          </select>
        </div>
        <div>
          <label for="filter-category" class="text-xs font-semibold uppercase tracking-wide text-charcoal/60">
            Category
          </label>
          <select
            id="filter-category"
            v-model="selectedCategory"
            class="mt-1 w-full rounded-md border border-charcoal/20 bg-white py-2 px-3 text-sm text-charcoal focus:border-laguna-green focus:outline-none focus:ring-2 focus:ring-laguna-green/30"
          >
            <option value="">All categories</option>
            <option v-for="c in categoryOptions" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <div>
          <label for="filter-year" class="text-xs font-semibold uppercase tracking-wide text-charcoal/60">
            Year
          </label>
          <select
            id="filter-year"
            v-model="selectedYear"
            class="mt-1 w-full rounded-md border border-charcoal/20 bg-white py-2 px-3 text-sm text-charcoal focus:border-laguna-green focus:outline-none focus:ring-2 focus:ring-laguna-green/30"
          >
            <option value="">All years</option>
            <option v-for="y in yearOptions" :key="y" :value="String(y)">{{ y }}</option>
          </select>
        </div>
      </form>
    </section>

    <!-- Results -->
    <section aria-labelledby="results-heading">
      <div class="flex flex-wrap items-baseline justify-between gap-2 border-b border-charcoal/10 pb-2">
        <h2 id="results-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
          Projects
        </h2>
        <span class="text-xs font-medium text-charcoal/50" role="status" aria-live="polite">
          {{ filteredProjects.length }} of {{ projects.length }} project{{ projects.length === 1 ? '' : 's' }}
        </span>
      </div>

      <ul v-if="filteredProjects.length" class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="p in filteredProjects" :key="p.id">
          <ProjectsProjectCard :project="p" />
        </li>
      </ul>
      <div
        v-else
        class="mt-6 rounded-md border border-charcoal/10 bg-white p-6 text-center text-sm text-charcoal/70"
      >
        <p>No projects match the selected filters.</p>
        <button
          v-if="hasActiveFilters"
          type="button"
          class="mt-3 rounded-sm text-sm font-semibold text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
          @click="clearFilters"
        >
          Clear filters
        </button>
      </div>
    </section>
  </div>
</template>
