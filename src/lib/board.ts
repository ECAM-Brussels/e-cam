import {
  query,
  action,
  redirect,
  useSubmissions,
  createAsyncStore,
  useAction,
  json,
} from '@solidjs/router'
import { createMemo } from 'solid-js'
import { z } from 'zod'
import { getUser } from '~/lib/auth/session'
import { prisma } from '~/lib/db'
import { hashObject } from '~/lib/helpers'
import { getBoardCount } from '~/lib/slideshow'

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

export const reloadBoard = action(async (board: Board) => {
  'use server'
  return json(null, { revalidate: loadBoard.keyFor(board) })
})

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
  return json(null, { revalidate: loadBoard.keyFor(board) })
})

export const removeStroke = action(async (board: Board, id: string) => {
  'use server'
  board = await writeBoard.parseAsync(board)
  await prisma.stroke.delete({ where: { ...board, id: String(id) } })
  return json(null, { revalidate: loadBoard.keyFor(board) })
})

export const clearBoard = action(async (board: Board) => {
  'use server'
  const where = await writeBoard.parseAsync(board)
  await prisma.stroke.deleteMany({ where })
  return json(null, { revalidate: loadBoard.keyFor(where) })
})

export default function useBoard(board: () => Board) {
  const filter =
    () =>
    ([b]: [Board]) =>
      hashObject(b) === hashObject(board())
  const adding = useSubmissions(addStroke, filter())
  const removing = useSubmissions(removeStroke, filter())
  const clearing = useSubmissions(clearBoard, filter())
  const strokes = createAsyncStore(() => loadBoard(board()), { initialValue: [] })
  const allStrokes = createMemo(() => {
    if (clearing.pending) {
      return []
    }
    const beingAdded = Array.from(adding.entries()).map(([_, data]) => data.input[1])
    const beingRemoved = Array.from(removing.entries()).map(([_, data]) => data.input[1])
    const seen = new Set<string>()
    return [...strokes(), ...beingAdded].filter((s) => {
      const key = JSON.stringify(s.points)
      if (seen.has(key) || (s.id && beingRemoved.includes(s.id))) {
        return false
      }
      seen.add(key)
      return true
    })
  })
  const addStrokeMethod = useAction(addStroke)
  const removeStrokeMethod = useAction(removeStroke)
  const clearBoardMethod = useAction(clearBoard)
  const reloadBoardMethod = useAction(reloadBoard)
  const bounds: Record<string, number[]> = {}
  return {
    get strokes() {
      return allStrokes()
    },
    get status() {
      return adding.pending || removing.pending || clearing.pending
        ? ('saving' as const)
        : ('saved' as const)
    },
    getBounds({ id, ...data }: Stroke) {
      const hash = hashObject(data)
      if (hash in bounds) {
        return bounds[hash]
      }
      let box = [Infinity, Infinity, -Infinity, -Infinity]
      for (const [x, y] of data.points) {
        box[0] = Math.min(box[0], x)
        box[1] = Math.min(box[0], y)
        box[2] = Math.max(box[0], x)
        box[3] = Math.max(box[0], y)
      }
      bounds[hash] = box
      return box
    },
    addStroke(stroke: Stroke) {
      return addStrokeMethod(board(), stroke)
    },
    removeStroke(id: string) {
      return removeStrokeMethod(board(), id)
    },
    clearBoard() {
      return clearBoardMethod(board())
    },
    reload() {
      return reloadBoardMethod(board())
    },
  }
}
