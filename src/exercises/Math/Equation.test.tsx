import { attempt as attemptSchema, mark } from './Equation'
import { expect, test } from 'vitest'
import { z } from 'zod'

const tests: {
  correct: boolean
  complex?: boolean
  x?: string
  S?: [string, ...string[]]
  equation: string
  attempt: z.input<typeof attemptSchema>
}[] = [
  { equation: 'x^2 = 4', attempt: ['2'], correct: false },
  { equation: 'x^2 = 4', attempt: ['2', '-2'], correct: true },

  { equation: 'x^2 = -1', attempt: ['i', '-i'], correct: false },
  { equation: 'x^2 = -1', complex: true, attempt: ['i', '-i'], correct: true },
  { equation: 'z^2 = -1', x: 'z', complex: true, attempt: ['i', '-i'], correct: true },

  { equation: 'x^3 = -1', attempt: ['-1'], correct: true },
  { equation: 'x^3 = -1', complex: true, attempt: ['-1'], correct: false },
  {
    equation: 'x^3 = -1',
    complex: true,
    attempt: ['-1', 'e^{\\frac{i \\pi}{3}}', 'e^{-\\frac{i \\pi}{3}}'],
    correct: true,
  },
  {
    equation: 'x^3 = -1',
    complex: true,
    attempt: [
      '-1',
      '\\cos(\\frac{\\pi}{3}) + i \\sin(\\frac{\\pi}{3})',
      '\\cos(-\\frac{\\pi}{3}) + i \\sin(-\\frac{\\pi}{3})',
    ],
    correct: true,
  },
  {
    equation: 'x^3 = -1',
    complex: true,
    attempt: [
      '-1',
      '\\frac{1}{2} + i \\frac{\\sqrt{3}}{2}',
      '\\frac{1}{2} - i \\frac{\\sqrt{3}}{2}',
    ],
    correct: true,
  },

  {
    equation: '\\sin x = 1',
    attempt: ['\\frac{\\pi}{2}', '\\frac{5\\pi}{2}'],
    S: ['Interval', '0', '4\\pi'],
    correct: true,
  },
  {
    equation: '\\sin x = 1',
    attempt: ['\\frac{\\pi}{2}'],
    S: ['Interval', '-\\pi', '\\pi'],
    correct: true,
  },
]

test.each(tests)('equation: $equation', async ({ correct, attempt, ...question }) => {
  expect(await mark(question, attempt)).toBe(correct)
})
