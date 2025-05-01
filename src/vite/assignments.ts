import { PrismaClient } from '@prisma/client'
import glob from 'fast-glob'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import yaml from 'js-yaml'
import { dirname, relative, resolve } from 'path'
import { loadEnv, type Plugin } from 'vite'
import { type AssignmentInput } from '~/lib/exercises/assignment'

const options = {
  adjustElo: true,
  maxAttempts: 1,
  note: '',
  whiteboard: true,
  streak: 0,
}
let prisma: PrismaClient
type Update = Parameters<typeof prisma.assignment.upsert>[0]['update']
type Create = Parameters<typeof prisma.assignment.upsert>[0]['create']
type Payload = Partial<Update & Create>

export async function registerAssignment(
  prisma: PrismaClient,
  assignment: AssignmentInput,
  extra: Payload,
) {
  await prisma.assignment.createMany({
    data: (assignment.prerequisites ?? []).map((p) => ({
      url: typeof p === 'string' ? p : p.url,
      body: [],
      options,
    })),
    skipDuplicates: true,
  })
  const prerequisites = (assignment.prerequisites ?? []).map((p) =>
    typeof p === 'string' ? p : p.url,
  )
  const payload = {
    title: assignment.title,
    ...extra,
    prerequisites: {
      connectOrCreate: prerequisites.map((url) => ({
        create: { url, body: [], options },
        where: { url },
      })),
    },
    courses: {
      connectOrCreate: (assignment.courses ?? []).map((code) => ({
        create: { code },
        where: { code },
      })),
    },
  } satisfies Partial<Create>
  const update = {
    ...payload,
    prerequisites: {
      set: prerequisites.map((url) => ({ url })),
    },
  } satisfies Update
  await prisma.assignment.upsert({
    where: { url: assignment.url },
    create: {
      ...payload,
      url: assignment.url,
      body: [],
      options,
    },
    update,
  })
}

async function createAssignment(file: string, prisma: PrismaClient) {
  const relativePath = relative(resolve('content'), file)
  const outputPath = resolve('src/routes/(generated)', relativePath.replace(/\.ya?ml$/, '.tsx'))
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

export default function (): Plugin {
  let prisma: PrismaClient
  return {
    name: 'assignments-plugin',
    async configResolved(config) {
      const env = loadEnv(config.mode, process.cwd(), 'VITE')
      prisma = new PrismaClient({
        datasources: { db: { url: env.VITE_DATABASE_URL } },
      })
      const assignments = await glob.glob('content/**/*.yaml')
      await Promise.all(assignments.map((file) => createAssignment(file, prisma)))
    },
    async handleHotUpdate({ file }) {
      if (file.startsWith(resolve('content')) && file.endsWith('.yaml')) {
        await createAssignment(file, prisma)
      }
    },
  }
}
