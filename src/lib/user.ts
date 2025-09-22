import { getUser } from './auth/session'
import { prisma } from './db'
import { extractFormData } from './form'
import { action, query, redirect } from '@solidjs/router'
import z from 'zod'

export const getUserInfo = query(async (email?: string) => {
  'use server'
  if (!email) {
    return getUser()
  }
  const [record, user] = await Promise.all([
    prisma.user.findUnique({ where: { email } }),
    getUser(),
  ])
  if (!user) {
    throw redirect('/auth/login')
  }
  if (user.role === 'STUDENT' && user.email != email) {
    throw new Error('You do not have the rights to see this')
  }
  return record
}, 'getUserInfo')

export const getUsers = query(async () => {
  'use server'
  const [users, user] = await Promise.all([prisma.user.findMany(), getUser()])
  if (!user || user.role === 'STUDENT') return []
  return users
}, 'getUsers')

export const viewProfile = action(async (form: FormData) => {
  'use server'
  const schema = z.object({
    email: z.string().email(),
    path: z.string().default(''),
  })
  const { email, path } = schema.parse(extractFormData(form))
  const user = await getUser()
  if (user && user.role !== 'STUDENT') {
    throw redirect(`/users/${email}/${path}`)
  }
})
