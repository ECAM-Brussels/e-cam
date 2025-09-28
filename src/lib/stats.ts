import { getUser } from './auth/session'
import { query, redirect } from '@solidjs/router'
import { addDays, format, startOfToday, subDays } from 'date-fns'
import { prisma } from '~/lib/db'

export const getStats = query(async () => {
  'use server'
  const user = await getUser()
  if (!user || user.role === 'STUDENT') throw redirect('/auth/login')
  const [users, assignments, userCount, activeUserCount, totalAttempts, correctAttempts, ...info] =
    await Promise.all([
      prisma.user.findMany({ orderBy: { score: 'desc' }, take: 10 }),
      prisma.assignment.findMany({ include: { page: true }, orderBy: { score: 'desc' }, take: 10 }),
      prisma.user.count(),
      prisma.user.count({ where: { attempts: { some: { correct: { not: null } } } } }),
      prisma.attempt.count({ where: { correct: { not: null } } }),
      prisma.attempt.count({ where: { correct: true } }),
      prisma.user.aggregate({
        _avg: { score: true },
      }),
      prisma.assignment.aggregate({
        _avg: { score: true },
      }),
    ])
  return {
    users,
    assignments,
    averages: {
      userScore: info[0]._avg.score,
      assignmentScore: info[1]._avg.score,
    },
    attempts: {
      total: totalAttempts,
      correct: correctAttempts,
    },
    count: {
      users: userCount,
      activeUsers: activeUserCount,
    },
  }
}, 'getStats')

export const getAttemptGraph = query(async () => {
  'use server'
  const user = await getUser()
  if (!user || user.role === 'STUDENT') throw redirect('/auth/login')
  const attempts = await prisma.attempt.findMany({
    where: { correct: { not: null } },
    select: { correct: true, date: true },
  })
  const data: number[] = []
  const correct: number[] = []
  let cumulatedCount = attempts.length
  let correctCount = attempts.filter((a) => a.correct === true).length
  const labels = []
  for (let i = 0; i < 14; i++) {
    const start = subDays(startOfToday(), i)
    const end = addDays(start, 1)
    const dayAttempts = attempts.filter((a) => a.date >= start && a.date <= end)
    const correctAttempts = dayAttempts.filter((a) => a.correct === true)
    labels.unshift(format(start, 'dd/MM'))
    data.unshift(cumulatedCount)
    correct.unshift(correctCount)
    cumulatedCount -= dayAttempts.length
    correctCount -= correctAttempts.length
  }
  return {
    labels,
    datasets: [
      { data, borderColor: 'rgb(255, 99, 132)', label: `Exercices résolus` },
      { data: correct, borderColor: 'rgb(75, 192, 192)', label: `Exercices résolus correctement` },
    ],
  }
}, 'getAttemptGraph')
