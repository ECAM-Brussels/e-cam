import type { CodegenConfig } from '@graphql-codegen/cli'

const url = 'http://127.0.0.1:8000/graphql'

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
