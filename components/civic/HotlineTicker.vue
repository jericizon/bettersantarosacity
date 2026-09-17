<script setup lang="ts">
import { Siren } from 'lucide-vue-next'
import hotlinesData from '~/data/hotlines.json'
import type { Hotline } from '~/types/civic'

// Compact strip: one dialable number per agency. Prefer the mobile number
// since the ticker is primarily a tap-to-call surface on phones.
const items = (hotlinesData as Hotline[]).map(h => ({
  id: h.id,
  label: h.tag ?? h.name,
  number: h.numbers.find(n => n.tel.startsWith('+639')) ?? h.numbers[0]!
}))
</script>

<template>
  <div
    class="hotline-ticker flex items-stretch border-b border-rose-accent/25 bg-rose-accent/10"
    role="region"
    aria-label="Emergency hotlines"
  >
    <span class="flex shrink-0 items-center gap-1.5 border-r border-rose-accent/25 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-rose-accent-dark">
      <Siren :size="13" class="ticker-siren" aria-hidden="true" />
      Emergency
    </span>
    <div class="ticker-viewport flex-1 overflow-hidden">
      <div class="ticker-track flex w-max items-center">
        <!-- Second copy is the seamless-loop twin; hidden from AT. -->
        <ul v-for="round in 2" :key="round" class="flex shrink-0 items-center" :aria-hidden="round === 2">
          <li v-for="i in items" :key="i.id" class="flex items-center whitespace-nowrap">
            <a
              :href="`tel:${i.number.tel}`"
              class="flex items-baseline gap-1.5 px-3 py-2 text-xs transition-colors hover:text-rose-accent-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
            >
              <span class="font-medium text-charcoal/75">{{ i.label }}</span>
              <span class="font-mono font-semibold text-rose-accent-dark">{{ i.number.value }}</span>
            </a>
            <span class="text-rose-accent/40" aria-hidden="true">•</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ticker-viewport {
  mask-image: linear-gradient(90deg, transparent, #000 20px, #000 calc(100% - 20px), transparent);
}
.ticker-track { animation: hotline-scroll 32s linear infinite; }
@keyframes hotline-scroll { to { transform: translateX(-50%); } }

.hotline-ticker:hover .ticker-track,
.hotline-ticker:focus-within .ticker-track { animation-play-state: paused; }

.ticker-siren { animation: siren-pulse 2.4s ease-in-out infinite; }
@keyframes siren-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

@media (prefers-reduced-motion: reduce) {
  .ticker-track, .ticker-siren { animation: none; }
  .ticker-viewport { overflow-x: auto; }
}
</style>
