import ErrorBoundary from './ErrorBoundary'
import Pagination from './Pagination'
import { createAsync, revalidate } from '@solidjs/router'
import { Component, For, Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import {
  type Assignment,
  exercises,
  Exercise,
  saveExercise,
  getAssignmentBody,
  extendAssignment,
} from '~/lib/exercises/assignment'
import { ExerciseProps } from '~/lib/exercises/base'
import useStorage from '~/lib/storage'

export default function Assignment(
  props: Assignment & { index: number; onIndexChange?: (newIndex: number) => void },
) {
  const primary = () => ({ url: props.url, userEmail: props.userEmail || '', id: props.id })
  const [storage, setStorage] = useStorage<Exercise[]>(
    () => `assignment.${props.url}.${props.id}`,
    [],
  )
  const body = createAsync(async () => {
    if (!props.userEmail) {
      setStorage(extendAssignment(storage(), props))
      return storage()
    }
    return await getAssignmentBody(primary())
  })
  const classes = () =>
    body()?.map((exercise) => {
      const correct = exercise.attempts.at(-1)?.correct
      return { true: 'bg-green-100', false: 'bg-red-100' }[String(correct)] ?? 'bg-white'
    })
  return (
    <ErrorBoundary>
      <Show when={props.title}>
        <h1 class="text-4xl my-4">{props.title}</h1>
      </Show>
      <Show when={body()}>
        <Pagination
          current={props.index}
          onChange={props.onIndexChange}
          max={body()?.length || 0}
          classes={classes()}
        />
        <For each={body()}>
          {function <N, S, P, F>(exercise: Exercise, index: () => number) {
            return (
              <div classList={{ hidden: index() !== props.index }}>
                <Dynamic
                  component={exercises[exercise.type] as Component<ExerciseProps<N, S, P, F>>}
                  {...(exercise as ExerciseProps<N, S, P, F>)}
                  maxAttempts={
                    exercise.maxAttempts === undefined ? props.maxAttempts : exercise.maxAttempts
                  }
                  onChange={async (event) => {
                    if (props.userEmail) {
                      await saveExercise(primary(), index(), event as Exercise)
                      revalidate(getAssignmentBody.keyFor(primary()))
                    } else {
                      setStorage(body()!.map((ex, i) => (i === index() ? (event as Exercise) : ex)))
                    }
                  }}
                />
              </div>
            )
          }}
        </For>
      </Show>
    </ErrorBoundary>
  )
}
