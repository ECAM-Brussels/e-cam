import { Editor } from 'solid-prism-editor'
import 'solid-prism-editor/layout.css'
import 'solid-prism-editor/prism/languages/common'
import 'solid-prism-editor/search.css'
import { basicSetup } from 'solid-prism-editor/setups'
import 'solid-prism-editor/themes/github-light.css'

export default function PrismEditor(props: Parameters<typeof Editor>[0]) {
  return <Editor extensions={basicSetup} tabSize={props.language === 'python' ? 4 : 2} {...props} />
}
