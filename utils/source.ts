import type { SourceReference } from '~/types/civic'

// Dataset `source` fields are strings like "Title (https://url); Title 2 (https://url2)".
// Split off the first URL for the citation link; the rest stays as display text.
export function toSourceReference(source: string): SourceReference {
  return {
    title: source.split(' (')[0]?.trim() || source,
    url: source.match(/https?:\/\/[^\s);]+/)?.[0]
  }
}
