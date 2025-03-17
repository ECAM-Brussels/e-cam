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
import { registerAssignment } from '~/lib/exercises/assignment'

const getAssignment = query((url: string) => {
  'use server'
  return registerAssignment({
    /** @ts-ignore */
    ...$body$,
    url,
    userEmail: 'ngy@ecam.be',
  })
}, 'getAssignment')

export const route = {
  preload({ location }) {
    getUser()
    getAssignment(location.pathname)
  },
} satisfies RouteDefinition

export default function () {
  const location = useLocation()
  const assignment = createAsync(() => getAssignment(location.pathname))
  const user = createAsync(() => getUser())
  const [searchParams, setSearchParams] = useSearchParams()
  return (
    <Show when={assignment()}>
      {(assignment) => (
        <Show when={user()}>
          {(user) => (
            <Page title={assignment().title || ''}>
              <Assignment
                {...assignment()}
                userEmail={(searchParams.userEmail as string) || user().email}
                url={location.pathname}
                index={parseInt((searchParams.index as string) || '0')}
                onIndexChange={(newIndex) => {
                  setSearchParams({ index: newIndex })
                }}
              />
            </Page>
          )}
        </Show>
      )}
    </Show>
  )
}
