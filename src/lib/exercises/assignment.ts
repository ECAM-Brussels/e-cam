import { getUser } from '../auth/session'
import { prisma } from '../db'
import { schema as FactorSchema } from './example'
import { query } from '@solidjs/router'
import { lazy } from 'solid-js'
import { z } from 'zod'
import { schema as SimpleSchema } from '~/exercises/Math/Simple'

export const exercises = {
  Factor: lazy(() => import('./example')),
  Simple: lazy(() => import('~/exercises/Math/Simple')),
} as const

export const exerciseSchema = z.union([FactorSchema, SimpleSchema])
export type Exercise = z.infer<typeof exerciseSchema>

export const assignmentSchema = z.object({
  url: z.string(),
  userEmail: z.string().email(),
  id: z.string().optional().default(''),
  lastModified: z.date().optional().default(new Date()),
  body: z.union([
    exerciseSchema.array(),
    z.string().transform((str) => exerciseSchema.array().parse(JSON.parse(String(str)))),
  ]),
})
export const fullAssignmentSchema = assignmentSchema.extend({
  title: z.string().optional(),
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
    check(key)
    const record = await prisma.assignment.findUnique({
      where: { url_userEmail_id: key },
      select: { body: true },
    })
    let result: Exercise[] = record ? exerciseSchema.array().parse(record.body) : []
    if (mode === 'static') {
      result = result || initialBody
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
    return exerciseSchema.array().parse(result)
  },
  'getAssignmentBody',
)

export async function saveAssignment(key: PK, body: Exercise[]) {
  'use server'
  check(key)
  body = assignmentSchema.shape.body.parse(body)
  await prisma.assignment.upsert({
    where: { url_userEmail_id: key },
    create: { ...key, body, lastModified: new Date() },
    update: { body, lastModified: new Date() },
  })
}

export async function saveExercise(key: PK, pos: number, exercise: Exercise) {
  'use server'
  check(key)
  const record = await prisma.assignment.findUniqueOrThrow({
    select: { body: true, lastModified: true },
    where: { url_userEmail_id: key },
  })
  const body = assignmentSchema.shape.body.parse(record.body)
  body[pos] = exerciseSchema.parse(exercise)
  await prisma.assignment.update({
    where: { url_userEmail_id: key, lastModified: record.lastModified },
    data: { body, lastModified: new Date() },
  })
}
