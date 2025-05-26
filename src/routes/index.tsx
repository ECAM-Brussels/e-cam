import { createAsync, type RouteDefinition } from '@solidjs/router'
import { createSignal, For, Show, type JSXElement } from 'solid-js'
import Graph from '~/components/Graph'
import Page from '~/components/Page'
import { getSession, getUser } from '~/lib/auth/session'
import { getAssignmentList } from '~/lib/exercises/assignment'

export const route = {
  preload() {
    getAssignmentList({ courses: { some: { code: 'algebra' } } })
    getUser()
  },
} satisfies RouteDefinition

const options = {
  PM1C: "Je suis étudiant ou considère étudier à l'ECAM",
  '5MATH4': 'Je suis en 5ème secondaire',
  '6MATH4': 'Je suis en 6ème secondaire',
} as const

export default function Home() {
  const [choice, setChoice] = createSignal<keyof typeof options | undefined>(undefined)
  return (
    <Page title="Accueil" class="">
      <div class="mx-auto h-[400px] flex flex-col justify-center text-center bg-gradient-to-b from-slate-50 to-sky-50">
        <h2 class="text-3xl my-8">Que souhaitez-vous réviser?</h2>
        <div class="md:flex justify-center">
          <For each={Object.entries(options)}>
            {([course, label]) => (
              <button
                class="block rounded-full border shadow-sm p-4 m-4 bg-white hover:ring-blue-400 hover:ring-2"
                classList={{
                  'ring-sky-400 ring-2': choice() === course,
                }}
                onClick={() => setChoice(course as keyof typeof options)}
              >
                {label}
              </button>
            )}
          </For>
        </div>
      </div>
      <Show when={choice()}>
        <div class="bg-white">
          <Graph
            class="container mx-auto h-[600px]"
            query={{ courses: { some: { code: choice() } } }}
          />
        </div>
      </Show>
      <h2 class="text-4xl font-bold text-slate-800 my-8 container mx-auto">Compétences</h2>
      <Skills title="Algèbre" code="algebra" open />
      <Skills title="Analyse" code="calculus" open />
    </Page>
  )
}

function Skills(props: { code: string; title: JSXElement; open?: boolean }) {
  const data = createAsync(() => getAssignmentList({ courses: { some: { code: props.code } } }))
  const user = createAsync(() => getUser())
  return (
    <section class="even:bg-white p-8">
      <details open={props.open} class="container mx-auto">
        <summary class="font-semibold text-2xl my-4 cursor-pointer">{props.title}</summary>
        <ul class="lg:columns-2">
          <For each={data()}>
            {(assignment) => (
              <li class="flex justify-between m-2">
                <a href={assignment.url} class="hover:text-cyan-700">
                  {assignment.title}
                </a>
                <Show when={user()}>
                  <progress value={assignment.grade / 10} />
                </Show>
              </li>
            )}
          </For>
        </ul>
      </details>
    </section>
  )
}
