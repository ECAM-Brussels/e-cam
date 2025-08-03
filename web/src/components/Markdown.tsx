import { micromark } from 'micromark'
import { math, mathHtml } from 'micromark-extension-math'

type MarkdownProps = {
  class?: string
  value: string
  noprose?: boolean
}

export default function Markdown(props: MarkdownProps) {
  const html = () =>
    micromark(props.value, {
      extensions: [math()],
      htmlExtensions: [mathHtml()],
    })
  return (
    <span
      class={`max-w-none ${props.class}`}
      classList={{ prose: !props.noprose }}
      innerHTML={html()}
    />
  )
}
