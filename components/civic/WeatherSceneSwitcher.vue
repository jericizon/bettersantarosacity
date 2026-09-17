<script setup lang="ts">
import { ref, computed } from 'vue'
import { CloudSun, RadioTower } from 'lucide-vue-next'
import { useWeather, overrideWeatherScene } from '~/composables/useWeather'
import AnimatedWeatherIcon from '~/components/civic/AnimatedWeatherIcon.vue'

// Dev-only debug control: a small tab docked to the hero banner's right
// edge (absolute, scrolls away with the banner).
// Click it to open a scene picker; each option forces the hero ambience
// without waiting for real conditions. `import.meta.dev` keeps it out of
// production builds and tests.
const isDev = import.meta.dev

const { debugCode } = useWeather()
const open = ref(false)

const SCENES: { code: number; label: string }[] = [
  { code: 0, label: 'Clear sky' },
  { code: 2, label: 'Partly cloudy' },
  { code: 3, label: 'Overcast' },
  { code: 45, label: 'Fog' },
  { code: 51, label: 'Drizzle' },
  { code: 61, label: 'Rain' },
  { code: 95, label: 'Thunderstorm' },
  { code: 71, label: 'Snow' }
]

const active = computed(() => debugCode.value)

function pick(code: number | null) {
  overrideWeatherScene(code)
}
</script>

<template>
  <div v-if="isDev" class="absolute right-0 top-1/2 z-50 -translate-y-1/2" data-testid="weather-scene-switcher">
    <Transition name="wxpanel">
      <div
        v-if="open"
        class="absolute right-full top-1/2 mr-2 w-44 -translate-y-1/2 rounded-xl border border-charcoal/15 bg-white/95 p-2 shadow-lg backdrop-blur"
      >
        <p class="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-charcoal/50">WX scenes</p>
        <button
          type="button"
          class="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-medium transition-colors hover:bg-light-green/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
          :class="active == null ? 'bg-light-green/60 text-laguna-green' : 'text-charcoal'"
          @click="pick(null)"
        >
          <RadioTower :size="16" class="shrink-0" />
          Live weather
        </button>
        <button
          v-for="s in SCENES" :key="s.code"
          type="button"
          class="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-medium transition-colors hover:bg-light-green/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
          :class="active === s.code ? 'bg-light-green/60 text-laguna-green' : 'text-charcoal'"
          @click="pick(s.code)"
        >
          <AnimatedWeatherIcon :code="s.code" :size="18" class="shrink-0" />
          {{ s.label }}
        </button>
      </div>
    </Transition>

    <button
      type="button"
      class="relative rounded-l-xl border border-r-0 border-charcoal/15 bg-white/90 p-2.5 text-charcoal shadow-md backdrop-blur transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-laguna-green"
      :aria-expanded="open"
      aria-label="Toggle weather scene control"
      @click="open = !open"
    >
      <CloudSun :size="18" />
      <span
        v-if="active != null"
        class="absolute -left-1 -top-1 h-2.5 w-2.5 rounded-full bg-heritage-gold ring-2 ring-white"
        aria-hidden="true"
      />
    </button>
  </div>
</template>

<style scoped>
.wxpanel-enter-active, .wxpanel-leave-active { transition: opacity 160ms ease, transform 160ms ease; }
.wxpanel-enter-from, .wxpanel-leave-to { opacity: 0; transform: translate(8px, -50%); }
.wxpanel-enter-to, .wxpanel-leave-from { opacity: 1; transform: translate(0, -50%); }
@media (prefers-reduced-motion: reduce) {
  .wxpanel-enter-active, .wxpanel-leave-active { transition: none; }
}
</style>
