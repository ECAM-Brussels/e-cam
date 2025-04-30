import { prisma } from './db'
import { type Exercise } from './exercises/assignment'
import { query } from '@solidjs/router'
import { hashObject } from '~/lib/helpers'

type Info = {
  email: string
  exercise: Exercise
  correct: boolean
}

function logistic(x: number) {
  return 1 / (1 + Math.pow(10, -x / 400))
}

const K = 32
const initialElo = 1500

export const getExerciseElo = query(async (exercise: Exercise) => {
  'use server'
  if (!exercise.question) {
    return null
  }
  let hash = hashObject({ type: exercise.type, question: exercise.question })
  let data = await prisma.exercise.findUnique({
    where: { type: exercise.type, hash },
    select: { score: true },
  })
  if (!data) {
    let average = await prisma.exercise.aggregate({
      _avg: { score: true },
      where: { type: exercise.type },
    })
    const score = average._avg.score ?? initialElo
    data = await prisma.exercise.create({
      data: {
        hash,
        type: exercise.type,
        question: exercise.question,
        score,
      },
      select: { score: true },
    })
    if (!data) {
      throw new Error(`Could not get an initial ELO score for ${JSON.stringify(exercise)}`)
    }
  }
  return data.score
}, 'getExerciseElo')

export async function adjustElo({ email, exercise, correct }: Info) {
  'use server'
  let hash = hashObject({ type: exercise.type, question: exercise.question })
  const { score: userElo } = await prisma.user.findUniqueOrThrow({
    where: { email },
    select: { score: true },
  })
  const exerciseElo = await getExerciseElo(exercise)
  if (exerciseElo === null) {
    return
  }
  const gain = Math.round(K * ((correct ? 1 : 0) - logistic(userElo - exerciseElo)))
  await Promise.all([
    prisma.user.update({ where: { email }, data: { score: { increment: gain } } }),
    prisma.exercise.update({
      where: { hash, type: exercise.type },
      data: { score: { increment: -gain } },
    }),
    prisma.attempt.create({ data: { email, hash, userElo, exerciseElo, gain } }),
  ])
}
