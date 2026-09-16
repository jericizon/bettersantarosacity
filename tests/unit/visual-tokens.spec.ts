// tests/unit/visual-tokens.spec.ts
import { describe, it, expect } from 'vitest'
import tailwindConfig from '~/tailwind.config'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

describe('Visual Design Tokens & Motion Specs', () => {
  it('defines the required civic colors and font families', () => {
    const colors = tailwindConfig.theme?.extend?.colors as Record<string, string>
    expect(colors['laguna-green']).toBe('#164A3D')
    expect(colors['rose-accent']).toBe('#C96A73')
    expect(colors['laguna-blue']).toBe('#5E9FA5')
    expect(colors['parchment']).toBe('#F6F3EA')
    expect(colors['light-green']).toBe('#EBF2EE')

    const fonts = tailwindConfig.theme?.extend?.fontFamily as Record<string, string[]>
    expect(fonts.sans).toContain('Inter')
    expect(fonts.serif).toContain('Source Serif 4')
  })

  it('defines the 5 section chapter background classes in main.css', () => {
    const cssContent = readFileSync(resolve(process.cwd(), 'assets/css/main.css'), 'utf-8')
    expect(cssContent).toContain('.section-parchment')
    expect(cssContent).toContain('.section-white')
    expect(cssContent).toContain('.section-deep-green')
    expect(cssContent).toContain('.section-lake-blue')
    expect(cssContent).toContain('.section-light-green')
  })
})
