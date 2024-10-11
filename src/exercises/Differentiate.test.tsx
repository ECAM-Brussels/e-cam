import { mark } from './Differentiate'
import { test, expect } from 'vitest'

test('marks correctly', async () => {
  expect(await mark({ expr: 'x^2-5x+6', attempt: '2x - 5' })).toBe(true)
  expect(await mark({ expr: '\\sin(x)', attempt: '\\cos(x)' })).toBe(true)
  expect(await mark({ expr: 'e^x', attempt: 'e^x' })).toBe(true)
  expect(await mark({ expr: 'x(x - 1)', attempt: '2x - 1' })).toBe(true)
  expect(await mark({ expr: '\\frac{x^2}{\\ln x}', attempt: '\\frac{2x}{\\ln x} - \\frac{x}{\\ln{(x)^2}}'})).toBe(false)
  expect(await mark({ expr: '\\frac{x^2}{\\ln x}', attempt: '\\frac{2x}{\\ln x} - \\frac{x}{\\ln^2(x)}'})).toBe(true)
})