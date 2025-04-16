import ErrorBoundary from './ErrorBoundary'
import Pagination from './Pagination'
import { createAsyncStore, revalidate } from '@solidjs/router'
import { Component, For, Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import {
  type Assignment,
  exercises,
  Exercise,
  saveExercise,
  getAssignment,
  extendAssignment,
  type OriginalAssignment,
} from '~/lib/exercises/assignment'
import { ExerciseProps } from '~/lib/exercises/base'
import { optionsSchema } from '~/lib/exercises/schemas'
import useStorage from '~/lib/storage'

type AssignmentProps = {
  url: string
  id: string
  userEmail?: string
  index: number
  original: OriginalAssignment
  onIndexChange?: (newIndex: number) => void
}

export default function Assignment(props: AssignmentProps) {
  const primary = () => ({ url: props.url, userEmail: props.userEmail || '', id: props.id })
  const initial = () => ({
    ...props.original,
    body: [],
    lastModified: new Date(),
  })
  const [storage, setStorage] = useStorage<Assignment>(
    () => `assignment.${props.url}.${props.id}`,
    initial(),
  )
  const data = createAsyncStore(
    async () => {
      if (!props.userEmail) {
        setStorage({ ...storage(), body: extendAssignment(storage().body, props.original) })
        return storage()
      }
      return await getAssignment(primary())
    },
    { initialValue: initial() },
  )
  const classes = () =>
    data().body.map((exercise) => {
      const correct = exercise.attempts.at(-1)?.correct
      return { true: 'bg-green-100', false: 'bg-red-100' }[String(correct)] ?? 'bg-white'
    })
  return (
    <ErrorBoundary>
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
                <Dynamic
                  component={exercises[exercise.type] as Component<ExerciseProps<N, S, P, F>>}
                  {...(exercise as ExerciseProps<N, S, P, F>)}
                  options={optionsSchema.parse({
                    ...data().options,
                    ...exercise.options,
                  })}
                  onChange={async (event) => {
                    if (props.userEmail) {
                      await saveExercise(primary(), index(), event as Exercise)
                      revalidate(getAssignment.keyFor(primary()))
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
              </ErrorBoundary>
            </div>
          )
        }}
      </For>
    </ErrorBoundary>
  )
}
