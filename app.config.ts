import assignmentPlugin from './src/vite/assignments'
import pandocPlugin from './src/vite/pandoc'
import { defineConfig } from '@solidjs/start/config'

export default defineConfig({
  vite: {
    plugins: [pandocPlugin(), assignmentPlugin()],
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
