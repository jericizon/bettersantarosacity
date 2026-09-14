<script setup lang="ts">
import { computed } from 'vue'
import type { Barangay } from '~/types/civic'

const props = defineProps<{
  barangay: Barangay
}>()

const formattedPopulation = computed(() =>
  props.barangay.population != null ? props.barangay.population.toLocaleString('en-US') : null
)
</script>

<template>
  <!-- id=slug is a forward contract: /barangays#<slug> anchors from search and the
       homepage resolve to this card. scroll-mt keeps it clear of the sticky header. -->
  <article
    :id="barangay.slug"
    class="relative flex h-full flex-col rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm scroll-mt-24 transition hover:border-laguna-green/40"
  >
    <div class="flex items-start justify-between gap-2">
      <h3 class="font-serif text-lg font-bold leading-snug text-charcoal">
        <NuxtLink
          :to="`/barangays/${barangay.slug}`"
          class="rounded-sm transition after:absolute after:inset-0 after:content-[''] hover:text-laguna-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
        >{{ barangay.name }}</NuxtLink>
      </h3>
      <span class="shrink-0 rounded bg-charcoal/10 px-2 py-0.5 text-[11px] font-medium text-charcoal/70">
        {{ barangay.group }}
      </span>
    </div>

    <p v-if="formattedPopulation" class="mt-1 text-xs font-medium text-charcoal/70">
      {{ formattedPopulation }} residents · 2020 PSA census
    </p>
    <p v-else class="mt-1 text-xs italic text-charcoal/70">
      Population unavailable in the source reviewed
    </p>

    <p class="mt-3 text-sm leading-relaxed text-charcoal/70 line-clamp-3">
      {{ barangay.description }}
    </p>

    <p class="mt-auto pt-4 text-sm font-semibold text-laguna-green" aria-hidden="true">
      View profile →
    </p>
  </article>
</template>
