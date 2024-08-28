import { action, cache, reload } from '@solidjs/router'
import { useSession } from 'vinxi/http'
import { loadAssignment } from '~/components/ExerciseSequence'
import { getUserInfo } from '~/lib/auth/azure'
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

export const getUser = cache(async () => {
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

export const login = action(async (token: string) => {
  'use server'
  const session = await getSession()
  const userInfo = await getUserInfo(token)
  if (userInfo) {
    await prisma.user.upsert({
      where: { email: userInfo.email },
      update: {},
      create: {
        email: userInfo.email,
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
      },
    })
    await session.update((data: SessionData) => {
      data.email = userInfo.email
      return data
    })
    reload({ revalidate: [getUser.key, loadAssignment.key] })
  }
})

export const logout = action(async () => {
  'use server'
  const session = await getSession()
  await session.clear()
  reload({ revalidate: [getUser.key, loadAssignment.key] })
})
