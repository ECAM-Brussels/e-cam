import { type ExerciseProps } from '../components/ExerciseSequence'
import { encrypt } from '../lib/cryptography'
import { wrapCode } from '../lib/helpers'
import { PrismaClient } from '@prisma/client'
import { exec as execWithCallback, spawn } from 'child_process'
import dedent from 'dedent-js'
import glob from 'fast-glob'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, relative, resolve } from 'path'
import { transpile } from 'typescript'
import { promisify } from 'util'
import { type Plugin, loadEnv } from 'vite'

const exec = promisify(execWithCallback)

function python(code: string) {
  return new Promise((resolve, reject) => {
    const process = spawn('python', ['-c', code])

    let stdout = ''
    let stderr = ''

    process.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    process.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    process.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Process exited with code ${code}: ${stderr}`))
      } else {
        resolve(stdout.trim())
      }
    })
  })
}

async function generatePage(file: string) {
  const relativePath = relative(resolve('content'), file)
  const outputPath = resolve('src/routes/(generated)', relativePath.replace(/\.md$/, '.tsx'))
  mkdirSync(dirname(outputPath), { recursive: true })

  const metaFile = `${outputPath}.json`
  let template
  try {
    await exec(`pandoc "${file}" -t html5 -o "${metaFile}" --template src/vite/template.json.txt`)
    const meta = JSON.parse(readFileSync(metaFile, 'utf-8'))
    template = meta.slideshow ? 'template.slideshow.tsx' : 'template.tsx'
  } catch (error) {
    console.error(`Error when generating metadata file: ${error}`)
  }

  let cmd = [
    `pandoc "${file}"`,
    `-o "${outputPath}"`,
    '-t html5',
    `--template src/vite/${template}`,
    '--wrap=preserve',
    `-V imports="${await generateImports()}"`,
  ]

  const filters = await glob.glob('src/vite/filters/*.py')
  for (const filter of filters) {
    cmd.push(`--filter ${filter}`)
  }

  try {
    const { stderr } = await exec(cmd.join(' '))
    if (stderr) {
      console.log(`Error converting ${file} to ${outputPath}:`, stderr)
    }
  } catch (error) {
    console.error('Error while converting with pandoc:', error)
  }
}

async function createAssignment(file: string, passphrase: string, prisma: PrismaClient) {
  const relativePath = relative(resolve('content'), file)
  const outputPath = resolve('src/routes/(generated)', relativePath.replace(/\.ts$/, '.tsx'))
  mkdirSync(dirname(outputPath), { recursive: true })
  const contents = String(readFileSync(file, 'utf-8'))
  const assignment = eval(transpile(contents)) as ExerciseProps
  const url = file.replace('/index.ts', '').replace('.ts', '').replace('content', '')
  const title = assignment.title || ''
  try {
    await prisma.page.upsert({ where: { url }, update: { title }, create: { url, title } })
  } catch {
    console.log('Upsert failed')
  }
  for (const exercise of assignment.data) {
    if (exercise.type === 'Simple' && exercise.state) {
      exercise.state.answer = encrypt(exercise.state.answer, passphrase)
      exercise.state.question = dedent(exercise.state.question)
    } else if (exercise.type === 'Python' && exercise.state) {
      let code = dedent(exercise.state.answer)
      if (exercise.state.wrap) {
        code = wrapCode(code)
      }
      let results = await Promise.all(
        exercise.state.tests.map((test) => python(`${code}\n\nprint(${test})`)),
      )
      exercise.state.answer = encrypt(JSON.stringify(results), passphrase)
    }
  }
  const template = String(readFileSync(resolve('src/vite/assignment.tsx'), 'utf-8'))
  const content = template.replace('$body$', JSON.stringify(assignment, null, 2))
  writeFileSync(outputPath, content, 'utf-8')
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
    const type = ['Math', 'Plot', 'PrismEditor'].includes(name) ? 'clientOnly' : 'lazy'
    imports += `const ${name} = ${type}(() => import('~/components/${name}'))\n`
  }
  return imports
}

async function buildAll(passphrase: string, prisma: PrismaClient) {
  const pages = await glob.glob('content/**/*.md')
  for (const file of pages) {
    generatePage(file)
  }
  const assignments = await glob.glob('content/**/*.ts')
  for (const file of assignments) {
    createAssignment(file, passphrase, prisma)
  }
}

const pandocPlugin = (): Plugin => {
  let passphrase = ''
  let prisma: PrismaClient
  return {
    name: 'pandoc-plugin',
    buildStart() {
      buildAll(passphrase, prisma)
    },
    configResolved(config) {
      const env = loadEnv(config.mode, process.cwd(), 'VITE')
      passphrase = env.VITE_PASSPHRASE
      prisma = new PrismaClient({
        datasources: {
          db: {
            url: env.VITE_DATABASE_URL,
          },
        },
      })
    },
    async handleHotUpdate({ file }) {
      if (file.startsWith(resolve('src/vite'))) {
        buildAll(passphrase, prisma)
      }
      if (file.endsWith('.ts') && file.startsWith(resolve('content'))) {
        createAssignment(file, passphrase, prisma)
      }
      if (file.endsWith('.md') && file.startsWith(resolve('content'))) {
        generatePage(file)
      }
    },
  }
}

export default pandocPlugin
