import { getUser } from '../auth/session'
import { prisma } from '../db'
import { type OptionsWithDefault, optionsSchemaWithDefault } from './schemas'
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
  options: optionsSchemaWithDefault,
  lastModified: z.date().default(new Date()),
  prerequisites: z
    .object({
      url: z.string(),
      title: z.string(),
    })
    .or(z.string().transform((url) => ({ url, title: '' })))
    .array()
    .default([]),
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

export const getSubmission = query(async (url: string, email: string) => {
  'use server'
  await check(email)
  const {
    submissions,
    options,
    body: questions,
  } = await prisma.assignment.findUniqueOrThrow({
    where: { url },
    select: {
      body: true,
      options: true,
      submissions: { where: { email } },
    },
  })
  let body = (submissions.at(0)?.body as Exercise[]) ?? []
  body = extendSubmission(body, questions as Exercise[], optionsSchemaWithDefault.parse(options))
  if (!submissions.length) {
    await prisma.submission.upsert({
      where: { url_email: { url, email } },
      create: { url, email, body, lastModified: new Date() },
      update: { body, lastModified: new Date() },
    })
  }
  return body
}, 'getAssignment')

export function extendSubmission(
  body: Exercise[],
  questions: Exercise[],
  options: OptionsWithDefault,
): Exercise[] {
  const streak = (id: number) => ({ ...options, ...questions.at(id)?.options }).streak
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
  if (streak(dynamicId) && (lastFullyAttempted || lastIsCorrect)) {
    body = [...body, questions[dynamicId]]
    return body
  }
  for (let i = dynamicId; i < questions.length; i++) {
    if (streak(i) === 0) {
      body = [...body, questions[i]]
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

export const getAssignment = async (data: z.input<typeof assignmentSchema>) => {
  'use server'
  const where = { url: data.url }
  const include = { prerequisites: true, courses: true }
  let page = await prisma.assignment.findUnique({ where, include })
  let hash = CryptoJS.SHA256(JSON.stringify(data)).toString()
  if (!page || !page.body || page.hash !== hash) {
    const { prerequisites, courses, ...assignment } = await assignmentSchema.parseAsync(data)
    const payload = {
      ...assignment,
      hash,
      prerequisites: {
        connectOrCreate: prerequisites.map((p) => ({
          create: { url: p.url, body: [], options: {} },
          where: { url: p.url },
        })),
      },
      courses: {
        connectOrCreate: courses.map((code) => ({
          create: { code },
          where: { code },
        })),
      },
    } satisfies Parameters<typeof prisma.assignment.upsert>[0]['update']
    page = await prisma.assignment.upsert({
      where,
      create: payload,
      update: payload,
      include,
    })
    await prisma.submission.deleteMany({ where })
  }
  return page as unknown as Assignment
}
