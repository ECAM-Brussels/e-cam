async function sha256(plain: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return base64urlencode(hash)
}

function base64urlencode(buffer: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export async function generatePKCE() {
  const codeVerifier = base64urlencode(crypto.getRandomValues(new Uint8Array(32)).buffer)
  const codeChallenge = await sha256(codeVerifier)
  return { codeVerifier, codeChallenge }
}

export async function getMicrosoftToken(code: string, codeVerifier: string) {
  const response = await fetch(
    `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}/oauth2/v2.0/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: import.meta.env.VITE_AZURE_CLIENT_ID,
        scope: 'openid profile email',
        code,
        redirect_uri: import.meta.env.VITE_AZURE_REDIRECT_URI,
        grant_type: 'authorization_code',
        code_verifier: codeVerifier,
      }).toString(),
    },
  )

  if (!response.ok) {
    throw new Error('Failed to fetch token')
  }

  return response.json()
}

export async function getUserInfo(accessToken: string) {
  'use server'
  const response = await fetch(`https://graph.microsoft.com/oidc/userinfo`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user info')
  }

  return response.json()
}
