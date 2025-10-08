import { mark } from './Factor'
import { expect, test } from 'vitest'

test('test factorisation check', async () => {
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, '(x - 2)(x + 2)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, '(x + 2)(x - 2)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, '-(2 - x)(2 + x)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, '-(2 + x)(2 - x)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, '(-1)\\cdot(2 - x)(2 + x)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, '(x + 2)\\cdot(x - 2)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, 'x^2 - 4')).toBe(false)
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, 'x\\cdot x - 4')).toBe(false)
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, '4 - x^2')).toBe(false)
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, '(x - 2)(x - 3)')).toBe(false)

  expect(await mark({ expr: 'x^2 - 5x + 6', x: 'x', expand: false }, '(x - 2)(x - 3)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 5x + 6', x: 'x', expand: false }, '(x - 3)(x - 2)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 5x + 6', x: 'x', expand: false }, '(2 - x)(3 - x)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 5x + 6', x: 'x', expand: false }, '(3 - x)(2 - x)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 5x + 6', x: 'x', expand: false }, '(x - 3)\\cdot(x - 2)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 5x + 6', x: 'x', expand: false }, 'x^2 - 5x +6')).toBe(false)
  expect(await mark({ expr: 'x^2 - 5x + 6', x: 'x', expand: false }, '(x - 5/2)^2 - 1/4')).toBe(false)
  expect(await mark({ expr: 'x^2 - 5x + 6', x: 'x', expand: false }, '(x - \\frac{5}{2})^2 - \\frac{1}{4}')).toBe(false)
  expect(await mark({ expr: 'x^2 - 5x + 6', x: 'x', expand: false }, '(x - 2)^2')).toBe(false)
  expect(await mark({ expr: 'x^2 - 5x + 6', x: 'x', expand: false }, '(x - 2)(x + 2)')).toBe(false)

  expect(await mark({ expr: '3x^2 - 10x + 3', x: 'x', expand: false }, '(x - 3)(3x - 1)')).toBe(true)
  expect(await mark({ expr: '3x^2 - 10x + 3', x: 'x', expand: false }, '(3x - 1)(x-3)')).toBe(true)
  expect(await mark({ expr: '3x^2 - 10x + 3', x: 'x', expand: false }, '3\\left(x-3\\right)\\left(x-\\frac13\\right)')).toBe(true)

})