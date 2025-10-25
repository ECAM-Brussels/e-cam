import assignmentPlugin from './src/vite/assignments'
import graphqlPlugin from './src/vite/graphql'
import pandocPlugin from './src/vite/pandoc'
import { defineConfig } from '@solidjs/start/config'

export default defineConfig({
  vite({ router }) {
    return {
      plugins: [pandocPlugin(), assignmentPlugin(), graphqlPlugin()],
      server: {
        watch: {
          paths: ['content/**'],
        },
        hmr:
          router === 'client'
            ? {
                port: 4000,
              }
            : undefined,
      },
      worker: {
        format: 'es',
      },
    }
  },
  server: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    experimental: {
      websocket: true,
    },
  },
}).addRouter({
  name: 'ws',
  type: 'http',
  handler: './src/ws.ts',
  target: 'server',
  base: '/ws',
})
