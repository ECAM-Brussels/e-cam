'use server'

import { useSession } from 'vinxi/http'
import { getUserInfo } from '~/lib/auth/azure'

type SessionData = {
  email?: string
  name?: string
}

function getSession() {
  return useSession<SessionData>({
    password: import.meta.env.VITE_SESSION_SECRET,
  })
}

export async function getUser(): Promise<SessionData | null> {
  const session = await getSession()
  return session.data
}

export async function login(token: string) {
  const session = await getSession()
  const userInfo = await getUserInfo(token)
  if (userInfo) {
    await session.update(function (data: SessionData) {
      data.email = userInfo.email
      data.name = userInfo.name
      return data
    })
  }
}

export async function logout() {
  const session = await getSession()
  await session.clear()
}
