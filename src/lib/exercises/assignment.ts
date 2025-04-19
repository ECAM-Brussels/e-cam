import { getUser } from '../auth/session'
import { prisma } from '../db'
import { optionsSchema } from './schemas'
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

export const exerciseSchema = z.discriminatedUnion('type', [
  PythonSchema,
  FactorSchema,
  SimpleSchema,
])
export type Exercise = z.infer<typeof exerciseSchema>

export const assignmentSchema = z.object({
  url: z.string(),
  title: z.string().default('').describe('Title of the assignment'),
  description: z
    .string()
    .default('')
    .describe('Description of the assignment, entered as markdown'),
  body: exerciseSchema.array().default([]).describe('List of exercises'),
  options: optionsSchema,
  lastModified: z.date().default(new Date()),
  prerequisites: z.string().array().default([]),
  courses: z.string().array().default([]),
})
export type Assignment = z.infer<typeof assignmentSchema>

async function check(email: string) {
  'use server'
  const user = await getUser()
  if (!user || (!user.admin && user.email !== email)) {
    throw new Error('Not Authorized')
  }
}

export const getAssignment = query(async (url: string, email: string) => {
  'use server'
  await check(email)
  const { submissions, prerequisites, ...storedAssignment } =
    await prisma.assignment.findUniqueOrThrow({
      where: { url },
      include: { submissions: { where: { email } }, prerequisites: { select: { url: true } } },
    })
  let body = submissions.length ? (submissions[0].body as Exercise[]) : []
  const assignment = {
    ...storedAssignment,
    prerequisites: prerequisites.map((p) => p.url),
    options: optionsSchema.parse(storedAssignment.options),
    body: storedAssignment.body as Exercise[],
  }
  body = extendAssignment(body, assignment)
  if (!submissions.length) {
    await prisma.submission.upsert({
      where: { url_email: { url, email } },
      create: { url, email, body, lastModified: new Date() },
      update: { body, lastModified: new Date() },
    })
  }
  return { ...assignment, body }
}, 'getAssignment')

export function extendAssignment(body: Exercise[], assignment: Assignment): Exercise[] {
  const options = (id: number) => ({ ...options, ...assignment.body[id].options })
  const streak = (id: number) => options(id).streak
  let [dynamicId, currentStreak] = [0, 0]
  for (const exercise of body) {
    if (exercise.attempts.at(-1)?.correct) {
      currentStreak++
    } else {
      currentStreak = 0
    }
    if (currentStreak >= streak(dynamicId)) {
      dynamicId++
      currentStreak = 0
    }
  }
  const lastFullyAttempted = body.at(-1)?.attempts.length === body.at(-1)?.maxAttempts
  const lastIsCorrect = body.at(-1)?.attempts.at(-1)?.correct
  if (lastFullyAttempted || lastIsCorrect) {
    body = [...body, assignment.body[dynamicId]]
    if (streak(dynamicId) === 0) {
      dynamicId++
    }
  }
  for (let i = dynamicId; i < assignment.body.length; i++) {
    if (streak(i) === 0) {
      body = [...body, assignment.body[i]]
    } else {
      break
    }
  }
  return body
}

export async function saveExercise(url: string, email: string, pos: number, exercise: Exercise) {
  'use server'
  await check(email)
  try {
    const record = await prisma.submission.findUniqueOrThrow({
      where: { url_email: { url, email } },
    })
    const body = record.body as Exercise[]
    body[pos] = await exerciseSchema.parseAsync(exercise)
    await prisma.submission.update({
      where: { url_email: { url, email }, lastModified: record.lastModified },
      data: { body, lastModified: new Date() },
    })
  } catch (error) {
    throw new Error(`Error while saving exercise ${JSON.stringify(exercise, null, 2)}: ${error}`)
  }
}

export const registerAssignment = async (data: z.input<typeof assignmentSchema>) => {
  'use server'
  let page = await prisma.assignment.findUnique({ where: { url: data.url } })
  let hash = CryptoJS.SHA256(JSON.stringify(data)).toString()
  if (!page || !page.body || page.hash !== hash) {
    const { prerequisites, courses, ...assignment } = await assignmentSchema.parseAsync(data)
    const payload = {
      ...assignment,
      hash,
      prerequisites: {
        connectOrCreate: prerequisites.map((url) => ({
          create: { url, body: [], options: {} },
          where: { url },
        })),
      },
      courses: {
        connectOrCreate: prerequisites.map((code) => ({
          create: { code },
          where: { code },
        })),
      },
    } satisfies Parameters<typeof prisma.assignment.upsert>[0]['update']
    page = await prisma.assignment.upsert({
      where: { url: data.url },
      create: payload,
      update: payload,
    })
    await prisma.submission.deleteMany({
      where: { url: data.url },
    })
  }
  return page as unknown as Assignment
}
