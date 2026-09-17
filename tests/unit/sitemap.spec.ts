import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

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
