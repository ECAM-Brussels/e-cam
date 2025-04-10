import { getUser } from '../auth/session'
import { prisma } from '../db'
import { query } from '@solidjs/router'
import CryptoJS from 'crypto-js'
import { lazy } from 'solid-js'
import { z } from 'zod'
import { schema as PythonSchema } from '~/exercises/CompSci/Python'
import { schema as FactorSchema } from '~/exercises/Math/Factor'
import { schema as SimpleSchema } from '~/exercises/Math/Simple'

export const exercises = {
  Python: lazy(() => import('~/exercises/CompSci/Python')),
  Factor: lazy(() => import('~/exercises/Math/Factor')),
  Simple: lazy(() => import('~/exercises/Math/Simple')),
} as const

export const exerciseSchema = z.union([PythonSchema, FactorSchema, SimpleSchema])
export type Exercise = z.infer<typeof exerciseSchema>

export const assignmentSchema = z.object({
  url: z.string(),
  userEmail: z.string().email().optional(),
  id: z.string().default(''),
  lastModified: z
    .string()
    .or(z.date())
    .default(new Date())
    .transform((str) => new Date(str)),
  body: exerciseSchema.array().default([]),
  next: exerciseSchema.array().default([]),
  title: z.string().default(''),
  description: z.string().optional(),
  streak: z.number().default(0),
  mode: z.literal('static').or(z.literal('dynamic')).default('static'),
  whiteboard: z.boolean().default(true),
  maxAttempts: z.null().or(z.number()).default(1),
})
export const original = assignmentSchema.omit({ userEmail: true, lastModified: true })
export type OriginalAssignment = z.infer<typeof original>

export type Assignment = z.infer<typeof assignmentSchema>
type PK = Pick<Assignment, 'url' | 'id' | 'userEmail'> & { userEmail: string }

async function check(key: PK) {
  'use server'
  const user = await getUser()
  if (!user || (!user.admin && user.email !== key.userEmail)) {
    throw new Error('Not Authorized')
  }
}

export const getAssignment = query(async (key: PK) => {
  'use server'
  await check(key)
  const page = await prisma.page.findUniqueOrThrow({ where: { url: key.url } })
  const originalAssignment = page.body as unknown as z.infer<typeof original>
  const record = await prisma.assignment.findUnique({
    where: { url_userEmail_id: key },
    select: { body: true, lastModified: true },
  })
  let body: Exercise[] = record ? (record.body as unknown as Exercise[]) : []
  body = extendAssignment(body, originalAssignment)
  if (!record) {
    await prisma.assignment.upsert({
      where: { url_userEmail_id: key },
      create: { ...key, body, lastModified: new Date() },
      update: { body, lastModified: new Date() },
    })
  }
  return {
    ...originalAssignment,
    lastModified: record?.lastModified ?? new Date(),
    body,
  } as Assignment
}, 'getAssignment')

export function extendAssignment(body: Exercise[], originalAssignment: z.infer<typeof original>) {
  if (originalAssignment.mode === 'static') {
    body = body.length ? body : originalAssignment.body
  } else if (originalAssignment.mode === 'dynamic') {
    let [dynamicId, currentStreak] = [0, 0]
    for (const exercise of body) {
      if (exercise.attempts.at(-1)?.correct) {
        currentStreak++
        if (currentStreak === originalAssignment.streak) {
          dynamicId++
          currentStreak = 0
        }
      } else {
        currentStreak = 0
      }
    }
    const lastFullyAttempted = body.at(-1)?.attempts.length === body.at(-1)?.maxAttempts
    const lastIsCorrect = body.at(-1)?.attempts.at(-1)?.correct
    if (!body || lastFullyAttempted || lastIsCorrect) {
      body = [...body, originalAssignment.body[dynamicId]]
    }
  }
  return body
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

export const registerAssignment = async (assignment: z.input<typeof original>) => {
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
}
