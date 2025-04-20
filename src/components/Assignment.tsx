import ErrorBoundary from './ErrorBoundary'
import Pagination from './Pagination'
import { createAsync, revalidate } from '@solidjs/router'
import { Component, For, Show, Suspense } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import {
  type Assignment,
  exercises,
  Exercise,
  saveExercise,
  getAssignment,
  extendAssignment,
} from '~/lib/exercises/assignment'
import { ExerciseProps } from '~/lib/exercises/base'
import { optionsSchemaWithDefault } from '~/lib/exercises/schemas'
import useStorage from '~/lib/storage'

type AssignmentProps = {
  url: string
  userEmail?: string
  index: number
  data: Assignment
  onIndexChange?: (newIndex: number) => void
}

export default function Assignment(props: AssignmentProps) {
  const initial = () => ({
    ...props.data,
    body: [],
    lastModified: new Date(),
  })
  const [storage, setStorage] = useStorage<Assignment>(() => `assignment.${props.url}`, initial())
  const data = createAsync(
    async () => {
      if (!props.userEmail) {
        setStorage({ ...storage(), body: extendAssignment(storage().body, props.data) })
        return storage()
      }
      return await getAssignment(props.url, props.userEmail)
    },
    { initialValue: initial() },
  )
  const classes = () =>
    data().body.map((exercise) => {
      const correct = exercise.attempts.at(-1)?.correct
      return { true: 'bg-green-100', false: 'bg-red-100' }[String(correct)] ?? 'bg-white'
    })
  return (
    <ErrorBoundary class="lg:flex gap-8">
      <div class="grow">
        <Show when={data().title}>
          <h1 class="text-4xl my-4">{data().title}</h1>
        </Show>
        <Pagination
          current={props.index}
          onChange={props.onIndexChange}
          max={data().body.length || 0}
          classes={classes()}
        />
        <For each={data().body}>
          {function <N, S, P, F>(exercise: Exercise, index: () => number) {
            return (
              <div classList={{ hidden: index() !== props.index }}>
                <ErrorBoundary>
                  <Suspense fallback={<p>Loading exercise...</p>}>
                    <Dynamic
                      component={exercises[exercise.type] as Component<ExerciseProps<N, S, P, F>>}
                      {...(exercise as ExerciseProps<N, S, P, F>)}
                      options={optionsSchemaWithDefault.parse({
                        ...data().options,
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
                          revalidate(getAssignment.keyFor(props.url, props.userEmail))
                        } else {
                          setStorage({
                            ...storage(),
                            body: storage().body.map((ex, i) =>
                              i === index() ? (event as Exercise) : ex,
                            ),
                          })
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
        <h2 class="text-2xl my-4">Informations</h2>
        <Show when={data().prerequisites}>
          <h3 class="text-xl mb-4">Prérequis</h3>
          <For each={data().prerequisites}>
            {(prerequisite) => (
              <li>
                <a class="text-blue-600" href={prerequisite.url}>
                  {prerequisite.title}
                </a>
              </li>
            )}
          </For>
        </Show>
      </div>
    </ErrorBoundary>
  )
}
