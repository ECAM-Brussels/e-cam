import dedent from 'dedent-js'
import { createResource } from 'solid-js'
import Html, { type Props } from '~/components/Html'
import { transform } from '~/lib/repl/babel'

type JavascriptProps = Props & {
  framework?: 'react' | 'solid'
}

function fixCode(code: string): string {
  code = code.replace(
    /(import\s+(\w+,?\s*)?(\{[^}]*\})?\s*(from\s*)?)['"](.+)['"]\s*;?/gm,
    (_, begin, __, ___, ____, packageName) => `${begin}'${packageName}';`,
  )
  const prefix = dedent`
    const _logs = []
    const _node = document.createElement('pre')
    document.body.appendChild(_node)
    console.log = function (...args) {
      _logs.push(args.join(' '))
      _node.innerText = _logs.join('\\n')
    }

  `
  return prefix + code
}

export default function Javascript(props: JavascriptProps) {
  const [code] = createResource(() => props.value, async (value: string): Promise<string> => {
    if (props.framework === 'react') {
      return dedent`
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <div id="app">
        </div>
        <script type="text/babel" data-presets="react" data-type="module">
        import React, { useState, useEffect, useMemo } from 'https://esm.sh/react@18';
        import ReactDOM from 'https://esm.sh/react-dom@18';
        ${fixCode(value)}
        const root = ReactDOM.createRoot(document.getElementById('app'));
        root.render(React.createElement(App, null));
        </script>
      `
    } else if (props.framework === 'solid') {
      value = (await transform(value, { presets: ['babel-preset-solid'] })) || ''
      return dedent`
        <script type="module">
        import { createSignal } from "https://esm.sh/solid-js"
        ${value}
        import { render } from "https://esm.sh/solid-js/web";
        render(App, document.body)
        </script>
      `
    }
    return dedent`
      <script>
      ${fixCode(value)}
      </script>
    `
  })
  return <Html {...props} value={code() || ''} />
}
