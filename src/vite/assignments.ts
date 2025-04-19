import glob from 'fast-glob'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import yaml from 'js-yaml'
import { dirname, relative, resolve } from 'path'
import { type Plugin } from 'vite'

async function createAssignment(file: string) {
  const relativePath = relative(resolve('content'), file)
  const outputPath = resolve('src/routes/(generated)', relativePath.replace(/\.ya?ml$/, '.tsx'))
  mkdirSync(dirname(outputPath), { recursive: true })
  const assignment = yaml.load(readFileSync(file, 'utf-8')) as { title: string }
  const template = readFileSync(resolve('src/vite/template.assignment.tsx'), 'utf-8')
  let content = template.replace('$body$', JSON.stringify(assignment, null, 2))
  content = content.replace('$route$', file)
  writeFileSync(outputPath, content, 'utf-8')
}

export default function (): Plugin {
  return {
    name: 'assignments-plugin',
    async buildStart() {
      const assignments = await glob.glob('content/**/*.yaml')
      for (const file of assignments) {
        createAssignment(file)
      }
    },
    async handleHotUpdate({ file }) {
      if (file.startsWith(resolve('content')) && file.endsWith('.yaml')) {
        createAssignment(file)
      }
    },
  }
}
