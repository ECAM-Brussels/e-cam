import { PrismaClient } from '@prisma/client'
import glob from 'fast-glob'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import yaml from 'js-yaml'
import { dirname, relative, resolve } from 'path'
import { loadEnv, type Plugin } from 'vite'

async function createAssignment(file: string, prisma: PrismaClient) {
  const relativePath = relative(resolve('content'), file)
  const outputPath = resolve('src/routes/(generated)', relativePath.replace(/\.ya?ml$/, '.tsx'))
  mkdirSync(dirname(outputPath), { recursive: true })
  const assignment = yaml.load(readFileSync(file, 'utf-8')) as { title: string }
  const template = readFileSync(resolve('src/vite/template.assignment.tsx'), 'utf-8')
  let content = template.replace('$body$', JSON.stringify(assignment, null, 2))
  content = content.replace('$route$', file)
  writeFileSync(outputPath, content, 'utf-8')
  const title = assignment.title || ''

  const url = file.replace('/index.yaml', '').replace('.yaml', '').replace('content', '')
  try {
    await prisma.page.upsert({ where: { url }, update: { title }, create: { url, title } })
  } catch (error) {
    console.log(`Upsert ${url} failed: ${error}`)
  }
}

export default function (): Plugin {
  let prisma: PrismaClient
  return {
    name: 'assignments-plugin',
    async buildStart() {
      const assignments = await glob.glob('content/**/*.yaml')
      for (const file of assignments) {
        createAssignment(file, prisma)
      }
    },
    configResolved(config) {
      const env = loadEnv(config.mode, process.cwd(), 'VITE')
      prisma = new PrismaClient({
        datasources: {
          db: {
            url: env.VITE_DATABASE_URL,
          },
        },
      })
    },
    async handleHotUpdate({ file }) {
      if (file.startsWith(resolve('content')) && file.endsWith('.yaml')) {
        console.log('hello')
        createAssignment(file, prisma)
      }
    },
  }
}
