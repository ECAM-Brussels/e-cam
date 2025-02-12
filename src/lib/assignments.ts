import { query } from '@solidjs/router'
import { formatDistance } from 'date-fns'
import { type Exercise } from '~/components/ExerciseSequence'
import { getUser } from '~/lib/auth/session'
import { prisma } from '~/lib/db'

export const getUserAssignments = query(async (userEmail: string) => {
  'use server'
  const user = await getUser()
  if (!user || (user.email !== userEmail && !user.admin)) {
    throw new Error("You don't have the required permissions to see this data")
  }
  const records = await prisma.assignment.findMany({
    where: { userEmail },
    include: { page: true },
  })
  return records
    .filter((record) => {
      const exercises = JSON.parse(record.body as string) as Exercise[]
      return exercises.filter((ex) => ex.feedback?.correct !== undefined).length
    })
    .map((record) => {
      const exercises = JSON.parse(record.body as string) as Exercise[]
      const correct = exercises.filter((ex) => ex.feedback?.correct).length
      const total = exercises.filter((ex) => ex.feedback?.correct !== undefined).length
      return {
        url: record.url,
        lastModified: formatDistance(record.lastModified, new Date(), { addSuffix: true }),
        correct,
        title: record.page.title,
        total,
        score: correct / Math.max(total, 1),
      }
    })
}, 'getUserAssignments')
