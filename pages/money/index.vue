<script setup lang="ts">
// Legacy route: content moved to /finances. navigateTo is a Nuxt auto-import;
// the guard keeps this stub mountable under plain Vitest.
if (typeof navigateTo === 'function') {
  await navigateTo('/finances', { redirectCode: 301 })
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-16 text-center text-sm text-charcoal/70">
    This page has moved to <NuxtLink to="/finances" class="text-laguna-green font-semibold underline">/finances</NuxtLink>.
  </div>
</template>
