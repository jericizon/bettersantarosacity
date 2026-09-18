<script setup lang="ts">
import updatesData from '~/data/updates.json'
import type { CityUpdate } from '~/types/civic'
import { buildSeoHead, SITE_URL } from '~/utils/seo'
import { UPDATE_SOURCE_BADGE, UPDATE_SOURCE_LABEL } from '~/utils/source'
import { humanizeLabel } from '~/utils/labels'
import DataSourceBadge from '~/components/data/SourceBadge.vue'
import DataLastVerified from '~/components/data/LastVerified.vue'
import { Calendar, ExternalLink } from 'lucide-vue-next'

// useRoute/createError/useHead are Nuxt auto-imports; guards keep this page
// importable under plain Vitest where the auto-import globals do not exist.
const slug = typeof useRoute === 'function' ? String(useRoute().params.slug ?? '') : ''

const update = (updatesData as CityUpdate[]).find(u => u.slug === slug)

if (!update && typeof createError === 'function') {
  throw createError({
    statusCode: 404,
    statusMessage: `No update found for "${slug}"`,
    fatal: true
  })
}

if (typeof useHead === 'function') {
  useHead(buildSeoHead({
    title: `${update?.title ?? 'Update Not Found'} · Better Santa Rosa City`,
    description: update?.summary ?? 'City update or advisory record for Santa Rosa City, Laguna.',
    path: `/updates/${slug}`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Updates', item: `${SITE_URL}/updates` },
        { '@type': 'ListItem', position: 3, name: update?.title ?? 'Update' }
      ]
    }
  }))
}
</script>

<template>
  <div v-if="update" data-pagefind-filter="type:updates" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
    <nav aria-label="Breadcrumb" class="text-xs text-charcoal/60 flex items-center gap-2">
      <NuxtLink to="/updates" class="hover:text-laguna-green">City Updates</NuxtLink>
      <span>/</span>
      <span class="text-charcoal font-medium truncate">{{ update.title }}</span>
    </nav>

    <header class="space-y-4">
      <div class="flex flex-wrap items-center gap-2">
        <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-accent/15 text-rose-accent-dark">
          {{ humanizeLabel(update.category) }}
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
          :type="UPDATE_SOURCE_BADGE[update.sourceType]"
          :label="UPDATE_SOURCE_LABEL[update.sourceType]"
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
          <template v-if="update.sourceType === 'official-facebook'">Posted by the City Government of Santa Rosa on its official Facebook page.</template>
          <template v-else>This advisory was posted by {{ update.sourceOrganization }}.</template>
          Better Santa Rosa City summarizes public advisories to improve civic awareness.
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
</template>
