import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SantaRosaAtAGlance from '../../components/home/SantaRosaAtAGlance.vue'

describe('SantaRosaAtAGlance Component', () => {
  it('renders section eyebrow, heading, and concise editorial description', () => {
    const wrapper = mount(SantaRosaAtAGlance, {
      global: {
        stubs: {
          NuxtLink: { template: '<a><slot /></a>' },
          CountUp: { template: '<span class="count-up-stub"><slot /></span>' },
          BrandMark: { template: '<div class="brand-mark-stub" />' },
          RoseMotif: { template: '<span class="rose-motif-stub" />' }
        }
      }
    })

    expect(wrapper.text()).toContain('SANTA ROSA AT A GLANCE')
    expect(wrapper.text()).toContain('Santa Rosa at a Glance')
    expect(wrapper.text()).toContain('A quick look at the city: its people, places, geography and history.')
  })

  it('displays four verified city facts with correct values, labels, and sources', () => {
    const wrapper = mount(SantaRosaAtAGlance, {
      global: {
        stubs: {
          NuxtLink: { template: '<a><slot /></a>' },
          CountUp: {
            props: ['end', 'suffix'],
            template: '<span class="count-up-stub">{{ Number(end).toLocaleString("en-US") }}{{ suffix }}</span>'
          },
          BrandMark: { template: '<div class="brand-mark-stub" />' },
          RoseMotif: { template: '<span class="rose-motif-stub" />' }
        }
      }
    })

    const text = wrapper.text()
    // 1. Barangays
    expect(text).toContain('18')
    expect(text).toContain('BARANGAYS')
    // 2. Land Area
    expect(text).toContain('5,543')
    expect(text).toContain('LAND AREA')
    // 3. Cityhood
    expect(text).toContain('2004')
    expect(text).toContain('CITYHOOD')
    // 4. Lakeshore Barangays
    expect(text).toContain('3')
    expect(text).toContain('LAKESHORE BARANGAYS')

    // Sources
    expect(text).toContain('City Government of Santa Rosa')
    expect(text).toContain('Republic Act No. 9264')
  })

  it('renders the 4 Explore the City navigation links with proper destinations', () => {
    const wrapper = mount(SantaRosaAtAGlance, {
      global: {
        stubs: {
          NuxtLink: {
            props: ['to'],
            template: '<a :href="to"><slot /></a>'
          },
          CountUp: { template: '<span class="count-up-stub" />' },
          BrandMark: { template: '<div class="brand-mark-stub" />' },
          RoseMotif: { template: '<span class="rose-motif-stub" />' }
        }
      }
    })

    expect(wrapper.text()).toContain('EXPLORE THE CITY')

    const links = wrapper.findAll('a')
    const hrefs = links.map(l => l.attributes('href'))

    expect(hrefs).toContain('/barangays')
    expect(hrefs).toContain('/places')
    expect(hrefs).toContain('/explore')
    expect(hrefs).toContain('/history')

    expect(wrapper.text()).toContain("Explore Santa Rosa's 18 barangays.")
    expect(wrapper.text()).toContain('Discover notable places, landmarks and attractions around the city.')
    expect(wrapper.text()).toContain('See Santa Rosa by barangay and geographic area.')
    expect(wrapper.text()).toContain('Trace Santa Rosa from Barrio Bukol to the modern city.')
  })

  it('contains zero em-dashes and no real-time or traffic claims', () => {
    const wrapper = mount(SantaRosaAtAGlance, {
      global: {
        stubs: {
          NuxtLink: { template: '<a><slot /></a>' },
          CountUp: { template: '<span class="count-up-stub" />' },
          BrandMark: { template: '<div class="brand-mark-stub" />' },
          RoseMotif: { template: '<span class="rose-motif-stub" />' }
        }
      }
    })

    const text = wrapper.text()
    expect(text).not.toContain('—')
    expect(text).not.toContain('Real-time')
    expect(text).not.toContain('Live traffic')
    expect(text).not.toContain('Traffic')
    expect(text).not.toContain('Recent Advisories')
  })
})
