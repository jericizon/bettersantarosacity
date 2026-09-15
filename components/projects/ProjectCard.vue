<script setup lang="ts">
import { computed } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import ProjectsProjectStatus from '~/components/projects/ProjectStatus.vue'
import RoseMotif from '~/components/civic/RoseMotif.vue'
import { formatPeso, formatPesoFull } from '~/utils/currency'
import { toSourceReference } from '~/utils/source'
import type { Project } from '~/types/civic'

const props = defineProps<{
  project: Project
}>()

// Abbreviated peso values are always paired with the exact figure (title attr).
const budgetLabel = computed(() =>
  props.project.budgetPhp != null ? formatPeso(props.project.budgetPhp) : null
)
const budgetFull = computed(() =>
  props.project.budgetPhp != null ? formatPesoFull(props.project.budgetPhp) : null
)

const sourceTitle = computed(() => {
  const first = props.project.sources.at(0)
  return first ? toSourceReference(first).title : null
})

// No licensed per-project photography exists yet — a typographic tile holds
// the card's [PHOTO / MAP] slot (Spec §13) until verified imagery lands.
const monogram = computed(() => props.project.name.trim().charAt(0).toUpperCase())
</script>

<template>
  <!-- id=slug is a forward contract: /projects#<slug> anchors from search and
       external links resolve to this card. scroll-mt keeps it clear of the
       sticky header. -->
  <article
    :id="project.slug"
    class="group relative flex h-full flex-col overflow-hidden rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm scroll-mt-24 transition duration-[250ms] ease-out hover:border-laguna-green/40 hover:shadow-md"
  >
    <!-- Decorative media tile — stands in for [PHOTO / MAP] until licensed
         project imagery exists; zoom is clipped by the frame. -->
    <div aria-hidden="true" class="-mx-5 -mt-5 mb-4 overflow-hidden">
      <div class="flex h-24 items-end justify-between bg-gradient-to-br from-laguna-green/15 via-parchment to-laguna-blue/15 px-5 pb-3 pt-5 transition-transform duration-500 ease-out group-hover:scale-[1.02]">
        <span class="select-none font-serif text-5xl font-bold leading-none text-laguna-green/25">{{ monogram }}</span>
        <RoseMotif :size="22" class="text-rose-accent/50" />
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <ProjectsProjectStatus :status="project.status" />
      <span class="text-[11px] font-medium uppercase tracking-wide text-charcoal/80">
        {{ project.category }}
      </span>
      <span v-if="project.year != null" class="text-[11px] text-charcoal/80">
        {{ project.year }}
      </span>
    </div>

    <h3 class="mt-3 font-serif text-lg font-bold leading-snug text-charcoal">
      <NuxtLink
        :to="`/projects/${project.slug}`"
        class="rounded-sm transition after:absolute after:inset-0 after:content-[''] hover:text-laguna-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
      >{{ project.name }}</NuxtLink>
    </h3>

    <p class="mt-1 text-xs font-medium text-charcoal/70">
      {{ project.barangay }}
    </p>
    <p v-if="project.location" class="mt-0.5 text-xs text-charcoal/70">
      {{ project.location }}
    </p>

    <p class="mt-3 text-sm font-medium text-charcoal">
      <template v-if="budgetLabel">
        <span :title="budgetFull ?? undefined" class="tabular-nums">{{ budgetLabel }}</span> reported
      </template>
      <template v-else>Cost not disclosed in sources reviewed</template>
    </p>

    <div class="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4 text-[11px] text-charcoal/80">
      <span v-if="sourceTitle">Source: {{ sourceTitle }}</span>
      <span class="inline-flex items-center gap-1 font-semibold text-laguna-green" aria-hidden="true">
        View project
        <ArrowRight :size="12" class="transition-transform duration-[250ms] ease-out group-hover:translate-x-1" />
      </span>
    </div>
  </article>
</template>
