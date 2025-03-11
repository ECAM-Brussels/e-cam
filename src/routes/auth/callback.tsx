import { type APIEvent } from '@solidjs/start/server'
import { decodeIdToken } from 'arctic'
import { z } from 'zod'
import { entra } from '~/lib/auth/azure'
import { getSession } from '~/lib/auth/session'
import { prisma } from '~/lib/db'

const profileSchema = z.object({
  email: z.string().email(),
  given_name: z.string(),
  family_name: z.string(),
})

export async function GET(event: APIEvent) {
  const session = await getSession()
  const url = new URL(event.request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const { state: storedState, codeVerifier } = session.data
  if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
    return new Response(null, { status: 400 })
  }
  const tokens = await entra.validateAuthorizationCode(code, codeVerifier)
  const userInfo = profileSchema.parse({
    ...decodeIdToken(tokens.idToken()),
    ...decodeIdToken(tokens.accessToken()),
  })
  if (!userInfo) {
    return new Response(null, { status: 400 })
  }
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
  await session.update({
    codeVerifier: undefined,
    state: undefined,
    email: userInfo.email,
  })
  return new Response(null, {
    status: 302,
    headers: { Location: '/' },
  })
}
