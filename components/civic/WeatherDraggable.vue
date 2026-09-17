<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'

// Pointer-throw physics for the decorative weather elements. The pointerdown
// only ARMS the element — no preventDefault and no gesture hijack — so plain
// clicks behave exactly like the empty banner space behind it. A real drag is
// claimed only after the pointer travels past CLAIM_PX; then the element can
// be flung with momentum (bounced off the ambience box) and glides back home
// after a few seconds. The offset lives on this inner element so the ambient
// CSS animation on the parent wrapper is never disturbed — the wrapper's
// animation pauses while held so "home" stays put during the throw.
const el = ref<HTMLElement | null>(null)
const grabbing = ref(false)
const x = ref(0)
const y = ref(0)

let mode: 'idle' | 'armed' | 'drag' | 'thrown' | 'return' = 'idle'
let startX = 0, startY = 0, origX = 0, origY = 0
let vx = 0, vy = 0
let trail: { t: number; x: number; y: number }[] = []
let raf = 0
let last = 0
let returnTimer: ReturnType<typeof setTimeout> | undefined

const CLAIM_PX = 6       // movement required before a press becomes a drag
const FRICTION = 0.93    // per-60fps-frame velocity decay while thrown
const BOUNCE = 0.45      // energy kept on edge bounce
const RETURN_MS = 2400   // free-flight time before gliding home
const MIN_THROW = 12     // px/s — below this a release just settles

function pauseAmbient(paused: boolean) {
  const p = el.value?.parentElement
  if (p instanceof HTMLElement) {
    if (paused) p.style.setProperty('animation-play-state', 'paused')
    else p.style.removeProperty('animation-play-state')
  }
}

function onDown(e: PointerEvent) {
  if (e.button !== 0 || mode === 'armed' || mode === 'drag') return
  // Capture only: lets us keep tracking the gesture without preventing the
  // browser's normal click/select/scroll behaviour for presses that never
  // turn into drags.
  if (e.pointerId != null) el.value?.setPointerCapture?.(e.pointerId)
  mode = 'armed'
  clearTimeout(returnTimer)
  cancelAnimationFrame(raf)
  startX = e.clientX; startY = e.clientY
  origX = x.value; origY = y.value
  trail = [{ t: e.timeStamp, x: e.clientX, y: e.clientY }]
}

function onMove(e: PointerEvent) {
  if (mode === 'armed') {
    if (Math.hypot(e.clientX - startX, e.clientY - startY) < CLAIM_PX) return
    mode = 'drag'
    grabbing.value = true
    pauseAmbient(true)
  }
  if (mode !== 'drag') return
  x.value = origX + (e.clientX - startX)
  y.value = origY + (e.clientY - startY)
  trail.push({ t: e.timeStamp, x: e.clientX, y: e.clientY })
  if (trail.length > 8) trail.shift()
}

function onUp(e: PointerEvent) {
  if (mode === 'armed') {
    // Press released without a drag: resume gliding home if displaced.
    if (x.value !== 0 || y.value !== 0) {
      mode = 'return'
      last = performance.now()
      raf = requestAnimationFrame(tick)
    } else mode = 'idle'
    return
  }
  if (mode !== 'drag') return
  grabbing.value = false
  // Velocity from the last ~120ms of pointer movement.
  const now = e.timeStamp
  const old = trail.find(p => now - p.t <= 120)
  const dt = Math.max((now - (old?.t ?? now)) / 1000, 0.016)
  vx = old ? (e.clientX - old.x) / dt : 0
  vy = old ? (e.clientY - old.y) / dt : 0
  if (Math.hypot(vx, vy) < MIN_THROW) { vx = 0; vy = 0 }
  mode = 'thrown'
  last = performance.now()
  raf = requestAnimationFrame(tick)
  returnTimer = setTimeout(() => { mode = 'return' }, RETURN_MS)
}

function tick(now: number) {
  const dt = Math.min((now - last) / 1000, 0.05)
  last = now
  if (mode === 'thrown') {
    x.value += vx * dt
    y.value += vy * dt
    const decay = Math.pow(FRICTION, dt * 60)
    vx *= decay; vy *= decay
    clampToBounds()
  } else if (mode === 'return') {
    const k = 1 - Math.exp(-dt * 5.5)
    x.value -= x.value * k
    y.value -= y.value * k
    if (Math.abs(x.value) < 0.5 && Math.abs(y.value) < 0.5) {
      x.value = 0; y.value = 0
      mode = 'idle'
      pauseAmbient(false)
      return
    }
  }
  if (mode === 'thrown' || mode === 'return') raf = requestAnimationFrame(tick)
}

function clampToBounds() {
  const node = el.value
  const bounds = node?.closest('.ambience')
  if (!node || !bounds) return
  const pr = bounds.getBoundingClientRect()
  const er = node.getBoundingClientRect()
  // Home rect = the element's visual rect with the applied offset removed.
  const hx = er.left - x.value
  const hy = er.top - y.value
  if (hx + x.value < pr.left) { x.value = pr.left - hx; vx = Math.abs(vx) * BOUNCE }
  else if (hx + x.value + er.width > pr.right) { x.value = pr.right - hx - er.width; vx = -Math.abs(vx) * BOUNCE }
  if (hy + y.value < pr.top) { y.value = pr.top - hy; vy = Math.abs(vy) * BOUNCE }
  else if (hy + y.value + er.height > pr.bottom) { y.value = pr.bottom - hy - er.height; vy = -Math.abs(vy) * BOUNCE }
}

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  clearTimeout(returnTimer)
})
</script>

<template>
  <div
    ref="el"
    class="wxdrag"
    :class="{ 'wxdrag--grabbing': grabbing }"
    :style="{ transform: `translate3d(${x}px, ${y}px, 0)` }"
    @pointerdown="onDown"
    @pointermove="onMove"
    @pointerup="onUp"
    @pointercancel="onUp"
    @lostpointercapture="onUp"
  >
    <slot />
  </div>
</template>

<style scoped>
.wxdrag {
  pointer-events: auto;
  cursor: grab;
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;
  will-change: transform;
}
.wxdrag--grabbing { cursor: grabbing; }
</style>
