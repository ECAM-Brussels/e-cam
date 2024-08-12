import { createAsync, useLocation, useSearchParams, type RouteDefinition } from '@solidjs/router'
import { Show } from 'solid-js'
import ExerciseSequence, { loadAssignment } from '~/components/ExerciseSequence'
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
  const location = useLocation()
  const user = createAsync(() => getUser())
  const [searchParams] = useSearchParams()
  return (
    <Page>
      <Show
        when={searchParams.results && user()?.admin}
        fallback={<ExerciseSequence data={
          // @ts-ignore
          $body$
        } />}
      >
        <Results url={location.pathname} />
      </Show>
    </Page>
  )
}
