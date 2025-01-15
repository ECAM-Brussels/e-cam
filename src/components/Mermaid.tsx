import Spinner from './Spinner'
import mermaid from 'mermaid'
import { createResource, createUniqueId, Suspense } from 'solid-js'

type MermaidProps = {
  class?: string
  value: string
}

export default function Mermaid(props: MermaidProps) {
  const [svg] = createResource(
    () => props.value,
    async (value) => {
      const { svg } = await mermaid.render(createUniqueId(), value)
      return svg
    },
  )

  return (
    <Suspense fallback={<Spinner />}>
      <img
        class={`no-prose max-w-[750px] ${props.class}`}
        src={`data:image/svg+xml,${encodeURIComponent(svg() || '')}`}
      />
    </Suspense>
  )
}
