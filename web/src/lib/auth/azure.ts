import { saveAuthState } from './session'
import { generateCodeVerifier, generateState, MicrosoftEntraId } from 'arctic'

export const entra = new MicrosoftEntraId(
  import.meta.env.VITE_AZURE_TENANT_ID,
  import.meta.env.VITE_AZURE_CLIENT_ID,
  null,
  import.meta.env.VITE_AZURE_REDIRECT_URI,
)

export const getLoginUrl = async () => {
  'use server'
  const state = generateState()
  const codeVerifier = generateCodeVerifier()
  const url = entra.createAuthorizationURL(state, codeVerifier, ['openid', 'profile', 'email'])
  await saveAuthState(state, codeVerifier)
  return url.toString()
}
