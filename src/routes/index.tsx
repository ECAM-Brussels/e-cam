import { createAsync, type RouteDefinition } from '@solidjs/router'
import { For, Show, type JSXElement } from 'solid-js'
import Page from '~/components/Page'
import { getUser } from '~/lib/auth/session'
import { getAssignmentList } from '~/lib/exercises/assignment'

export const route = {
  preload() {
    getAssignmentList({ courses: { some: { code: 'algebra' } } })
    getUser()
  },
} satisfies RouteDefinition

export default function Home() {
  return (
    <Page title="Accueil" class="">
      <h2 class="text-4xl font-bold text-slate-800 my-8 container mx-auto">Compétences</h2>
      <Skills title="Algèbre" code="algebra" open />
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
