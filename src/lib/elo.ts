import { query } from '@solidjs/router'
import { addDays, format, startOfToday, subDays } from 'date-fns'
import { getUser } from '~/lib/auth/session'
import { prisma } from '~/lib/db'
import { getUserInfo } from '~/lib/user'

function logistic(x: number) {
  return 1 / (1 + Math.pow(10, -x / 400))
}

const K = 32

export const getEloDiff = query(async (url: string, email: string, position: number) => {
  'use server'
  if (!email) {
    const user = await getUser()
    if (!user) {
      return 0
    }
    email = user.email
  }
  const data = await prisma.attempt.findUnique({
    where: { url_email_position: { url, email, position } },
    select: { gain: true },
  })
  return data?.gain ?? 0
}, 'getEloDiff')

export async function getEloGain(email: string, url: string, correct: boolean, correction = 0) {
  'use server'
  const [user, assignment] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { email }, select: { score: true } }),
    prisma.assignment.findUniqueOrThrow({ where: { url }, select: { score: true } }),
  ])
  return Math.round(
    K *
      ((correct ? 1 : 0) -
        logistic(
          user.score + correction - ((assignment.score ?? 1200) - Math.ceil(correction / 8)),
        )),
  )
}

export const getEloGraph = query(async (email?: string) => {
  'use server'
  if (!email) {
    const user = await getUser()
    if (!user) {
      throw new Error("Vous n'êtes pas connecté")
    }
    email = user.email
  }
  const user = await getUserInfo(email)
  const attempts = await prisma.attempt.findMany({
    where: { email, gain: { not: null } },
    select: { gain: true, date: true },
  })
  let score = user?.score ?? 800
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

export const getAssignmentEloGraph = query(async (url: string) => {
  'use server'
  const user = await getUser()
  const assignment = await prisma.assignment.findUniqueOrThrow({
    where: { url },
    select: { score: true, page: true },
  })
  if (!user || user.role === 'STUDENT') {
    throw new Error("Vous n'avez pas les droits suffisants pour voir cette ressource.")
  }
  const attempts = await prisma.attempt.findMany({
    where: { url, gain: { not: null } },
    select: { gain: true, date: true },
  })
  let score = assignment.score ?? 1600
  const data: number[] = []
  const labels = []
  for (let i = 0; i < 14; i++) {
    const start = subDays(startOfToday(), i)
    const end = addDays(start, 1)
    const dayAttempts = attempts.filter((a) => a.date >= start && a.date <= end)
    const dayGain = dayAttempts.reduce((partial, attempt) => partial - attempt.gain! / 8, 0)
    labels.unshift(format(start, 'dd/MM'))
    data.unshift(Math.round(score))
    score = score - dayGain
  }
  return {
    labels,
    datasets: [{ data, borderColor: 'rgb(75, 192, 192)', label: assignment.page.title }],
  }
}, 'getAssignmentEloGraph')
