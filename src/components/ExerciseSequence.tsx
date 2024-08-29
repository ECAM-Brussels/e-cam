import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { cache, createAsync, revalidate, useLocation, useSearchParams } from '@solidjs/router'
import { formatDistance } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cloneDeep, countBy, mapValues } from 'lodash-es'
import {
  Show,
  Suspense,
  createEffect,
  createMemo,
  createSignal,
  lazy,
  mergeProps,
  on,
} from 'solid-js'
import { createStore } from 'solid-js/store'
import { Dynamic } from 'solid-js/web'
import { z } from 'zod'
import Fa from '~/components/Fa'
import Pagination from '~/components/Pagination'
import { loadResults } from '~/components/Results'
import Whiteboard from '~/components/Whiteboard'
import { getUser } from '~/lib/auth/session'
import { prisma } from '~/lib/db'

const exercises = {
  CompleteSquare: () => import('~/exercises/CompleteSquare'),
  Equation: () => import('~/exercises/Equation'),
  Factor: () => import('~/exercises/Factor'),
  Simple: () => import('~/exercises/Simple'),
  System: () => import('~/exercises/System'),
}
const components = mapValues(exercises, (m) => lazy(async () => ({ default: (await m()).default })))

type ExerciseName = keyof typeof exercises
type Module<T extends ExerciseName> = Awaited<ReturnType<(typeof exercises)[T]>>
type HasGenerator<M> = M extends { generate: (...args: any) => any } ? true : false
type GeneratorParams<M> = M extends { generate: (params: infer P) => any } ? P : never
type ExerciseFromName<T extends ExerciseName> = {
  /**
   * Exercise type.
   * Often associated with a component in ~/exercises
   */
  type: T
  feedback?: {
    correct: boolean
    valid: boolean
    solution: z.infer<Module<T>['schema']>
    time: number
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

type Mode = 'static' | 'dynamic'

export type ExerciseProps = {
  /**
   * In case a page contains more than one assignment,
   * it needs to have a unique 'id'
   */
  id?: string

  /**
   * List of exercises assigned to the students.
   */
  data: Exercise[]

  /**
   * Assignment mode: 'static' (default) or 'dynamic'
   * 
   * A static assignment will exactly contain the exercises supplied in 'data'.
   * In a 'dynamic' sequence, the user is only allowed to progress
   * if they have had a streak of correct answers.
   */
  mode?: Mode

  /**
   * How many consecutive answers are required to progress
   * in 'dynamic' mode.
   * The default value is 4.
   */
  streak?: number

  /** 
   * Specify if we supply a board to the student for their working out.
   * Useful for maths exercises
   */
  whiteboard?: boolean
}

export const loadAssignment = cache(
  async (url: string, id: string = '', userEmail: string = '') => {
    'use server'
    const user = await getUser()
    if (!user || !user.email) {
      return null
    }
    if (!userEmail || !user.admin) {
      userEmail = user.email
    }
    const record = await prisma.assignment.findUnique({
      where: { url_userEmail_id: { url, userEmail, id } },
    })
    if (!record) {
      return null
    }
    return { ...record, body: JSON.parse(String(record.body)) as Exercise[] }
  },
  'loadAssignment',
)

async function upsertAssignment(url: string, id: string, userEmail: string = '', data: Exercise[]) {
  'use server'
  const user = await getUser()
  if (!user || !user.email) {
    throw new Error('Error when upserting assignment: user not logged in')
  }
  if (!userEmail || !user.admin) {
    userEmail = user.email
  }
  let body = JSON.stringify(data)
  await prisma.assignment.upsert({
    where: { url_userEmail_id: { url, userEmail, id } },
    update: { body, lastModified: new Date() },
    create: { url, userEmail, id, body },
  })
}

export default function ExerciseSequence(props: ExerciseProps) {
  props = mergeProps({ mode: 'static' as const, streak: 4 }, props)
  const user = createAsync(() => getUser())
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [index, setIndex] = createSignal(0)
  const [data, setData] = createStore<Exercise[]>(
    props.mode === 'static' ? props.data : [cloneDeep(props.data[0])],
  )
  const dynamicIndex = () => {
    if (props.mode === 'static') {
      return index()
    }
    let i = 0
    let streak = 0
    for (const exercise of data) {
      if (exercise.feedback?.correct === true) {
        streak++
        if (streak === props.streak) {
          i++
          streak = 0
        }
      } else {
        streak = 0
      }
    }
    return i
  }
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

  const savedData = createAsync(() =>
    loadAssignment(location.pathname, props.id || '', searchParams.userEmail || ''),
  )
  createEffect(() => {
    const saved = savedData()
    if (saved) {
      setData(saved.body)
    }
  })

  const lastModified = () => {
    const saved = savedData()
    if (saved && saved.lastModified) {
      return formatDistance(saved.lastModified, new Date(), { addSuffix: true, locale: fr })
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
        if (props.mode === 'dynamic') {
          setData(data.length, cloneDeep(props.data[dynamicIndex()]))
          setTimeout(() => {
            setIndex(index() + 1)
          }, 2000)
        }
        if (submitted()) {
          await upsertAssignment(
            location.pathname,
            props.id || '',
            searchParams.userEmail || '',
            data,
          )
          revalidate(loadAssignment.keyFor(location.pathname, props.id || ''))
          revalidate(loadResults.keyFor(location.pathname, props.id || ''))
        }
      },
      { defer: true },
    ),
  )

  const [showWhiteboard, setShowWhiteBoard] = createSignal(true)

  return (
    <>
      <Show when={lastModified()}>
        <p>Dernière sauvegarde {lastModified()}</p>
      </Show>
      <Show when={data.length > 1}>
        <Pagination current={index()} max={data.length} onChange={setIndex} classes={classes()} />
      </Show>
      <Suspense>
        <div class="lg:flex items-start justify-between gap-4">
          <Dynamic
            component={components[exercise().type]}
            {...exercise()}
            setter={(...args: any) => {
              // @ts-ignore
              setData(index(), ...args)
            }}
          />
          <Show when={props.whiteboard}>
            <div class="flex">
              <button
                classList={{
                  'bg-slate-100 text-slate-400 border border-e-0 px-px': showWhiteboard(),
                }}
                onClick={() => setShowWhiteBoard((prev) => !prev)}
              >
                <Show when={showWhiteboard()} fallback={<Fa icon={faChevronLeft} />}>
                  <Fa icon={faChevronRight} />
                </Show>
              </button>
              <Show when={showWhiteboard()}>
                <Whiteboard
                  class="bg-white border"
                  height={800}
                  width={700}
                  id={`exercises-${user()?.email}-${props.id}-${index()}`}
                />
              </Show>
            </div>
          </Show>
        </div>
      </Suspense>
    </>
  )
}
