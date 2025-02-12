import { getUser } from './auth/session'
import { prisma } from './db'

export const getUserInfo = async (email: string) => {
  'use server'
  const record = await prisma.user.findFirst({ where: { email } })
  const user = await getUser()
  if (!user) {
    throw new Error('You need to be logged in')
  }
  if (!user.admin && user.email != email) {
    throw new Error('You do not have the rights to see this')
  }
  return record
}
