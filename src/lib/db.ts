'use server'

import { type OptionsWithDefault } from './exercises/schemas'
import { PrismaClient } from '@prisma/client'
import { type Exercise } from '~/lib/exercises/assignment'

declare global {
  namespace PrismaJson {
    type ExerciseList = Exercise[]
    type Options = OptionsWithDefault
  }
}

export const prisma = new PrismaClient()
