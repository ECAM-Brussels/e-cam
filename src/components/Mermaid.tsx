import Spinner from './Spinner'
import mermaid from 'mermaid'
import { createResource, createUniqueId, Suspense } from 'solid-js'

type MermaidProps = {
  class?: string
  value: string
}

export default function Mermaid(props: MermaidProps) {
  const [svg] = createResource(
    () => [props.value, props.class],
    async ([value, cls]) => {
      const { svg } = await mermaid.render(createUniqueId(), value || '')
      return svg.replace('<svg', `<svg class="${cls}"`)
    },
  )

  return (
    <Suspense fallback={<Spinner />}>
      <span innerHTML={svg()} />
    </Suspense>
  )
}
