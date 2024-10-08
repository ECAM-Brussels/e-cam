import { onMount } from 'solid-js'
import Page from '~/components/Page'
import { generatePKCE } from '~/lib/auth/azure'

export default function Login() {
  onMount(async () => {
    const { codeVerifier, codeChallenge } = await generatePKCE()
    sessionStorage.setItem('codeVerifier', codeVerifier)
    const loginUrl =
      `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}` +
      `/oauth2/v2.0/authorize?client_id=${import.meta.env.VITE_AZURE_CLIENT_ID}&response_type=code` +
      `&redirect_uri=${import.meta.env.VITE_AZURE_REDIRECT_URI}&response_mode=query&scope=openid profile email` +
      `&code_challenge=${codeChallenge}&code_challenge_method=S256`
    window.location.href = loginUrl
  })

  return (
    <Page>
      <div>Redirecting to Microsoft login...</div>
    </Page>
  )
}
