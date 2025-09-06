import { getUser } from './auth/session'
import { prisma } from './db'
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
  if (user.role !== 'ADMIN' && user.email != email) {
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

export const viewProfise = action(async (email: string) => {
  'use server'
  email = z.string().email().parse(email)
  const user = await getUser()
  if (user && user.role !== 'STUDENT') {
    throw redirect(`/users/${email}`)
  }
})
