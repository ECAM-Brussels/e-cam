import { exec as execWithCallback } from 'child_process'
import glob from 'fast-glob'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, relative, resolve } from 'path'
import { promisify } from 'util'
import { type Plugin } from 'vite'

const exec = promisify(execWithCallback)

async function generatePage(file: string) {
  const relativePath = relative(resolve('content'), file)
  const outputPath = resolve('src/routes/(generated)', relativePath.replace(/\.md$/, '.tsx'))
  mkdirSync(dirname(outputPath), { recursive: true })

  const metaFile = `${outputPath}.json`
  await exec(`pandoc "${file}" -t html5 -o "${metaFile}" --template src/vite/template.json.txt`)
  const meta = JSON.parse(readFileSync(metaFile, 'utf-8'))
  const template = meta.slideshow ? 'template.slideshow.tsx' : 'template.tsx'

  let cmd = [
    `pandoc "${file}"`,
    `-o "${outputPath}"`,
    '-t html5',
    `--template src/vite/${template}`,
    '--wrap=preserve',
    `-V imports="${await generateImports()}"`
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

async function createAssignment(file: string) {
  const relativePath = relative(resolve('content'), file)
  const outputPath = resolve('src/routes/(generated)', relativePath.replace(/\.ts$/, '.tsx'))
  mkdirSync(dirname(outputPath), { recursive: true })
  const data = String(readFileSync(file, 'utf-8'))
  const template = String(readFileSync(resolve('src/vite/assignment.tsx'), 'utf-8'))
  const content = template.replace('$body$', data)
  writeFileSync(outputPath, content, 'utf-8')
}

async function generateImports() {
  const components = await glob.glob('src/components/*.tsx')
  let imports = ''
  for(const component of components) {
    const name = component.split('/').at(-1)!.replace('.tsx', '')
    if (name === 'Slideshow' || name === 'Page' || name.endsWith('.test')) {
      continue
    }
    const type = name === 'Math' ? 'clientOnly' : 'lazy'
    imports += `const ${name} = ${type}(() => import('~/components/${name}'))\n`
  }
  return imports
}

const pandocPlugin = (): Plugin => {
  return {
    name: 'pandoc-plugin',
    async handleHotUpdate({ file }) {
      if (file.startsWith(resolve('src/vite'))) {
        const pages = await glob.glob('content/**/*.md')
        for (const file of pages) {
          generatePage(file)
        }
        const assignments = await glob.glob('content/**/*.ts')
        for (const file of assignments) {
          createAssignment(file)
        }
      }
      if (file.endsWith('.ts') && file.startsWith(resolve('content'))) {
        createAssignment(file)
      }
      if (file.endsWith('.md') && file.startsWith(resolve('content'))) {
        generatePage(file)
      }
    },
  }
}

export default pandocPlugin
