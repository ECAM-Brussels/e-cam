import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { createAsync, createAsyncStore, revalidate } from '@solidjs/router'
import { Component, Show, Suspense } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import ErrorBoundary from '~/components/ErrorBoundary'
import Fa from '~/components/Fa'
import Graph from '~/components/Graph'
import Pagination from '~/components/Pagination'
import Whiteboard from '~/components/Whiteboard'
import { getUser } from '~/lib/auth/session'
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
}

export default function Assignment<N, Q, A, P, F>(props: AssignmentProps) {
  const user = createAsync(() => getUserInfo(props.userEmail))
  const realUser = createAsync(() => getUser())
  const body = createAsyncStore(() => getExercises(props.url, props.userEmail), {
    initialValue: [],
  })
  const exercise = () => body().at(props.index - 1)
  const eloDiff = createAsync(() => getEloDiff(props.userEmail), { initialValue: 0 })
  const graphQuery = () => ({
    OR: [
      { url: props.url },
      { prerequisites: { some: { url: props.url } } },
      { requiredBy: { some: { url: props.url } } },
    ],
  })
  const options = () =>
    optionsSchemaWithDefault.parse({
      ...props.data.options,
      ...(exercise()?.options || {}),
    })
  let boardContainer!: HTMLDivElement
  return (
    <ErrorBoundary>
      <h1 class="text-4xl my-4">{props.data.title}</h1>
      <Pagination
        current={props.index}
        url={(index) => {
          const parts: string[] = [props.url]
          if (props.userEmail !== realUser()?.email) {
            parts.push(props.userEmail)
          }
          if (index > 1) {
            parts.push(`${index}`)
          }
          return parts.join('/')
        }}
        max={body().length || 0}
        classList={(i) => ({
          'bg-green-100': body()
            .at(i - 1)
            ?.attempts.at(0)?.correct,
          'bg-red-100':
            body()
              .at(i - 1)
              ?.attempts.at(0)?.correct === false,
          'bg-white':
            body()
              .at(i - 1)
              ?.attempts.at(0)?.correct === undefined,
        })}
      />
      <div class="lg:flex px-6 py-6">
        <div class="bg-white grow border rounded-xl shadow">
          <ErrorBoundary>
            <Show when={exercise()} fallback={<p>Loading exercise...</p>}>
              {(exercise) => (
                <Dynamic
                  component={exercises[exercise().type] as Component<ExerciseProps<N, Q, A, P, F>>}
                  {...(exercise() as ExerciseProps<N, Q, A, P, F>)}
                  options={options()}
                  onChange={async (event) => {
                    await saveExercise(props.url, props.userEmail, props.index, event as Exercise)
                    revalidate([
                      getExercises.keyFor(props.url, props.userEmail),
                      getEloDiff.key,
                      getAssignmentGraph.keyFor(graphQuery()),
                    ])
                  }}
                />
              )}
            </Show>
            <div class="h-screen overflow-hidden" ref={boardContainer}>
              <Whiteboard
                url={props.url}
                owner={props.userEmail}
                name={`${props.index}`}
                container={boardContainer}
              />
            </div>
          </ErrorBoundary>
        </div>
        <div class="lg:w-80 px-6">
          <div class="bg-white border rounded-xl shadow-sm p-4 text-center mb-8 flex items-center gap-3">
            <Suspense>
              <h3 class="text-xl">Score:</h3>
              <div class="font-bold text-3xl">{user()?.score} </div>
              <span
                classList={{
                  'text-green-800': eloDiff() > 0,
                  'text-red-800': eloDiff() < 0,
                }}
              >
                ({eloDiff() > 0 && '+'}
                {eloDiff()} <Fa icon={eloDiff() > 0 ? faArrowUp : faArrowDown} />)
              </span>
            </Suspense>
          </div>
          <div class="bg-white border rounded-xl p-4 shadow-sm">
            <h2 class="text-2xl mb-2">Exercices similaires</h2>
            <Graph class="min-h-96" rankDir="BT" currentNode={props.url} query={graphQuery()} />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
