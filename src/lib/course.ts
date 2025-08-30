import { type Prisma } from '@prisma/client'
import { query } from '@solidjs/router'
import { prisma } from '~/lib/db'

export const getCourse = query(async (code: string) => {
  'use server'
  return await prisma.course.findUniqueOrThrow({ where: { code } })
}, 'getCourse')

export const getCourses = query(async (args: Prisma.CourseFindManyArgs) => {
  'use server'
  const courses = await prisma.course.findMany(args)
  return courses
}, 'getCourses')
