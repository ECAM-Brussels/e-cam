import katex from 'katex'
import 'katex/dist/katex.min.css'

type MathProps = {
  value: string
}

export default function Math(props: MathProps) {
  const html = () => katex.renderToString(props.value)
  return <span innerHTML={html()} />
}
