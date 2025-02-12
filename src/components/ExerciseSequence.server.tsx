import { query } from '@solidjs/router'
import { type Exercise } from '~/components/ExerciseSequence'
import { getUser } from '~/lib/auth/session'
import { prisma } from '~/lib/db'

export const loadAssignment = query(
  async (url: string, id: string = '', userEmail: string = '') => {
    'use server'
    const user = await getUser()
    if (!user || !user.email) {
      return null
    }
    if (!userEmail || !user.admin) {
      userEmail = user.email
    }
    const record = await prisma.assignment.findUnique({
      where: { url_userEmail_id: { url, userEmail, id } },
    })
    if (!record) {
      return null
    }
    return { ...record, body: JSON.parse(String(record.body)) as Exercise[] }
  },
  'loadAssignment',
)

export async function deleteAssignment(
  url: string,
  id: string,
  userEmail: string = '',
) {
  'use server'
  const user = await getUser()
  if (!userEmail) {
    userEmail = user?.email || ''
  }
  if (!user || !user.email || (!user.admin && user.email !== userEmail)) {
    throw new Error('Not Authorized')
  }
  await prisma.assignment.delete({
    where: {url_userEmail_id: {url, userEmail, id}}
  })
}

export async function upsertAssignment(
  url: string,
  id: string,
  userEmail: string = '',
  data: Exercise[],
  date: Date,
  finished: boolean = false
) {
  'use server'
  const user = await getUser()
  if (!user || !user.email) {
    throw new Error('Error when upserting assignment: user not logged in')
  }
  if (!userEmail || !user.admin) {
    userEmail = user.email
  }
  let body = JSON.stringify(data)
  await prisma.assignment.upsert({
    where: { url_userEmail_id: { url, userEmail, id } },
    update: { body, lastModified: date },
    create: { url, userEmail, id, body, finished },
  })
}
