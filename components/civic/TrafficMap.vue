<script setup lang="ts">
import { ref } from 'vue'
import { AlertCircle, ExternalLink, Info } from 'lucide-vue-next'

// Reserved for a future live provider failure state; no feed is integrated yet,
// so the panel defers to official city advisories rather than imply live data.
const isUnavailable = ref(false)
const advisoryLinkLastVerified = '2026-09-17'
</script>

<template>
  <div class="rounded-lg border border-charcoal/15 bg-white p-4 shadow-sm flex flex-col justify-between space-y-4">
    <div class="border-b border-charcoal/10 pb-3">
      <h3 class="font-serif text-base font-bold text-laguna-green">
        Live Traffic
      </h3>
      <p class="text-xs text-charcoal/60">Current conditions around Santa Rosa, Laguna</p>
    </div>

    <!-- Deferred state / provider-failure fallback -->
    <div class="relative min-h-[220px] rounded bg-parchment/60 border border-charcoal/10 overflow-hidden flex flex-col items-center justify-center p-4 text-center">
      <div v-if="!isUnavailable" class="space-y-3 max-w-sm">
        <Info :size="24" class="mx-auto text-laguna-blue" aria-hidden="true" />
        <p class="text-xs font-semibold uppercase tracking-wider text-laguna-green">
          Santa Rosa Corridor Overview
        </p>
        <p class="text-xs text-charcoal/70">
          Live traffic data is not currently available for this area.
        </p>
        <div class="pt-1">
          <p class="text-[10px] font-semibold uppercase tracking-wider text-charcoal/50 mb-1.5">
            Legend
          </p>
          <div class="flex items-center justify-center gap-3 text-xs">
            <span class="inline-flex items-center gap-1 font-medium text-emerald-700">
              <span class="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              Normal
            </span>
            <span class="inline-flex items-center gap-1 font-medium text-amber-700">
              <span class="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
              Slow
            </span>
            <span class="inline-flex items-center gap-1 font-medium text-rose-700">
              <span class="h-2 w-2 rounded-full bg-rose-500" aria-hidden="true" />
              Heavy
            </span>
          </div>
        </div>
        <p class="text-xs text-charcoal/70 pt-1">
          Traffic information:
          <a
            href="https://santarosacity.gov.ph"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-0.5 font-semibold text-laguna-green hover:underline rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
          >City Government of Santa Rosa<ExternalLink :size="11" aria-hidden="true" /></a>
        </p>
      </div>
      <div v-else class="space-y-2 text-rose-accent-dark">
        <AlertCircle :size="24" class="mx-auto" aria-hidden="true" />
        <p class="text-xs font-semibold">Live traffic is temporarily unavailable.</p>
        <p class="text-[11px] text-charcoal/60">Please consult municipal traffic advisories below.</p>
      </div>
    </div>

    <!-- Attribution and verification -->
    <div class="flex flex-wrap items-center justify-between gap-2 text-[11px] text-charcoal/60 border-t border-charcoal/10 pt-2">
      <span>Advisory source: City Government of Santa Rosa</span>
      <span class="font-mono">Link verified {{ advisoryLinkLastVerified }}</span>
    </div>
  </div>
</template>
