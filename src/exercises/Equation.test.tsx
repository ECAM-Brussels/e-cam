import { mark } from './Equation'
import { test, expect } from 'vitest'

test('marks correctly', async () => {
  expect(await mark({ equation: 'x^2-5x+6', attempt: ['2', '3'] })).toBe(true)
  expect(await mark({ equation: 'x^2 - 1', attempt: ['-1', '1'] })).toBe(true)
})
