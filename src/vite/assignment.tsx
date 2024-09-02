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
            <Show when={user()?.admin}>
              <p class="mt-8 text-center">
                <a class="rounded-xl bg-green-900 px-3 py-2 text-green-100" href="?results=true">
                  Résultats
                </a>
              </p>
            </Show>
          </>
        }
      >
        <Results url={location.pathname} />
        <Show when={user()?.admin}>
          <p class="mt-8 text-center">
            <a class="rounded-xl bg-green-900 px-3 py-2 text-green-100" href="?">
              Voir le travail
            </a>
          </p>
        </Show>
      </Show>
    </Page>
  )
}
