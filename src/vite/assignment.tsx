import { createAsync, useLocation, useSearchParams, type RouteDefinition } from '@solidjs/router'
import { Show } from 'solid-js'
import ExerciseSequence, { loadAssignment } from '~/components/ExerciseSequence'
import Page from '~/components/Page'
import Results, { loadResults } from '~/components/Results'
import { getUser } from '~/lib/auth/session'

export const route = {
  load: ({ location }) => {
    const search = new URLSearchParams(location.search)
    if (search.get('results')) {
      loadResults(location.pathname, '')
    } else {
      loadAssignment(location.pathname)
    }
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
        fallback={
          <>
            <ExerciseSequence
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
