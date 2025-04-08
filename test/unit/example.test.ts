import { describe, it, expect } from 'vitest'

describe('Example Test Suite', () => {
  it('should add two numbers correctly', () => {
    const result = 2 + 2
    expect(result).toBe(4)
  })

  it('should concatenate strings', () => {
    const result = 'Hello' + ' ' + 'World'
    expect(result).toBe('Hello World')
  })
})
