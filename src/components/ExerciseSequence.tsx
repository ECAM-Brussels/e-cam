import Pagination from './Pagination'
import { cache } from '@solidjs/router'
import { mapValues } from 'lodash-es'
import { Suspense, createSignal, lazy } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { Dynamic } from 'solid-js/web'
import { z } from 'zod'

const exercises = {
  CompleteSquare: () => import('~/exercises/CompleteSquare'),
  Equation: () => import('~/exercises/Equation'),
  Factor: () => import('~/exercises/Factor'),
} as const
const components = mapValues(exercises, lazy)

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
    <div class="md:flex items-center">
      <div class="md:w-3/4 border-r">
        <Pagination current={index()} max={props.data.length} onChange={setIndex} />
        <Suspense>
          {/* @ts-ignore */}
          <Dynamic
            // @ts-ignore
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
        </Suspense>
      </div>
      <div class="px-2">
        <p>
          <button
            class="border px-2 py-1 rounded-lg bg-green-700 text-white"
            onClick={async () => {
              setMark(true)
              setFeedback(await markSequence(props.data))
            }}
          >
            Submit assignment
          </button>
        </p>
        <pre>{JSON.stringify(feedback())}</pre>
      </div>
    </div>
  )
}
