'use server'

import CryptoJS from 'crypto-js'

const defaultPassphrase = import.meta.env.VITE_PASSPHRASE

export function encrypt(text: string, passphrase = defaultPassphrase) {
  return CryptoJS.AES.encrypt(text, passphrase).toString()
}

export function decrypt(encrypted: string, passphrase = defaultPassphrase) {
  const bytes = CryptoJS.AES.decrypt(encrypted, passphrase)
  return bytes.toString(CryptoJS.enc.Utf8)
}
