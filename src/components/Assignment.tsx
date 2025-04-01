import ErrorBoundary from './ErrorBoundary'
import Pagination from './Pagination'
import { createAsync, revalidate } from '@solidjs/router'
import { Component, For, Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import {
  type AssignmentProps,
  exercises,
  Exercise,
  saveExercise,
  getAssignmentBody,
} from '~/lib/exercises/assignment'
import { ExerciseProps } from '~/lib/exercises/base'

export default function Assignment(
  props: AssignmentProps & { index: number; onIndexChange?: (newIndex: number) => void },
) {
  const primary = () => ({ url: props.url, userEmail: props.userEmail, id: props.id })
  const body = createAsync(async () => getAssignmentBody(primary()))
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
                  onChange={async (event) => {
                    await saveExercise(primary(), index(), event as Exercise)
                    revalidate(getAssignmentBody.keyFor(primary()))
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
