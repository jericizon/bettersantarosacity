<script setup lang="ts">
import { computed } from 'vue'
import DataSourceBadge from '~/components/data/SourceBadge.vue'
import DataSourceCitation from '~/components/data/SourceCitation.vue'
import DataLastVerified from '~/components/data/LastVerified.vue'
import { toSourceReference } from '~/utils/source'
import type { Official } from '~/types/civic'

const props = defineProps<{
  official: Official
}>()

const sourceRef = computed(() => toSourceReference(props.official.source))
</script>

<template>
  <!-- id=official.id is a forward contract: /government#<id> anchors from the
       search fallback resolve to this card. scroll-mt clears the sticky header. -->
  <article
    :id="official.id"
    class="flex h-full flex-col rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm scroll-mt-24"
  >
    <div class="flex items-start justify-between gap-2">
      <div>
        <h3 class="font-serif text-lg font-bold leading-snug text-charcoal">
          {{ official.name }}
        </h3>
        <p class="mt-0.5 text-sm font-semibold text-laguna-green">{{ official.position }}</p>
        <p class="text-xs text-charcoal/70">{{ official.office }}</p>
      </div>
      <DataSourceBadge type="official" class="shrink-0" />
    </div>

    <dl class="mt-3 space-y-1 text-xs text-charcoal/70">
      <div class="flex gap-2">
        <dt class="shrink-0 font-semibold text-charcoal">Term</dt>
        <dd>{{ official.term }}</dd>
      </div>
      <div v-if="official.contact" class="flex gap-2">
        <dt class="shrink-0 font-semibold text-charcoal">Contact</dt>
        <dd>{{ official.contact }}</dd>
      </div>
    </dl>

    <p v-if="official.bio" class="mt-3 text-xs leading-relaxed text-charcoal/70">
      {{ official.bio }}
    </p>

    <a
      v-if="official.officialUrl"
      :href="official.officialUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="mt-3 inline-flex w-fit items-center gap-1 rounded-sm text-xs font-semibold text-laguna-green underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
    >
      Official source ↗
    </a>

    <div class="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-charcoal/10 pt-3">
      <DataSourceCitation :source="sourceRef" />
      <DataLastVerified :date="official.lastVerified" />
    </div>
  </article>
</template>
