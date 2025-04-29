import { prisma } from './db'
import { type Exercise } from './exercises/assignment'
import CryptoJS from 'crypto-js'

type Info = {
  email: string
  url: string
  exercise: Exercise
  correct: boolean
}

function logistic(x: number) {
  return 1 / (1 + Math.pow(10, -x / 400))
}

const K = 32
const initialElo = 1500

export async function adjustElo({ email, url, exercise, correct }: Info) {
  'use server'
  const { score: userElo } = await prisma.user.findUniqueOrThrow({
    where: { email },
    select: { score: true },
  })

  // Get exercise's ELO
  let hash = CryptoJS.SHA256(
    JSON.stringify({ type: exercise.type, question: exercise.question }),
  ).toString()
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
        assignments: { connect: { url } },
      },
      select: { score: true },
    })
    if (!data) {
      throw new Error(`Could not get an initial ELO score for ${JSON.stringify(exercise)}`)
    }
  }
  const exerciseElo = data.score

  const delta = Math.round(K * ((correct ? 1 : 0) - logistic(userElo - exerciseElo)))
  await Promise.all([
    prisma.user.update({ where: { email }, data: { score: { increment: delta } } }),
    prisma.exercise.update({
      where: { hash, type: exercise.type },
      data: { score: { increment: -delta } },
    }),
  ])
}
