import ErrorBoundary from './ErrorBoundary'
import Pagination from './Pagination'
import { createAsync } from '@solidjs/router'
import { Show, type Component } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import {
  type AssignmentProps,
  exercises,
  Exercise,
  saveExercise,
  getAssignmentBody,
} from '~/lib/exercises/assignment'
import { ExerciseComponentProps } from '~/lib/exercises/base'

export default function Assignment(
  props: AssignmentProps & { index: number; onIndexChange?: (newIndex: number) => void },
) {
  const primary = () => ({ url: props.url, userEmail: props.userEmail, id: props.id })
  const body = createAsync(async () => getAssignmentBody(primary()))
  const classes = () =>
    body()?.map((exercise: Exercise) => {
      if (exercise.feedback?.correct) {
        return 'bg-green-100'
      } else if (exercise.feedback?.correct === false) {
        return 'bg-red-100'
      }
      return 'bg-white'
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
        {function <State, P, Sol>(exercise: Exercise) {
          const exerciseProps = exercise as ExerciseComponentProps<State, P, Sol>
          const component = exercises[exercise.type] as Component<typeof exerciseProps>
          const attempts = exerciseProps.attempts ?? props.attempts
          async function save(event: {
            state: State
            feedback?: { correct: boolean; solution?: Sol }
            attempts: true | number
          }) {
            await saveExercise(primary(), props.index, {
              type: exercise.type,
              feedback: event.feedback,
              state: event.state,
              attempts: event.attempts,
            } as Exercise)
          }
          return (
            <Dynamic
              component={component}
              {...exerciseProps}
              onGenerate={save}
              onSubmit={save}
              attempts={attempts}
            />
          )
        }}
      </Show>
    </ErrorBoundary>
  )
}
