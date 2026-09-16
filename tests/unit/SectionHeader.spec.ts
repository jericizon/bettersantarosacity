// tests/unit/SectionHeader.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SectionHeader from '~/components/editorial/SectionHeader.vue'

describe('SectionHeader Editorial Component', () => {
  it('renders title and description in default light theme', () => {
    const wrapper = mount(SectionHeader, {
      props: {
        eyebrow: 'Interactive Geography',
        title: 'Explore Santa Rosa',
        description: '18 barangays across three geographic zones.'
      }
    })

    expect(wrapper.text()).toContain('Interactive Geography')
    expect(wrapper.text()).toContain('Explore Santa Rosa')
    expect(wrapper.text()).toContain('18 barangays across three geographic zones.')
    expect(wrapper.find('h2').classes()).toContain('text-laguna-green')
  })

  it('renders dark theme with appropriate parchment text and gold eyebrow', () => {
    const wrapper = mount(SectionHeader, {
      props: {
        eyebrow: 'Historical Timeline',
        title: 'From Bukol to Modern Santa Rosa',
        theme: 'dark'
      }
    })

    expect(wrapper.find('h2').classes()).toContain('text-parchment')
    expect(wrapper.find('.text-heritage-gold').exists()).toBe(true)
  })

  it('supports centered text alignment', () => {
    const wrapper = mount(SectionHeader, {
      props: {
        title: 'Centered Heading',
        align: 'center'
      }
    })

    expect(wrapper.classes()).toContain('text-center')
    expect(wrapper.classes()).toContain('mx-auto')
  })
})
