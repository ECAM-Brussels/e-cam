import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  documents: ['src/**/*.ts', 'src/**/*.tsx'],
  schema: './symapi/generated/schema.graphql',
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
