import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { createAsync, createAsyncStore, revalidate } from '@solidjs/router'
import { Component, For, Show, Suspense } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import ErrorBoundary from '~/components/ErrorBoundary'
import Fa from '~/components/Fa'
import Graph from '~/components/Graph'
import Pagination from '~/components/Pagination'
import Whiteboard from '~/components/Whiteboard'
import { getEloDiff } from '~/lib/elo'
import {
  type Assignment,
  exercises,
  Exercise,
  saveExercise,
  type getAssignment,
  getExercises,
  getAssignmentGraph,
} from '~/lib/exercises/assignment'
import { ExerciseProps } from '~/lib/exercises/base'
import { optionsSchemaWithDefault } from '~/lib/exercises/schemas'
import { getUserInfo } from '~/lib/user'

type AssignmentProps = {
  url: string
  userEmail: string
  index: number
  data: Awaited<ReturnType<typeof getAssignment>>
  onIndexChange?: (newIndex: number) => void
}

export default function Assignment(props: AssignmentProps) {
  const user = createAsync(() => getUserInfo(props.userEmail))
  const body = createAsyncStore(() => getExercises(props.url, props.userEmail), {
    initialValue: [],
  })
  const eloDiff = createAsync(() => getEloDiff())
  const graphQuery = () => ({
    OR: [
      { url: props.url },
      { prerequisites: { some: { url: props.url } } },
      { requiredBy: { some: { url: props.url } } },
    ],
  })
  return (
    <ErrorBoundary>
      <Show when={props.data.title}>
        <h1 class="text-4xl my-4">{props.data.title}</h1>
      </Show>
      <Pagination
        current={props.index}
        onChange={props.onIndexChange}
        max={body().length || 0}
        classList={(i) => ({
          'bg-green-100': body()?.[i].attempts.at(0)?.correct,
          'bg-red-100': body()?.[i].attempts.at(0)?.correct === false,
          'bg-white': body()?.[i].attempts.at(0)?.correct === undefined,
        })}
      />
      <div class="lg:flex px-6 py-6">
        <For each={body()}>
          {function <N, Q, A, P, F>(exercise: Exercise, index: () => number) {
            const options = () =>
              optionsSchemaWithDefault.parse({
                ...props.data.options,
                ...exercise.options,
              })
            let boardContainer!: HTMLDivElement
            return (
              <div
                classList={{ hidden: index() !== props.index }}
                class="bg-white grow border rounded-xl shadow"
              >
                <ErrorBoundary>
                  <Suspense fallback={<p>Loading exercise...</p>}>
                    <Dynamic
                      component={
                        exercises[exercise.type] as Component<ExerciseProps<N, Q, A, P, F>>
                      }
                      {...(exercise as ExerciseProps<N, Q, A, P, F>)}
                      options={options()}
                      onChange={async (event) => {
                        await saveExercise(
                          location.pathname,
                          props.userEmail,
                          index(),
                          event as Exercise,
                        )
                        revalidate([
                          getExercises.keyFor(props.url, props.userEmail),
                          getEloDiff.key,
                          getAssignmentGraph.keyFor(graphQuery()),
                        ])
                      }}
                    />
                  </Suspense>
                  <Show when={user()}>
                    {(user) => (
                      <div class="h-screen overflow-hidden" ref={boardContainer}>
                        <Whiteboard
                          owner={user()?.email}
                          name={`${index()}`}
                          container={boardContainer}
                        />
                      </div>
                    )}
                  </Show>
                </ErrorBoundary>
              </div>
            )
          }}
        </For>
        <div class="lg:w-80 px-6">
          <Show when={user()}>
            {(user) => (
              <div class="bg-white border rounded-xl shadow-sm p-4 text-center mb-8 flex items-center gap-3">
                <div class="text-xl">Score:</div>
                <div class="font-bold text-3xl">{user().score} </div>
                <Show when={eloDiff()}>
                  {(eloDiff) => (
                    <span
                      classList={{
                        'text-green-800': eloDiff() > 0,
                        'text-red-800': eloDiff() < 0,
                      }}
                    >
                      ({eloDiff() > 0 && '+'}
                      {eloDiff()} <Fa icon={eloDiff() > 0 ? faArrowUp : faArrowDown} />)
                    </span>
                  )}
                </Show>
              </div>
            )}
          </Show>
          <div class="bg-white border rounded-xl p-4 shadow-sm">
            <h2 class="text-2xl mb-2">Exercices similaires</h2>
            <Graph class="min-h-96" rankDir="BT" currentNode={props.url} query={graphQuery()} />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
