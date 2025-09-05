import { extractFormData } from '../form'
import { getLoginUrl } from './azure'
import { action, json, query, redirect } from '@solidjs/router'
import { useSession } from 'vinxi/http'
import { z } from 'zod'
import { prisma } from '~/lib/db'

const preferencesSchema = z.object({
  ecam: z.coerce.boolean().default(false),
})

type SessionData = {
  email?: string
  state?: string
  codeVerifier?: string
  preferences?: z.infer<typeof preferencesSchema>
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
  await session.update({ state, codeVerifier })
}

export const startLogin = action(async () => {
  'use server'
  throw redirect(await getLoginUrl())
})

export const logout = action(async (form: FormData) => {
  'use server'
  const data = extractFormData(form)
  const session = await getSession()
  await session.update({ email: undefined })
  if (data.currentUrl) {
    throw redirect(String(data.currentUrl))
  }
})

export const getPreferences = query(async () => {
  'use server'
  const session = await getSession()
  const preferences = preferencesSchema.parse(session.data.preferences ?? {})
  return preferences
}, 'getPreferences')

export const setPreferences = action(
  async (payload: Partial<z.infer<typeof preferencesSchema>>, form: FormData) => {
    'use server'
    const session = await getSession()
    const data = extractFormData(form)
    await session.update({
      preferences: preferencesSchema.parse({ ...session.data.preferences, ...payload, ...data }),
    })
    return json(null, { revalidate: getPreferences.key })
  },
)
