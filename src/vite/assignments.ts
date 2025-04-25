import { PrismaClient } from '@prisma/client'
import glob from 'fast-glob'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import yaml from 'js-yaml'
import { dirname, relative, resolve } from 'path'
import { loadEnv, type Plugin } from 'vite'
import { type AssignmentInput } from '~/lib/exercises/assignment'

const options = {
  maxAttempts: 1,
  note: '',
  whiteboard: true,
  streak: 0,
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
  const payload = {
    title: assignment.title,
    prerequisites: {
      connectOrCreate: (assignment.prerequisites ?? []).map((p) => {
        const url = typeof p === 'string' ? p : p.url
        return {
          create: { url, body: [], options },
          where: { url },
        }
      }),
    },
    courses: {
      connectOrCreate: (assignment.courses ?? []).map((code) => ({
        create: { code },
        where: { code },
      })),
    },
  } satisfies Parameters<typeof prisma.assignment.upsert>[0]['update']
  try {
    await prisma.assignment.upsert({
      where: { url },
      create: {
        ...payload,
        url,
        body: [],
        options,
      },
      update: payload,
    })
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
      for (const file of assignments) {
        createAssignment(file, prisma)
      }
    },
    async handleHotUpdate({ file }) {
      if (file.startsWith(resolve('content')) && file.endsWith('.yaml')) {
        createAssignment(file, prisma)
      }
    },
  }
}
