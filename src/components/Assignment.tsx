import ErrorBoundary from './ErrorBoundary'
import Graph from './Graph'
import Pagination from './Pagination'
import { createAsync, revalidate } from '@solidjs/router'
import { Component, For, Show, Suspense } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { adjustElo, getExerciseElo } from '~/lib/elo'
import {
  type Assignment,
  exercises,
  Exercise,
  saveExercise,
  type getAssignment,
  extendSubmission,
  getSubmission,
} from '~/lib/exercises/assignment'
import { ExerciseProps } from '~/lib/exercises/base'
import { optionsSchemaWithDefault } from '~/lib/exercises/schemas'
import useStorage from '~/lib/storage'
import { getUserInfo } from '~/lib/user'

type AssignmentProps = {
  url: string
  userEmail?: string
  index: number
  data: Awaited<ReturnType<typeof getAssignment>>
  onIndexChange?: (newIndex: number) => void
}

export default function Assignment(props: AssignmentProps) {
  const [storage, setStorage] = useStorage<Exercise[]>(() => `assignment.${props.url}`, [])
  const user = createAsync(async () => (props.userEmail ? getUserInfo(props.userEmail) : null))
  const body = createAsync(
    async () => {
      if (!props.userEmail) {
        setStorage(extendSubmission(storage(), props.data.body, props.data.options))
        return storage()
      }
      return await getSubmission(props.url, props.userEmail)
    },
    { initialValue: [] },
  )
  const elo = createAsync(async () => {
    const exercise = body()?.[props.index]
    if (exercise) {
      return await getExerciseElo(exercise)
    }
    return null
  })
  const graphQuery = () => ({
    where: {
      OR: [
        { url: props.url },
        { prerequisites: { some: { url: props.url } } },
        { requiredBy: { some: { url: props.url } } },
      ],
    },
  })
  return (
    <ErrorBoundary class="lg:flex gap-8">
      <div class="grow">
        <Show when={props.data.title}>
          <h1 class="text-4xl my-4">{props.data.title}</h1>
        </Show>
        <Pagination
          current={props.index}
          onChange={props.onIndexChange}
          max={body().length || 0}
          classList={(i) => ({
            'bg-green-100': body()?.[i].attempts.at(-1)?.correct,
            'bg-red-100': body()?.[i].attempts.at(-1)?.correct === false,
            'bg-white': body()?.[i].attempts.at(-1)?.correct === undefined,
          })}
        />
        <For each={body()}>
          {function <N, Q, A, P, F>(exercise: Exercise, index: () => number) {
            return (
              <div classList={{ hidden: index() !== props.index }}>
                <ErrorBoundary>
                  <Suspense fallback={<p>Loading exercise...</p>}>
                    <Dynamic
                      component={
                        exercises[exercise.type] as Component<ExerciseProps<N, Q, A, P, F>>
                      }
                      {...(exercise as ExerciseProps<N, Q, A, P, F>)}
                      options={optionsSchemaWithDefault.parse({
                        ...props.data.options,
                        ...exercise.options,
                      })}
                      onChange={async (event) => {
                        if (props.userEmail) {
                          await saveExercise(
                            location.pathname,
                            props.userEmail,
                            index(),
                            event as Exercise,
                          )
                          if (event.attempts.length) {
                            const { correct } = event.attempts.at(-1)!
                            await adjustElo({
                              email: props.userEmail,
                              exercise: event as Exercise & { question: NonNullable<any> },
                              correct,
                            })
                          }
                          revalidate()
                        } else {
                          setStorage(
                            storage().map((ex, i) => (i === index() ? (event as Exercise) : ex)),
                          )
                        }
                      }}
                    />
                  </Suspense>
                </ErrorBoundary>
              </div>
            )
          }}
        </For>
      </div>
      <div class="py-6 px-6">
        <Show when={user()}>
          {(user) => (
            <div class="text-center">
              <div>
                <div class="text-sm">Score:</div>
                <div class="font-bold text-3xl">{user().score}</div>
              </div>
              <div>
                <div class="text-sm">Difficulté de l'exercice':</div>
                <div class="font-bold text-3xl">{elo()}</div>
              </div>
            </div>
          )}
        </Show>
        <h2 class="text-2xl my-4">Compétences voisines</h2>
        <Graph
          class="rounded-xl min-w-64 min-h-96"
          rankDir="BT"
          currentNode={props.url}
          query={graphQuery()}
        />
      </div>
    </ErrorBoundary>
  )
}
