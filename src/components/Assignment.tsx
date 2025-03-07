import { createAsyncStore, revalidate } from '@solidjs/router'
import { type Component } from 'solid-js'
import { Dynamic, For } from 'solid-js/web'
import {
  type AssignmentProps,
  exercises,
  Exercise,
  saveExercise,
  getAssignmentBody,
} from '~/lib/exercises/assignment'
import { ExerciseComponentProps } from '~/lib/exercises/base'

export default function Assignment(props: AssignmentProps) {
  const primary = () => ({ url: props.url, userEmail: props.userEmail, id: props.id })
  const key = () => [primary(), props.mode, props.streak, props.body] as const
  const body = createAsyncStore(async () => getAssignmentBody(...key()), {
    initialValue: props.body,
  })
  return (
    <For each={body()}>
      {function <State, P, Sol>(exercise: Exercise, pos: () => number) {
        const exerciseProps = exercise as ExerciseComponentProps<State, P, Sol>
        const component = exercises[exercise.type] as Component<typeof exerciseProps>
        async function save(event: { state: State }) {
          await saveExercise(primary(), pos(), {
            type: exercise.type,
            ...exerciseProps,
            state: event.state,
            params: null,
          } as Exercise)
          revalidate(getAssignmentBody.keyFor(...key()))
        }
        return (
          <Dynamic component={component} {...exerciseProps} onGenerate={save} onSubmit={save} />
        )
      }}
    </For>
  )
}
