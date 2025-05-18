import FullScreen from './FullScreen'
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { createAsync, createAsyncStore, reload } from '@solidjs/router'
import { Component, createSignal, type JSXElement, Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import ErrorBoundary from '~/components/ErrorBoundary'
import Fa from '~/components/Fa'
import Graph from '~/components/Graph'
import Pagination from '~/components/Pagination'
import Whiteboard from '~/components/Whiteboard'
import { getUser } from '~/lib/auth/session'
import { getEloDiff } from '~/lib/elo'
import {
  type Assignment,
  exercises,
  Exercise,
  saveExercise,
  type getAssignment,
  getExercises,
  getAssignmentGraph,
} from '~/lib/exercises/assignment'
import { ExerciseProps } from '~/lib/exercises/base'
import { optionsSchemaWithDefault } from '~/lib/exercises/schemas'
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
  const user = createAsync(() => getUserInfo(props.userEmail))
  const eloDiff = createAsync(() => getEloDiff(props.userEmail), { initialValue: 0 })
  const [fullScreen, setFullScreen] = createSignal(false)
  let boardContainer!: HTMLDivElement
  return (
    <ErrorBoundary>
      <h1 class="text-4xl my-4" classList={{ hidden: fullScreen() }}>
        {props.data.title}
      </h1>
      <FullScreen class="bg-slate-50 h-screen overflow-y-hidden" onChange={setFullScreen}>
        <div classList={{ 'grid grid-cols-3 p-4': fullScreen(), 'mb-8': !fullScreen() }}>
          <h2 class="text-2xl" classList={{ hidden: !fullScreen() }}>
            {props.data.title}
          </h2>
          <Navigation {...props} />
          <p class="font-semibold text-xl text-right" classList={{ hidden: !fullScreen() }}>
            ELO: {user()?.score}{' '}
            <span
              classList={{
                'text-green-800': eloDiff() > 0,
                'text-red-800': eloDiff() < 0,
              }}
            >
              ({eloDiff() > 0 && '+'}
              {eloDiff()} <Fa icon={eloDiff() > 0 ? faArrowUp : faArrowDown} />)
            </span>
          </p>
        </div>
        <div class="h-full flex gap-8">
          <div class="min-w-80" classList={{ hidden: fullScreen() }}>
            <Sidebar {...props} />
          </div>
          <div class="grow">
            <ErrorBoundary class="px-4 bg-slate-50 rounded-t-xl lg:grid lg:grid-cols-2 items-center">
              {props.children}
            </ErrorBoundary>
            <div class="h-full" ref={boardContainer}>
              <Whiteboard
                class="bg-white"
                requestFullScreen={() => {
                  setFullScreen(true)
                  const parent = boardContainer.parentNode!.parentNode!.parentNode as HTMLElement
                  parent.requestFullscreen()
                }}
                url={props.url}
                owner={props.userEmail}
                name={`${props.index}`}
                container={boardContainer}
                toolbarPosition="left"
              />
            </div>
          </div>
        </div>
      </FullScreen>
    </ErrorBoundary>
  )
}

function Sidebar(props: AssignmentProps) {
  const graphQuery = () => getGraphQuery(props.url)
  return (
    <div class="border rounded-xl bg-white p-4">
      <h3 class="text-xl">Exercices similaires</h3>
      <Graph class="min-h-96 w-full" query={graphQuery()} currentNode={props.url} rankDir="BT" />
    </div>
  )
}

function Navigation(props: AssignmentProps) {
  const body = createAsyncStore(() => getExercises(props.url, props.userEmail), {
    initialValue: [],
  })
  const realUser = createAsync(() => getUser())
  return (
    <div class="text-center">
      <Pagination
        current={props.index}
        url={(index) => {
          const parts: string[] = [props.url]
          if (props.userEmail !== realUser()?.email) {
            parts.push(props.userEmail)
          }
          if (index > 1) {
            parts.push(`${index}`)
          }
          return parts.join('/')
        }}
        max={body().length || 0}
        classList={(i) => ({
          'bg-green-100': body()[i - 1].attempts.at(0)?.correct,
          'bg-red-100': body()[i - 1].attempts.at(0)?.correct === false,
          'bg-white': body()[i - 1].attempts.at(0)?.correct === undefined,
        })}
      />
    </div>
  )
}

export default function Assignment<N, Q, A, P, F>(props: AssignmentProps) {
  const body = createAsyncStore(() => getExercises(props.url, props.userEmail), {
    initialValue: [],
  })
  const exercise = () => body().at(props.index - 1)
  const options = () =>
    optionsSchemaWithDefault.parse({
      ...props.data.options,
      ...(exercise()?.options || {}),
    })
  return (
    <Shell {...props}>
      <Show when={exercise()} fallback={<p>Loading exercise...</p>}>
        {(exercise) => (
          <Dynamic
            component={exercises[exercise().type] as Component<ExerciseProps<N, Q, A, P, F>>}
            {...(exercise() as ExerciseProps<N, Q, A, P, F>)}
            options={options()}
            onChange={async (event, action) => {
              await saveExercise(props.url, props.userEmail, props.index, event as Exercise)
              const revalidate =
                action === 'generate'
                  ? [
                      getExercises.keyFor(props.url, props.userEmail),
                      getEloDiff.key,
                      getAssignmentGraph.keyFor(getGraphQuery(props.url)),
                    ]
                  : 'nothing'
              return reload({ revalidate })
            }}
          />
        )}
      </Show>
    </Shell>
  )
}
