import { mark } from './ConicSection'
import { expect, test } from 'vitest'

const tests: { equation: string; attempt: Parameters<typeof mark>[1]; correct: boolean }[] = [
  {
    equation: 'x^2 + y^2 = 9',
    attempt: { type: 'circle', center: '\\left(0, 0\\right)', radius: '3' },
    correct: true,
  },
  {
    equation: 'x^2 + y^2 = 9',
    attempt: { type: 'circle', center: '\\left(0; 0\\right)', radius: '3' },
    correct: true,
  },

  {
    equation: '(x-1)^2 + (y+2)^2 = 4',
    attempt: { type: 'circle', center: '\\left(1, -2\\right)', radius: '2' },
    correct: true,
  },
  {
    equation: '(x-1)^2 + (y+2)^2 = 4',
    attempt: { type: 'circle', center: '\\left(1; -2\\right)', radius: '2' },
    correct: true,
  },

  {
    equation: '4x^2 + 9y^2 = 36',
    attempt: {
      type: 'ellipse',
      center: '\\left(0, 0\\right)',
      vertices: ['FiniteSet', '\\left(3,0\\right)', '\\left(-3,0\\right)'],
      foci: ['FiniteSet', '\\left(\\sqrt5,0\\right)', '\\left(-\\sqrt5,0\\right)'],
    },
    correct: true,
  },
  {
    equation: '4x^2 + 9y^2 = 36',
    attempt: {
      type: 'ellipse',
      center: '\\left(0; 0\\right)',
      vertices: ['FiniteSet', '\\left(3;0\\right)', '\\left(-3;0\\right)'],
      foci: ['FiniteSet', '\\left(\\sqrt5;0\\right)', '\\left(-\\sqrt5;0\\right)'],
    },
    correct: true,
  },
  {
    equation: '4x^2 + 9y^2 = 36',
    attempt: {
      type: 'ellipse',
      center: '\\left(0, 0\\right)',
      vertices: ['FiniteSet', '\\left(3,0\\right)', '\\left(-3,0\\right)'],
      foci: ['FiniteSet', '\\left(5^\\frac12,0\\right)', '\\left(-5^\\frac12,0\\right)'],
    },
    correct: true,
  },
  {
    equation: '4x^2 + 9y^2 = 36',
    attempt: {
      type: 'ellipse',
      center: '\\left(0; 0\\right)',
      vertices: ['FiniteSet', '\\left(3;0\\right)', '\\left(-3;0\\right)'],
      foci: ['FiniteSet', '\\left(5^\\frac12;0\\right)', '\\left(-5^\\frac12;0\\right)'],
    },
    correct: true,
  },

  {
    equation: 'x^2 - y^2 = 4',
    attempt: {
      type: 'hyperbola',
      center: '\\left(0, 0\\right)',
      asymptotes: ['FiniteSet', 'y=x', 'y=-x'],
      vertices: ['FiniteSet', '\\left(2,0\\right)', '\\left(-2,0\\right)'],
      foci: ['FiniteSet', '\\left(2\\sqrt2,0\\right)', '\\left(-2\\sqrt2,0\\right)'],
    },
    correct: true,
  },
  {
    equation: 'x^2 - y^2 = 4',
    attempt: {
      type: 'hyperbola',
      center: '\\left(0, 0\\right)',
      asymptotes: ['FiniteSet', 'y=x', 'y=-x'],
      vertices: ['FiniteSet', '\\left(2,0\\right)', '\\left(-2,0\\right)'],
      foci: ['FiniteSet', '\\left(2\\cdot\\sqrt2,0\\right)', '\\left(-2\\cdot\\sqrt2,0\\right)'],
    },
    correct: true,
  },
  {
    equation: 'x^2 - y^2 = 4',
    attempt: {
      type: 'hyperbola',
      center: '\\left(0, 0\\right)',
      asymptotes: ['FiniteSet', 'y=x', 'y=-x'],
      vertices: ['FiniteSet', '\\left(2,0\\right)', '\\left(-2,0\\right)'],
      foci: [
        'FiniteSet',
        '\\left(\\left(2\\right)\\cdot\\sqrt2,0\\right)',
        '\\left(-2\\cdot\\sqrt2,0\\right)',
      ],
    },
    correct: true,
  },
  {
    equation: 'x^2 - y^2 = 4',
    attempt: {
      type: 'hyperbola',
      center: '\\left(0, 0\\right)',
      asymptotes: ['FiniteSet', 'y=x', 'y=-x'],
      vertices: ['FiniteSet', '\\left(2,0\\right)', '\\left(-2,0\\right)'],
      foci: ['FiniteSet', '\\left(2^{\\frac32},0\\right)', '\\left(-2^{\\frac32},0\\right)'],
    },
    correct: true,
  },
  // {
  //   equation: 'x^2 - y^2 = 1',
  //   attempt: {
  //     type: 'hyperbola',
  //     center: '\\left(0, 0\\right)',
  //     asymptotes: ['FiniteSet', 'y=x', 'y=-x'],
  //     vertices: ['FiniteSet', '\\left(1,0\\right)', '\\left(-1,0\\right)'],
  //     foci: ['FiniteSet', '\\left(2^{0.5},0\\right)', '\\left(-2^{0.5},0\\right)'],
  //   },
  //   correct: true,
  // },
  {
    equation: 'x^2 = 4y',
    attempt: {
      type: 'parabola',
      vertices: ['FiniteSet', '(0,0)'],
      foci: ['FiniteSet', '(0,1)'],
      directrix: 'y=-1',
    },
    correct: true,
  },
]

test.each(tests)('conic section: $equation', async ({ equation, attempt, correct }) => {
  const result = await mark({ type: 'conic', equation }, attempt)
  expect(result).toBe(correct)
})

