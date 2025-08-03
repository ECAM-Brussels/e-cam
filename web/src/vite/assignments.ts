import { PrismaClient } from '@prisma/client'
import glob from 'fast-glob'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import yaml from 'js-yaml'
import { dirname, relative, resolve } from 'path'
import { loadEnv, type Plugin } from 'vite'
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

async function createAssignment(file: string, prisma: PrismaClient) {
  const relativePath = relative(resolve('content'), file)
  const outputPath = resolve(
    'src/routes/(generated)',
    relativePath.replace(/\.ya?ml$/, '/[[index]].tsx'),
  )
  mkdirSync(dirname(outputPath), { recursive: true })
  const assignment = yaml.load(readFileSync(file, 'utf-8')) as Omit<AssignmentInput, 'url'>
  const template = readFileSync(resolve('src/vite/template.assignment.tsx'), 'utf-8')
  let content = template.replace('$body$', JSON.stringify(assignment, null, 2))
  content = content.replace('$route$', file)
  writeFileSync(outputPath, content, 'utf-8')
  const url = '/' + relativePath.replace(/\.ya?ml$/, '')
  try {
    await registerAssignment(prisma, { ...assignment, url }, {})
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
    })
    .array(),
})

async function loadData(prisma: PrismaClient) {
  const data = dataSchema.parse(yaml.load(readFileSync('content/data.yaml', 'utf-8')))
  try {
    for (const create of data.courses) {
      const { code, ...update } = create
      await prisma.course.upsert({ where: { code }, update, create })
    }
  } catch {
    console.log(`Error when loading data.yaml`)
  }
}

export default function (): Plugin {
  let prisma: PrismaClient
  return {
    name: 'assignments-plugin',
    async configResolved(config) {
      const env = loadEnv(config.mode, process.cwd(), 'VITE')
      prisma = new PrismaClient({
        datasources: { db: { url: env.VITE_DATABASE_URL } },
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
          await createAssignment(file, prisma)
        }
      }
    },
  }
}
