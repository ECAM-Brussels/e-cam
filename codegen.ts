import type { CodegenConfig } from '@graphql-codegen/cli'

let url = process.env.VITE_GRAPHQL_URL ?? 'http://symapi:8000/graphql'

const config: CodegenConfig = {
  overwrite: true,
  documents: ['src/**/*.ts', 'src/**/*.tsx'],
  schema: url,
  emitLegacyCommonJSImports: false,
  generates: {
    './src/gql/': {
      preset: 'client',
      config: {
        scalars: { Math: { input: 'string', output: 'string' } },
      },
    },
  },
}

export default config
