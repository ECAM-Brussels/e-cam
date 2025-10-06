import { useLocation } from '@solidjs/router'
import Graph from '~/components/Graph'
import Page from '~/components/Page'

export default function () {
  const location = useLocation()
  return (
    <Page title="Hello">
      <Graph class="min-h-[600px]" query={{ url: { startsWith: location.pathname } }} />
    </Page>
  )
}
