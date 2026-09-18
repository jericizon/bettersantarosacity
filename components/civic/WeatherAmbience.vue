<script setup lang="ts">
import { computed } from 'vue'
import { useWeather } from '~/composables/useWeather'
import CloudCharacter from '~/components/civic/CloudCharacter.vue'
import WeatherDraggable from '~/components/civic/WeatherDraggable.vue'

const { status, scene, debugCode } = useWeather()

// Show the layer once weather data arrives — or immediately when a debug scene
// is forced, so the switcher works even with the API down.
const show = computed(() => status.value === 'ready' || debugCode.value != null)

// Deterministic pseudo-random fields: scattered-looking particles that render
// identically on every mount (stable for tests and rerenders).
interface Particle { left: number; delay: string; dur: string }
function field(count: number, step: number, durBase: number, durVar: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    left: (i * step + 13) % 100,
    delay: `${-(((i * 7 + 3) % 160) / 10)}s`,
    dur: `${durBase + (((i * 11) % 10) / 10) * durVar}s`
  }))
}

const rainDrops = field(26, 39, 0.9, 0.6)
const drizzleDrops = field(14, 61, 1.7, 0.9)
const flakes = field(16, 53, 6.5, 4)
const motes = field(9, 41, 8, 5)

// Birds crossing the banner on clear days (gull "M" glyphs, wings flapping).
const birds = [
  { top: '20%', dur: '19s', delay: '-4s', size: 24 },
  { top: '28%', dur: '24s', delay: '-11s', size: 20 },
  { top: '24%', dur: '21s', delay: '-16s', size: 28 },
  { top: '34%', dur: '27s', delay: '-7s', size: 18 }
]

// Partly cloudy: cloud characters travelling across the banner.
const crossClouds = [
  { top: '8%', w: '150px', dur: '70s', delay: '-18s', op: 0.8 },
  { top: '18%', w: '120px', dur: '55s', delay: '-40s', op: 0.65 },
  { top: '3%', w: '180px', dur: '85s', delay: '-60s', op: 0.6 }
]

// Overcast/storm: heavier cloud characters hovering in the upper band.
const grayClouds = [
  { top: '4%', left: '4%', w: '170px', dur: '24s', delay: '-4s', op: 0.85 },
  { top: '12%', left: '52%', w: '210px', dur: '32s', delay: '-12s', op: 0.75 },
  { top: '1%', left: '68%', w: '130px', dur: '27s', delay: '-8s', op: 0.7 },
  { top: '20%', left: '22%', w: '145px', dur: '36s', delay: '-18s', op: 0.6 }
]

const fogBands = [
  { top: '18%', dur: '11s', delay: '0s' },
  { top: '44%', dur: '14s', delay: '-5s' },
  { top: '68%', dur: '9s', delay: '-2.5s' }
]

const TINT: Record<string, string> = {
  sun: 'bg-gradient-to-b from-heritage-gold/15 via-heritage-gold/5 to-transparent',
  suncloud: 'bg-gradient-to-b from-heritage-gold/10 via-light-green/50 to-transparent',
  cloud: 'bg-gradient-to-b from-charcoal/15 via-charcoal/5 to-transparent',
  fog: 'bg-gradient-to-b from-white/60 via-white/30 to-transparent',
  drizzle: 'bg-gradient-to-b from-laguna-blue/10 to-transparent',
  rain: 'bg-gradient-to-b from-laguna-blue/15 to-transparent',
  storm: 'bg-gradient-to-b from-charcoal/20 via-laguna-blue/10 to-transparent',
  snow: 'bg-gradient-to-b from-white/50 to-transparent'
}
</script>

<template>
  <!-- Ambient weather layer for the hero banner. Absolute, non-interactive and
       aria-hidden; renders nothing until weather data arrives and stays empty on
       error (unless a debug scene is forced). Particle base opacity is 0 so
       prefers-reduced-motion leaves the tint only — no frozen elements. -->
  <template v-if="show">
    <div
      aria-hidden="true"
      class="ambience pointer-events-none absolute inset-0 overflow-hidden"
      :data-scene="scene"
      data-testid="weather-ambience"
    >
      <div class="absolute inset-0" :class="TINT[scene]" />

      <!-- Sun: warm glow + floating light motes + birds crossing the sky -->
      <template v-if="scene === 'sun' || scene === 'suncloud'">
        <div class="amb-sun" :class="{ 'amb-sun--soft': scene === 'suncloud' }" />
        <span
          v-for="(m, i) in motes" :key="`m${i}`" class="amb-mote"
          :style="{ left: `${m.left}%`, top: '55%', animationDelay: m.delay, animationDuration: m.dur }"
        />
      </template>
      <template v-if="scene === 'sun'">
        <span
          v-for="(b, i) in birds" :key="`b${i}`" class="amb-bird"
          :style="{ top: b.top, animationDuration: b.dur, animationDelay: b.delay }"
        >
          <WeatherDraggable class="wxdrag-hit">
            <svg :width="b.size" :height="b.size / 2" viewBox="0 0 24 10" fill="none" aria-hidden="true">
              <path class="amb-birdwing" d="M1 8 Q7 0 12 8 Q17 0 23 8" stroke="#182421" stroke-width="2" stroke-linecap="round" />
            </svg>
          </WeatherDraggable>
        </span>
      </template>

      <!-- Partly cloudy: happy cloud characters travelling across the banner -->
      <template v-if="scene === 'suncloud'">
        <span
          v-for="(c, i) in crossClouds" :key="`x${i}`" class="amb-cloudwrap amb-cloud--cross"
          :style="{ top: c.top, width: c.w, opacity: c.op, animationDuration: c.dur, animationDelay: c.delay }"
        >
          <WeatherDraggable>
            <CloudCharacter mood="happy" tone="white" />
          </WeatherDraggable>
        </span>
      </template>

      <!-- Overcast / storm: gray cloud characters hovering overhead -->
      <template v-if="scene === 'cloud' || scene === 'storm'">
        <span
          v-for="(c, i) in grayClouds" :key="`c${i}`" class="amb-cloudwrap amb-cloud--gray"
          :style="{ top: c.top, left: c.left, width: c.w, opacity: c.op, animationDuration: c.dur, animationDelay: c.delay }"
        >
          <WeatherDraggable>
            <CloudCharacter
              :mood="scene === 'storm' ? 'grumpy' : 'neutral'"
              :tone="scene === 'storm' ? 'dark' : 'gray'"
            />
          </WeatherDraggable>
        </span>
      </template>

      <!-- Fog: ambient bands behind the content. The veil above the arch
           emblem lives in WeatherFogVeil.vue (mounted in index.vue). -->
      <template v-if="scene === 'fog'">
        <span
          v-for="(f, i) in fogBands" :key="`f${i}`" class="amb-fogband"
          :style="{ top: f.top, animationDuration: f.dur, animationDelay: f.delay }"
        />
      </template>

      <!-- Rain: streaks falling across the whole banner -->
      <template v-if="scene === 'rain' || scene === 'storm'">
        <span
          v-for="(d, i) in rainDrops" :key="`d${i}`" class="amb-drop"
          :style="{ left: `${d.left}%`, animationDelay: d.delay, animationDuration: d.dur }"
        />
      </template>
      <template v-if="scene === 'drizzle'">
        <span
          v-for="(d, i) in drizzleDrops" :key="`z${i}`" class="amb-drop amb-drop--drizzle"
          :style="{ left: `${d.left}%`, animationDelay: d.delay, animationDuration: d.dur }"
        />
      </template>

      <!-- Snow: drifting flakes (rare in Laguna; kept for completeness) -->
      <template v-if="scene === 'snow'">
        <span
          v-for="(s, i) in flakes" :key="`s${i}`" class="amb-flake"
          :style="{ left: `${s.left}%`, animationDelay: s.delay, animationDuration: s.dur }"
        />
      </template>

      <!-- Storm: bolt under the cloud bank + occasional lightning wash -->
      <template v-if="scene === 'storm'">
        <svg class="amb-bolt" viewBox="0 0 24 34" aria-hidden="true">
          <polygon points="14,0 3,18 9,18 5,34 21,12 14,12" fill="#d6a94b" />
        </svg>
        <div class="amb-flash" />
      </template>
    </div>
  </template>
</template>

<style scoped>
.ambience { animation: amb-in 1.4s ease-out both; }

.amb-sun {
  position: absolute; top: -18%; right: -8%;
  width: 55%; aspect-ratio: 1;
  background: radial-gradient(circle, rgba(214, 169, 75, 0.32), rgba(214, 169, 75, 0.1) 45%, transparent 70%);
  animation: amb-pulse 9s ease-in-out infinite alternate;
}
.amb-sun--soft { opacity: 0.55; }

.amb-mote {
  position: absolute; width: 5px; height: 5px; border-radius: 9999px;
  background: #d6a94b; opacity: 0;
  animation: amb-float 9s ease-in-out infinite;
}

.amb-bird {
  position: absolute; left: 0;
  opacity: 0.55;
  animation: amb-fly 22s linear infinite;
}
.amb-birdwing {
  transform-box: fill-box; transform-origin: center;
  animation: amb-flap 0.7s ease-in-out infinite;
}

.amb-cloudwrap { position: absolute; left: 0; }
/* Fattens the tiny bird glyphs into grabbable targets. */
.wxdrag-hit { display: inline-block; padding: 8px; margin: -8px; }
.amb-cloud--cross { animation: amb-cross 70s linear infinite; }
.amb-cloud--gray { animation: amb-drift 26s ease-in-out infinite alternate; }

.amb-fogband {
  position: absolute; left: -10%; width: 120%; height: 16%;
  background: linear-gradient(to bottom, transparent, rgba(246, 243, 234, 0.85), transparent);
  animation: amb-fogslide 12s ease-in-out infinite alternate;
}

.amb-drop {
  position: absolute; top: 0; width: 2px; height: 56px; border-radius: 2px;
  background: linear-gradient(to bottom, rgba(94, 159, 165, 0), rgba(94, 159, 165, 0.65));
  opacity: 0;
  animation: amb-fall 1.1s linear infinite;
}
.amb-drop--drizzle {
  width: 1.5px; height: 26px;
  background: linear-gradient(to bottom, rgba(94, 159, 165, 0), rgba(94, 159, 165, 0.5));
}

.amb-flake {
  position: absolute; top: 0; width: 6px; height: 6px; border-radius: 9999px;
  background: rgba(255, 255, 255, 0.95); opacity: 0;
  animation: amb-snowfall 8s linear infinite;
}

.amb-bolt {
  position: absolute; top: 17%; left: 60%;
  width: 34px; height: 48px;
  opacity: 0;
  filter: drop-shadow(0 0 8px rgba(214, 169, 75, 0.85));
  animation: amb-lightning 7s ease-in-out infinite;
}

.amb-flash {
  position: absolute; inset: 0; background: #f6f3ea; opacity: 0;
  animation: amb-lightning 7s ease-in-out infinite;
}

@keyframes amb-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes amb-pulse { from { transform: scale(1); opacity: 0.8; } to { transform: scale(1.07); opacity: 1; } }
@keyframes amb-float { 0% { transform: translateY(0); opacity: 0; } 20% { opacity: 0.8; } 80% { opacity: 0.6; } 100% { transform: translateY(-70px); opacity: 0; } }
@keyframes amb-fly { 0% { transform: translate(-80px, 0); } 50% { transform: translate(56vw, -18px); } 100% { transform: translate(112vw, 6px); } }
@keyframes amb-flap { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.35); } }
@keyframes amb-cross { from { transform: translateX(-340px); } to { transform: translateX(112vw); } }
@keyframes amb-drift { from { transform: translateX(-5%); } to { transform: translateX(5%); } }
@keyframes amb-fogslide { from { transform: translateX(-3%); } to { transform: translateX(3%); } }
@keyframes amb-fall { 0% { transform: translate3d(0, -90px, 0); opacity: 0; } 15% { opacity: 0.8; } 90% { opacity: 0.5; } 100% { transform: translate3d(-64px, 860px, 0); opacity: 0; } }
@keyframes amb-snowfall { 0% { transform: translate3d(0, -40px, 0); opacity: 0; } 15% { opacity: 0.95; } 100% { transform: translate3d(52px, 840px, 0); opacity: 0; } }
@keyframes amb-lightning { 0%, 55%, 100% { opacity: 0; } 60% { opacity: 1; } 64% { opacity: 0; } 72% { opacity: 0.6; } 78% { opacity: 0; } }

@media (prefers-reduced-motion: reduce) {
  .ambience, .amb-sun, .amb-mote, .amb-bird, .amb-birdwing,
  .amb-cloudwrap, .amb-fogband, .amb-drop, .amb-flake, .amb-bolt, .amb-flash {
    animation: none;
  }
}
</style>
