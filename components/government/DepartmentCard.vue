<script setup lang="ts">
import { computed } from 'vue'
import DataSourceBadge from '~/components/data/SourceBadge.vue'
import DataSourceCitation from '~/components/data/SourceCitation.vue'
import DataLastVerified from '~/components/data/LastVerified.vue'
import { toSourceReference } from '~/utils/source'
import type { Department } from '~/types/civic'

const props = defineProps<{
  department: Department
}>()

const sourceRef = computed(() => toSourceReference(props.department.source))

// Unverified fields are flagged, never hidden or filled in.
const headNeedsVerification = computed(() => props.department.head.trim().toLowerCase() === 'needs verification')
</script>

<template>
  <!-- id=department.id is a forward contract: /government#<id> anchors from the
       search fallback resolve to this card. scroll-mt clears the sticky header. -->
  <article
    :id="department.id"
    class="flex h-full flex-col rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm scroll-mt-24"
  >
    <div class="flex items-start justify-between gap-2">
      <h3 class="font-serif text-base font-bold leading-snug text-charcoal">
        {{ department.name }}
      </h3>
      <DataSourceBadge type="official" class="shrink-0" />
    </div>

    <p class="mt-2 text-xs text-charcoal/70">
      <span class="font-semibold text-charcoal">Head:</span>
      <span
        v-if="headNeedsVerification"
        class="ml-1 inline-flex items-center rounded border border-heritage-gold/40 bg-heritage-gold/15 px-1.5 py-0.5 text-[11px] font-medium text-charcoal"
      >Needs verification</span>
      <template v-else> {{ department.head }}</template>
    </p>

    <ul class="mt-3 list-disc space-y-1 pl-4 text-xs leading-relaxed text-charcoal/70">
      <li v-for="r in department.responsibilities" :key="r">{{ r }}</li>
    </ul>

    <dl class="mt-3 space-y-1 text-xs text-charcoal/70">
      <div v-if="department.contact" class="flex gap-2">
        <dt class="shrink-0 font-semibold text-charcoal">Contact</dt>
        <dd>{{ department.contact }}</dd>
      </div>
      <div v-if="department.location" class="flex gap-2">
        <dt class="shrink-0 font-semibold text-charcoal">Location</dt>
        <dd>{{ department.location }}</dd>
      </div>
    </dl>

    <div class="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-charcoal/10 pt-3">
      <DataSourceCitation :source="sourceRef" />
      <DataLastVerified :date="department.lastVerified" />
    </div>
  </article>
</template>
