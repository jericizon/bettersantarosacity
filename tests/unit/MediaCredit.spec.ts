import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MediaCredit from '~/components/media/MediaCredit.vue'
import type { MediaItem } from '~/types/civic'

const mockMedia: MediaItem = {
  id: 'test-arch',
  file: '/images/santa-rosa-arch.svg',
  title: 'Test Arch',
  category: 'heritage',
  source: 'Wikimedia Commons',
  sourceUrl: 'https://commons.wikimedia.org/test',
  author: 'Juan Dela Cruz',
  license: 'CC BY-SA 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  attributionRequired: true,
  width: 1200,
  height: 800
}

describe('MediaCredit Component', () => {
  it('renders author, license and source URL with security attributes', () => {
    const wrapper = mount(MediaCredit, {
      props: { media: mockMedia }
    })

    expect(wrapper.text()).toContain('Juan Dela Cruz')
    expect(wrapper.text()).toContain('CC BY-SA 4.0')
    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('https://commons.wikimedia.org/test')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toContain('noopener')
  })

  it('supports overlay variant styling', () => {
    const wrapper = mount(MediaCredit, {
      props: { media: mockMedia, variant: 'overlay' }
    })
    expect(wrapper.classes()).toContain('absolute')
  })
})
