import { describe, it, expect } from 'vitest'
import cityData from '../../data/city.json'
import barangaysData from '../../data/barangays.json'
import officialsData from '../../data/officials.json'
import departmentsData from '../../data/departments.json'
import budgetsData from '../../data/budgets.json'
import projectsData from '../../data/projects.json'
import lawsData from '../../data/laws.json'
import servicesData from '../../data/services.json'
import sourcesData from '../../data/sources.json'
import placesData from '../../data/places.json'
import updatesData from '../../data/updates.json'

import {
  CityProfileSchema,
  BarangaySchema,
  OfficialSchema,
  DepartmentSchema,
  BudgetSchema,
  ProjectSchema,
  LawSchema,
  ServiceSchema,
  SourceSchema,
  PlaceSchema,
  CityUpdateSchema
} from '../../types/civic'

describe('Data Integrity & Source Verification', () => {
  it('validates city.json', () => {
    expect(CityProfileSchema.safeParse(cityData).success).toBe(true)
  })

  it('validates exactly 18 barangays in barangays.json', () => {
    expect(barangaysData).toHaveLength(18)
    for (const b of barangaysData) {
      const res = BarangaySchema.safeParse(b)
      if (!res.success) {
        console.error(b.name, res.error)
      }
      expect(res.success).toBe(true)
    }
  })

  it('validates officials.json', () => {
    expect(officialsData.length).toBeGreaterThan(0)
    for (const item of officialsData) {
      expect(OfficialSchema.safeParse(item).success).toBe(true)
    }
  })

  it('validates departments.json', () => {
    expect(departmentsData.length).toBeGreaterThan(0)
    for (const item of departmentsData) {
      const res = DepartmentSchema.safeParse(item)
      if (!res.success) {
        console.error(item.name, res.error)
      }
      expect(res.success).toBe(true)
    }
  })

  it('validates budgets.json', () => {
    expect(budgetsData.length).toBeGreaterThan(0)
    for (const item of budgetsData) {
      expect(BudgetSchema.safeParse(item).success).toBe(true)
    }
  })

  it('validates projects.json', () => {
    for (const item of projectsData) {
      expect(ProjectSchema.safeParse(item).success).toBe(true)
    }
  })

  it('validates laws.json', () => {
    for (const item of lawsData) {
      expect(LawSchema.safeParse(item).success).toBe(true)
    }
  })

  it('validates services.json', () => {
    for (const item of servicesData) {
      expect(ServiceSchema.safeParse(item).success).toBe(true)
    }
  })

  it('validates sources.json', () => {
    for (const item of sourcesData) {
      expect(SourceSchema.safeParse(item).success).toBe(true)
    }
  })

  it('validates places.json', () => {
    expect(placesData.length).toBeGreaterThan(0)
    for (const item of placesData) {
      expect(PlaceSchema.safeParse(item).success).toBe(true)
    }
  })

  it('validates updates.json', () => {
    expect(updatesData.length).toBeGreaterThan(0)
    for (const item of updatesData) {
      expect(CityUpdateSchema.safeParse(item).success).toBe(true)
    }
  })
})
