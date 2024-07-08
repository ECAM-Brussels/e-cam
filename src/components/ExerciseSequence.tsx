import { cache } from '@solidjs/router'
import { For, createSignal, lazy } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { z } from 'zod'

const exercises = {
  Factor: () => import('~/exercises/Factor'),
} as const
const components = Object.fromEntries(Object.entries(exercises).map(([k, v]) => [k, lazy(v)]))

type ExerciseName = keyof typeof exercises
type Module<T extends ExerciseName> = Awaited<ReturnType<(typeof exercises)[T]>>
type ExerciseFromName<T extends ExerciseName> =
  Module<T> extends { generate: unknown }
    ? {
        type: T
        state?: z.infer<Module<T>['schema']>
        params?: Parameters<Module<T>['generate']>[0]
      }
    : {
        type: T
        state: z.infer<Module<T>['schema']>
      }
export type Exercise = ExerciseFromName<ExerciseName>

export const markSequence = cache((data: Exercise[]) => {
  const promises = data.map(async (exercise) => {
    if (!exercise.state) {
      return false
    }
    const mark = (await exercises[exercise.type]()).mark
    return mark(exercise.state).catch((_) => false)
  })
  return Promise.all(promises)
}, 'markSequence')

type ExerciseProps = {
  data: Exercise[]
  setter: SetStoreFunction<Exercise[]>
}

export default function ExerciseSequence(props: ExerciseProps) {
  const [feedback, setFeedback] = createSignal<boolean[]>([])
  return (
    <>
      <For each={props.data}>
        {(exercise, i) => {
          const Component = components[exercise.type]
          return (
            <Component
              {...{ state: exercise.state, params: exercise.params }}
              setter={(...args: any) => {
                // @ts-ignore
                props.setter(i(), ...args)
              }}
            />
          )
        }}
      </For>
      <p>
        <button
          onClick={async () => {
            setFeedback(await markSequence(props.data))
          }}
        >
          Mark
        </button>
      </p>
      <pre>{JSON.stringify(feedback())}</pre>
    </>
  )
}
