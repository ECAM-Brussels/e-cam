import dedent from 'dedent-js'
import { type JSXElement } from 'solid-js'
import Html from '~/components/Html'

type JavascriptProps = {
  value: string
  framework?: 'react'
}

function fixImports(code: string): string {
  code = code.replace(
    /(import\s+(\w+,?\s*)?(\{[^}]*\})?\s*(from\s*)?)['"](.+)['"]\s*;?/gm,
    (_, begin, __, ___, ____, packageName) => `${begin}'${packageName}';`,
  )
  return code
}

export default function Javascript(props: JavascriptProps) {
  const code = () => {
    if (props.framework === 'react') {
      return dedent`
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <div id="app">
        </div>
        <script type="text/babel" data-presets="react" data-type="module">
        import React, { useState, useEffect, useMemo } from 'https://esm.sh/react';
        import ReactDOM from 'https://esm.sh/react-dom';
        ${fixImports(props.value)}
        const root = ReactDOM.createRoot(document.getElementById('app'));
        root.render(React.createElement(App, null));
        </script>
      `
    }
    return props.value
  }
  return <Html value={code()} />
}
