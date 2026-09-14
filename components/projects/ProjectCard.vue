<script setup lang="ts">
import { computed } from 'vue'
import ProjectsProjectStatus from '~/components/projects/ProjectStatus.vue'
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
</script>

<template>
  <!-- id=slug is a forward contract: /projects#<slug> anchors from search and
       external links resolve to this card. scroll-mt keeps it clear of the
       sticky header. -->
  <article
    :id="project.slug"
    class="relative flex h-full flex-col rounded-lg border border-charcoal/10 bg-white p-5 shadow-sm scroll-mt-24 transition hover:border-laguna-green/40"
  >
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
        <span :title="budgetFull ?? undefined">{{ budgetLabel }}</span> reported
      </template>
      <template v-else>Cost not disclosed in sources reviewed</template>
    </p>

    <div class="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4 text-[11px] text-charcoal/80">
      <span v-if="sourceTitle">Source: {{ sourceTitle }}</span>
      <span class="font-semibold text-laguna-green" aria-hidden="true">View project →</span>
    </div>
  </article>
</template>
