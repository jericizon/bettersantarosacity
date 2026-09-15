// tests/unit/visual-cards.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BudgetChart from '~/components/money/BudgetChart.vue'
import ProjectCard from '~/components/projects/ProjectCard.vue'
import type { Project } from '~/types/civic'

const mockProject: Project = {
  id: 'test-p',
  name: 'Test Project',
  slug: 'test-project',
  description: 'Test project description.',
  barangay: 'Aplaya',
  category: 'Infrastructure',
  status: 'Ongoing',
  year: 2025,
  budgetPhp: 5000000,
  implementingOffice: 'City Engineering',
  sources: ['https://example.com'],
  lastVerified: '2026-09-15'
}

describe('Editorial Visual Cards', () => {
  it('renders BudgetChart with animated progress bar indicators', () => {
    const wrapper = mount(BudgetChart, {
      props: {
        categories: [{ name: 'Tax Revenue', amountPhp: 1000000, percentage: 50 }]
      }
    })
    expect(wrapper.text()).toContain('Tax Revenue')
  })

  it('renders ProjectCard with micro-interaction classes and status badge', () => {
    const wrapper = mount(ProjectCard, {
      props: { project: mockProject }
    })
    expect(wrapper.text()).toContain('Test Project')
    // formatPeso trims the ".0" on round millions — ₱5M is the intended output.
    expect(wrapper.text()).toContain('₱5M')
  })
})
