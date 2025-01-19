import Spinner from './Spinner'
import { createAsync } from '@solidjs/router'
import mermaid from 'mermaid'
import { createUniqueId, Suspense } from 'solid-js'

type MermaidProps = {
  class?: string
  value: string
}

export default function Mermaid(props: MermaidProps) {
  const svg = createAsync(async () => {
    const { svg } = await mermaid.render(createUniqueId(), props.value)
    return svg
  })

  return (
    <Suspense fallback={<Spinner />}>
      <img
        class={`no-prose max-w-[750px] ${props.class}`}
        src={`data:image/svg+xml,${encodeURIComponent(svg() || '')}`}
      />
    </Suspense>
  )
}
