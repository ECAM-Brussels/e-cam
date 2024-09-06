import { mark } from './ComplexPolar'
import { test, expect } from 'vitest'

test('marks correctly', async () => {
  expect(await mark({ expr: 'i', attempt: '1 \\times e^{i \\frac{\\pi}{2}}' })).toBe(true)
  expect(await mark({ expr: 'i', attempt: 'e^{i \\frac{\\pi}{2}}' })).toBe(false)
  expect(await mark({ expr: '1 + i', attempt: '1 + i' })).toBe(false)
  expect(await mark({ expr: '\\sqrt{2} e^{i \\frac{\\pi}{4}}', attempt: '\\sqrt{2} e^{i \\frac{\\pi}{4}}' })).toBe(true)
})