import { createAsync, useLocation, useSearchParams, type RouteDefinition } from '@solidjs/router'
import { Show } from 'solid-js'
import ExerciseSequence from '~/components/ExerciseSequence'
import { loadAssignment } from '~/components/ExerciseSequence.server'
import Page from '~/components/Page'
import Results, { loadResults } from '~/components/Results'
import { getUser } from '~/lib/auth/session'

export const route = {
  load: ({ location }) => {
    const search = new URLSearchParams(location.search)
    if (search.get('results')) {
      loadResults(location.pathname, '')
    } else {
      loadAssignment(location.pathname, '', search.get('userEmail') || '')
    }
    getUser()
  },
} satisfies RouteDefinition

export default function () {
  const location = useLocation()
  const user = createAsync(() => getUser())
  const [searchParams, setSearchParams] = useSearchParams()
  return (
    <Page>
      <Show when={user()?.admin}>
        <div class="mb-8 text-sm text-gray-600">
          <a class="px-4 py-2 ml-4" classList={{ 'border-b-4': !searchParams.results }} href="?">
            Exercices
          </a>
          <a
            class="px-4 py-2"
            classList={{ 'border-b-4': searchParams.results !== undefined }}
            href="?results=true"
          >
            Résultats
          </a>
        </div>
      </Show>
      <Show
        when={searchParams.results && user()?.admin}
        fallback={
          <>
            <ExerciseSequence
              index={parseInt(searchParams.exercise || '1') - 1}
              onIndexChange={(index) => {
                setSearchParams({ exercise: index + 1 })
              }}
              {
                // @ts-ignore
                ...$body$
              }
            />
          </>
        }
      >
        <Results url={location.pathname} />
      </Show>
    </Page>
  )
}
