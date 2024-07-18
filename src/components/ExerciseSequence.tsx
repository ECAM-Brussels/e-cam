import { faLeftLong, faRightLong } from '@fortawesome/free-solid-svg-icons'
import { cache } from '@solidjs/router'
import { createSignal, lazy } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { Dynamic } from 'solid-js/web'
import { z } from 'zod'
import Fa from '~/components/Fa'

const exercises = {
  Factor: () => import('~/exercises/Factor'),
} as const
const components = Object.fromEntries(Object.entries(exercises).map(([k, v]) => [k, lazy(v)]))

type ExerciseName = keyof typeof exercises
type Module<T extends ExerciseName> = Awaited<ReturnType<(typeof exercises)[T]>>
type ExerciseFromName<T extends ExerciseName> = {
  type: T
  feedback?: {
    correct: boolean
  }
} & (Module<T> extends { generate: unknown }
  ? {
      state?: z.infer<Module<T>['schema']>
      params?: Parameters<Module<T>['generate']>[0]
    }
  : {
      state: z.infer<Module<T>['schema']>
    })
export type Exercise = ExerciseFromName<ExerciseName> & { feedback?: object }

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
  const [index, setIndex] = createSignal(0)
  const [mark, setMark] = createSignal(false)
  const [feedback, setFeedback] = createSignal<boolean[]>([])
  const exercise = () => props.data[index()]
  return (
    <>
      <div class="text-center">
        <button
          onClick={() => {
            setIndex((index() + 1) % props.data.length)
          }}
        >
          <Fa icon={faLeftLong} />
        </button>
        <span class="mx-4">
          {index() + 1} / {props.data.length}
        </span>
        <button
          onClick={() => {
            setIndex((index() + 1) % props.data.length)
          }}
        >
          <Fa icon={faRightLong} />
        </button>
      </div>
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
