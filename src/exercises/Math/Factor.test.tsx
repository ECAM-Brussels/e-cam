import { mark } from './Factor'
import { expect, test } from 'vitest'

test('test factorisation check', async () => {
  // 5x+10 : test correct answers 
  expect(await mark({ expr: '5x + 10', x: 'x', expand: false }, '5(x+2)')).toBe(true)
  expect(await mark({ expr: '5x + 10', x: 'x', expand: false }, '5\\left(x+2\\right)')).toBe(true)
  expect(await mark({ expr: '5x + 10', x: 'x', expand: false }, '\\left(x+2\\right)5')).toBe(true)
  expect(await mark({ expr: '5x + 10', x: 'x', expand: false }, '5\\cdot\\left(x+2\\right)')).toBe(true)
  expect(await mark({ expr: '5x + 10', x: 'x', expand: false }, '\\left(x+2\\right)\\cdot5')).toBe(true)
  expect(await mark({ expr: '5x + 10', x: 'x', expand: false }, '-5\\left(-x- 2\\right)')).toBe(true)
  expect(await mark({ expr: '5x + 10', x: 'x', expand: false }, '\\left(-5\\right)\\left(-x- 2\\right)')).toBe(true)
  expect(await mark({ expr: '5x + 10', x: 'x', expand: false }, '\\left(-5\\right)\\cdot\\left(-x- 2\\right)')).toBe(true)
  expect(await mark({ expr: '5x + 10', x: 'x', expand: false }, '10\\left(\\frac{x}{2}+1\\right)')).toBe(true)
  
  // 5x+10 : test wrong answers
  expect(await mark({ expr: '5x + 10', x: 'x', expand: false }, '5x + 10)')).toBe(false)

  // x^2-4 : math test correct answers 
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, '(x - 2)(x + 2)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, '(x + 2)(x - 2)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, '-(2 - x)(2 + x)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, '-(2 + x)(2 - x)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, '2(x/2 - 1)(x + 2)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, '2(x - 2)(x/2 + 1)')).toBe(true)

  // x^2-4 : math test wrong answers
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, 'x^2 - 4')).toBe(false)
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, 'x\\cdot x - 4')).toBe(false)
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, '-\\left(4-x^2\\right))')).toBe(false)
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, '(x - 2)(x - 2)')).toBe(false)
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, '(x - 2)(x - 3)')).toBe(false)

  // x^2-4 : computer/virtual keyboard test correct answers
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, '\\left(x-2\\right)\\left(x+2\\right)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, '\\left(x+2\\right)\\left(x-2\\right)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, '-\\left(2-x\\right)\\left(2+x\\right)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, '-\\left(2+x\\right)\\left(2-x\\right)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, '\\left(x-2\\right)\\cdot\\left(x+2\\right)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, '\\left(x+2\\right)\\cdot\\left(x-2\\right)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, '-\\left(2-x\\right)\\cdot\\left(2+x\\right)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, '-\\left(2+x\\right)\\cdot\\left(2-x\\right)')).toBe(true)

  // x^2-4 : weird ways of entering correct answer on keyboard 
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, '(-1)\\cdot\\left(2-x\\right)\\cdot\\left(2+x\\right)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, '\\left(2+x\\right)\\cdot(-1)\\cdot\\left(2-x\\right)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, '2\\left(\\frac{x}{2}-1\\right)\\left(x+2\\right)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, '1\\cdot\\left(x-2\\right)\\left(x+2\\right)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 4', x: 'x', expand: false }, '1\\cdot\\left(x-2\\right)\\cdot1\\cdot\\left(x+2\\right)')).toBe(true)
  
  // x^2+4 : test correct answers 
  expect(await mark({ expr: 'x^2 + 4', x: 'x', expand: false }, 'x^2 + 4')).toBe(true) // this is not ok if we work in C
  expect(await mark({ expr: 'x^2 + 4', x: 'x', expand: false }, '\\left(x-2i\\right)\\left(x+2i\\right)')).toBe(true) 

  // x^2+4 : test wrong answers
  expect(await mark({ expr: 'x^2 + 4', x: 'x', expand: false }, '\\left(x-2\\right)\\left(x+2\\right)')).toBe(false)
  expect(await mark({ expr: 'x^2 + 4', x: 'x', expand: false }, '\\left(x+2\\right)\\left(x-2\\right)')).toBe(false)
  
  // 4x^2 : test correct answers
  expect(await mark({ expr: '4x^2', x: 'x', expand: false }, '4x^2')).toBe(true)
  expect(await mark({ expr: '4x^2', x: 'x', expand: false }, '\\left(2x\\right)\\left(2x\\right)')).toBe(true)
  expect(await mark({ expr: '4x^2', x: 'x', expand: false }, '2x\\cdot2x')).toBe(true)
  expect(await mark({ expr: '4x^2', x: 'x', expand: false }, '4\\cdot x^2')).toBe(true)
  // expect(await mark({ expr: '4x^2', x: 'x', expand: false }, '2x2x')).toBe(true) // this doesn't pass the test, this is interpreted as 2 \\cdot 2 x by Sympy  

  // x^2 - 5x + 6 : test correct answers 
  expect(await mark({ expr: 'x^2 - 5x + 6', x: 'x', expand: false }, '\\left(x - 2\\right)\\left(x - 3\\right)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 5x + 6', x: 'x', expand: false }, '\\left(x - 3\\right)\\left(x - 2\\right)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 5x + 6', x: 'x', expand: false }, '\\left(2 - x\\right)\\left(3 - x\\right)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 5x + 6', x: 'x', expand: false }, '\\left(3 - x\\right)\\left(2 - x\\right)')).toBe(true)
  expect(await mark({ expr: 'x^2 - 5x + 6', x: 'x', expand: false }, '\\left(x - 3\\right)\\cdot\\left(x - 2\\right)')).toBe(true)

  // x^2 - 5x + 6 : test wrong answers 
  expect(await mark({ expr: 'x^2 - 5x + 6', x: 'x', expand: false }, 'x^2 - 5x + 6')).toBe(false)
  expect(await mark({ expr: 'x^2 - 5x + 6', x: 'x', expand: false }, '\\left(x-\\frac52\\right)^2-\\frac14')).toBe(false)
  expect(await mark({ expr: 'x^2 - 5x + 6', x: 'x', expand: false }, '\\left(x - 2\\right)^2')).toBe(false)
  expect(await mark({ expr: 'x^2 - 5x + 6', x: 'x', expand: false }, '\\left(x - 2\\right)\\left(x + 2\\right)')).toBe(false)
  expect(await mark({ expr: 'x^2 - 5x + 6', x: 'x', expand: false }, '\\left(x-2\\right).\\left(x-3\\right)')).toBe(false)


  // 3x^2 - 10x + 3 : test correct answers 
  expect(await mark({ expr: '3x^2 - 10x + 3', x: 'x', expand: false }, '\\left(x - 3\\right)\\left(3x - 1\\right)')).toBe(true)
  expect(await mark({ expr: '3x^2 - 10x + 3', x: 'x', expand: false }, '\\left(3x - 1\\right)\\left(x - 3\\right)')).toBe(true)
  expect(await mark({ expr: '3x^2 - 10x + 3', x: 'x', expand: false }, '3\\left(x-3\\right)\\left(x-\\frac13\\right)')).toBe(true)
  
  // 3x^2 - 10x + 3 : test wrong answers 
  expect(await mark({ expr: '3x^2 - 10x + 3', x: 'x', expand: false }, '\\left(x - 3\\right)\\left(3x - 2\\right)')).toBe(false)
  expect(await mark({ expr: '3x^2 - 10x + 3', x: 'x', expand: false }, '\\left(x-3\\right)\\left(x-\\frac13\\right)')).toBe(false)

})