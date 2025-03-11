import { action, query, redirect } from '@solidjs/router'
import { decodeIdToken, generateCodeVerifier, generateState } from 'arctic'
import { useSession } from 'vinxi/http'
import { z } from 'zod'
import { entra } from '~/lib/auth/azure'
import { prisma } from '~/lib/db'

type SessionData = {
  email: string
}

function getSession() {
  'use server'
  return useSession<SessionData>({
    password: import.meta.env.VITE_SESSION_SECRET,
  })
}

export const getUser = query(async () => {
  'use server'
  try {
    const session = await getSession()
    if (!session.data.email) {
      return null
    }
    return await prisma.user.findUniqueOrThrow({
      where: { email: session.data.email },
    })
  } catch {
    return null
  }
}, 'getUser')

export const startLogin = action(async () => {
  const state = generateState()
  const codeVerifier = generateCodeVerifier()
  const url = entra.createAuthorizationURL(state, codeVerifier, ['openid', 'profile', 'email'])
  sessionStorage.setItem('state', state)
  sessionStorage.setItem('codeVerifier', codeVerifier)
  throw redirect(url.toString())
}, 'startLogin')

const profileSchema = z.object({
  email: z.string().email(),
  given_name: z.string(),
  family_name: z.string(),
})

export const login = action(async (idToken, accessToken: string) => {
  'use server'
  const session = await getSession()
  const userInfo = profileSchema.parse({ ...decodeIdToken(idToken), ...decodeIdToken(accessToken) })
  if (userInfo) {
    await prisma.user.upsert({
      where: { email: userInfo.email },
      update: {},
      create: {
        admin: /^[a-zA-Z][a-zA-Z0-9]{2}@/.test(userInfo.email),
        email: userInfo.email,
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
      },
    })
    await session.update((data: SessionData) => {
      data.email = userInfo.email
      return data
    })
  }
})

export const logout = action(async () => {
  'use server'
  const session = await getSession()
  await session.clear()
})
