import { mark, solve } from './System'
import { test, expect } from 'vitest'

test('marks correctly', async () => {
  expect(
    await mark({
      equations: ['x = 1', 'y = 1', 'z = 2'],
      variables: ['x', 'y', 'z'],
      attempt: ['1', '1', '2'],
    }),
  ).toBe(true)
  expect(
    await mark({
      equations: ['x = 1', 'y = 1', 'z = 2'],
      variables: ['x', 'y', 'z'],
      attempt: ['1', '1', '2'],
      impossible: true,
    }),
  ).toBe(false)
  expect(
    await mark({
      equations: ['x = 1', 'y = 1', 'z = 2'],
      variables: ['x', 'y', 'z'],
      attempt: ['1', '1', '3'],
    }),
  ).toBe(false)
  expect(
    await mark({
      equations: ['x = 1', 'y = 1', '0 = 0'],
      variables: ['x', 'y', 'z'],
      attempt: ['1', '1', '3'],
    }),
  ).toBe(false)
  expect(
    await mark({
      equations: ['x = 1', 'y = 1', '0 = 0'],
      variables: ['x', 'y', 'z'],
      attempt: ['1', '1', 't'],
    }),
  ).toBe(true)
  expect(
    await mark({
      equations: ['x = 1', 'y = 1', '0 = 0'],
      variables: ['x', 'y', 'z'],
      attempt: ['1', '1', 'z'],
    }),
  ).toBe(true)
  expect(
    await mark({
      equations: ['x = 1', 'y = 1', '0 = 1'],
      variables: ['x', 'y', 'z'],
      attempt: [],
      impossible: true,
    }),
  ).toBe(true)
})

test('solves correctly', async () => {
  expect(
    (await solve({
      equations: ['x = 1', 'y = 1', '0 = 1'],
      variables: ['x', 'y', 'z'],
    })).impossible,
  ).toBe(true)
  expect(
    (await solve({
      equations: ['x = 1', 'y = 1', '0 = 0'],
      variables: ['x', 'y', 'z'],
    })).attempt,
  ).toStrictEqual(['1', '1', 'z'])
})
