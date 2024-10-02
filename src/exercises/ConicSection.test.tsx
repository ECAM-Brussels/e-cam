import { mark } from './ConicSection'
import { test, expect } from 'vitest'

test('marks correctly', async () => {
  expect(
    await mark({
      equation: 'x^2 + y^2 = 1',
      attempt: {
        type: 'ellipse',
        center: '(0, 0)',
        foci: ['(0, 0)'],
        vertices: ['(1, 0)', '(-1, 0)'],
      },
    }),
  ).toBe(true)
  expect(await mark({ equation: 'y^2 + 10x = 0', attempt: {
    type: 'parabola',
    center: '(0, 0)',
    foci: ['(-\\frac{5}{2}, 0)'],
    vertices: [],
  }})).toBe(true)
  expect(await mark({ equation: 'x^2 + 10y = 0', attempt: {
    type: 'parabola',
    center: '(0, 0)',
    foci: ['(0, -\\frac{5}{2})'],
    vertices: [],
  }})).toBe(true)
  expect(
    await mark({
      equation: '9x^2 + 16y^2 = 144',
      attempt: {
        type: 'ellipse',
        center: '(0, 0)',
        foci: ['(-\\sqrt{7}, 0)', '(\\sqrt{7}, 0)'],
        vertices: ['(-4, 0)', '(4, 0)'],
      },
    }),
  ).toBe(true)
  expect(
    await mark({
      equation: '9x^2 - 16y^2 = 144',
      attempt: {
        type: 'hyperbola',
        center: '(0, 0)',
        foci: ['(-5, 0)', '(5, 0)'],
        vertices: ['(-4, 0)', '(4, 0)'],
      },
    }),
  ).toBe(true)
  expect(
    await mark({
      equation: 'y^2 - 4 x^2 = 1',
      attempt: {
        type: 'hyperbola',
        center: '(0, 0)',
        foci: ['(0, -\\frac{\\sqrt{5}}{2})', '(0, \\frac{\\sqrt{5}}{2})'],
        vertices: ['(0, -1)', '(0, 1)'],
      },
    }),
  ).toBe(true)
  expect(
    await mark({
      equation: '9x^2 - 4y^2 - 72x + 8y + 176',
      attempt: {
        type: 'hyperbola',
        center: '(4, 1)',
        foci: ['(4, 1 + \\sqrt{13})', '(4, 1 - \\sqrt{13})'],
        vertices: ['(4, 4)', '(4, -2)'],
      },
    }),
  ).toBe(true)
})
