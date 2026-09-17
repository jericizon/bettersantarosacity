import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import placesData from '../../data/places.json'
import { PlaceSchema } from '../../types/civic'
import PlacesIndex from '../../pages/places/index.vue'

describe('Places Feature', () => {
  it('validates places.json against PlaceSchema', () => {
    expect(placesData.length).toBeGreaterThanOrEqual(5)
    for (const place of placesData) {
      const res = PlaceSchema.safeParse(place)
      expect(res.success, place.title).toBe(true)
    }
  })

  it('renders places index page with category filter tabs', () => {
    const wrapper = mount(PlacesIndex, {
      global: {
        stubs: {
          NuxtLink: { template: '<a><slot /></a>' },
          DataSourceBadge: true,
          DataLastVerified: true,
          // Brief's slot-only stub can't surface the prop-passed title; render it.
          PlaceCard: { props: ['place'], template: '<div class="place-card">{{ place.title }}</div>' }
        }
      }
    })
    expect(wrapper.find('h1').text()).toContain('Places & Landmarks')
    expect(wrapper.text()).toContain('Landmark')
    expect(wrapper.text()).toContain('Heritage')
    expect(wrapper.text()).toContain('Santa Rosa Arch')
  })
})
