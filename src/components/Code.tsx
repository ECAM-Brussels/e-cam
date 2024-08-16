import { clientOnly } from '@solidjs/start'
import { Show } from 'solid-js'
import 'solid-prism-editor/layout.css'
import 'solid-prism-editor/prism/languages/common'
import 'solid-prism-editor/search.css'
import 'solid-prism-editor/themes/github-dark.css'

type CodeProps = {
  lang: string
  run?: boolean
  value: string
}

const Editor = clientOnly(async () => {
  const module = await import('solid-prism-editor')
  return { default: module.Editor }
})
const Python = clientOnly(() => import('./Python'))

export default function Code(props: CodeProps) {
  return (
    <>
      <Editor language={props.lang} value={props.value} />
      <Show when={props.lang === 'python' && props.run}>
        <Python value={props.value} />
      </Show>
    </>
  )
}