import type { SourceReference } from '~/types/civic'

// Dataset `source` fields are strings like "Title (https://url); Title 2 (https://url2)".
// Split off the first URL for the citation link; the rest stays as display text.
export function toSourceReference(source: string): SourceReference {
  const title = source.split(' (')[0]?.trim() || source
  return {
    // Spec bans em-dashes in rendered copy; dataset source strings still carry them.
    title: title.replace(/\s*—\s*/g, ' · ').trim(),
    url: source.match(/https?:\/\/[^\s);]+/)?.[0]
  }
}

// Records that cite several sources pack them into one ";"-separated string.
export function toSourceReferences(source: string): SourceReference[] {
  return source.split(';').map(part => part.trim()).filter(Boolean).map(toSourceReference)
}
