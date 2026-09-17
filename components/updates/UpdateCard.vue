<script setup lang="ts">
import type { CityUpdate } from '~/types/civic'
import DataSourceBadge from '~/components/data/SourceBadge.vue'
import { UPDATE_SOURCE_BADGE, UPDATE_SOURCE_LABEL } from '~/utils/source'
import { humanizeLabel } from '~/utils/labels'
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
          {{ humanizeLabel(update.category) }}
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
      <DataSourceBadge
        :type="UPDATE_SOURCE_BADGE[update.sourceType]"
        :label="UPDATE_SOURCE_LABEL[update.sourceType]"
        :organization="update.sourceOrganization"
      />
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
