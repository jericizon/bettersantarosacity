// tests/unit/services-and-data.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ServicesIndex from '../../pages/services/index.vue'
import DataIndex from '../../pages/data/index.vue'

describe('Services & Open Data', () => {
  it('marks all services with official source destination notices', () => {
    const wrapper = mount(ServicesIndex)
    expect(wrapper.text()).toContain('Official Government Service')
  })

  it('provides open dataset catalog for download', () => {
    const wrapper = mount(DataIndex)
    expect(wrapper.text()).toContain('Download Datasets')
  })
})
