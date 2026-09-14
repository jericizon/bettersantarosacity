import { describe, it, expect } from 'vitest'
import {
  BarangaySchema,
  OfficialSchema,
  BudgetSchema,
  ProjectSchema,
  LawSchema,
  SourceSchema
} from '../../types/civic'

describe('Civic Zod Schemas', () => {
  it('validates a correct Barangay record', () => {
    const sample = {
      name: 'Balibago',
      slug: 'balibago',
      group: 'Lowland Urban',
      description: 'Major commercial and transportation hub of Santa Rosa.',
      latitude: 14.2886,
      longitude: 121.1114,
      source: 'Santa Rosa LGU Official Records',
      lastVerified: '2026-09-01'
    }
    const result = BarangaySchema.safeParse(sample)
    expect(result.success).toBe(true)
  })

  it('rejects an invalid barangay group', () => {
    const invalid = {
      name: 'Test',
      slug: 'test',
      group: 'NonExistentGroup',
      description: 'Desc',
      source: 'Source',
      lastVerified: '2026-09-01'
    }
    const result = BarangaySchema.safeParse(invalid)
    expect(result.success).toBe(false)
  })
})
