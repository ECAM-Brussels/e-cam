import { prisma } from './db'
import { query } from '@solidjs/router'

export const getCourses = query(async () => {
  'use server'
  const courses = await prisma.course.findMany({
    where: { url: { not: '' } },
  })
  return courses
}, 'getCourses')
