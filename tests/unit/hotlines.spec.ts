import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import hotlinesData from '~/data/hotlines.json'
import { HotlineSchema } from '~/types/civic'
import HotlineTicker from '~/components/civic/HotlineTicker.vue'

describe('Emergency Hotlines', () => {
  it('validates all entries in hotlines.json against HotlineSchema', () => {
    expect(Array.isArray(hotlinesData)).toBe(true)
    expect(hotlinesData.length).toBeGreaterThanOrEqual(5)
    for (const item of hotlinesData) {
      const parsed = HotlineSchema.safeParse(item)
      expect(parsed.success, `Schema validation failed for ${item.id}: ${parsed.error?.message}`).toBe(true)
    }
  })

  it('keeps the national 911 hotline listed', () => {
    const e911 = hotlinesData.find(h => h.id === 'e911')
    expect(e911?.numbers.some(n => n.value === '911' && n.tel === '911')).toBe(true)
  })

  it('ticker renders one tap-to-call link per agency, duplicated for the seamless loop', () => {
    const wrapper = mount(HotlineTicker)
    const links = wrapper.findAll('a[href^="tel:"]')
    expect(links).toHaveLength(hotlinesData.length * 2)
    // Second copy is the loop twin and must not be announced twice.
    expect(wrapper.findAll('ul[aria-hidden="true"]')).toHaveLength(1)
    // 911 leads the strip.
    expect(links[0]!.attributes('href')).toBe('tel:911')
  })

  it('ticker prefers a mobile number for tap-to-call when one exists', () => {
    const wrapper = mount(HotlineTicker)
    const links = wrapper.findAll('a[href^="tel:"]')
    // PNP lists landlines first in the directory, but its mobile is the
    // better tap target; the ticker should surface it.
    const pnp = links.find(l => l.attributes('href') === 'tel:+639994835681')
    expect(pnp).toBeTruthy()
  })
})
