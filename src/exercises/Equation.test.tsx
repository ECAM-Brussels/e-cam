import { mark } from './Equation'
import { test, expect } from 'vitest'

test('marks correctly', async () => {
  expect(await mark({ equation: 'x^2-5x+6', attempt: ['2', '3'] })).toBe(true)
  expect(await mark({ equation: 'x^2 - 1', attempt: ['1'] })).toBe(false)
  expect(await mark({ equation: 'x^2 - 1', attempt: ['-1', '1'] })).toBe(true)
  expect(await mark({ equation: 'x^2 + 1', attempt: ['i', '-i'] })).toBe(false)
  expect(await mark({ equation: 'x^2 + 1', attempt: [] })).toBe(true)

  // Complex equations
  expect(await mark({ equation: 'x^2 + 1', attempt: ['i', '-i'], complex: true })).toBe(true)
  expect(
    await mark({
      equation: 'x^3 + 1',
      attempt: ['-1', '\\frac {1 + \\sqrt{3} i}{2}', '\\frac {1 - \\sqrt{3} i}{2}'],
      complex: true,
    }),
  ).toBe(true)
  expect(
    await mark({
      equation: 'x^3 + 1',
      attempt: ['e^{i \\frac{\\pi}{3}}', 'e^{-i \\frac{\\pi}{3}}', 'e^{i \\pi}'],
      complex: true,
    }),
  ).toBe(true)

  // Trigonometric equations
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
