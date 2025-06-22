import { query } from '@solidjs/router'
import { addDays, format, startOfToday, subDays } from 'date-fns'
import { getUser } from '~/lib/auth/session'
import { prisma } from '~/lib/db'
import { getUserInfo } from '~/lib/user'

function logistic(x: number) {
  return 1 / (1 + Math.pow(10, -x / 400))
}

const K = 32

export const getEloDiff = query(async (email?: string) => {
  'use server'
  if (!email) {
    const user = await getUser()
    if (!user) {
      return 0
    }
    email = user.email
  }
  const data = await prisma.attempt.findFirst({
    where: { email, gain: { not: 0 } },
    select: { gain: true },
    orderBy: { date: 'desc' },
  })
  return data?.gain ?? 0
}, 'getEloDiff')

export async function getEloGain(email: string, hash: string, correct: boolean) {
  'use server'
  const [user, exercise] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { email }, select: { score: true } }),
    prisma.question.findUniqueOrThrow({ where: { hash }, select: { score: true } }),
  ])
  return Math.round(K * ((correct ? 1 : 0) - logistic(user.score - exercise.score)))
}

export const getEloGraph = query(async (email?: string) => {
  'use server'
  if (!email) {
    const user = await getUser()
    if (!user) {
      throw new Error('Hello')
    }
    email = user.email
  }
  const user = await getUserInfo(email)
  const attempts = await prisma.attempt.findMany({
    where: {
      email,
      gain: { not: null },
    },
    select: { gain: true, date: true },
    orderBy: { date: 'desc' },
  })
  let score = user?.score ?? 1500
  const data: number[] = []
  const labels = []
  for (let i = 0; i < 14; i++) {
    const start = subDays(startOfToday(), i)
    const end = addDays(start, 1)
    const dayAttempts = attempts.filter((a) => a.date >= start && a.date <= end)
    const dayGain = dayAttempts.reduce((partial, attempt) => partial + attempt.gain!, 0)
    labels.unshift(format(start, 'dd/MM'))
    data.unshift(score)
    score = score - dayGain
  }
  return {
    labels,
    datasets: [
      { data, borderColor: 'rgb(75, 192, 192)', label: `${user?.firstName} ${user?.lastName}` },
    ],
  }
}, 'getEloGraph')
