import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { cache, createAsync, revalidate, useLocation } from '@solidjs/router'
import { mapValues } from 'lodash-es'
import { Show, Suspense, createEffect, createSignal, lazy, onMount } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { Dynamic } from 'solid-js/web'
import { z } from 'zod'
import Fa from '~/components/Fa'
import Pagination from '~/components/Pagination'
import { getUser } from '~/lib/auth/session'
import { prisma } from '~/lib/db'

const exercises = {
  CompleteSquare: () => import('~/exercises/CompleteSquare'),
  Equation: () => import('~/exercises/Equation'),
  Factor: () => import('~/exercises/Factor'),
}
const components = mapValues(exercises, (m) => lazy(async () => ({ default: (await m()).default })))

type ExerciseName = keyof typeof exercises
type Module<T extends ExerciseName> = Awaited<ReturnType<(typeof exercises)[T]>>
type HasGenerator<M> = M extends { generate: (...args: any) => any } ? true : false
type GeneratorParams<M> = M extends { generate: (params: infer P) => any } ? P : never
type ExerciseFromName<T extends ExerciseName> = {
  type: T
  feedback?: {
    correct: boolean
    valid: boolean
    solution: z.infer<Module<T>['schema']>
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

export const loadAssignment = cache(async (url: string): Promise<Exercise[] | null> => {
  'use server'
  const user = await getUser()
  if (!user || !user.email) {
    return null
  }
  const userEmail = user.email
  const record = await prisma.assignment.findUnique({
    where: { url_userEmail: { url, userEmail } },
  })
  if (!record) {
    return null
  }
  return JSON.parse(String(record.body)) as Exercise[]
}, 'loadAssignment')

async function upsertAssignment(url: string, data: Exercise[]) {
  'use server'
  const user = await getUser()
  if (!user || !user.email) {
    throw new Error('Error when upserting assignment: user not logged in')
  }
  const userEmail = user.email
  let body = JSON.stringify(data)
  const assignment = await prisma.assignment.upsert({
    where: { url_userEmail: { url, userEmail } },
    update: { body },
    create: { url, userEmail, body },
  })
}

export default function ExerciseSequence(props: ExerciseProps) {
  const location = useLocation()
  const session = createAsync(getUser)
  const [index, setIndex] = createSignal(0)
  const [mark, setMark] = createSignal(false)
  const exercise = () => props.data[index()]
  const classes = () =>
    props.data.map((exercise: Exercise) => {
      if (exercise.feedback?.valid) {
        return 'bg-green-50'
      }
      return 'bg-gray-50'
    })

  const savedData = createAsync(() => loadAssignment(location.pathname))
  createEffect(() => {
    const saved = savedData()
    if (saved) {
      props.setter(saved)
    }
  })

  return (
    <div class="md:flex items-center">
      <div class="md:w-2/3 border-r">
        <Show when={props.data.length > 1}>
          <Pagination
            current={index()}
            max={props.data.length}
            onChange={setIndex}
            classes={classes()}
          />
          <h2 class="text-lg font-bold">Question {index() + 1}</h2>
        </Show>
        <Suspense>
          <Dynamic
            component={components[exercise().type]}
            {...exercise()}
            options={{ mark: mark(), readOnly: false, showSolution: mark() }}
            setter={(...args: any) => {
              // @ts-ignore
              props.setter(index(), ...args)
            }}
          />
        </Suspense>
        <Show when={index() < props.data.length - 1}>
          <p class="flex flex-row-reverse mt-4 mr-6">
            <button class="border rounded-xl p-3" onClick={() => setIndex(index() + 1)}>
              Suivant <Fa icon={faChevronRight} />
            </button>
          </p>
        </Show>
      </div>
      <div class="px-2">
        <Show when={session()}>{(user) => <p>Bonjour {user().name}</p>}</Show>
        <p>
          <button
            class="border px-2 py-1 rounded-lg bg-green-700 text-white"
            onClick={async () => {
              await upsertAssignment(location.pathname, props.data)
              revalidate(loadAssignment.keyFor(location.pathname))
            }}
          >
            Sauvegarder
          </button>
          <button
            class="border px-2 py-1 rounded-lg bg-green-700 text-white"
            onClick={() => {
              setMark(true)
            }}
          >
            Corriger
          </button>
        </p>
      </div>
    </div>
  )
}
