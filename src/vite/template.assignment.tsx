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

const getOriginalAssignment = query((url: string) => {
  'use server'
  return registerAssignment({
    /** @ts-ignore */
    ...$body$,
    url,
  })
}, 'getOriginalAssignment')

export const route = {
  preload({ location }) {
    getUser()
    getOriginalAssignment(location.pathname)
  },
} satisfies RouteDefinition

export default function () {
  const location = useLocation()
  const original = createAsync(() => getOriginalAssignment(location.pathname))
  const user = createAsync(() => getUser())
  const [searchParams, setSearchParams] = useSearchParams()
  return (
    <Show when={original()}>
      {(original) => (
        <Show when={user()}>
          {(user) => (
            <Page title={original().title || ''}>
              <Assignment
                {...original()}
                userEmail={(searchParams.userEmail as string) || user().email}
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
