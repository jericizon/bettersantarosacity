// Builds a consistent spec §28 head block for every content page: unique
// title, meta description, canonical URL, and OpenGraph tags. Pure function —
// safe to call inside the `typeof useHead === 'function'` guards used so
// pages stay importable under plain Vitest.
export const SITE_URL = 'https://bettersantarosacity.org'
export const SITE_NAME = 'Better Santa Rosa City'

export interface CivicSeoOptions {
  title: string
  description: string
  path: string
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>
}

interface CivicSeoHead {
  title: string
  // unhead types meta entries as a discriminated union keyed on
  // name/property/http-equiv — keep the two emitted shapes literal so the
  // result stays assignable to UseHeadInput.
  meta: Array<
    { name: string, content: string } |
    { property: string, content: string }
  >
  // unhead types link entries as a discriminated union on `rel` — keep the
  // literal so the result stays assignable to UseHeadInput.
  link: Array<{ rel: 'canonical', href: string }>
  // unhead serializes object textContent to JSON for ld+json scripts.
  script?: Array<{ type: 'application/ld+json', textContent: Record<string, unknown> }>
}

export function buildSeoHead(options: CivicSeoOptions): CivicSeoHead {
  const url = `${SITE_URL}${options.path}`
  const head: CivicSeoHead = {
    title: options.title,
    meta: [
      { name: 'description', content: options.description },
      { property: 'og:title', content: options.title },
      { property: 'og:description', content: options.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: url },
      { property: 'og:site_name', content: SITE_NAME }
    ],
    link: [{ rel: 'canonical', href: url }]
  }

  if (options.jsonLd) {
    const blocks = Array.isArray(options.jsonLd) ? options.jsonLd : [options.jsonLd]
    head.script = blocks.map(schema => ({
      type: 'application/ld+json' as const,
      textContent: schema
    }))
  }

  return head
}
