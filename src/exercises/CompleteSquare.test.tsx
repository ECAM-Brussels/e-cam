import { mark } from './CompleteSquare'
import { test, expect } from 'vitest'

test('marks correctly', async () => {
  expect(await mark({ expr: 'x^2 + 10x + 24', attempt: '(x + 5)^2 -1' })).toBe(true)
  expect(await mark({ expr: 'x^2 + 2x - 2', attempt: '(x + 1)^2 - 3' })).toBe(true)
})
