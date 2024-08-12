'use server'

import CryptoJS from 'crypto-js'

const passphrase = import.meta.env.VITE_PASSPHRASE

export function encrypt(text: string) {
  CryptoJS.AES.encrypt(text, passphrase).toString()
}

export function decrypt(encrypted: string) {
  const bytes = CryptoJS.AES.decrypt(encrypted, passphrase)
  return bytes.toString(CryptoJS.enc.Utf8)
}
