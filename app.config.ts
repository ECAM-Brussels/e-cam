import pandocPlugin from './src/vite/pandoc'
import { defineConfig } from '@solidjs/start/config'

export default defineConfig({
  vite: {
    plugins: [pandocPlugin()],
    server: {
      watch: {
        paths: ['content/**'],
      },
    },
  },
})
