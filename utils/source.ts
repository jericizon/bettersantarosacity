import type { CityUpdate, SourceReference } from '~/types/civic'

// Spec bans em-dashes in rendered copy; dataset strings still carry them.
export function normalizeDisplayText(text: string): string {
  return text.replace(/\s*—\s*/g, ' · ').trim()
}

// Dataset `source` fields are strings like "Title (https://url); Title 2 (https://url2)".
// Split off the first URL for the citation link; the rest stays as display text.
export function toSourceReference(source: string): SourceReference {
  const title = source.split(' (')[0]?.trim() || source
  return {
    title: normalizeDisplayText(title),
    url: source.match(/https?:\/\/[^\s);]+/)?.[0]
  }
}

// Records that cite several sources pack them into one ";"-separated string.
export function toSourceReferences(source: string): SourceReference[] {
  return source.split(';').map(part => part.trim()).filter(Boolean).map(toSourceReference)
}

// A SourceBadge must mirror the record's declared sourceType, never a
// hardcoded value: official channels read 'official', direct documents
// (ordinance, advisory) read 'primary', non-government reads 'secondary'.
export const UPDATE_SOURCE_BADGE: Record<CityUpdate['sourceType'], 'official' | 'primary' | 'secondary'> = {
  'official-portal': 'official',
  'official-facebook': 'official',
  'city-ordinance': 'primary',
  'advisory': 'primary',
  'secondary': 'secondary'
}

// Update contexts show a descriptive label instead of the terse tier word;
// SourceBadge's optional `label` prop overrides the tier text when passed.
export const UPDATE_SOURCE_LABEL: Record<CityUpdate['sourceType'], string> = {
  'official-portal': 'Official City Source',
  'official-facebook': 'Official City Source',
  'city-ordinance': 'Primary Government Source',
  'advisory': 'Primary Government Source',
  'secondary': 'Secondary Source'
}
