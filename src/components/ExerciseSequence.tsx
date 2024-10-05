import { deleteAssignment, loadAssignment, upsertAssignment } from './ExerciseSequence.server'
import { faChevronLeft, faChevronRight, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Title } from '@solidjs/meta'
import { createAsync, revalidate, useLocation, useSearchParams } from '@solidjs/router'
import { formatDistance } from 'date-fns'
import { fr } from 'date-fns/locale'
import dedent from 'dedent-js'
import { cloneDeep, mapValues, throttle } from 'lodash-es'
import { Show, Suspense, createEffect, createSignal, lazy, mergeProps, onMount } from 'solid-js'
import { createStore, unwrap } from 'solid-js/store'
import { Dynamic } from 'solid-js/web'
import { z } from 'zod'
import { type Feedback } from '~/components/ExerciseBase'
import Fa from '~/components/Fa'
import Markdown from '~/components/Markdown'
import Pagination from '~/components/Pagination'
import { loadResults } from '~/components/Results'
import Whiteboard from '~/components/Whiteboard'
import { getUser } from '~/lib/auth/session'

const exercises = {
  CompleteSquare: () => import('~/exercises/CompleteSquare'),
  ComplexPolar: () => import('~/exercises/ComplexPolar'),
  ConicSection: () => import('~/exercises/ConicSection'),
  CrossProduct: () => import('~/exercises/CrossProduct'),
  Differentiate: () => import('~/exercises/Differentiate'),
  Equation: () => import('~/exercises/Equation'),
  Factor: () => import('~/exercises/Factor'),
  Limit: () => import('~/exercises/Limit'),
  Pythagoras: () => import('~/exercises/Pythagoras'),
  Python: () => import('~/exercises/Python'),
  Simple: () => import('~/exercises/Simple'),
  System: () => import('~/exercises/System'),
  TrigonometricValues: () => import('~/exercises/TrigonometricValues'),
  VectorAngle: () => import('~/exercises/VectorAngle'),
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
  feedback?: Feedback<z.infer<Module<T>['schema']>>
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
   * Specify which exercise to show first.
   * The numbering starts at 0 (first exercise),
   * which is the default value.
   */
  index?: number

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

  onIndexChange?: (newIndex: number) => void

  /**
   * How many consecutive answers are required to progress
   * in 'dynamic' mode.
   * The default value is 4.
   */
  streak?: number

  /**
   * Title of the sequence, will be displayed to the user
   */
  title?: string

  /**
   * Description of the sequence, in markdown
   */
  description?: string

  /**
   * Specify if we supply a board to the student for their working out.
   * Useful for maths exercises
   */
  whiteboard?: boolean

  /**
   * Specify how many times a student can attempt a question
   * Set to true to allow infinitely many attempts
   */
  allowReattempts?: number | boolean
}

export default function ExerciseSequence(props: ExerciseProps) {
  props = mergeProps({ mode: 'static' as const, streak: 4 }, props)
  const user = createAsync(() => getUser())
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const [index, setIndex] = createSignal(props.index || 0)
  createEffect(() => props.onIndexChange?.(index()))

  const [data, setData] = createStore<Exercise[]>(
    props.mode === 'static' ? cloneDeep(props.data) : [cloneDeep(props.data[0])],
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
  const exercise = () => data[Math.min(index(), data.length - 1)]
  const finished = () => {
    if (props.mode === 'static') {
      return index() === props.data.length - 1 && exercise().feedback?.correct !== undefined
    } else {
      return dynamicIndex() > props.data.length - 1
    }
  }
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

  const [showWhiteboard, setShowWhiteBoard] = createSignal<boolean | null>(null)
  onMount(() => {
    if (showWhiteboard() === null) {
      if (localStorage.getItem('showWhiteboard')) {
        setShowWhiteBoard(localStorage.getItem('showWhiteboard') === 'true')
      } else {
        setShowWhiteBoard(true)
      }
    }
  })
  createEffect(() => {
    localStorage.setItem('showWhiteboard', showWhiteboard() ? 'true' : 'false')
  })

  const save = throttle(
    async () => {
      const url = location.pathname
      const exercise = cloneDeep(unwrap(data))
      setTimeout(async () => {
        await upsertAssignment(
          url,
          props.id || '',
          searchParams.userEmail || '',
          exercise,
          finished(),
        )
        revalidate(loadAssignment.keyFor(url, props.id || '', searchParams.userEmail || ''))
        revalidate(loadResults.keyFor(url, props.id || ''))
      })
    },
    200,
    { leading: false, trailing: true },
  )

  return (
    <>
      <div class="flex justify-between">
        <Show when={lastModified()}>
          <p>Dernière sauvegarde {lastModified()}</p>
          <Show when={user()?.admin}>
            <button
              class="border border-red-900 rounded px-2 py-1 text-red-900"
              onClick={async () => {
                setIndex(0)
                setData(
                  props.mode === 'static' ? cloneDeep(props.data) : [cloneDeep(props.data[0])],
                )
                setTimeout(async () => {
                  await deleteAssignment(
                    location.pathname,
                    props.id || '',
                    searchParams.userEmail || '',
                  )
                  revalidate(
                    loadAssignment.keyFor(
                      location.pathname,
                      props.id || '',
                      searchParams.userEmail || '',
                    ),
                  )
                  revalidate(loadResults.keyFor(location.pathname, props.id || ''))
                })
              }}
            >
              <Fa icon={faTrash} /> Supprimer le devoir
            </button>
          </Show>
        </Show>
      </div>
      <Show when={data.length > 1}>
        <Pagination current={index()} max={data.length} onChange={setIndex} classes={classes()} />
      </Show>
      <Show when={props.title}>
        <Title>{props.title}</Title>
        <h1 class="text-3xl my-4">{props.title}</h1>
      </Show>
      <Show when={props.description}>
        <div class="my-4">
          <Markdown value={dedent(props.description || '')} />
        </div>
      </Show>
      <Suspense>
        <div class="xl:flex items-start justify-between gap-4">
          <div class="w-full">
            <Dynamic
              component={components[exercise().type]}
              initialOptions={{
                mark: false,
                readOnly: false,
                remainingAttempts: props.allowReattempts || 1,
                showSolution: false,
              }}
              {...exercise()}
              onGenerate={() => {
                save()
              }}
              onSubmit={() => {
                if (props.mode === 'dynamic' && index() === data.length - 1) {
                  setData(data.length, cloneDeep(props.data[dynamicIndex()]))
                }
                save()
              }}
              onMarked={save}
              setter={(...args: any) => {
                // @ts-ignore
                setData(index(), ...args)
              }}
            />
            <Show when={exercise().feedback?.correct !== undefined && index() < data.length - 1}>
              <div class="text-right">
                <button
                  class="bg-green-900 text-white rounded-xl py-2 px-4"
                  onClick={() => setIndex((prev) => prev + 1)}
                >
                  Question suivante <Fa icon={faChevronRight} />
                </button>
              </div>
            </Show>
          </div>
          <Show when={props.whiteboard}>
            <div class="flex">
              <button
                classList={{
                  'bg-slate-100 text-slate-400 border border-e-0 px-px': showWhiteboard() === true,
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
