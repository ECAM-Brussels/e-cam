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
      <Show when={!user()}>
        <div class="border rounded-xl border-red-900 text-red-900 p-4 mb-4">
          <p class="mb-4">
            Vous n'êtes pas connecté·e. Votre progrès ne sera pas sauvegardé. Êtes-vous sûr·e de
            vouloir continuer?
          </p>
          <p>
            <a href="/auth/login" class="underline">
              Se connecter
            </a>{' '}
            avec son compte ECAM vous permet aussi de soutenir le projet et nous permettre de voir
            comment mieux vous aider.
          </p>
        </div>
      </Show>
      <Show when={user()?.admin}>
        <div class="mb-8 text-sm text-gray-600 border-b flex">
          <a
            class="block px-4 py-2 ml-4 border-sky-800"
            classList={{ 'border-b-4': !searchParams.results }}
            href="?"
          >
            Exercices
          </a>
          <a
            class="block px-4 py-2 border-sky-800"
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
              userEmail={searchParams.userEmail as string}
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
