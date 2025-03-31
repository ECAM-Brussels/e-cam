import ErrorBoundary from './ErrorBoundary'
import Pagination from './Pagination'
import { createAsync } from '@solidjs/router'
import { Component, Show } from 'solid-js'
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
      </Show>
      <Show when={body()?.[props.index]} keyed>
        {function <N, S, P, F>(exercise: Exercise) {
          const exerciseProps = {
            maxAttempts: props.maxAttempts,
            ...exercise,
            onChange: (event) => saveExercise(primary(), props.index, event as Exercise),
          } as ExerciseProps<N, S, P, F>
          const component = exercises[exercise.type] as Component<typeof exerciseProps>
          return <Dynamic component={component} {...exerciseProps} />
        }}
      </Show>
    </ErrorBoundary>
  )
}
