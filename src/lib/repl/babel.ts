import type * as Babel from '@babel/standalone'
import dedent from 'dedent-js'

type Options = {
  framework?: 'react' | 'solidjs' | 'svelte'
  babel?: Promise<typeof Babel>
  presets?: string[]
}

const cdn = 'https://esm.sh'

function importPlugin() {
  function transformImportee(importee: string) {
    return `https://esm.sh/${importee}`
  }
  return {
    visitor: {
      Import(path: any) {
        const importee: string = path.parent.arguments[0].value
        path.parent.arguments[0].value = transformImportee(importee)
      },
      ImportDeclaration(path: any) {
        const importee: string = path.node.source.value
        path.node.source.value = transformImportee(importee)
      },
      ExportAllDeclaration(path: any) {
        const importee: string = path.node.source.value
        path.node.source.value = transformImportee(importee)
      },
      ExportNamedDeclaration(path: any) {
        const importee: string = path.node.source?.value
        if (importee) {
          path.node.source.value = transformImportee(importee)
        }
      },
    },
  }
}

export async function transform(code: string, options: Options = {}) {
  const babel = await (options.babel ||
    (import(/* @vite-ignore */ `${cdn}/@babel/standalone`) as Promise<typeof Babel>))

  const presets = await Promise.all(
    (options.presets || []).map(async (name) => {
      if (name in babel.availablePresets) {
        return babel.availablePresets[name]
      } else {
        return await import(/* @vite-ignore */ `${cdn}/${name}`).then((m) => m.default)
      }
    }),
  )

  code = babel.transform(code, { presets, plugins: [importPlugin] }).code || ''
  return code
}

export async function svelteTransform(code: string) {
  const compiler = await import(/* @vite-ignore */`${cdn}/svelte/compiler`)
  code = compiler.compile(code, { name: 'Component' }).js.code
  code = await transform(code, {})
  return code
}