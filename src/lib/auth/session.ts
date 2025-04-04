import { action, query, redirect, reload } from '@solidjs/router'
import { useSession } from 'vinxi/http'
import { loadAssignment } from '~/components/ExerciseSequence.server'
import { generatePKCE, getUserInfo } from '~/lib/auth/azure'
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
  const { codeVerifier, codeChallenge } = await generatePKCE()
  sessionStorage.setItem('codeVerifier', codeVerifier)
  throw redirect(
    `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}` +
      `/oauth2/v2.0/authorize?client_id=${import.meta.env.VITE_AZURE_CLIENT_ID}&response_type=code` +
      `&redirect_uri=${import.meta.env.VITE_AZURE_REDIRECT_URI}&response_mode=query&scope=openid profile email` +
      `&code_challenge=${codeChallenge}&code_challenge_method=S256`,
  )
}, 'startLogin')

export const login = action(async (token: string) => {
  'use server'
  const session = await getSession()
  const userInfo = await getUserInfo(token)
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
