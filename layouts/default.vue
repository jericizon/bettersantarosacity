<template>
  <div class="min-h-screen flex flex-col bg-parchment font-sans text-charcoal">
    <CivicDisclaimerBanner />
    <CivicHeader />
    <main class="flex-grow w-full">
      <slot />
    </main>
    <CivicFooter />
  </div>
</template>

