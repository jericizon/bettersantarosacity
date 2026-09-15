import { describe, it, expect } from 'vitest'
import mediaData from '~/data/media.json'
import { MediaItemSchema } from '~/types/civic'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

describe('Media Registry & License Verification', () => {
  it('validates all items in media.json against MediaItemSchema', () => {
    expect(Array.isArray(mediaData)).toBe(true)
    expect(mediaData.length).toBeGreaterThanOrEqual(5)

    for (const item of mediaData) {
      const parsed = MediaItemSchema.safeParse(item)
      expect(parsed.success, `Schema validation failed for media item ${item.id}: ${parsed.error?.message}`).toBe(true)
    }
  })

  it('confirms every registered media file exists in public/ directory', () => {
    for (const item of mediaData) {
      const filePath = resolve(process.cwd(), 'public', item.file.replace(/^\//, ''))
      expect(existsSync(filePath), `Media file not found at ${filePath}`).toBe(true)
    }
  })
})
