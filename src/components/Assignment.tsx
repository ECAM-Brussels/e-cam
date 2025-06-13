import {
  faArrowDown,
  faArrowUp,
  faUpRightAndDownLeftFromCenter,
  faWindowMinimize,
} from '@fortawesome/free-solid-svg-icons'
import { createAsync, createAsyncStore, reload } from '@solidjs/router'
import { Component, createEffect, createSignal, type JSXElement, Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import ErrorBoundary from '~/components/ErrorBoundary'
import Fa from '~/components/Fa'
import FullScreen from '~/components/FullScreen'
import Graph from '~/components/Graph'
import Pagination from '~/components/Pagination'
import Whiteboard from '~/components/Whiteboard'
import Youtube from '~/components/Youtube'
import { getUser } from '~/lib/auth/session'
import { getEloDiff } from '~/lib/elo'
import {
  type Assignment,
  exercises,
  Exercise,
  saveExercise,
  type getAssignment,
  getExercise,
  getPaginationInfo,
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
  const [zoom, setZoom] = createSignal(1)
  let boardContainer!: HTMLDivElement

  // Whiteboard doesn't shrink properly when leaving full screen
  createEffect(() => {
    if (!fullScreen() && boardContainer) {
      boardContainer.style.width = '0'
      setTimeout(() => {
        boardContainer.style.width = '100%'
      }, 20)
    }
  })

  return (
    <ErrorBoundary>
      <h1 class="text-4xl my-4" classList={{ hidden: fullScreen() }}>
        {props.data.page.title}
      </h1>
      <FullScreen class="bg-slate-50 h-screen w-full overflow-hidden" onChange={setFullScreen}>
        <div classList={{ 'grid grid-cols-3 p-4': fullScreen(), 'mb-8': !fullScreen() }}>
          <h2 class="text-2xl" classList={{ hidden: !fullScreen() }}>
            {props.data.page.title}
          </h2>
          <Navigation {...props} />
          <Elo
            class="font-semibold text-xl text-right"
            classList={{ hidden: !fullScreen() }}
            elo={user()?.score}
            eloDiff={eloDiff()}
          />
        </div>
        <div class="h-full max-w-full lg:flex flex-row-reverse gap-8">
          <div class="lg:w-[392px]" classList={{ hidden: fullScreen() }}>
            <Sidebar fullScreen={fullScreen()} {...props} elo={user()?.score} eloDiff={eloDiff()} />
          </div>
          <div class="grow">
            <ErrorBoundary class="px-4 bg-slate-50 rounded-t-xl">{props.children}</ErrorBoundary>
            <div class="h-full border max-w-full relative" ref={boardContainer}>
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
            <Show when={fullScreen() && props.data.video}>
              {(src) => (
                <div class="fixed bottom-5 right-5 mb-4 z-50">
                  <p class="flex gap-4 mb-2 justify-end">
                    <Show when={zoom() > 0}>
                      <button onClick={() => setZoom(0)}>
                        <Fa icon={faWindowMinimize} />
                      </button>
                    </Show>
                    <button onClick={() => setZoom(zoom() !== 1 ? 1 : 2)}>
                      <Fa
                        icon={
                          zoom() !== 1
                            ? faUpRightAndDownLeftFromCenter
                            : faUpRightAndDownLeftFromCenter
                        }
                      />
                    </button>
                  </p>
                  <Show when={zoom() > 0}>
                    <Youtube src={src()} zoom={zoom()} />
                  </Show>
                </div>
              )}
            </Show>
          </div>
        </div>
      </FullScreen>
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

function Sidebar(props: AssignmentProps & { eloDiff: number; elo?: number; fullScreen: boolean }) {
  const graphQuery = () => getGraphQuery(props.url)
  return (
    <>
      <Show when={!props.fullScreen && props.data.video}>
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
  const pagination = createAsyncStore(() => getPaginationInfo(props.url, props.userEmail), {
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
        max={pagination().length || 0}
        classList={(i) => ({
          'bg-green-100': pagination()[i - 1] === true,
          'bg-red-100': pagination()[i - 1] === false,
          'bg-white': pagination()[i - 1] === null,
        })}
      />
    </div>
  )
}

export function ExerciseUI<N, Q, A, P, F>(props: Exercise) {
  return (
    <Dynamic
      component={
        exercises[props.type as keyof typeof exercises] as Component<ExerciseProps<N, Q, A, P, F>>
      }
      {...(props as ExerciseProps<N, Q, A, P, F>)}
    />
  )
}

export default function Assignment<N, Q, A, P, F>(props: AssignmentProps) {
  const exercise = createAsyncStore(() => getExercise(props.url, props.userEmail, props.index))
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
                      getExercise.keyFor(props.url, props.userEmail, props.index),
                      getPaginationInfo.keyFor(props.url, props.userEmail),
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
