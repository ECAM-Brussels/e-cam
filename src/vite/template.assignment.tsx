import { createAsync, query, useLocation, useParams, type RouteDefinition } from '@solidjs/router'
import { Show } from 'solid-js'
import Assignment, { getGraphQuery } from '~/components/Assignment'
import Page from '~/components/Page'
import { getUser } from '~/lib/auth/session'
import { loadBoard } from '~/lib/board'
import { getEloDiff } from '~/lib/elo'
import {
  getAssignment,
  getAssignmentGraph,
  getExercise,
  getPaginationInfo,
} from '~/lib/exercises/assignment'
import { getUserInfo } from '~/lib/user'

const getOriginalAssignment = query((url?: string) => {
  'use server'
  return getAssignment({
    /** @ts-ignore */
    ...$body$,
    url,
  })
}, 'getOriginalAssignment')

const getInfo = (index: string, url: string) => {
  if (!index) {
    index = '1'
  } else {
    url = url.substring(0, url.length - index.length - 1)
  }
  return { url, index: Number(index) }
}

export const route = {
  async preload({ location, params }) {
    const info = getInfo(params.index, location.pathname)
    const user = await getUser()
    if (user) {
      await Promise.all([
        getUserInfo(user.email),
        getOriginalAssignment(info.url).then(() => {
          getExercise(info.url, user.email, info.index)
          getPaginationInfo(info.url, user.email)
        }),
        getEloDiff(user.email),
        loadBoard({ url: info.url, ownerEmail: user.email, board: `${info.index}` }),
        getAssignmentGraph(getGraphQuery(info.url)),
      ])
    }
  },
} satisfies RouteDefinition

export default function () {
  const location = useLocation()
  const params = useParams()
  const info = () => getInfo(params.index, location.pathname)
  const user = createAsync(() => getUser())
  const assignment = createAsync(() => getOriginalAssignment(info().url))
  return (
    <Show when={user()}>
      {(user) => (
        <Page title={assignment()?.page.title ?? ''}>
          <Show when={assignment()}>
            {(assignment) => (
              <Assignment
                url={info().url}
                data={assignment()}
                userEmail={user().email}
                index={info().index}
              />
            )}
          </Show>
        </Page>
      )}
    </Show>
  )
}
