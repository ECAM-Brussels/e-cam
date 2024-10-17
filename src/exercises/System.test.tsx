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
      attempt: ['1', '1', 'x'],
    }),
  ).toBe(false)
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
  expect(
    await mark({
      equations: ['-4x - 3y + 3z = -6', '-20x - 16y + 19z = 30', '16x + 15y - 24z = 70'],
      variables: ['x', 'y', 'z'],
      attempt: ['', '', ''],
      impossible: true,
    })
  )
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
