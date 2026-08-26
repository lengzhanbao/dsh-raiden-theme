import { describe, expect, it } from 'vitest'
import { loadRaidenSystemPrompt } from '../src/prompt/loader.ts'

describe('prompt loader', () => {
  it('loads raiden system prompt markdown', () => {
    const text = loadRaidenSystemPrompt()
    expect(text).toContain('雷电将军')
    expect(text).toContain('{{model}}')
    expect(text).toContain('{{cwd}}')
    expect(text).toContain('雷电模式')
    expect(text).toContain('同人')
    expect(text).toContain('不要伪造')
  })
})
