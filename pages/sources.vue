<script setup lang="ts">
import sourcesData from '~/data/sources.json'
import DataSourceBadge from '~/components/data/SourceBadge.vue'
import DataLastVerified from '~/components/data/LastVerified.vue'
import type { Source } from '~/types/civic'

// Auto-imports are Nuxt-only; the guard keeps this page mountable under plain Vitest.
if (typeof useHead === 'function') {
  useHead({
    title: 'Sources & Methodology — Better Santa Rosa City',
    meta: [
      {
        name: 'description',
        content: 'How Better Santa Rosa City collects, verifies and labels public data — the source hierarchy, the full source registry, and the trust rules every dataset follows.'
      }
    ]
  })
}

const sources = sourcesData as Source[]

// Preference order from the editorial spec — reproduced verbatim.
const sourceHierarchy = [
  'Official Santa Rosa City Government',
  'Philippine national government agencies',
  'COA',
  'DBM',
  'Official government datasets',
  'Established institutional/academic sources',
  'Reputable secondary sources'
]

type BadgeType = 'official' | 'community' | 'external'

interface SourceGroup {
  type: Source['type']
  label: string
  tier: string
  badge: BadgeType
  sources: Source[]
}

// Registry groups follow the same preference order as the hierarchy above.
// Tier 5 (official datasets) is published by the agencies in tiers 2–4, so it
// has no registry type of its own.
const groupMeta: Record<Source['type'], { label: string; tier: string; badge: BadgeType }> = {
  LGU: { label: 'City Government (LGU)', tier: 'Tier 1', badge: 'official' },
  National: { label: 'National Government Agencies', tier: 'Tier 2', badge: 'official' },
  COA: { label: 'Commission on Audit', tier: 'Tier 3', badge: 'official' },
  DBM: { label: 'Department of Budget & Management', tier: 'Tier 4', badge: 'official' },
  Institutional: { label: 'Institutional & Academic', tier: 'Tier 6', badge: 'external' },
  Secondary: { label: 'Secondary Sources', tier: 'Tier 7', badge: 'external' }
}

const groupOrder: Source['type'][] = ['LGU', 'National', 'COA', 'DBM', 'Institutional', 'Secondary']

const sourceGroups: SourceGroup[] = groupOrder
  .map((type) => {
    const meta = groupMeta[type]
    return { type, ...meta, sources: sources.filter(s => s.type === type) }
  })
  .filter(group => group.sources.length > 0)

// Spec §23: the questions every dataset must answer, and how this site answers them.
const trustQuestions = [
  {
    question: 'Where did this come from?',
    answer: 'Every record carries a source citation naming the document or portal it was taken from, with a link to the original where one is published.'
  },
  {
    question: 'When was it last checked?',
    answer: 'Every record carries a lastVerified date — the day it was last compared against the source. Freshness badges flag records due for re-checking.'
  },
  {
    question: 'What period does it cover?',
    answer: 'Each dataset declares its coverage — the fiscal years, census rounds or term periods its records span.'
  },
  {
    question: 'Is it complete?',
    answer: 'Gaps are marked, never filled in. Records missing a field say so explicitly, and datasets that are known to be partial carry a coverage disclaimer.'
  },
  {
    question: 'Who maintains this page?',
    answer: 'Independent community volunteers — not the city government. Corrections are welcome through the public GitHub repository.'
  }
]
</script>

<template>
  <div data-pagefind-filter="type:pages" class="flex flex-col gap-12">
    <header class="max-w-3xl space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-rose-accent">
        Transparency · Santa Rosa City, Laguna
      </p>
      <h1 class="font-serif text-3xl font-bold tracking-tight text-laguna-green sm:text-4xl">
        Sources &amp; Methodology
      </h1>
      <div class="flex flex-wrap items-center gap-2">
        <DataSourceBadge type="community" />
      </div>
      <p class="text-sm leading-relaxed text-charcoal/70 sm:text-base">
        Where every figure on this site comes from, how it is checked, and the
        rules that keep this project honest. Nothing here is published without a
        traceable source — and nothing missing is invented.
      </p>
    </header>

    <!-- Source hierarchy -->
    <section aria-labelledby="hierarchy-heading">
      <div class="border-b border-charcoal/10 pb-2">
        <h2 id="hierarchy-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
          Source Hierarchy
        </h2>
      </div>
      <p class="mt-4 max-w-3xl text-sm leading-relaxed text-charcoal/75">
        When two records disagree, the higher-ranked source wins. We prefer, in
        order:
      </p>
      <ol class="mt-4 max-w-3xl list-decimal space-y-2 pl-6 text-sm leading-relaxed text-charcoal marker:font-semibold marker:text-laguna-green">
        <li v-for="tier in sourceHierarchy" :key="tier" class="pl-1">
          {{ tier }}
        </li>
      </ol>
      <p class="mt-4 max-w-3xl text-xs leading-relaxed text-charcoal/60">
        Official government datasets (tier 5) — census tables, procurement
        postings, budget statements — are published by the agencies in tiers 2–4
        and are cited per record. Every factual dataset on this site records its
        source.
      </p>
    </section>

    <!-- Methodology -->
    <section aria-labelledby="methodology-heading">
      <div class="border-b border-charcoal/10 pb-2">
        <h2 id="methodology-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
          Methodology
        </h2>
      </div>
      <div class="mt-5 max-w-3xl space-y-5 font-serif text-base leading-relaxed text-charcoal/80">
        <p>
          <span class="font-bold text-laguna-green">Collection.</span>
          Every dataset is compiled by hand from public records — full
          disclosure documents, annual audit reports, census releases, budget
          statements and the official portals listed in the registry below.
          There is no automated scraping: a person reads the source document
          and transcribes what it actually says.
        </p>
        <p>
          <span class="font-bold text-laguna-green">Verification.</span>
          Each record carries a <code class="font-sans text-sm">lastVerified</code>
          date — the day it was last checked against its source. The freshness
          badges shown across the site are computed from that date, so a stale
          record is visibly stale rather than silently wrong.
        </p>
        <p>
          <span class="font-bold text-laguna-green">Honesty rules.</span>
          Missing data is marked, never fabricated. Where a source does not
          provide a field, the record says
          <span class="italic">“Data not available in the source reviewed.”</span>
          Broken original links are labeled
          <span class="italic">“Original source currently unavailable,”</span>
          and figures that may have aged are marked
          <span class="italic">“Needs verification.”</span>
        </p>
        <p>
          <span class="font-bold text-laguna-green">Coverage.</span>
          No dataset here claims to be complete. Each declares what period and
          scope it covers, and known gaps are stated on the page rather than
          footnoted away. If a figure matters to you, verify it against the
          original document — that is what the links are for.
        </p>
      </div>
    </section>

    <!-- Source registry -->
    <section aria-labelledby="registry-heading">
      <div class="flex flex-wrap items-baseline justify-between gap-2 border-b border-charcoal/10 pb-2">
        <h2 id="registry-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
          Source Registry
        </h2>
        <span class="text-xs font-medium text-charcoal/50">
          {{ sources.length }} registered sources
        </span>
      </div>

      <div v-for="group in sourceGroups" :key="group.type" class="mt-8">
        <div class="flex flex-wrap items-center gap-3">
          <h3 class="font-serif text-lg font-bold text-charcoal">{{ group.label }}</h3>
          <span class="text-[10px] font-semibold uppercase tracking-wide text-charcoal/50">
            {{ group.tier }} · {{ group.sources.length }} source{{ group.sources.length === 1 ? '' : 's' }}
          </span>
          <DataSourceBadge :type="group.badge" />
        </div>
        <ul class="mt-4 grid gap-4 sm:grid-cols-2">
          <li v-for="source in group.sources" :key="source.id">
            <article class="flex h-full flex-col rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm">
              <h4 class="text-sm font-bold leading-snug text-charcoal">
                <a
                  v-if="source.url"
                  :href="source.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="rounded-sm text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
                >{{ source.name }} ↗</a>
                <template v-else>{{ source.name }}</template>
              </h4>
              <p v-if="source.notes" class="mt-2 text-xs leading-relaxed text-charcoal/70">
                {{ source.notes }}
              </p>
              <p v-if="source.url" class="mt-auto pt-3 text-[11px] text-charcoal/50 break-all">
                {{ source.url }}
              </p>
            </article>
          </li>
        </ul>
      </div>
    </section>

    <!-- Trust & transparency -->
    <section aria-labelledby="trust-heading">
      <div class="border-b border-charcoal/10 pb-2">
        <h2 id="trust-heading" class="font-serif text-2xl font-bold tracking-tight text-laguna-green">
          Trust &amp; Transparency
        </h2>
      </div>
      <p class="mt-4 max-w-3xl text-sm leading-relaxed text-charcoal/75">
        The project itself must be transparent. Every dataset on this site
        answers five questions:
      </p>
      <ul class="mt-4 max-w-3xl space-y-4">
        <li
          v-for="item in trustQuestions"
          :key="item.question"
          class="rounded-lg border border-charcoal/10 bg-white p-4 shadow-sm"
        >
          <h3 class="text-sm font-bold text-laguna-green">{{ item.question }}</h3>
          <p class="mt-1 text-sm leading-relaxed text-charcoal/70">{{ item.answer }}</p>
        </li>
      </ul>

      <h3 class="mt-8 font-serif text-lg font-bold text-charcoal">Label glossary</h3>
      <dl class="mt-4 grid max-w-4xl gap-3 sm:grid-cols-2">
        <div class="rounded-lg border border-charcoal/10 bg-white p-4 shadow-sm">
          <dt class="text-xs font-semibold uppercase tracking-wide text-charcoal/50">Official source</dt>
          <dd class="mt-2"><DataSourceBadge type="official" /></dd>
          <dd class="mt-2 text-xs leading-relaxed text-charcoal/70">
            The record is drawn directly from a government document, portal or dataset.
          </dd>
        </div>
        <div class="rounded-lg border border-charcoal/10 bg-white p-4 shadow-sm">
          <dt class="text-xs font-semibold uppercase tracking-wide text-charcoal/50">Community presentation</dt>
          <dd class="mt-2"><DataSourceBadge type="community" /></dd>
          <dd class="mt-2 text-xs leading-relaxed text-charcoal/70">
            Our own organization or summary of official records — presentation, not endorsement.
          </dd>
        </div>
        <div class="rounded-lg border border-charcoal/10 bg-white p-4 shadow-sm">
          <dt class="text-xs font-semibold uppercase tracking-wide text-charcoal/50">External source</dt>
          <dd class="mt-2"><DataSourceBadge type="external" /></dd>
          <dd class="mt-2 text-xs leading-relaxed text-charcoal/70">
            The record comes from an institutional or secondary reference outside government.
          </dd>
        </div>
        <div class="rounded-lg border border-charcoal/10 bg-white p-4 shadow-sm">
          <dt class="text-xs font-semibold uppercase tracking-wide text-charcoal/50">Last verified</dt>
          <dd class="mt-2"><DataLastVerified :date="'2026-09-01'" :show-state="false" /></dd>
          <dd class="mt-2 text-xs leading-relaxed text-charcoal/70">
            The date a record was last checked against its source.
          </dd>
        </div>
        <div class="rounded-lg border border-charcoal/10 bg-white p-4 shadow-sm sm:col-span-2">
          <dt class="text-xs font-semibold uppercase tracking-wide text-charcoal/50">Coverage</dt>
          <dd class="mt-2 text-xs leading-relaxed text-charcoal/70">
            The period and scope a dataset spans — which fiscal years, census
            rounds, terms or barangays — and any known gaps in it.
          </dd>
        </div>
      </dl>
    </section>

    <!-- Independence disclaimer -->
    <section
      aria-labelledby="disclaimer-heading"
      class="rounded-2xl border border-heritage-gold/30 bg-heritage-gold/10 p-6 sm:p-8"
    >
      <h2 id="disclaimer-heading" class="font-serif text-xl font-bold tracking-tight text-laguna-green">
        An independent project
      </h2>
      <p class="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal/80">
        Better Santa Rosa City is an independent, community-maintained
        public-information project. It is not affiliated with, operated by, or
        endorsed by the City Government of Santa Rosa or any government agency,
        and nothing here implies official endorsement. Official municipal
        services and documents remain at
        <a
          href="https://santarosacity.gov.ph"
          target="_blank"
          rel="noopener noreferrer"
          class="font-semibold text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green rounded-sm"
        >santarosacity.gov.ph</a>.
      </p>
    </section>
  </div>
</template>
