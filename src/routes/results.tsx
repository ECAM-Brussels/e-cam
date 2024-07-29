import { type RouteDefinition } from '@solidjs/router'
import Page from '~/components/Page'
import Results, { loadResults } from '~/components/Results'

export const route = {
  load: () => loadResults('/'),
} satisfies RouteDefinition

export default function Home() {
  return (
    <Page>
      <a href="/">Home</a>
      <Results url="/" />
    </Page>
  )
}
