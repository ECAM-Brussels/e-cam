import { getUser } from '../auth/session'
import { prisma } from '../db'
import { getEloGain } from '../elo'
import { type OptionsWithDefault, optionsSchemaWithDefault } from './schemas'
import { type Prisma } from '@prisma/client'
import { query, redirect } from '@solidjs/router'
import { type ElementDefinition } from 'cytoscape'
import { lazy } from 'solid-js'
import { z } from 'zod'
import { schema as PythonSchema } from '~/exercises/CompSci/Python'
import { schema as CompleteSquareSchema } from '~/exercises/Math/CompleteSquare'
import { schema as DifferentiateSchema } from '~/exercises/Math/Differentiate'
import { schema as EquationSchema } from '~/exercises/Math/Equation'
import { schema as ExpandSchema } from '~/exercises/Math/Expand'
import { schema as FactorSchema } from '~/exercises/Math/Factor'
import { schema as LimitSchema } from '~/exercises/Math/Limit'
import { schema as SimpleSchema } from '~/exercises/Math/Simple'
import { schema as MultipleChoiceSchema } from '~/exercises/MultipleChoice'
import { hashObject } from '~/lib/helpers'
import { registerAssignment } from '~/vite/assignments'

export const exercises = {
  Python: lazy(() => import('~/exercises/CompSci/Python')),
  CompleteSquare: lazy(() => import('~/exercises/Math/CompleteSquare')),
  Differentiate: lazy(() => import('~/exercises/Math/Differentiate')),
  Equation: lazy(() => import('~/exercises/Math/Equation')),
  Expand: lazy(() => import('~/exercises/Math/Expand')),
  Factor: lazy(() => import('~/exercises/Math/Factor')),
  Limit: lazy(() => import('~/exercises/Math/Limit')),
  Simple: lazy(() => import('~/exercises/Math/Simple')),
  MultipleChoice: lazy(() => import('~/exercises/MultipleChoice')),
} as const

export const exerciseSchema = z.discriminatedUnion('type', [
  PythonSchema,
  CompleteSquareSchema,
  DifferentiateSchema,
  EquationSchema,
  ExpandSchema,
  FactorSchema,
  LimitSchema,
  SimpleSchema,
  MultipleChoiceSchema,
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
  video: z.string().optional(),
})
export type Assignment = z.infer<typeof assignmentSchema>
export type AssignmentInput = z.input<typeof assignmentSchema>

async function check(email: string) {
  'use server'
  const user = await getUser()
  if (!user || (user.role !== 'ADMIN' && user.email !== email)) {
    throw redirect('/auth/login')
  }
}

export const getExercise = query(async (url: string, email: string, position: number) => {
  'use server'
  const sequence = await getExercises(url, email)
  return sequence[position]
}, 'getExercise')

export const getExercises = query(async (url: string, email: string) => {
  'use server'
  await check(email)
  const {
    attempts,
    options,
    body: questions,
  } = await prisma.assignment.findUniqueOrThrow({
    where: { url },
    select: {
      body: true,
      options: true,
      attempts: { where: { email }, select: { exercise: true }, orderBy: { position: 'asc' } },
    },
  })
  return addExercises(
    attempts.map((a) => a.exercise),
    questions,
    options,
  )
}, 'getExercises')

export function addExercises(
  body: Exercise[],
  questions: Exercise[],
  options: Partial<OptionsWithDefault> | null,
): Exercise[] {
  const opts = (id: number) =>
    optionsSchemaWithDefault.parse({ ...options, ...questions.at(id)?.options })
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

async function upsertExercise(exercise: Exercise) {
  'use server'
  exercise = await exerciseSchema.parseAsync(exercise)
  if (!exercise.question) {
    throw new Error('Exercise has not been generated yet.')
  }
  const hash = hashObject({ type: exercise.type, question: exercise.question })
  let data = await prisma.question.findUnique({
    where: { type: exercise.type, hash },
    select: { score: true },
  })
  if (!data) {
    let average = await prisma.question.aggregate({
      _avg: { score: true },
      where: { type: exercise.type },
    })
    const score = average._avg.score ?? 1500
    await prisma.question.create({
      data: {
        hash,
        type: exercise.type,
        body: exercise.question,
        score,
      },
      select: { score: true },
    })
  }
  return hash
}

export async function saveExercise(
  url: string,
  email: string,
  position: number,
  exercise: Exercise,
) {
  'use server'
  try {
    await check(email)
    const key = { url, email, position }
    const hash = await upsertExercise(exercise)
    const payload = {
      hash,
      exercise,
      position,
      correct: exercise.attempts.at(0)?.correct ?? null,
      ...(exercise.options.adjustElo && exercise.attempts.length === 1
        ? { gain: await getEloGain(email, hash, exercise.attempts[0].correct) }
        : {}),
    } satisfies Prisma.AttemptUpsertArgs['update']
    await prisma.$transaction(async (tx) => {
      const queries: Promise<any>[] = [
        tx.attempt.upsert({
          where: { url_email_position: key },
          update: payload,
          create: { ...key, ...payload },
        }),
      ]
      if (payload.gain) {
        queries.push(
          tx.user.update({
            where: { email },
            data: { score: { increment: payload.gain } },
          }),
          tx.question.update({
            where: { hash },
            data: { score: { increment: -payload.gain } },
          }),
        )
      }
      await Promise.all(queries)
    })
  } catch (error) {
    throw new Error(`Error while saving exercise ${JSON.stringify(exercise, null, 2)}: ${error}`)
  }
}

export const getAssignment = async (data: z.input<typeof assignmentSchema>) => {
  'use server'
  const where = { url: data.url }
  const include = { prerequisites: true, courses: true, requiredBy: true, page: true }
  let page = await prisma.assignment.findUniqueOrThrow({ where, include })
  let hash = hashObject(data)
  if (!page || !page.body || page.hash !== hash) {
    const { prerequisites, courses, url, title, description, ...assignment } =
      await assignmentSchema.parseAsync(data)
    await registerAssignment(prisma, data, { ...assignment, hash })
    if (page && hashObject(page.body) !== hashObject(assignment.body)) {
      await prisma.attempt.deleteMany({ where })
    }
  }
  return page
}

function gradeToColor(correct: number, incorrect: number, total = 10) {
  const colors = { gray: [231, 229, 228], green: [163, 230, 53], red: [248, 113, 113] }
  const rgb = [...Array(3).keys()].reduce((color, i) => {
    const unsolved = 10 - correct - incorrect
    color.push(
      Math.round(
        (colors.gray[i] * unsolved + colors.red[i] * incorrect + colors.green[i] * correct) / total,
      ),
    )
    return color
  }, [] as number[])
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
}

export const getAssignmentGraph = query(
  async (
    where: Prisma.AssignmentFindManyArgs['where'] = {},
    courses: string[] = [],
  ): Promise<ElementDefinition[]> => {
    'use server'
    const user = await getUser()
    const groups = (
      await prisma.course.findMany({
        select: { code: true, title: true },
        where: { code: { in: courses } },
      })
    ).map((course) => ({ data: { id: course.code, label: course.title } }))
    const data = (
      await prisma.assignment.findMany({
        where,
        select: {
          url: true,
          page: { select: { title: true } },
          courses: { select: { code: true } },
          requiredBy: { select: { url: true } },
          attempts: user
            ? {
                select: { correct: true },
                where: { email: user.email, correct: { not: null } },
                orderBy: { position: 'desc' },
                take: 10,
              }
            : false,
        },
      })
    ).map(({ courses, ...info }) => ({ ...info, courses: courses.map((r) => r.code) }))
    const vertices = data.map((assignment) => ({
      data: {
        id: assignment.url,
        label: assignment.page.title,
        parent: courses.filter((c) => assignment.courses.includes(c)).at(0),
        color: gradeToColor(
          assignment.attempts?.filter((a) => a.correct).length ?? 0,
          assignment.attempts?.filter((a) => a.correct === false).length ?? 0,
        ),
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
    return [...groups, ...vertices, ...edges]
  },
  'getAssignmentGraph',
)

export const getAssignmentResults = query(async (url: string) => {
  'use server'
  const data = await prisma.user.findMany({
    select: {
      firstName: true,
      lastName: true,
      email: true,
      score: true,
      attempts: {
        select: { correct: true },
        where: { url },
        orderBy: { position: 'asc' },
      },
    },
  })
  return data
}, 'getAssignmentResults')

export const getAssignmentList = query(
  async (where: Prisma.AssignmentFindManyArgs['where'] = {}) => {
    'use server'
    const user = await getUser()
    const data = await prisma.assignment.findMany({
      where,
      select: {
        url: true,
        page: { select: { title: true } },
        courses: { select: { code: true, url: true, title: true } },
        attempts: user
          ? {
              select: { id: true },
              where: { email: user.email, correct: true },
              orderBy: { position: 'desc' },
              take: 10,
            }
          : false,
      },
    })
    return data.map(({ attempts, ...info }) => {
      return {
        ...info,
        grade: attempts?.length || 0,
      }
    })
  },
  'getAssignmentTable',
)
