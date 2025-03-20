import { getUser } from '../auth/session'
import { prisma } from '../db'
import { query } from '@solidjs/router'
import CryptoJS from 'crypto-js'
import { lazy } from 'solid-js'
import { z } from 'zod'
import { schema as FactorSchema } from '~/exercises/Math/Factor'
import { schema as SimpleSchema } from '~/exercises/Math/Simple'

export const exercises = {
  Factor: lazy(() => import('~/exercises/Math/Factor')),
  Simple: lazy(() => import('~/exercises/Math/Simple')),
} as const

export const exerciseSchema = z.union([FactorSchema, SimpleSchema])
export type Exercise = z.infer<typeof exerciseSchema>

export const assignmentSchema = z.object({
  url: z.string(),
  userEmail: z.string().email(),
  id: z.string().optional().default(''),
  lastModified: z.string().transform((str) => new Date(str)),
  body: z.union([
    exerciseSchema.array(),
    z.string().transform((str) => exerciseSchema.array().parse(JSON.parse(String(str)))),
  ]),
})
export const fullAssignmentSchema = assignmentSchema.extend({
  title: z.string().default(''),
  description: z.string().optional(),
  streak: z.number().default(0),
  mode: z.literal('static').or(z.literal('dynamic')).default('static'),
  whiteboard: z.boolean().default(true),
})

export type Assignment = z.infer<typeof assignmentSchema>
export type AssignmentProps = z.infer<typeof fullAssignmentSchema>
type PK = Pick<Assignment, 'url' | 'id' | 'userEmail'>

async function check(key: PK) {
  'use server'
  const user = await getUser()
  if (!user || (!user.admin && user.email !== key.userEmail)) {
    throw new Error('Not Authorized')
  }
}

export const getAssignmentBody = query(
  async (key: PK, mode: 'static' | 'dynamic', streak: number, initialBody: Exercise[]) => {
    'use server'
    await check(key)
    const record = await prisma.assignment.findUnique({
      where: { url_userEmail_id: key },
      select: { body: true },
    })
    let result: Exercise[] = record ? (record.body as unknown as Exercise[]) : []
    if (mode === 'static') {
      result = result.length ? result : initialBody
    } else if (mode === 'dynamic') {
      let [dynamicId, currentStreak] = [0, 0]
      for (const exercise of result) {
        if (exercise.feedback?.correct === true) {
          currentStreak++
          if (currentStreak === streak) {
            dynamicId++
            currentStreak = 0
          }
        } else {
          currentStreak = 0
        }
      }
      if (!result || result[result.length - 1].feedback) {
        result = [...result, initialBody[dynamicId]]
      }
    }
    if (!record) {
      await saveAssignment(key, result)
    }
    return await exerciseSchema.array().parseAsync(result)
  },
  'getAssignmentBody',
)

export async function saveAssignment(key: PK, body: Exercise[]) {
  'use server'
  await check(key)
  body = await assignmentSchema.shape.body.parseAsync(body)
  await prisma.assignment.upsert({
    where: { url_userEmail_id: key },
    create: { ...key, body, lastModified: new Date() },
    update: { body, lastModified: new Date() },
  })
}

export async function saveExercise(key: PK, pos: number, exercise: Exercise) {
  'use server'
  await check(key)
  const record = await prisma.assignment.findUniqueOrThrow({
    select: { body: true, lastModified: true },
    where: { url_userEmail_id: key },
  })
  const body = record.body as unknown as Exercise[]
  body[pos] = await exerciseSchema.parseAsync(exercise)
  await prisma.assignment.update({
    where: { url_userEmail_id: key, lastModified: record.lastModified },
    data: { body, lastModified: new Date() },
  })
}

export const original = fullAssignmentSchema.omit({ userEmail: true, lastModified: true })

export const registerAssignment = query(async (assignment: z.input<typeof original>) => {
  'use server'
  let page = await prisma.page.findUnique({ where: { url: assignment.url } })
  let hash = CryptoJS.SHA256(JSON.stringify(assignment)).toString()
  if (!page || !page.body || page.hash !== hash) {
    const payload = {
      title: assignment.title || '',
      body: await original.parseAsync(assignment),
      hash,
    }
    page = await prisma.page.upsert({
      where: { url: assignment.url },
      create: { url: assignment.url, ...payload },
      update: payload,
    })
    await prisma.assignment.deleteMany({
      where: { url: assignment.url, id: assignment.id },
    })
  }
  return page.body as unknown as z.infer<typeof original>
}, 'registerAssignment')
