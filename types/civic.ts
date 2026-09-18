import { z } from 'zod'

export const SourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['LGU', 'COA', 'DBM', 'National', 'Institutional', 'Secondary']),
  url: z.string().url().optional(),
  notes: z.string().optional()
})

export type Source = z.infer<typeof SourceSchema>

// Lightweight reference used by attribution components (e.g. SourceCitation)
export interface SourceReference {
  title: string
  url?: string
}

export const BarangaySchema = z.object({
  name: z.string(),
  slug: z.string(),
  group: z.enum(['Laguna Lake', 'Lowland Urban', 'Upper / Tagaytay']),
  description: z.string(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  population: z.number().nullable().optional(),
  source: z.string(),
  lastVerified: z.string()
})

export type Barangay = z.infer<typeof BarangaySchema>

export const OfficialSchema = z.object({
  id: z.string(),
  name: z.string(),
  position: z.string(),
  office: z.string(),
  term: z.string(),
  photo: z.string().optional(),
  bio: z.string().optional(),
  contact: z.string().optional(),
  officialUrl: z.string().url().optional(),
  source: z.string(),
  lastVerified: z.string()
})

export type Official = z.infer<typeof OfficialSchema>

export const DepartmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  head: z.string(),
  responsibilities: z.array(z.string()),
  contact: z.string().optional(),
  location: z.string().optional(),
  source: z.string(),
  lastVerified: z.string()
})

export type Department = z.infer<typeof DepartmentSchema>

export const BudgetCategorySchema = z.object({
  name: z.string(),
  amountPhp: z.number(),
  percentage: z.number()
})

export type BudgetCategory = z.infer<typeof BudgetCategorySchema>

export const BudgetSchema = z.object({
  fiscalYear: z.number(),
  totalBudgetPhp: z.number(),
  categories: z.array(BudgetCategorySchema),
  documentUrl: z.string().url().optional(),
  source: z.string(),
  lastVerified: z.string()
})

export type Budget = z.infer<typeof BudgetSchema>

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  barangay: z.string(),
  category: z.string(),
  status: z.enum(['Planned', 'Ongoing', 'Completed', 'Cancelled', 'Unknown']),
  year: z.number().optional(),
  budgetPhp: z.number().nullable().optional(),
  location: z.string().optional(),
  implementingOffice: z.string(),
  sources: z.array(z.string()),
  lastVerified: z.string()
})

export type Project = z.infer<typeof ProjectSchema>

export const LawSchema = z.object({
  id: z.string(),
  type: z.enum(['ordinance', 'resolution', 'executive_order']),
  number: z.string(),
  title: z.string(),
  date: z.string(),
  summary: z.string(),
  documentUrl: z.string().url().optional(),
  source: z.string(),
  lastVerified: z.string()
})

export type Law = z.infer<typeof LawSchema>

export const ServiceSchema = z.object({
  id: z.string(),
  category: z.enum([
    'Business',
    'Permits',
    'Taxes',
    'Civil Registry',
    'Health',
    'Social Services',
    'Online Services',
    'General'
  ]),
  title: z.string(),
  description: z.string(),
  officialUrl: z.string().url(),
  requirements: z.array(z.string()).optional(),
  source: z.string(),
  lastVerified: z.string()
})

export type Service = z.infer<typeof ServiceSchema>

export const HotlineNumberSchema = z.object({
  label: z.string(),
  value: z.string(),
  tel: z.string().min(3)
})

export const HotlineSchema = z.object({
  id: z.string(),
  name: z.string(),
  agency: z.string(),
  tag: z.string().optional(),
  kind: z.enum(['emergency', 'city']),
  numbers: z.array(HotlineNumberSchema).min(1),
  note: z.string().optional(),
  officialUrl: z.string().url().optional(),
  source: z.string(),
  lastVerified: z.string()
})

export type Hotline = z.infer<typeof HotlineSchema>

export const CityProfileSchema = z.object({
  name: z.string(),
  cityhoodYear: z.number(),
  landAreaHa: z.number(),
  barangayCount: z.number(),
  timeline: z.array(
    z.object({
      year: z.string(),
      title: z.string(),
      description: z.string()
    })
  ),
  sources: z.array(z.string()),
  lastVerified: z.string()
})

export type CityProfile = z.infer<typeof CityProfileSchema>

export const MediaItemSchema = z.object({
  id: z.string(),
  file: z.string(),
  title: z.string(),
  description: z.string().optional(),
  category: z.enum(['heritage', 'civic', 'nature', 'urban']),
  source: z.string(),
  sourceUrl: z.string().url(),
  author: z.string(),
  license: z.string(),
  licenseUrl: z.string().url(),
  attributionRequired: z.boolean(),
  width: z.number().int().positive(),
  height: z.number().int().positive()
})

export type MediaItem = z.infer<typeof MediaItemSchema>

export const PlaceCategoryEnum = z.enum([
  'Landmark',
  'Attraction',
  'Heritage',
  'Nature',
  'Recreation',
  'Civic'
])

export const PlaceSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  category: PlaceCategoryEnum,
  barangay: z.string(),
  location: z.string(),
  description: z.string(),
  historicalContext: z.string().optional(),
  whyItMatters: z.string().optional(),
  images: z.array(z.string()).default([]),
  sources: z.array(z.string()),
  officialUrl: z.string().url().optional(),
  lastVerified: z.string()
})

export type Place = z.infer<typeof PlaceSchema>

export const UpdateCategoryEnum = z.enum([
  'emergency',
  'traffic',
  'roads',
  'public-services',
  'events',
  'government',
  'infrastructure',
  'community',
  'other'
])

export const UpdateSourceTypeEnum = z.enum([
  'official-portal',
  'official-facebook',
  'city-ordinance',
  'advisory',
  'secondary'
])

export const CityUpdateSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  date: z.string(),
  category: UpdateCategoryEnum,
  sourceType: UpdateSourceTypeEnum,
  sourceOrganization: z.string(),
  sourceUrl: z.string().url(),
  status: z.enum(['published', 'archived']).default('published'),
  summary: z.string(),
  content: z.string().optional(),
  lastVerified: z.string()
})

export type CityUpdate = z.infer<typeof CityUpdateSchema>
