import { query } from '@solidjs/router'
import { prisma } from '~/lib/db'

export const getBoardCount = query(
  async (url: string, ownerEmail: string, board: string, slide: number) => {
    'use server'
    const data = await prisma.stroke.groupBy({
      where: { url, ownerEmail, board: { startsWith: `${board}-${slide}-` } },
      by: ['board'],
    })
    return data.length
  },
  'getBoardCount',
)

export const getBoardCounts = query(async (url: string, ownerEmail: string, board: string) => {
  'use server'
  const data = await prisma.stroke.groupBy({
    where: { url, ownerEmail, board: { startsWith: `${board}-` } },
    by: ['board'],
  })
  const results: { [i: number]: number } = {}
  for (const { board } of data) {
    const [i, j] = board.split('-').slice(-2).map(Number)
    results[i] = Math.max(j, results[i] ?? -1)
  }
  return results
}, 'getBoardCounts')
