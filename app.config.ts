import pandocPlugin from './src/vite/pandoc'
import { defineConfig } from '@solidjs/start/config'

export default defineConfig({
  server: {
    experimental: {
      websocket: true,
    }
  },
  vite: {
    plugins: [pandocPlugin()],
    server: {
      watch: {
        paths: ['content/**'],
      },
    },
    worker: {
      format: 'es',
    }
  },
})
