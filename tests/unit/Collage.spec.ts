import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Collage from '~/components/civic/Collage.vue'

describe('Editorial Collage Component', () => {
  it('renders signature editorial image collage with images and captions', () => {
    const wrapper = mount(Collage)
    expect(wrapper.findAll('img').length).toBeGreaterThanOrEqual(3)
  })
})
