// Write public/sitemap.xml from the known route surface: static page routes
// plus dynamic routes derived from data/ (barangay slugs, project slugs,
// law ids). Runs via pregenerate so nuxt copies it into .output/public.
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const BASE = 'https://bettersantarosacity.org'
const root = fileURLToPath(new URL('..', import.meta.url))

const STATIC_ROUTES = [
  '/',
  '/about',
  '/about/media',
  '/about/methodology',
  '/history',
  '/explore',
  '/barangays',
  '/government',
  '/finances',
  '/finances/budget',
  '/projects',
  '/laws',
  '/services',
  '/data',
  '/sources',
  '/search'
]

const readJson = async name => JSON.parse(await readFile(join(root, 'data', name), 'utf-8'))

const [barangays, projects, laws] = await Promise.all([
  readJson('barangays.json'),
  readJson('projects.json'),
  readJson('laws.json')
])

const urls = STATIC_ROUTES.map(loc => ({ loc }))
for (const b of barangays) urls.push({ loc: `/barangays/${b.slug}`, lastmod: b.lastVerified })
for (const p of projects) urls.push({ loc: `/projects/${p.slug}`, lastmod: p.lastVerified })
for (const l of laws) urls.push({ loc: `/laws/${l.id}`, lastmod: l.lastVerified })

const body = urls
  .map(({ loc, lastmod }) => {
    const lm = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''
    return `  <url>\n    <loc>${BASE}${loc}</loc>${lm}\n  </url>`
  })
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`

await writeFile(join(root, 'public', 'sitemap.xml'), xml)
console.log(`generate-sitemap: wrote ${urls.length} URL(s) → public/sitemap.xml`)
