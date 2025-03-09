import { createEffect } from 'solid-js'
import { Editor } from 'solid-prism-editor'
import 'solid-prism-editor/layout.css'
import 'solid-prism-editor/prism/languages/common'
import 'solid-prism-editor/search.css'
import { basicSetup } from 'solid-prism-editor/setups'
import 'solid-prism-editor/themes/github-light.css'

export default function PrismEditor(props: Parameters<typeof Editor>[0] & { name: string }) {
  let textarea: HTMLTextAreaElement
  createEffect(() => {
    if (textarea && props.name) {
      textarea.name = props.name
    }
  })
  return (
    <Editor
      extensions={basicSetup}
      tabSize={props.language === 'python' ? 4 : 2}
      {...props}
      onMount={(editor) => {
        textarea = editor.textarea
      }}
    />
  )
}
