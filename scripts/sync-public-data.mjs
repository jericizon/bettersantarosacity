// Mirror data/*.json into public/data/ so the static site serves each dataset
// as a downloadable file at /data/<name>.json. data/ stays the single source
// of truth; this runs via prebuild/pregenerate so the copies never drift.
import { cp, mkdir, readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const root = fileURLToPath(new URL('..', import.meta.url))
const src = join(root, 'data')
const dest = join(root, 'public', 'data')

const files = (await readdir(src)).filter(f => f.endsWith('.json'))
await mkdir(dest, { recursive: true })
for (const file of files) {
  await cp(join(src, file), join(dest, file))
}
console.log(`sync-public-data: copied ${files.length} dataset(s) → public/data/`)
