import { createAsync, useLocation, useSearchParams, type RouteDefinition } from '@solidjs/router'
import { Show } from 'solid-js'
import { createStore } from 'solid-js/store'
import ExerciseSequence, { loadAssignment, type Exercise } from '~/components/ExerciseSequence'
import Page from '~/components/Page'
import Results from '~/components/Results'
import { getUser } from '~/lib/auth/session'

export const route = {
  load: ({ location }) => {
    loadAssignment(location.pathname)
    getUser()
  },
} satisfies RouteDefinition

export default function () {
  // @ts-ignore
  const [data, setData] = createStore<Exercise[]>($body$)
  const location = useLocation()
  const user = createAsync(() => getUser())
  const [searchParams, setSearchParams] = useSearchParams()
  return (
    <Page>
      <Show
        when={searchParams.results && user()?.admin}
        fallback={<ExerciseSequence data={data} setter={setData} />}
      >
        <Results url={location.pathname} />
      </Show>
    </Page>
  )
}
