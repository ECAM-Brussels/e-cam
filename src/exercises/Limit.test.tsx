import { mark } from './Limit'
import { test, expect } from 'vitest'

test('marks correctly', async () => {
  expect(await mark({ expr: '\\frac{x}{x}', x0: '0', attempt: '0' })).toBe(false)
  expect(await mark({ expr: '\\frac{x}{x}', x0: '0', attempt: '1' })).toBe(true)
  expect(await mark({ expr: '\\frac{x^2 - 5x + 6}{x - 2}', x0: '2', attempt: '-1' })).toBe(true)
})
