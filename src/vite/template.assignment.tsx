import { createAsync, query, useLocation, useParams, type RouteDefinition } from '@solidjs/router'
import { createEffect, createSignal, Show } from 'solid-js'
import { z } from 'zod'
import Assignment, { ExerciseUI, getGraphQuery } from '~/components/Assignment'
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
import { createSearchParam } from '~/lib/params'
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
        getEloDiff(info.url, user.email, info.index),
        loadBoard({ url: info.url, ownerEmail: user.email, board: `${info.index}` }),
        getAssignmentGraph(getGraphQuery(info.url)),
      ])
    }
  },
} satisfies RouteDefinition

type Exercise = Parameters<typeof ExerciseUI>[0]

export default function () {
  const location = useLocation()
  const params = useParams()
  const info = () => getInfo(params.index, location.pathname)
  const user = createAsync(() => getUser())
  const assignment = createAsync(() => getOriginalAssignment(info().url))
  const [userEmail] = createSearchParam('userEmail', z.string().email().optional())

  const [exercise, setExercise] = createSignal<null | Exercise>(null)
  createEffect(() => {
    if (assignment() && exercise() === null) {
      setExercise(assignment()!.body[0])
    }
  })
  const hasGenerator = () => assignment()?.body.at(0)?.params
  return (
    <Page title={assignment()?.page.title ?? ''}>
      <h1 class="text-4xl my-4">{assignment()?.page.title}</h1>
      <Show when={assignment()}>
        {(assignment) => (
          <Show
            when={user()}
            fallback={
              <Show when={exercise()}>
                <ExerciseUI
                  {...(exercise() as Exercise)}
                  onChange={(event, action) => {
                    if (exercise()?.params !== undefined || action == 'submit') {
                      setExercise(event)
                    }
                  }}
                />
                <Show when={hasGenerator()}>
                  <hr class="my-4" />
                  <button onclick={() => setExercise(null)}>Générer un autre exercice</button>
                </Show>
              </Show>
            }
          >
            {(user) => (
              <Assignment
                url={info().url}
                data={assignment()}
                userEmail={userEmail() ?? user().email}
                index={info().index}
              />
            )}
          </Show>
        )}
      </Show>
    </Page>
  )
}
