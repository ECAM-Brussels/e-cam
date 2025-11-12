import { getUser } from '../auth/session'
import { prisma } from '../db'
import { getEloGain } from '../elo'
import { type Options, optionsSchema } from './schemas'
import { type Prisma } from '@prisma/client'
import { query, redirect } from '@solidjs/router'
import { type ElementDefinition } from 'cytoscape'
import { memoize } from 'lodash-es'
import { lazy } from 'solid-js'
import { z } from 'zod'
import { schema as BalanceSchema } from '~/exercises/Chemistry/Balance'
import { schema as MolarMassSchema } from '~/exercises/Chemistry/MolarMass'
import { schema as OutputSchema } from '~/exercises/CompSci/Output'
import { schema as PythonSchema } from '~/exercises/CompSci/Python'
import { schema as ArgumentSchema } from '~/exercises/Math/Argument'
import { schema as CalculateSchema } from '~/exercises/Math/Calculate'
import { schema as CompleteSquareSchema } from '~/exercises/Math/CompleteSquare'
import { schema as ComplexSchema } from '~/exercises/Math/Complex'
import { schema as ConicSectionSchema } from '~/exercises/Math/ConicSection'
import { schema as CrossProductSchema } from '~/exercises/Math/CrossProduct'
import { schema as DifferentiateSchema } from '~/exercises/Math/Differentiate'
import { schema as DistanceSchema } from '~/exercises/Math/Distance'
import { schema as DotProductSchema } from '~/exercises/Math/DotProduct'
import { schema as EquationSchema } from '~/exercises/Math/Equation'
import { schema as ExpandSchema } from '~/exercises/Math/Expand'
import { schema as FactorSchema } from '~/exercises/Math/Factor'
import { schema as InterpolationSchema } from '~/exercises/Math/Interpolation'
import { schema as LimitSchema } from '~/exercises/Math/Limit'
import { schema as ModulusSchema } from '~/exercises/Math/Modulus'
import { schema as NormSchema } from '~/exercises/Math/Norm'
import { schema as PythagorasSchema } from '~/exercises/Math/Pythagoras'
import { schema as RightTriangleSchema } from '~/exercises/Math/RightTriangle'
import { schema as SimpleSchema } from '~/exercises/Math/Simple'
import { schema as SystemSchema } from '~/exercises/Math/System'
import { schema as TangentSchema } from '~/exercises/Math/Tangent'
import { schema as TrigonometricNumbersSchema } from '~/exercises/Math/TrigonometricNumbers'
import { schema as TripleProductSchema } from '~/exercises/Math/TripleProduct'
import { schema as UnitVectorSchema } from '~/exercises/Math/UnitVector'
import { schema as VectorAngleSchema } from '~/exercises/Math/VectorAngle'
import { schema as MultipleChoiceSchema } from '~/exercises/MultipleChoice'
import { hashObject } from '~/lib/helpers'
import { getUserInfo } from '~/lib/user'
import { registerAssignment } from '~/vite/assignments'

export const exercises = {
  Balance: lazy(() => import('~/exercises/Chemistry/Balance')),
  MolarMass: lazy(() => import('~/exercises/Chemistry/MolarMass')),
  Output: lazy(() => import('~/exercises/CompSci/Output')),
  Python: lazy(() => import('~/exercises/CompSci/Python')),
  Argument: lazy(() => import('~/exercises/Math/Argument')),
  Calculate: lazy(() => import('~/exercises/Math/Calculate')),
  Complex: lazy(() => import('~/exercises/Math/Complex')),
  CompleteSquare: lazy(() => import('~/exercises/Math/CompleteSquare')),
  ConicSection: lazy(() => import('~/exercises/Math/ConicSection')),
  CrossProduct: lazy(() => import('~/exercises/Math/CrossProduct')),
  Differentiate: lazy(() => import('~/exercises/Math/Differentiate')),
  Distance: lazy(() => import('~/exercises/Math/Distance')),
  DotProduct: lazy(() => import('~/exercises/Math/DotProduct')),
  Equation: lazy(() => import('~/exercises/Math/Equation')),
  Expand: lazy(() => import('~/exercises/Math/Expand')),
  Factor: lazy(() => import('~/exercises/Math/Factor')),
  Interpolation: lazy(() => import('~/exercises/Math/Interpolation')),
  Limit: lazy(() => import('~/exercises/Math/Limit')),
  Modulus: lazy(() => import('~/exercises/Math/Modulus')),
  Norm: lazy(() => import('~/exercises/Math/Norm')),
  Pythagoras: lazy(() => import('~/exercises/Math/Pythagoras')),
  RightTriangle: lazy(() => import('~/exercises/Math/RightTriangle')),
  Simple: lazy(() => import('~/exercises/Math/Simple')),
  System: lazy(() => import('~/exercises/Math/System')),
  Tangent: lazy(() => import('~/exercises/Math/Tangent')),
  TrigonometricNumbers: lazy(() => import('~/exercises/Math/TrigonometricNumbers')),
  TripleProduct: lazy(() => import('~/exercises/Math/TripleProduct')),
  UnitVector: lazy(() => import('~/exercises/Math/UnitVector')),
  VectorAngle: lazy(() => import('~/exercises/Math/VectorAngle')),
  MultipleChoice: lazy(() => import('~/exercises/MultipleChoice')),
} as const

export const exerciseSchema = z.discriminatedUnion('type', [
  BalanceSchema,
  MolarMassSchema,
  OutputSchema,
  PythonSchema,
  ArgumentSchema,
  CalculateSchema,
  CompleteSquareSchema,
  ComplexSchema,
  ConicSectionSchema,
  CrossProductSchema,
  DifferentiateSchema,
  DistanceSchema,
  DotProductSchema,
  EquationSchema,
  ExpandSchema,
  FactorSchema,
  InterpolationSchema,
  LimitSchema,
  ModulusSchema,
  NormSchema,
  PythagorasSchema,
  RightTriangleSchema,
  SimpleSchema,
  SystemSchema,
  TangentSchema,
  TrigonometricNumbersSchema,
  TripleProductSchema,
  UnitVectorSchema,
  VectorAngleSchema,
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
  options: optionsSchema.optional().transform((opts) => optionsSchema.parse({ ...opts })),
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
  if (!user || (user.role === 'STUDENT' && user.email !== email)) {
    throw redirect('/auth/login')
  }
}

export const getExercise = query(async (url: string, email: string, position: number) => {
  'use server'
  const sequence = await getExercises(url, email)
  return await exerciseSchema.parseAsync(sequence[position - 1])
}, 'getExercise')

export const getPaginationInfo = query(async (url: string, email: string) => {
  'use server'
  const exercises = await getExercises(url, email)
  return exercises.map((exercise) => exercise.attempts.at(0)?.correct ?? null)
}, 'getPaginationInfo')

const getExercises = query(async (url: string, email: string) => {
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
      attempts: {
        where: { email },
        select: { exercise: true, position: true },
        orderBy: { position: 'asc' },
      },
    },
  })
  const body: Exercise[] = []
  for (const attempt of attempts) {
    body[attempt.position - 1] = attempt.exercise
  }
  for (let i = 0; i < body.length; i++) {
    if (body[i] === undefined) {
      body[i] = questions[i]
    }
  }
  return addExercises(body, questions, options)
}, 'getExercises')

function addExercises(
  body: Exercise[],
  questions: Exercise[],
  options: Partial<Options> | null,
): Exercise[] {
  const opts = (id: number) => optionsSchema.parse({ ...options, ...questions.at(id)?.options })
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
  const options = optionsSchema.parse(exercise.options)
  if (!data) {
    await prisma.question.create({
      data: {
        hash,
        type: exercise.type,
        body: exercise.question,
        score: options.initialElo,
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
  action: 'remark' | 'submit' | 'generate',
) {
  'use server'
  try {
    await check(email)
    exercise = await exerciseSchema.parseAsync(exercise)
    const key = { url, email, position }
    let correction = 0
    if (action === 'remark') {
      if (exercise.attempts.at(-1)?.correct !== true) {
        return
      }
      const attempt = await prisma.attempt.findUniqueOrThrow({
        where: { url_email_position: { url, email, position } },
      })
      correction = -(attempt.gain ?? 0)
    }
    const hash = await upsertExercise(exercise)
    const options = optionsSchema.parse(exercise.options)
    const payload = {
      hash,
      exercise,
      position,
      correct: exercise.attempts.at(0)?.correct ?? null,
      ...(options.adjustElo && exercise.attempts.length === 1
        ? { gain: await getEloGain(email, url, exercise.attempts[0].correct, correction) }
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
            data: { score: { increment: payload.gain + correction } },
          }),
          tx.assignment.update({
            where: { url },
            data: { score: { decrement: Math.ceil((payload.gain + correction) / 8) } },
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
      // await prisma.attempt.deleteMany({ where })
    }
  }
  if (page.score === null && data.options?.adjustElo !== false) {
    await prisma.assignment.update({ where, data: { score: data.options?.initialElo ?? 1200 } })
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

function inZPD(
  assignments: Prisma.AssignmentGetPayload<{
    select: { attempts: true; url: true; requiredBy: { select: { url: true } } }
  }>[],
  url: string,
) {
  const isUnderstood = memoize((assignment: (typeof assignments)[number]): boolean => {
    const correct = assignment.attempts.filter((a) => a.correct).length
    const total = assignment.attempts.length
    if (total >= 5 && correct / total >= 0.8) return true
    for (const neighbour of assignment.requiredBy) {
      const n = assignments.filter((a) => a.url === neighbour.url).at(0)
      if (n && isUnderstood(n)) return true
    }
    return false
  })

  const neighbours = assignments.filter((a) => a.requiredBy.map((n) => n.url).includes(url))
  const current = assignments.filter((a) => a.url === url).at(0)!
  if (isUnderstood(current)) return false
  for (const neighbour of neighbours) {
    if (!isUnderstood(neighbour)) return false
  }
  return true
}

export const getAssignmentGraph = query(
  async (
    where: Prisma.AssignmentFindManyArgs['where'] = {},
    courses: string[] = [],
    userEmail?: string,
  ): Promise<ElementDefinition[]> => {
    'use server'
    let user = await getUser()
    if (user && userEmail && user.role !== 'STUDENT') {
      user = await getUserInfo(userEmail)
    }
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
        zpd: inZPD(data, assignment.url),
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
  const { body, options } = await prisma.assignment.findUniqueOrThrow({
    select: { body: true, options: true },
    where: { url },
  })
  const opts = (index: number) => optionsSchema.parse({ ...options, ...body[index].options })
  const generated = body.length === 1 && opts(0).streak > 0
  const [data, attempted, correct] = await Promise.all([
    prisma.user.findMany({
      where: {
        attempts: {
          some: { url, correct: { not: null } },
        },
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        score: true,
        attempts: {
          select: { correct: true, position: true },
          where: { url, correct: { not: null } },
          orderBy: { position: 'desc' },
          take: generated ? 15 : undefined,
        },
      },
    }),
    prisma.attempt.groupBy({
      by: ['email'],
      where: { url, correct: { not: null } },
      _count: { _all: true },
    }),
    prisma.attempt.groupBy({
      by: ['email'],
      where: { url, correct: true },
      _count: { _all: true },
    }),
  ])
  return data.map((user) => {
    const attempts = user.attempts.reverse()
    const completedAttempts: typeof attempts = []
    if (!generated) {
      for (let i = 0; i < (attempts.at(-1)?.position ?? 0); i++) {
        const attempt = attempts.filter((a) => a.position === i + 1).at(0)
        completedAttempts.push(attempt ?? { correct: null, position: i + 1 })
      }
    }
    return {
      ...user,
      attempts: generated ? attempts : completedAttempts,
      correct: correct.filter((res) => res.email === user.email).at(0)?._count._all ?? 0,
      attempted: attempted.filter((res) => res.email === user.email).at(0)?._count._all ?? 0,
    }
  })
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
