// Flat-record → CSV conversion for the /data download catalog.
// Nested values (arrays/objects like `responsibilities`, `sources`, `timeline`)
// are JSON-stringified into a single cell; nullish values become empty cells.

type CsvRecord = Record<string, unknown>

function escapeCell(value: unknown): string {
  if (value == null) return ''
  const text = typeof value === 'object' ? JSON.stringify(value) : String(value)
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function toCsv(records: CsvRecord[]): string {
  if (records.length === 0) return ''
  // Header is the union of keys in first-seen order so ragged records keep columns.
  const headers: string[] = []
  for (const record of records) {
    for (const key of Object.keys(record)) {
      if (!headers.includes(key)) headers.push(key)
    }
  }
  const lines = [headers.map(escapeCell).join(',')]
  for (const record of records) {
    lines.push(headers.map(h => escapeCell(record[h])).join(','))
  }
  return lines.join('\n')
}

// A data: URI lets a plain <a download> serve generated CSV on a fully static
// site — no server route, no client-side Blob plumbing.
export function csvDataUri(csv: string): string {
  return `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`
}
