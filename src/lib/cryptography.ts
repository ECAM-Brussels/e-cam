'use server'

import CryptoJS from 'crypto-js'

export function encrypt(text: string, passphrase: string) {
  return CryptoJS.AES.encrypt(text, passphrase).toString()
}

export function decrypt(encrypted: string, passphrase: string) {
  const bytes = CryptoJS.AES.decrypt(encrypted, passphrase)
  return bytes.toString(CryptoJS.enc.Utf8)
}
