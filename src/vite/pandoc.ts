import { exec as execWithCallback } from 'child_process'
import glob from 'fast-glob'
import { existsSync, mkdirSync, readFileSync, statSync } from 'fs'
import { dirname, relative, resolve } from 'path'
import { promisify } from 'util'
import { type Plugin } from 'vite'

const exec = promisify(execWithCallback)

async function generatePage(file: string) {
  const relativePath = relative(resolve('content'), file)
  const outputPath = resolve('src/routes/(generated)', relativePath.replace(/\.md$/, '.tsx'))
  if (existsSync(outputPath) && statSync(outputPath).mtime >= statSync(file).mtime) {
    return
  }
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

async function buildAll() {
  const pages = await glob.glob('content/**/*.md')
  for (const file of pages) {
    generatePage(file)
  }
}

const pandocPlugin = (): Plugin => {
  return {
    name: 'pandoc-plugin',
    buildStart() {
      buildAll()
    },
    async handleHotUpdate({ file }) {
      if (file.endsWith('.md') && file.startsWith(resolve('content'))) {
        generatePage(file)
      }
    },
  }
}

export default pandocPlugin
