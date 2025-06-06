import { getUser } from './auth/session'
import { prisma } from './db'
import { query, redirect } from '@solidjs/router'

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
