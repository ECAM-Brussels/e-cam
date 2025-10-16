import { safeStat } from './assignments'
import { PrismaClient } from '@prisma/client'
import { exec as execWithCallback } from 'child_process'
import glob from 'fast-glob'
import { mkdir, readFile } from 'fs/promises'
import yaml from 'js-yaml'
import { dirname, relative, resolve } from 'path'
import { promisify } from 'util'
import { type Plugin } from 'vite'
import { z } from 'zod'

const exec = promisify(execWithCallback)

const metadataSchema = z.object({
  title: z.string().or(z.null()).default(null),
  description: z.string().or(z.null()).default(null),
  slideshow: z.boolean().default(false),
})

async function extractMetadata(file: string) {
  const content = await readFile(file, 'utf-8')
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/)
  if (!match) return null
  try {
    const metadata = metadataSchema.parse(yaml.load(match[1]))
    return metadata
  } catch (err) {
    console.error('Failed to parse YAML:', err)
    return null
  }
}

async function generatePage(file: string, prisma: PrismaClient, force: boolean = false) {
  const relativePath = relative(resolve('content'), file)
  let outputPath = resolve('src/routes/(generated)', relativePath.replace(/\.md$/, '.tsx'))
  await mkdir(dirname(outputPath), { recursive: true })

  let template
  const meta = await extractMetadata(file)
  template = meta?.slideshow ? 'template.slideshow.tsx' : 'template.tsx'
  if (meta?.slideshow) {
    outputPath = outputPath.replace('.tsx', '/[[slide]]/[[board]].tsx')
    await mkdir(dirname(outputPath), { recursive: true })
  }
  if (meta) {
    const url = '/' + relativePath.replace(/(\/index)?\.md/, '')
    const payload = { title: meta.title, description: meta.description }
    await prisma.page.upsert({
      where: { url },
      create: { ...payload, url },
      update: payload,
    })
  }

  let cmd = [
    `pandoc "${file}"`,
    `-o "${outputPath}"`,
    '-t html5',
    `--template src/vite/${template}`,
    '--wrap=preserve',
    `-V title="${meta?.title}"`,
    `-V imports="${await generateImports()}"`,
  ]

  const filters = await glob.glob('src/vite/filters/*.py')
  for (const filter of filters) {
    cmd.push(`--filter ${filter}`)
  }

  try {
    const [inStat, outStat] = await Promise.all([safeStat(file), safeStat(outputPath)])
    if (!force && outStat.mtime !== 0 && outStat.mtime >= inStat.mtime) {
      return
    }
  } catch {}

  console.log(`Converting ${file}...`)
  try {
    const { stderr } = await exec(cmd.join(' '))
    if (stderr) {
      console.log(`Error converting ${file} to ${outputPath}:`, stderr)
    }
  } catch (error) {
    console.error(`Error while converting ${file} with pandoc:`, error)
  }
}

async function generateImports() {
  const components = await glob.glob('src/components/*.tsx')
  let imports = ''
  for (const component of components) {
    const name = component.split('/').at(-1)!.replace('.tsx', '')
    if (
      name === 'Slideshow' ||
      name === 'Page' ||
      name === 'MetaProvider' ||
      name.endsWith('.test') ||
      name.endsWith('.server')
    ) {
      continue
    }
    const type = ['Graph', 'Math', 'Plot', 'PrismEditor'].includes(name) ? 'clientOnly' : 'lazy'
    imports += `const ${name} = ${type}(() => import('~/components/${name}'))\n`
  }
  return imports
}

async function buildAll(prisma: PrismaClient, force = false) {
  const pages = await glob.glob('content/**/*.md')
  for (const file of pages) {
    generatePage(file, prisma, force)
  }
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const pandocPlugin = (): Plugin => {
  let prisma: PrismaClient
  return {
    name: 'pandoc-plugin',
    async buildStart() {
      prisma =
        globalForPrisma.prisma ||
        new PrismaClient({
          datasources: { db: { url: process.env.DATABASE_URL } },
        })
      if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
      const force = process.env.NODE_ENV !== 'development'
      await buildAll(prisma, force)
    },
    async handleHotUpdate({ file }) {
      if (file.endsWith('.md') && file.startsWith(resolve('content'))) {
        generatePage(file, prisma, true)
      }
    },
  }
}

export default pandocPlugin
