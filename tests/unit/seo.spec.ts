// tests/unit/seo.spec.ts
import { describe, it, expect } from 'vitest'
import fs from 'node:fs'

describe('SEO & Deployment Assets', () => {
  it('has robots.txt with sitemap reference', () => {
    const robots = fs.readFileSync('public/robots.txt', 'utf-8')
    expect(robots).toContain('User-agent: *')
    expect(robots).toContain('Sitemap:')
  })
})
