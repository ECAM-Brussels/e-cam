import {
  createAsync,
  query,
  useLocation,
  useSearchParams,
  type RouteDefinition,
} from '@solidjs/router'
import { Show } from 'solid-js'
import Assignment from '~/components/Assignment'
import Page from '~/components/Page'
import { getUser } from '~/lib/auth/session'
import { getAssignment, getExercises } from '~/lib/exercises/assignment'

const getOriginalAssignment = query((url: string) => {
  'use server'
  return getAssignment({
    /** @ts-ignore */
    ...$body$,
    url,
  })
}, 'getOriginalAssignment')

export const route = {
  async preload({ location }) {
    const [user, _original] = await Promise.all([
      getUser(),
      getOriginalAssignment(location.pathname),
    ])
    if (user) {
      getExercises(location.pathname, user.email)
    }
  },
} satisfies RouteDefinition

export default function () {
  const location = useLocation()
  const assignment = createAsync(() => getOriginalAssignment(location.pathname))
  const user = createAsync(() => getUser())
  const [searchParams, setSearchParams] = useSearchParams()
  const userEmail = () => (searchParams.userEmail as string) ?? user()?.email
  return (
    <Show when={assignment()}>
      {(assignment) => (
        <Page title={assignment().title || ''}>
          <Assignment
            url={location.pathname}
            data={assignment()}
            userEmail={userEmail()}
            index={parseInt((searchParams.index as string) || '0')}
            onIndexChange={(newIndex) => setSearchParams({ index: newIndex })}
          />
        </Page>
      )}
    </Show>
  )
}
