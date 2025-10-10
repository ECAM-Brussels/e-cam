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
    equation: 'x^2 + y^2 = 9',
    attempt: { type: 'circle', center: '\\left(0, 0\\right)', radius: '(3)' },
    correct: true,
  },
  {
    equation: 'x^2 + y^2 = 9',
    attempt: { type: 'circle', center: '\\left(0, 0\\right)', radius: '4' },
    correct: false,
  },
  {
    equation: 'x^2 + y^2 = 9',
    attempt: { type: 'circle', center: '\\left(0, 0\\right)', radius: '\\emptyset' },
    correct: false,
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
    equation: '(x-1)^2 + (y+2)^2 = 4',
    attempt: { type: 'circle', center: '\\left(1, -2\\right)', radius: '3' },
    correct: false,
  },
  {
    equation: '(x-1)^2 + (y+2)^2 = 4',
    attempt: { type: 'circle', center: '\\left(-1, 2\\right)', radius: '2' },
    correct: false,
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
      center: '\\left(0; 0\\right)',
      vertices: ['FiniteSet', '\\left(3;0\\right)', '\\left(-3;0\\right)'],
      foci: [
        'FiniteSet',
        '\\left(\\sqrt{\\left(5\\right)};0\\right)',
        '\\left(-\\sqrt{\\left(5\\right)};0\\right)',
      ],
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
      asymptotes: ['FiniteSet', 'y=-x', 'y=x'],
      vertices: ['FiniteSet', '\\left(-2;0\\right)', '\\left(2;0\\right)'],
      foci: ['FiniteSet', '\\left(-2\\sqrt2;0\\right)', '\\left(2\\sqrt2;0\\right)'],
    },
    correct: true,
  },
  {
    equation: 'x^2 - y^2 = 4',
    attempt: {
      type: 'hyperbola',
      center: '\\left(0, 0\\right)',
      asymptotes: ['FiniteSet', 'y=\\left(1\\right)x', 'y=\\left(-1\\right)x'],
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
      asymptotes: ['FiniteSet', 'y=\\left(-1\\right)\\cdot x', 'y=\\left(1\\right)\\cdot x'],
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
        '\\left(\\left(-2\\right)\\cdot\\sqrt2,0\\right)',
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
    equation: '(x+3)^2 - 4(y-2)^2 = 4',
    attempt: {
      type: 'hyperbola',
      center: '\\left(-3, 2\\right)',
      asymptotes: ['FiniteSet', 'y=\\frac{x+3}{2}+2', 'y=-\\frac{x+3}{2}+2'],
      vertices: ['FiniteSet', '\\left(-1,2\\right)', '\\left(-5,2\\right)'],
      foci: ['FiniteSet', '\\left(-3+\\sqrt5,2\\right)', '\\left(-3-\\sqrt5,2\\right)'],
    },
    correct: true,
  },
  {
    equation: '(x+3)^2 - 4(y-2)^2 = 4',
    attempt: {
      type: 'hyperbola',
      center: '\\left(-3, 2\\right)',
      asymptotes: ['FiniteSet', 'y=\\frac{x+3}{2}+2', 'y=\\frac{-\\left(x+3\\right)}{2}+2'],
      vertices: ['FiniteSet', '\\left(-1,2\\right)', '\\left(-5,2\\right)'],
      foci: ['FiniteSet', '\\left(-3+\\sqrt5,2\\right)', '\\left(-3-\\sqrt5,2\\right)'],
    },
    correct: true,
  },
  {
    equation: '(x+3)^2 - 4(y-2)^2 = 4',
    attempt: {
      type: 'hyperbola',
      center: '\\left(-3, 2\\right)',
      asymptotes: ['FiniteSet', 'y=\\frac{x}{2}+\\frac72', 'y=-\\frac{x}{2}+\\frac12'],
      vertices: ['FiniteSet', '\\left(-1,2\\right)', '\\left(-5,2\\right)'],
      foci: ['FiniteSet', '\\left(-3+\\sqrt5,2\\right)', '\\left(-3-\\sqrt5,2\\right)'],
    },
    correct: true,
  },
  {
    equation: '(x+3)^2 - 4(y-2)^2 = 4',
    attempt: {
      type: 'hyperbola',
      center: '\\left(-3, 2\\right)',
      asymptotes: ['FiniteSet', 'y=\\frac{x}{2}+3.5', 'y=\\frac{-x}{2}+0.5'],
      vertices: ['FiniteSet', '\\left(-1,2\\right)', '\\left(-5,2\\right)'],
      foci: ['FiniteSet', '\\left(-3+\\sqrt5,2\\right)', '\\left(-3-\\sqrt5,2\\right)'],
    },
    correct: true,
  },
  {
    equation: '(x+3)^2 - 4(y-2)^2 = 4',
    attempt: {
      type: 'hyperbola',
      center: '\\left(-3, 2\\right)',
      asymptotes: ['FiniteSet', 'y=0.5x+3.5', 'y=-0.5x+0.5'],
      vertices: ['FiniteSet', '\\left(-1,2\\right)', '\\left(-5,2\\right)'],
      foci: ['FiniteSet', '\\left(-3+5^{\\frac12},2\\right)', '\\left(-3-5^{\\frac12},2\\right)'],
    },
    correct: true,
  },
  // {
  //   equation: '(x+3)^2 - 4(y-2)^2 = 4',
  //   attempt: {
  //     type: 'hyperbola',
  //     center: '\\left(-3, 2\\right)',
  //     asymptotes: ['FiniteSet', 'y=0.5x+3.5', 'y=-0.5x+0.5'],
  //     vertices: ['FiniteSet', '\\left(-1,2\\right)', '\\left(-5,2\\right)'],
  //     foci: ['FiniteSet', '\\left(-3+5^{0.5},2\\right)', '\\left(-3-5^{0.5},2\\right)'],
  //   },
  //   correct: true,
  // },

  {
    equation: '-9(x-1)^2 + 4(y+2)^2 = 36',
    attempt: {
      type: 'hyperbola',
      center: '\\left(1, -2\\right)',
      asymptotes: [
        'FiniteSet',
        'y=\\frac32\\left(x-1\\right)-2',
        'y=-\\frac32\\left(x-1\\right)-2',
      ],
      vertices: ['FiniteSet', '\\left(1,1\\right)', '\\left(1,-5\\right)'],
      foci: ['FiniteSet', '\\left(1,-2+\\sqrt{13}\\right)', '\\left(1,-2-\\sqrt{13}\\right)'],
    },
    correct: true,
  },
  {
    equation: '-9(x-1)^2 + 4(y+2)^2 = 36',
    attempt: {
      type: 'hyperbola',
      center: '\\left(1, -2\\right)',
      asymptotes: [
        'FiniteSet',
        'y=\\frac{3\\left(x-1\\right)}{2}-2',
        'y=-\\frac{3\\left(x-1\\right)}{2}-2',
      ],
      vertices: ['FiniteSet', '\\left(1;-5\\right)', '\\left(1;1\\right)'],
      foci: ['FiniteSet', '\\left(1;-2-\\sqrt{13}\\right)', '\\left(1;-2+\\sqrt{13}\\right)'],
    },
    correct: true,
  },
  {
    equation: '-9(x-1)^2 + 4(y+2)^2 = 36',
    attempt: {
      type: 'hyperbola',
      center: '\\left(1, -2\\right)',
      asymptotes: [
        'FiniteSet',
        'y+2=\\frac32\\left(x-1\\right)',
        'y+2=-\\frac32\\left(x-1\\right)',
      ],
      vertices: ['FiniteSet', '\\left(1,1\\right)', '\\left(1,-5\\right)'],
      foci: ['FiniteSet', '\\left(1,-2+\\sqrt{13}\\right)', '\\left(1,-2-\\sqrt{13}\\right)'],
    },
    correct: true,
  },
  {
    equation: '-9(x-1)^2 + 4(y+2)^2 = 36',
    attempt: {
      type: 'hyperbola',
      center: '\\left(1, -2\\right)',
      asymptotes: ['FiniteSet', 'y=\\frac32x-\\frac72', 'y=-\\frac32x-\\frac12'],
      vertices: ['FiniteSet', '\\left(1,1\\right)', '\\left(1,-5\\right)'],
      foci: ['FiniteSet', '\\left(1,-2+\\sqrt{13}\\right)', '\\left(1,-2-\\sqrt{13}\\right)'],
    },
    correct: true,
  },

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
