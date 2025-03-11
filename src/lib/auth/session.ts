import { action, query } from '@solidjs/router'
import { useSession } from 'vinxi/http'
import { prisma } from '~/lib/db'

type SessionData = {
  email?: string
  state?: string
  codeVerifier?: string
}

export function getSession() {
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

export const saveAuthState = async (state: string, codeVerifier: string) => {
  'use server'
  const session = await getSession()
  await session.update((data: SessionData) => {
    data = { ...data, state, codeVerifier }
    return data
  })
}

export const logout = action(async () => {
  'use server'
  const session = await getSession()
  await session.clear()
})
