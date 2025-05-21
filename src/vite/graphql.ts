import { exec as execWithCallback } from 'child_process'
import { promisify } from 'util'
import { type Plugin } from 'vite'

const exec = promisify(execWithCallback)

export default (): Plugin => {
  return {
    name: 'graphql-plugin',
    async handleHotUpdate({ file, read }) {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const content = await read()
        if (content.includes(`graphql(`)) {
          await exec('npx graphql-codegen')
        }
      }
    },
  }
}
