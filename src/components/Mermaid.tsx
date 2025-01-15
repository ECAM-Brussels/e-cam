import Html from './Html'
import Spinner from './Spinner'
import mermaid from 'mermaid'
import { createResource, createUniqueId, Suspense } from 'solid-js'

interface MermaidProps {
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
      <Html value={svg() || ''} />
    </Suspense>
  )
}
