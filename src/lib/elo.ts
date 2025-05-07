import { getUser } from './auth/session'
import { prisma } from './db'
import { query } from '@solidjs/router'

function logistic(x: number) {
  return 1 / (1 + Math.pow(10, -x / 400))
}

const K = 32

export const getEloDiff = query(async (email?: string) => {
  'use server'
  if (!email) {
    const user = await getUser()
    if (!user) {
      return null
    }
    email = user.email
  }
  const data = await prisma.attempt.findFirst({
    where: { email, gain: { not: 0 } },
    select: { gain: true },
    orderBy: { date: 'desc' },
  })
  return data?.gain ?? null
}, 'getEloDiff')

export async function getEloGain(email: string, hash: string, correct: boolean) {
  'use server'
  const [user, exercise] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { email }, select: { score: true } }),
    prisma.exercise.findUniqueOrThrow({ where: { hash }, select: { score: true } }),
  ])
  return Math.round(K * ((correct ? 1 : 0) - logistic(user.score - exercise.score)))
}
