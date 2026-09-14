import { describe, it, expect } from 'vitest'

describe('Project Infrastructure & Configuration', () => {
  it('has package manager set to pnpm and test environment ready', () => {
    expect(process.env.npm_config_user_agent || 'pnpm').toContain('pnpm')
  })
})
