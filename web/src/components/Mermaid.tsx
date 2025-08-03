import Spinner from './Spinner'
import { createAsync } from '@solidjs/router'
import mermaid from 'mermaid'
import { createUniqueId, Show, Suspense } from 'solid-js'

type MermaidProps = {
  class?: string
  value: string
}

export default function Mermaid(props: MermaidProps) {
  const svg = createAsync(async () => {
    try {
      const { svg } = await mermaid.render(createUniqueId(), props.value)
      return svg
    } catch {
      return null
    }
  })

  return (
    <Suspense fallback={<Spinner />}>
      <Show when={svg()}>
        <img
          class={`no-prose max-w-[750px] ${props.class}`}
          src={`data:image/svg+xml,${encodeURIComponent(svg() || '')}`}
        />
      </Show>
    </Suspense>
  )
}
