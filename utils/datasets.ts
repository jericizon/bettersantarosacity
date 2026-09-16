// Shared open-data catalog: the /data page renders the full card grid and the
// homepage Data & Downloads chapter renders the same list compactly. Keeping
// the builder here means download hrefs (/data/*.json mirrors + generated CSV
// data URIs) and source notes are defined once — never invented per page.
import barangaysData from '~/data/barangays.json'
import officialsData from '~/data/officials.json'
import departmentsData from '~/data/departments.json'
import budgetsData from '~/data/budgets.json'
import projectsData from '~/data/projects.json'
import lawsData from '~/data/laws.json'
import servicesData from '~/data/services.json'
import sourcesData from '~/data/sources.json'
import cityData from '~/data/city.json'
import { toSourceReference } from '~/utils/source'
import { toCsv, csvDataUri } from '~/utils/csv'
import type {
  Barangay, Budget, CityProfile, Department, Law, Official, Project, Service, Source
} from '~/types/civic'

type AnyRecord = Record<string, unknown>

function asRecords(data: unknown): AnyRecord[] {
  return (Array.isArray(data) ? data : [data]) as AnyRecord[]
}

// Records cite `source: string` or `sources: string[]` depending on the dataset.
function distinctSourceTitles(records: AnyRecord[]): string[] {
  const titles = new Set<string>()
  for (const record of records) {
    const many = record.sources
    const list = Array.isArray(many)
      ? many.filter((s): s is string => typeof s === 'string')
      : typeof record.source === 'string' ? [record.source] : []
    for (const s of list) titles.add(toSourceReference(s).title)
  }
  return [...titles]
}

function maxVerified(records: AnyRecord[]): string | undefined {
  return records
    .map(r => r.lastVerified)
    .filter((d): d is string => typeof d === 'string')
    .sort()
    .at(-1)
}

// First citable URL for the dataset: the first record's source URL, or the
// record's own `url` field (the sources registry carries URLs directly).
function firstSourceUrl(records: AnyRecord[]): string | undefined {
  const first = records.at(0)
  if (!first) return undefined
  const many = first.sources
  const cited = Array.isArray(many) ? many.at(0) : first.source
  if (typeof cited === 'string') return toSourceReference(cited).url
  return typeof first.url === 'string' ? first.url : undefined
}

// Same usage note on every dataset: compiled public data, originals win.
const LICENSE_NOTE = 'Public data compiled from official sources: verify against original documents.'

export interface DatasetCard {
  slug: string
  name: string
  description: string
  coverage: string
  lastUpdated?: string
  sourceNote: string
  sourceUrl?: string
  licenseNote: string
  jsonHref: string
  csvHref: string
}

function makeDataset(
  slug: string,
  name: string,
  description: string,
  coverage: string,
  raw: unknown,
  sourceNoteOverride?: string
): DatasetCard {
  const records = asRecords(raw)
  const titles = distinctSourceTitles(records)
  return {
    slug,
    name,
    description,
    coverage,
    lastUpdated: maxVerified(records),
    sourceNote: sourceNoteOverride ?? titles.join(' · '),
    sourceUrl: firstSourceUrl(records),
    licenseNote: LICENSE_NOTE,
    // JSON is mirrored into public/data/ by scripts/sync-public-data.mjs.
    jsonHref: `/data/${slug}.json`,
    csvHref: csvDataUri(toCsv(records))
  }
}

export function buildDatasets(): DatasetCard[] {
  const budgetYears = (budgetsData as Budget[]).map(b => b.fiscalYear).sort((a, b) => b - a)
  const budgetCoverage = `${(budgetsData as Budget[]).length} fiscal years (FY${budgetYears[0]}–${budgetYears.at(-1)})`

  return [
    makeDataset(
      'barangays', 'Barangays',
      'All city barangays with district grouping, description and 2020 PSA census population where recorded.',
      `${(barangaysData as Barangay[]).length} barangays`, barangaysData
    ),
    makeDataset(
      'officials', 'Elected Officials',
      'City officials (mayor, vice mayor, councilors and the lone district representative) with positions, terms and offices.',
      `${(officialsData as Official[]).length} officials`, officialsData
    ),
    makeDataset(
      'departments', 'Departments & Offices',
      'City departments and offices with heads, responsibilities, contacts and locations.',
      `${(departmentsData as Department[]).length} offices`, departmentsData
    ),
    makeDataset(
      'budgets', 'Annual Budgets',
      'Annual budget totals and category breakdowns per fiscal year, traced to audit and disclosure documents.',
      budgetCoverage, budgetsData
    ),
    makeDataset(
      'projects', 'Public Projects',
      'Tracked public projects with status, barangay, implementing office and budget where disclosed.',
      `${(projectsData as Project[]).length} projects`, projectsData
    ),
    makeDataset(
      'laws', 'Laws & Ordinances',
      'Ordinances, resolutions and executive orders with summaries and links to document copies.',
      `${(lawsData as Law[]).length} issuances`, lawsData
    ),
    makeDataset(
      'services', 'Public Services Directory',
      'Directory entries linking out to official government service pages · never recreated here.',
      `${(servicesData as Service[]).length} services`, servicesData
    ),
    makeDataset(
      'sources', 'Source Registry',
      'Every source cited across the site\'s datasets: official portals, audits, census and secondary references.',
      `${(sourcesData as Source[]).length} registered sources`, sourcesData,
      'The registry itself (per-source notes included in the records)'
    ),
    makeDataset(
      'city', 'City Profile',
      'City of Santa Rosa profile: cityhood, land area, barangay count and the historical timeline.',
      `City profile + ${(cityData as CityProfile).timeline.length}-entry timeline`, cityData
    )
  ]
}
