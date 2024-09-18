import { mark } from './Equation'
import { test, expect } from 'vitest'

test('marks correctly', async () => {
  expect(await mark({ equation: 'x^2-5x+6', attempt: ['2', '3'] })).toBe(true)
  expect(await mark({ equation: 'x^2 - 1', attempt: ['1'] })).toBe(false)
  expect(await mark({ equation: 'x^2 - 1', attempt: ['-1', '1'] })).toBe(true)
  expect(await mark({ equation: '\\sin(x) = 0', a: '0', b: '2\\pi', attempt: ['0'] })).toBe(false)
  expect(
    await mark({ equation: '\\sin(x) = 0', a: '0', b: '2 \\pi', attempt: ['0', '\\pi'] }),
  ).toBe(false)
  expect(
    await mark({ equation: '\\sin(x) = 0', a: '0', b: '2 \\pi', attempt: ['0', '\\pi', '2\\pi'] }),
  ).toBe(true)
  expect(
    await mark({
      equation: '\\sin(x) = \\frac{1}{2}',
      a: '0',
      b: '2 \\pi',
      attempt: ['\\frac{\\pi}{6}', '\\frac{5\\pi}{6}'],
    }),
  ).toBe(true)
})
