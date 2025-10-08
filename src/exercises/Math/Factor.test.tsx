import { mark } from './Factor'
import { expect, test } from 'vitest'

test('test factorisation check', async () => {
  expect(await mark({ expr: 'x^2 - 5x + 6', x: 'x', expand: false }, '(x - 2)(x - 3)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, 'x^2 - 4')).toBe(false)
})
