import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { resolve, join } from 'node:path'

describe('Sitemap Integrity', () => {
  it('includes all primary static routes in scripts/generate-sitemap.mjs', () => {
    const sitemapScript = readFileSync(resolve(process.cwd(), 'scripts/generate-sitemap.mjs'), 'utf-8')
    expect(sitemapScript).toContain("'/about'")
    expect(sitemapScript).toContain("'/about/media'")
    expect(sitemapScript).toContain("'/history'")
    expect(sitemapScript).toContain("'/explore'")
    expect(sitemapScript).toContain("'/services'")
    expect(sitemapScript).toContain("'/sources'")
  })
})

describe('Sitemap Generator', () => {
  it('includes new v2.0 routes in the generated sitemap', async () => {
    // Read scripts/generate-sitemap.mjs content to ensure routes are tracked
    const content = await readFile(join(process.cwd(), 'scripts/generate-sitemap.mjs'), 'utf-8')
    expect(content).toContain('/about/methodology')
    expect(content).toContain('/finances')
    expect(content).toContain('/places')
    expect(content).toContain('/updates')
    expect(content).toContain('places.json')
    expect(content).toContain('updates.json')
  })
})
