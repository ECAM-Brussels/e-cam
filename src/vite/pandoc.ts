import { exec as execWithCallback } from 'child_process'
import glob from 'fast-glob'
import { mkdirSync } from 'fs'
import { dirname, relative, resolve } from 'path'
import { promisify } from 'util'
import { type Plugin } from 'vite'

const exec = promisify(execWithCallback)

const pandocPlugin = (): Plugin => {
  return {
    name: 'pandoc-plugin',
    async handleHotUpdate({ file }) {
      if (file.endsWith('.md') && file.startsWith(resolve('content'))) {
        const relativePath = relative(resolve('content'), file)
        const outputPath = resolve('src/routes/(generated)', relativePath.replace(/\.md$/, '.tsx'))
        mkdirSync(dirname(outputPath), { recursive: true })

        let cmd = [
          `pandoc "${file}"`,
          `-o "${outputPath}"`,
          '-t html',
          '--template src/vite/template.tsx',
          '--wrap=preserve',
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
    },
  }
}

export default pandocPlugin
