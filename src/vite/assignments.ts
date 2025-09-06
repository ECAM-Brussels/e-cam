import { PrismaClient } from '@prisma/client'
import glob from 'fast-glob'
import { mkdir, readFile, stat, writeFile } from 'fs/promises'
import yaml from 'js-yaml'
import { dirname, relative, resolve } from 'path'
import { type Plugin } from 'vite'
import { z } from 'zod'
import { type AssignmentInput } from '~/lib/exercises/assignment'

let prisma: PrismaClient

async function createEmptyAssignments(prisma: PrismaClient, assignments: string[]) {
  await prisma.assignment.createMany({
    data: assignments.map((path) => {
      const relativePath = relative(resolve('content'), path)
      const url = '/' + relativePath.replace(/\.ya?ml$/, '')
      return { url, body: [] }
    }),
    skipDuplicates: true,
  })
}

type Update = Parameters<typeof prisma.assignment.update>[0]['data']

export async function registerAssignment(
  prisma: PrismaClient,
  assignment: AssignmentInput,
  extra: Partial<Update>,
) {
  await Promise.all([
    ...(assignment.courses ?? []).map(async (code) => {
      await prisma.course.upsert({
        where: { code },
        create: { code },
        update: {},
      })
    }),
    prisma.page.upsert({
      where: { url: assignment.url },
      create: { url: assignment.url, title: assignment.title, description: assignment.description },
      update: { title: assignment.title, description: assignment.description },
    }),
  ])
  const prerequisites = (assignment.prerequisites ?? []).map((p) =>
    typeof p === 'string' ? p : p.url,
  )
  const data = {
    ...extra,
    prerequisites: {
      set: prerequisites.map((url) => ({ url })),
    },
    courses: {
      set: (assignment.courses ?? []).map((code) => ({ code })),
    },
  } satisfies Update
  await prisma.assignment.update({ where: { url: assignment.url }, data })
}

async function safeStat(path: string) {
  try {
    return await stat(path)
  } catch (err) {
    return { mtime: 0 }
  }
}

async function createAssignment(file: string, prisma: PrismaClient) {
  const relativePath = relative(resolve('content'), file)
  const outputPath = resolve(
    'src/routes/(generated)',
    relativePath.replace(/\.ya?ml$/, '/[[index]].tsx'),
  )
  await mkdir(dirname(outputPath), { recursive: true })
  try {
    const [inStat, outStat] = await Promise.all([safeStat(file), safeStat(outputPath)])
    const assignment = yaml.load(await readFile(file, 'utf-8')) as Omit<AssignmentInput, 'url'>
    const url = '/' + relativePath.replace(/\.ya?ml$/, '')
    await registerAssignment(prisma, { ...assignment, url }, {})
    if (outStat.mtime >= inStat.mtime) {
      return
    }
    const template = await readFile(resolve('src/vite/template.assignment.tsx'), 'utf-8')
    let content = template.replace('$body$', JSON.stringify(assignment, null, 2))
    content = content.replace('$route$', file)
    await writeFile(outputPath, content, 'utf-8')
  } catch (error) {
    console.log(`Error when writing the metadata of ${file} to the database: ${error}`)
  }
}

const dataSchema = z.object({
  courses: z
    .object({
      code: z.string(),
      title: z.string(),
      image: z.string().optional(),
      url: z.string().optional(),
      ecam: z.boolean().default(false),
    })
    .array(),
  admins: z.string().email().array().default([]),
})

async function loadData(prisma: PrismaClient) {
  const data = dataSchema.parse(yaml.load(await readFile('content/data.yaml', 'utf-8')))
  try {
    for (const create of data.courses) {
      const { code, ...update } = create
      await prisma.course.upsert({ where: { code }, update, create })
    }
    await Promise.all(
      data.admins.map((email) => {
        prisma.user.updateMany({
          where: { email, NOT: { role: 'ADMIN' } },
          data: { role: 'ADMIN' },
        })
      }),
    )
  } catch {
    console.log(`Error when loading data.yaml`)
  }
}

export default function (): Plugin {
  let prisma: PrismaClient
  return {
    name: 'assignments-plugin',
    async buildStart() {
      prisma = new PrismaClient({
        datasources: { db: { url: process.env.DATABASE_URL } },
      })
      const assignments = await glob.glob('content/**/*.yaml', { ignore: ['content/data.yaml'] })
      await createEmptyAssignments(prisma, assignments)
      await Promise.all([
        ...assignments.map((file) => createAssignment(file, prisma)),
        loadData(prisma),
      ])
    },
    async handleHotUpdate({ file }) {
      if (file.startsWith(resolve('content')) && file.endsWith('.yaml')) {
        if (file.endsWith('data.yaml')) {
          await loadData(prisma)
        } else {
          const assignments = await glob.glob('content/**/*.yaml', {
            ignore: ['content/data.yaml'],
          })
          await createEmptyAssignments(prisma, assignments)
          await createAssignment(file, prisma)
        }
      }
    },
  }
}
