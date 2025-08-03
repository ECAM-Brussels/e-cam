import { type Prisma } from '@prisma/client'
import { query } from '@solidjs/router'
import { prisma } from '~/lib/db'

export const getCourses = query(async (args: Prisma.CourseFindManyArgs) => {
  'use server'
  const courses = await prisma.course.findMany(args)
  return courses
}, 'getCourses')
