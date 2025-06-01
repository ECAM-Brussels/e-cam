import { query } from '@solidjs/router'
import { prisma } from '~/lib/db'

export const getUserAttempts = query(async (email: string) => {
  'use server'
  const data = await prisma.attempt.findMany({
    where: { email, correct: { not: null } },
    orderBy: { date: 'desc' },
    include: { question: true, assignment: { include: { page: true } } },
  })
  return data
}, 'getUserAttempts')
