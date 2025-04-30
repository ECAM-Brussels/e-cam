import { getUser } from '../auth/session'
import { prisma } from '../db'
import { type OptionsWithDefault, optionsSchemaWithDefault } from './schemas'
import { query } from '@solidjs/router'
import { type ElementDefinition } from 'cytoscape'
import { lazy } from 'solid-js'
import { z } from 'zod'
import { schema as PythonSchema } from '~/exercises/CompSci/Python'
import { schema as CompleteSquareSchema } from '~/exercises/Math/CompleteSquare'
import { schema as FactorSchema } from '~/exercises/Math/Factor'
import { schema as SimpleSchema } from '~/exercises/Math/Simple'
import { hashObject } from '~/lib/helpers'

export const exercises = {
  Python: lazy(() => import('~/exercises/CompSci/Python')),
  CompleteSquare: lazy(() => import('~/exercises/Math/CompleteSquare')),
  Factor: lazy(() => import('~/exercises/Math/Factor')),
  Simple: lazy(() => import('~/exercises/Math/Simple')),
} as const

export const exerciseSchema = z.discriminatedUnion('type', [
  PythonSchema,
  CompleteSquareSchema,
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
export type AssignmentInput = z.input<typeof assignmentSchema>

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
  const body = extendSubmission(submissions.at(0)?.body ?? [], questions, options)
  if (!submissions.length) {
    await prisma.submission.upsert({
      where: { url_email: { url, email } },
      create: { url, email, body, lastModified: new Date() },
      update: { body, lastModified: new Date() },
    })
  }
  return body
}, 'getSubmission')

export function extendSubmission(
  body: Exercise[],
  questions: Exercise[],
  options: OptionsWithDefault,
): Exercise[] {
  const opts = (id: number) => ({ ...options, ...questions.at(id)?.options })
  const streak = (id: number) => opts(id).streak
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
  const lastFullyAttempted = body.at(-1)?.attempts.length === opts(-1).maxAttempts
  const lastIsCorrect = body.at(-1)?.attempts.at(-1)?.correct
  if (streak(dynamicId) && (!body.length || lastFullyAttempted || lastIsCorrect)) {
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

function gradeSubmission(body: Exercise[]) {
  return body
    .filter((e) => e.attempts.length > 0)
    .slice(-10)
    .reduce((grade, exercise) => {
      grade += exercise.attempts.at(-1)?.correct ? 1 : 0
      return grade
    }, 0)
}

export async function saveExercise(url: string, email: string, pos: number, exercise: Exercise) {
  'use server'
  await check(email)
  try {
    const { body, lastModified } = await prisma.submission.findUniqueOrThrow({
      where: { url_email: { url, email } },
    })
    body[pos] = await exerciseSchema.parseAsync(exercise)
    await prisma.submission.update({
      where: { url_email: { url, email }, lastModified },
      data: { body, lastModified: new Date(), grade: gradeSubmission(body) },
    })
  } catch (error) {
    throw new Error(`Error while saving exercise ${JSON.stringify(exercise, null, 2)}: ${error}`)
  }
}

export const getAssignment = async (data: z.input<typeof assignmentSchema>) => {
  'use server'
  const where = { url: data.url }
  const include = { prerequisites: true, courses: true, requiredBy: true }
  let page = await prisma.assignment.findUnique({ where, include })
  let hash = hashObject(data)
  if (!page || !page.body || page.hash !== hash) {
    const { prerequisites, courses, ...assignment } = await assignmentSchema.parseAsync(data)
    await prisma.assignment.createMany({
      data: prerequisites.map((p) => ({
        url: p.url,
        body: [],
        options: optionsSchemaWithDefault.parse({}),
      })),
      skipDuplicates: true,
    })
    const update = {
      ...assignment,
      hash,
      prerequisites: {
        set: prerequisites.map((p) => ({ url: p.url })),
      },
      courses: {
        connectOrCreate: courses.map((code) => ({
          create: { code },
          where: { code },
        })),
      },
    } satisfies Parameters<typeof prisma.assignment.upsert>[0]['update']
    const create = {
      ...update,
      prerequisites: {
        connectOrCreate: prerequisites.map((p) => ({
          create: { url: p.url, body: [], options: optionsSchemaWithDefault.parse({}) },
          where: { url: p.url },
        })),
      },
    } satisfies Parameters<typeof prisma.assignment.upsert>[0]['create']
    page = await prisma.assignment.upsert({ where, create, update, include })
    await prisma.submission.deleteMany({ where })
  }
  return page
}

function gradeToColor(score: number, start = [231, 229, 228], end = [163, 230, 53], steps = 10) {
  const rgb = [...Array(3).keys()].reduce((color, i) => {
    color.push(Math.round(start[i] + (score / steps) * (end[i] - start[i])))
    return color
  }, [] as number[])
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
}

export const getAssignmentGraph = query(
  async (
    query: Parameters<typeof prisma.assignment.findMany>[0] = {},
  ): Promise<ElementDefinition[]> => {
    'use server'
    const user = await getUser()
    const data = await prisma.assignment.findMany({
      ...query,
      select: {
        url: true,
        title: true,
        requiredBy: { select: { url: true } },
        submissions: user ? { where: { email: user.email }, select: { grade: true } } : false,
      },
    })
    const vertices = data.map((assignment) => ({
      data: {
        id: assignment.url,
        label: assignment.title,
        parent: 'algebra',
        color: gradeToColor(assignment.submissions?.at(0)?.grade ?? 0),
      },
    })) satisfies ElementDefinition[]
    const urls = vertices.map((v) => v.data.id)
    const edges = data.reduce((edges, assignment) => {
      for (const target of assignment.requiredBy) {
        if (urls.includes(target.url)) {
          edges.push({
            data: {
              id: `(${assignment.url}, ${target.url})`,
              source: assignment.url,
              target: target.url,
            },
          })
        }
      }
      return edges
    }, [] as ElementDefinition[])
    return [{ data: { id: 'algebra', label: 'Algèbre' } }, ...vertices, ...edges]
  },
  'getAssignmentGraph',
)
