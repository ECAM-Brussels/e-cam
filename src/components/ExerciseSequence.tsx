import Pagination from './Pagination'
import { cache } from '@solidjs/router'
import { mapValues } from 'lodash-es'
import { Show, Suspense, createSignal, lazy } from 'solid-js'
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
    valid: boolean
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

type ExerciseProps = {
  data: Exercise[]
  setter: SetStoreFunction<Exercise[]>
}

export default function ExerciseSequence(props: ExerciseProps) {
  const [index, setIndex] = createSignal(0)
  const [mark, setMark] = createSignal(false)
  const exercise = () => props.data[index()]
  const classes = props.data.map((exercise: Exercise) => {
    if (exercise.feedback?.valid) {
      return 'bg-green-50'
    }
    return 'bg-gray-50'
  })
  return (
    <div class="md:flex items-center">
      <div class="md:w-2/3 border-r">
        <Show when={props.data.length > 1}>
          <Pagination
            current={index()}
            max={props.data.length}
            onChange={setIndex}
            classes={classes}
          />
          <h2 class="text-lg font-bold">Question {index() + 1}</h2>
        </Show>
        <Suspense>
          {/* @ts-ignore */}
          <Dynamic
            // @ts-ignore
            component={components[exercise().type]}
            state={exercise().state}
            params={exercise().params}
            feedback={exercise().feedback}
            options={{ mark: mark(), readOnly: mark() }}
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
            onClick={() => {
              setMark(true)
            }}
          >
            Submit assignment
          </button>
        </p>
      </div>
    </div>
  )
}
