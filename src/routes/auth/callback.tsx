import { useAction, useLocation, useNavigate } from '@solidjs/router'
import { onMount } from 'solid-js'
import Page from '~/components/Page'
import { getMicrosoftToken } from '~/lib/auth/azure'
import { login as loginAction } from '~/lib/auth/session'

export default function Callback() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAction(loginAction)

  onMount(async () => {
    const params = new URLSearchParams(location.search)
    const code = params.get('code')
    const codeVerifier = sessionStorage.getItem('codeVerifier')
    if (code && codeVerifier) {
      try {
        const tokenData = await getMicrosoftToken(code, codeVerifier)
        await login(tokenData.access_token)
        navigate('/')
      } catch (error) {
        console.error('Authentication error:', error)
      }
    }
  })

  return (
    <Page title="Authenticating">
      <div>Authenticating...</div>
    </Page>
  )
}
