<script setup lang="ts">
import type { Place } from '~/types/civic'
import { MapPin, ArrowRight } from 'lucide-vue-next'
import DataSourceBadge from '~/components/data/SourceBadge.vue'
import { humanizeLabel } from '~/utils/labels'

defineProps<{
  place: Place
}>()
</script>

<template>
  <div class="flex flex-col justify-between rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm hover:border-laguna-green/30 transition-all">
    <div class="space-y-3">
      <div class="flex items-center justify-between gap-2">
        <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-laguna-green/10 text-laguna-green">
          {{ humanizeLabel(place.category) }}
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
