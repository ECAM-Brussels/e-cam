'use server'

import { type OptionsWithDefault } from './exercises/schemas'
import { PrismaClient } from '@prisma/client'
import { type Stroke } from '~/components/Whiteboard'
import { type Exercise } from '~/lib/exercises/assignment'

declare global {
  namespace PrismaJson {
    type ExerciseList = Exercise[]
    type Options = OptionsWithDefault
    type StrokeList = Stroke[]
    type Question = NonNullable<Exercise['question']>
  }
}

export const prisma = new PrismaClient()
