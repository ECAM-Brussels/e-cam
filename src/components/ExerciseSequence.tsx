import { faLeftLong, faRightLong } from '@fortawesome/free-solid-svg-icons'
import { cache } from '@solidjs/router'
import { Show, createSignal, lazy } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { Dynamic } from 'solid-js/web'
import { z } from 'zod'
import Fa from '~/components/Fa'

const exercises = {
  Equation: () => import('~/exercises/Equation'),
  Factor: () => import('~/exercises/Factor'),
} as const
const components = {
  Equation: lazy(() => import('~/exercises/Equation')),
  Factor: lazy(() => import('~/exercises/Factor')),
} as const

type ExerciseName = keyof typeof exercises
type Module<T extends ExerciseName> = Awaited<ReturnType<(typeof exercises)[T]>>
type HasGenerator<M> = M extends { generate: (...args: any) => any } ? true : false
type GeneratorParams<M> = M extends { generate: (params: infer P) => any } ? P : never
type ExerciseFromName<T extends ExerciseName> = {
  type: T
  feedback?: {
    correct: boolean
  }
} & (HasGenerator<Module<T>> extends true
  ? {
      state?: z.infer<Module<T>['schema']>
      params?: GeneratorParams<Module<T>>
    }
  : {
      state: z.infer<Module<T>['schema']>
      params?: never
    })
export type Exercise = { [N in ExerciseName]: ExerciseFromName<N> }[ExerciseName]

export const markSequence = cache((data: Exercise[]) => {
  const promises = data.map(async (exercise) => {
    if (!exercise.state) {
      return false
    }
    const mark = (await exercises[exercise.type]()).mark
    // @ts-ignore
    return mark(exercise.state).catch((_) => false)
  })
  return Promise.all(promises)
}, 'markSequence')

type ExerciseProps = {
  data: Exercise[]
  setter: SetStoreFunction<Exercise[]>
}

export default function ExerciseSequence(props: ExerciseProps) {
  const [index, setIndex] = createSignal(0)
  const [mark, setMark] = createSignal(false)
  const [feedback, setFeedback] = createSignal<boolean[]>([])
  const exercise = () => props.data[index()]
  return (
    <>
      <div class="text-center">
        <Show when={index()}>
          <button
            onClick={() => {
              setIndex((index() - 1) % props.data.length)
            }}
          >
            <Fa icon={faLeftLong} />
          </button>
        </Show>
        <span class="mx-4">
          {index() + 1} / {props.data.length}
        </span>
        <Show when={index() < props.data.length - 1}>
          <button
            onClick={() => {
              setIndex((index() + 1) % props.data.length)
            }}
          >
            <Fa icon={faRightLong} />
          </button>
        </Show>
      </div>
      {/* @ts-ignore */}
      <Dynamic
        component={components[exercise().type]}
        state={exercise().state}
        params={exercise().params}
        feedback={exercise().feedback}
        options={{ mark: mark() }}
        setter={(...args: any) => {
          // @ts-ignore
          props.setter(index(), ...args)
        }}
      />
      <p>
        <button
          onClick={async () => {
            setMark(true)
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
