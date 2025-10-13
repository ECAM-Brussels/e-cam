import { getFeedback, mark } from './Factor'
import { expect, test } from 'vitest'

const tests: { expr: string; attempt: string; correct: boolean }[] = [
  { expr: '5x + 10', attempt: '5(x + 2)', correct: true },
  { expr: '5x + 10', attempt: '5\\left(x+2\\right)', correct: true },
  { expr: '5x + 10', attempt: '\\left(x+2\\right)5', correct: true },
  { expr: '5x + 10', attempt: '5\\cdot\\left(x+2\\right)', correct: true },
  { expr: '5x + 10', attempt: '\\left(x+2\\right)\\cdot5', correct: true },
  { expr: '5x + 10', attempt: '-5\\left(-x- 2\\right)', correct: true },
  { expr: '5x + 10', attempt: '\\left(-5\\right)\\left(-x- 2\\right)', correct: true },
  { expr: '5x + 10', attempt: '\\left(-5\\right)\\cdot\\left(-x- 2\\right)', correct: true },
  { expr: '5x + 10', attempt: '10\\left(\\frac{x}{2}+1\\right)', correct: true },

  { expr: '5x + 10', attempt: '5x+10', correct: false },

  { expr: 'x^2 - 4', attempt: '(x - 2)(x + 2)', correct: true },
  { expr: 'x^2 - 4', attempt: '(x + 2)(x - 2)', correct: true },
  { expr: 'x^2 - 4', attempt: '-(2 - x)(2 + x)', correct: true },
  { expr: 'x^2 - 4', attempt: '-(2 + x)(2 - x)', correct: true },
  { expr: 'x^2 - 4', attempt: '2(x/2 - 1)(x + 2)', correct: true },
  { expr: 'x^2 - 4', attempt: '2(x - 2)(x/2 + 1)', correct: true },

  { expr: 'x^2 - 4', attempt: 'x^2 - 4', correct: false },
  { expr: 'x^2 - 4', attempt: 'x\\cdot x - 4', correct: false },
  { expr: 'x^2 - 4', attempt: '-\\left(4-x^2\\right))', correct: false },
  { expr: 'x^2 - 4', attempt: '(x - 2)(x - 2)', correct: false },
  { expr: 'x^2 - 4', attempt: '(x - 2)(x - 3)', correct: false },

  { expr: 'x^2 - 4', attempt: '\\left(x-2\\right)\\left(x+2\\right)', correct: true },
  { expr: 'x^2 - 4', attempt: '\\left(x+2\\right)\\left(x-2\\right)', correct: true },
  { expr: 'x^2 - 4', attempt: '-\\left(2-x\\right)\\left(2+x\\right)', correct: true },
  { expr: 'x^2 - 4', attempt: '-\\left(2+x\\right)\\left(2-x\\right)', correct: true },
  { expr: 'x^2 - 4', attempt: '\\left(x-2\\right)\\cdot\\left(x+2\\right)', correct: true },
  { expr: 'x^2 - 4', attempt: '\\left(x+2\\right)\\cdot\\left(x-2\\right)', correct: true },
  { expr: 'x^2 - 4', attempt: '-\\left(2-x\\right)\\cdot\\left(2+x\\right)', correct: true },
  { expr: 'x^2 - 4', attempt: '-\\left(2+x\\right)\\cdot\\left(2-x\\right)', correct: true },

  {
    expr: 'x^2 - 4',
    attempt: '(-1)\\cdot\\left(2-x\\right)\\cdot\\left(2+x\\right)',
    correct: true,
  },
  {
    expr: 'x^2 - 4',
    attempt: '\\left(2+x\\right)\\cdot(-1)\\cdot\\left(2-x\\right)',
    correct: true,
  },
  { expr: 'x^2 - 4', attempt: '2\\left(\\frac{x}{2}-1\\right)\\left(x+2\\right)', correct: true },
  { expr: 'x^2 - 4', attempt: '1\\cdot\\left(x-2\\right)\\left(x+2\\right)', correct: true },
  {
    expr: 'x^2 - 4',
    attempt: '1\\cdot\\left(x-2\\right)\\cdot1\\cdot\\left(x+2\\right)',
    correct: true,
  },

  { expr: 'x^2 + 4', attempt: 'x^2 + 4', correct: true }, // this is not ok if we work on C
  { expr: 'x^2 + 4', attempt: '\\left(x-2i\\right)\\left(x+2i\\right)', correct: true },

  { expr: 'x^2 + 4', attempt: '\\left(x-2\\right)\\left(x+2\\right)', correct: false },
  { expr: 'x^2 + 4', attempt: '\\left(x+2\\right)\\left(x-2\\right)', correct: false },

  { expr: '4x^2', attempt: '4x^2', correct: true },
  { expr: '4x^2', attempt: '\\left(2x\\right)\\left(2x\\right)', correct: true },
  { expr: '4x^2', attempt: '2x\\cdot2x', correct: true },
  { expr: '4x^2', attempt: '4\\cdot x^2', correct: true },
  // { expr: '4x^2', attempt: '2x2x', correct: true }, // this doesn't pass the test, this is interpreted as 2 \\cdot 2 x by Sympy

  { expr: '3x^2 - 6x + 3', attempt: '3\\left(x-1\\right)^2', correct: true },
  { expr: '3x^2 - 6x + 3', attempt: '3\\cdot\\left(x-1\\right)^2', correct: true },
  { expr: '3x^2 - 6x + 3', attempt: '3\\left(x-1\\right)\\left(x-1\\right)', correct: true },
  {
    expr: '3x^2 - 6x + 3',
    attempt: '3\\cdot\\left(x-1\\right)\\cdot\\left(x-1\\right)',
    correct: true,
  },

  { expr: '3x^2 - 6x + 3', attempt: '3x^2-6x+3', correct: false },
  { expr: '3x^2 - 6x + 3', attempt: '\\left(x-1\\right)^2', correct: false },

  { expr: 'x^2 - 5x + 6', attempt: '\\left(x - 2\\right)\\left(x - 3\\right)', correct: true },
  { expr: 'x^2 - 5x + 6', attempt: '\\left(x - 3\\right)\\left(x - 2\\right)', correct: true },
  { expr: 'x^2 - 5x + 6', attempt: '\\left(2 - x\\right)\\left(3 - x\\right)', correct: true },
  { expr: 'x^2 - 5x + 6', attempt: '\\left(3 - x\\right)\\left(2 - x\\right)', correct: true },
  {
    expr: 'x^2 - 5x + 6',
    attempt: '\\left(x - 3\\right)\\cdot\\left(x - 2\\right)',
    correct: true,
  },

  { expr: 'x^2 - 5x + 6', attempt: 'x^2 - 5x + 6', correct: false },
  { expr: 'x^2 - 5x + 6', attempt: '\\left(x-\\frac52\\right)^2-\\frac14', correct: false },
  { expr: 'x^2 - 5x + 6', attempt: '\\left(x - 2\\right)^2', correct: false },
  { expr: 'x^2 - 5x + 6', attempt: '\\left(x - 2\\right)\\left(x + 2\\right)', correct: false },
  { expr: 'x^2 - 5x + 6', attempt: '\\left(x-2\\right).\\left(x-3\\right)', correct: false },

  { expr: '3x^2 - 10x + 3', attempt: '\\left(x - 3\\right)\\left(3x - 1\\right)', correct: true },
  { expr: '3x^2 - 10x + 3', attempt: '\\left(3x - 1\\right)\\left(x - 3\\right)', correct: true },
  {
    expr: '3x^2 - 10x + 3',
    attempt: '3\\left(x-3\\right)\\left(x-\\frac13\\right)',
    correct: true,
  },

  {
    expr: '3x^2 - 10x + 3',
    attempt: '\\left(x - 3\\right)\\left(3x - 2\\right)',
    correct: false,
  },
  {
    expr: '3x^2 - 10x + 3',
    attempt: '\\left(x-3\\right)\\left(x-\\frac13\\right)',
    correct: false,
  },
]

const questions = new Set()
test.each(tests)('factorisation: $expr', async ({ expr, attempt, correct }) => {
  expect(await mark({ expr }, attempt)).toBe(correct)
  if (questions.has(expr)) {
    const answer = (await getFeedback(0, { expr }, attempt))?.answer
    expect(answer).not.toBe(undefined)
    expect(await mark({ expr }, answer ?? '')).toBe(true)
    questions.add(expr)
  }
})
