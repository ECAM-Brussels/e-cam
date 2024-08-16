import { loadResults } from './Results'
import { cache, createAsync, revalidate, useLocation } from '@solidjs/router'
import { countBy, mapValues } from 'lodash-es'
import { Show, Suspense, createEffect, createMemo, createSignal, lazy, on, onMount } from 'solid-js'
import { createStore, SetStoreFunction } from 'solid-js/store'
import { Dynamic } from 'solid-js/web'
import { z } from 'zod'
import Pagination from '~/components/Pagination'
import { getUser } from '~/lib/auth/session'
import { prisma } from '~/lib/db'

const exercises = {
  CompleteSquare: () => import('~/exercises/CompleteSquare'),
  Equation: () => import('~/exercises/Equation'),
  Factor: () => import('~/exercises/Factor'),
  Simple: () => import('~/exercises/Simple'),
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
  id?: string
  data: Exercise[]
}

export const loadAssignment = cache(async (url: string, id: string = '') => {
  'use server'
  const user = await getUser()
  if (!user || !user.email) {
    return null
  }
  const userEmail = user.email
  const record = await prisma.assignment.findUnique({
    where: { url_userEmail_id: { url, userEmail, id } },
  })
  if (!record) {
    return null
  }
  return { ...record, body: JSON.parse(String(record.body)) as Exercise[] }
}, 'loadAssignment')

async function upsertAssignment(url: string, id: string, data: Exercise[]) {
  'use server'
  const user = await getUser()
  if (!user || !user.email) {
    throw new Error('Error when upserting assignment: user not logged in')
  }
  const userEmail = user.email
  let body = JSON.stringify(data)
  const assignment = await prisma.assignment.upsert({
    where: { url_userEmail_id: { url, userEmail, id } },
    update: { body, lastModified: new Date() },
    create: { url, userEmail, id, body },
  })
}

export default function ExerciseSequence(props: ExerciseProps) {
  const location = useLocation()
  const [index, setIndex] = createSignal(0)
  const [data, setData] = createStore<Exercise[]>(props.data)
  const exercise = () => data[index()]
  const classes = () =>
    data.map((exercise: Exercise) => {
      if (exercise.feedback?.correct) {
        return 'bg-green-100'
      } else if (exercise.feedback?.correct === false) {
        return 'bg-red-100'
      }
      return 'bg-white'
    })

  const savedData = createAsync(() => loadAssignment(location.pathname, props.id || ''))
  createEffect(() => {
    const saved = savedData()
    if (saved) {
      setData(saved.body)
    }
  })

  const lastModified = () => {
    const saved = savedData()
    if (saved && saved.lastModified) {
      return saved.lastModified.toUTCString()
    }
  }

  const submitted = createMemo(
    () =>
      countBy(
        data.map((exercise: Exercise) => {
          const correct = exercise.feedback?.correct
          return correct === true || correct === false
        }),
      ).true,
  )

  createEffect(
    on(
      submitted,
      async () => {
        if (submitted()) {
          await upsertAssignment(location.pathname, props.id || '', data)
          revalidate(loadAssignment.keyFor(location.pathname, props.id || ''))
          revalidate(loadResults.keyFor(location.pathname, props.id || ''))
        }
      },
      { defer: true },
    ),
  )

  return (
    <>
      <Show when={lastModified()}>
        <p>Dernière sauvegarde: {lastModified()}</p>
      </Show>
      <Show when={data.length > 1}>
        <Pagination current={index()} max={data.length} onChange={setIndex} classes={classes()} />
      </Show>
      <Suspense>
        <Dynamic
          component={components[exercise().type]}
          {...exercise()}
          setter={(...args: any) => {
            // @ts-ignore
            setData(index(), ...args)
          }}
        />
      </Suspense>
    </>
  )
}
