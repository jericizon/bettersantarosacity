// tests/unit/analytics.spec.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { initGoogleAnalytics } from '~/plugins/analytics.client'

describe('Google Analytics Integration (plugins/analytics.client.ts)', () => {
  let appendedScripts: HTMLScriptElement[] = []

  beforeEach(() => {
    // @ts-expect-error test cleanup
    delete window.dataLayer
    // @ts-expect-error test cleanup
    delete window.gtag

    appendedScripts = []
    const origGetById = document.getElementById.bind(document)
    vi.spyOn(document, 'getElementById').mockImplementation((id: string) => {
      const found = appendedScripts.find(s => s.id === id)
      return found || origGetById(id)
    })

    vi.spyOn(document.head, 'appendChild').mockImplementation((node) => {
      if (node instanceof HTMLScriptElement) {
        appendedScripts.push(node)
      }
      return node
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('no-ops gracefully when gtagId is empty', () => {
    initGoogleAnalytics('')
    expect(window.dataLayer).toBeUndefined()
    expect(window.gtag).toBeUndefined()
    expect(appendedScripts.length).toBe(0)
  })

  it('initializes dataLayer and defines window.gtag with measurement ID', () => {
    const id = 'G-KEW1P5Q9QR'
    initGoogleAnalytics(id)

    expect(window.dataLayer).toBeDefined()
    expect(Array.isArray(window.dataLayer)).toBe(true)
    expect(typeof window.gtag).toBe('function')

    // Expect at least 2 entries: 'js' timestamp and 'config' call
    expect(window.dataLayer.length).toBeGreaterThanOrEqual(2)

    // First call: ['js', Date]
    const firstCall = Array.from(window.dataLayer[0] as IArguments)
    expect(firstCall[0]).toBe('js')
    expect(firstCall[1]).toBeInstanceOf(Date)

    // Second call: ['config', 'G-KEW1P5Q9QR']
    const secondCall = Array.from(window.dataLayer[1] as IArguments)
    expect(secondCall[0]).toBe('config')
    expect(secondCall[1]).toBe(id)
  })

  it('injects Google Tag Manager script into document head', () => {
    const id = 'G-KEW1P5Q9QR'
    initGoogleAnalytics(id)

    expect(appendedScripts.length).toBe(1)
    const script = appendedScripts[0]!
    expect(script.id).toBe('gtag-script')
    expect(script.src).toContain(`https://www.googletagmanager.com/gtag/js?id=${id}`)
    expect(script.async).toBe(true)
  })

  it('does not insert duplicate script elements if called again', () => {
    const id = 'G-KEW1P5Q9QR'
    initGoogleAnalytics(id)
    initGoogleAnalytics(id)

    expect(appendedScripts.length).toBe(1)
  })

  it('hooks into router.afterEach to track SPA page transitions', () => {
    const id = 'G-KEW1P5Q9QR'
    let afterEachCallback: ((to: { fullPath: string }) => void) | undefined

    const mockRouter = {
      afterEach: vi.fn((cb: (to: { fullPath: string }) => void) => {
        afterEachCallback = cb
      })
    }

    initGoogleAnalytics(id, mockRouter)

    expect(mockRouter.afterEach).toHaveBeenCalledTimes(1)
    expect(afterEachCallback).toBeDefined()

    // Simulate route navigation to /barangays/balibago
    afterEachCallback?.({ fullPath: '/barangays/balibago' })

    const lastCall = Array.from(window.dataLayer[window.dataLayer.length - 1] as IArguments)
    expect(lastCall[0]).toBe('config')
    expect(lastCall[1]).toBe(id)
    expect(lastCall[2]).toEqual({ page_path: '/barangays/balibago' })
  })
})
