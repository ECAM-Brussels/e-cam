import { getUser } from './auth/session'
import { query, redirect } from '@solidjs/router'
import { prisma } from '~/lib/db'

export const getStats = query(async () => {
  'use server'
  const user = await getUser()
  if (!user || user.role === 'STUDENT') throw redirect('/auth/login')
  const [users, assignments, userCount, totalAttempts, correctAttempts, ...info] =
    await Promise.all([
      prisma.user.findMany({ orderBy: { score: 'desc' }, take: 10 }),
      prisma.assignment.findMany({ include: { page: true }, orderBy: { score: 'desc' }, take: 10 }),
      prisma.user.count(),
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
    userCount,
    assignments,
    averages: {
      userScore: info[0]._avg.score,
      assignmentScore: info[1]._avg.score,
    },
    attempts: {
      total: totalAttempts,
      correct: correctAttempts,
    },
  }
}, 'getStats')
