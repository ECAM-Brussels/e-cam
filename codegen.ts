import type { CodegenConfig } from '@graphql-codegen/cli'

const url = 'http://localhost:8000/graphql'

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
