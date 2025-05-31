import { getBoardCount } from './slideshow'
import { query, action, reload, redirect } from '@solidjs/router'
import { z } from 'zod'
import { getUser } from '~/lib/auth/session'
import { prisma } from '~/lib/db'

async function check<T extends { ownerEmail: string }>(data: T) {
  'use server'
  const user = await getUser()
  if (!user || (user.email !== data.ownerEmail && user.role !== 'ADMIN')) {
    throw redirect('/auth/login')
  }
  return data
}

const strokeSchema = z.object({
  id: z.string().optional(),
  color: z.string(),
  lineWidth: z.number(),
  points: z.tuple([z.number(), z.number()]).array(),
})
const boardSchema = z.object({
  url: z.string(),
  ownerEmail: z.string().email(),
  board: z.string(),
})
const writeBoard = boardSchema.transform(check)

export type Stroke = z.infer<typeof strokeSchema>
export type Board = z.input<typeof boardSchema>

export const loadBoard = query(async (board: Board) => {
  'use server'
  const where = await boardSchema.parseAsync(board)
  const data = await prisma.stroke.findMany({ where })
  return data
}, 'loadBoard')

export const addStroke = action(async (board: Board, stroke: Stroke) => {
  'use server'
  const where = await writeBoard.parseAsync(board)
  stroke = strokeSchema.parse(stroke)
  await prisma.stroke.create({ data: { ...where, ...stroke } })
  const { _count: count } = await prisma.stroke.aggregate({ where, _count: { id: true } })
  const revalidate: string[] = [loadBoard.keyFor(where)]
  if (count.id === 1) {
    revalidate.push(getBoardCount.key)
  }
  return reload({ revalidate })
})

export const removeStroke = action(async (board: Board, id: string) => {
  'use server'
  board = await writeBoard.parseAsync(board)
  await prisma.stroke.delete({ where: { ...board, id: String(id) } })
  return reload({ revalidate: loadBoard.keyFor(board) })
})

export const clearBoard = action(async (board: Board) => {
  'use server'
  const where = await writeBoard.parseAsync(board)
  await prisma.stroke.deleteMany({ where })
  return reload({ revalidate: loadBoard.keyFor(where) })
})
