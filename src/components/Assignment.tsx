import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { createAsync, json, reload } from '@solidjs/router'
import { Component, type JSXElement, Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import Calculator from '~/components/Calculator'
import ErrorBoundary from '~/components/ErrorBoundary'
import Fa from '~/components/Fa'
import Graph from '~/components/Graph'
import Markdown from '~/components/Markdown'
import Pagination from '~/components/Pagination'
import Suspense from '~/components/Suspense'
import Whiteboard from '~/components/Whiteboard'
import Youtube from '~/components/Youtube'
import { getUser } from '~/lib/auth/session'
import { getEloDiff } from '~/lib/elo'
import {
  type Assignment,
  exercises,
  type Exercise,
  saveExercise,
  type getAssignment,
  getExercise,
  getPaginationInfo,
} from '~/lib/exercises/assignment'
import { optionsSchema } from '~/lib/exercises/schemas'
import { getUserInfo } from '~/lib/user'

type AssignmentProps = {
  url: string
  userEmail: string
  index: number
  data: Awaited<ReturnType<typeof getAssignment>>
}

export const getGraphQuery = (url: string) => ({
  OR: [{ url }, { prerequisites: { some: { url } } }, { requiredBy: { some: { url } } }],
})

function Shell(props: AssignmentProps & { children: JSXElement }) {
  const exercise = createAsync(() => getExercise(props.url, props.userEmail, props.index))
  const options = () =>
    optionsSchema.parse({
      ...props.data.options,
      ...(exercise()?.options || {}),
    })
  const user = createAsync(() => getUserInfo(props.userEmail))
  const currentUser = createAsync(() => getUser())
  const eloDiff = createAsync(() => getEloDiff(props.url, props.userEmail, props.index), {
    initialValue: 0,
  })

  return (
    <ErrorBoundary>
      <div class="flex items-center justify-between text-small text-slate-500">
        <Show when={currentUser()?.role === 'TEACHER' || user()?.role === 'ADMIN'}>
          <a href={`/results${props.url}`}>Voir les résultats</a>
          <Show when={props.data.score}>
            <p class="text-lg font-bold">ELO: {props.data.score}</p>
          </Show>
        </Show>
      </div>
      <div class="mb-8">
        <Navigation {...props} />
      </div>
      <Markdown value={props.data.page.description ?? ''} />
      <div class="h-full max-w-full lg:flex flex-row-reverse gap-8">
        <Show when={options().showSidebar}>
          <div class="lg:w-[392px]">
            <Sidebar {...props} elo={user()?.score} eloDiff={eloDiff()} />
          </div>
        </Show>
        <div class="grow max-w-full overflow-hidden">
          <ErrorBoundary class="px-4 bg-slate-50 rounded-t-xl">
            <Suspense>{props.children}</Suspense>
          </ErrorBoundary>
          <Show when={options().calculator}>
            <Calculator />
          </Show>
          <Show when={options().whiteboard}>
            <div class="h-full border max-w-full relative overflow-hidden">
              <Whiteboard
                class="bg-white"
                width={1920}
                height={1080}
                url={props.url}
                owner={props.userEmail}
                name={`${props.index}`}
                toolbarPosition="left"
              />
            </div>
          </Show>
        </div>
      </div>
    </ErrorBoundary>
  )
}

function Elo(props: {
  class?: string
  classList?: { [key: string]: boolean }
  elo?: number
  eloDiff: number
}) {
  return (
    <p class={props.class} classList={props.classList}>
      ELO: {props.elo}{' '}
      <span
        classList={{
          'text-green-800': props.eloDiff > 0,
          'text-red-800': props.eloDiff < 0,
        }}
      >
        ({props.eloDiff > 0 && '+'}
        {props.eloDiff} <Fa icon={props.eloDiff > 0 ? faArrowUp : faArrowDown} />)
      </span>
    </p>
  )
}

function Sidebar(props: AssignmentProps & { eloDiff: number; elo?: number }) {
  const graphQuery = () => getGraphQuery(props.url)
  return (
    <>
      <Show when={props.data.video}>
        {(src) => <Youtube class="mb-4" src={src()} zoom={0.7} />}
      </Show>
      <Elo
        class="bg-white border rounded-xl mb-4 p-4 text-xl font-bold"
        elo={props.elo}
        eloDiff={props.eloDiff}
      />
      <div class="border rounded-xl bg-white p-4">
        <h3 class="text-xl font-semibold">Exercices voisins</h3>
        <Graph class="min-h-96 w-full" query={graphQuery()} currentNode={props.url} rankDir="BT" />
      </div>
    </>
  )
}

function Navigation(props: AssignmentProps) {
  const pagination = createAsync(() => getPaginationInfo(props.url, props.userEmail), {
    initialValue: [],
  })
  const realUser = createAsync(() => getUser())
  const options = () => optionsSchema.parse({ ...props.data.options })
  const showFeedback = () => {
    if (options().showFeedback === true) return true
    if (options().showFeedback === false) return false
    return new Date() >= options().showFeedback
  }
  return (
    <div class="text-center">
      <Pagination
        current={props.index}
        url={(index) => {
          const parts: string[] = [props.url]
          const params: { [key: string]: string } = {}
          if (props.userEmail !== realUser()?.email) params.userEmail = props.userEmail
          const query = new URLSearchParams(params).toString()
          if (index > 1) {
            parts.push(`${index}`)
          }
          return parts.join('/') + (query ? `?${query}` : '')
        }}
        max={pagination().length || 0}
        classList={(i) => ({
          'bg-green-100': pagination()[i - 1] === true && showFeedback(),
          'bg-red-100': pagination()[i - 1] === false && showFeedback(),
          'bg-slate-200': pagination()[i - 1] !== null && !showFeedback(),
          'bg-white': pagination()[i - 1] === null,
        })}
      />
    </div>
  )
}

type ExerciseUIProps = Exercise & {
  onChange?: (
    exercise: Exercise,
    action: 'generate' | 'submit' | 'remark',
  ) => Promise<unknown> | void
}

export function ExerciseUI(props: ExerciseUIProps) {
  const options = () => optionsSchema.parse({ ...props.options })
  return (
    <Dynamic
      component={exercises[props.type] as Component<Exercise>}
      {...props}
      options={options()}
    />
  )
}

export default function Assignment(props: AssignmentProps) {
  const exercise = createAsync(() => getExercise(props.url, props.userEmail, props.index))
  const key = () => [props.url, props.userEmail, props.index] as const
  const options = () =>
    optionsSchema.parse({
      ...props.data.options,
      ...(exercise()?.options || {}),
    })
  return (
    <Shell {...props}>
      <Show when={exercise()} fallback={<p>Loading exercise...</p>}>
        {(exercise) => (
          <ExerciseUI
            {...exercise()}
            options={options()}
            onChange={async (event, action) => {
              await saveExercise(...key(), event as Exercise, action)
              if (action === 'submit') reload({ revalidate: 'nothing' })
              return json(null, { revalidate: getExercise.keyFor(...key()) })
            }}
          />
        )}
      </Show>
    </Shell>
  )
}
