import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import BrandMark from '~/components/brand/BrandMark.vue'

describe('Brand Identity System', () => {
  it('confirms standalone arch SVG exists in public/images/brand/', () => {
    const filePath = resolve(process.cwd(), 'public/images/brand/santa-rosa-arch.svg')
    expect(existsSync(filePath)).toBe(true)
  })

  it('renders BrandMark component with customizable size and themes', () => {
    const wrapper = mount(BrandMark, {
      props: { size: 48, monochrome: true }
    })

    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('width')).toBe('48')
    expect(svg.attributes('height')).toBe('48')
    expect(wrapper.classes()).toContain('brand-monochrome')
  })
})
