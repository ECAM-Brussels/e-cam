import CryptoJS from 'crypto-js'

const defaultPassphrase = import.meta.env.VITE_PASSPHRASE

export async function encrypt(text: string, passphrase = defaultPassphrase) {
  'use server'
  return CryptoJS.AES.encrypt(text, passphrase).toString()
}

export async function decrypt(encrypted: string, passphrase = defaultPassphrase) {
  'use server'
  const bytes = CryptoJS.AES.decrypt(encrypted, passphrase)
  return bytes.toString(CryptoJS.enc.Utf8)
}
