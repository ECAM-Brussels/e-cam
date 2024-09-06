import { mark } from './Simple'
import { test, expect } from 'vitest'
import { encrypt } from '~/lib/cryptography'

test('answer is not leaked and marks correctly', async () => {
  const enc = (val: string) => encrypt(val, import.meta.env.VITE_PASSPHRASE)
  expect(enc('hello')).not.toBe('hello')
  expect(await mark({ question: '', answer: enc('1'), attempt: '1' })).toBe(true)
  expect(await mark({ question: '', answer: enc('1'), attempt: '2/2' })).toBe(true)
  expect(await mark({ question: '', answer: enc('1'), attempt: '2' })).toBe(false)
})
