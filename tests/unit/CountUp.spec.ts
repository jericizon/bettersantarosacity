import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CountUp from '~/components/civic/CountUp.vue'

describe('CountUp Component', () => {
  it('renders target numeric value', () => {
    const wrapper = mount(CountUp, {
      props: { end: 5543, suffix: ' ha' }
    })
    expect(wrapper.text()).toContain('ha')
  })
})
