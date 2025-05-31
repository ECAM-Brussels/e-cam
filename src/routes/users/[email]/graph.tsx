import UserTabs from './_tabs'
import { action, RouteDefinition } from '@solidjs/router'
import { createSignal, For } from 'solid-js'
import Graph from '~/components/Graph'
import Page from '~/components/Page'
import { getUser } from '~/lib/auth/session'
import { getAssignmentGraph } from '~/lib/exercises/assignment'

export const route = {
  preload() {
    getUser()
    getAssignmentGraph(undefined, [])
  },
} satisfies RouteDefinition

const grouping = [
  { label: 'Ne pas grouper', groups: [] },
  { label: 'Grouper par année', groups: ['4MATH5', '5MATH4', '5MATH6', '6MATH4', '6MATH6'] },
  { label: 'Grouper par domaine', groups: ['algebra', 'calculus'] },
]

export default function () {
  const [groups, setGroups] = createSignal<string[]>([])
  const groupAssignments = action(async (form: FormData) => {
    const i = Number(form.get('groupBy'))
    setGroups(grouping[i].groups)
  }, 'groupAssignments')
  return (
    <Page title="Progrès">
      <UserTabs />
      <section class="bg-white rounded-xl p-4 py-8 border">
        <Graph class="min-h-96 w-full h-screen" groups={groups()} />
        <form method="post" action={groupAssignments} class="flex gap-4">
          <For each={grouping}>
            {(group, i) => (
              <button>
                <label>
                  <input type="radio" name="groupBy" value={i()} /> {group.label}
                </label>
              </button>
            )}
          </For>
        </form>
      </section>
    </Page>
  )
}
