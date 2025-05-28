import { getBoardCount } from './slideshow'
import { query, action, reload } from '@solidjs/router'
import { z } from 'zod'
import { getUser } from '~/lib/auth/session'
import { prisma } from '~/lib/db'

const owner = z
  .string()
  .email()
  .transform(async (owner) => {
    const user = await getUser()
    if (!user || (user.email !== owner && user.role !== 'ADMIN')) {
      throw new Error('You do not have the rights to edit that board')
    }
    return owner
  })
const stroke = z.object({
  id: z.string().optional(),
  color: z.string(),
  lineWidth: z.number(),
  points: z.tuple([z.number(), z.number()]).array(),
})
export type Stroke = z.infer<typeof stroke>

const loadBoardInput = z.tuple([z.string(), z.string().email(), z.string()])
export const loadBoard = query(async (...params: z.input<typeof loadBoardInput>) => {
  'use server'
  const [url, ownerEmail, board] = loadBoardInput.parse(params)
  return await prisma.stroke.findMany({ where: { url, ownerEmail, board } })
}, 'loadBoard')

const addStrokeInput = z.tuple([z.string(), owner, z.string(), stroke])
export const addStroke = action(async (...params: z.input<typeof addStrokeInput>) => {
  'use server'
  const [url, ownerEmail, board, stroke] = await addStrokeInput.parseAsync(params)
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
})

const removeStrokeInput = z.tuple([z.string(), owner, z.string(), z.string()])
export const removeStroke = action(async (...params: z.input<typeof removeStrokeInput>) => {
  'use server'
  const [url, ownerEmail, board, id] = await removeStrokeInput.parseAsync(params)
  await prisma.stroke.delete({ where: { url, board, ownerEmail, id } })
  return reload({ revalidate: loadBoard.keyFor(url, ownerEmail, board) })
})

const clearBoardInput = z.tuple([z.string(), owner, z.string()])
export const clearBoard = action(async (...params: z.input<typeof clearBoardInput>) => {
  'use server'
  const [url, ownerEmail, board] = await clearBoardInput.parseAsync(params)
  await prisma.stroke.deleteMany({ where: { url, ownerEmail, board } })
  return reload({ revalidate: loadBoard.keyFor(url, ownerEmail, board) })
})
