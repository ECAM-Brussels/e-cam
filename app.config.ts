import assignmentPlugin from './src/vite/assignments'
import graphqlPlugin from './src/vite/graphql'
import pandocPlugin from './src/vite/pandoc'
import { defineConfig } from '@solidjs/start/config'

export default defineConfig({
  vite: {
    plugins: [pandocPlugin(), assignmentPlugin(), graphqlPlugin()],
    server: {
      watch: {
        paths: ['content/**'],
      },
    },
    worker: {
      format: 'es',
    },
  },
})
