import { mark } from './Factor'
import { test, expect } from 'vitest'

test('marks correctly', async () => {
  expect(await mark({ expr: 'x^2-5x+6', attempt: '(x-2)(x-3)' })).toBe(true)
  expect(await mark({ expr: 'x^2 - 1', attempt: '(x-1)(x+1)' })).toBe(true)
})
