import { exec as execWithCallback } from 'child_process'
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
        try {
          const { stderr } = await exec(
            `pandoc "${file}" -o "${outputPath}" -t html --template src/vite/template.tsx --wrap=preserve`,
          )
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
