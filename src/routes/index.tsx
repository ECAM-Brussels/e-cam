import { createAsync, type RouteDefinition } from '@solidjs/router'
import { For, type JSXElement } from 'solid-js'
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
    <Page title="Accueil">
      <h2 class="text-4xl font-bold text-slate-800 mb-8">Compétences</h2>
      <Skills title="Algèbre" code="algebra" />
    </Page>
  )
}

function Skills(props: { code: string; title: JSXElement }) {
  const data = createAsync(() => getAssignmentList({ courses: { some: { code: props.code } } }))
  return (
    <details open>
      <summary class="font-semibold text-2xl my-4 cursor-pointer">{props.title}</summary>
      <ul class="lg:columns-2">
        <For each={data()}>
          {(assignment) => (
            <li class="flex justify-between m-2">
              <a href={assignment.url} class="hover:text-cyan-700">
                {assignment.title}
              </a>
            </li>
          )}
        </For>
      </ul>
    </details>
  )
}
