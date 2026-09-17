<script setup lang="ts">
import { computed, ref } from 'vue'
import officialsData from '~/data/officials.json'
import departmentsData from '~/data/departments.json'
import GovernmentOfficialCard from '~/components/government/OfficialCard.vue'
import GovernmentDepartmentCard from '~/components/government/DepartmentCard.vue'
import DataSourceBadge from '~/components/data/SourceBadge.vue'
import DataLastVerified from '~/components/data/LastVerified.vue'
import { buildSeoHead } from '~/utils/seo'
import type { Department, Official } from '~/types/civic'

// Auto-imports are Nuxt-only; the guard keeps this page mountable under plain Vitest.
// GovernmentOrganization here describes the actual City Government of Santa
// Rosa — the subject of this directory — not this site (spec §28).
if (typeof useHead === 'function') {
  useHead(buildSeoHead({
    title: 'Government Directory · Better Santa Rosa City',
    description: 'Elected officials and city departments of Santa Rosa, Laguna, a community-maintained directory built on official city government records.',
    path: '/government',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'GovernmentOrganization',
      name: 'City Government of Santa Rosa',
      url: 'https://santarosacity.gov.ph',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Santa Rosa',
        addressRegion: 'Laguna',
        addressCountry: 'PH'
      }
    }
  }))
}

const officials = officialsData as Official[]
const departments = departmentsData as Department[]

// Position strings come from the verified roster; bucket by them rather than
// array order so a re-sorted dataset can't silently move an official.
const executive = officials.filter(o => o.position === 'City Mayor' || o.position === 'City Vice Mayor')
const representatives = officials.filter(o => o.position.includes('Representative'))
const councilors = officials.filter(o => o.position.startsWith('City Councilor'))

// --- Departments & Offices: searchable directory -------------------------------

const departmentQuery = ref('')

const filteredDepartments = computed(() => {
  const q = departmentQuery.value.trim().toLowerCase()
  if (!q) return departments
  return departments.filter(d =>
    `${d.name} ${d.head} ${d.responsibilities.join(' ')}`.toLowerCase().includes(q)
  )
})

const lastVerified = officials[0]?.lastVerified ?? departments[0]?.lastVerified
</script>

<template>
  <div data-pagefind-filter="type:officials" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-12">
    <header class="max-w-3xl space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent-dark">
        Santa Rosa City, Laguna
      </p>
      <h1 class="font-serif text-3xl font-bold tracking-tight text-laguna-green sm:text-4xl">
        Government Directory
      </h1>
      <div class="flex flex-wrap items-center gap-2">
        <DataSourceBadge type="community" />
      </div>
      <p class="text-sm leading-relaxed text-charcoal/70 sm:text-base">
        Elected officials and city departments, compiled from official city
        government records. This is a <span class="font-medium">community-maintained
        presentation</span>. Each entry cites the official source it was verified
        against, and details we cannot confirm are labeled
        <span class="font-medium">“Needs verification”</span>, never filled in.
      </p>
      <DataLastVerified v-if="lastVerified" :date="lastVerified" :show-state="false" />
    </header>

    <!-- Executive -->
    <section aria-labelledby="executive-heading">
      <div class="flex items-baseline justify-between gap-2 border-b border-charcoal/10 pb-2">
        <h2 id="executive-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
          Executive
        </h2>
        <span class="text-xs font-medium text-charcoal/70">
          {{ executive.length }} official{{ executive.length === 1 ? '' : 's' }}
        </span>
      </div>
      <ul class="mt-6 grid gap-4 sm:grid-cols-2">
        <li v-for="o in executive" :key="o.id">
          <GovernmentOfficialCard :official="o" />
        </li>
      </ul>
    </section>

    <!-- Legislative -->
    <section aria-labelledby="legislative-heading">
      <div class="flex items-baseline justify-between gap-2 border-b border-charcoal/10 pb-2">
        <h2 id="legislative-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
          Sangguniang Panlungsod <span class="font-sans text-base font-medium text-charcoal/70">(City Council)</span>
        </h2>
        <span class="text-xs font-medium text-charcoal/70">
          {{ councilors.length }} members incl. ex-officio
        </span>
      </div>
      <p class="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal/70">
        Twelve elected councilors plus the ABC (barangay) and SK (youth)
        federation presidents sitting ex-officio. The Vice Mayor presides over
        the council.
      </p>
      <ul class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="o in councilors" :key="o.id">
          <GovernmentOfficialCard :official="o" />
        </li>
      </ul>
    </section>

    <!-- Lone District Representative (national office, elected citywide) -->
    <section aria-labelledby="national-heading">
      <div class="flex items-baseline justify-between gap-2 border-b border-charcoal/10 pb-2">
        <h2 id="national-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
          Lone District Representative
        </h2>
      </div>
      <p class="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal/70">
        Elected citywide but sits in the House of Representatives, a national
        office, listed here because the city's official directory includes the
        post alongside city officials.
      </p>
      <ul class="mt-6 grid gap-4 sm:grid-cols-2">
        <li v-for="o in representatives" :key="o.id">
          <GovernmentOfficialCard :official="o" />
        </li>
      </ul>
    </section>

    <!-- Departments & Offices -->
    <section id="departments" aria-labelledby="departments-heading">
      <div class="flex items-baseline justify-between gap-2 border-b border-charcoal/10 pb-2">
        <h2 id="departments-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
          Departments &amp; Offices
        </h2>
        <span class="text-xs font-medium text-charcoal/70" role="status" aria-live="polite">
          {{ filteredDepartments.length }} of {{ departments.length }} offices
        </span>
      </div>
      <div class="mt-4 max-w-md">
        <label for="department-filter" class="sr-only">Filter departments and offices</label>
        <input
          id="department-filter"
          v-model="departmentQuery"
          type="search"
          autocomplete="off"
          placeholder="Filter departments · e.g. permits, health, budget..."
          class="w-full rounded-md border border-charcoal/20 bg-white py-2 px-3 text-sm text-charcoal placeholder:text-charcoal/70 focus:border-laguna-green focus:outline-none focus:ring-2 focus:ring-laguna-green/30"
        />
      </div>
      <ul v-if="filteredDepartments.length" class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="d in filteredDepartments" :key="d.id">
          <GovernmentDepartmentCard :department="d" />
        </li>
      </ul>
      <p v-else class="mt-6 rounded-md border border-charcoal/10 bg-white p-6 text-center text-sm text-charcoal/70">
        No departments match “{{ departmentQuery.trim() }}”.
      </p>
    </section>

    <!-- Transparency & Citizen's Charter -->
    <section aria-labelledby="transparency-charter-heading" class="rounded-xl border border-charcoal/10 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
      <div class="flex items-baseline justify-between gap-2 border-b border-charcoal/10 pb-2">
        <h2 id="transparency-charter-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
          Citizen’s Charter &amp; Transparency
        </h2>
      </div>
      <p class="text-sm leading-relaxed text-charcoal/75">
        Under Republic Act No. 11032 (Ease of Doing Business and Efficient Government Service Delivery Act of 2018), local government units maintain an official Citizen's Charter detailing service standards, fees, processing times, and document requirements. All government transactions and payments are completed exclusively through official City Government channels, never through this portal.
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
          <h3 class="font-serif text-base font-bold text-charcoal">DILG Full Disclosure Policy Portal (FDPP)</h3>
          <p class="text-xs text-charcoal/70 leading-relaxed">
            The Department of the Interior and Local Government requires all LGUs to post quarterly financial documents, bids, and budgets online.
          </p>
          <a
            href="https://fdpp.dilg.gov.ph"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex text-xs font-semibold text-laguna-green underline hover:text-rose-accent-dark"
          >
            Visit DILG Full Disclosure Portal ↗
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
