// Minimal types for the Pagefind runtime bundle emitted to /pagefind/pagefind.js
// after `pnpm run index:search` (pagefind --site .output/public).
// Reference: https://pagefind.app/docs/api/
// The bundle is loaded via `import(/* @vite-ignore */ '/pagefind/pagefind.js')`;
// ambient `declare module` cannot match a `/`-rooted specifier, so these are
// global interfaces applied at the call site instead.

interface PagefindResultData {
  url: string
  raw_url?: string
  content: string
  word_count: number
  excerpt: string
  filters: Record<string, string[]>
  meta: Record<string, string>
  anchors?: Array<{ element: string; id: string; text?: string; location: number }>
}

interface PagefindResult {
  id: string
  data: () => Promise<PagefindResultData>
}

interface PagefindSearchResponse {
  results: PagefindResult[]
  unfilteredResultCount: number
  filters: Record<string, Record<string, number>>
}

interface PagefindSearchOptions {
  filters?: Record<string, string | string[]>
  sort?: Record<string, 'asc' | 'desc'>
}

interface PagefindModule {
  init: () => Promise<void>
  search: (query: string | null, options?: PagefindSearchOptions) => Promise<PagefindSearchResponse>
  filters: () => Promise<Record<string, Record<string, number>>>
}
