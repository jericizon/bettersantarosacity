// tests/unit/visual-tokens.spec.ts
import { describe, it, expect } from 'vitest'
import tailwindConfig from '~/tailwind.config'

describe('Visual Design Tokens & Motion Specs', () => {
  it('defines the required civic colors and font families', () => {
    const colors = tailwindConfig.theme?.extend?.colors as Record<string, string>
    expect(colors['laguna-green']).toBe('#164A3D')
    expect(colors['rose-accent']).toBe('#C96A73')
    expect(colors['laguna-blue']).toBe('#5E9FA5')
    expect(colors['parchment']).toBe('#F6F3EA')

    const fonts = tailwindConfig.theme?.extend?.fontFamily as Record<string, string[]>
    expect(fonts.sans).toContain('Inter')
    expect(fonts.serif).toContain('Source Serif 4')
  })
})
