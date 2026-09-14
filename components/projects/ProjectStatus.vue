<script setup lang="ts">
import { computed } from 'vue'
import { CalendarClock, CircleCheck, CircleHelp, CircleX, Construction } from 'lucide-vue-next'
import type { Component } from 'vue'
import type { Project } from '~/types/civic'

type ProjectStatus = Project['status']

const props = defineProps<{
  status: ProjectStatus
}>()

// Spec §26/§35: status is conveyed by a text label plus a distinct icon —
// never by color alone.
const STATUS_META: Record<ProjectStatus, { icon: Component; classes: string }> = {
  Planned: {
    icon: CalendarClock,
    classes: 'bg-heritage-gold/20 text-charcoal border-heritage-gold/40'
  },
  Ongoing: {
    icon: Construction,
    classes: 'bg-laguna-blue/15 text-laguna-blue border-laguna-blue/30'
  },
  Completed: {
    icon: CircleCheck,
    classes: 'bg-laguna-green/10 text-laguna-green border-laguna-green/20'
  },
  Cancelled: {
    icon: CircleX,
    classes: 'bg-rose-accent/15 text-rose-accent border-rose-accent/30'
  },
  Unknown: {
    icon: CircleHelp,
    classes: 'bg-charcoal/10 text-charcoal/70 border-charcoal/20'
  }
}

const meta = computed(() => STATUS_META[props.status] ?? STATUS_META.Unknown)
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
    :class="meta.classes"
  >
    <component :is="meta.icon" :size="11" aria-hidden="true" />
    {{ status }}
  </span>
</template>
