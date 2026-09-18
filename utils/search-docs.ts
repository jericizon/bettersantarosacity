// Shared civic dataset search index. Consumed by /search (as the fallback
// engine when Pagefind is absent) and by the SearchModal autocomplete.
import officialsData from '~/data/officials.json'
import departmentsData from '~/data/departments.json'
import barangaysData from '~/data/barangays.json'
import projectsData from '~/data/projects.json'
import lawsData from '~/data/laws.json'
import budgetsData from '~/data/budgets.json'
import servicesData from '~/data/services.json'
import placesData from '~/data/places.json'
import updatesData from '~/data/updates.json'
import { LAW_TYPE_LABEL } from '~/utils/law'
import type { CityUpdate, Law, Place } from '~/types/civic'

export const SEARCH_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'officials', label: 'Officials' },
  { id: 'barangays', label: 'Barangays' },
  { id: 'projects', label: 'Projects' },
  { id: 'laws', label: 'Laws' },
  { id: 'budget', label: 'Budget' },
  { id: 'services', label: 'Services' },
  { id: 'places', label: 'Places' },
  { id: 'updates', label: 'Updates' },
  { id: 'pages', label: 'Pages' }
] as const

export type SearchCategoryId = (typeof SEARCH_CATEGORIES)[number]['id']
export type SearchResultCategory = Exclude<SearchCategoryId, 'all'>

export function searchCategoryLabel(id: string): string {
  return SEARCH_CATEGORIES.find(c => c.id === id)?.label ?? 'Pages'
}

export interface SearchDoc {
  title: string
  description: string
  url: string
  type: SearchResultCategory
  searchText: string
}

function doc(title: string, description: string, url: string, type: SearchResultCategory): SearchDoc {
  return { title, description, url, type, searchText: `${title} ${description}`.toLowerCase() }
}

export const searchDocs: SearchDoc[] = [
  ...officialsData.map(o =>
    doc(o.name, `${o.position}, ${o.office}. ${o.bio ?? ''}`, `/government#${o.id}`, 'officials')),
  ...departmentsData.map(d =>
    doc(d.name, d.responsibilities.join('; '), `/government#${d.id}`, 'officials')),
  ...barangaysData.map(b =>
    doc(`Barangay ${b.name}`, `${b.group}. ${b.description}`, `/barangays#${b.slug}`, 'barangays')),
  ...projectsData.map(p =>
    doc(p.name, `${p.category} · ${p.status}. ${p.description} Barangay: ${p.barangay}`, `/projects#${p.slug}`, 'projects')),
  ...(lawsData as Law[]).map(l =>
    doc(`${LAW_TYPE_LABEL[l.type] ?? 'Measure'} No. ${l.number} · ${l.title}`, l.summary, `/laws#${l.id}`, 'laws')),
  ...budgetsData.map(b =>
    doc(
      `Verified city revenue FY ${b.fiscalYear}`,
      `₱${b.totalBudgetPhp.toLocaleString('en-PH')} verified revenue (COA/BLGF). ${b.categories.map(c => c.name).join('; ')}`,
      '/finances',
      'budget'
    )),
  ...servicesData.map(s =>
    doc(s.title, `${s.category}. ${s.description}`, `/services#${s.id}`, 'services')),
  // Places and updates link to their detail pages: unlike the record indexes
  // above, those list pages carry no per-item anchors.
  ...(placesData as Place[]).map(p =>
    doc(p.title, `${p.category} · ${p.barangay}. ${p.description}`, `/places/${p.slug}`, 'places')),
  ...(updatesData as CityUpdate[])
    .filter(u => u.status === 'published')
    .map(u =>
      doc(u.title, `${u.category} · ${u.date}. ${u.summary}`, `/updates/${u.slug}`, 'updates')),
  doc('Explore Santa Rosa', 'City overview, profile, and civic timeline.', '/explore', 'pages'),
  doc('City Finances', 'Verified city revenue and fiscal records.', '/finances', 'pages'),
  doc('Open Data', 'Machine-readable civic datasets.', '/data', 'pages'),
  doc('Sources & Methodology', 'Source register and verification notes.', '/sources', 'pages'),
  doc('Methodology & Standards', 'How records are collected, verified, and corrected.', '/about/methodology', 'pages')
]

// Substring match over the dataset index; title hits rank first.
export function matchSearchDocs(q: string): SearchDoc[] {
  const needle = q.trim().toLowerCase()
  if (!needle) return []
  return searchDocs
    .filter(d => d.searchText.includes(needle))
    .sort((a, b) => Number(b.title.toLowerCase().includes(needle)) - Number(a.title.toLowerCase().includes(needle)))
}

const ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, c => ESCAPE_MAP[c] ?? c)
}

// Escaped text with the first needle occurrence wrapped in <mark>.
export function markHtml(text: string, needle: string): string {
  const idx = text.toLowerCase().indexOf(needle.toLowerCase())
  if (idx === -1) return escapeHtml(text)
  return (
    escapeHtml(text.slice(0, idx)) +
    '<mark>' +
    escapeHtml(text.slice(idx, idx + needle.length)) +
    '</mark>' +
    escapeHtml(text.slice(idx + needle.length))
  )
}

// Excerpt window around the first match, escaped, with <mark> highlighting.
export function buildExcerpt(text: string, needle: string): string {
  const idx = text.toLowerCase().indexOf(needle.toLowerCase())
  const start = idx === -1 ? 0 : Math.max(0, idx - 60)
  const end = idx === -1 ? Math.min(text.length, 160) : Math.min(text.length, idx + needle.length + 80)
  const prefix = start > 0 ? '…' : ''
  const suffix = end < text.length ? '…' : ''
  const slice = text.slice(start, end)
  if (idx === -1) return prefix + escapeHtml(slice) + suffix
  const hit = idx - start
  return (
    prefix +
    escapeHtml(slice.slice(0, hit)) +
    '<mark>' +
    escapeHtml(slice.slice(hit, hit + needle.length)) +
    '</mark>' +
    escapeHtml(slice.slice(hit + needle.length)) +
    suffix
  )
}
