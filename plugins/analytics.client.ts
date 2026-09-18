// plugins/analytics.client.ts

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

export function initGoogleAnalytics(
  gtagId: string,
  router?: { afterEach: (cb: (to: { fullPath: string }) => void) => void }
) {
  if (!gtagId || typeof window === 'undefined') {
    return
  }

  window.dataLayer = window.dataLayer || []
  function gtag(..._args: unknown[]) {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments)
  }
  window.gtag = gtag

  gtag('js', new Date())
  gtag('config', gtagId)

  // useHead and useRouter are Nuxt auto-imports at runtime; the guards keep
  // this module mountable and testable in a plain Vitest environment too.
  if (typeof useHead === 'function') {
    useHead({
      script: [
        {
          id: 'gtag-script',
          key: 'gtag-js',
          src: `https://www.googletagmanager.com/gtag/js?id=${gtagId}`,
          async: true
        }
      ]
    })
  } else if (typeof document !== 'undefined') {
    if (!document.getElementById('gtag-script')) {
      const script = document.createElement('script')
      script.id = 'gtag-script'
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`
      document.head.appendChild(script)
    }
  }

  if (router?.afterEach) {
    router.afterEach((to) => {
      gtag('config', gtagId, {
        page_path: to.fullPath
      })
    })
  }
}

const plugin = typeof defineNuxtPlugin === 'function'
  ? defineNuxtPlugin(() => {
      const config = useRuntimeConfig()
      const gtagId = config.public.gtagId as string | undefined
      if (!gtagId) {
        return
      }

      const router = typeof useRouter === 'function' ? useRouter() : undefined
      initGoogleAnalytics(gtagId, router)
    })
  : () => {}

export default plugin
