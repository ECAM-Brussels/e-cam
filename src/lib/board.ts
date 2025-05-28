import { getBoardCount } from './slideshow'
import { query, action, reload } from '@solidjs/router'
import { getUser } from '~/lib/auth/session'
import { prisma } from '~/lib/db'

export type Stroke = {
  id?: string
  color: string
  lineWidth: number
  points: [number, number][]
}

async function check(owner: string) {
  const user = await getUser()
  if (!user || (user.email !== owner && user.role !== 'ADMIN')) {
    throw new Error('You do not have the rights to edit that board')
  }
}

export const loadBoard = query(
  async (url: string, ownerEmail: string, name: string): Promise<Stroke[]> => {
    'use server'
    return await prisma.stroke.findMany({ where: { url, ownerEmail, board: name } })
  },
  'loadBoard',
)

export const addStroke = action(
  async (url: string, ownerEmail: string, board: string, stroke: Stroke) => {
    'use server'
    await check(ownerEmail)
    await prisma.stroke.create({
      data: { url, ownerEmail, board, ...stroke },
    })
    const { _count: count } = await prisma.stroke.aggregate({
      where: { url, ownerEmail, board },
      _count: { id: true },
    })
    const revalidate: string[] = [loadBoard.keyFor(url, ownerEmail, board)]
    if (count.id === 1) {
      revalidate.push(getBoardCount.key)
    }
    return reload({ revalidate })
  },
)

export const removeStroke = action(
  async (url: string, ownerEmail: string, board: string, id: string) => {
    'use server'
    await check(ownerEmail)
    await prisma.stroke.delete({ where: { url, board, ownerEmail, id } })
    return reload({ revalidate: loadBoard.keyFor(url, ownerEmail, board) })
  },
)

export const clearBoard = action(async (url: string, ownerEmail: string, board: string) => {
  'use server'
  await check(ownerEmail)
  await prisma.stroke.deleteMany({ where: { url, ownerEmail, board } })
  return reload({ revalidate: loadBoard.keyFor(url, ownerEmail, board) })
})
