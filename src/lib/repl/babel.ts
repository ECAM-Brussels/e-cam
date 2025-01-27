import type * as Babel from '@babel/standalone'
import dedent from 'dedent-js'

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

async function babelTransform(code: string, presetNames: string[] = []) {
  const babel = (await import(/* @vite-ignore */ `${cdn}/@babel/standalone`)) as typeof Babel
  const presets = await Promise.all(
    presetNames.map(async (name) => {
      if (name in babel.availablePresets) {
        return babel.availablePresets[name]
      } else {
        return await import(/* @vite-ignore */ `${cdn}/${name}`).then((m) => m.default)
      }
    }),
  )
  return babel.transform(code, { presets, plugins: [importPlugin], filename: 'index.tsx' }).code || ''
}

export async function transform(code: string, framework?: 'react' | 'solid' | 'svelte') {
  let presets: string[] = ['typescript']
  let before: string = ''
  let after: string = ''
  if (framework === 'react') {
    presets = [...presets, 'react']
    before = dedent`
      import React, { useEffect, useState } from "https://esm.sh/react"
    `
    after = dedent`
      import { createRoot } from 'https://esm.sh/react-dom/client';
      const root = createRoot(document.body);
      root.render(React.createElement(App, null));
    `
  } else if (framework === 'solid') {
    presets = [...presets, 'babel-preset-solid']
    after = dedent`
      import { render } from "https://esm.sh/solid-js/web";
      render(App, document.body)
    `
  } else if(framework === 'svelte') {
    const compiler = await import(/* @vite-ignore */ `${cdn}/svelte/compiler`)
    const output = compiler.compile(code, { name: 'Component' })
    const css = output.css.code
    code = output.js.code
    presets = []
    after = dedent`
      import { mount } from 'https://esm.sh/svelte'
      mount(Component, { target: document.body })
      const style = document.createElement('style')
      style.textContent = \`${css}\`
      document.head.appendChild(style)
    `
  }
  code = await babelTransform(code, presets)

  return dedent`
    const _logs = []
    const _node = document.createElement('pre')
    document.body.appendChild(_node)
    console.log = function (...args) {
      _logs.push(args.join(' '))
      _node.innerText = _logs.join('\\n')
    }
    ${before}
    ${code}
    ${after}
  `
}