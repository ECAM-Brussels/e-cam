import { type Options as ExerciseOptions } from './exercises/schemas'
import { PrismaClient } from '@prisma/client'
import { type Stroke } from '~/lib/board'
import { type Exercise as FullExercise } from '~/lib/exercises/assignment'

declare global {
  namespace PrismaJson {
    type Exercise = FullExercise
    type ExerciseList = FullExercise[]
    type Options = ExerciseOptions
    type StrokeList = Stroke[]
    type Question = NonNullable<Exercise['question']>
    type PointList = [number, number][]
  }
}

export const prisma = new PrismaClient()
