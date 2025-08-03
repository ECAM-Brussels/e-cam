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
