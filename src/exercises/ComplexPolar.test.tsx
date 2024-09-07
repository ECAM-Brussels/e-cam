import { mark, solve } from './ComplexPolar'
import { test, expect } from 'vitest'

test('marks correctly', async () => {
  expect(await mark({ expr: 'i', attempt: '1 \\times e^{i \\frac{\\pi}{2}}' })).toBe(true)
  expect(await mark({ expr: 'i', attempt: 'e^{i \\frac{\\pi}{2}}' })).toBe(false)
  expect(await mark({ expr: '1 + i', attempt: '1 + i' })).toBe(false)
  expect(await mark({ expr: '1 + i', attempt: '\\sqrt{2} e^{i \\frac{\\pi}{4}}' })).toBe(true)
})

test('solver is correct', async () => {
  expect((await solve({ expr: '1 + i'})).attempt).toBe('\\sqrt{2} e^{i \\left(\\frac{\\pi}{4}\\right)}')
  expect((await solve({ expr: 'i'})).attempt).toBe('1 e^{i \\left(\\frac{\\pi}{2}\\right)}')
})